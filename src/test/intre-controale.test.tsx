import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DoctorVisitModal } from '../components/DoctorVisitModal';
import { lastControlDate } from '../lib/appointments';
import { periodDays, controlDateLabel, doctorSummary } from '../lib/summary';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { SymptomLog } from '../types';
import type { AppointmentItem } from '../components/DoctorVisitModal';

// „Între două controale” (planul 005, etapa 1; deciziile proprietarei din 2026-10-09)

const texts: string[] = [];
const tables: unknown[][][] = [];
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function () {
    return new Proxy({}, {
      get: (_t, prop) => {
        if (prop === 'text') return (t: string) => { texts.push(t); };
        if (prop === 'lastAutoTable') return { finalY: 120 };
        return () => undefined;
      }
    });
  })
}));
vi.mock('jspdf-autotable', () => ({ default: vi.fn((_doc, opts: { body: unknown[][] }) => { tables.push(opts.body); }) }));

const appt = (date: string, status: AppointmentItem['status']): AppointmentItem => ({ id: `${date}-${status}`, date, specialty: 'Oncologie', status });
const note = (day: string, mood = 'Echilibrată'): SymptomLog => ({ id: `n-${day}-${mood}`, logged_at: `${day}T10:00:00`, kind: 'note', mood_state: mood });

beforeEach(() => {
  localStorage.clear();
  texts.length = 0;
  tables.length = 0;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-09T12:00:00'));
});
afterEach(() => vi.useRealTimers());

describe('Ultimul control și perioada', () => {
  it('ultimul control e cel mai recent trecut, efectuat sau rămas „programat”', () => {
    expect(lastControlDate([
      appt('2026-04-02', 'completed'),
      appt('2026-07-12', 'upcoming'),
      appt('2026-08-20', 'missed'),
      appt('2026-09-01', 'cancelled'),
      appt('2026-12-01', 'upcoming')
    ])).toBe('2026-07-12');
  });

  it('fără control trecut nu există ultimul control', () => {
    expect(lastControlDate([appt('2026-12-01', 'upcoming'), appt('2026-10-09', 'upcoming')])).toBeNull();
  });

  it('perioada începe a doua zi după control și se termină azi', () => {
    const days = periodDays('2026-07-12');
    expect(days).toHaveLength(89);
    expect(days[0]).toBe('2026-07-13');
    expect(days[days.length - 1]).toBe('2026-10-09');
  });

  it('data controlului se scrie în cuvinte, cu anul doar dacă nu e anul curent', () => {
    expect(controlDateLabel('2026-07-12')).toBe('12 iulie');
    expect(controlDateLabel('2025-12-03')).toBe('3 decembrie 2025');
  });

  it('rezumatul ia doar notele din perioadă și starea cea mai des', () => {
    const logs = [note('2026-07-12', 'Foarte rău'), note('2026-07-13'), note('2026-08-01'), note('2026-10-01', 'Bine')];
    const s = doctorSummary(logs, [], '', '2026-07-12');
    expect(s.notes).toBe(3);
    expect(s.days).toBe(89);
    expect(s.mood).toEqual({ label: 'Liniștită', count: 2 });
  });
});

describe('Raportul PDF', () => {
  it('urmează perioada aleasă și ia toate notele din ea, nu doar 15', () => {
    const logs = Array.from({ length: 20 }, (_, i) => note(`2026-09-${String(i + 1).padStart(2, '0')}`));
    logs.push(note('2026-07-01'));
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], logs, '2026-07-12');
    const report = texts.join('\n');
    expect(report).toContain('(DE LA CONTROLUL DIN 12 IULIE, 89 DE ZILE)');
    expect(report).toContain('Starea notată cel mai des: Liniștită (20 de note).');
    expect(tables[0]).toHaveLength(20);
  });

  it('pune subsolul cu numărul paginii pe fiecare pagină', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], [], '2026-07-12');
    expect(texts.filter(t => t.startsWith('Pagina '))).toEqual(['Pagina 1 / 1 • Confidențial Medical (GDPR)']);
  });

  it('fără control ales, raportul acoperă ultimele 28 de zile', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], [note('2026-10-01'), note('2026-09-01')]);
    expect(texts.join('\n')).toContain('(ULTIMELE 28 DE ZILE)');
    expect(tables[0]).toHaveLength(1);
  });
});

describe('În „Pentru medic”', () => {
  const open = () => render(
    <DoctorVisitModal isOpen onClose={vi.fn()} profile={{ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }} doses={[]} symptoms={[note('2026-08-01'), note('2026-10-02', 'Bine')]} />
  );

  it('cu un control trecut, se poate alege perioada de la ultimul control', () => {
    localStorage.setItem('navimed_appointments_list', JSON.stringify([appt('2026-07-12', 'completed')]));
    open();
    expect(screen.getByText(/Ce ai notat în ultimele 4 săptămâni/)).toBeInTheDocument();
    expect(screen.getByText('Note în jurnal: 1.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'De la ultimul control' }));
    expect(screen.getByRole('button', { name: 'De la ultimul control' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Ce ai notat de la controlul din 12 iulie (89 de zile). Poți arăta ecranul sau descărca raportul.')).toBeInTheDocument();
    expect(screen.getByText('Note în jurnal: 2.')).toBeInTheDocument();
    expect(screen.getByText('Starea notată cel mai des: Liniștită (1 notă).')).toBeInTheDocument();
  });

  it('fără control trecut, explică de ce lipsește alegerea', () => {
    open();
    expect(screen.queryByRole('button', { name: 'De la ultimul control' })).not.toBeInTheDocument();
    expect(screen.getByText('După primul control trecut în „Controale medicale”, vei putea alege și perioada de la ultimul control.')).toBeInTheDocument();
  });
});
