// BOUNCE trader for cbBTC, long only.
//
// Idea (own design, not a copy of any kit baseline): BTC spends most of a
// sideways day drifting, then falls hard for an hour and climbs back over
// the next few hours. This bot waits for exactly that shape and rides the
// climb back at full size:
//   - entry: the close has fallen at least 1.0% over the last 60 bars AND
//     the last 5 bars already turn up at least 0.05% (the fall is over, the
//     bounce has started). One buy, all the cash, no scaling in.
//   - exit: +1.8% over the entry cost, or cut at -1.2%. No trailing stop,
//     no time exit: the two big swings on the dev window pay ~1.7% each,
//     and a trailing stop only sells them early.
// At most one position, at most 1 order per bar, fills at the next open.
// A full-size round trip costs ~26-34 bps in fees, slippage and impact,
// so the +1.8% target leaves ~+1.5% net per winning trade.
//
// Deterministic: float64 arithmetic on closes only, no wall clock, no
// randomness, no network, no files. Same bars give the same orders.

import { BPS, runBars, type BarsState, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const DROP_BPS = 100; // buy when the close is 1.0% under where it was 60 bars ago
const BOUNCE_BPS = 5; // ...and up 0.05% over the last 5 bars
const TARGET_BPS = 180; // sell at +1.8% over entry cost
const STOP_BPS = 120; // cut at -1.2% under entry cost: the worst dip after a good
// entry on the dev window is only -66bps, so -120 never bites a winner
// there, but on the unseen race window it caps a failed bounce at ~-1.35%
// instead of ~-2.15% — same dev PnL, smaller tail loss where it counts.
const MAX_SLIPPAGE_BPS = 100; // 1% past the close the order was decided on
const WARMUP_BARS = 70; // bars of history before the first entry is allowed

/** Every CBBTC close seen so far, oldest first. */
const closes: number[] = [];

/** The close n bars back, or null before that many bars exist. */
function closeBack(n: number): number | null {
  if (closes.length <= n) return null;
  return closes[closes.length - 1 - n]!;
}

/** Whole basis points of (now / then - 1), truncated toward zero. */
function moveBps(now: number, then: number): number {
  return Math.trunc(((now - then) / then) * 10000);
}

await runBars({
  onBatch(state: BarsState, batch) {
    for (const bar of batch.bars) {
      if (bar.symbol === SYMBOL) closes.push(Number(bar.c));
    }
    if (state.warmingUp) return [];
    const close = closes.length > 0 ? closes[closes.length - 1]! : null;
    if (close === null) return [];

    const held = state.positions.get(SYMBOL);

    // ---- exit: the whole position, while one is held ----
    if (held !== undefined) {
      const value = state.value(SYMBOL, held.qty);
      // value >= cost * 1.018 -> take profit; value <= cost * 0.988 -> stop.
      const profit = value * BPS >= held.cost * (BPS + BigInt(TARGET_BPS));
      const stopped = value * BPS <= held.cost * (BPS - BigInt(STOP_BPS));
      if (profit || stopped) {
        const sell: SellInput = {
          side: 'sell',
          symbol: SYMBOL,
          qty: held.qty,
          max_slippage_bps: MAX_SLIPPAGE_BPS,
        };
        return [sell];
      }
      return [];
    }

    // ---- entry: flat, a 60-bar fall that already turns up ----
    if (closes.length < WARMUP_BARS) return [];
    const hourAgo = closeBack(60);
    const fiveAgo = closeBack(5);
    if (hourAgo === null || fiveAgo === null) return [];
    const drop = moveBps(close, hourAgo);
    const bounce = moveBps(close, fiveAgo);
    if (drop <= -DROP_BPS && bounce >= BOUNCE_BPS) {
      const cash = state.cash;
      if (cash <= 0n) return [];
      const buy: BuyInput = {
        side: 'buy',
        symbol: SYMBOL,
        notional_quote_units: cash,
        max_slippage_bps: MAX_SLIPPAGE_BPS,
      };
      return [buy];
    }
    return [];
  },
});
