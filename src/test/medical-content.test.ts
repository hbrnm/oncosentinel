import { describe, it, expect } from 'vitest';
import { CLINICAL_GUIDES, NEWS_PROTOCOLS } from '../data/guides';
import { RECIPES } from '../data/recipes';

// Conținut rescris din surse și aprobat de proprietară (docs/rescriere-etapa0.md)
describe('Conținutul medical rescris', () => {
  const g1 = CLINICAL_GUIDES.find(g => g.id === 'g1')!;

  it('ghidul despre tamoxifen are surse și nu mai conține afirmațiile scoase', () => {
    expect(g1.content).toMatch(/\*Surse:/);
    expect(g1.content).toMatch(/112/);
    expect(g1.content).toMatch(/umflare bruscă a feței, a buzelor sau a gâtului/);
    expect(g1.content).not.toMatch(/40–50%|80% dintre paciente|obligatoriu|excelentă/);
  });

  it('Noutăți: doar studiul despre doza mică, cu sursă și fără exagerări', () => {
    expect(NEWS_PROTOCOLS.map(n => n.id)).toEqual(['n1']);
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

  it('rețetele sunt idei de mese, fără promisiuni terapeutice sau surse neverificate', () => {
    const all = JSON.stringify(RECIPES);
    expect(RECIPES.find(r => r.title.includes('Salvie'))).toBeUndefined();
    expect(all).not.toMatch(/Sursă|antitumoral|detoxifiere|anti-estrogenic|bufeu|Tamoxifen/i);
  });
});
