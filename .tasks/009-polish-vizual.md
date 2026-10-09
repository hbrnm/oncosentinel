# 009 — Audit vizual și polish

**Stare:** gata
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
| 3 | Animații: ferestre, bara de jos, bifarea dozei, cascadă, stare, plantă; `prefers-reduced-motion` | gata | (vezi PR) |

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

### Etapa 3 (2026-10-09)
- Ferestrele: `animate-modal` pe toate fundalurile `fixed inset-0` (inclusiv MilestoneModal); fundalul apare (200 ms), fereastra urcă de jos (280 ms).
- Bara de jos: un singur cerc (`nav-indicator`) alunecă între taburi (300 ms); ascuns pe Drumul tratamentului.
- Astăzi: cascadă scurtă (`animate-cascade`, 40 ms între carduri, fără ferestrele din pagină); planta se leagănă (`animate-sway`, 9 s); starea aleasă crește la `scale-110`; la bifare „Luat azi” crește ușor (`animate-pop`) și bifa se desenează (`animate-draw-check`), doar după bifarea de acum; confetti rămâne, cu `disableForReducedMotion`.
- `@media (prefers-reduced-motion: reduce)`: animațiile și tranzițiile reduse la 0,01 ms.
- Nicio animație cu `forwards`/`both`; „backwards” doar pe cascadă și pe bifă (ține starea inițială cât așteaptă).
- Verificat în browser la 390px: cercul aliniat pe icon, fereastra din Tratament centrată pe ecran după derulare, fără overflow.
- Teste: „Mișcarea discretă” și „Astăzi: cascadă, plantă și bifarea dozei” în `src/test/polish-vizual.test.tsx`. `npm test` 255/255, `npm run build` ok.

## Următorul pas
Sarcina e încheiată.
