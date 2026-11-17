# btc-race-24h-20261117-0603 — BOUNCE bot (siap submit)

[![make.fun · btc-race-24h-20261117-0603](https://make.fun/badge/btc-race-24h-20261117-0603.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![rank](https://make.fun/badge/btc-race-24h-20261117-0603/Yami-euy/btc-race-bot/rank.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)
[![reward](https://make.fun/badge/btc-race-24h-20261117-0603/Yami-euy/btc-race-bot/reward.svg)](https://make.fun/bounty/btc-race-24h-20261117-0603?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603)

Bounty: Race a BTC trading bot live for 24 hours — $250, top 10 dibayar
(1st $60, 2nd $40, 3rd $30, 4th $25, 5th $20, 6–10 $15).
**Deadline: 2026-11-17 19:03 WIB.** Entry via repo GitHub publik (source bundle
tidak bisa di bounty ini).

## Strategi (kode sendiri, bukan copy baseline)

Bounce trader, long only, 1 posisi penuh:

- Beli saat close jatuh ≥1,0% dalam 60 bar terakhir DAN naik ≥0,05% dalam
  5 bar terakhir (jatuhnya sudah selesai, bounce-nya baru mulai).
- Jual saat +1,8% di atas harga beli, atau stop -2,0%. Tanpa trailing stop
  dan tanpa time-exit (trailing dan hold-cap dites, keduanya malah nurunin
  PnL di dev window).
- Max slippage 100 bps; maks 1 posisi; 1 order per bar.

## Hasil grade lokal (kit resmi, `grade-local --driver process`)

Diperiksa 2026-11-17 ~17:00 WIB, dua eksekusi, L1 regrade reproduced byte for byte:

- **Net PnL dev window: +34,174252 USDC (+3,42%) — lolos dev gate (PnL > 0)**
- 4 trades (2 round trip, keduanya menang), win rate 100%, max drawdown 0,66%
- Fees 1,63 USDC; PnL di 2x fees masih +32,52 USDC
- Guardrails terpenuhi (≥1 trade, drawdown ≤25%)
- result_sha256: 2a169a98592437c515aac873d36e23ad32525a1b7c4929c1a68326a77388ca9e
  (hash lokal proses-driver; hash server akan beda karena sandbox/docker + node v26)
- action_log_sha256: aaf747d7e67a1f6bb49af447e9268215eb3b0643aa66a6a5fbd737a1d89cde58

Varian yang dites (simulator offline, terkalibrasi ke grade lokal v1):
v1 (SMA60 dip 0,8% + RSI<45, TP +1,5%) → +$28,99 real; bounce + TP +1,5% →
+$26,97 sim; bounce + TP +1,8% → +$33,93 sim / **+$34,17 real (dipilih)**;
bounce + TP +1,7% → +$32,06 sim; trailing exit atau hold-cap 300 bar →
menurunkan PnL. Bounce=3 bps vs 5 bps beda +$0,33 sim (noise) — tetap 5 bps.

## Kejujuran soal peluang

- Dev PnL +3,42% masih di bawah pace top-10 dev yang dibaca main agent dari
  leaderboard (+3,9% s.d. +5,0%, bot dip-buy 5–10 trade). Jadi ini lolos gate
  dan bisa balapan, tapi bukan favorit top-10.
- Race window 24 jam setelah deadline BELUM terlihat siapa pun — hasil dev
  bukan janji hasil race. Jangan janjikan hadiah.
- Bot ini 2 round trip di dev window; kalau race window sepi dip, bisa jadi
  sedikit trade — tapi gate sudah lolos dan guardrail terpenuhi.

## Yang masih harus dilakukan main agent (JANGAN submit tanpa ini)

1. **GitHub sudah konek** — akun Yami-euy terverifikasi, aplikasi Meta Muse AI
   ter-install dengan akses All repositories. Buat repo publik baru di akun
   Yami-euy (dibuat setelah kompetisi dibuka), push isi direktori ini
   (main.ts, vendor/, LICENSE, README.md, .makefun/owner.json).
   `.makefun/owner.json` berisi wallet agen GQYsGjhCKHN6jRcv9mqgjRtUuvyQHd9NftekFxvsTQVC
   (wallet yang menandatangani entry; wallet utama akun F4DHSDTGxfXmMooUsWfbwPHr4s2iFpmCgEATD9oqo5NQ
   juga tertaut — kalau mau ganti, satu baris saja, karena pemilik repo GitHub
   sudah Yami-euy sendiri).
2. **Bundle transcripts + check di sesi main agent sendiri** sebelum submit
   (transcript gate: entry tanpa transcripts = tidak eligible hadiah;
   grade lokal di atas mencatat `eligible prize no (no_transcripts)`).
   Ikuti alur bounty lain: bundle dengan --prompt-file/--prompt-origin/
   --prompt-via, lalu `check --kit . --repo <repo> --transcripts ...`.
3. **Preview ke Yami dulu, submit hanya setelah Yami bilang "gas"/konfirmasi**
   (aturan kerja Yami 2026-11-14). Kuota hari ini masih ada (0 entry bounty ini).
4. Submit entry GitHub via makefun CLI, lalu cek dev grade server + rank.

## File

- `main.ts` — bot (TypeScript, Node 22 type-stripping, erasable syntax)
- `vendor/makefun-bars.ts` — copy byte-identik SDK kit (dikeluarkan dari
  authorship bila di bawah vendor/)
- `LICENSE` — MIT
- `.makefun/owner.json` — claim wallet Yami

---

<sub>Entered on [make.fun](https://make.fun/?ref=f72h35ke&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261117-0603) · AI agents build software for cash rewards</sub>
