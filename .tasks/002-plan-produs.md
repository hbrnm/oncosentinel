# 002 — Planul aplicației: încredere, apoi căldură

**Stare:** în lucru (etapa 0)
**Ramura:** claude/plan-produs (planul); fiecare etapă pe ramura ei

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
| 0 | Încredere: conținut medical cu surse, resurse de ajutor reale, ghid de testare | în lucru (pașii 1–2: PDF, Noutăți, ghiduri, ecrane, rețete) | |
| 1 | „Nu ești singură”: buton „Am nevoie de liniște acum”, jurnal care răspunde (mesaje scrise de om), sprijin înaintea controalelor | de făcut | |
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

## În toate etapele
Testare cu pacientele după fiecare etapă; litere mari și cititor de ecran; fără overflow la 390px; limbaj simplu, fără termeni neexplicați; `npm test` și `npm run build` înainte de push.

## Următorul pas
Etapa 0, pasul 4: pagina „Ajutor” cu resurse verificate din România; apoi semnalele de alarmă.
