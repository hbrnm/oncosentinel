# 005 — Între două controale

**Stare:** gata
**Ramura:** câte o ramură `claude/…` pe etapă, din `main`

## Scop
„Pentru medic” (fereastra vizitei) arată azi doar ultimele 28 de zile, dar controalele sunt la câteva luni distanță. Pacienta poate alege și perioada de la ultimul control până azi, în aplicație și în raportul PDF. Fără conținut medical nou: aceleași calcule (`doctorSummary`, `takenInLastDays` în `src/lib/summary.ts`), pe altă perioadă.

Deciziile proprietarei (2026-10-09):
- în plan intră doar „Între două controale”; „Medicamentele mele” și „Drumul tratamentului” rămân idei (la „Drumul tratamentului”, dacă revine: doar timpul parcurs, fără durată totală);
- locul: în „Pentru medic”, cu o alegere „Ultimele 28 de zile / De la ultimul control”; PDF-ul urmează alegerea;
- testarea cu pacientele nu se programează (etapa 3 din 004 a fost sărită).

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | „De la ultimul control” în „Pentru medic” și în PDF | gata | ramura claude/plan-005 |

## Etapa 1 — de decis la început (un singur chestionar)
- Ce e „ultimul control”: cel mai recent control trecut din „Controale medicale” (`src/lib/appointments.ts`); ce arătăm când nu există niciunul.
- Textele: alegerea, titlul perioadei („De la controlul din 12 iulie: 89 de zile”), rândurile care se schimbă și perioada din PDF (azi fix „30 ZILE” în `src/lib/pdfGenerator.ts`).
- Dacă perioada lungă adaugă ceva nou (de ex. starea cea mai des) sau doar aceleași rânduri.

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- Deciziile proprietarei: ultimul control = cel mai recent control trecut, efectuat sau rămas „programat” (fără ratate sau anulate); perioada începe a doua zi după control. Alegerea „Ultimele 4 săptămâni” / „De la ultimul control”; „Ce ai notat de la controlul din 12 iulie (89 de zile). Poți arăta ecranul sau descărca raportul.”; fără control trecut: „După primul control trecut în „Controale medicale”, vei putea alege și perioada de la ultimul control.”; rând nou „Starea notată cel mai des: Liniștită (12 note).”; PDF-ul ia toate notele din perioadă, iar dozele sunt pe 28 de zile, ca pe ecran.
- Formulate de Claude (PDF): titlurile „2. RAPORT ADERENȚĂ LA TAMOXIFEN (ULTIMELE 28 DE ZILE)” / „(DE LA CONTROLUL DIN 12 IULIE, 89 DE ZILE)”, „3. JURNAL DIN PERIOADA RAPORTULUI”, „Fără note în perioadă”, „Tratamentul nu a început încă în perioada raportului (…)” (confirmate de proprietară, 2026-10-09).
- `src/lib/summary.ts`: `periodDays`, `controlDateLabel`, `doctorSummary(…, since)` cu numărul de zile și starea cea mai des; scos `takenInLastDays` (nefolosit). `src/lib/appointments.ts`: `lastControlDate`.
- PDF pe mai multe pagini: subsol cu „Pagina X / N” pe fiecare pagină, tabelul lasă loc subsolului, secțiunea 4 trece pe pagină nouă când nu mai are loc; coloana de dată nu se mai rupe. Verificat cu jsPDF real (80 de note, 5 pagini).
- „Jurnal” → raportul PDF folosește ultimele 28 de zile (fără alegere acolo).
- Test nou `intre-controale.test.tsx` (pică pe codul vechi). `npm test` (204) și `npm run build` trec; verificat la 390px, cu litere normale și cu A+. Agentul `verificare`: nimic blocant; reparate pragul de pagină nouă, subsolul pe fiecare pagină și ordinea notelor.

## Următorul pas
Planul 005 e încheiat. Lucrul următor: decizia proprietarei.
