import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HelpModal } from '../components/HelpModal';
import { DEFAULT_PROFILE } from '../lib/supabase';

// O linie de probă, ca să verificăm afișarea; liniile reale intră doar după confirmarea proprietarei
vi.mock('../data/helpLines', () => ({
  HELP_LINES: [{ name: 'Linie de probă', phone: '0800 000 000', description: 'Sprijin emoțional gratuit.', hours: 'Zilnic, 19–7.', verifiedOn: '2026-10-08' }]
}));

describe('Fereastra „Ajutor”, cu linii confirmate', () => {
  it('afișează linia cu număr apelabil și duce la exercițiile și persoana de sprijin', () => {
    const h = { onClose: vi.fn(), onOpenRedFlags: vi.fn(), onOpenBreathing: vi.fn(), onOpenGrounding: vi.fn(), onOpenSupporter: vi.fn() };
    render(<HelpModal isOpen={true} profile={DEFAULT_PROFILE} {...h} />);

    expect(screen.getByText('Vrei să vorbești cu cineva?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Linie de probă: 0800 000 000/ })).toHaveAttribute('href', 'tel:0800000000');

    fireEvent.click(screen.getByText(/Exercițiul 5-4-3-2-1/));
    expect(h.onOpenGrounding).toHaveBeenCalled();
    fireEvent.click(screen.getByText(/Trimite un mesaj persoanei tale de sprijin/));
    expect(h.onOpenSupporter).toHaveBeenCalled();
  });
});
