import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { App } from '../App';
import { TreatmentTab } from '../components/TreatmentTab';
import { JournalTab } from '../components/JournalTab';
import { GuideTab } from '../components/GuideTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { DoseLog } from '../types';

describe('Calendarul dozelor: zilele nebifate', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 10, 12));
  });
  afterEach(() => vi.useRealTimers());

  it('apar în piersică, cu cifra zilei și „Nebifat” în legendă, nu cu roșu și X', () => {
    const iso = new Date(2026, 9, 8, 12).toISOString();
    const dose: DoseLog = { id: 'd8', medication_name: 'Tamoxifen 20 mg', scheduled_for: iso, taken_at: iso, status: 'taken' };
    render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, tamoxifen_start_date: '' }} doses={[dose]} onTakeDose={() => {}} />);
    const missed = screen.getByTitle(/Doză nebifată/);
    expect(missed.textContent).toBe('9, nebifat');
    expect(missed.className).toContain('bg-peach-100');
    expect(missed.className).not.toMatch(/bg-red-/);
    expect(screen.getByText('Nebifat')).toBeInTheDocument();
    expect(screen.queryByText(/Sărit/)).not.toBeInTheDocument();
  });
});

describe('Titlurile din Jurnal și Ghiduri', () => {
  it('folosesc Lora (font-serif), ca restul titlurilor', () => {
    const { unmount } = render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Săptămâna ta' }).className).toContain('font-serif');
    expect(screen.getByRole('heading', { name: 'Istoric' }).className).toContain('font-serif');
    unmount();
    render(<GuideTab onOpenRedFlags={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Ghiduri' }).className).toContain('font-serif');
  });
});

describe('Butonul „Am nevoie de liniște acum”', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });

  const scrollTo = (y: number) => act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });

  it('se ascunde cât derulezi în jos și revine când urci', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Am nevoie de liniște acum' });
    expect(button.dataset.hidden).toBe('false');
    scrollTo(300);
    expect(button.dataset.hidden).toBe('true');
    scrollTo(200);
    expect(button.dataset.hidden).toBe('false');
  });

  it('reapare când primește focus de la tastatură', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: 'Am nevoie de liniște acum' });
    scrollTo(300);
    fireEvent.focus(button);
    expect(button.dataset.hidden).toBe('false');
  });
});

describe('Griurile reci', () => {
  it('nu mai apar în componente (în afară de dark:), locul lor l-au luat ink, ink-soft, warmborder, cream', async () => {
    // Vitest nu încarcă fișierele ca text, deci le citim de pe disc
    const nodeFs = 'node:fs';
    const { readdirSync, readFileSync } = await import(/* @vite-ignore */ nodeFs);
    const found = (readdirSync('src/components') as string[]).flatMap((file) =>
      ((readFileSync(`src/components/${file}`, 'utf8') as string).match(/[\w:-]*(?:gray|stone|slate|zinc|neutral)-\d+/g) ?? [])
        .filter((cls) => !cls.startsWith('dark:'))
        .map((cls) => `${file}: ${cls}`),
    );
    expect(found).toEqual([]);
  });
});
