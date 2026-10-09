import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ProfileTab } from '../components/ProfileTab';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { setNextControlDate } from '../lib/appointments';
import { DoseLog } from '../types';

const localDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('Controalele din Profil', () => {
  beforeEach(() => localStorage.clear());

  it('un control adăugat din Profil devine următorul control, chiar dacă există unul vechi', () => {
    localStorage.setItem('navimed_appointments_list', JSON.stringify([
      { id: 'vechi', date: localDay(-40), specialty: 'Oncologie', status: 'completed' },
    ]));
    render(<ProfileTab profile={DEFAULT_PROFILE} doses={[]} onUpdateProfile={() => {}} onNavigateToTab={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Adaugă control' }));
    fireEvent.change(document.querySelector('form input[type="date"]')!, { target: { value: localDay(30) } });
    fireEvent.click(screen.getByRole('button', { name: 'Adaugă' }));
    expect(localStorage.getItem('navimed_next_control_date')).toBe(localDay(30));
  });

  it('un control adăugat în altă parte apare și în Profil', () => {
    render(<ProfileTab profile={DEFAULT_PROFILE} doses={[]} onUpdateProfile={() => {}} onNavigateToTab={() => {}} />);
    expect(screen.getByText(/Niciun control viitor/)).toBeInTheDocument();
    act(() => setNextControlDate(localDay(12)));
    expect(screen.queryByText(/Niciun control viitor/)).not.toBeInTheDocument();
  });
});

describe('Calendarul fără data de început', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 10, 12));
  });
  afterEach(() => vi.useRealTimers());

  const noStart = { ...DEFAULT_PROFILE, tamoxifen_start_date: '' };

  it('fără doze, zilele trecute nu sunt socotite sărite', () => {
    render(<TreatmentTab profile={noStart} doses={[]} onTakeDose={() => {}} />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.queryByTitle(/Doză nebifată/)).not.toBeInTheDocument();
  });

  it('numără de la prima doză notată', () => {
    const iso = new Date(2026, 9, 8, 12).toISOString();
    const dose: DoseLog = { id: 'd8', medication_name: 'Tamoxifen 20 mg', scheduled_for: iso, taken_at: iso, status: 'taken' };
    render(<TreatmentTab profile={noStart} doses={[dose]} onTakeDose={() => {}} />);
    expect(screen.getByText('Ai marcat 1 din 2 zile.')).toBeInTheDocument();
    expect(screen.getAllByTitle(/Doză nebifată/)).toHaveLength(1);
  });
});
