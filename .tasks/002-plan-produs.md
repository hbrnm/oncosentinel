# 002 — Planul aplicației: încredere, apoi căldură

**Stare:** în lucru (etapa 0)
**Ramura:** claude/plan-produs (etapa 0, PR #5); fiecare etapă următoare pe ramura ei

## Scop
O aplicație caldă care liniștește pacientele cu DCIS în tratament cu Tamoxifen (jurnal, empatie, ghiduri, resurse de ajutor), în care se poate avea încredere. Mai întâi încrederea, apoi funcțiile noi.

Deciziile proprietarei (2026-10-08):
- începem cu **etapa 0: încredere**;
- conținutul medical se rescrie **din ghiduri oficiale publice**, cu sursă la fiecare afirmație, până se găsește un medic care să-l verifice;
- mesajele calde: **AI cu limite stricte, mai târziu** (etapa 5), după etapele de bază;
- **avem câteva paciente** care pot testa; după fiecare etapă testăm cu ele.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 0 | Încredere: conținut medical cu surse, resurse de ajutor reale, ghid de testare | gata, în afară de numerele de ajutor (așteaptă confirmarea proprietarei) și verificarea cu prospectul din România | |
| 1 | „Nu ești singură”: buton „Am nevoie de liniște acum”, jurnal care răspunde (mesaje scrise de om), sprijin înaintea controalelor | gata, de testat cu pacientele | ramura claude/etapa1 |
| 2 | „Te înțeleg”: rezumatul săptămânii, pregătirea vizitei la medic, mici victorii | de făcut | |
| 3 | „Cercul tău”: rezumat și idei pentru familie, doar cu acordul pacientei | de făcut | |
| 4 | Continuitate (server): memento-uri reale, sincronizare criptată opțională, PIN | de făcut | |
| 5 | Mesaje AI cu limite stricte (vezi mai jos) | de făcut | |

## Etapa 0 — pașii
1. **Inventarul conținutului medical** → `docs/continut-medical.md`: fiecare afirmație din `src/data/guides.ts`, `src/lib/interactions.ts`, „Noutăți” (ASCO 2026, Stockholm), `RedFlagsModal`, `OnboardingModal` („Recomandare clinică…”), `TreatmentTab`, cu stare: are sursă / de verificat / de scos.
2. **Rescrierea din surse oficiale**: prospectul Tamoxifen aprobat în România, ghidurile ESMO și NCCN pentru pacienți, NICE, după caz. Fiecare ghid primește sursă și dată. Ce nu se poate susține se scoate sau rămâne „DE COMPLETAT”. Fiecare text rescris trece prin proprietară (chestionar) înainte de a intra în aplicație.
3. **Sursele în aplicație**: „Sursa: …, actualizat la …” sub fiecare ghid, plus nota „Informații generale, nu înlocuiesc sfatul medicului tău”.
4. **Resurse de ajutor reale pentru România** (112, linii de sprijin emoțional, asociații de paciente): fiecare număr se verifică pe site-ul oficial al organizației înainte de a intra în aplicație; niciun număr scris din memorie.
5. **Verificarea interacțiunilor**: se pune în aplicație doar după pasul 2, cu surse.
6. **Ghid de testare cu pacientele** → `docs/ghid-testare.md`: ce încearcă, ce întrebări le punem, cum notăm răspunsurile (fără date medicale personale).

## Etapa 5 — limitele pentru AI (de stabilit în detaliu atunci)
- doar mesaje de sprijin emoțional, niciodată sfaturi medicale, doze sau diagnostic;
- la orice semn de criză sau simptom sever: mesaj fix, scris de om, cu 112 și linia de sprijin, fără AI;
- datele de sănătate trimise furnizorului doar cu acordul explicit al pacientei, minim necesar, fără nume;
- cheia API doar pe server (funcție Supabase), niciodată în `src/`;
- mesajele scrise de om rămân varianta implicită și de rezervă.

## Rezumat pe etape
### Etapa 0, pasul 1 (2026-10-08)
- Inventarul e în `docs/continut-medical.md`, cu stare pentru fiecare afirmație (GREȘIT / DEFORMAT / DE VERIFICAT / CONFIRMAT).
- „Noutăți”: ambele studii există (JCO 2026, JNCI 2026), dar textele din aplicație le deformează. ASCO: beneficiu clar doar după menopauză. Stockholm: cancer invaziv, 40 mg timp de 2 ani.
- Raportul PDF pentru medic, reparat (nu cere text medical nou): doza din profil; aderența calculată pe zilele reale din ultimele 30 (înainte ieșea mereu 100%) și fără „Aderență optimă”; scoase „Negativ/Neraportat” pentru tromboză, sângerări, dispnee și „nu s-au înregistrat inhibitori CYP2D6”; ă/ș/ț scrise fără diacritice, pentru că fontul PDF le omitea; „Generat la” nu se mai suprapune cu titlul.
- `npm test` (46) și `npm run build` trec.
- Opțiune pentru mai târziu: un font cu diacritice în PDF (ar crește pachetul PDF cu ~100–300 KB).

### Etapa 0, pasul 2, prima parte (2026-10-08)
- Rescrieri în `docs/rescriere-etapa0.md`; aprobate de proprietară: n1 (doza mică, cu precizarea „după menopauză”) și g1 („Tamoxifen: ce face și cum îl iei”). n2 (Stockholm, cancer invaziv) a fost scos.
- Test nou `medical-content.test.ts`, ca afirmațiile scoase să nu revină.
- DE COMPLETAT: verificarea lui g1 cu prospectul aprobat în România (ANMDMR).
- Paginile NHS, ASCO Post și ascopubs sunt blocate de rețeaua mediului; sursele au fost citite prin rezultatele căutării.

### Etapa 0, pasul 2, a doua parte (2026-10-08)
- Aprobate și puse în aplicație: g2 „Bufeurile și transpirațiile de noapte” (NAMS 2023: TCC, hipnoză clinică, tratament prescris; respirația ritmată nu mai e prezentată ca tratament); g3 „Controalele după tratament” (NICE NG101, ESMO 2024); textele din ecrane (respirație, ancorare, pornire, persoana de sprijin cu doza din profil).
- Rețete: 20 rămase, ca idei de mese, fără afirmații terapeutice; scoase infuzia de salvie și atribuirile neverificate.
- `npm test` (50) și `npm run build` trec.
- Rămase în etapa 0: semnalele de alarmă (`RedFlagsModal`) și pragul „sever” din jurnal, de verificat; verificarea interacțiunilor (pasul 5); pagina „Ajutor” cu resurse din România (pasul 4); ghidul de testare (pasul 6); sursa vizibilă sub fiecare ghid (pasul 3, parțial: sursa e deja în text).

### Etapa 0, pasul 4 (2026-10-08)
- Deciziile proprietarei: pagina se face acum, iar numerele intră după verificarea ei; „Ajutor” e acțiune rapidă pe Astăzi și link din fereastra SOS.
- `HelpModal`: 112 primul (cu semnalele de alarmă), echipa medicală (e-mail oncolog din profil; psihologul sau asistentul social din spital), respirație și 5-4-3-2-1, persoana de sprijin. Liniile de sprijin vin din `src/data/helpLines.ts`, gol până la confirmare; secțiunea nu apare cât timp lista e goală.
- Lista de verificat: `docs/resurse-de-verificat.md` (ARPS 0800 801 200 cu program contradictoriu și anunț de nefuncționare, 116 123, Colegiul Pacienților, OncoHelp, M.A.M.E., canceruldesan.ro).
- Verificat la 390px, fără overflow. `npm test` (57) și `npm run build` trec.

**În așteptare (proprietara):** confirmarea numerelor din `docs/resurse-de-verificat.md`.

### Etapa 0: semnalele de alarmă și alerta din jurnal (2026-10-08)
- Aprobate: semnalele de alarmă, împărțite în „Sună la 112” și „Anunță repede medicul”, fără decizii de investigație (Doppler, ecografie), cu surse; în g1, „umflare bruscă a feței, a buzelor sau a gâtului”; alerta din jurnal devine „Ai notat un simptom puternic” (pragul rămâne nota pacientei ≥ 4 din 5).
- Înlocuită și „Notă de liniște” fără sursă („Tamoxifenul este bine tolerat”) cu una fără afirmații medicale.
- Găsit: `DashboardTab` are un container `sr-only` cu butoane ascunse „pentru teste” (citite de cititorul de ecran); de scos, cu testele vechi adaptate.
- `npm test` (59) și `npm run build` trec; verificat la 390px.

### Etapa 0, pașii 5 și 6 și curățenie (2026-10-08)
- Interacțiuni (pasul 5): lista rescrisă din RCP (secțiunea 4.5) și surse publice, aprobată și afișată în Ghiduri → „Medicamente”, cu căutare, nivel în text + icon, sursă la fiecare intrare și mesajul că lipsa din listă nu înseamnă siguranță. Scoase: suplimentele „recomandate” (vitamina D, magneziu, curcumină), „Sigur” la antidepresive, „−70%”, „contraindicație completă” la grepfrut. DE COMPLETAT: rifampicina (de verificat în RCP-ul din România).
- Ghid de testare (pasul 6): `docs/ghid-testare.md`, cu 7 sarcini, întrebări de final și șablon de notițe fără date personale.
- Sursa vizibilă sub fiecare ghid (pasul 3): fiecare ghid, știre, semnal de alarmă și interacțiune își afișează sursa.
- Scos containerul `sr-only` de pe Astăzi (butoane ascunse „pentru teste”) și codul rămas fără folos; testele folosesc drumurile reale.
- `npm test` (62) și `npm run build` trec; verificat la 390px.

- Verificarea cu prospectul românesc (Tamoxifen Sandoz, ANMDMR), prin rezultatele căutării: confirmate lista CYP2D6, anticoagulantele, „nu luați doză dublă”; rifampicina adăugată (aprobată). Neconfirmate în textul românesc: pașii exacți la doza uitată, estrogenii, letrozolul (detalii în `docs/rescriere-etapa0.md`).

**Rămâne deschis în etapa 0 (doar la proprietară):** numerele de ajutor (`docs/resurse-de-verificat.md`); citirea directă a prospectului de pe anm.ro pentru cele trei puncte neconfirmate; testarea cu pacientele, după `docs/ghid-testare.md`; review și merge pentru PR #5.

### Etapa 1 (2026-10-08)
- Deciziile proprietarei: buton mic pe toate ecranele; mesajele le scrie Claude, le aprobă proprietara; sprijinul apare cu 3 zile înainte de control; un PR pe etapă. Textele aprobate sunt în `docs/etapa1-texte.md`.
- „Am nevoie de liniște acum” (`CalmModal`): un buton rotund deasupra barei de jos, pe toate filele. Fluxul: mesaj cald → respirație lentă → „Te simți puțin mai liniștită?”. „Da, puțin” se încheie cu un mesaj; „Nu încă” deschide „Ajutor” cu „E în regulă să ceri ajutor.”
- Jurnalul care răspunde: după salvare apare un mesaj aprobat pentru starea aleasă (3 pe stare, se schimbă zilnic; `src/data/comfort.ts`); la „Foarte rău” apare și linkul „Am nevoie de ajutor”.
- Sprijin înaintea controlului: card pe Astăzi cu 1–3 zile înainte („Controlul se apropie…”) și în ziua controlului („Multă putere azi”), cu „Întrebările pentru medic” și „Un moment de liniște”.
- Butonul de închidere de la respirație are acum etichetă pentru cititorul de ecran.
- De urmărit la testare: în jurnal, selectorul de stare are deja o propoziție caldă; cu mesajul nou, pacienta vede două.
- `npm test` (69) și `npm run build` trec; verificat la 390px.

## În toate etapele
Testare cu pacientele după fiecare etapă; litere mari și cititor de ecran; fără overflow la 390px; limbaj simplu, fără termeni neexplicați; `npm test` și `npm run build` înainte de push.

## Următorul pas
PR pentru etapa 1, apoi proprietara alege pașii pentru etapa 2 („Te înțeleg”); în paralel, confirmările rămase din etapa 0 și testarea cu pacientele.
