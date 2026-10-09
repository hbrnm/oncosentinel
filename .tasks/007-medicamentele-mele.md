# 007 — Medicamentele mele

**Stare:** gata
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
| 1 | Lista „Medicamentele mele” în Tratament, comparată cu substanțele din lista aprobată, în „Pentru medic”, în PDF și în copie; „Arată farmacistului” | gata | ramura claude/plan-007 |
| 2a | Cuvinte în plus la estrogen („estradiol”, „contraceptiv”) | gata | ramura claude/plan-007-etapa2 |
| 2b | Numele comerciale: lista aprobată de proprietară, legată de substanțele din `interactions.ts` | gata | ramura claude/plan-007-etapa2b |

## Etapa 1 — de decis la început (un singur chestionar)
- Câmpurile: nume (obligatoriu), doză, când se ia (text liber sau alegeri), pentru ce, cine l-a prescris?
- Potrivirea: pe numele substanțelor din `INTERACTIONS_DB`, fără diacritice și fără majuscule (de ex. „fluoxetina” → „Paroxetină, fluoxetină…”).
- Textele: titlul, butoanele, avertismentul la potrivire (cu nivelul în text: „De evitat”, „Spune medicului”…), rândul fără potrivire, ecranul „Arată farmacistului” („Iau Tamoxifen 20 mg din … Iau și: …”), rândul din PDF.
- Ce face un medicament oprit: se șterge sau rămâne „oprit din …” pentru medic.

## Etapa 2 — de pregătit
- Claude propune o listă de nume comerciale pentru fiecare substanță din `INTERACTIONS_DB`, doar din Nomenclatorul ANMDMR, cu sursa la fiecare nume. Proprietara o aprobă prin chestionar înainte de cod. Până atunci: „DE COMPLETAT”.

## Rezumat pe etape
### Etapa 1 (2026-10-09)
- Deciziile proprietarei: câmpurile nume (obligatoriu), doză, când, pentru ce; un medicament oprit se șterge; textele aprobate într-un singur chestionar: „Alte medicamente pe care le iau”, „Nu ai notat alte medicamente. Adaugă-le aici, ca să le ai la îndemână la medic și la farmacie.”, „Adaugă un medicament”, la potrivire nivelul + sfatul aprobat + „Vorbește cu medicul înainte să schimbi ceva.”, fără potrivire „Nu e în lista noastră scurtă de interacțiuni cu tamoxifenul. Lista nu e completă: întreabă farmacistul sau medicul.”, „Arată farmacistului” („Iau Tamoxifen 20 mg din 1 iulie 2025.” / „Iau și: …” / „Pot lua aceste medicamente împreună?”), „Alte medicamente: …” în „Pentru medic” și PDF, „Sigur ștergi „…” din listă?”.
- PDF, secțiunea 4 (aprobat): „Pacienta nu a notat alte medicamente în aplicație.” când lista e goală; „Aplicația nu înregistrează semnale de alarmă (ex. tromboză, sângerări, dispnee). Vă rugăm să le discutați direct cu pacienta.” (înainte spunea că aplicația nu înregistrează nici alte medicamente).
- `src/lib/interactions.ts`: câmpul `match` pe fiecare intrare, cu cuvinte doar din numele aprobat al substanței, fără diacritice, ca rădăcini („fluoxetin” prinde și „Fluoxetine”); `findInteraction`, `normalizeName`. `src/lib/myMedicines.ts` (localStorage `navimed_other_medicines`, intrările fără nume se ignoră); `src/components/OtherMedicines.tsx` în Tratament, sub Tamoxifen; copia de siguranță păstrează lista.
- PDF: lista lungă continuă pe pagina următoare; pragul de pagină nouă ține cont de rândurile secțiunii 4.
- Test nou `medicamentele-mele.test.tsx`. `npm test` (230) și `npm run build` trec; verificat la 390px, fără overflow. Agentul `verificare`: nimic blocant; reparate rădăcinile cuvintelor, paginarea secțiunii 4 și copia stricată.
- Pentru etapa 2 (de aprobat): cuvinte în plus la estrogen, ca „estradiol”, „contraceptiv” (sugestia agentului `verificare`; nu sunt în textul aprobat). „soia” prinde și „lecitină de soia” (nivel „Întreabă medicul”, inofensiv).

### Etapa 2a (2026-10-09)
- Rețeaua sesiunii blochează `nomenclator.anm.ro` și `www.anm.ro`; căutarea pe web găsește doar documente ANM răzlețe (ex. fluoxetină: Prozac, Fluoxin, Fluoxetină Arena, autorizații 2018–2019), fără confirmarea că lista e completă. Decizia proprietarei: deblochează accesul la ANMDMR în rețeaua mediului; lista se face apoi din Nomenclator.
- Aprobat de proprietară: „estradiol” și „contraceptiv” la „Medicamente cu estrogen” (prind și „Etinilestradiol”, „comprimate contraceptive”); testul le permite explicit. `npm test` (230) și `npm run build` trec. Agentul `verificare`: nimic blocant.

### Etapa 2b (2026-10-09)
- Meniul de rețea al mediului nu e disponibil pe iPhone (nici în Safari); decizia proprietarei: listă parțială din căutarea pe web, doar din documente ANM (RCP/PRO/AMB), fiecare nume cu sursa.
- Aprobate de proprietară (17 nume): Seroxat, Paxetin, Prozac, Fluoxin, Magrilan, Elontril, Zyban, Axabal (paroxetină/fluoxetină/bupropion); Sintrom, Trombostop (acenocumarol); Arimidex, Kyaresta, Loosyn, Elozora, Etruzil, Zequipra (anastrozol/letrozol); Sinerdol (rifampicină). Sursele sunt în comentariile din `interactions.ts`. Pentru warfarină nu s-a găsit niciun produs românesc; Mimpara și Femara nu au apărut în documente ANM.
- Numele care conțin deja substanța (Paroxetină Atb, Anastrozol Teva, Rifampicină Arena, Chinidină Arena…) erau deja recunoscute.
- `brands` pe `DrugInteraction`; `findInteraction` și căutarea din Ghiduri → Medicamente le folosesc. Lista rămâne incompletă; textul „Lista nu e completă” rămâne.
- `npm test` (231) și `npm run build` trec. Agentul `verificare`: nimic blocant; adăugate căutarea în Ghiduri și testul pentru toate numele.

## Următorul pas
Planul 007 e încheiat. Lista de nume comerciale se poate completa din Nomenclatorul ANMDMR dacă accesul la `nomenclator.anm.ro` devine posibil (de pe un calculator).
