import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE, storageService } from '../lib/supabase';

// A doua rundă de observații de la testarea cu pacientele (2026-10-08)

const localDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const openJournal = () => {
  localStorage.setItem('oncosentinel_onboarded', 'true');
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
};

describe('Testarea cu pacientele, runda 2', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('a doua salvare din aceeași zi actualizează nota, fără duplicate', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    openJournal();
    const note = screen.getByPlaceholderText(/Notează un gând/i);
    fireEvent.change(note, { target: { value: 'Sunt bine' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(screen.getByText('Am salvat nota de azi.')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(2000); });

    fireEvent.change(note, { target: { value: 'Sunt foarte bine' } });
    fireEvent.click(screen.getByText('Actualizează nota de azi'));

    const logs = storageService.getSymptomLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].notes).toBe('Sunt foarte bine');
  });

  it('o notă ștearsă din Istoric se poate readuce cu „Anulează”, apoi ștergerea rămâne', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    openJournal();
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(storageService.getSymptomLogs()).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Șterge nota' }));
    expect(storageService.getSymptomLogs()).toHaveLength(0);
    const toast = screen.getByText('Nota a fost ștearsă.').parentElement!;
    fireEvent.click(within(toast).getByText('Anulează'));
    expect(storageService.getSymptomLogs()).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Șterge nota' }));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByText('Nota a fost ștearsă.')).not.toBeInTheDocument();
    expect(storageService.getSymptomLogs()).toHaveLength(0);
  });

  it('după o salvare nouă, „Anulează” dispare, ca să rămână o notă pe zi', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    openJournal();
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    act(() => { vi.advanceTimersByTime(2000); });
    fireEvent.click(screen.getByRole('button', { name: 'Șterge nota' }));
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(screen.queryByText('Nota a fost ștearsă.')).not.toBeInTheDocument();
    expect(storageService.getSymptomLogs()).toHaveLength(1);
  });

  it('se poate șterge și o notă din altă zi', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    storageService.saveSymptomLogs([{ id: 'ieri', logged_at: yesterday.toISOString(), mood_state: 'Bine', notes: 'Ieri' } as any]);
    openJournal();
    fireEvent.click(screen.getByRole('button', { name: 'Șterge nota' }));
    expect(storageService.getSymptomLogs()).toHaveLength(0);
    expect(screen.getByText('Salvează în jurnal')).toBeInTheDocument();
  });

  it('calendarul din Tratament marchează controlul și arată „Programările următoare”', () => {
    localStorage.setItem('navimed_appointments_list', JSON.stringify([
      { id: 'a1', date: localDay(0), specialty: 'Oncologie', doctor: 'Dr. Pop', status: 'upcoming' },
      { id: 'a2', date: localDay(-3), specialty: 'Ginecologie', status: 'upcoming' },
      { id: 'a3', date: localDay(1), specialty: 'Imagistică', status: 'cancelled' },
    ]));
    render(<TreatmentTab profile={DEFAULT_PROFILE} doses={[]} onTakeDose={() => {}} />);
    const list = screen.getByRole('heading', { name: 'Programările următoare' }).closest('section')!;
    expect(within(list).getByText('Oncologie • Dr. Pop')).toBeInTheDocument();
    expect(within(list).queryByText(/Ginecologie|Imagistică/)).not.toBeInTheDocument();
    // în calendar: legenda + ziua de azi marcată
    expect(screen.getAllByText('Control la medic')).toHaveLength(2);
  });

  it('fără controale viitoare, lista nu apare', () => {
    render(<TreatmentTab profile={DEFAULT_PROFILE} doses={[]} onTakeDose={() => {}} />);
    expect(screen.queryByText('Programările următoare')).not.toBeInTheDocument();
  });

  it('cardul verde de jos de pe Astăzi are doar inima, fără plantă', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    const banner = screen.getByText(/Nu ești doar un pacient/).closest('.sage-card')!;
    expect(banner.querySelector('svg[viewBox="0 0 80 80"]')).toBeNull();
  });
});
