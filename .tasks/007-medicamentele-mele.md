# 007 — Medicamentele mele

**Stare:** de început (etapa 1, într-o sesiune nouă)
**Ramura:** câte o ramură `claude/…` pe etapă, din `main`

## Scop
Pacienta poate nota și celelalte medicamente pe care le ia, pe lângă Tamoxifen. Fiecare medicament e comparat cu lista aprobată de interacțiuni cu tamoxifenul (`src/lib/interactions.ts`). Nu se fac interacțiuni între oricare două medicamente: pentru acestea o trimitem la farmacist, cu lista pregătită.

Deciziile proprietarei (2026-10-09):
- medicamentele **doar se notează** (nume, doză, când, pentru ce); Tamoxifenul rămâne singurul bifat zilnic, cu memento;
- **locul:** în Tratament, sub Tamoxifen; lista apare și în „Pentru medic” și în raportul PDF;
- **interacțiunile:** doar cu Tamoxifenul, cu lista aprobată, **plus nume comerciale** (Prozac, Seroxat…), dintr-o listă aprobată de proprietară, din surse oficiale;
- avertisment doar când se potrivește; aplicația nu spune niciodată „fără interacțiuni”, ci „Nu e în lista noastră scurtă; întreabă farmacistul”;
- datele stau doar pe telefon (localStorage), ca programările, și intră în copia de siguranță; fără Supabase.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Lista „Medicamentele mele” în Tratament, comparată cu substanțele din lista aprobată, în „Pentru medic”, în PDF și în copie; „Arată farmacistului” | de făcut | |
| 2 | Numele comerciale: lista aprobată de proprietară, legată de substanțele din `interactions.ts` | de făcut (după aprobarea listei) | |

## Etapa 1 — de decis la început (un singur chestionar)
- Câmpurile: nume (obligatoriu), doză, când se ia (text liber sau alegeri), pentru ce, cine l-a prescris?
- Potrivirea: pe numele substanțelor din `INTERACTIONS_DB`, fără diacritice și fără majuscule (de ex. „fluoxetina” → „Paroxetină, fluoxetină…”).
- Textele: titlul, butoanele, avertismentul la potrivire (cu nivelul în text: „De evitat”, „Spune medicului”…), rândul fără potrivire, ecranul „Arată farmacistului” („Iau Tamoxifen 20 mg din … Iau și: …”), rândul din PDF.
- Ce face un medicament oprit: se șterge sau rămâne „oprit din …” pentru medic.

## Etapa 2 — de pregătit
- Claude propune o listă de nume comerciale pentru fiecare substanță din `INTERACTIONS_DB`, doar din Nomenclatorul ANMDMR, cu sursa la fiecare nume. Proprietara o aprobă prin chestionar înainte de cod. Până atunci: „DE COMPLETAT”.

## Rezumat pe etape

## Următorul pas
Sesiune nouă: citește acest fișier, apoi chestionarul de la „Etapa 1 — de decis la început”.
