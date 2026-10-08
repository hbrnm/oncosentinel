import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { storageService } from '../lib/supabase';
import { doctorSummary, nextVictory, weekSummary } from '../lib/summary';
import { SymptomLog } from '../types';

// Nota din jurnal și simptomele se salvează separat; butoanele arată „Salvat” (2026-10-08)

const openJournal = () => {
  localStorage.setItem('oncosentinel_onboarded', 'true');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
};

describe('Jurnal: notă și simptome separate', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });
  afterEach(() => vi.useRealTimers());

  it('nota rapidă nu ia simptomele salvate înainte', () => {
    storageService.saveSymptomLogs([{
      id: 'ieri', logged_at: new Date(Date.now() - 86400000).toISOString(),
      kind: 'symptoms', fatigue_level: 5, hot_flashes_count: 4
    }]);
    openJournal();
    fireEvent.change(screen.getByPlaceholderText(/Notează un gând/i), { target: { value: 'O zi liniștită' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));

    const saved = storageService.getSymptomLogs().find(l => l.notes === 'O zi liniștită')!;
    expect(saved.kind).toBe('note');
    expect(saved.fatigue_level).toBeUndefined();
    expect(saved.hot_flashes_count).toBeUndefined();
  });

  it('simptomele se salvează separat de notă, fiecare o dată pe zi', () => {
    openJournal();
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    act(() => { vi.advanceTimersByTime(2000); });

    fireEvent.click(screen.getByText('Formular Detaliat Simptome'));
    fireEvent.click(screen.getByText('Salvează simptomele'));
    act(() => { vi.advanceTimersByTime(2000); });
    fireEvent.click(screen.getByText('Salvează simptomele'));

    const logs = storageService.getSymptomLogs();
    expect(logs.filter(l => l.kind === 'note')).toHaveLength(1);
    expect(logs.filter(l => l.kind === 'symptoms')).toHaveLength(1);
    expect(logs.find(l => l.kind === 'symptoms')!.notes).toBeUndefined();
    // în Istoric apar separat
    expect(screen.getByText('Simptome')).toBeInTheDocument();
  });

  it('butoanele arată bifa și „Salvat” două secunde', () => {
    openJournal();
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(screen.getByText('Salvat')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.queryByText('Salvat')).not.toBeInTheDocument();
    expect(screen.getByText('Actualizează nota de azi')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Formular Detaliat Simptome'));
    fireEvent.click(screen.getByText('Salvează simptomele'));
    expect(screen.getByText('Salvat')).toBeInTheDocument();
  });

  it('salvarea notei nu resetează simptomele schimbate și nesalvate', () => {
    openJournal();
    fireEvent.click(screen.getByText('Formular Detaliat Simptome'));
    const fatigue = document.querySelector('input[type="range"][min="1"][max="5"]') as HTMLInputElement;
    fireEvent.change(fatigue, { target: { value: '4' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(fatigue.value).toBe('4');
  });
});

describe('Rezumatele cu note și simptome separate', () => {
  const now = new Date().toISOString();
  const logs: SymptomLog[] = [
    { id: 'n', logged_at: now, kind: 'note', mood_state: 'Bine' },
    { id: 's', logged_at: now, kind: 'symptoms', hot_flashes_count: 2, fatigue_level: 1 },
  ];

  it('„Pentru medic” și victoriile numără doar notele, iar simptomele o dată', () => {
    const summary = doctorSummary(logs, [], '');
    expect(summary.notes).toBe(1);
    expect(summary.top).toEqual(['Bufeuri: într-o notă']);
    expect(nextVictory([], logs, [])?.text).toBe('Prima ta notă în jurnal. Mulțumesc că ai început.');
    expect(nextVictory([], [logs[1]], [])).toBeNull();
  });

  it('bufeurile nu se compară cu o săptămână care are doar note', () => {
    const lastWeek = new Date(Date.now() - 8 * 86400000).toISOString();
    const lines = weekSummary([...logs, { id: 'v', logged_at: lastWeek, kind: 'note', mood_state: 'Bine' }]);
    expect(lines.join(' ')).not.toMatch(/bufeuri/);
  });
});
