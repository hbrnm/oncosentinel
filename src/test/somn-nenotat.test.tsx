import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { storageService } from '../lib/supabase';

// Somnul pornește nenotat și se salvează doar dacă pacienta îl alege (decizia proprietarei, 2026-10-10)

const openSymptoms = () => {
  localStorage.setItem('oncosentinel_onboarded', 'true');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
  fireEvent.click(screen.getByText('Formular detaliat simptome'));
};
const sleepSlider = () => screen.getByRole('slider', { name: 'Calitatea somnului' }) as HTMLInputElement;
const savedSleep = () => storageService.getSymptomLogs().find(l => l.kind === 'symptoms')!.sleep_quality;

describe('Jurnal: somnul nenotat', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });
  afterEach(() => vi.useRealTimers());

  it('neatins, nu se salvează (nu mai apare 3 din oficiu)', () => {
    openSymptoms();
    expect(screen.getByText('Scor –/5')).toBeInTheDocument();
    expect(sleepSlider()).toHaveAttribute('aria-valuetext', 'nenotat');
    fireEvent.click(screen.getByText('Salvează simptomele'));
    expect(savedSleep()).toBeUndefined();
  });

  it('se salvează valoarea aleasă', () => {
    openSymptoms();
    fireEvent.change(sleepSlider(), { target: { value: '2' } });
    expect(screen.getByText('Scor 2/5')).toBeInTheDocument();
    expect(sleepSlider()).not.toHaveAttribute('aria-valuetext');
    fireEvent.click(screen.getByText('Salvează simptomele'));
    expect(savedSleep()).toBe(2);
  });

  it('o atingere chiar pe mijloc alege 3', () => {
    openSymptoms();
    fireEvent.click(sleepSlider());
    fireEvent.click(screen.getByText('Salvează simptomele'));
    expect(savedSleep()).toBe(3);
  });

  it('la redeschidere, somnul salvat azi rămâne ales', () => {
    storageService.saveSymptomLogs([{ id: 'azi', logged_at: new Date().toISOString(), kind: 'symptoms', sleep_quality: 4 }]);
    openSymptoms();
    act(() => { vi.advanceTimersByTime(0); });
    expect(screen.getByText('Scor 4/5')).toBeInTheDocument();
  });
});

describe('Istoric: somnul 3 apare doar la notele noi', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-13T12:00:00'));
  });
  afterEach(() => vi.useRealTimers());

  it('ascunde 3 la notele de dinainte de 11 octombrie (era pus din oficiu), îl arată la cele noi', () => {
    storageService.saveSymptomLogs([
      { id: 'nou', logged_at: '2026-10-12T12:00:00', kind: 'symptoms', sleep_quality: 3 },
      { id: 'limita-dupa', logged_at: '2026-10-11T00:01:00', kind: 'symptoms', sleep_quality: 3 },
      { id: 'limita-inainte', logged_at: '2026-10-10T23:59:00', kind: 'symptoms', sleep_quality: 3 },
      { id: 'vechi-3', logged_at: '2026-10-05T12:00:00', kind: 'symptoms', sleep_quality: 3 },
      { id: 'vechi-2', logged_at: '2026-10-04T12:00:00', kind: 'symptoms', sleep_quality: 2 }
    ]);
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));

    expect(screen.getAllByText('Somn: 3/5')).toHaveLength(2);
    expect(screen.getByText('Somn: 2/5')).toBeInTheDocument();
  });
});
