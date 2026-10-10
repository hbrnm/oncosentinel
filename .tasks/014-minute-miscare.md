# 014 — Minutele de mișcare în Jurnal

**Stare:** gata
**Ramura:** claude/minute-miscare, din `main`

## Scop
Pacienta notează câte minute s-a mișcat azi, iar în „Săptămâna ta” vede totalul pe ultimele 7 zile. Urmare a ghidului g5 (planul 013).

Deciziile proprietarei (2026-10-10):
- card separat „Mișcare azi” în Jurnal, sub „Cum te simți azi?”, cu butoane rapide 10 / 20 / 30 min și câmp liber; se salvează separat de dispoziție;
- doar minutele, fără felul mișcării;
- în „Săptămâna ta”: totalul pe ultimele 7 zile, fără țintă; rândul lipsește când nu e nimic notat;
- nu intră în raportul PDF pentru oncolog (deocamdată);
- textele aprobate (varianta A): „Mișcare azi”; „Mers, yoga, grădină, orice fel de mișcare. Câte minute ai făcut azi?”; „10 min” / „20 min” / „30 min”; „Minute” (cititor de ecran: „Minute de mișcare azi”); „Salvează” / „Actualizează”; „Am notat 30 de minute azi.”; „Scrie un număr de minute între 0 și 600.”; „Te-ai mișcat 90 de minute în ultimele 7 zile.”

## În afara scopului
Felul mișcării, ținta de 150 de minute, raportul PDF, sincronizarea în cont.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Cardul, rezumatul, copia de siguranță | gata | vezi PR |

## Rezumat pe etape
### Etapa 1 (2026-10-10)
- `src/lib/movement.ts` (localStorage `oncosentinel_movement`, zi → minute; 0 șterge ziua; protejat de PIN ca restul), `src/components/MovementCard.tsx`; folosit în `JournalTab.tsx`; `weekSummary` primește minutele; `backupService.ts` (`movement`).
- Formulat de Claude după decizii: dacă săptămâna are doar minute, fără note, rezumatul arată doar rândul cu mișcarea.
- Test nou `minute-miscare.test.tsx` (data fixată); `ce-m-a-ajutat.test.tsx` caută acum „Salvează” doar în lista lui (sunt două butoane „Salvează” în Jurnal).
- `npm test` (300/300) și `npm run build` trec. Agentul `verificare` nu a primit permisiunea de pornire; diff-ul l-a citit orchestratorul față de CLAUDE.md: nimic blocant.

## Cum verific la final
Jurnal → „Mișcare azi” → 30 min → Salvează → „Săptămâna ta” arată totalul. La 390px, pe telefon.

## Următorul pas
De văzut după testare: felul mișcării, ținta, raportul PDF.
