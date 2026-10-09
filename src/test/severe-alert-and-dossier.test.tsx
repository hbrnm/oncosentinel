import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';
import { JournalTab } from '../components/JournalTab';
import { ProfileTab } from '../components/ProfileTab';
import { DEFAULT_PROFILE } from '../lib/supabase';

describe('Alerta pentru simptome severe', () => {
  afterEach(() => vi.useRealTimers());

  it('rămâne pe ecran, trimite la 112 și la semnalele de alarmă', () => {
    vi.useFakeTimers();
    const onRedFlags = vi.fn();
    window.addEventListener('navimed_open_red_flags', onRedFlags);
    const { container } = render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} />);

    fireEvent.click(screen.getByText('Formular detaliat simptome'));
    const fatigue = container.querySelector('input[aria-label="Nivel oboseală"]')!;
    fireEvent.change(fatigue, { target: { value: '5' } });
    fireEvent.click(screen.getByText('Salvează simptomele'));

    act(() => { vi.advanceTimersByTime(10000); });
    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Ai notat un simptom puternic')).toBeInTheDocument();
    expect(within(alert).getByRole('link', { name: '112' })).toHaveAttribute('href', 'tel:112');

    fireEvent.click(within(alert).getByText('Vezi semnalele de alarmă'));
    expect(onRedFlags).toHaveBeenCalled();
    window.removeEventListener('navimed_open_red_flags', onRedFlags);

    fireEvent.click(screen.getByLabelText('Închide alerta'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Dosar Medical din Profil', () => {
  it('arată numărul real de documente și trimite spre Cronologie', () => {
    const onNavigateToTab = vi.fn();
    render(<ProfileTab profile={DEFAULT_PROFILE} doses={[]} onUpdateProfile={vi.fn()} onNavigateToTab={onNavigateToTab} documentsCount={2} />);

    fireEvent.click(screen.getByRole('button', { name: 'Dosar Medical' }));

    expect(screen.getByText('Ai 2 documente salvate pe acest dispozitiv.')).toBeInTheDocument();
    expect(screen.queryByText(/12 documente/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Vezi și încarcă documente în Cronologie'));
    expect(onNavigateToTab).toHaveBeenCalledWith('timeline');
  });
});
