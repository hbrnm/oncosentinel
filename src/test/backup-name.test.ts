import { describe, it, expect, vi, beforeEach } from 'vitest';
import { backupService } from '../lib/backupService';

describe('Copia de siguranță poartă numele OncoSentinel', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
  });

  it('exportul e marcat OncoSentinel', async () => {
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();

    backupService.exportCompleteBackup();

    expect(JSON.parse(await blob!.text()).app).toBe('OncoSentinel');
  });

  it('o copie veche, marcată NaviMed, se poate încă restaura', async () => {
    const file = new File([JSON.stringify({ app: 'NaviMed', profile: '{"full_name":"Ana"}' })], 'vechi.json');

    expect(await backupService.importBackupFromFile(file)).toBe(true);
    expect(localStorage.getItem('navimed_profile')).toBe('{"full_name":"Ana"}');
  });
});
