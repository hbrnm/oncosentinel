# 006 — Drumul tratamentului

**Stare:** gata
**Ramura:** claude/plan-006, din `main`

## Scop
O vedere caldă a drumului parcurs cu tratamentul, din data de început din profil (`tamoxifen_start_date`). Fără conținut medical nou.

Deciziile proprietarei (2026-10-09):
- doar **timpul parcurs**, fără durata totală (o stabilește medicul: 5 sau 10 ani);
- planul se face după confirmarea textelor din 004 și 005 (confirmate);
- „Medicamentele mele” rămâne idee: înainte de cod trebuie decis cum tratăm numele comerciale (o potrivire lipsă poate liniști pe nedrept).

Din chestionarul etapei 1 (2026-10-09):
- locul: pe Astăzi, rând mic sub salut, fără card nou;
- conținutul: doar timpul parcurs (fără doze, fără etapele din cronologie);
- formatul: ani și luni, rotunjit în jos („3 săptămâni”, „5 luni”, „1 an și 3 luni”); sub o săptămână, zile („de 4 zile”);
- reperele: doar aniversarea la fiecare an împlinit, separat de „O mică victorie”: „Azi se împlinește 1 an de când ai început tratamentul. Felicitări din inimă.”

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Rândul „Ești pe drum de …” pe Astăzi, cu aniversarea anuală | gata | ramura claude/plan-006 |

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- `src/lib/summary.ts`: `treatmentJourneyText(startDate, today)`; fără dată, cu data de azi sau din viitor nu arată nimic; pentru o dată greșită, nici atât. Formulate de Claude după decizii: „Ești pe drum de 1 zi.” și „Azi se împlinesc 3 ani…” (pluralul).
- Început pe 29–31: în lunile mai scurte luna se împlinește în ultima zi (29 februarie → aniversare pe 28 februarie în anii nebisecți).
- `src/components/DashboardTab.tsx`: rândul sub salut, `text-sage-700` / `dark:text-sage-300`.
- Pe parcurs: scos blocul `sr-only` „Hidden legacy anchor” din `DoctorVisitModal.tsx`; `complete-flow.test.tsx` verifică acum titlul vizibil „Controale Medicale”.
- Test nou `drumul-tratamentului.test.tsx` (pică pe codul vechi). `npm test` (216) și `npm run build` trec; verificat la 390px, fără overflow. Agentul `verificare`: nimic blocant; reparate cazurile 29–31 și data greșită.

## Următorul pas
Planul 006 e încheiat. Lucrul următor: decizia proprietarei („Medicamentele mele” rămâne idee).
