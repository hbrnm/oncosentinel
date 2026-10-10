import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { WHAT_HELPED_KEY, loadWhatHelped } from '../lib/whatHelped';
import { backupService } from '../lib/backupService';

// „Ce te-a ajutat altă dată” (planul 012; deciziile proprietarei din 2026-10-10)

const journal = () =>
  render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} onOpenHelp={vi.fn()} />);

const saveMood = (label: string) => {
  fireEvent.click(screen.getByRole('button', { name: label }));
  fireEvent.click(screen.getByText('Salvează în jurnal'));
};

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('oncosentinel_onboarded', 'true');
});

describe('Ce te-a ajutat altă dată', () => {
  it('apare în Jurnal la o zi grea, cu invitația când lista e goală, și păstrează ce adaugă', () => {
    journal();
    saveMood('Greu');
    expect(screen.getByText('Ce te-a ajutat altă dată')).toBeInTheDocument();
    expect(screen.getByText(/Ce te ajută într-o zi grea\?/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Adaugă ceva'));
    fireEvent.change(screen.getByPlaceholderText('De exemplu: s-o sun pe sora mea'), { target: { value: '  O plimbare scurtă  ' } });
    fireEvent.click(screen.getByText('Salvează'));

    expect(screen.getByText('O plimbare scurtă')).toBeInTheDocument();
    expect(screen.getByText('Am păstrat. Ți-l arăt când ai o zi grea.')).toBeInTheDocument();
    expect(loadWhatHelped()).toEqual(['O plimbare scurtă']);

    fireEvent.click(screen.getByRole('button', { name: 'Șterge „O plimbare scurtă”' }));
    expect(loadWhatHelped()).toEqual([]);
  });

  it('apare și la „Obosită”, dar nu într-o zi bună', () => {
    const { unmount } = journal();
    saveMood('Obosită');
    expect(screen.getByText('Ce te-a ajutat altă dată')).toBeInTheDocument();
    unmount();

    journal();
    saveMood('Bine');
    expect(screen.queryByText('Ce te-a ajutat altă dată')).not.toBeInTheDocument();
  });

  it('în „Am nevoie de liniște acum” arată lista doar dacă are ceva în ea', () => {
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    expect(screen.queryByText('Ce te-a ajutat altă dată')).not.toBeInTheDocument();
    unmount();

    localStorage.setItem(WHAT_HELPED_KEY, JSON.stringify(['S-o sun pe Ana']));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    expect(screen.getByText('Ce te-a ajutat altă dată')).toBeInTheDocument();
    expect(screen.getByText('S-o sun pe Ana')).toBeInTheDocument();
  });

  it('copia de siguranță păstrează lista', async () => {
    localStorage.setItem(WHAT_HELPED_KEY, JSON.stringify(['Ceai și o pătură']));
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    backupService.exportCompleteBackup();
    const text = await blob!.text();
    localStorage.clear();
    await backupService.importBackupFromFile(new File([text], 'copie.json'));
    expect(loadWhatHelped()).toEqual(['Ceai și o pătură']);
  });

  it('o listă stricată nu blochează ecranul', () => {
    localStorage.setItem(WHAT_HELPED_KEY, '{nu e json');
    expect(loadWhatHelped()).toEqual([]);
    localStorage.setItem(WHAT_HELPED_KEY, JSON.stringify(['ok', 5, '  ', null]));
    expect(loadWhatHelped()).toEqual(['ok']);
  });
});
