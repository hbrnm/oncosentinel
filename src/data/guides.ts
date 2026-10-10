export interface ClinicalGuide {
  id: string;
  tag: string;
  title: string;
  summary: string;
  content: string;
  category: 'tratament' | 'stil_viata' | 'emotional' | 'monitorizare';
  image_url?: string;
}

export interface NewsProtocol {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

export const CLINICAL_GUIDES: ClinicalGuide[] = [
  {
    id: 'g1',
    tag: 'GHIDURI & INFORMAȚII',
    title: 'Tamoxifen: ce face și cum îl iei',
    summary: 'Cum acționează, cum îl iei, ce faci dacă ai uitat o doză și când suni la medic.',
    category: 'tratament',
    content: `### Ce face tamoxifenul

Tamoxifenul blochează acțiunea estrogenului asupra celulelor din sân. După DCIS, poate scădea riscul ca boala să revină sau să apară un cancer nou în oricare dintre sâni.

Într-un studiu mare cu femei operate și iradiate pentru DCIS (NSABP B-24), urmărite 15 ani, cancerul invaziv în același sân a fost cu aproximativ o treime mai rar la cele care au luat tamoxifen. Un nou cancer în celălalt sân a apărut la 7,3% dintre ele, față de 10,8% fără tamoxifen.

### Cum îl iei

* O dată pe zi, la aceeași oră, în timpul mesei, cu un pahar cu apă. Comprimatul se înghite întreg, fără să-l mesteci.
* Doza și durata ți le stabilește medicul. Nu opri tratamentul fără să vorbești cu el.
* Dacă urmează o operație, inclusiv o reconstrucție a sânului, spune-i chirurgului că iei tamoxifen.

### Ai uitat o doză?

Nu lua niciodată două doze deodată ca să o recuperezi. Dacă nu știi ce să faci cu doza uitată, întreabă medicul sau farmacistul.

### Alte medicamente și suplimente

Unele medicamente pot scădea efectul tamoxifenului. Prospectul recomandă să fie evitate, pe cât posibil, medicamentele care blochează puternic enzima CYP2D6, de exemplu paroxetina, fluoxetina, bupropionul, chinidina și cinacalcetul. Cât de mult contează acest lucru pentru rezultatul tratamentului nu e încă pe deplin lămurit.

Spune medicului sau farmacistului de fiecare dată când începi un medicament nou, inclusiv suplimente sau ceaiuri. Dacă ai nevoie de un antidepresiv, medicul poate alege unul care nu interferează cu tamoxifenul.

### Efecte secundare frecvente

Bufeurile sunt cele mai frecvente. Mai pot apărea scurgeri vaginale, greață la început (ajută să-l iei cu mâncare sau seara; de obicei trece cu timpul), crampe în picioare, dureri de cap sau păr mai subțire. Spune-i medicului dacă te deranjează: de multe ori există ce se poate face.

> Fii blândă cu tine: nu ești singura care trece prin asta.

### Când suni la 112 sau la medic

* **Sună la 112** dacă ai brusc respirație grea sau durere în piept, umflare bruscă a feței, a buzelor sau a gâtului, sau semne de accident vascular cerebral: vorbire neclară, vedere încețoșată brusc, amorțeală bruscă la față, braț sau picior.
* **Anunță repede medicul** dacă ai durere sau umflare la un picior, orice sângerare vaginală neobișnuită ori scurgere cu sânge (mai ales după menopauză) sau schimbări ale vederii.

### Controlul ginecologic

Dacă nu ai simptome, ecografia transvaginală de rutină nu e recomandată, decât dacă medicul consideră că ai un risc crescut. Important e să raportezi orice sângerare neobișnuită. Mergi în continuare la controalele ginecologice obișnuite.

*Surse: prospectul Tamoxifen Sandoz aprobat în România (ANMDMR, revizuit în martie 2025); Rezumatul caracteristicilor produsului pentru tamoxifen (secțiunea 4.5); Macmillan Cancer Support și Breast Cancer Now, paginile despre tamoxifen; ACOG Committee Opinion nr. 601, „Tamoxifen and Uterine Cancer” (2014); Wapnir și colab., Journal of the National Cancer Institute, 2011 (NSABP B-17 și B-24).*`
  },
  {
    id: 'g7',
    tag: 'GHIDURI & INFORMAȚII',
    title: 'Primele 30 de zile cu tamoxifen',
    summary: 'Ce poate apărea la început, ce te ajută și când vorbești cu medicul.',
    category: 'tratament',
    content: `### E firesc să-ți fie teamă

Multe femei spun că cel mai greu a fost înainte de prima pastilă, citind lista de efecte. Lista arată tot ce poate apărea, nu ce vei avea tu. Unele efecte scad pe măsură ce corpul se obișnuiește.

### Ce poate apărea la început

* Bufeuri și transpirații: pot deveni mai rare în timp (vezi ghidul despre bufeuri).
* Oboseală: îți împarte ziua cu pauze; mișcarea ajută (vezi ghidul despre mișcare).
* Dispoziție schimbătoare: te poți simți tristă sau abătută.
* Sângerare vaginală la început. Dacă ține mai mult de câteva zile sau ești după menopauză, spune medicului. Ciclul poate deveni neregulat, mai slab sau se poate opri; contracepția rămâne necesară.
* Dureri de mușchi sau articulații, crampe: spune medicului, poate recomanda ceva.

### Dispoziția

Poate ajuta să vorbești cu cei apropiați. Dacă tristețea sau stările schimbătoare țin mai mult de câteva săptămâni, spune medicului sau farmacistului. Notarea dispoziției în aplicație te ajută să vezi cum evoluează.

### Ce te ajută în primele săptămâni

* Pastila la aceeași oră în fiecare zi; marcheaz-o în Tratament.
* Notează în jurnal ce simți și când. La control vei avea date, nu doar amintiri.
* Cere rețeta nouă înainte să termini pastilele.

### Dacă îți e greu

Nu opri tamoxifenul singură. Spune medicului ce simți: adesea există ce se poate face.

### Când suni la 112 sau la medic

* Semnele importante sunt în ghidul „Tamoxifen: ce face și cum îl iei”.
* Anunță imediat medicul sau mergi la urgențe dacă ai o erupție care se întinde, bășici sau piele care se cojește, ori răni pe buze sau în gură.

> Fii răbdătoare cu tine: începutul e partea cea mai grea.

*Sursa: Macmillan Cancer Support, pagina „Tamoxifen” (accesată în octombrie 2026).*`
  },
  {
    id: 'g2',
    tag: 'STIL DE VIAȚĂ & CONFORT',
    title: 'Bufeurile și transpirațiile de noapte',
    summary: 'Ce ajută cu adevărat, după studii, și ce poți încerca pentru confort.',
    category: 'stil_viata',
    content: `### De ce apar

Bufeurile sunt printre cele mai frecvente efecte ale tamoxifenului. Nu înseamnă că tratamentul nu merge și nu sunt periculoase, dar pot obosi și pot strica somnul. Merită să vorbești despre ele cu medicul.

### Ce a funcționat în studii

* **Terapia cognitiv-comportamentală (TCC)**, cu un psiholog: face bufeurile mai ușor de purtat și mai puțin deranjante.
* **Hipnoza clinică**, cu un specialist: a redus numărul și intensitatea bufeurilor.
* **Tratamente fără hormoni, prescrise de medic.** Unele antidepresive nu se potrivesc cu tamoxifenul, așa că alegerea e a medicului oncolog.

### Pentru confort

Măsurile de mai jos nu au redus bufeurile în studii, dar multe femei le găsesc plăcute:

* haine în straturi, din bumbac sau in, pe care le poți scoate repede;
* un ventilator, o cameră răcoroasă noaptea, o băutură rece la îndemână;
* jurnalul din aplicație, ca să vezi dacă anumite momente le declanșează.

### Plante și suplimente

Suplimentele din plante și cele cu soia nu sunt recomandate pentru bufeuri, iar unele pot interacționa cu tamoxifenul. Întreabă medicul înainte să iei ceva.

*Sursa: The Menopause Society (NAMS), „The 2023 nonhormone therapy position statement”, Menopause 2023; 30(6):573–590.*`
  },
  {
    id: 'g3',
    tag: 'SUPRAVEGHERE & IMAGISTICĂ',
    title: 'Controalele după tratament',
    summary: 'Ce controale urmează de obicei după DCIS. Calendarul tău îl stabilește medicul.',
    category: 'monitorizare',
    content: `### Mamografia

După operația care păstrează sânul, ghidurile recomandă **mamografie o dată pe an**. Ghidul britanic NICE o recomandă anual cel puțin 5 ani, inclusiv după DCIS. Prima mamografie se face, de obicei, la 6–12 luni după tratament.

### Vizitele la medic

Ghidul european ESMO recomandă vizite mai dese în primii ani (la 3–6 luni), apoi tot mai rar, până la o dată pe an. Medicul adaptează ritmul după riscul tău și după ce simți tu.

### Controlul ginecologic

În timpul tratamentului cu tamoxifen, mergi la controalele ginecologice obișnuite și raportează orice sângerare neobișnuită (vezi ghidul despre tamoxifen).

> Notează datele în aplicație: îți arată câte zile mai sunt și te ajută să pregătești întrebările pentru medic.

*Surse: NICE NG101, „Early and locally advanced breast cancer: diagnosis and management” (2018, actualizat); ESMO, „Early breast cancer: Clinical Practice Guideline” (Annals of Oncology, 2024); NCCN și ASTRO, prin ACR Appropriateness Criteria pentru DCIS (2025).*`
  },
  {
    id: 'g4',
    tag: 'STIL DE VIAȚĂ & ALIMENTAȚIE',
    title: 'Ce mănânci după diagnostic',
    summary: 'Ce spun ghidurile despre mese, greutate, soia, alcool și suplimente.',
    category: 'stil_viata',
    content: `### Pe scurt

Nu există o dietă care să vindece sau să împiedice revenirea cancerului de sân. Ghidurile recomandă același fel de a mânca ce ajută sănătatea în general.

### Un fel de a mânca ce ajută

* multe legume, fructe, cereale integrale și leguminoase (fasole, linte, năut);
* mai puțină carne roșie și cât mai puține mezeluri, cereale rafinate și băuturi îndulcite;
* mai multe fibre: femeile care mănâncă mai multe fibre după cancerul de sân au evoluții mai bune. Nu e sigur că adăugarea lor schimbă evoluția, dar ghidul sugerează să încerci.

### Greutatea

Dacă nu ești subponderală, ghidul sugerează să eviți să iei în greutate în timpul și după tratament. Nu e sigur că o dietă de slăbit schimbă evoluția, așa că vorbește întâi cu medicul.

### Soia

Dacă mănânci deja alimente din soia (tofu, lapte de soia), nu e nevoie să renunți la ele. Nici nu e nevoie să începi să mănânci soia ca să te protejezi: dovezile nu susțin asta.

Pastilele și pulberile cu extract de soia sau izoflavone nu sunt mâncare. Nu le lua fără să întrebi medicul.

### Alcoolul

Alcoolul este o cauză dovedită a mai multor tipuri de cancer. De aceea, ghidul ACS recomandă evitarea lui și după cancer, ca să scadă riscul unui cancer nou.

### Suplimentele

* Ghidurile cer prudență cu suplimentele, în timpul și după tratament.
* Vitamina D: femeile cu un nivel mai bun de vitamina D au evoluții mai bune, dar suplimentele nu au arătat niciun beneficiu în studii.
* Unele suplimente pot interacționa cu tamoxifenul. Vezi „Medicamente” în Ghiduri și întreabă medicul sau farmacistul înainte să iei ceva.

### Înainte de schimbări mari

Vorbește cu echipa medicală înainte să-ți schimbi mult alimentația. Un dietetician te poate ajuta să găsești ce ți se potrivește.

*Sursa: World Cancer Research Fund International, „Diet, nutrition, physical activity and body weight for people living with and beyond breast cancer”, 2024; Rock CL și colab., „American Cancer Society nutrition and physical activity guideline for cancer survivors”, CA Cancer J Clin 2022; 72:230–262.*`
  },
  {
    id: 'g5',
    tag: 'STIL DE VIAȚĂ & MIȘCARE',
    title: 'Mișcarea și exercițiile cu greutăți',
    summary: 'Cât, cum începi în siguranță și ce trebuie știut despre braț.',
    category: 'stil_viata',
    content: `### De ce contează

Exercițiile sunt în general sigure după cancer, iar ghidurile spun să eviți statul nemișcată. În studii, mișcarea regulată a redus oboseala, anxietatea și tristețea și a ajutat la puterea de zi cu zi.

### Cât

* Ținta pentru sănătate: 150–300 de minute pe săptămână de mișcare moderată (de exemplu mers alert) sau 75–150 de minute de mișcare intensă. La asta se adaugă exerciții pentru mușchi în cel puțin 2 zile pe săptămână.
* Dacă azi nu poți atât, fă cât poți. Fiecare plimbare contează.
* Din studii: împotriva oboselii a ajutat mișcarea moderată de 3 ori pe săptămână, timp de cel puțin 12 săptămâni. Pentru somn a ajutat mersul pe jos de 3–4 ori pe săptămână, câte 30–40 de minute.

### Exercițiile cu greutăți

Un program pentru mușchii mari, de 2–3 ori pe săptămână, e sigur dacă începi ușor și crești încet, cu un specialist în exercițiu fizic alături (de exemplu un kinetoterapeut).

Dacă ai operat ganglionii de la axilă sau ai deja brațul umflat, primele ședințe fă-le cu un specialist. Încă nu se știe dacă e sigur să începi singură, fără îndrumare.

### Brațul (limfedemul)

* Multă vreme li s-a spus femeilor să-și cruțe brațul. Studiile arată că exercițiile de forță supravegheate, crescute treptat, sunt sigure. Mersul, bicicleta și alte exerciții de rezistență par și ele sigure.
* Manșonul compresiv în timpul exercițiilor: nu există dovezi clare nici pentru, nici împotrivă, așa că alegerea e a ta.
* Dacă brațul se umflă, devine greu sau te doare, spune medicului.

### Când întrebi medicul înainte

* Dacă ai o boală de inimă sau altă boală cronică, întreabă medicul înainte să începi un program nou.
* Dacă apare o durere nouă de os, care nu trece, oprește exercițiile și spune medicului.

*Sursa: Campbell KL și colab., „Exercise Guidelines for Cancer Survivors: Consensus Statement from International Multidisciplinary Roundtable”, Med Sci Sports Exerc 2019; 51(11):2375–2390; Rock CL și colab., ghidul American Cancer Society pentru supraviețuitori, CA Cancer J Clin 2022; 72:230–262.*`
  },
  {
    id: 'g6',
    tag: 'EMOȚIONAL',
    title: 'Meditația și yoga',
    summary: 'Ce arată studiile pentru neliniște și starea de spirit și cum poți începe.',
    category: 'emotional',
    content: `### Ce arată studiile

În 2023, un ghid al Society for Integrative Oncology și al ASCO a analizat metodele complementare pentru anxietate și depresie la adulții cu cancer. Cele mai solide dovezi le-au avut:

* **programele de mindfulness** (atenție conștientă), pentru neliniște și tristețe, în timpul și după tratament;
* **yoga**, mai ales la femeile cu cancer de sân, tot pentru neliniște și tristețe, în timpul și după tratament.

Ghidul socotește anii cu tamoxifen drept „după tratament”. Pentru această perioadă, la cancerul de sân, au ajutat și tai chi sau qigong și acupunctura, dar dovezile sunt mai slabe.

Pentru neliniștea din jurul investigațiilor (de exemplu o biopsie) poate ajuta hipnoza, cu un specialist. Tehnicile de relaxare au ajutat în timpul tratamentului activ (operație, chimioterapie, radioterapie).

### Ce nu fac

Nu înlocuiesc tratamentul și nici ajutorul unui psiholog. Dacă tristețea sau neliniștea nu trec ori îți e greu să-ți duci ziua, spune medicului. Poți deschide și „Ajutor” din aplicație.

### Cum poți începe

* un curs de mindfulness cu un instructor, în grup sau online;
* yoga blândă, cu un instructor căruia îi spui de operație și de tratament; dacă ai operat ganglionii de la axilă, citește și ghidul despre mișcare;
* pentru câteva minute de liniște, în aplicație ai „Respirație lentă” și „5-4-3-2-1”. Nu sunt cursurile din studii, dar le ai mereu la îndemână.

*Sursa: Carlson LE și colab., „Integrative Oncology Care of Symptoms of Anxiety and Depression in Adults With Cancer: Society for Integrative Oncology–ASCO Guideline”, J Clin Oncol 2023; 41(28):4562–4591.*`
  }
];

export const NEWS_PROTOCOLS: NewsProtocol[] = [
  {
    id: 'n1',
    title: 'Tamoxifen în doză mică după DCIS: ce arată un studiu din 2026',
    date: 'Iunie 2026',
    summary: 'O analiză a trei studii arată că 5 mg pe zi a redus riscul unui nou cancer de sân la femeile după menopauză. Doza potrivită ți-o stabilește medicul.',
    content: `### Ce s-a studiat

Cercetătorii au analizat împreună datele a 1.545 de femei din trei studii. Femeile aveau DCIS, carcinom microinvaziv sau leziuni cu risc crescut, cu receptori de estrogen pozitivi sau necunoscuți. Unele au primit tamoxifen în doză mică (5 mg pe zi sau 10 mg o dată la două zile, timp de 2–5 ani), altele placebo sau niciun tratament. Au fost urmărite în medie 9,4 ani.

### Ce s-a găsit

* **După menopauză:** doza mică a redus cam la jumătate riscul unui nou cancer de sân (40 din 335 de femei, față de 93 din 401).
* **Înainte de menopauză:** beneficiul a fost mai puțin clar, mai ales pentru sânul operat.

### Ce înseamnă pentru tine

Doza potrivită pentru tine o stabilește medicul oncolog. Dacă tolerezi greu tratamentul, îl poți întreba dacă doza mică ar fi o variantă. Nu schimba niciodată singură doza.

*Sursa: Gandini și colab., Journal of Clinical Oncology, 2026; 44:2121–2129 (DOI 10.1200/JCO-26-00841), prezentat la ASCO 2026.*`
  },
  {
    id: 'n2',
    title: 'O pastilă fără hormoni pentru bufeuri, testată la femeile care iau tamoxifen',
    date: 'Martie 2026',
    summary: 'Un studiu mare arată că elinzanetantul reduce bufeurile și transpirațiile nocturne date de tratamentul hormonal, inclusiv de tamoxifen. Medicul tău îți poate spune dacă ți se potrivește.',
    content: `### Ce s-a studiat

Studiul OASIS-4 a inclus 474 de femei cu cancer de sân sau cu risc crescut, care luau tratament hormonal și aveau bufeuri supărătoare. 265 dintre ele luau tamoxifen. O parte au primit elinzanetant, un medicament fără hormoni, iar celelalte placebo.

### Ce s-a găsit

* Bufeurile moderate și severe au scăzut mai mult cu elinzanetant decât cu placebo: în medie cu aproximativ 3,5 episoade pe zi mai puține după 4 săptămâni.
* S-au îmbunătățit și somnul și calitatea vieții.
* Efectul a fost la fel la femeile care luau tamoxifen ca la celelalte (analiză prezentată la Conferința europeană de cancer mamar, martie 2026).
* Durerile de cap și oboseala au fost mai frecvente cu medicamentul.

### Ce înseamnă pentru tine

În noiembrie 2025, Uniunea Europeană a aprobat elinzanetantul și pentru bufeurile date de tratamentul hormonal pentru cancerul de sân. Dacă bufeurile te deranjează, spune-i medicului: există mai multe variante, cu sau fără medicamente. Nu întrerupe tamoxifenul din cauza bufeurilor fără să vorbești cu el.

*Surse: Cardoso și colab., New England Journal of Medicine, 2025 (studiul OASIS-4, prezentat la ASCO 2025); analiza pe tipuri de tratament, EBCC 2026, Barcelona; aprobarea Comisiei Europene, 19 noiembrie 2025.*`
  },
  {
    id: 'n3',
    title: 'Terapia prin discuții ajută la bufeuri și la somn',
    date: '2012',
    summary: 'Șase întâlniri de terapie cognitiv-comportamentală în grup au făcut bufeurile mai ușor de suportat pentru femeile după cancer de sân, iar efectul a durat luni de zile.',
    content: `### Ce s-a studiat

În studiul MENOS1, din Londra, 96 de femei cu bufeuri supărătoare după tratamentul pentru cancer de sân au fost împărțite în două grupuri: îngrijire obișnuită sau îngrijire obișnuită plus șase întâlniri săptămânale de terapie cognitiv-comportamentală în grup (exerciții de respirație, gestionarea stresului, obiceiuri de somn).

### Ce s-a găsit

* Cât de mult le deranjau bufeurile a scăzut, în medie, de la 6,5 la 3,5 pe o scală de la 1 la 10 în grupul cu terapie, față de 6,1 la 5,0 în celălalt grup.
* Efectul s-a păstrat și după 6 luni.
* S-au îmbunătățit și dispoziția, somnul și calitatea vieții.

### Ce înseamnă pentru tine

Ajutorul pentru bufeuri nu înseamnă doar medicamente. Poți întreba medicul sau un psiholog despre terapia cognitiv-comportamentală. Exercițiile de respirație din aplicație sunt un început bun, dar nu înlocuiesc terapia.

*Sursa: Mann și colab., The Lancet Oncology, 2012; 13:309–318 (studiul MENOS1).*`
  },
  {
    id: 'n4',
    title: 'Mișcarea pe care ți-o alegi singură contează',
    date: 'Aprilie 2026',
    summary: 'Un studiu din 2026 arată că femeile care au făcut mai multă mișcare după cancerul de sân au trăit mai mult, chiar și cu creșteri mici de activitate, oricare a fost tipul de mișcare.',
    content: `### Ce s-a studiat

Cercetătorii au analizat datele a 959 de femei cu cancer de sân invaziv în stadiile I–III, din California, urmărite timp de 8 ani. Au comparat ce s-ar fi întâmplat dacă femeile ar fi urmat un program de mișcare față de doar sfaturi de sănătate. Fiecare femeie își alegea singură tipul de mișcare.

### Ce s-a găsit

* Riscul de deces în 8 ani a fost estimat la 15,8% cu programul de mișcare, față de 23,7% fără el.
* Și creșterile mai mici de activitate au fost legate de rezultate mai bune.

### Ce înseamnă pentru tine

Nu trebuie să fie sală sau alergare: plimbările, dansul, înotul sau grădinăritul contează. Studiul e observațional, adică arată o legătură, nu o dovadă, iar autorii cer un studiu clinic care să o confirme. Întreabă medicul ce fel de mișcare ți se potrivește acum.

*Sursa: Jayasekera și colab., JAMA Network Open, 2026; 9(4):e265177 (DOI 10.1001/jamanetworkopen.2026.5177).*`
  },
  {
    id: 'n5',
    title: 'Tot mai puține decese prin cancer de sân',
    date: '2026',
    summary: 'În Statele Unite, rata deceselor prin cancer de sân a scăzut cu 44% din 1989 încoace, datorită depistării mai devreme și tratamentelor mai bune.',
    content: `### Ce arată datele

Societatea Americană de Cancer urmărește de zeci de ani evoluția cancerului de sân. Rata deceselor a scăzut cu 44% față de 1989. Organizația pune scăderea pe seama depistării prin screening, a informării mai bune și a tratamentelor mai eficiente.

### Ce înseamnă pentru tine

Cifrele sunt din Statele Unite și privesc toate formele de cancer de sân, nu doar DCIS. Arată însă că tratamentele de azi, inclusiv cel hormonal, sunt rezultatul a zeci de ani de cercetare care funcționează. Controalele regulate fac parte din acest progres.

*Sursa: American Cancer Society, Key Statistics for Breast Cancer, actualizat în 2026 (cancer.org).*`
  }
];

/** Vestea bună a zilei: o noutate pe zi, prin rotație, schimbată la miezul nopții (ora telefonului). */
export function getNewsOfTheDay(date: Date = new Date()): NewsProtocol {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return NEWS_PROTOCOLS[day % NEWS_PROTOCOLS.length];
}
