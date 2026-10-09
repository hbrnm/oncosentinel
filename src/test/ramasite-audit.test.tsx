import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QuickActions } from '../components/QuickActions';
import { getMood } from '../components/MoodPicker';
import { CLINICAL_GUIDES } from '../data/guides';

// Vitest rulează în Node, dar tipurile Node nu sunt în proiect; importul CSS ar întoarce un text gol
type NodeFs = { readFileSync(path: string, encoding: 'utf8'): string };
const { process } = globalThis as unknown as { process: { cwd(): string; getBuiltinModule(name: 'node:fs'): NodeFs } };
const css = process.getBuiltinModule('node:fs').readFileSync(`${process.cwd()}/src/index.css`, 'utf8');

// Rămășițele din auditul din 2026-10-08 (planul 004, etapa 1)
describe('Rămășițele din audit', () => {
  it('cu A+, butoanele își păstrează mărimea proprie (nu preiau textul din jur)', () => {
    expect(css).toMatch(/html\.font-large\s*\{\s*font-size:\s*118%;/);
    expect(css).not.toMatch(/html\.font-large\s+(button|input|select|textarea)/);
  });

  it('niciun ghid nu încarcă imagini de pe alte site-uri', () => {
    for (const g of CLINICAL_GUIDES) {
      expect(g.image_url ?? '').not.toMatch(/^https?:/);
    }
  });

  it('butonul de pe Astăzi se numește „Controale medicale”, nu „Medici și centre”', () => {
    render(<QuickActions onOpenDoctorModal={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Controale\s*medicale/i })).toBeInTheDocument();
    expect(screen.queryByText(/Medici și/i)).not.toBeInTheDocument();
  });

  it('la „Liniștită” mesajul nu mai vorbește despre zile neutre', () => {
    expect(getMood(3).feedback).toBe('Mă bucur că azi e o zi liniștită. Liniștea e și ea un fel de putere — păstrează-o cât poți.');
  });
});
