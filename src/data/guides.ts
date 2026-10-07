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
    title: 'Tamoxifen și efectele secundare',
    summary: 'Tot ce trebuie să știi despre tratament, monitorizare și stil de viață.',
    category: 'tratament',
    content: `### Ce este Tamoxifenul și eficacitatea sa

Tamoxifenul este un modulator selectiv al receptorilor estrogenici (SERM) care blochează estrogenul la nivelul celulelor mamare. Pe termen lung (5–10 ani), studiile (precum ATLAS) arată că reduce riscul de recurență cu **40–50%** și mortalitatea cu aproximativ **30%**.

### Interacțiuni medicamentoase majore (CYP2D6)

Tamoxifenul este transformat de ficat în forma sa activă, *endoxifen*. Anumite medicamente blochează această conversie și **reduc drastic eficacitatea tratamentului**.

* **DE EVITAT (Inhibitori puternici):** Antidepresive precum Paroxetină (Seroxat), Fluoxetină (Prozac), Bupropion. Nu le luați concomitent cu Tamoxifen.
* **Alternative Sigure:** Venlafaxină (Effexor) — excelentă și pentru ameliorarea bufeurilor — Citalopram, Escitalopram.

> Verifică întotdeauna cu medicul oncolog înainte de a adăuga un medicament nou, inclusiv suplimente sau antidepresive.

### Monitorizare medicală și Efecte Secundare

1. **Control Ginecologic Anual:** Deși protejează sânii, are un ușor efect de stimulare asupra uterului. Este obligatoriu controlul ginecologic anual (ecografie transvaginală). Raportează imediat medicului orice sângerare vaginală anormală.
2. **Bufeurile:** Afectează până la 80% dintre paciente. Acestea pot fi ameliorate prin metode non-farmacologice sau, la recomandarea medicului, prin medicamente precum Venlafaxina sau Gabapentina.

> Aceste efecte sunt adesea mai intense în primele luni și tind să se amelioreze în timp. Fii blândă cu tine — nu ești singura care trece prin asta.

### Sfaturi de aur pentru administrare

* **Fii constantă:** Alege o oră din zi și încearcă să nu o modifici.
* **Ai uitat o doză?:** Ia comprimatul de îndată ce îți amintești. Dacă se apropie ora pentru următoarea doză, pur și simplu continuă programul normal. Nu lua niciodată doză dublă.`
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
    title: 'ASCO 2026: Tamoxifen în doze mici (Low-Dose) pentru leziuni cu risc înalt',
    date: 'Iunie 2026',
    summary: 'Studiile recente de la ASCO 2026 arată că dozele mici de Tamoxifen (5 mg zilnic) sunt extrem de eficiente pentru DCIS.',
    content: `În cadrul întâlnirii anuale ASCO din 2026, au fost prezentate date noi și esențiale despre utilizarea dozelor mici de Tamoxifen (cunoscut și ca *babytam*).

### Eficacitate dovedită cu mai puține efecte secundare
Un studiu de analiză a datelor (pooled analysis) a arătat că utilizarea Tamoxifenului în doze de 5 mg pe zi (sau 10 mg o dată la două zile) reduce semnificativ riscul de evenimente mamare, în special la femeile aflate la postmenopauză care au fost diagnosticate cu carcinom ductal in situ (DCIS) sau hiperplazie atipică.

### Avantajul major
Deoarece doza este redusă semnificativ (față de doza standard de 20 mg), **incidența efectelor secundare** (cum ar fi bufeurile, riscul de tromboze și modificările endometriale) scade dramatic. 

> Dacă tolerezi greu doza de 20 mg, discută cu medicul tău oncolog posibilitatea trecerii la o doză mai mică (low-dose tamoxifen). Nu modifica niciodată doza fără acordul medicului tău.`
  },
  {
    id: 'n2',
    title: 'Urmărire pe 20 de ani (Stockholm Trials): Beneficiul Tamoxifen',
    date: 'Iulie 2026',
    summary: 'Noi date publicate în JNCI confirmă rolul protector al Tamoxifenului pe o perioadă de până la 20 de ani.',
    content: `Studii recente pe termen lung (până la 20 de ani de urmărire), bazate pe testele clinice de la Stockholm (publicate în *JNCI*, iulie 2026), reafirmă importanța de necontestat a terapiei cu Tamoxifen.

### Protecție pe termen lung
Studiul a demonstrat un beneficiu susținut al terapiei cu Tamoxifen în rândul pacientelor cu cancer de sân HR-pozitiv (Luminal A și B), subliniind rolul fundamental al aderenței la tratament în prevenirea recurențelor tardive.

Pacienții care și-au finalizat tratamentul recomandat au prezentat o rată semnificativ redusă a recurenței chiar și la 15-20 de ani post-diagnostic.`
  }
];
