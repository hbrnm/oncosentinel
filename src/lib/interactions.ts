import { DrugInteraction } from '../types';

// Text aprobat de proprietară (docs/rescriere-etapa0.md, partea a patra), scris din RCP-ul tamoxifenului și din surse publice
export const INTERACTIONS_DB: DrugInteraction[] = [
  {
    substance: 'Paroxetină, fluoxetină, bupropion, chinidină, cinacalcet',
    match: ['paroxetin', 'fluoxetin', 'bupropion', 'chinidin', 'cinacalcet'],
    // Nume comerciale aprobate de proprietară (2026-10-09), din documente ANM: Seroxat (RCP 601/2008), Paxetin (RCP 12940/2020),
    // Prozac (PRO 11794/2019), Fluoxin (RCP 10964/2018), Magrilan (AMB 12058/2019), Elontril (RCP 4430/2012), Zyban (AMB 12478/2019), Axabal (rezumat PMR)
    brands: ['seroxat', 'paxetin', 'prozac', 'fluoxin', 'magrilan', 'elontril', 'zyban', 'axabal'],
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Pot scădea forma activă a tamoxifenului. Prospectul recomandă să fie evitate, pe cât posibil. Nu le opri singură: vorbește cu medicul.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Anticoagulante de tip warfarină (acenocumarol, warfarină)',
    match: ['acenocumarol', 'warfarin'],
    // Sintrom (RCP 2606/2010), Trombostop (RCP 14886/2023)
    brands: ['sintrom', 'trombostop'],
    level: 'tell',
    levelLabel: 'Spune medicului',
    advice: 'Tamoxifenul poate modifica efectul lor asupra coagulării. Medicul poate cere analize mai dese.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Medicamente cu estrogen (de exemplu anticoncepționale orale, tratamente hormonale pentru menopauză)',
    // „estradiol” și „contraceptiv”: aprobate de proprietară (2026-10-09), deși nu sunt în numele substanței
    match: ['estrogen', 'anticonceptional', 'estradiol', 'contraceptiv'],
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Prospectul spune să nu fie luate în timpul tratamentului. Dacă ai nevoie de contracepție, folosește o metodă fără hormoni (de exemplu prezervativul) în timpul tratamentului și încă 2 luni după. Medicul te ajută să alegi.',
    source: 'Prospectul Tamoxifen Sandoz (ANMDMR)'
  },
  {
    substance: 'Anastrozol, letrozol și alți inhibitori de aromatază',
    match: ['anastrozol', 'letrozol', 'inhibitor de aromataza', 'inhibitori de aromataza'],
    // Arimidex (AMB 7053/2014), Kyaresta (AMB 12683/2019); Loosyn, Elozora, Etruzil, Zequipra (etichete ANM, AMB 5815, 6664, 6961, 7778)
    brands: ['arimidex', 'kyaresta', 'loosyn', 'elozora', 'etruzil', 'zequipra'],
    level: 'tell',
    levelLabel: 'Doar la indicația medicului',
    advice: 'Nu se iau împreună cu tamoxifenul. Prospectul românesc o spune explicit pentru anastrozol.',
    source: 'Prospectul Tamoxifen Sandoz (ANMDMR); RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Rifampicină (medicament pentru tuberculoză)',
    match: ['rifampicin'],
    // Sinerdol (AMB 9186/2016, 9187/2016)
    brands: ['sinerdol'],
    level: 'tell',
    levelLabel: 'Spune medicului',
    advice: 'Poate scădea nivelul tamoxifenului din sânge.',
    source: 'Prospectul Tamoxifen Sandoz (ANMDMR)'
  },
  {
    substance: 'Sunătoare (ceai, tinctură, capsule)',
    match: ['sunatoare'],
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Poate scădea nivelul tamoxifenului din sânge.',
    source: 'Recenzie: interacțiuni între produse naturale și tamoxifen (PMC9201062)'
  },
  {
    substance: 'Suplimente concentrate de soia sau izoflavone',
    match: ['soia', 'izoflavon'],
    level: 'ask',
    levelLabel: 'Întreabă medicul',
    advice: 'Siguranța lor pe termen lung nu e stabilită. Alimentele obișnuite cu soia (tofu, edamame) nu intră aici.',
    source: 'Recenzie: interacțiuni între produse naturale și tamoxifen (PMC9201062)'
  },
  {
    substance: 'Grepfrut și suc de grepfrut',
    match: ['grepfrut'],
    level: 'ask',
    levelLabel: 'Întreabă medicul',
    advice: 'Dovezile sunt foarte slabe; unele spitale recomandă evitarea sucului de grepfrut.',
    source: 'Medscape (baza de interacțiuni); fișa MGH pentru tamoxifen'
  }
];

// Fără diacritice și fără majuscule: „Fluoxetină” → „fluoxetina”
export const normalizeName = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Intrarea din lista aprobată care se potrivește cu numele scris de pacientă; lipsa nu înseamnă siguranță
export const findInteraction = (name: string): DrugInteraction | undefined => {
  const n = normalizeName(name);
  if (!n) return undefined;
  return INTERACTIONS_DB.find(item => [...item.match, ...(item.brands || [])].some(word => n.includes(word)));
};

export function searchInteractions(query: string): DrugInteraction[] {
  const q = query.trim().toLowerCase();
  if (!q) return INTERACTIONS_DB;
  return INTERACTIONS_DB.filter(item =>
    item.substance.toLowerCase().includes(q) || item.advice.toLowerCase().includes(q) ||
    (item.brands || []).some(brand => brand.includes(normalizeName(q)))
  );
}
