import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest';
import { vault } from '../lib/vault';
import { backupService } from '../lib/backupService';

describe('Seiful cu PIN', () => {
  beforeEach(() => {
    vault.eraseAll();
    localStorage.setItem('navimed_profile', '{"full_name":"Ana"}');
    localStorage.setItem('navimed_symptoms', '[1,2,3]');
  });
  afterEach(() => vault.eraseAll());

  it('la activare, datele nu mai stau necriptate, dar aplicația le citește la fel', async () => {
    await vault.enable('1234');

    expect(vault.isEnabled()).toBe(true);
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
    const raw = JSON.stringify(Object.entries(localStorage));
    expect(raw).not.toContain('Ana');
    expect(raw).toContain('oncosentinel_vault');
  });

  it('scrierile se recriptează și supraviețuiesc blocării', async () => {
    await vault.enable('1234');
    localStorage.setItem('navimed_doses', '["azi"]');
    localStorage.removeItem('navimed_symptoms');
    await vault.lock();

    expect(localStorage.getItem('navimed_doses')).toBeNull();
    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_doses')).toBe('["azi"]');
    expect(localStorage.getItem('navimed_symptoms')).toBeNull();
  });

  it('un PIN greșit nu deschide nimic', async () => {
    await vault.enable('1234');
    await vault.lock();

    expect(await vault.unlock('0000')).toBe(false);
    expect(vault.isUnlocked()).toBe(false);
    expect(localStorage.getItem('navimed_profile')).toBeNull();
  });

  it('dezactivarea aduce datele înapoi necriptate', async () => {
    await vault.enable('1234');
    localStorage.setItem('navimed_doses', '["azi"]');
    await vault.disable();

    expect(vault.isEnabled()).toBe(false);
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
    expect(localStorage.getItem('navimed_doses')).toBe('["azi"]');
  });

  it('„Am uitat PIN-ul” șterge tot', async () => {
    await vault.enable('1234');
    await vault.lock();
    vault.eraseAll();

    expect(vault.isEnabled()).toBe(false);
    expect(localStorage.length).toBe(0);
  });

  it('restaurarea unei copii cu PIN activ ajunge criptată înainte de reîncărcare', async () => {
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    await vault.enable('1234');
    const file = new File([JSON.stringify({ app: 'OncoSentinel', doses: '["restaurat"]' })], 'copie.json');

    expect(await backupService.importBackupFromFile(file)).toBe(true);
    await vault.lock();
    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_doses')).toBe('["restaurat"]');
  });
});
