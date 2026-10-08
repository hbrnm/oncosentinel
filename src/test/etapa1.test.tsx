import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { JOURNAL_RESPONSES, pickJournalResponse } from '../data/comfort';

const localDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('Am nevoie de liniște acum', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });

  it('mesaj cald → respirație → „Te simți puțin mai liniștită?” → „Da, puțin”', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    expect(screen.getByText('Ești aici. E în regulă.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Respiră cu mine'));
    expect(screen.queryByText('Ești aici. E în regulă.')).not.toBeInTheDocument();
    expect(screen.getByText('Respirație lentă')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Închide' })[0]);
    expect(screen.getByText('Te simți puțin mai liniștită?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Da, puțin'));
    expect(screen.getByText('Poți reveni aici oricând.')).toBeInTheDocument();
  });

  it('„Nu încă” deschide „Ajutor” cu „E în regulă să ceri ajutor.”', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    fireEvent.click(screen.getByText('Respiră cu mine'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Închide' })[0]);

    fireEvent.click(screen.getByText('Nu încă'));

    const help = screen.getByRole('dialog', { name: 'Ajutor' });
    expect(within(help).getByText('E în regulă să ceri ajutor.')).toBeInTheDocument();
  });
});

describe('Am nevoie de liniște acum: alte drumuri', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });

  it('„Am nevoie de ajutor acum” deschide „Ajutor” fără notă; redeschiderea pornește de la început', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    fireEvent.click(screen.getByText('Am nevoie de ajutor acum'));
    expect(screen.getByRole('dialog', { name: 'Ajutor' })).toBeInTheDocument();
    expect(screen.queryByText('E în regulă să ceri ajutor.')).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Ajutor' })).getByRole('button', { name: 'Închide' }));

    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    fireEvent.click(screen.getByText('Respiră cu mine'));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'Respirație lentă' })).getByRole('button', { name: 'Închide' }));
    fireEvent.click(screen.getByText('Da, puțin'));
    fireEvent.click(within(screen.getByRole('dialog')).getAllByRole('button', { name: 'Închide' })[0]);

    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    expect(screen.getByText('Ești aici. E în regulă.')).toBeInTheDocument();
  });
});

describe('Jurnalul care răspunde', () => {
  it('mesajul dispare când schimbi starea după salvare', () => {
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} onOpenHelp={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Foarte rău' }));
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(screen.getByRole('status')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Bine' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('după salvare arată un mesaj aprobat pentru starea aleasă; la „Foarte rău”, și ajutorul', () => {
    const onOpenHelp = vi.fn();
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} onOpenHelp={onOpenHelp} />);

    fireEvent.click(screen.getByRole('button', { name: 'Foarte rău' }));
    fireEvent.click(screen.getByText('Salvează în jurnal'));

    const status = screen.getByRole('status');
    expect(JOURNAL_RESPONSES[1]).toContain(status.querySelector('p')!.textContent);
    fireEvent.click(within(status).getByText('Am nevoie de ajutor'));
    expect(onOpenHelp).toHaveBeenCalled();
  });

  it('mesajul se schimbă de la o zi la alta și rămâne în lista stării', () => {
    const a = pickJournalResponse(4, new Date(2026, 9, 1));
    const b = pickJournalResponse(4, new Date(2026, 9, 2));
    expect(a).not.toBe(b);
    expect(JOURNAL_RESPONSES[4]).toContain(a);
  });
});

describe('Sprijin înaintea controlului', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });
  afterEach(() => localStorage.clear());

  it('apare cu 2 zile înainte', () => {
    localStorage.setItem('navimed_next_control_date', localDay(2));
    render(<App />);
    expect(screen.getByText('Controlul se apropie: peste 2 zile')).toBeInTheDocument();
    expect(screen.getByText('Întrebările pentru medic')).toBeInTheDocument();
  });

  it('cu o zi înainte spune „mâine”', () => {
    localStorage.setItem('navimed_next_control_date', localDay(1));
    render(<App />);
    expect(screen.getByText('Controlul se apropie: mâine')).toBeInTheDocument();
  });

  it('în ziua controlului spune „Multă putere azi”', () => {
    localStorage.setItem('navimed_next_control_date', localDay(0));
    render(<App />);
    expect(screen.getByText('Multă putere azi')).toBeInTheDocument();
  });

  it('nu apare cu mai mult de 3 zile înainte', () => {
    localStorage.setItem('navimed_next_control_date', localDay(5));
    render(<App />);
    expect(screen.queryByLabelText('Sprijin înaintea controlului')).not.toBeInTheDocument();
  });
});
