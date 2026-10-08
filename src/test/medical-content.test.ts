import { describe, it, expect } from 'vitest';
import { CLINICAL_GUIDES, NEWS_PROTOCOLS } from '../data/guides';

// Conținut rescris din surse și aprobat de proprietară (docs/rescriere-etapa0.md)
describe('Conținutul medical rescris', () => {
  const g1 = CLINICAL_GUIDES.find(g => g.id === 'g1')!;

  it('ghidul despre tamoxifen are surse și nu mai conține afirmațiile scoase', () => {
    expect(g1.content).toMatch(/\*Surse:/);
    expect(g1.content).toMatch(/112/);
    expect(g1.content).not.toMatch(/40–50%|80% dintre paciente|obligatoriu|excelentă/);
  });

  it('Noutăți: doar studiul despre doza mică, cu sursă și fără exagerări', () => {
    expect(NEWS_PROTOCOLS.map(n => n.id)).toEqual(['n1']);
    expect(NEWS_PROTOCOLS[0].content).toMatch(/\*Sursa: Gandini/);
    expect(NEWS_PROTOCOLS[0].content).toMatch(/După menopauză/);
    expect(NEWS_PROTOCOLS[0].summary).not.toMatch(/extrem de eficiente/);
  });
});
