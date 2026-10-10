import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { MOVEMENT_KEY, loadMovement } from '../lib/movement';
import { weekSummary } from '../lib/summary';
import { backupService } from '../lib/backupService';

// „Mișcare azi” (planul 014; deciziile proprietarei din 2026-10-10)

const TODAY = new Date(2026, 9, 10, 12);

const journal = () =>
  render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} />);

const week = () => within(screen.getByRole('region', { name: 'Săptămâna ta' }));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TODAY);
});
afterEach(() => vi.useRealTimers());

describe('Mișcare azi', () => {
  it('notează minutele de azi și le adună în „Săptămâna ta”', () => {
    localStorage.setItem(MOVEMENT_KEY, JSON.stringify({ '2026-10-05': 40, '2026-10-01': 60 }));
    journal();
    expect(week().getByText('Te-ai mișcat 40 de minute în ultimele 7 zile.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '30 min' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvează' }));

    expect(screen.getByText('Am notat 30 de minute azi.')).toBeInTheDocument();
    expect(loadMovement()['2026-10-10']).toBe(30);
    expect(week().getByText('Te-ai mișcat 70 de minute în ultimele 7 zile.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Actualizează' })).toBeInTheDocument();
  });

  it('respinge un număr greșit, iar 0 șterge ziua', () => {
    localStorage.setItem(MOVEMENT_KEY, JSON.stringify({ '2026-10-10': 20 }));
    journal();
    const input = screen.getByRole('spinbutton', { name: 'Minute de mișcare azi' });
    expect(input).toHaveValue(20);

    fireEvent.change(input, { target: { value: '700' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizează' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Scrie un număr de minute între 0 și 600.');
    expect(loadMovement()['2026-10-10']).toBe(20);

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizează' }));
    expect(loadMovement()).toEqual({});
    expect(screen.queryByText(/Te-ai mișcat/)).not.toBeInTheDocument();
  });

  it('rândul din rezumat lipsește fără minute și apare lângă celelalte când există', () => {
    const note = { id: '1', logged_at: TODAY.toISOString(), kind: 'note' as const, mood_state: 'Bine' };
    expect(weekSummary([note], TODAY).some(l => l.startsWith('Te-ai mișcat'))).toBe(false);
    expect(weekSummary([note], TODAY, { '2026-10-09': 1 })).toContain('Te-ai mișcat 1 minut în ultimele 7 zile.');
  });

  it('copia de siguranță păstrează minutele', async () => {
    localStorage.setItem(MOVEMENT_KEY, JSON.stringify({ '2026-10-08': 25 }));
    const original = { location: window.location, create: URL.createObjectURL, revoke: URL.revokeObjectURL };
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    try {
      backupService.exportCompleteBackup();
      const text = await blob!.text();
      localStorage.clear();
      await backupService.importBackupFromFile(new File([text], 'copie.json'));
      expect(loadMovement()).toEqual({ '2026-10-08': 25 });
    } finally {
      Object.defineProperty(window, 'location', { value: original.location, configurable: true });
      URL.createObjectURL = original.create;
      URL.revokeObjectURL = original.revoke;
    }
  });

  it('date stricate nu blochează ecranul', () => {
    localStorage.setItem(MOVEMENT_KEY, '{nu e json');
    expect(loadMovement()).toEqual({});
    localStorage.setItem(MOVEMENT_KEY, JSON.stringify({ a: 10, b: 'x', c: -3 }));
    expect(loadMovement()).toEqual({ a: 10 });
  });
});
