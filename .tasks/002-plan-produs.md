# 002 — Planul aplicației: încredere, apoi căldură

**Stare:** gata. Etapele 0–5 integrate în main; ce a rămas în plan a fost scos (decizia proprietarei, 2026-10-08)
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
| 0 | Încredere: conținut medical cu surse, resurse de ajutor reale, ghid de testare | încheiată (prospect verificat, PR #27; liniile de sprijin scoase, decizia proprietarei) | PR #5, #27 |
| 1 | „Nu ești singură”: buton „Am nevoie de liniște acum”, jurnal care răspunde (mesaje scrise de om), sprijin înaintea controalelor | integrată, de testat cu pacientele | PR #7 |
| 2 | „Te înțeleg”: rezumatul săptămânii, pregătirea vizitei la medic, mici victorii | gata, de testat cu pacientele | PR (ramura claude/etapa2) |
| 3 | „Cercul tău”: rezumat și idei pentru familie, doar cu acordul pacientei | gata, de testat cu pacientele | PR (ramura claude/etapa3) |
| 4 | Continuitate: memento-uri, sincronizare criptată opțională, PIN | gata: PIN și memento în calendarul telefonului; sincronizarea criptată și memento-urile push scoase din plan (decizia proprietarei) | PR (ramura claude/etapa4) |
| 5 | Mesaje mai bogate după nota din Jurnal (fără AI, decizia proprietarei) | gata | PR #29 |

## Etapa 0 — pașii
1. **Inventarul conținutului medical** → `docs/continut-medical.md`: fiecare afirmație din `src/data/guides.ts`, `src/lib/interactions.ts`, „Noutăți” (ASCO 2026, Stockholm), `RedFlagsModal`, `OnboardingModal` („Recomandare clinică…”), `TreatmentTab`, cu stare: are sursă / de verificat / de scos.
2. **Rescrierea din surse oficiale**: prospectul Tamoxifen aprobat în România, ghidurile ESMO și NCCN pentru pacienți, NICE, după caz. Fiecare ghid primește sursă și dată. Ce nu se poate susține se scoate sau rămâne „DE COMPLETAT”. Fiecare text rescris trece prin proprietară (chestionar) înainte de a intra în aplicație.
3. **Sursele în aplicație**: „Sursa: …, actualizat la …” sub fiecare ghid, plus nota „Informații generale, nu înlocuiesc sfatul medicului tău”.
4. **Resurse de ajutor reale pentru România** (112, linii de sprijin emoțional, asociații de paciente): fiecare număr se verifică pe site-ul oficial al organizației înainte de a intra în aplicație; niciun număr scris din memorie.
5. **Verificarea interacțiunilor**: se pune în aplicație doar după pasul 2, cu surse.
6. **Ghid de testare cu pacientele** → `docs/ghid-testare.md`: ce încearcă, ce întrebări le punem, cum notăm răspunsurile (fără date medicale personale).

## Etapa 5 — limitele pentru AI (de stabilit în detaliu atunci)
- doar mesaje de sprijin emoțional, niciodată sfaturi medicale, doze sau diagnostic;
- la orice semn de criză sau simptom sever: mesaj fix, scris de om, cu 112 și medicul, fără AI (liniile de sprijin nu sunt în aplicație);
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
- `HelpModal`: 112 primul (cu semnalele de alarmă), echipa medicală (e-mail oncolog din profil; psihologul sau asistentul social din spital), respirație și 5-4-3-2-1, persoana de sprijin. Liniile de sprijin veneau din `src/data/helpLines.ts`, gol până la confirmare (scoase ulterior, decizia proprietarei).
- Lista de verificat (ștearsă ulterior): `docs/resurse-de-verificat.md` (ARPS 0800 801 200 cu program contradictoriu și anunț de nefuncționare, 116 123, Colegiul Pacienților, OncoHelp, M.A.M.E., canceruldesan.ro).
- Verificat la 390px, fără overflow. `npm test` (57) și `npm run build` trec.

**În așteptare (proprietara):** confirmarea numerelor (renunțat ulterior: liniile nu intră în aplicație, vezi „Etapa 0: liniile de sprijin scoase”).

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

**Rămâne deschis în etapa 0 (doar la proprietară):** numerele de ajutor (renunțat, liniile nu intră în aplicație); citirea directă a prospectului de pe anm.ro pentru cele trei puncte neconfirmate (închisă mai jos, „Etapa 0: prospectul românesc”); testarea cu pacientele, după `docs/ghid-testare.md`. PR #5 a fost integrat pe 2026-10-08.

### Etapa 1 (2026-10-08)
- Deciziile proprietarei: buton mic pe toate ecranele; mesajele le scrie Claude, le aprobă proprietara; sprijinul apare cu 3 zile înainte de control; un PR pe etapă. Textele aprobate sunt în `docs/etapa1-texte.md`.
- „Am nevoie de liniște acum” (`CalmModal`): un buton rotund deasupra barei de jos, pe toate filele. Fluxul: mesaj cald → respirație lentă → „Te simți puțin mai liniștită?”. „Da, puțin” se încheie cu un mesaj; „Nu încă” deschide „Ajutor” cu „E în regulă să ceri ajutor.”
- Jurnalul care răspunde: după salvare apare un mesaj aprobat pentru starea aleasă (3 pe stare, se schimbă zilnic; `src/data/comfort.ts`); la „Foarte rău” apare și linkul „Am nevoie de ajutor”.
- Sprijin înaintea controlului: card pe Astăzi cu 1–3 zile înainte („Controlul se apropie…”) și în ziua controlului („Multă putere azi”), cu „Întrebările pentru medic” și „Un moment de liniște”.
- Butonul de închidere de la respirație are acum etichetă pentru cititorul de ecran.
- De urmărit la testare: în jurnal, selectorul de stare are deja o propoziție caldă; cu mesajul nou, pacienta vede două.
- `npm test` (72) și `npm run build` trec; verificat la 390px.

### Etapa 2 (2026-10-08)
- Deciziile proprietarei: rezumat în Jurnal, în cuvinte; pagina „Pentru medic”; victorii pentru doze și note; textele le scrie Claude și le aprobă proprietara (`docs/etapa2-texte.md`).
- „Săptămâna ta” (Jurnal): zilele notate, starea cea mai des, somnul și bufeurile comparate cu săptămâna trecută, doar când există date în ambele săptămâni (`src/lib/summary.ts`).
- „Pentru medic” (fereastra vizitei): doze marcate în 28 de zile, note, cele mai dese 3 simptome, întrebări nediscutate și descărcarea raportului PDF.
- „O mică victorie” (Astăzi): praguri pe total (doze 7/30/100/365, note 1/10/50), fără „ai pierdut seria”; „Mulțumesc” o ascunde și ține minte.
- Reparat: copia de siguranță pierdea întrebările pentru medic, programările și numele medicului.
- `npm test` (84) și `npm run build` trec; verificat la 390px.

### Etapa 3 (2026-10-08)
- Deciziile proprietarei: mesaj scurt ales de pacientă; trimitere prin meniul de partajare al telefonului; lista „Cum mă poți ajuta”; pacienta vede textul exact, îl poate modifica și apasă ea „Trimite”. Textele aprobate: `docs/etapa3-texte.md`.
- `SupporterModal`: „Cum mă simt azi” (5 stări), „Cum mă poți ajuta” (10 idei de bifat), mesajul editabil, „Trimite” (`navigator.share`; altfel copiere, cu mesaj clar; altfel instrucțiuni). Datele în `src/data/circle.ts`.
- Scos: bifa „Reamintește-i discret dacă omit pastila 2 zile la rând” (promisiune neținută), mesajul fix „azi am o stare bună” și butoanele WhatsApp/SMS.
- Câmpul „Număr de telefon” scos (decizia proprietarei); numerele salvate se șterg la deschidere.
- `npm test` (95) și `npm run build` trec; verificat la 390px.

### Etapa 4, partea 1: PIN pe telefon (2026-10-08)
- Deciziile proprietarei: întâi PIN-ul, fără server; 4 cifre; blocare la fiecare deschidere și după 5 minute în fundal; PIN uitat = ștergere și restaurare din copie. Textele aprobate: `docs/etapa4-texte.md` (cu nota despre limitele unui PIN de 4 cifre).
- `src/lib/vault.ts`: cu PIN activ, în localStorage stă doar `oncosentinel_vault` (AES-GCM, cheie PBKDF2-SHA256, 310.000 de iterații); cât timp aplicația e deblocată, citirile și scrierile merg într-o copie din memorie și fiecare scriere se recriptează. Activare, deblocare, blocare, dezactivare, ștergere.
- `VaultGate` (în `main.tsx`): ecranul de blocare înaintea aplicației, blocare după 5 minute în fundal, aplicația se remontează după deblocare. „Siguranța datelor”: „Protejează cu PIN” și textul despre criptare după starea PIN-ului.
- Restaurarea dintr-o copie așteaptă scrierea criptată înainte de reîncărcare.
- După verificare (2 probleme blocante găsite și reparate): conversia base64 pe bucăți (datele mari dădeau eroare și blocau scrierile următoare); activarea protejată de apăsare dublă; scrierile comasate printr-o coadă care nu rămâne blocată după o eroare; generații, ca o scriere veche să nu readucă seiful după ștergere sau blocare; interceptarea rămâne instalată și, cât e blocat, ignoră scrierile (nimic în clar); eroare clară la scoaterea PIN-ului cu spațiu plin; altă filă care schimbă seiful blochează fila curentă. A doua verificare: tratate și fila fără PIN când alta activează PIN-ul, fila blocată când alta scoate PIN-ul, ștergerea din altă filă și scrierile din timpul blocării.
- Verificat în browser real: după activare, în localStorage rămâne doar seiful, fără date în clar; după reîncărcare cere PIN-ul; după deblocare datele sunt acolo.
- `npm test` (118) și `npm run build` trec; verificat la 390px și în browser real.

### Reparații după prima testare cu pacientele (2026-10-08)
- Observațiile proprietarei (capturi de pe Android), 12 probleme. Texte aprobate: etichetele 1–5 de pe Astăzi „Greu / Obosită / Liniștită / Bine / Foarte bine”; titlul „Cum te simți azi?”; la configurare „Ce doză ți-a prescris medicul?” (câmp liber, „20 mg” completat, „Scrie cum apare pe rețetă.”); „Luat azi” cu o singură bifă.
- Data controlului de la configurare dispărea: fereastra „Controale medicale”, montată mereu, scria lista goală la pornire și ștergea data. Acum data intră în lista de controale (`src/lib/appointments.ts`); o dată care lipsește din listă devine programare. Același lucru și la data schimbată din Dosar.
- Bara de jos: conținutul are loc dedesubt (spațiu comun în `main`), iar inima stă deasupra barei.
- Cardul pastilei: numele întreg, doza și frecvența dedesubt. Profil: numele nu mai e ascuns de eticheta diagnosticului.
- Jurnal: „Săptămâna ta” prima, apoi starea de azi, formularul de simptome (fără steluță), documentele la final.
- „Controale medicale”: „Adaugă” nu mai iese din ecran, iar cardurile sunt aliniate. Planta din cardul roz are floare.
- `npm test` (127) și `npm run build` trec; verificat la 390px. Agentul `verificare`: nimic blocant; reparat și cazul unui control trecut rămas „viitor”.

### Reparații după testare, runda 2 (2026-10-08)
- Deciziile proprietarei: o notă pe zi în Jurnal (a doua salvare o actualizează: „Actualizează nota de azi”, apoi „Am salvat nota de azi.”); butonul în roz mai intens (petal-600); ștergerea din Istoric cu „Nota a fost ștearsă.” și „Anulează” timp de 5 secunde; în calendarul din Tratament, ziua controlului marcată („Control la medic” în legendă) și lista „Programările următoare”, din „Controale medicale”.
- „Salvează în jurnal” funcționa, dar părea inactiv și nu arăta clar că a salvat, așa că pacienta a apăsat de mai multe ori (4 note la fel). Duplicatele vechi se pot șterge acum din Istoric.
- Cardul verde de jos de pe Astăzi: doar inima, fără plantă. Alerta de simptom puternic din Jurnal urcă deasupra barei.
- Lista „Programările următoare” nu apare când nu există controale viitoare.
- După `verificare` (nimic blocant): „Anulează” dispare după o salvare nouă (fără două note pe zi); mesajul de ștergere și alerta de simptom stau una sub alta; buton de ștergere mai mare.
- `npm test` (134) și `npm run build` trec; verificat la 390px.

### Aderența din Tratament (2026-10-08)
- Bug: când luna nu avea încă nicio zi de numărat, cardul arăta 100% și „0 doze luate din 31 zile”. Aprobate: „—” cu „Încă nu sunt zile de numărat în această lună.”; rândul devine „Ai marcat 5 din 8 zile.” (acord corect: „1 din 1 zi”, „20 din 20 de zile”).
- Test nou `aderenta.test.tsx` (pică pe codul vechi). `npm test` (138) și `npm run build` trec.

### Două buguri mici (2026-10-08)
- Profil: un control adăugat din Profil devenea „următorul control” chiar dacă în listă era unul mai vechi (se lua primul din listă, nu cel mai apropiat viitor). Acum Profilul folosește aceeași listă și aceeași regulă ca „Controale medicale” (`saveAppointments` în `src/lib/appointments.ts`) și se actualizează când lista se schimbă în altă parte. Tipul de stare duplicat („done”) a fost scos.
- Tratament: fără data de început a tratamentului, calendarul socotea toate zilele trecute ca sărite (de la anul 2000). Acum se numără de la prima doză notată sau, dacă nu există nicio doză, de azi.
- Test nou `controale-si-calendar.test.tsx` (pică pe codul vechi). `npm test` (142) și `npm run build` trec.

### Butonul Back al telefonului (2026-10-08)
- Observația proprietarei: Back ieșea din aplicație de pe orice ecran. Deciziile ei: Back duce la ecranul anterior, până la Astăzi, și de acolo iese; o fereastră deschisă se închide cu Back.
- `src/lib/backNavigation.ts`: fiecare ecran deschis adaugă o intrare în istoricul browserului (`pushScreen`), iar fiecare fereastră adaugă una (`useBackToClose`). Dacă închizi o fereastră din butonul ei, intrarea ei se scoate, ca să nu rămână o apăsare de Back fără efect. Acoperă ferestrele din App (Ajutor, semnale de alarmă, liniște, respirație, 5-4-3-2-1, controale, profil, cont, cercul tău), ghidurile și știrile deschise, fotografia de pe Astăzi, editarea tratamentului, ferestrele din Profil și din Dosar. Configurarea inițială nu se închide cu Back.
- Verificat în Chromium: fereastră → ecranul anterior → Astăzi → ieșire din aplicație.
- După `verificare` (nimic blocant): reparate o apăsare Back pierdută după blocarea cu PIN, cursa respirație → „Te simți mai liniștită?” și coliziunea id-urilor după reîncărcare (id-uri pe timp).
- După reblocarea cu PIN sau reîncărcare, Back poate duce încă la ecranele vizitate înainte (istoricul browserului rămâne).
- Test nou `back-telefon.test.tsx` (pică pe codul vechi). `npm test` (147) și `npm run build` trec.

### Jurnal: nota și simptomele separate (2026-10-08)
- Observația proprietarei: salvarea notei lua și simptomele (inclusiv cele completate din salvări mai vechi). Deciziile ei: două intrări separate pe zi („Salvează în jurnal” = stare și gânduri; „Salvează simptomele” = formularul), fiecare actualizată la a doua salvare din aceeași zi; efect pe buton: verde, cu bifă și „Salvat”, 2 secunde.
- `SymptomLog.kind` ('note' | 'symptoms'; lipsă = intrare veche, cu ambele), câmpurile de simptome devin opționale. Istoricul arată „Simptome” cu icon separat. Raportul PDF pune „-” la simptome pentru note. Alerta de simptom puternic apare doar la salvarea simptomelor.
- După `verificare` (nimic blocant): „Pentru medic” și victoriile numără doar notele (simptomele o dată); comparația bufeurilor ignoră săptămânile doar cu note; salvarea unei părți nu mai resetează cealaltă parte, nesalvată.
- Rămas, acceptat: o intrare veche (cu ambele părți) din ziua actualizării rămâne lângă cele noi.
- Test nou `jurnal-separat.test.tsx` (pică pe codul vechi). `npm test` (153) și `npm run build` trec; verificat la 390px.

### Memento zilnic în calendarul telefonului (2026-10-08)
- Deciziile proprietarei: doar calendarul telefonului (fără server și fără push); text discret „E ora pastilei tale. Ai grijă de tine.”, fără numele medicamentului; două butoane („Google Calendar” și „Alt calendar (iPhone, Samsung…)”); cardul „Memento zilnic” în Tratament. Pacientele de test au și iPhone.
- `src/lib/calendarReminder.ts`: fișier .ics cu eveniment zilnic (RRULE:FREQ=DAILY), oră locală, alertă la ora pastilei; legătură Google Calendar cu evenimentul completat. Pe iPhone, fișierul descărcat se deschide din Descărcări („Adaugă tot”).
- De verificat cu pacientele: adăugarea pe iPhone și pe Samsung; memento-ul nu se actualizează singur la schimbarea orei (nota din card spune asta).
- După `verificare` (nimic blocant): ora invalidă cade pe 08:00; fișierul se descarcă și pe iPhone (aplicația rămâne pe ecran); mesaj clar dacă fișierul nu se poate crea (text aprobat); eticheta „se deschide într-o filă nouă” pentru cititorul de ecran.
- Test nou `memento-calendar.test.tsx`. `npm test` (158) și `npm run build` trec; verificat la 390px.

### Dosar: scos cardul de control (2026-10-08)
- Observația proprietarei: programarea din Dosarul medical nu își mai are locul acolo. Am scos cardul „Supraveghere Oncologică & Imagistică” (avea și „1 zile” / „1 de zile”). Controalele rămân în „Controale medicale”, pe Astăzi, în Profil și în calendarul din Tratament.
- `npm test` (158) și `npm run build` trec.

### Etapa 0: prospectul românesc (2026-10-08)
- Proprietara a trimis prospectul Tamoxifen Sandoz (ANMDMR, revizuit în martie 2025); cele trei puncte neconfirmate sunt închise (detalii și texte aprobate în `docs/rescriere-etapa0.md`, „Prospectul citit direct”).
- g1: doza uitată doar după prospectul românesc; „în timpul mesei”; chirurgul anunțat înaintea unei operații. Medicamente: estrogenii cu contracepție fără hormoni până la 2 luni după; „Anastrozol, letrozol și alți inhibitori de aromatază”.
- Test nou în `medical-content.test.ts` (pică pe codul vechi). `npm test` (169) și `npm run build` trec.

### Etapa 0: liniile de sprijin scoase (2026-10-08)
- Decizia proprietarei: liniile de sprijin nu mai intră în aplicație. Scoase `src/data/helpLines.ts`, secțiunea goală din `HelpModal` și lista `docs/resurse-de-verificat.md`. „Ajutor” rămâne cu 112, echipa medicală, exercițiile de liniștire și persoana de sprijin.
- `npm test` (169) și `npm run build` trec.

**Etapa 0 e încheiată.** Rămâne doar testarea cu pacientele, după `docs/ghid-testare.md`.

### Etapa 5: fără AI, mesaje mai multe (2026-10-08)
- Deciziile proprietarei: mesajele doar după nota din Jurnal; fără AI, pentru că nu vrea să plătească generarea, iar planurile gratuite pot folosi textele pentru antrenare. În loc de AI: 10 mesaje pe stare (7 noi) și mesaje pe subiecte, alese pe telefon după cuvintele din notă. Texte aprobate: `docs/etapa5-texte.md`. (Deciziile pentru AI, dacă revine: după notă, doar starea + gândurile, întrebare la prima notă.)
- `journalResponseFor` (`src/data/comfort.ts`): întâi criza (la orice stare: mesaj fix, „Sună la 112” și „Am nevoie de ajutor”), apoi subiectul (control, frică, somn, oboseală, bufeuri, singurătate; doar la Greu, Obosită, Liniștită), apoi lista stării. Căutarea ignoră diacriticele și literele mari.
- După `verificare` (nimic blocant): „o singură dată” nu mai e luat drept singurătate; „frici” și „temeri” recunoscute; „Păstrează-o” scris corect.
- Test nou `etapa5-mesaje.test.tsx`. `npm test` (174) și `npm run build` trec; verificat la 390px.

### Culoarea butoanelor 112 (2026-10-08)
- Decizia proprietarei: butoanele „Sună la 112” (Jurnal, Ajutor), „Apelează 112” (Semnale de alarmă) și „SOS Urgențe” (Astăzi) în petal închis (`bg-petal-700`, din paletă; contrast cu alb ≈ 6,2:1). Restul alertelor rămân cum sunt.
- Test nou `culoare-112.test.tsx`. `npm test` (176) și `npm run build` trec; verificat la 390px.

## În toate etapele
Testare cu pacientele după fiecare etapă; litere mari și cititor de ecran; fără overflow la 390px; limbaj simplu, fără termeni neexplicați; `npm test` și `npm run build` înainte de push.

### Back după PIN și nota dublată; planul închis (2026-10-08)
- Back: după deblocarea cu PIN sau după reîncărcare, intrările rămase în istoricul browserului de dinainte sunt sărite (fiecare pornire are marcajul ei în `src/lib/backNavigation.ts`); de pe Astăzi, Back iese din aplicație.
- Jurnal: o intrare veche de azi (fără tip, cu notă și simptome) se actualizează pe partea salvată, în loc să apară o a doua intrare lângă ea; butonul arată „Actualizează nota de azi”.
- Scoase din plan (decizia proprietarei): sincronizarea criptată, memento-urile push, diacriticele în PDF și testarea programată cu pacientele (`docs/ghid-testare.md` rămâne, pentru când e nevoie).
- Teste noi în `back-telefon.test.tsx` și `jurnal-separat.test.tsx` (pică pe codul vechi). `npm test` (178) și `npm run build` trec.

## Următorul pas
Planul 002 e încheiat. Pentru lucrul următor: decizia proprietarei.
