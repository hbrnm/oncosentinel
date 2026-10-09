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
