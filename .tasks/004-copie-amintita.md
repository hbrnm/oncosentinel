# 004 — Rămășițele din audit, apoi copia amintită

**Stare:** de început
**Ramura:** câte o ramură `claude/…` pe etapă, din `main`

## Scop
Plan nou după încheierea planului 002. Limitele rămân: fără AI, fără server de push, fără sincronizare, fără linii de sprijin; totul local și gratuit.

Deciziile proprietarei (2026-10-09):
- în plan intră doar **copia de siguranță amintită** (memento când ultima copie e veche + un singur loc pentru copie, punctul 7 din audit);
- **rămășițele din audit** se repară întâi, într-un PR mic (revine asupra deciziei din 2026-10-08 de a le lăsa așa);
- **testarea cu pacientele** doar la final, după `docs/ghid-testare.md`.

Propuse, dar nealese acum: „Medicamentele mele” (comparate cu interacțiunile aprobate), „Între două controale” (rezumat de la ultimul control), „Drumul celor 5 ani”.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Rămășițele din audit: butoanele cu A+ (2), imaginea Unsplash din primul ghid (3), „Medici și centre” (4), textul „Zilele neutre…” la „Liniștită” | de făcut | |
| 2 | Copia amintită: data ultimei copii, memento discret când e veche, un singur loc pentru copie | de făcut | |
| 3 | Testare cu pacientele (`docs/ghid-testare.md`) și observațiile într-un singur PR | de făcut | |

## Etapa 1 — de decis la început (un singur chestionar)
- A+: cât cresc butoanele față de text.
- Imaginea din ghid: imagine locală, ilustrație din `Botanical.tsx` sau fără imagine; textul alternativ în română.
- „Medici și centre”: alt nume, altă destinație sau scos.
- Textul nou pentru treapta 3 („Liniștită”) în `src/data/comfort.ts`.

## Etapa 2 — de decis la început (un singur chestionar)
- După câte zile e „veche” o copie; unde apare memento-ul (Astăzi sau doar în „Siguranța datelor”); textele.
- Care dintre cele două locuri pentru copie rămâne (Dosar sau „Siguranța datelor”).

## Rezumat pe etape

## Următorul pas
Etapa 1, într-o sesiune nouă: chestionarul cu cele patru decizii, apoi reparațiile.
