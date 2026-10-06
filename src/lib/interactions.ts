import { DrugInteraction } from '../types';

export const INTERACTIONS_DB: DrugInteraction[] = [
  {
    substance: 'Grepfrut / Grapefruit / Pomelo / Portocale de Sevilla',
    category: 'aliment',
    riskLevel: 'CONTRAINDICATED',
    riskLabel: 'Contraindicație - Evită Complet',
    mechanism: 'Inhibitor potent și ireversibil al izoenzimei CYP3A4 și al glicoproteinei P (P-gp) intestinale.',
    recommendation: 'Nu consuma grepfrut, suc de grepfrut, pomelo sau dulceață de portocale amare (Sevilla) pe durata tratamentului cu Tamoxifen.',
    details: 'Furanocumarinele din grepfrut blochează enzimele responsabile de metabolizarea Tamoxifenului, ducând la fluctuații imprevizibile ale nivelului plasmatic și la creșterea toxicității/reacțiilor adverse.'
  },
  {
    substance: 'Sunătoare (St. John\'s Wort / Hypericum perforatum)',
    category: 'planta',
    riskLevel: 'CONTRAINDICATED',
    riskLabel: 'Contraindicație Majoră',
    mechanism: 'Inducție enzimatică puternică a CYP3A4 și P-gp.',
    recommendation: 'Evită complet produsele ce conțin sunătoare (ceaiuri, tincturi, capsule antidepresive naturale).',
    details: 'Sunătoarea accelerează eliminarea Tamoxifenului din organism, scăzând drastic concentrația sanguină și eficacitatea terapeutică de prevenire a recidivei.'
  },
  {
    substance: 'Paroxetină (Seroxat / Arketis)',
    category: 'antidepresiv',
    riskLevel: 'CONTRAINDICATED',
    riskLabel: 'Contraindicație Majoră',
    mechanism: 'Inhibitor puternic al izoenzimei hepatice CYP2D6.',
    recommendation: 'Discută cu medicul oncolog/psihiatru pentru trecerea pe o alternativă compatibilă (Venlafaxină).',
    details: 'Tamoxifenul este un pro-drog; pentru a funcționa, trebuie convertit de ficat (prin CYP2D6) în metabolitul activ "Endoxifen". Paroxetina blochează această transformare, reducând eficacitatea anticancer.'
  },
  {
    substance: 'Fluoxetină (Prozac)',
    category: 'antidepresiv',
    riskLevel: 'CONTRAINDICATED',
    riskLabel: 'Contraindicație Majoră',
    mechanism: 'Inhibitor puternic CYP2D6.',
    recommendation: 'Nu se administrează concomitent cu Tamoxifen.',
    details: 'La fel ca paroxetina, reduce concentrațiile plasmatice de Endoxifen cu până la 70%.'
  },
  {
    substance: 'Bupropion (Wellbutrin / Elontril / Zyban)',
    category: 'antidepresiv',
    riskLevel: 'CONTRAINDICATED',
    riskLabel: 'Contraindicație Majoră',
    mechanism: 'Inhibitor puternic CYP2D6.',
    recommendation: 'Evită utilizarea în timpul tratamentului cu Tamoxifen.',
    details: 'Scade nivelul de metabolit activ antitumoral.'
  },
  {
    substance: 'Venlafaxină (Efectin / Argofan)',
    category: 'antidepresiv',
    riskLevel: 'SAFE',
    riskLabel: 'Sigur & Recomandat pentru Bufeuri',
    mechanism: 'Inhibitor slab/neglijabil de CYP2D6 (SNRI).',
    recommendation: 'Este prima linie de tratament non-hormonal recomandată de ghidurile NCCN/ASCO pentru bufeurile cauzate de Tamoxifen.',
    details: 'Nu interferează cu metabolizarea Tamoxifenului în Endoxifen și reduce frecvența și intensitatea bufeurilor vasomotorii.'
  },
  {
    substance: 'Citalopram / Escitalopram (Cipralex)',
    category: 'antidepresiv',
    riskLevel: 'SAFE',
    riskLabel: 'Sigur la doze uzuale',
    mechanism: 'Inhibitor slab CYP2D6.',
    recommendation: 'Poate fi utilizat cu monitorizare standard dacă este prescris de medic.',
    details: 'Impact minim sau nul asupra nivelelor de Endoxifen.'
  },
  {
    substance: 'Izoflavone din Soia / Fitoestrogeni concentrați',
    category: 'supliment',
    riskLevel: 'CAUTION',
    riskLabel: 'Precauție / De evitat în doze mari',
    mechanism: 'Activitate estrogenică slabă la nivelul receptorilor mamari.',
    recommendation: 'Consumul moderat de alimente integrale pe bază de soia (edamame, tofu organic) este sigur, dar EVITĂ suplimentele concentrate de izoflavone.',
    details: 'Capsulele concentrate de fitoestrogeni comercializate pentru menopauză pot interfera cu receptorii ER.'
  },
  {
    substance: 'Vitamina D3 + K2',
    category: 'supliment',
    riskLevel: 'SAFE',
    riskLabel: 'Recomandat & Benefic',
    mechanism: 'Susține densitatea osoasă și sistemul imunitar.',
    recommendation: 'Menținerea nivelului sanguin de 25-OH-Vitamina D între 40-60 ng/ml este recomandată.',
    details: 'Nu interacționează negativ cu Tamoxifenul și protejează sănătatea musculo-scheletică.'
  },
  {
    substance: 'Magneziu (Bisglicinat / Malat)',
    category: 'supliment',
    riskLevel: 'SAFE',
    riskLabel: 'Recomandat pentru Somn & Crampe',
    mechanism: 'Relaxare musculară și reglare neuromusculară.',
    recommendation: 'Util util seara înainte de culcare pentru prevenirea crampelor nocturne și susținerea somnului.',
    details: 'Compatibilitate excelentă cu Tamoxifen.'
  },
  {
    substance: 'Gheara Diavolului / Curcumin concentrat',
    category: 'supliment',
    riskLevel: 'CAUTION',
    riskLabel: 'Precauție cu anticoagulante',
    mechanism: 'Ușor efect antiplachetar.',
    recommendation: 'Tamoxifenul crește ușor riscul de tromboză; anunță medicul înainte de a lua doze mari de antiinflamatoare naturale.',
    details: 'Utilizează doar la recomandarea medicului oncolog sau integrativ.'
  }
];

export function searchInteractions(query: string): DrugInteraction[] {
  if (!query.trim()) return INTERACTIONS_DB;
  const q = query.toLowerCase();
  return INTERACTIONS_DB.filter(item =>
    item.substance.toLowerCase().includes(q) ||
    item.mechanism.toLowerCase().includes(q) ||
    item.details.toLowerCase().includes(q) ||
    item.recommendation.toLowerCase().includes(q)
  );
}
