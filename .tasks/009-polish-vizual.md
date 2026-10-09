# 009 — Audit vizual și polish

**Stare:** în lucru
**Ramura:** claude/polish-vizual

## Scop
Audit vizual al aplicației și un polish de aspect, cu animații și micro-interacțiuni blânde. Deciziile proprietarei (2026-10-09, chestionar):
- reparații: butonul de liniște nu mai acoperă conținutul; titlurile din Jurnal și Ghiduri pe Lora; „Foarte bine” pe un rând; griurile reci → tonuri calde; fereastra de bun venit în stilul aplicației (fără 🌸); majuscule doar la primul cuvânt în Jurnal;
- calendarul dozelor: zilele nebifate în piersică moale, cu cifra zilei, legenda „Nebifat” (nu roșu cu X);
- mișcare **discretă** (200–300 ms), oprită la „Reduce mișcarea”;
- interacțiuni: ferestrele urcă de jos + cercul tabului alunecă în bara de jos; bifarea dozei animată (bifa se desenează, cardul trece în „Luat azi”, confetti rămâne); cascadă scurtă pe Astăzi + starea aleasă crește puțin; planta de pe Astăzi se leagănă foarte încet.

Atenție (din #42): niciun `transform` rămas pe tab sau pe părinții ferestrelor (`forwards`/`both` interzise pe animațiile taburilor), altfel ferestrele `fixed` rămân prinse în tab.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Reparații: buton liniște, Lora, „Foarte bine”, bun venit, majuscule, calendar piersică | gata | (vezi PR) |
| 2 | Griurile Tailwind (`text-gray-*`, `bg-gray-*`, `stone-*`) → `ink`, `ink-soft`, `warmborder`, `cream-deep` | de făcut | |
| 3 | Animații: ferestre, bara de jos, bifarea dozei, cascadă, stare, plantă; `prefers-reduced-motion` | de făcut | |

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- Butonul „Am nevoie de liniște acum” se ascunde cât derulezi în jos și revine când urci sau la focus; are inel crem ca să se despartă de conținut.
- `font-heading` (clasă inexistentă) → `font-serif` în Jurnal și Ghiduri.
- „Cum te simți azi?” pe Astăzi: butoanele aliniate sus, „Foarte bine” pe un rând.
- Fereastra de bun venit: titluri Lora, butoane `bg-sage` (inclusiv ultimul, care era verde smarald), fără 🌸.
- Jurnal: „Formular detaliat simptome”, „Fișă frigider”, „Raport oncolog”.
- Calendar: zile nebifate `bg-peach-100` + cifra zilei; legenda „Luat / Nebifat / Programat”; titlul celulei „Doză nebifată…”.
- Test: `src/test/polish-vizual.test.tsx`. `npm test` 247/247, `npm run build` ok.

## Următorul pas
Etapa 2, într-o sesiune nouă: înlocuirea mecanică a griurilor (delegabilă agentului `executie`, câte un grup de fișiere), cu capturi înainte/după pe 2–3 ecrane.
