# 005 — Între două controale

**Stare:** de început
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
| 1 | „De la ultimul control” în „Pentru medic” și în PDF | de făcut | |

## Etapa 1 — de decis la început (un singur chestionar)
- Ce e „ultimul control”: cel mai recent control trecut din „Controale medicale” (`src/lib/appointments.ts`); ce arătăm când nu există niciunul.
- Textele: alegerea, titlul perioadei („De la controlul din 12 iulie: 89 de zile”), rândurile care se schimbă și perioada din PDF (azi fix „30 ZILE” în `src/lib/pdfGenerator.ts`).
- Dacă perioada lungă adaugă ceva nou (de ex. starea cea mai des) sau doar aceleași rânduri.

## Rezumat pe etape

## Următorul pas
Etapa 1: chestionarul de mai sus, apoi implementarea.
