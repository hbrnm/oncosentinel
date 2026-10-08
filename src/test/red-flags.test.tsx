import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { RedFlagsModal } from '../components/RedFlagsModal';
import { DEFAULT_PROFILE } from '../lib/supabase';

describe('Semnalele de alarmă', () => {
  it('separă ce înseamnă 112 de ce se spune repede medicului, fără decizii de investigație', () => {
    const { container } = render(<RedFlagsModal isOpen={true} onClose={vi.fn()} profile={DEFAULT_PROFILE} />);

    const urgent = screen.getByRole('heading', { name: 'Sună la 112' }).closest('section')!;
    expect(within(urgent).getByText('Respirație grea apărută brusc sau durere în piept')).toBeInTheDocument();
    expect(within(urgent).getByText('Semne de accident vascular cerebral')).toBeInTheDocument();
    expect(within(urgent).getByText('Umflare bruscă a feței, a buzelor sau a gâtului')).toBeInTheDocument();

    const soon = screen.getByRole('heading', { name: 'Anunță repede medicul' }).closest('section')!;
    expect(within(soon).getByText('Durere sau umflare la un singur picior')).toBeInTheDocument();
    expect(within(soon).getByText('Orice sângerare vaginală neobișnuită')).toBeInTheDocument();
    expect(within(soon).getByText('Schimbări ale vederii')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Apelează 112/ })).toHaveAttribute('href', 'tel:112');

    expect(container.textContent).not.toMatch(/Doppler|ecografie|retinei|bine tolerat/);
    expect(screen.getByText(/Surse: prospectul tamoxifenului/)).toBeInTheDocument();
  });
});
