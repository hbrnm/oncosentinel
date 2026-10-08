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

  it('funcționează cu date mari (un document de 1 MB)', async () => {
    const big = 'A'.repeat(1024 * 1024);
    localStorage.setItem('navimed_docs', big);
    await vault.enable('1234');
    localStorage.setItem('navimed_doses', '["după"]');
    await vault.flush();
    await vault.lock();

    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_docs')?.length).toBe(big.length);
    expect(localStorage.getItem('navimed_doses')).toBe('["după"]');
  });

  it('dacă nu e loc pentru seif la activare, datele rămân neschimbate, în clar', async () => {
    localStorage.setItem('navimed_docs', 'A'.repeat(3 * 1024 * 1024));
    await expect(vault.enable('1234')).rejects.toThrow();

    expect(vault.isEnabled()).toBe(false);
    expect(vault.isUnlocked()).toBe(false);
    expect(localStorage.getItem('navimed_docs')?.length).toBe(3 * 1024 * 1024);
    expect(localStorage.getItem('oncosentinel_vault')).toBeNull();
  });

  it('două activări în paralel nu strică seiful', async () => {
    await Promise.all([vault.enable('1234'), vault.enable('9999')]);
    await vault.lock();
    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
  });

  it('cât timp e blocat, nimic nu se scrie în clar', async () => {
    await vault.enable('1234');
    await vault.lock();
    localStorage.setItem('navimed_doses', '["în clar?"]');

    expect(JSON.stringify(Object.entries(localStorage))).not.toContain('în clar?');
  });

  it('o scriere eșuată (spațiu plin) e semnalată și nu blochează scrierile următoare', async () => {
    await vault.enable('1234');
    const onError = vi.fn();
    vault.setPersistErrorHandler(onError);

    localStorage.setItem('navimed_docs', 'A'.repeat(4 * 1024 * 1024));
    await vault.flush();
    expect(onError).toHaveBeenCalled();

    localStorage.removeItem('navimed_docs');
    localStorage.setItem('navimed_doses', '["după eroare"]');
    await vault.flush();
    await vault.lock();
    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_doses')).toBe('["după eroare"]');
    vault.setPersistErrorHandler(() => undefined);
  });

  it('„Șterge toate datele” în timpul unei scrieri nu readuce seiful', async () => {
    await vault.enable('1234');
    localStorage.setItem('navimed_doses', '["x"]');
    localStorage.clear();
    await vault.flush();

    expect(vault.isEnabled()).toBe(false);
    expect(localStorage.length).toBe(0);
  });

  it('fiecare scriere folosește un IV nou', async () => {
    await vault.enable('1234');
    const iv1 = JSON.parse(window.localStorage['oncosentinel_vault']).iv;
    localStorage.setItem('navimed_doses', '["y"]');
    await vault.flush();
    const iv2 = JSON.parse(window.localStorage['oncosentinel_vault']).iv;
    expect(iv1).not.toBe(iv2);
  });

  it('dacă altă filă a scos PIN-ul, fila aceasta îl uită', async () => {
    await vault.enable('1234');
    window.localStorage.removeItem('oncosentinel_vault');
    await vault.syncWithOtherTab();
    expect(vault.isEnabled()).toBe(false);
    expect(vault.isUnlocked()).toBe(false);
  });

  it('o filă fără PIN trece în modul blocat când altă filă activează PIN-ul', async () => {
    await vault.enable('1234');
    const blob = window.localStorage.getItem('oncosentinel_vault')!;
    vault.eraseAll();
    localStorage.setItem('navimed_profile', '{"full_name":"Ana"}');
    // „cealaltă filă” scrie seiful și șterge datele în clar
    window.localStorage.setItem('oncosentinel_vault', blob);
    await vault.syncWithOtherTab();
    expect(vault.isEnabled()).toBe(true);
    expect(vault.isUnlocked()).toBe(false);

    localStorage.setItem('navimed_doses', '["din fila veche"]');
    expect(JSON.stringify(Object.entries(localStorage))).not.toContain('din fila veche');
  });

  it('o filă blocată nu rămâne blocată dacă altă filă a scos PIN-ul', async () => {
    await vault.enable('1234');
    await vault.lock();
    window.localStorage.removeItem('oncosentinel_vault');

    expect(await vault.unlock('1234')).toBe(false);
    expect(vault.isEnabled()).toBe(false);
  });

  it('o scriere făcută chiar în timpul blocării nu se pierde', async () => {
    await vault.enable('1234');
    localStorage.setItem('navimed_doses', '["a"]');
    const locking = vault.lock();
    localStorage.setItem('navimed_doses', '["b"]');
    await locking;

    expect(await vault.unlock('1234')).toBe(true);
    expect(localStorage.getItem('navimed_doses')).toBe('["b"]');
  });
});
