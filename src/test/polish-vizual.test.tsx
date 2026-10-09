import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { App } from '../App';
import { TreatmentTab } from '../components/TreatmentTab';
import { JournalTab } from '../components/JournalTab';
import { GuideTab } from '../components/GuideTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { DoseLog } from '../types';
import { BottomNav } from '../components/BottomNav';
import confetti from 'canvas-confetti';

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

describe('Mișcarea discretă', () => {
  const readCss = async () => {
    // Vitest nu încarcă CSS-ul, deci îl citim de pe disc
    const nodeFs = 'node:fs';
    const { readFileSync } = await import(/* @vite-ignore */ nodeFs);
    return readFileSync('src/index.css', 'utf8') as string;
  };

  it('nicio animație nu păstrează starea finală pe ferestre sau pe cardurile din taburi', async () => {
    const css = (await readCss()).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const selector of ['\\.animate-modal', '\\.animate-modal > \\*', '\\.animate-cascade > :not\\(\\.animate-modal\\)', '\\.animate-pop', '\\.animate-draw-check path', '\\.animate-sway']) {
      const rule = css.match(new RegExp(`${selector}\\s*{([^}]*)}`))![1];
      expect(rule).toMatch(/animation:/);
      expect(rule).not.toMatch(/\b(forwards|both)\b/);
    }
  });

  it('se oprește când telefonul cere „Reduce mișcarea”', async () => {
    const css = await readCss();
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toMatch(/animation-duration:\s*0\.01ms !important/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms !important/);
  });

  it('ferestrele din Astăzi nu așteaptă după cascadă', async () => {
    const css = (await readCss()).replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = css.match(/\.animate-cascade[^{]*/g)!;
    expect(selectors.length).toBeGreaterThan(1);
    for (const selector of selectors) expect(selector).toContain(':not(.animate-modal)');
  });

  it('toate ferestrele urcă de jos (animate-modal pe fundal)', async () => {
    const nodeFs = 'node:fs';
    const { readdirSync, readFileSync } = await import(/* @vite-ignore */ nodeFs);
    const overlays = (readdirSync('src/components') as string[]).flatMap((file) =>
      ((readFileSync(`src/components/${file}`, 'utf8') as string).match(/className=[{"`]+fixed inset-0[^"`]*/g) ?? [])
        .filter((cls) => !cls.includes('animate-modal'))
        .map((cls) => `${file}: ${cls}`),
    );
    expect(overlays).toEqual([]);
  });

  it('cercul tabului activ alunecă în bara de jos', () => {
    const { rerender } = render(<BottomNav activeTab="today" setActiveTab={() => {}} />);
    const indicator = screen.getByTestId('nav-indicator');
    expect(indicator.style.transform).toBe('translateX(0%)');
    rerender(<BottomNav activeTab="guide" setActiveTab={() => {}} />);
    expect(indicator.style.transform).toBe('translateX(300%)');
    expect(indicator.className).toContain('transition-transform');
  });
});

describe('Astăzi: cascadă, plantă și bifarea dozei', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
    vi.mocked(confetti).mockClear();
  });

  it('cardurile apar în cascadă și planta se leagănă', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.animate-cascade')).not.toBeNull();
    expect(container.querySelector('.animate-cascade .animate-sway')).not.toBeNull();
  });

  it('la bifare, „Luat azi” crește ușor, bifa se desenează, iar confetti rămâne (oprit la „Reduce mișcarea”)', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Bifat ca luat/ }));
    const badge = screen.getByText('Luat azi').parentElement!;
    expect(badge.className).toContain('animate-pop');
    expect(badge.querySelector('svg')!.getAttribute('class')).toContain('animate-draw-check');
    expect(confetti).toHaveBeenCalledWith(expect.objectContaining({ disableForReducedMotion: true }));
  });
});
