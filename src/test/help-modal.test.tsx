import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { HelpModal } from '../components/HelpModal';
import { DEFAULT_PROFILE } from '../lib/supabase';

const renderHelp = (profile = DEFAULT_PROFILE) => {
  const handlers = { onClose: vi.fn(), onOpenRedFlags: vi.fn(), onOpenBreathing: vi.fn(), onOpenGrounding: vi.fn(), onOpenSupporter: vi.fn() };
  render(<HelpModal isOpen={true} profile={profile} {...handlers} />);
  return handlers;
};

describe('Fereastra „Ajutor”', () => {
  beforeEach(() => localStorage.clear());

  it('pune 112 primul și nu afișează linii de sprijin neconfirmate', () => {
    renderHelp();

    expect(screen.getByRole('link', { name: /Sună la 112/ })).toHaveAttribute('href', 'tel:112');
    expect(screen.queryByText('Vrei să vorbești cu cineva?')).not.toBeInTheDocument();
  });

  it('fără e-mailul medicului spune unde se completează', () => {
    renderHelp();
    expect(screen.getByText(/Adaugă în Profil adresa de e-mail/)).toBeInTheDocument();
  });

  it('cu e-mailul medicului, oferă un link de scris', () => {
    renderHelp({ ...DEFAULT_PROFILE, oncologist_email: 'dr@spital.ro' });
    expect(screen.getByRole('link', { name: /Scrie-i medicului oncolog/ })).toHaveAttribute('href', 'mailto:dr@spital.ro');
  });

  it('închide „Ajutor” și deschide exercițiul ales', () => {
    const h = renderHelp();

    fireEvent.click(screen.getByText('Respirație lentă'));

    expect(h.onClose).toHaveBeenCalled();
    expect(h.onOpenBreathing).toHaveBeenCalled();
  });

  it('se deschide din acțiunile rapide de pe Astăzi și din fereastra SOS', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Ajutor\s*acum/ }));
    const dialog = screen.getByRole('dialog', { name: 'Ajutor' });
    fireEvent.click(within(dialog).getByText('Vezi semnalele de alarmă'));
    expect(screen.queryByRole('dialog', { name: 'Ajutor' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Alte forme de ajutor și sprijin'));
    expect(screen.getByRole('dialog', { name: 'Ajutor' })).toBeInTheDocument();
  });
});
