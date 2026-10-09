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
| 2 | Griurile Tailwind (`text-gray-*`, `bg-gray-*`, `stone-*`) → `ink`, `ink-soft`, `warmborder`, `cream-deep` | gata | (vezi PR) |
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

### Etapa 2 (2026-10-09)
- Înlocuire mecanică în 21 de componente (246 de clase), doar clasele fără `dark:` (modul întunecat e dezactivat, clasele `dark:` au rămas neatinse):
  - text `gray-900/800/700`, `stone-700` → `text-ink`; `gray-600/500` → `text-ink-soft`; `gray-400` → `text-ink-soft/70`; `gray-300` → `text-ink-soft/50` (păstrează ierarhia);
  - `border-gray-200/100`, `border-stone-200` → `border-warmborder` (opacitățile păstrate);
  - `bg-gray-50`, `bg-stone-50` → `bg-cream`; `bg-gray-100`, `bg-stone-100` → `bg-cream-deep`; `bg-gray-200` → `bg-warmborder`; la fel cu `hover:`, `group-hover:`, `placeholder:`.
- Capturi înainte/după (Astăzi, Jurnal, Profil): schimbare subtilă, tonuri calde, fără probleme de aranjare.
- Test: „Griurile reci” în `src/test/polish-vizual.test.tsx` (nicio clasă gri/stone fără `dark:` în `src/components`). `npm test` 248/248, `npm run build` ok.

## Următorul pas
Etapa 3, într-o sesiune nouă: animațiile (ferestre, bara de jos, bifarea dozei, cascadă, stare, plantă) cu `prefers-reduced-motion`; atenție la regula din #42 (fără `forwards`/`both` pe taburi).
