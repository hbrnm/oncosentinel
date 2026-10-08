import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { DoseLog } from '../types';

// Aderența din Tratament: procent doar din zilele de numărat (2026-10-08)

const taken = (day: number): DoseLog => {
  const iso = new Date(2026, 9, day, 12).toISOString();
  return { id: `d${day}`, medication_name: 'Tamoxifen 20 mg', scheduled_for: iso, taken_at: iso, status: 'taken' };
};

const renderTab = (start: string, doses: DoseLog[]) =>
  render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, tamoxifen_start_date: start }} doses={doses} onTakeDose={() => {}} />);

describe('Aderența în Tratament', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 10, 12));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fără zile de numărat arată „—”, nu 100%', () => {
    renderTab('2026-10-10', []);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Încă nu sunt zile de numărat în această lună.')).toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });

  it('numără zilele de la începutul tratamentului; ziua de azi nebifată nu scade procentul', () => {
    renderTab('2026-10-08', [taken(8), taken(9)]);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Ai marcat 2 din 2 zile.')).toBeInTheDocument();
  });

  it('zilele trecute fără doză intră în calcul', () => {
    renderTab('2026-10-01', [taken(5), taken(10)]);
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('Ai marcat 2 din 10 zile.')).toBeInTheDocument();
  });

  it('la o singură zi scrie „1 din 1 zi”', () => {
    renderTab('2026-10-10', [taken(10)]);
    expect(screen.getByText('Ai marcat 1 din 1 zi.')).toBeInTheDocument();
  });
});
