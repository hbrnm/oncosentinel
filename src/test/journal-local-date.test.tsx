import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { SymptomLog } from '../types';

const log = (id: string, logged_at: string, notes: string): SymptomLog => ({
  id,
  logged_at,
  mood_state: 'Bine',
  notes
} as SymptomLog);

// Fusul orar e fixat la Europe/Bucharest în vitest.config.ts
describe('Jurnalul folosește ziua locală, nu UTC', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('o notă scrisă la 01:30 noaptea apare în istoric la ziua locală', () => {
    vi.setSystemTime(new Date('2026-10-09T06:00:00Z'));
    // 22:30 UTC pe 8 octombrie = 01:30 pe 9 octombrie la București
    render(
      <JournalTab profile={DEFAULT_PROFILE} symptoms={[log('1', '2026-10-08T22:30:00.000Z', 'Notă de noapte')]} doses={[]} onAddSymptomLog={vi.fn()} />
    );

    expect(screen.getByText('9 octombrie 2026')).toBeInTheDocument();
    expect(screen.queryByText('8 octombrie 2026')).not.toBeInTheDocument();
  });

  it('nota de ieri seară nu e preluată ca nota de azi după miezul nopții', () => {
    // acum: 01:00 pe 9 octombrie la București (22:00 UTC pe 8)
    vi.setSystemTime(new Date('2026-10-08T22:00:00Z'));
    // nota: 23:30 pe 8 octombrie la București
    render(
      <JournalTab profile={DEFAULT_PROFILE} symptoms={[log('1', '2026-10-08T20:30:00.000Z', 'Nota de aseară')]} doses={[]} onAddSymptomLog={vi.fn()} />
    );

    expect(screen.getByPlaceholderText(/Notează un gând/)).toHaveValue('');
  });
});
