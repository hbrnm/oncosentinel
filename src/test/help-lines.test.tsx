import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HelpModal } from '../components/HelpModal';
import { DEFAULT_PROFILE } from '../lib/supabase';

// Decizia proprietarei (2026-10-08): liniile de sprijin nu intră în aplicație
describe('Fereastra „Ajutor”', () => {
  it('nu afișează linii de sprijin și duce la exercițiile și persoana de sprijin', () => {
    const h = { onClose: vi.fn(), onOpenRedFlags: vi.fn(), onOpenBreathing: vi.fn(), onOpenGrounding: vi.fn(), onOpenSupporter: vi.fn() };
    render(<HelpModal isOpen={true} profile={DEFAULT_PROFILE} {...h} />);

    expect(screen.queryByText('Vrei să vorbești cu cineva?')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /112/ })).toHaveAttribute('href', 'tel:112');

    fireEvent.click(screen.getByText(/Exercițiul 5-4-3-2-1/));
    expect(h.onOpenGrounding).toHaveBeenCalled();
    fireEvent.click(screen.getByText(/Trimite un mesaj persoanei tale de sprijin/));
    expect(h.onOpenSupporter).toHaveBeenCalled();
  });
});
