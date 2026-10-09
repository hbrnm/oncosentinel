import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DashboardTab } from '../components/DashboardTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { treatmentJourneyText } from '../lib/summary';

// Drumul tratamentului (planul 006; deciziile proprietarei din 2026-10-09):
// doar timpul parcurs, în ani și luni, rotunjit în jos, fără durată totală; aniversare la fiecare an

const TODAY = new Date(2026, 9, 9, 12, 0);

describe('Timpul parcurs', () => {
  it('fără dată de început, azi sau în viitor nu arată nimic', () => {
    expect(treatmentJourneyText('', TODAY)).toBeNull();
    expect(treatmentJourneyText('2026-10-09', TODAY)).toBeNull();
    expect(treatmentJourneyText('2026-11-01', TODAY)).toBeNull();
  });

  it('sub o săptămână: zile', () => {
    expect(treatmentJourneyText('2026-10-08', TODAY)).toBe('Ești pe drum de 1 zi.');
    expect(treatmentJourneyText('2026-10-05', TODAY)).toBe('Ești pe drum de 4 zile.');
  });

  it('sub o lună: săptămâni', () => {
    expect(treatmentJourneyText('2026-10-02', TODAY)).toBe('Ești pe drum de 1 săptămână.');
    expect(treatmentJourneyText('2026-09-12', TODAY)).toBe('Ești pe drum de 3 săptămâni.');
  });

  it('sub un an: luni, rotunjit în jos', () => {
    expect(treatmentJourneyText('2026-09-09', TODAY)).toBe('Ești pe drum de 1 lună.');
    expect(treatmentJourneyText('2026-05-10', TODAY)).toBe('Ești pe drum de 4 luni.');
  });

  it('peste un an: ani și luni', () => {
    expect(treatmentJourneyText('2025-07-01', TODAY)).toBe('Ești pe drum de 1 an și 3 luni.');
    expect(treatmentJourneyText('2024-09-01', TODAY)).toBe('Ești pe drum de 2 ani și 1 lună.');
    expect(treatmentJourneyText('2025-10-01', TODAY)).toBe('Ești pe drum de 1 an.');
  });

  it('la fiecare an împlinit, mesaj de aniversare', () => {
    expect(treatmentJourneyText('2025-10-09', TODAY)).toBe('Azi se împlinește 1 an de când ai început tratamentul. Felicitări din inimă.');
    expect(treatmentJourneyText('2023-10-09', TODAY)).toBe('Azi se împlinesc 3 ani de când ai început tratamentul. Felicitări din inimă.');
  });
});

describe('Cazuri-limită', () => {
  it('o dată greșită nu arată nimic', () => {
    expect(treatmentJourneyText('2025-07', TODAY)).toBeNull();
    expect(treatmentJourneyText('ieri', TODAY)).toBeNull();
  });

  it('trecerile de la zile la săptămâni și de la săptămâni la luni', () => {
    expect(treatmentJourneyText('2026-10-03', TODAY)).toBe('Ești pe drum de 6 zile.');
    expect(treatmentJourneyText('2026-09-10', TODAY)).toBe('Ești pe drum de 4 săptămâni.');
  });

  it('început pe 31: luna se împlinește în ultima zi a lunilor scurte', () => {
    expect(treatmentJourneyText('2026-01-31', new Date(2026, 1, 28))).toBe('Ești pe drum de 1 lună.');
  });

  it('început pe 29 februarie: aniversarea e pe 28 februarie în anii nebisecți', () => {
    expect(treatmentJourneyText('2024-02-29', new Date(2025, 1, 28))).toBe('Azi se împlinește 1 an de când ai început tratamentul. Felicitări din inimă.');
    expect(treatmentJourneyText('2024-02-29', new Date(2025, 1, 27))).toBe('Ești pe drum de 11 luni.');
  });
});

describe('Pe Astăzi', () => {
  afterEach(() => vi.useRealTimers());

  const renderToday = (start: string) =>
    render(
      <DashboardTab
        profile={{ ...DEFAULT_PROFILE, tamoxifen_start_date: start }}
        doses={[]}
        onTakeDose={() => {}}
        onOpenRedFlags={() => {}}
        onOpenBreathing={() => {}}
        onOpenDoctorVisit={() => {}}
        onOpenGrounding={() => {}}
        onOpenSupporter={() => {}}
      />
    );

  it('rândul apare sub salut', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
    renderToday('2025-07-01');
    expect(screen.getByText('Ești pe drum de 1 an și 3 luni.')).toBeInTheDocument();
  });

  it('fără dată de început nu apare', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
    renderToday('');
    expect(screen.queryByText(/Ești pe drum/)).not.toBeInTheDocument();
  });
});
