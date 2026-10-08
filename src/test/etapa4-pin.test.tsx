import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthModal } from '../components/AuthModal';
import { VaultGate } from '../components/VaultGate';
import { vault } from '../lib/vault';

const typePin = (label: RegExp | string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('Protejează cu PIN', () => {
  beforeEach(() => {
    vault.eraseAll();
    localStorage.setItem('navimed_profile', '{"full_name":"Ana"}');
    vi.mocked(window.confirm).mockReturnValue(true);
  });
  afterEach(() => vault.eraseAll());

  it('cere aceleași 4 cifre de două ori, apoi activează PIN-ul', async () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/criptate cu un PIN de 4 cifre/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Alege PIN-ul'));
    typePin(/PIN nou/, '1234');
    typePin(/Scrie-l încă o dată/, '1235');
    fireEvent.click(screen.getByText('Activează PIN-ul'));
    expect(screen.getByRole('alert')).toHaveTextContent('PIN-urile nu se potrivesc. Scrie-l din nou.');

    typePin(/Scrie-l încă o dată/, '1234');
    fireEvent.click(screen.getByText('Activează PIN-ul'));
    await waitFor(() => expect(screen.getByText(/PIN-ul e activ/)).toBeInTheDocument());
    expect(vault.isEnabled()).toBe(true);
    expect(screen.getByText(/Datele sunt criptate cu PIN-ul tău/)).toBeInTheDocument();
    expect(screen.queryByText(/Datele nu sunt criptate/)).not.toBeInTheDocument();
  });

  it('poarta cere PIN-ul; un PIN greșit nu deschide, cel corect deschide aplicația', async () => {
    await vault.enable('1234');
    await vault.lock();
    render(<VaultGate><p>Aplicația</p></VaultGate>);

    expect(screen.queryByText('Aplicația')).not.toBeInTheDocument();
    typePin('PIN', '0000');
    fireEvent.click(screen.getByText('Deblochează'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('PIN greșit. Mai încearcă.'));

    typePin('PIN', '1234');
    fireEvent.click(screen.getByText('Deblochează'));
    await waitFor(() => expect(screen.getByText('Aplicația')).toBeInTheDocument());
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
  });

  it('„Am uitat PIN-ul” explică și, după confirmare, șterge tot și pornește din nou', async () => {
    await vault.enable('1234');
    await vault.lock();
    render(<VaultGate><p>Aplicația</p></VaultGate>);

    fireEvent.click(screen.getByText('Am uitat PIN-ul'));
    expect(screen.getByText(/Fără PIN, datele criptate nu se pot deschide/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Șterge datele și începe din nou'));

    expect(screen.getByText('Aplicația')).toBeInTheDocument();
    expect(vault.isEnabled()).toBe(false);
    expect(localStorage.getItem('navimed_profile')).toBeNull();
  });

  it('se blochează din nou după mai mult de 5 minute în fundal', async () => {
    await vault.enable('1234');
    render(<VaultGate><p>Aplicația</p></VaultGate>);
    expect(screen.getByText('Aplicația')).toBeInTheDocument();

    const now = Date.now();
    const spy = vi.spyOn(Date, 'now').mockReturnValue(now);
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    spy.mockReturnValue(now + 6 * 60 * 1000);
    visibility.mockReturnValue('visible');
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });

    await waitFor(() => expect(screen.getByText('Bine ai revenit. Introdu PIN-ul.')).toBeInTheDocument());
    spy.mockRestore();
    visibility.mockRestore();
  });

  it('scoaterea PIN-ului aduce datele înapoi necriptate', async () => {
    await vault.enable('1234');
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Scoate PIN-ul'));
    await waitFor(() => expect(vault.isEnabled()).toBe(false));
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
  });

  it('ștergerea datelor din altă filă repornește aplicația fără seiful vechi', async () => {
    await vault.enable('1234');
    render(<VaultGate><p>Aplicația</p></VaultGate>);
    window.localStorage.removeItem('oncosentinel_vault');
    await act(async () => {
      window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }));
      await vault.flush();
    });

    await waitFor(() => expect(vault.isEnabled()).toBe(false));
    expect(screen.getByText('Aplicația')).toBeInTheDocument();
  });
});
