# 010 — Accesibilitate: contrast, tastatură, „Text mare”

**Stare:** gata
**Ramura:** claude/accesibilitate-etapa-1 (etapa 1), claude/continuă-sarcina-010-339zwu (etapa 2)

## Scop
O verificare de sănătate (2026-10-09), cerută de proprietară: dependențe, Supabase, securitatea codului, accesibilitate. Din raport, proprietara a ales: contrastul, cardurile apăsabile de la tastatură, ordinea titlurilor (etapa 1) și „Text mare” care mărește tot textul (etapa 2). Antetele de securitate pe Vercel nu se fac.

Ce a ieșit curat: `npm audit` fără vulnerabilități; nicio cheie secretă și niciun `innerHTML`/`eval` în `src/`; fără overflow la 390px (normal și text mare); migrațiile au RLS pe fiecare tabel. Aplicația nu folosește Supabase acum (datele stau pe telefon). Proiectul Supabase din cont e „CoreFit” (altă aplicație), neatins.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Contrast, carduri apăsabile de la tastatură, ordinea titlurilor | gata | (vezi PR) |
| 2 | „Text mare” pe tot: `text-[Npx]` (~290 de locuri) → mărimi relative, ca să crească cu `html.font-large` (118%) | gata | (vezi PR) |

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- Scanare axe-core (WCAG 2 A/AA + bune practici) pe cele 5 taburi, la 390px, cu text normal și mare: înainte, contrast slab pe toate taburile, un buton fără nume în Jurnal, două sărituri de titlu; după, 0 probleme.
- `text-ink-soft/70` și `/80` (3,1:1 pe alb) → `text-ink-soft` (6:1), inclusiv etichetele barei de jos; placeholder-ul rămâne. Iconițele de ștergere din „Pentru medic”: `/50` → `ink-soft`.
- Textul roz pe roz (`blush-deep`, 2,1:1) → `petal-700` (token existent): citatul de pe Astăzi, „Cum te simți azi?” din Jurnal, bannerul controlului (inclusiv X-ul). Butonul „Salvează în jurnal”: `petal-600` → `petal-700` (alb pe el 4,2 → peste 4,5).
- „Formular detaliat simptome” e un `<button>` cu `aria-expanded`; chevronul, decorativ.
- `src/lib/clickable.ts`: cardurile apăsabile care conțin titluri (control, citat, ghid, noutăți, banner, profil din antet) au `role="button"`, `tabIndex` și Enter/Spațiu. În Cronologie, titlul etapei e un `<button aria-expanded>`; „Modifică” și „Șterge” rămân butoane separate (un card `role=button` le-ar fi ascuns de cititorul de ecran).
- Titluri: numele medicamentului (h3 → h2) și data controlului (h4 → h3) pe Astăzi; ghidurile (h3 → h2) în Ghiduri.
- Agentul `verificare`: nimic blocant; reparate `clickable` pus din greșeală pe un `<button>` nativ („Vezi toate ghidurile”) și pe `AppointmentBanner`, hover-ul fără efect de la X-ul cardului de copie, Cronologia.
- Test: `src/test/accesibilitate.test.tsx`. `npm test` 267/267, `npm run build` ok.

### Etapa 2 (2026-10-09)
- Toate cele 293 de clase `text-[Npx]` din `src/components` → `text-[N/16 rem]` (ex. 11px → 0.6875rem), deci aceeași mărime la text normal; `.micro-label` din `src/index.css`: 10px → 0.625rem.
- Verificat cu Playwright la 390px, pe cele 5 taburi: la text normal 11px rămâne 11px; cu A+ devine 12,98px (118%); fără overflow orizontal.
- Test: în `src/test/accesibilitate.test.tsx`, niciun `text-[Npx]` în componente. `npm test` 268/268, `npm run build` ok. Agentul `verificare`: nimic blocant.
- După etapă, cu acordul proprietarei (chestionar): scos `text-[110%]` de pe containerul principal din `src/App.tsx`, care mărea încă o dată textul fără mărime proprie (~130% în loc de 118%); acum A+ mărește tot textul la fel, cu 18%. Test în `src/test/accesibilitate.test.tsx`; `npm test` 269/269.

## Următorul pas
Nimic; sarcina e încheiată.
