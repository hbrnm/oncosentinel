// Memento zilnic pentru pastilă în calendarul telefonului (fără server: nimic nu pleacă din aplicație
// în afară de ce alege pacienta să adauge în calendar). Textul e discret, fără numele medicamentului.

export const REMINDER_TEXT = 'E ora pastilei tale. Ai grijă de tine.';

const pad = (n: number) => String(n).padStart(2, '0');

// Textul nu are virgule sau „;” și încape pe o linie de .ics (sub 75 de octeți), deci nu cere escape.

// Ora locală „plutitoare” (fără fus orar): memento-ul sună la ora aleasă oriunde ar fi telefonul
const floating = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

const utcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

/** Începutul și sfârșitul (15 minute) primului memento: azi, la ora pastilei. */
const firstOccurrence = (time: string, now: Date) => {
  // O oră invalidă (ex. din date vechi) cade pe 08:00, ca memento-ul să nu ajungă în altă zi
  const [h, m] = (/^([01]?\d|2[0-3]):[0-5]\d$/.test(time) ? time : '08:00').split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  return { start, end };
};

/** Fișier de calendar (.ics): eveniment zilnic, cu alertă la ora pastilei. */
export function buildReminderIcs(time: string, now = new Date()): string {
  const { start, end } = firstOccurrence(time, now);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OncoSentinel//Memento//RO',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:memento-pastila-${now.getTime()}@oncosentinel`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${floating(start)}`,
    `DTEND:${floating(end)}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${REMINDER_TEXT}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${REMINDER_TEXT}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

/** Legătură care deschide în Google Calendar evenimentul zilnic, completat. */
export function googleCalendarUrl(time: string, now = new Date()): string {
  const { start, end } = firstOccurrence(time, now);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: REMINDER_TEXT,
    dates: `${floating(start)}/${floating(end)}`,
    recur: 'RRULE:FREQ=DAILY'
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Descarcă fișierul de calendar; deschis din Descărcări, telefonul îl adaugă în calendar
 * (pe iPhone: „Adaugă tot”). Aplicația rămâne pe ecran. Întoarce false dacă n-a reușit.
 */
export function downloadReminderIcs(time: string): boolean {
  try {
    const blob = new Blob([buildReminderIcs(time)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'memento-pastila.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return true;
  } catch {
    return false;
  }
}
