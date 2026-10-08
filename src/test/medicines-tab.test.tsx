import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GuideTab } from '../components/GuideTab';
import { INTERACTIONS_DB } from '../lib/interactions';

describe('Ghiduri → Medicamente', () => {
  it('arată lista aprobată, cu nivel în text și sursă', () => {
    render(<GuideTab onOpenRedFlags={vi.fn()} />);
    fireEvent.click(screen.getByText('Medicamente'));

    expect(screen.getByText(/verifică întotdeauna cu medicul sau farmacistul/)).toBeInTheDocument();
    expect(screen.getByText('Paroxetină, fluoxetină, bupropion, chinidină, cinacalcet')).toBeInTheDocument();
    expect(screen.getAllByText('De evitat').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sursa: RCP tamoxifen/).length).toBeGreaterThan(0);
  });

  it('caută și spune clar că lipsa din listă nu înseamnă siguranță', () => {
    render(<GuideTab onOpenRedFlags={vi.fn()} />);
    fireEvent.click(screen.getByText('Medicamente'));
    const search = screen.getByLabelText('Caută un medicament sau un supliment');

    fireEvent.change(search, { target: { value: 'sunătoare' } });
    expect(screen.getByText('Sunătoare (ceai, tinctură, capsule)')).toBeInTheDocument();
    expect(screen.queryByText(/Grepfrut/)).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: 'ibuprofen' } });
    expect(screen.getByText(/Asta nu înseamnă că e sigur/)).toBeInTheDocument();
  });

  it('include rifampicina, confirmată în prospectul românesc', () => {
    const r = INTERACTIONS_DB.find(i => i.substance.startsWith('Rifampicină'))!;
    expect(r).toMatchObject({ levelLabel: 'Spune medicului', advice: 'Poate scădea nivelul tamoxifenului din sânge.' });
    expect(r.source).toMatch(/ANMDMR/);
  });

  it('nu mai conține afirmațiile scoase', () => {
    const all = JSON.stringify(INTERACTIONS_DB);
    expect(all).not.toMatch(/70%|Vitamina D|Magneziu|Curcumin|Venlafaxin|Contraindicație/i);
  });
});
