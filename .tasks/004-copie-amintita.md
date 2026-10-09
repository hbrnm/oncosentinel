# 004 — Rămășițele din audit, apoi copia amintită

**Stare:** gata (etapa 3 sărită, decizia proprietarei, 2026-10-09)
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
| 1 | Rămășițele din audit: butoanele cu A+ (2), imaginea Unsplash din primul ghid (3), „Medici și centre” (4), textul „Zilele neutre…” la „Liniștită” | gata | PR #32 |
| 2 | Copia amintită: data ultimei copii, memento discret când e veche, un singur loc pentru copie | gata | PR #33 |
| 3 | Testare cu pacientele (`docs/ghid-testare.md`) și observațiile într-un singur PR | sărită (decizia proprietarei) | |

## Etapa 1 — de decis la început (un singur chestionar)
- A+: cât cresc butoanele față de text.
- Imaginea din ghid: imagine locală, ilustrație din `Botanical.tsx` sau fără imagine; textul alternativ în română.
- „Medici și centre”: alt nume, altă destinație sau scos.
- Textul nou pentru treapta 3 („Liniștită”) în `src/data/comfort.ts`.

## Etapa 2 — de decis la început (un singur chestionar)
- După câte zile e „veche” o copie; unde apare memento-ul (Astăzi sau doar în „Siguranța datelor”); textele.
- Care dintre cele două locuri pentru copie rămâne (Dosar sau „Siguranța datelor”).

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- Deciziile proprietarei: ghidul g1 fără imagine; „Medici și centre” devine „Controale medicale” (aceeași destinație); la „Liniștită”: „Mă bucur că azi e o zi liniștită. Liniștea e și ea un fel de putere — păstrează-o cât poți.”
- A+ (reparație tehnică, fără decizie): regula din `src/index.css` care punea `font-size: inherit` pe butoane și câmpuri bătea clasele de text, așa că butoanele luau mărimea textului din jur. Scoasă; preflight-ul Tailwind moștenește deja fontul în câmpurile fără clasă.
- Test nou `ramasite-audit.test.tsx` (pică pe codul vechi). `npm test` (182) și `npm run build` trec; verificat la 390px, cu litere normale și cu A+, fără overflow. Agentul `verificare`: nimic.

### Etapa 2 (2026-10-09)
- Deciziile proprietarei: copia rămâne doar în „Siguranța datelor” (cardul din Dosar scos); memento la 30 de zile de la ultima copie sau, fără nicio copie, când prima doză/notă are peste 7 zile; card mic pe Astăzi cu „Fac copia acum” (deschide „Siguranța datelor”) și „Mai târziu” (ascunde 7 zile); texte: „O copie pentru liniștea ta”, „Datele tale stau doar pe acest telefon. Ultima copie: acum 42 de zile.” / „Nu ai făcut încă nicio copie.”
- Adăugate de Claude: „Ultima copie: azi.” și „Ultima copie: ieri.” (confirmate de proprietară, 2026-10-09)
- `src/lib/backupReminder.ts`: data ultimei copii (`oncosentinel_last_backup`, scrisă la descărcare și, la restaurare, data copiei) și „Mai târziu” (`oncosentinel_backup_snooze_until`). Cu PIN, cheile intră în seif ca restul datelor.
- Știut și acceptat: data se scrie la apăsarea descărcării (aplicația nu poate afla dacă fișierul a fost salvat); după restaurarea unei copii mai vechi de 30 de zile, memento-ul apare imediat.
- Test nou `copia-amintita.test.tsx`. `npm test` (194) și `npm run build` trec; verificat la 390px, cu litere normale și cu A+. Agentul `verificare`: nimic blocant; reparată data veche din „Siguranța datelor” după miezul nopții.

## Următorul pas
Planul 004 e încheiat. Lucrul următor: planul 005.
