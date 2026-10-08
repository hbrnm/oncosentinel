import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { backupService } from '../lib/backupService';

// O copie de siguranță veche (dinainte de jurnalul separat și de lista de controale)
// se restaurează pe un telefon nou (audit 2026-10-08, etapa 3)

const localDay = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const oldBackup = () => JSON.stringify({
  app: 'OncoSentinel',
  version: '1.0',
  profile: JSON.stringify({ full_name: 'Ana Pop', tamoxifen_start_date: localDay(-30), pill_stock_count: 20, daily_reminder_time: '09:00', medication_dose: '20 mg' }),
  doses: JSON.stringify([{ id: 'd1', medication_name: 'Tamoxifen 20 mg', scheduled_for: new Date(Date.now() - 86400000).toISOString(), taken_at: new Date(Date.now() - 86400000).toISOString(), status: 'taken' }]),
  // notă veche: stare, gânduri și simptome în aceeași intrare, fără tip
  symptoms: JSON.stringify([{ id: 'sym_1', logged_at: new Date(Date.now() - 2 * 86400000).toISOString(), mood_state: 'Rău', notes: 'Zi grea', hot_flashes_count: 3, hot_flashes_intensity: 2, night_sweats: false, fatigue_level: 4, sleep_quality: 2, joint_pain_level: 0, joint_pain_areas: [], mucosal_dryness: 0, water_intake_ml: 2000 }]),
  // controlul vechi: doar data, fără listă
  next_control_date: localDay(20)
});

describe('Restaurarea unei copii vechi pe un telefon nou', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('nu mai cere configurarea și păstrează notele, dozele și controlul', async () => {
    expect(await backupService.importBackupFromFile(new File([oldBackup()], 'vechi.json'))).toBe(true);
    render(<App />);

    // fără fereastra de configurare peste datele restaurate
    expect(screen.queryByText(/Continuă spre Alerte/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/^ana$/i).length).toBeGreaterThan(0);
    // controlul vechi apare pe Astăzi
    expect(screen.getByText(/URMĂTORUL CONTROL/).closest('div.cursor-pointer')!.textContent).toContain('peste 20 zile');

    // nota veche apare în Jurnal cu eticheta nouă și cu simptomele ei
    fireEvent.click(screen.getByRole('button', { name: 'Jurnal' }));
    expect(screen.getByText('Zi grea')).toBeInTheDocument();
    expect(screen.getAllByText('Obosită').length).toBeGreaterThan(0);
    expect(screen.getByText(/Oboseală: 4\/5/)).toBeInTheDocument();
  });

  it('o copie cu profil gol nu sare peste configurare', async () => {
    await backupService.importBackupFromFile(new File([JSON.stringify({ app: 'OncoSentinel', profile: '{}' })], 'gol.json'));
    expect(localStorage.getItem('oncosentinel_onboarded')).toBeNull();
  });

  it('o copie nouă păstrează și victoriile deja văzute', async () => {
    localStorage.setItem('oncosentinel_victories_seen', '["doze-7"]');
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    backupService.exportCompleteBackup();
    const text = await blob!.text();
    localStorage.clear();
    await backupService.importBackupFromFile(new File([text], 'copie.json'));
    expect(localStorage.getItem('oncosentinel_victories_seen')).toBe('["doze-7"]');
  });
});

describe('Zilele până la control, peste schimbarea orei', () => {
  it('pe 20 octombrie, controlul din 28 octombrie e „peste 8 zile” (ora se schimbă pe 25)', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 20, 15, 0));
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem('navimed_next_control_date', '2026-10-28');
    render(<App />);
    expect(screen.getByText(/URMĂTORUL CONTROL/).closest('div.cursor-pointer')!.textContent).toContain('peste 8 zile');
    vi.useRealTimers();
  });
});
