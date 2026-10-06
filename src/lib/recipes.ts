export interface RecipeItem {
  id: string;
  title: string;
  category: 'mic_dejun' | 'pranz' | 'cina' | 'bufeuri_bauturi' | 'gustari';
  categoryLabel: string;
  timeMinutes: number;
  oncologyBenefit: string;
  ingredients: string[];
  instructions: string[];
  tip?: string;
  source?: string;
}

export const ONCOLOGY_RECIPES: RecipeItem[] = [
  {
    id: 'r1',
    title: 'Terci Cald de Ovăz cu Semințe de In Măcinate & Afine',
    category: 'mic_dejun',
    categoryLabel: 'Mic Dejun',
    timeMinutes: 10,
    oncologyBenefit: 'Semințele de in sunt cea mai bogată sursă naturală de lignani (fitoestrogeni blânzi cu efect anti-estrogenic la nivelul receptorilor mamari). Fibrele de ovăz leagă metaboliții estrogenici din bilă.',
    ingredients: [
      '50g fulgi de ovăz integral',
      '200ml lapte de migdale neîndulcit sau apă',
      '1 lingură plină (10-15g) semințe de in proaspăt măcinate',
      'O mână de afine proaspete sau congelate (antioxidanți antocianini)',
      'Un praf de scorțișoară de Ceylon (echilibrează glicemia)'
    ],
    instructions: [
      'Fierbe ovăzul în laptele de migdale la foc mic timp de 5 minute până devine cremos.',
      'Oprește focul și adaugă scorțișoara.',
      'Important: Adaugă semințele de in MĂCINATE la final (după oprirea focului), pentru a proteja acizii grași Omega-3 de degradarea termică.',
      'Decorează cu afine proaspete.'
    ],
    tip: 'Macină semințele de in într-o râșniță de cafea și păstrează-le în frigider într-un borcan închis la culoare maxim 7 zile.'
  },
  {
    id: 'r2',
    title: 'Budincă de Chia cu Zmeură & Lapte de Cocos Ușor',
    category: 'mic_dejun',
    categoryLabel: 'Mic Dejun',
    timeMinutes: 5,
    oncologyBenefit: 'Semințele de chia conțin Omega-3 vegetal (acid alfa-linolenic) și fibre solubile mucilaginoase care susțin tranzitul intestinal fără a suprasolicita ficatul.',
    ingredients: [
      '3 linguri semințe de chia',
      '180ml lapte de cocos ușor sau lapte de ovăz',
      'O mână de zmeură proaspătă (acid elagic antitumoral)',
      '1 linguriță semințe de cânepă decorticate (proteine complete)'
    ],
    instructions: [
      'Amestecă semințele de chia cu laptele vegetal într-un borcan de sticlă.',
      'Lasă la hidratat în frigider peste noapte (sau minim 2 ore).',
      'Dimineața, adaugă zmeura zdrobită ușor cu furculița și semințele de cânepă.'
    ],
    tip: 'Un mic dejun rece, perfect pentru diminețile în care simți bufeuri matinale.'
  },
  {
    id: 'r3',
    title: 'Buddha Bowl cu Broccoli la Abur, Quinoa & Dressing de Susan',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 20,
    oncologyBenefit: 'Broccoli preparat blând la abur activează enzima mirozinază, producând cantități maxime de sulforafan – activator cheie al Nrf2 și al fazei a II-a de detoxifiere hepatică.',
    ingredients: [
      '150g buchețele de broccoli și conopidă',
      '80g quinoa fiartă',
      '100g năut fiert (clătit bine)',
      'O mână generoasă de frunze de rucola proaspătă',
      'Dressing: 1 lingură pastă de tahini (susan), suc de la 1/2 lămâie, 1 lingură ulei de măsline extravirgin, puțină apă călduță'
    ],
    instructions: [
      'Gătește broccoliul la abur timp de EXACT 4-5 minute (trebuie să rămână verde intens și crocant, nu terciuit).',
      'Așază în bol quinoa fiartă, rucola și năutul.',
      'Adaugă buchețelele de broccoli cald.',
      'Toarnă dressingul de tahini și lămâie deasupra.'
    ],
    tip: 'Uleiul de măsline presat la rece ajută la absorbția vitaminelor liposolubile (A, D, E, K).'
  },
  {
    id: 'r4',
    title: 'Păstrăv la Cuptor cu Ierburi & Salată de Spanac cu Nucă',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 25,
    oncologyBenefit: 'Peștele bogat în Omega-3 (EPA/DHA) reduce direct sinteza de prostaglandine proinflamatorii (PGE2), ameliorând durerile articulare cauzate de Tamoxifen.',
    ingredients: [
      '1 file de păstrăv proaspăt (sau somon sălbatic)',
      '1 linguriță oregano și cimbru uscat',
      '1 cățel de usturoi zdrobit',
      '100g spanac baby proaspăt',
      '4-5 jumătăți de miez de nucă românească mărunțită',
      '1 lingură ulei de măsline presat la rece'
    ],
    instructions: [
      'Condimentează fileul de pește cu ierburi aromatice, usturoi și puțin ulei de măsline.',
      'Coace la cuptor la 180°C timp de 15-18 minute.',
      'Servește cu o salată proaspătă de spanac baby, stropită cu lămâie și presărată cu miez de nucă.'
    ]
  },
  {
    id: 'r5',
    title: 'Supă Cremă de Linte Roșie cu Ghimbir & Turmeric Bland',
    category: 'cina',
    categoryLabel: 'Cină',
    timeMinutes: 25,
    oncologyBenefit: 'Ghimbirul proaspăt combate greața ușoară asociată uneori cu Tamoxifenul. Lintea roșie oferă proteine ușor de asimilat fără a încărca digestia pe timpul nopții.',
    ingredients: [
      '150g linte roșie (fierbe rapid în 15 min)',
      '1 morcov mare și 1 rădăcină de păstârnac',
      '1 bucățică mică de ghimbir proaspăt ras (1 cm)',
      '1/2 linguriță turmeric pudră (alimentar)',
      '1 lingură ulei de măsline',
      'Semințe de dovleac crude pentru servire'
    ],
    instructions: [
      'Călește legumele ușor în puțină apă cu ghimbirul ras și turmericul.',
      'Adaugă lintea roșie spălată și 500ml apă/supă clară de legume.',
      'Fierbe 15 minute, apoi pasează cu blenderul până devine o cremă fină.',
      'Servește cu semințe de dovleac crude presărate deasupra (bogate în zinc).'
    ]
  },
  {
    id: 'r6',
    title: 'Cartof Dulce Copt cu Guacamole Proaspăt & Frunze de Rucola',
    category: 'cina',
    categoryLabel: 'Cină',
    timeMinutes: 30,
    oncologyBenefit: 'Cartoful dulce conține carotenoizi și potasiu (combate retenția de lichide). Avocado oferă grăsimi mononesaturate care stabilizează glicemia nocturnă.',
    ingredients: [
      '1 cartof dulce mediu',
      '1/2 avocado copt, pasat cu furculița',
      'Câteva picături de lămâie',
      'Câteva roșii cherry tăiate mărunt',
      'Pumni de frunze de rucola proaspătă'
    ],
    instructions: [
      'Înțeapă cartoful dulce cu o furculiță și coace-l la cuptor (200°C) timp de 30-35 min până devine moale.',
      'Taie-l pe jumătate pe lungime.',
      'Umple-l cu guacamole-ul proaspăt făcut și servește-l pe pat de rucola.'
    ]
  },
  {
    id: 'r7',
    title: 'Infuzie Răcoritoare de Salvie & Mentă (Elixir Antibufeuri)',
    category: 'bufeuri_bauturi',
    categoryLabel: 'Băuturi Răcoritoare',
    timeMinutes: 5,
    oncologyBenefit: 'Salvia (Salvia officinalis) este planta de referință în fitoterapia europeană pentru reducerea transpirațiilor abundente și reglarea centrului hipotalamic de temperatură.',
    ingredients: [
      '1 lingură frunze uscate de salvie (sau 4-5 frunze proaspete)',
      'Câteva frunze de mentă proaspătă',
      '500ml apă plată rece',
      '3-4 felii subțiri de castravete'
    ],
    instructions: [
      'Opărește salvia cu 100ml apă fierbinte timp de 5 minute pentru a extrage compușii activi.',
      'Strecoară infuzia și toarn-o peste restul de 400ml apă rece.',
      'Adaugă menta proaspătă și feliile de castravete.',
      'Păstrează la frigider și bea cu înghițituri mici pe tot parcursul zilei.'
    ],
    tip: 'Bea un pahar cu o oră înainte de culcare pentru a preveni transpirațiile nocturne.'
  },
  {
    id: 'r8',
    title: 'Apă Infuzată cu Castravete, Lămâie & Ghimbir Rece',
    category: 'bufeuri_bauturi',
    categoryLabel: 'Băuturi Răcoritoare',
    timeMinutes: 5,
    oncologyBenefit: 'Hidratarea celulară reduce vasodilatația bruscă. Ghimbirul rece oferă prospețime fără a declanșa căldură internă.',
    ingredients: [
      '1 litru apă plată rece',
      '1/2 castravete tăiat felii subțiri',
      '1/2 lămâie feliată (atenție: NU grapefruit!)',
      '2 felii subțiri de ghimbir'
    ],
    instructions: [
      'Pune toate ingredientele într-o carafă de sticlă.',
      'Lasă la infuzat la rece minim 30 de minute înainte de a bea.'
    ]
  },
  {
    id: 'r9',
    title: 'Iaurt Grecesc cu Miez de Nucă & Mure Proaspete',
    category: 'gustari',
    categoryLabel: 'Gustări',
    timeMinutes: 3,
    oncologyBenefit: 'Murele și nucile oferă polifenoli puternici și magneziu natural, protejând mușchii de crampe și susținând microbiomul intestinal.',
    ingredients: [
      '150g iaurt grecesc 2-5% sau iaurt de cocos/migdale',
      'O mână de mure proaspete sau congelate',
      '4 jumătăți de nucă românească crudă',
      '1 linguriță semințe de dovleac'
    ],
    instructions: [
      'Așază iaurtul într-un bol mic, adaugă murele și presară nucile mărunțite deasupra.'
    ]
  },
  {
    id: 'r10',
    title: 'Smoothie „Energie Curată” cu Cacao Pură & In Măcinat',
    category: 'mic_dejun',
    categoryLabel: 'Mic Dejun',
    timeMinutes: 5,
    oncologyBenefit: 'Recomandat frecvent în comunitățile de paciente pentru combaterea oboselii cronice (fatigue). Pudra de cacao pură oferă flavonoide protectoare vasculare, iar inul aduce lignani fără a încărca digestia.',
    ingredients: [
      '250ml lapte de migdale neîndulcit rece',
      '1 lingură plină (15g) semințe de in proaspăt măcinate',
      '1 lingură rasă pudră de cacao 100% neîndulcită',
      '1/2 banană coaptă (pentru textură și potasiu)',
      'O mână mică de frunze tinere de spanac (fier și folați)'
    ],
    instructions: [
      'Pune toate ingredientele în blender.',
      'Mixează timp de 45-60 de secunde până devine fin și catifelat.',
      'Bea imediat după preparare pentru a absorbi antioxidanții intacți.'
    ],
    tip: 'O băutură excelentă pentru diminețile în care senzația de greață sau lipsa poftei de mâncare face dificil consumul unui mic dejun solid.'
  },
  {
    id: 'r11',
    title: 'Pâine cu Maia, Cremă de Avocado & Ou Poșat',
    category: 'mic_dejun',
    categoryLabel: 'Mic Dejun',
    timeMinutes: 10,
    oncologyBenefit: 'Avocado oferă acizi grași mononesaturați anti-inflamatori, iar oul furnizează colină esențială pentru funcționarea optimă și regenerarea ficatului în timpul metabolizării Tamoxifenului.',
    ingredients: [
      '1 felie de pâine integrală cu maia (ușor digerabilă)',
      '1/2 avocado bine copt',
      '1 ou de țară sau ecologic (poșat sau fiert moale)',
      '1 linguriță semințe de dovleac crude',
      'Câteva picături de suc proaspăt de lămâie și un praf de piper'
    ],
    instructions: [
      'Prăjește ușor felia de pâine cu maia.',
      'Pasează avocado cu o furculiță, adaugă câteva picături de suc de lămâie și întinde pe pâine.',
      'Așază oul poșat deasupra și presară semințele de dovleac.'
    ],
    tip: 'Drojdia de bere sălbatică din maia fermentează carbohidrații lenți, reducând balonarea adesea asociată cu modificările hormonale.'
  },
  {
    id: 'r12',
    title: 'Supă Cremă de Linte Roșie, Morcovi & Ghimbir',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 25,
    oncologyBenefit: 'Lintea roșie oferă fier non-hemic și proteine vegetale ușor digerabile fără a inflama mucoasa gastrică. Ghimbirul calmează senzația de greață și reduce rigiditatea articulară.',
    ingredients: [
      '150g linte roșie spălată bine',
      '2 morcovi medii tăiați rondele',
      '1 rădăcină mică de pătrunjel sau păstârnac',
      '1 bucățică de ghimbir proaspăt ras (1 cm)',
      '1 lingură ulei de măsline extravirgin (adăugat la final)',
      'Frunze de pătrunjel proaspăt tocat'
    ],
    instructions: [
      'Fierbe lintea roșie împreună cu morcovii și păstârnacul în 700ml apă sau supă limpede de legume timp de 20 minute.',
      'Adaugă ghimbirul ras în ultimele 3 minute de fierbere.',
      'Pasează totul fin cu blenderul vertical până obții o textură catifelată.',
      'Adaugă uleiul de măsline la servire și presară pătrunjel proaspăt din abundență.'
    ],
    tip: 'Ideală pentru „batch cooking”: poți face o oală mai mare și congela porții individuale pentru zilele în care te simți fără energie.'
  },
  {
    id: 'r13',
    title: 'File de Somon la Cuptor cu Dovlecei & Sparanghel',
    category: 'cina',
    categoryLabel: 'Cină',
    timeMinutes: 20,
    oncologyBenefit: 'Acizii grași Omega-3 marini (EPA și DHA) reduc activ sinteza prostaglandinelor inflamatorii responsabile de durerile de articulații și rigiditatea musculară specifice terapiei anti-hormonale.',
    ingredients: [
      '1 file de somon sălbatic sau păstrăv (aprox. 150g)',
      '1 dovlecel mic tăiat bastonașe',
      '5-6 tije de sparanghel verde (sau păstăi verzi)',
      '1 lingură ulei de măsline extravirgin',
      'Ierburi aromatice uscate: oregano, cimbru și mărar'
    ],
    instructions: [
      'Preîncălzește cuptorul la 190°C.',
      'Așază legumele și peștele într-o tavă tapetată cu hârtie de copt.',
      'Unge peștele și legumele cu ulei de măsline și presară ierburile aromatice.',
      'Coace la cuptor timp de 15-18 minute până peștele este fraged și se desface ușor în fulgi.'
    ],
    tip: 'O cină ușoară cu eliberare lentă de aminoacizi, care susține un somn neîntrerupt și previne trezirile nocturne.'
  },
  {
    id: 'r14',
    title: 'Infuzie Răcoroasă de Hibiscus, Mentă & Castravete',
    category: 'bufeuri_bauturi',
    categoryLabel: 'Băuturi Răcoritoare',
    timeMinutes: 10,
    oncologyBenefit: 'Hibiscusul este bogat în antocianine și acid organic cu proprietăți răcoritoare naturale, fără a conține cafeină și fără a interacționa cu Tamoxifenul. Menta calmează senzația de căldură internă.',
    ingredients: [
      '2 pliculețe sau 2 lingurițe flori uscate de hibiscus',
      'O mână de frunze proaspete de mentă',
      '1/2 castravete feliat fin',
      '750ml apă rece'
    ],
    instructions: [
      'Infuzează florile de hibiscus în 200ml apă fierbinte timp de 5-7 minute, apoi strecoară lichidul roșu rubiniu.',
      'Toarnă infuzia într-o carafă cu restul de apă rece și adaugă frunzele de mentă și feliile de castravete.',
      'Lasă la frigider minim 1 oră înainte de a consuma.'
    ],
    tip: 'Păstrează o sticlă mică termoizolantă cu această băutură pe noptieră dacă te confrunți cu transpirații nocturne.'
  },
  {
    id: 'r15',
    title: 'Biscuiți Crocanți de Ovăz cu Semințe de Dovleac & Scorțișoară',
    category: 'gustari',
    categoryLabel: 'Gustări',
    timeMinutes: 20,
    oncologyBenefit: 'Zincul și magneziul din semințele de dovleac susțin sistemul imunitar și relaxarea musculară. Fără zahăr rafinat, evitând creșterile bruște de insulină care pot exacerba inflamația celulară.',
    ingredients: [
      '100g fulgi fini de ovăz integral',
      '2 banane bine coapte (pasate cu furculița)',
      '3 linguri semințe de dovleac crude',
      '2 linguri miez de nucă mărunțit',
      '1 linguriță scorțișoară de Ceylon veritabilă'
    ],
    instructions: [
      'Preîncălzește cuptorul la 180°C.',
      'Amestecă într-un bol bananele pasate cu fulgii de ovăz, semințele de dovleac, nuca și scorțișoara.',
      'Formează discuri mici cu o lingură pe o tavă cu hârtie de copt.',
      'Coace timp de 15 minute până marginile devin ușor aurii și ferme.'
    ],
    tip: 'Păstrează-i într-o cutie metalică închisă până la 5 zile pentru gustări sănătoase de drum sau la serviciu.'
  },
  {
    id: 'r16',
    title: 'Supă Cremă de Conopidă Coaptă, Usturoi & Năut',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 35,
    source: 'Breast Cancer UK - „Organic Flavours”',
    oncologyBenefit: 'Conopida coaptă este o legumă cruciferă esențială bogată în compuși fitochimici (indoli și sulforafan) care modulează metabolismul estrogenic. Năutul oferă proteine vegetale și fibre solubile.',
    ingredients: [
      '1 căpățână conopidă (aprox. 750g), desfăcută în buchețele',
      '1 conservă sau borcan năut (240g scurs)',
      '1 căpățână întreagă de usturoi (vârful tăiat pentru coacere)',
      '1 ceapă galbenă tocată mărunt',
      '1 cartof mic (180g) tăiat cubulețe',
      '1 tijă de țelină apio tăiată mărunt',
      '1 litru supă clară de legume',
      '2 linguri ulei de măsline extravirgin',
      '1 linguriță semințe de coriandru măcinate'
    ],
    instructions: [
      'Preîncălzește cuptorul la 200°C. Pune buchețelele de conopidă, boabele de năut și căpățâna de usturoi stropite cu 1 lingură ulei pe o tavă cu hârtie de copt.',
      'Coace 25 minute până devin aurii și fragede.',
      'Într-o oală, sotează ceapa și țelina cu restul de ulei timp de 5 minute, apoi adaugă cartoful, coriandrul și supa de legume.',
      'Fierbe 15 minute, apoi adaugă conopida coaptă și usturoiul copt stors din coajă.',
      'Pasează fin cu blenderul vertical până devine o cremă fină și mătăsoasă. Decorează cu câteva boabe de năut crocant.'
    ],
    tip: 'Rețetă-vedetă din cartea Breast Cancer UK. Conopida coaptă la cuptor capătă un gust dulceag, fără mirosul intens de varză fiartă.'
  },
  {
    id: 'r17',
    title: 'Chili Vegetarian din Trei Boabe cu Roșii & Chimen',
    category: 'cina',
    categoryLabel: 'Cină',
    timeMinutes: 30,
    source: 'Breast Cancer UK - „Organic Flavours”',
    oncologyBenefit: 'Combinația de fasole neagră, fasole roșie și năut aduce peste 15g de fibre per porție. Fibrele se leagă de estrogenii metabolizați în bilă, prevenind reabsorbția lor intestinală.',
    ingredients: [
      '1 conservă fasole neagră (clătită)',
      '1 conservă fasole roșie kidney (clătită)',
      '1 conservă năut (clătit)',
      '1 conservă (400g) roșii cuburi în suc propriu (bogate în licopen)',
      '1 ardei gras roșu tăiat cuburi',
      '1 ceapă și 2 căței de usturoi',
      '1 linguriță chimen măcinat, 1 linguriță oregano, 1 praf boia dulce',
      '1 lingură ulei de măsline'
    ],
    instructions: [
      'Călește ușor ceapa, usturoiul și ardeiul în ulei de măsline timp de 5 minute.',
      'Adaugă condimentele (chimenul și oregano) pentru 1 minut pentru a-și elibera aromele.',
      'Toarnă roșiile cuburi și toate cele 3 tipuri de leguminoase.',
      'Fierbe la foc mic timp de 20-25 de minute până scade și sosul devine consistent.',
      'Servește cu pătrunjel proaspăt tocat și câteva picături de lămâie.'
    ],
    tip: 'Se păstrează excelent la frigider până la 4 zile sau poate fi congelat în caserole porționate.'
  },
  {
    id: 'r18',
    title: 'Steak-uri de Conopidă Rumenite la Cuptor cu Ierburi',
    category: 'cina',
    categoryLabel: 'Cină',
    timeMinutes: 25,
    source: 'Breast Cancer UK',
    oncologyBenefit: 'Cruciferele gătite la cuptor păstrează integritatea glucosinolaților fără a pierde nutrienții în apa de fierbere, oferind o cină ușoară cu indice glicemic minim.',
    ingredients: [
      '1 conopidă mare întreagă',
      '2 linguri ulei de măsline extravirgin',
      '1 linguriță cimbru uscat și oregano',
      '1/2 linguriță turmeric pudră',
      '1 lingură semințe de susan neprajite (calciu vegetal)'
    ],
    instructions: [
      'Taie conopida pe verticală în felii groase de aproximativ 2 cm („steak-uri”).',
      'Unge fiecare felie pe ambele părți cu amestecul de ulei de măsline, ierburi și turmeric.',
      'Așază-le pe o tavă cu hârtie de copt și presară semințele de susan.',
      'Coace la 200°C timp de 20-25 minute până devin fragede în interior și rumenite pe margini.'
    ]
  },
  {
    id: 'r19',
    title: 'Tocăniță Mediteraneană de Linte & Spanac cu Lămâie',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 25,
    source: 'WCRF - „Cook Through Cancer”',
    oncologyBenefit: 'Recomandată de World Cancer Research Fund pentru menținerea unei greutăți sănătoase și reducerea inflamației sistemice. Lintea brună oferă carbohidrați complecși cu eliberare prelungită de energie.',
    ingredients: [
      '200g linte verde sau brună (fiartă)',
      '150g frunze proaspete de spanac',
      '1 morcov tăiat cubulețe mici',
      '1 ceapă roșie tocată mărunt',
      '2 căței de usturoi zdrobiți',
      'Sucul și coaja rasă de la 1/2 lămâie bio',
      '2 linguri ulei de măsline extravirgin presat la rece'
    ],
    instructions: [
      'Înăbușă ceapa, morcovul și usturoiul în 1 lingură de apă și puțin ulei timp de 5-7 minute.',
      'Adaugă lintea fiartă și 150ml supă caldă de legume.',
      'Lasă să dea în clocot 5 minute, apoi oprește focul și încorporează spanacul proaspăt (se va înmuia doar de la căldura reziduală).',
      'Adaugă la final uleiul de măsline crud și zeama de lămâie proaspătă.'
    ],
    tip: 'Vitamina C din zeama de lămâie crește de până la 3 ori absorbția fierului non-hemic din spanac și linte.'
  },
  {
    id: 'r20',
    title: 'Bol Nutritiv cu Quinoa, Tofu Aurit, Edamame & Broccoli',
    category: 'pranz',
    categoryLabel: 'Prânz',
    timeMinutes: 20,
    source: 'PCRM - „The Cancer Survivor’s Guide”',
    oncologyBenefit: 'Conform studiilor ample validate de PCRM și WCRF, fitoestrogenii naturali (izoflavonele) din alimente integrale de soia (edamame, tofu organic) au efect protector mamar, concurând benefic cu estrogenul biologic.',
    ingredients: [
      '150g quinoa fiartă (proteină vegetală completă)',
      '120g tofu organic ferm, tăiat cubulețe și rumenit ușor în tigaie',
      '80g boabe de edamame fierte la abur',
      '1 cană buchețele mici de broccoli la abur',
      'Dressing: 1 linguriță pastă tahini (pastă de susan) + 1 lingură suc de lămâie + 2 linguri apă călduță'
    ],
    instructions: [
      'Așază baza de quinoa caldă sau rece într-un bol adânc.',
      'Aranjează separat cuburile de tofu rumenit, boabele verzi de edamame și broccoli-ul crocant.',
      'Toarnă dressingul cremos de tahini și lămâie deasupra.',
      'Opțional: presară 1 linguriță de semințe de in proaspăt măcinate.'
    ],
    tip: 'O masă completă, fără colesterol și săracă în grăsimi saturate, ideală pentru susținerea energiei pe durata zilei.'
  },
  {
    id: 'r21',
    title: 'Clătite Nutritive din Ovăz & Banană cu Afine (Fără Zahăr)',
    category: 'mic_dejun',
    categoryLabel: 'Mic Dejun',
    timeMinutes: 12,
    source: 'Breast Cancer UK & PCRM',
    oncologyBenefit: 'Doar 4 ingrediente naturale, fără zahăr rafinat și fără făină albă. Protejează stabilitatea glicemiei și combate inflamația prin conținutul masiv de antociani din afine.',
    ingredients: [
      '1 banană bine coaptă',
      '60g fulgi fini de ovăz măcinați (făină de ovăz)',
      '1 ou sau 1 lingură semințe de in hidratate în 3 linguri apă',
      '1/2 linguriță scorțișoară Ceylon',
      'O mână de afine proaspete'
    ],
    instructions: [
      'Pasează banana cu furculița într-un bol până devine piure fin.',
      'Încorporează oul (sau inul hidratat), făina de ovăz și scorțișoara.',
      'Încinge o tigaie antiaderentă unsă cu câteva picături de ulei de cocos.',
      'Toarnă mici discuri de aluat, presară 3-4 afine în fiecare clătită și coace la foc mic 2 minute pe fiecare parte.',
      'Servește cald cu restul de afine proaspete.'
    ],
    tip: 'Un mic dejun reconfortant și festiv, perfect pentru diminețile de weekend.'
  }
];


