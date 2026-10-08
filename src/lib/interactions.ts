import { DrugInteraction } from '../types';

// Text aprobat de proprietară (docs/rescriere-etapa0.md, partea a patra), scris din RCP-ul tamoxifenului și din surse publice
export const INTERACTIONS_DB: DrugInteraction[] = [
  {
    substance: 'Paroxetină, fluoxetină, bupropion, chinidină, cinacalcet',
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Pot scădea forma activă a tamoxifenului. Prospectul recomandă să fie evitate, pe cât posibil. Nu le opri singură: vorbește cu medicul.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Anticoagulante de tip warfarină (acenocumarol, warfarină)',
    level: 'tell',
    levelLabel: 'Spune medicului',
    advice: 'Tamoxifenul poate modifica efectul lor asupra coagulării. Medicul poate cere analize mai dese.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Medicamente cu estrogen (de exemplu anticoncepționale orale, tratamente hormonale pentru menopauză)',
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Prospectul spune să nu fie luate în timpul tratamentului: își pot reduce efectul una alteia.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Letrozol și alți inhibitori de aromatază',
    level: 'tell',
    levelLabel: 'Doar la indicația medicului',
    advice: 'Nu se iau împreună cu tamoxifenul: combinația nu a îmbunătățit tratamentul.',
    source: 'RCP tamoxifen, secțiunea 4.5'
  },
  {
    substance: 'Rifampicină (medicament pentru tuberculoză)',
    level: 'tell',
    levelLabel: 'Spune medicului',
    advice: 'Poate scădea nivelul tamoxifenului din sânge.',
    source: 'Prospectul Tamoxifen Sandoz (ANMDMR)'
  },
  {
    substance: 'Sunătoare (ceai, tinctură, capsule)',
    level: 'avoid',
    levelLabel: 'De evitat',
    advice: 'Poate scădea nivelul tamoxifenului din sânge.',
    source: 'Recenzie: interacțiuni între produse naturale și tamoxifen (PMC9201062)'
  },
  {
    substance: 'Suplimente concentrate de soia sau izoflavone',
    level: 'ask',
    levelLabel: 'Întreabă medicul',
    advice: 'Siguranța lor pe termen lung nu e stabilită. Alimentele obișnuite cu soia (tofu, edamame) nu intră aici.',
    source: 'Recenzie: interacțiuni între produse naturale și tamoxifen (PMC9201062)'
  },
  {
    substance: 'Grepfrut și suc de grepfrut',
    level: 'ask',
    levelLabel: 'Întreabă medicul',
    advice: 'Dovezile sunt foarte slabe; unele spitale recomandă evitarea sucului de grepfrut.',
    source: 'Medscape (baza de interacțiuni); fișa MGH pentru tamoxifen'
  }
];

export function searchInteractions(query: string): DrugInteraction[] {
  const q = query.trim().toLowerCase();
  if (!q) return INTERACTIONS_DB;
  return INTERACTIONS_DB.filter(item =>
    item.substance.toLowerCase().includes(q) || item.advice.toLowerCase().includes(q)
  );
}
