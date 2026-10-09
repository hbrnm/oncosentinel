import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE } from '../lib/supabase';

// Ferestrele din taburi (ex. „Adaugă un medicament”) apăreau jos, sub bara de navigare:
// animația taburilor păstra la final un transform („forwards”), iar un părinte cu transform ține ferestrele „fixed” în el.
describe('Animația taburilor', () => {
  it('nu păstrează starea finală (fără „forwards” sau „both”)', async () => {
    // Vitest nu încarcă CSS-ul, deci îl citim de pe disc
    const nodeFs = 'node:fs';
    const { readFileSync } = await import(/* @vite-ignore */ nodeFs);
    const css: string = readFileSync('src/index.css', 'utf8');
    const rule = css.match(/\.animate-fade-in\s*{([^}]*)}/)![1].replace(/\/\*[\s\S]*?\*\//g, '');
    expect(rule).toMatch(/animation:\s*fadeIn/);
    expect(rule).not.toMatch(/\b(forwards|both)\b/);
  });
});

describe('Ferestrele din taburi', () => {
  it('stau deasupra barei de jos (z-50)', () => {
    render(<TreatmentTab profile={DEFAULT_PROFILE} doses={[]} onTakeDose={() => {}} />);
    fireEvent.click(screen.getByText('Adaugă un medicament'));
    expect(screen.getByRole('dialog').parentElement!.className).toContain('z-[60]');
  });
});
