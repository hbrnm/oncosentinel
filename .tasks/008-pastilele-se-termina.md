# 008 — Pastilele se termină

**Stare:** gata
**Ramura:** claude/plan-008, din `main`

## Scop
Stocul de pastile (`pill_stock_count`, setat la configurare sau în Profil și scăzut cu 1 la fiecare doză marcată) nu se vedea nicăieri și nu avertiza. Acum: card pe Astăzi când pastilele se termină, cutie nouă adăugată din card, stocul vizibil în Tratament. Fără conținut medical nou.

Deciziile proprietarei (2026-10-09):
- cardul apare la **7 pastile** rămase sau mai puțin;
- „**Am o cutie nouă**” cere numărul de pastile din cutie (implicit 30) și îl adaugă la stoc; „**Mai târziu**” ascunde cardul 2 zile;
- stocul apare și în Tratament, pe cardul medicamentului;
- textele aprobate: „Pastilele se termină curând”; „Mai ai 6 pastile de Tamoxifen. E un moment bun să ceri o rețetă nouă și să treci pe la farmacie.” (la 1: „Mai ai o pastilă de Tamoxifen. …”); la 0: „Pastilele notate s-au terminat. Dacă ai deja o cutie nouă, adaug-o aici, ca să știi mereu câte mai ai.”; „Câte pastile are cutia nouă?”, „Anulează”, „Adaugă”; „Am adăugat 30 de pastile. Acum ai 36.”; în Tratament „Mai ai 23 de pastile.”.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Cardul pe Astăzi, cutia nouă, stocul în Tratament | gata | ramura claude/plan-008 |

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- `src/lib/pillStock.ts` (prag, „Mai târziu” în localStorage `oncosentinel_stock_snooze_until`, texte); `DashboardTab.tsx` (cardul, fereastra, confirmarea `role="status"`); `App.tsx` (`handleAddPills`); `TreatmentTab.tsx` (rândul cu stocul). Numele medicamentului vine din profil.
- Formulat de Claude după decizii: în Tratament, la 0 pastile, „Pastilele notate s-au terminat.”; la 1, „Mai ai o pastilă.”.
- Test nou `pastile-se-termina.test.tsx`. `npm test` (241) și `npm run build` trec; verificat în aplicație la 390px (stocul 6 → 36, cardul dispare), fără overflow.
- Agentul `verificare`: nimic blocant; reparate confirmarea doar după salvarea reușită, stocul lipsă dintr-un profil vechi (0, nu NaN, `safeStock`), confirmarea care dispare la următoarea doză și limita de 365 de pastile pe cutie.

## Următorul pas
Planul 008 e încheiat. Decizia proprietarei (2026-10-09): nu se mai face nimic din celelalte propuneri (testarea cu pacientele, „Medicamentele mele” ca text de copiat, întrebări pentru medic din „Medicamentele mele”). Lucrul următor: doar la cererea proprietarei.
