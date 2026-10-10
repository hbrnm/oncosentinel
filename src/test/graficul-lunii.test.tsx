import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { TrendChart } from '../components/TrendChart';
import { symptomTrend, trendHasData, weekLabel } from '../lib/summary';
import { SymptomLog } from '../types';

// Azi: vineri, 9 octombrie 2026; ultima săptămână din grafic e 3–9 oct.
const TODAY = new Date('2026-10-09T12:00:00');

let nextId = 0;
const at = (iso: string, extra: Partial<SymptomLog> = {}): SymptomLog =>
  ({ id: `s${nextId++}`, logged_at: `${iso}T12:00:00`, kind: 'symptoms', ...extra } as SymptomLog);

describe('Graficul lunii: datele pe săptămâni', () => {
  it('are 13 săptămâni, cea mai veche prima, ultima se termină azi', () => {
    const weeks = symptomTrend([], TODAY);
    expect(weeks).toHaveLength(13);
    expect(weeks[12]).toMatchObject({ start: '2026-10-03', end: '2026-10-09' });
    expect(weeks[0]).toMatchObject({ start: '2026-07-11', end: '2026-07-17' });
  });

  it('adună bufeurile și face media durerilor și a somnului, pe săptămână', () => {
    const weeks = symptomTrend([
      at('2026-10-08', { hot_flashes_count: 3, joint_pain_level: 2, sleep_quality: 4 }),
      at('2026-10-05', { hot_flashes_count: 2, joint_pain_level: 3, sleep_quality: 3 }),
      at('2026-09-30', { hot_flashes_count: 0, joint_pain_level: 0, sleep_quality: 5 })
    ], TODAY);
    expect(weeks[12]).toMatchObject({ flashes: 5, joint: 2.5, sleep: 3.5 });
    expect(weeks[11]).toMatchObject({ flashes: 0, joint: 0, sleep: 5 });
    expect(weeks[10]).toMatchObject({ flashes: null, joint: null, sleep: null });
  });

  it('nu ia în calcul notele simple (doar stare și gânduri) și nici somnul nenotat (0)', () => {
    const weeks = symptomTrend([
      at('2026-10-08', { kind: 'note', hot_flashes_count: 9, sleep_quality: 1 }),
      at('2026-10-07', { sleep_quality: 0 })
    ], TODAY);
    expect(weeks[12]).toMatchObject({ flashes: null, sleep: null });
  });

  it('cere simptome în cel puțin două săptămâni', () => {
    expect(trendHasData(symptomTrend([at('2026-10-08', { hot_flashes_count: 1 })], TODAY))).toBe(false);
    expect(trendHasData(symptomTrend([at('2026-10-08', { hot_flashes_count: 1 }), at('2026-09-20', { sleep_quality: 3 })], TODAY))).toBe(true);
  });

  it('scrie săptămâna scurt, și peste două luni', () => {
    expect(weekLabel({ start: '2026-10-03', end: '2026-10-09', flashes: null, joint: null, sleep: null })).toBe('3–9 oct.');
    expect(weekLabel({ start: '2026-09-27', end: '2026-10-03', flashes: null, joint: null, sleep: null })).toBe('27 sept. – 3 oct.');
  });
});

describe('Graficul lunii în Jurnal', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(TODAY);
  });
  afterEach(() => vi.useRealTimers());

  it('fără date în două săptămâni, spune când apare graficul', () => {
    render(<TrendChart symptoms={[at('2026-10-08', { hot_flashes_count: 1 })]} />);
    expect(screen.getByRole('heading', { name: 'Ultimele 3 luni' })).toBeInTheDocument();
    expect(screen.getByText('Graficul apare după ce notezi simptome în cel puțin două săptămâni.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('arată cele trei grafice cu textele aprobate și un tabel pentru cititorul de ecran', () => {
    render(<TrendChart symptoms={[
      at('2026-10-08', { hot_flashes_count: 4, joint_pain_level: 2, sleep_quality: 3 }),
      at('2026-09-29', { hot_flashes_count: 6, joint_pain_level: 1, sleep_quality: 4 })
    ]} />);
    expect(screen.getByText('Cum au evoluat, săptămână cu săptămână, din ce ai notat tu.')).toBeInTheDocument();
    expect(screen.getByText('Bufeuri: câte ai notat pe săptămână')).toBeInTheDocument();
    expect(screen.getByText('Dureri articulare: media notelor, de la 0 la 5')).toBeInTheDocument();
    expect(screen.getByText('Somn: media notelor, de la 1 la 5 (5 = foarte bine)')).toBeInTheDocument();
    expect(screen.getByText('Săptămânile fără note rămân goale.')).toBeInTheDocument();

    const lastRow = within(screen.getByRole('table')).getByRole('row', { name: /3–9 oct\./ });
    expect(within(lastRow).getAllByRole('cell').map(c => c.textContent)).toEqual(['4', '2', '3']);
  });
});
