import { describe, it, expect } from 'vitest';
import { CLINICAL_GUIDES, NEWS_PROTOCOLS } from '../data/guides';
import { RECIPES } from '../data/recipes';
import { INTERACTIONS_DB } from '../lib/interactions';

// Conținut rescris din surse și aprobat de proprietară (docs/rescriere-etapa0.md)
describe('Conținutul medical rescris', () => {
  const g1 = CLINICAL_GUIDES.find(g => g.id === 'g1')!;

  it('ghidul despre tamoxifen are surse și nu mai conține afirmațiile scoase', () => {
    expect(g1.content).toMatch(/\*Surse:/);
    expect(g1.content).toMatch(/112/);
    expect(g1.content).toMatch(/umflare bruscă a feței, a buzelor sau a gâtului/);
    expect(g1.content).not.toMatch(/40–50%|80% dintre paciente|obligatoriu|excelentă/);
  });

  it('Noutăți: doar cele aprobate (docs/noutati-texte.md), fiecare cu sursă', () => {
    expect(NEWS_PROTOCOLS.map(n => n.id)).toEqual(['n1', 'n2', 'n3', 'n4', 'n5']);
    NEWS_PROTOCOLS.forEach(n => expect(n.content).toMatch(/\*Surs[ae]: /));
    expect(NEWS_PROTOCOLS[0].content).toMatch(/\*Sursa: Gandini/);
    expect(NEWS_PROTOCOLS[0].content).toMatch(/După menopauză/);
    expect(NEWS_PROTOCOLS[0].summary).not.toMatch(/extrem de eficiente/);
  });

  it('ghidurile despre bufeuri și controale au surse și nu mai promit ce nu e dovedit', () => {
    const g2 = CLINICAL_GUIDES.find(g => g.id === 'g2')!;
    const g3 = CLINICAL_GUIDES.find(g => g.id === 'g3')!;
    expect(g2.content).toMatch(/\*Sursa: The Menopause Society/);
    expect(g2.content).not.toMatch(/50%|validate/);
    expect(g3.content).toMatch(/\*Surse: NICE NG101/);
    expect(g3.content).not.toMatch(/ecografie transvaginală anuală/);
  });

  it('ghidurile despre alimentație, mișcare, meditație și yoga au surse și nu promit vindecare', () => {
    const byId = (id: string) => CLINICAL_GUIDES.find(g => g.id === id)!;
    expect(byId('g4').content).toMatch(/\*Sursa: World Cancer Research Fund International/);
    expect(byId('g5').content).toMatch(/\*Sursa: Campbell KL/);
    expect(byId('g6').content).toMatch(/\*Sursa: Carlson LE/);
    // Fără alimente „anti-cancer”, fără doze de suplimente, fără să înlocuiască tratamentul
    expect(byId('g4').content).not.toMatch(/antitumoral|anti-cancer|detox|\d+\s*(UI|mg)/i);
    expect(byId('g6').content).toMatch(/Nu înlocuiesc tratamentul/);
    // SIO–ASCO 2023 integral: hipnoza doar la investigații și proceduri, relaxarea doar în tratamentul activ
    expect(byId('g6').content).not.toMatch(/Hipnoza și tehnicile de relaxare sunt și ele opțiuni/);
    expect(byId('g6').content).toMatch(/anii cu tamoxifen drept „după tratament”/);
  });

  it('ghidul pentru primele 30 de zile urmează imediat după ghidul despre tamoxifen, are sursă și trimite la medic', () => {
    expect(CLINICAL_GUIDES[1].id).toBe('g7');
    const g7 = CLINICAL_GUIDES[1];
    expect(g7.title).toBe('Primele 30 de zile cu tamoxifen');
    expect(g7.content).toMatch(/\*Sursa: Macmillan Cancer Support/);
    expect(g7.content).toMatch(/Nu opri tamoxifenul singură/);
    expect(g7.content).toMatch(/112/);
    expect(g7.content).not.toMatch(/\d+\s*mg/);
  });

  it('rețetele sunt idei de mese, fără promisiuni terapeutice sau surse neverificate', () => {
    const all = JSON.stringify(RECIPES);
    expect(RECIPES.find(r => r.title.includes('Salvie'))).toBeUndefined();
    expect(all).not.toMatch(/Sursă|antitumoral|detoxifiere|anti-estrogenic|bufeu|Tamoxifen/i);
  });

  it('ghidul și interacțiunile urmează prospectul românesc (Tamoxifen Sandoz, ANMDMR)', () => {
    expect(g1.content).not.toMatch(/Ia-o când îți amintești/);
    expect(g1.content).toMatch(/întreabă medicul sau farmacistul/);
    expect(g1.content).toMatch(/în timpul mesei/);
    expect(g1.content).toMatch(/spune-i chirurgului că iei tamoxifen/);
    const estrogen = INTERACTIONS_DB.find(i => i.substance.startsWith('Medicamente cu estrogen'))!;
    expect(estrogen.advice).toMatch(/fără hormoni.*încă 2 luni după/);
    expect(estrogen.advice).not.toMatch(/una alteia/);
    expect(INTERACTIONS_DB.find(i => i.substance.startsWith('Anastrozol'))!.source).toMatch(/Tamoxifen Sandoz/);
  });
});
