# 006 — Drumul tratamentului

**Stare:** de început (într-o sesiune nouă)
**Ramura:** câte o ramură `claude/…` pe etapă, din `main`

## Scop
O vedere caldă a drumului parcurs cu tratamentul, din data de început din profil (`tamoxifen_start_date`). Fără conținut medical nou.

Deciziile proprietarei (2026-10-09):
- doar **timpul parcurs** („8 luni de tratament”), fără durata totală (o stabilește medicul: 5 sau 10 ani);
- planul se face după confirmarea textelor din 004 și 005 (confirmate);
- „Medicamentele mele” rămâne idee: înainte de cod trebuie decis cum tratăm numele comerciale (o potrivire lipsă poate liniști pe nedrept).

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Drumul tratamentului: timpul parcurs și repere | de făcut | |

## Etapa 1 — de decis la început (un singur chestionar)
- Unde apare: pe Astăzi (cardul pastilei sau card separat), în Tratament sau în Profil.
- Reperele: 1, 3, 6 luni, 1 an, apoi în fiecare an? Legate de „O mică victorie” (`nextVictory` în `src/lib/summary.ts`, cu „Mulțumesc”) sau separate.
- Textele (timpul parcurs și mesajele de la repere); ce arătăm fără dată de început sau cu dată în viitor.

## De făcut pe parcurs
- `src/components/DoctorVisitModal.tsx`: blocul `sr-only` „Hidden legacy anchor for backwards compatibility in tests”, de scos cu testele adaptate (ca pe Astăzi, în planul 002).

## Rezumat pe etape

## Următorul pas
Sesiune nouă: citește acest fișier, apoi chestionarul de la „Etapa 1 — de decis la început”.
