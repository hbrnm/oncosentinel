import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SupporterModal } from '../components/SupporterModal';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { buildSupporterMessage, SHARE_COPIED, SHARE_FAILED } from '../data/circle';

const profile = { ...DEFAULT_PROFILE, full_name: 'Ana Pop' };
const open = () => render(<SupporterModal isOpen={true} onClose={vi.fn()} profile={profile} />);
const nav = navigator as unknown as { share?: unknown; clipboard?: unknown };

describe('Cercul tău', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('navimed_supporter', JSON.stringify({ name: 'Andrei', relationship: 'Soț', phone: '', notifyOnMissedDose: true }));
  });
  afterEach(() => {
    delete nav.share;
    delete nav.clipboard;
  });

  it('compune mesajul din starea aleasă și ideile bifate', () => {
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Rău' }));
    fireEvent.click(screen.getByLabelText('Sună-mă doar ca să vorbim puțin.'));
    fireEvent.click(screen.getByLabelText('Adu-mi o masă gata făcută.'));

    expect(screen.getByRole('textbox', { name: /Mesajul tău/ })).toHaveValue(
      'Bună, Andrei! Azi e o zi mai grea pentru mine. M-ar ajuta mult dacă:\n– Sună-mă doar ca să vorbim puțin.\n– Adu-mi o masă gata făcută.\nMulțumesc că ești alături de mine. Ana'
    );
  });

  it('fără idei: salut, starea și mulțumirea', () => {
    expect(buildSupporterMessage('', 'Ana', 'Azi mă simt bine.', [])).toBe('Bună! Azi mă simt bine. Mulțumesc că ești alături de mine. Ana');
  });

  it('trimite exact textul modificat de ea, prin meniul de partajare', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    nav.share = share;
    open();
    fireEvent.change(screen.getByRole('textbox', { name: /Mesajul tău/ }), { target: { value: 'Mesajul meu.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Trimite' }));
    await waitFor(() => expect(share).toHaveBeenCalledWith({ text: 'Mesajul meu.' }));
  });

  it('fără meniu de partajare, copiază mesajul și spune asta', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    nav.clipboard = { writeText };
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Trimite' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(SHARE_COPIED));
    expect(writeText).toHaveBeenCalled();
  });

  it('dacă nici copierea nu merge, spune ce poate face', async () => {
    nav.clipboard = { writeText: vi.fn().mockRejectedValue(new Error('x')) };
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Trimite' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(SHARE_FAILED));
  });

  it('nu mai promite mementouri automate', () => {
    open();
    expect(screen.queryByText(/Reamintește-i discret/)).not.toBeInTheDocument();
    expect(screen.queryByText(/WhatsApp|SMS Direct/)).not.toBeInTheDocument();
  });

  it('nu trimite nimic fără clic pe „Trimite”; renunțarea la partajare nu arată eroare', async () => {
    const share = vi.fn().mockRejectedValue(Object.assign(new Error('x'), { name: 'AbortError' }));
    nav.share = share;
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Bine' }));
    fireEvent.change(screen.getByRole('textbox', { name: /Mesajul tău/ }), { target: { value: 'Altceva' } });
    expect(share).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Trimite' }));
    await waitFor(() => expect(share).toHaveBeenCalled());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('o eroare a partajării spune ce poate face', async () => {
    nav.share = vi.fn().mockRejectedValue(new Error('x'));
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Trimite' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(SHARE_FAILED));
  });

  it('schimbarea stării reface mesajul, peste textul editat', () => {
    open();
    const box = screen.getByRole('textbox', { name: /Mesajul tău/ });
    fireEvent.change(box, { target: { value: 'Text scris de mine' } });
    fireEvent.click(screen.getByRole('button', { name: 'Foarte bine' }));
    expect(box).toHaveValue('Bună, Andrei! Azi mă simt foarte bine. Mulțumesc că ești alături de mine. Ana');
  });

  it('date vechi sau stricate nu blochează fereastra', () => {
    localStorage.setItem('navimed_supporter', '{"relationship":"Soră"}');
    const { unmount } = open();
    expect(screen.getByRole('textbox', { name: /Mesajul tău/ })).toHaveValue('Bună! Azi mă simt bine. Mulțumesc că ești alături de mine. Ana');
    unmount();
    localStorage.setItem('navimed_supporter', 'nu e json');
    open();
    expect(screen.getByRole('dialog', { name: /Cercul de Sprijin/ })).toBeInTheDocument();
  });

  it('nu mai cere și nu mai păstrează numărul de telefon', () => {
    localStorage.setItem('navimed_supporter', JSON.stringify({ name: 'Andrei', relationship: 'Soț', phone: '0722000000', notifyOnMissedDose: true }));
    open();
    expect(screen.queryByText(/Număr de telefon/)).not.toBeInTheDocument();
    expect(localStorage.getItem('navimed_supporter')).not.toContain('0722000000');
  });
});
