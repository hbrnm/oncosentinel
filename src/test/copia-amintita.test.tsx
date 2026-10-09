import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { AuthModal } from '../components/AuthModal';
import { backupService } from '../lib/backupService';
import {
  shouldRemindBackup, lastBackupText, snoozeBackupReminder, markBackupDone, LAST_BACKUP_KEY,
} from '../lib/backupReminder';
import { DoseLog } from '../types';

// Copia amintită (planul 004, etapa 2; deciziile proprietarei din 2026-10-09)

const NOW = new Date(2026, 9, 9, 12, 0);
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 24 * 60 * 60 * 1000);
const doseAt = (d: Date): DoseLog => ({
  id: `d-${d.getTime()}`, medication_name: 'Tamoxifen', scheduled_for: d.toISOString(), taken_at: d.toISOString(), status: 'taken',
});

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe('Când apare memento-ul', () => {
  it('fără date nu apare', () => {
    expect(shouldRemindBackup([], [], NOW)).toBe(false);
  });

  it('fără nicio copie, apare când prima doză are peste 7 zile', () => {
    expect(shouldRemindBackup([doseAt(daysAgo(3))], [], NOW)).toBe(false);
    expect(shouldRemindBackup([doseAt(daysAgo(8))], [], NOW)).toBe(true);
  });

  it('fără nicio copie, contează și prima notă din Jurnal', () => {
    expect(shouldRemindBackup([], [{ id: 'n', logged_at: daysAgo(9).toISOString(), kind: 'note' }], NOW)).toBe(true);
  });

  it('cu o copie, apare doar după 30 de zile', () => {
    const doses = [doseAt(daysAgo(100))];
    markBackupDone(daysAgo(10));
    expect(shouldRemindBackup(doses, [], NOW)).toBe(false);
    markBackupDone(daysAgo(31));
    expect(shouldRemindBackup(doses, [], NOW)).toBe(true);
  });

  it('„Mai târziu” îl ascunde 7 zile', () => {
    const doses = [doseAt(daysAgo(100))];
    snoozeBackupReminder(NOW);
    expect(shouldRemindBackup(doses, [], daysAgo(-6))).toBe(false);
    expect(shouldRemindBackup(doses, [], daysAgo(-8))).toBe(true);
  });
});

describe('Data ultimei copii', () => {
  it('se scrie în cuvinte', () => {
    expect(lastBackupText(NOW)).toBe('Nu ai făcut încă nicio copie.');
    markBackupDone(NOW);
    expect(lastBackupText(NOW)).toBe('Ultima copie: azi.');
    markBackupDone(daysAgo(1));
    expect(lastBackupText(NOW)).toBe('Ultima copie: ieri.');
    markBackupDone(daysAgo(5));
    expect(lastBackupText(NOW)).toBe('Ultima copie: acum 5 zile.');
    markBackupDone(daysAgo(42));
    expect(lastBackupText(NOW)).toBe('Ultima copie: acum 42 de zile.');
  });

  it('descărcarea unei copii ține minte data', () => {
    URL.createObjectURL = vi.fn(() => 'blob:x');
    URL.revokeObjectURL = vi.fn();
    backupService.exportCompleteBackup();
    expect(lastBackupText()).toBe('Ultima copie: azi.');
  });

  it('restaurarea ține minte data copiei din care au venit datele', async () => {
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    const file = new File([JSON.stringify({ app: 'OncoSentinel', exported_at: daysAgo(12).toISOString(), profile: '{}' })], 'copie.json');
    await backupService.importBackupFromFile(file);
    expect(localStorage.getItem(LAST_BACKUP_KEY)).toBe(daysAgo(12).toISOString());
  });
});

describe('Pe ecran', () => {
  const openApp = () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem('navimed_doses', JSON.stringify([doseAt(new Date(Date.now() - 9 * 24 * 60 * 60 * 1000))]));
    render(<App />);
  };

  it('Astăzi arată cardul; „Fac copia acum” deschide „Siguranța datelor”', () => {
    openApp();
    const card = screen.getByRole('region', { name: 'O copie pentru liniștea ta' });
    expect(within(card).getByText(/Datele tale stau doar pe acest telefon\. Nu ai făcut încă nicio copie\./)).toBeInTheDocument();
    fireEvent.click(within(card).getByRole('button', { name: 'Fac copia acum' }));
    expect(screen.getByRole('heading', { name: 'Siguranța datelor' })).toBeInTheDocument();
  });

  it('„Mai târziu” ascunde cardul', () => {
    openApp();
    fireEvent.click(screen.getByRole('button', { name: 'Mai târziu' }));
    expect(screen.queryByRole('region', { name: 'O copie pentru liniștea ta' })).not.toBeInTheDocument();
  });

  it('„Siguranța datelor” arată data ultimei copii și o actualizează după descărcare', () => {
    URL.createObjectURL = vi.fn(() => 'blob:x');
    URL.revokeObjectURL = vi.fn();
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Nu ai făcut încă nicio copie.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Descarcă o copie de siguranță/ }));
    expect(screen.getByText('Ultima copie: azi.')).toBeInTheDocument();
  });

  it('Dosarul nu mai are al doilea loc pentru copie', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /Dosar/i })[0]);
    expect(screen.queryByText(/Exportă Backup Complet/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Salvare & Portabilitate/)).not.toBeInTheDocument();
  });
});
