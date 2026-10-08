import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { loadAppointments, setNextControlDate } from '../lib/appointments';

// Observațiile de la testarea cu pacientele (2026-10-08)

const localDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatted = (iso: string) =>
  new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

describe('Testarea cu pacientele', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('data controlului și doza de la configurare apar pe Astăzi și rămân după redeschidere', () => {
    const controlDate = localDay(40);
    const { unmount } = render(<App />);

    fireEvent.click(screen.getByText(/Continuă spre Alerte/i));
    const dose = screen.getByLabelText(/Ce doză ți-a prescris medicul\?/i);
    expect(dose).toHaveValue('20 mg');
    fireEvent.change(dose, { target: { value: '10 mg' } });
    fireEvent.click(screen.getByText(/Spre Supraveghere/i));
    fireEvent.change(document.querySelector('input[type="date"]')!, { target: { value: controlDate } });
    fireEvent.click(screen.getByText(/Pornește OncoSentinel/i));

    expect(screen.getByText(formatted(controlDate))).toBeInTheDocument();
    expect(screen.getByText(/10 mg • 1 comprimat/i)).toBeInTheDocument();

    // La redeschidere, fereastra „Controale medicale” nu mai șterge data
    unmount();
    render(<App />);
    expect(screen.getByText(formatted(controlDate))).toBeInTheDocument();
    const list = JSON.parse(localStorage.getItem('navimed_appointments_list') || '[]');
    expect(list).toEqual([expect.objectContaining({ date: controlDate, status: 'upcoming' })]);
  });

  it('o dată de control care lipsește din listă devine programare în „Controale medicale”', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem('navimed_next_control_date', localDay(20));
    localStorage.setItem('navimed_appointments_list', '[]');
    render(<App />);
    expect(localStorage.getItem('navimed_next_control_date')).toBe(localDay(20));
    fireEvent.click(screen.getByText(formatted(localDay(20))));
    expect(screen.queryByText(/Niciun control viitor/i)).not.toBeInTheDocument();
  });

  it('schimbarea datei mută controlul viitor, nu unul trecut rămas nebifat', () => {
    localStorage.setItem('navimed_appointments_list', JSON.stringify([
      { id: 'vechi', date: localDay(-30), specialty: 'Oncologie', status: 'upcoming' },
      { id: 'viitor', date: localDay(10), specialty: 'Oncologie', status: 'upcoming' },
    ]));
    setNextControlDate(localDay(15));
    const list = loadAppointments();
    expect(list.find(a => a.id === 'vechi')!.date).toBe(localDay(-30));
    expect(list.find(a => a.id === 'viitor')!.date).toBe(localDay(15));
    expect(localStorage.getItem('navimed_next_control_date')).toBe(localDay(15));
  });

  it('o dată trecută sau a unui control finalizat nu devine control viitor', () => {
    localStorage.setItem('navimed_next_control_date', localDay(-5));
    expect(loadAppointments()).toEqual([]);
    localStorage.setItem('navimed_next_control_date', localDay(5));
    localStorage.setItem('navimed_appointments_list', JSON.stringify([
      { id: 'gata', date: localDay(5), specialty: 'Oncologie', status: 'completed' },
    ]));
    expect(loadAppointments()).toHaveLength(1);
  });

  it('cardul pastilei arată numele întreg și „Luat azi” cu o singură bifă', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    fireEvent.click(screen.getByText(/Bifat ca luat/i));
    expect(screen.getByRole('heading', { name: 'Tamoxifen' })).toBeInTheDocument();
    const badge = screen.getByText(/^Luat azi$/).parentElement!;
    expect(badge.textContent).toBe('Luat azi');
  });

  it('starea de azi are etichete calde și titlul „Cum te simți azi?”', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    expect(screen.getByText('Cum te simți azi?')).toBeInTheDocument();
    for (const label of ['Greu', 'Obosită', 'Liniștită', 'Bine', 'Foarte bine']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText('Dificil')).not.toBeInTheDocument();
  });

  it('în Jurnal, „Săptămâna ta” e prima, iar documentele vin după formularul de simptome', () => {
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={() => {}} />);
    const text = document.body.textContent || '';
    const week = text.indexOf('Săptămâna ta');
    const mood = text.indexOf('Cum te simți azi?');
    const form = text.indexOf('Formular Detaliat Simptome');
    const docs = text.indexOf('Documente Medicale');
    expect(week).toBeGreaterThan(-1);
    expect(week).toBeLessThan(mood);
    expect(mood).toBeLessThan(form);
    expect(form).toBeLessThan(docs);
  });

  it('câmpul de întrebare pentru medic se poate micșora, ca „Adaugă” să rămână pe ecran', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    fireEvent.click(screen.getByText(/Nicio dată setată/i));
    const input = screen.getByPlaceholderText(/Scrie o întrebare pentru consultație/i);
    expect(input.className).toContain('min-w-0');
    expect(within(input.closest('form')!).getByText('Adaugă')).toBeInTheDocument();
  });

  it('conținutul are loc deasupra barei de jos și a butonului cu inimă', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    expect(document.querySelector('main')!.className).toContain('pb-44');
    expect(screen.getByLabelText('Am nevoie de liniște acum').className).toContain('bottom-[7.5rem]');
  });
});
