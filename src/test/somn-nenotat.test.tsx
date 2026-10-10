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
