import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { clickable } from '../lib/clickable';
import { TimelineTab } from '../components/TimelineTab';
import { DEFAULT_PROFILE } from '../lib/supabase';

// Verificarea de accesibilitate (2026-10-09): contrast, carduri apăsabile de la tastatură, ordinea titlurilor

const readComponents = async () => {
  // Vitest nu încarcă fișierele ca text, deci le citim de pe disc
  const nodeFs = 'node:fs';
  const { readdirSync, readFileSync } = await import(/* @vite-ignore */ nodeFs);
  return (readdirSync('src/components') as string[]).map((file) => ({
    file,
    text: readFileSync(`src/components/${file}`, 'utf8') as string,
  }));
};

describe('Contrastul textului', () => {
  it('textul nu mai folosește ink-soft decolorat (3,1:1) sau roz pal pe roz (2,1:1)', async () => {
    const files = await readComponents();
    const faded = files.flatMap(({ file, text }) =>
      (text.match(/[\w:-]*text-ink-soft\/[78]0\b/g) ?? [])
        .filter((cls) => !cls.startsWith('placeholder:'))
        .map((cls) => `${file}: ${cls}`),
    );
    expect(faded).toEqual([]);
    // blush-deep rămâne doar pe iconițe decorative
    const blushText = files.filter(({ text }) => /<(p|span|h\d)\b[^>]*text-blush-deep/.test(text));
    expect(blushText.map((f) => f.file)).toEqual([]);
  });
});

describe('„Text mare”', () => {
  it('textul nu are mărimi fixe în px, ca să crească odată cu A+', async () => {
    const files = await readComponents();
    const fixed = files.flatMap(({ file, text }) => (text.match(/text-\[[\d.]+px\]/g) ?? []).map((cls) => `${file}: ${cls}`));
    expect(fixed).toEqual([]);
  });

  it('cu A+ textul crește o singură dată (118% pe html), fără o mărire în plus pe container', async () => {
    const nodeFs = 'node:fs';
    const { readFileSync } = await import(/* @vite-ignore */ nodeFs);
    expect(readFileSync('src/App.tsx', 'utf8') as string).not.toMatch(/text-\[\d+%\]/);
  });
});

describe('Cardurile apăsabile', () => {
  it('clickable() pornește cu Enter și Spațiu, dar lasă tastele butoanelor dinăuntru', () => {
    const onActivate = vi.fn();
    render(<div {...clickable(onActivate)}>Card <button type="button">Interior</button></div>);
    const card = screen.getByRole('button', { name: /Card/ });
    expect(card.tabIndex).toBe(0);
    fireEvent.keyDown(card, { key: 'Enter' });
    fireEvent.keyDown(card, { key: ' ' });
    fireEvent.keyDown(card, { key: 'a' });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Interior' }), { key: 'Enter' });
    expect(onActivate).toHaveBeenCalledTimes(2);
  });

  it('nu mai există div-uri cu onClick fără clickable() (în afara fundalurilor de fereastră)', async () => {
    const found = (await readComponents()).flatMap(({ file, text }) =>
      [...text.matchAll(/<div\s+onClick=\{([^}]*)\}/g)]
        .filter((m) => !/setShow\w*\(false\)|stopPropagation/.test(m[1]))
        .map((m) => `${file}: ${m[1]}`),
    );
    expect(found).toEqual([]);
  });
});

describe('Pe Astăzi și în Jurnal', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });

  it('cardul „Următorul control” se deschide și cu Enter', () => {
    render(<App />);
    const card = screen.getByTitle('Apasă pentru a vedea sau pregăti întrebările de control');
    expect(card.getAttribute('role')).toBe('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByRole('heading', { name: 'Pentru medic' })).toBeInTheDocument();
  });

  it('„Formular detaliat simptome” e un buton cu nume, care spune dacă e deschis', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
    const toggle = screen.getByRole('button', { name: /Formular detaliat simptome/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Salvează simptomele')).toBeInTheDocument();
  });

  it('titlurile de pe Astăzi nu sar niciun nivel', () => {
    const { container } = render(<App />);
    const levels = [...container.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6')]
      .map((h) => Number(h.tagName[1]));
    levels.reduce((prev, level) => {
      expect(level - prev).toBeLessThanOrEqual(1);
      return level;
    }, 1);
  });
});

describe('Cronologia', () => {
  it('titlul etapei e un buton care o deschide; „Modifică” și „Șterge” rămân butoane separate', () => {
    const milestone = { id: 'm1', category: 'terapie_adjuvanta' as const, event_date: '2026-01-10', title: 'Început Tamoxifen', description: '', key_details: {} };
    render(<TimelineTab profile={DEFAULT_PROFILE} milestones={[milestone]} documents={[]} onAddDocument={() => {}} />);
    const toggle = screen.getByRole('button', { name: 'Început Tamoxifen' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('button', { name: /Modifică/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Șterge/ })).toBeInTheDocument();
  });
});
