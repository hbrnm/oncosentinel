import { DoseLog, SymptomLog } from '../types';
import { plural } from './summary';

// Copia amintită (planul 004, etapa 2): data ultimei copii și „Mai târziu” se țin minte pe dispozitiv
export const LAST_BACKUP_KEY = 'oncosentinel_last_backup';
export const BACKUP_SNOOZE_KEY = 'oncosentinel_backup_snooze_until';

const DAY = 24 * 60 * 60 * 1000;
const REMIND_AFTER_DAYS = 30;
const FIRST_REMIND_AFTER_DAYS = 7;
const SNOOZE_DAYS = 7;

const savedTime = (key: string) => {
  const t = Date.parse(localStorage.getItem(key) || '');
  return Number.isNaN(t) ? null : t;
};

export const markBackupDone = (at: Date = new Date()) => {
  localStorage.setItem(LAST_BACKUP_KEY, at.toISOString());
};

export const snoozeBackupReminder = (now: Date = new Date()) => {
  localStorage.setItem(BACKUP_SNOOZE_KEY, new Date(now.getTime() + SNOOZE_DAYS * DAY).toISOString());
};

export const lastBackupText = (now: Date = new Date()) => {
  const last = savedTime(LAST_BACKUP_KEY);
  if (last === null) return 'Nu ai făcut încă nicio copie.';
  const days = Math.max(0, Math.floor((now.getTime() - last) / DAY));
  if (days === 0) return 'Ultima copie: azi.';
  if (days === 1) return 'Ultima copie: ieri.';
  return `Ultima copie: acum ${plural(days, 'zi', 'zile')}.`;
};

// Memento: ultima copie are peste 30 de zile sau, fără nicio copie, prima doză sau notă are peste 7 zile
export const shouldRemindBackup = (doses: DoseLog[], symptoms: SymptomLog[], now: Date = new Date()) => {
  const snoozeUntil = savedTime(BACKUP_SNOOZE_KEY);
  if (snoozeUntil !== null && snoozeUntil > now.getTime()) return false;

  const last = savedTime(LAST_BACKUP_KEY);
  if (last !== null) return now.getTime() - last > REMIND_AFTER_DAYS * DAY;

  const times = [
    ...doses.map(d => Date.parse(d.taken_at || d.scheduled_for)),
    ...symptoms.map(s => Date.parse(s.logged_at)),
  ].filter(t => !Number.isNaN(t));
  if (times.length === 0) return false;
  return now.getTime() - Math.min(...times) > FIRST_REMIND_AFTER_DAYS * DAY;
};
