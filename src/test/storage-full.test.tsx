import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { AuthModal } from '../components/AuthModal';
import { storageService, STORAGE_FULL_MESSAGE } from '../lib/supabase';

const originalSetItem = Storage.prototype.setItem;

// Simulează un dispozitiv fără spațiu pentru o singură cheie
const fillStorage = (fullKey: string) => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
    if (key === fullKey) throw new DOMException('Quota exceeded', 'QuotaExceededError');
    return originalSetItem.call(this, key, value);
  });
};

describe('Spațiu plin pe dispozitiv', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(window.alert).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('salvarea spune ce s-a întâmplat și ce poate face utilizatoarea', () => {
    fillStorage('navimed_docs');

    expect(storageService.saveDocuments([])).toBe(false);
    expect(window.alert).toHaveBeenCalledWith(STORAGE_FULL_MESSAGE);
  });

  it('un document care nu a încăput nu apare în listă', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    fillStorage('navimed_docs');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Dosar\s*medical/i }));
    fireEvent.click(screen.getByText('Încarcă PDF'));
    const nameInput = screen.getByPlaceholderText('ex: Mamografie_Control_Octombrie.pdf');
    const fileInput = nameInput.closest('form')!.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [new File(['%PDF'], 'Analize_octombrie.pdf', { type: 'application/pdf' })] } });
    fireEvent.submit(nameInput.closest('form')!);

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(STORAGE_FULL_MESSAGE));
    expect(screen.queryByText('Analize_octombrie.pdf')).not.toBeInTheDocument();
  });

  it('o notă de jurnal care nu a încăput nu apare în istoric', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    fillStorage('navimed_symptoms');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Jurnal/ }));
    fireEvent.change(screen.getByPlaceholderText(/Notează un gând/), { target: { value: 'Notă care nu încape' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));

    expect(window.alert).toHaveBeenCalledWith(STORAGE_FULL_MESSAGE);
    expect(screen.getByText(/Încă nu ai înregistrări/)).toBeInTheDocument();
  });
});

describe('Siguranța datelor explică stocarea', () => {
  it('spune că datele nu sunt criptate și că spațiul e limitat', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Datele nu sunt criptate/)).toBeInTheDocument();
    expect(screen.getByText(/Spațiul e limitat/)).toBeInTheDocument();
  });
});
