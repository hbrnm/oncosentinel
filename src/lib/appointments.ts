import type { AppointmentItem } from '../components/DoctorVisitModal';

const LIST_KEY = 'navimed_appointments_list';
const NEXT_KEY = 'navimed_next_control_date';

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Lista de controale salvată pe dispozitiv. O dată de control salvată separat
 * (configurare, versiuni mai vechi) care lipsește din listă devine programare,
 * ca să nu se piardă.
 */
export function loadAppointments(): AppointmentItem[] {
  let list: AppointmentItem[] = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
    if (Array.isArray(parsed)) list = parsed;
  } catch (e) {}
  const legacyDate = localStorage.getItem(NEXT_KEY);
  if (!legacyDate || legacyDate < todayIso() || list.some(a => a.date === legacyDate)) return list;
  return [...list, {
    id: 'appt_control',
    date: legacyDate,
    specialty: 'Oncologie',
    doctor: localStorage.getItem('navimed_doctor_name') || undefined,
    status: 'upcoming'
  }];
}

/**
 * Salvează lista și ține „următorul control” (cheia folosită pe Astăzi) pe cel mai
 * apropiat control viitor; fără controale viitoare, cheia se șterge.
 */
export function saveAppointments(list: AppointmentItem[]): void {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
  const next = list
    .filter(a => a.status === 'upcoming' && a.date >= todayIso())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (next) {
    localStorage.setItem(NEXT_KEY, next.date);
    if (next.doctor) localStorage.setItem('navimed_doctor_name', next.doctor);
  } else {
    localStorage.removeItem(NEXT_KEY);
  }
  window.dispatchEvent(new Event('storage'));
}

/**
 * Setează data următorului control: mută cel mai apropiat control viitor la noua dată
 * sau, dacă nu există niciunul, adaugă unul nou. Ține lista și data în acord.
 */
export function setNextControlDate(date: string): void {
  const list = loadAppointments();
  const next = list
    .filter(a => a.status === 'upcoming' && a.date >= todayIso())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const updated: AppointmentItem[] = next
    ? list.map(a => (a.id === next.id ? { ...a, date } : a))
    : [...list, { id: `appt_${Date.now()}`, date, specialty: 'Oncologie', status: 'upcoming' }];
  saveAppointments(updated);
}

/**
 * „Ultimul control” pentru „Pentru medic”: cel mai recent control cu data trecută,
 * efectuat sau rămas „programat”; fără cele ratate sau anulate.
 */
export function lastControlDate(list: AppointmentItem[]): string | null {
  const past = list
    .filter(a => (a.status === 'completed' || a.status === 'upcoming') && a.date < todayIso())
    .map(a => a.date)
    .sort();
  return past.length > 0 ? past[past.length - 1] : null;
}
