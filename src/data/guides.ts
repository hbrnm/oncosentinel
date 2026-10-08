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
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
    title: 'Tamoxifen: ce face și cum îl iei',
    summary: 'Cum acționează, cum îl iei, ce faci dacă ai uitat o doză și când suni la medic.',
    category: 'tratament',
    content: `### Ce face tamoxifenul

Tamoxifenul blochează acțiunea estrogenului asupra celulelor din sân. După DCIS, poate scădea riscul ca boala să revină sau să apară un cancer nou în oricare dintre sâni.

Într-un studiu mare cu femei operate și iradiate pentru DCIS (NSABP B-24), urmărite 15 ani, cancerul invaziv în același sân a fost cu aproximativ o treime mai rar la cele care au luat tamoxifen. Un nou cancer în celălalt sân a apărut la 7,3% dintre ele, față de 10,8% fără tamoxifen.

### Cum îl iei

* O dată pe zi, la aceeași oră, cu un pahar cu apă. Comprimatul se înghite întreg.
* Doza și durata ți le stabilește medicul. Nu opri tratamentul fără să vorbești cu el.

### Ai uitat o doză?

Ia-o când îți amintești. Dacă se apropie ora următoarei doze, sari peste cea uitată. Nu lua niciodată două doze deodată ca să o recuperezi.

### Alte medicamente și suplimente

Unele medicamente pot scădea efectul tamoxifenului. Prospectul recomandă să fie evitate, pe cât posibil, medicamentele care blochează puternic enzima CYP2D6, de exemplu paroxetina, fluoxetina, bupropionul, chinidina și cinacalcetul. Cât de mult contează acest lucru pentru rezultatul tratamentului nu e încă pe deplin lămurit.

Spune medicului sau farmacistului de fiecare dată când începi un medicament nou, inclusiv suplimente sau ceaiuri. Dacă ai nevoie de un antidepresiv, medicul poate alege unul care nu interferează cu tamoxifenul.

### Efecte secundare frecvente

Bufeurile sunt cele mai frecvente. Mai pot apărea scurgeri vaginale, greață la început (ajută să-l iei cu mâncare sau seara; de obicei trece cu timpul), crampe în picioare, dureri de cap sau păr mai subțire. Spune-i medicului dacă te deranjează: de multe ori există ce se poate face.

> Fii blândă cu tine: nu ești singura care trece prin asta.

### Când suni la 112 sau la medic

* **Sună la 112** dacă ai brusc respirație grea sau durere în piept, o umflătură apărută brusc, sau semne de accident vascular cerebral: vorbire neclară, vedere încețoșată brusc, amorțeală bruscă la față, braț sau picior.
* **Anunță repede medicul** dacă ai durere sau umflare la un picior, orice sângerare vaginală neobișnuită ori scurgere cu sânge (mai ales după menopauză) sau schimbări ale vederii.

### Controlul ginecologic

Dacă nu ai simptome, ecografia transvaginală de rutină nu e recomandată, decât dacă medicul consideră că ai un risc crescut. Important e să raportezi orice sângerare neobișnuită. Mergi în continuare la controalele ginecologice obișnuite.

*Surse: prospectul și Rezumatul caracteristicilor produsului pentru tamoxifen (secțiunea 4.5); Macmillan Cancer Support și Breast Cancer Now, paginile despre tamoxifen; ACOG Committee Opinion nr. 601, „Tamoxifen and Uterine Cancer” (2014); Wapnir și colab., Journal of the National Cancer Institute, 2011 (NSABP B-17 și B-24).*`
  },
  {
    id: 'g2',
    tag: 'STIL DE VIAȚĂ & CONFORT',
    title: 'Managementul bufeurilor și transpirațiilor nocturne',
    summary: 'Strategii practice non-hormonale: îmbrăcăminte în straturi, igiena somnului, respirație ritmată și răcorire.',
    category: 'stil_viata',
    content: `### Înțelegerea Bufeurilor

Bufeurile sunt cauzate de o ușoară dereglare temporară a centrului de termoreglare din hipotalamus, cauzată de blocarea estrogenilor.

#### Tehnici validate de control:
* **Îmbrăcăminte în straturi (layering)**: Folosește materiale naturale (bumbac, in, bambus) pe care le poți îndepărta ușor la debutul unui val de căldură.
* **Respirație ghidată paced breathing**: 6 respirații lente pe minut (inspiri 5 secunde, expiri 5 secunde) reduc frecvența și severitatea bufeului cu până la 50%.
* **Evitarea triggerilor**: Condimentele iuți, alcoolul, cofeina și stresul acut sunt declanșatori cunoscuți. Menține un jurnal pentru a identifica proprii tăi triggeri.`
  },
  {
    id: 'g3',
    tag: 'SUPRAVEGHERE & IMAGISTICĂ',
    title: 'Protocolul de control la 6 luni și mamografie anuală',
    summary: 'Calendarul recomandat de societățile internaționale (ESMO / NCCN) pentru supravegherea oncologică post-operatorie.',
    category: 'monitorizare',
    content: `### Protocolul de Supraveghere în DCIS

După finalizarea tratamentului local (chirurgie conservatoare și radioterapie), supravegherea este cheia liniștii tale pe termen lung.

#### Etapele recomandate:
1. **Control clinic oncologic**: la fiecare 6 luni în primii 2-3 ani, apoi anual.
2. **Imagistică anuală**: Mamografie și/sau RMN de sân (în funcție de densitatea mamară), de obicei la 12 luni de la intervenția chirurgicală.
3. **Control ginecologic**: Foarte important în timpul tratamentului cu Tamoxifen (ecografie transvaginală anuală).`
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
  }
];
