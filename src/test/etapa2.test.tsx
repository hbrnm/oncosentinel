import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { DoctorVisitModal } from '../components/DoctorVisitModal';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { weekSummary, doctorSummary, nextVictory, localDay } from '../lib/summary';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { DoseLog, SymptomLog } from '../types';

vi.mock('../lib/pdfGenerator', () => ({ generateOncologyReport: vi.fn() }));

const daysAgo = (n: number, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d;
};
const note = (n: number, extra: Partial<SymptomLog> = {}): SymptomLog =>
  ({ id: `s${n}-${Math.random()}`, logged_at: daysAgo(n).toISOString(), mood_state: 'Bine', hot_flashes_count: 0, sleep_quality: 3, fatigue_level: 1, joint_pain_level: 0, ...extra } as SymptomLog);
const dose = (n: number): DoseLog => ({ id: `d${n}`, medication_name: 'Tamoxifen', scheduled_for: daysAgo(n).toISOString(), taken_at: daysAgo(n).toISOString(), status: 'taken' });

describe('Săptămâna ta', () => {
  it('fără note în ultimele 7 zile, invită blând la jurnal', () => {
    expect(weekSummary([note(10)])).toEqual(['Săptămâna asta nu ai notat încă. Jurnalul te așteaptă, când vrei.']);
  });

  it('spune câte zile ai notat, starea cea mai des și compară somnul și bufeurile', () => {
    const lines = weekSummary([
      note(1, { sleep_quality: 5, hot_flashes_count: 1 }),
      note(2, { sleep_quality: 4, hot_flashes_count: 0 }),
      note(8, { sleep_quality: 2, hot_flashes_count: 4, mood_state: 'Rău' })
    ]);
    expect(lines).toEqual([
      'Ai notat în 2 din ultimele 7 zile.',
      'Cel mai des te-ai simțit: Bine.',
      'Ai dormit mai bine decât săptămâna trecută.',
      'Ai notat mai puține bufeuri decât săptămâna trecută.'
    ]);
  });

  it('somn mai greu și mai multe bufeuri trimit blând la medic și la ghid', () => {
    const lines = weekSummary([note(1, { sleep_quality: 1, hot_flashes_count: 5 }), note(9, { sleep_quality: 4, hot_flashes_count: 1 })]);
    expect(lines).toContain('Ai notat într-o zi din ultimele 7.');
    expect(lines).toContain('Somnul a fost mai greu decât săptămâna trecută. Dacă te supără, spune-i medicului.');
    expect(lines).toContain('Ai notat mai multe bufeuri decât săptămâna trecută. Ghidul despre bufeuri te poate ajuta.');
  });

  it('apare în Jurnal', () => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
    expect(screen.getByRole('heading', { name: 'Săptămâna ta' })).toBeInTheDocument();
    expect(screen.getByText('Rezumatul vine doar din ce ai notat tu.')).toBeInTheDocument();
  });
});

describe('Pentru medic', () => {
  it('rezumă dozele, notele și cele mai dese simptome din ultimele 4 săptămâni', () => {
    const s = doctorSummary(
      [note(1, { hot_flashes_count: 2 }), note(3, { hot_flashes_count: 1, fatigue_level: 5 }), note(40, { hot_flashes_count: 9 })],
      [dose(0), dose(1), dose(2)],
      localDay(daysAgo(9))
    );
    expect(s.doses).toEqual({ taken: 3, total: 10 });
    expect(s.notes).toBe(2);
    expect(s.top).toEqual(['Bufeuri: în 2 note', 'Oboseală puternică (4–5 din 5): într-o notă']);
  });

  it('arată secțiunea și descarcă raportul PDF', async () => {
    localStorage.clear();
    render(<DoctorVisitModal isOpen={true} onClose={vi.fn()} profile={DEFAULT_PROFILE} doses={[]} symptoms={[]} />);

    expect(screen.getByRole('heading', { name: 'Pentru medic' })).toBeInTheDocument();
    expect(screen.getByText('Nu ai notat simptome.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Descarcă raportul PDF'));
    await waitFor(() => expect(generateOncologyReport).toHaveBeenCalled());
  });
});

describe('O mică victorie', () => {
  it('numără totalul, arată cea mai mare victorie nevăzută și le marchează pe toate din categorie', () => {
    const doses = Array.from({ length: 31 }, (_, i) => dose(i * 2));
    const v = nextVictory(doses, [], []);
    expect(v?.text).toBe('30 de zile cu doza marcată. Ești constantă, și se vede.');
    expect(v?.reachedIds).toEqual(['doze-30', 'doze-7']);
    expect(nextVictory(doses, [], ['doze-30', 'doze-7'])).toBeNull();
  });

  it('apare pe Astăzi după prima notă și dispare la „Mulțumesc”', () => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem('navimed_symptoms', JSON.stringify([note(0)]));
    const { unmount } = render(<App />);

    expect(screen.getByText('Prima ta notă în jurnal. Mulțumesc că ai început.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Mulțumesc'));
    expect(screen.queryByLabelText('O mică victorie')).not.toBeInTheDocument();

    unmount();
    render(<App />);
    expect(screen.queryByLabelText('O mică victorie')).not.toBeInTheDocument();
  });
});
