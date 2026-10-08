import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HelpModal } from '../components/HelpModal';
import { RedFlagsModal } from '../components/RedFlagsModal';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';

// Decizia proprietarei (2026-10-08): butoanele de urgență în petal închis, din paleta aplicației
const expectPalette = (el: HTMLElement) => {
  expect(el.className).toMatch(/bg-petal-700/);
  expect(el.className).not.toMatch(/rose/);
};

describe('Culoarea butoanelor 112', () => {
  it('„Ajutor” și „Semnale de alarmă”', () => {
    const { unmount } = render(<HelpModal isOpen={true} profile={DEFAULT_PROFILE} onClose={vi.fn()} onOpenRedFlags={vi.fn()} onOpenBreathing={vi.fn()} onOpenGrounding={vi.fn()} onOpenSupporter={vi.fn()} />);
    expectPalette(screen.getByRole('link', { name: /112/ }));
    unmount();
    render(<RedFlagsModal isOpen={true} onClose={vi.fn()} profile={DEFAULT_PROFILE} />);
    expectPalette(screen.getByRole('link', { name: /112/ }));
  });

  it('mesajul de criză din Jurnal', () => {
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/Notează un gând/), { target: { value: 'Vreau să mor' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expectPalette(screen.getByRole('link', { name: /112/ }));
  });
});
