import React, { useState } from 'react';
import { PillIcon } from './Botanical';
import { Check, Pencil, CalendarDays, CalendarHeart, Clock, X, ChevronLeft, ChevronRight, BellRing } from 'lucide-react';
import { downloadReminderIcs, googleCalendarUrl, REMINDER_TEXT } from '../lib/calendarReminder';
import { loadAppointments } from '../lib/appointments';
import { plural } from '../lib/summary';
import { PatientProfile, DoseLog } from '../types';
import { useBackToClose } from '../lib/backNavigation';
import { OtherMedicines } from './OtherMedicines';
import { stockLine, safeStock } from '../lib/pillStock';

const REMINDER_SET_KEY = 'oncosentinel_reminder_set_time';

interface TreatmentTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onTakeDose: (dateIso?: string) => void;
  onUpdateProfile?: (updated: PatientProfile) => void;
}

const RO_MONTHS = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'
];

export const formatDateRo = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + (dateStr.length <= 10 ? 'T00:00:00' : ''));
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${RO_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const TreatmentTab: React.FC<TreatmentTabProps> = ({
  profile,
  doses,
  onTakeDose,
  onUpdateProfile
}) => {
  const [editing, setEditing] = useState(false);
  useBackToClose(editing, () => setEditing(false));
  const [medName, setMedName] = useState(profile.medication_name || 'Tamoxifen');
  const [medDose, setMedDose] = useState(profile.medication_dose || '20 mg');
  const [medFrequency, setMedFrequency] = useState(profile.medication_frequency || '1 comprimat/zi');
  const [medTime, setMedTime] = useState(profile.daily_reminder_time || '08:00');

  const now = new Date();
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString(now);

  // Month navigation state: defaults to current month
  const [viewDate, setViewDate] = useState<Date>(() => new Date(now.getFullYear(), now.getMonth(), 1));

  // Map of taken and skipped/missed dates
  const takenDates = new Set<string>();
  const missedDates = new Set<string>();

  doses.forEach((d) => {
    const dDate = d.taken_at ? new Date(d.taken_at) : new Date(d.scheduled_for);
    const iso = getLocalDateString(dDate);
    if (d.status === 'taken') {
      takenDates.add(iso);
    } else if (d.status === 'missed' || d.status === 'skipped') {
      missedDates.add(iso);
    }
  });

  const isTodayTaken = takenDates.has(todayStr);

  // Memento zilnic în calendarul telefonului
  const reminderTime = profile.daily_reminder_time || '08:00';
  const [reminderError, setReminderError] = useState(false);
  // Ora pentru care a fost pus memento-ul; dacă ora pastilei se schimbă, cardul revine
  const [reminderSetFor, setReminderSetFor] = useState(() => {
    try { return localStorage.getItem(REMINDER_SET_KEY); } catch { return null; }
  });
  const reminderSet = reminderSetFor === reminderTime;
  const markReminderSet = () => {
    try { localStorage.setItem(REMINDER_SET_KEY, reminderTime); } catch { /* doar afișarea; cardul rămâne deschis */ }
    setReminderSetFor(reminderTime);
  };
  const firstDoseDate = [...takenDates, ...missedDates].sort()[0];

  // Controalele viitoare din „Controale medicale”, marcate și în calendar
  const upcomingAppointments = loadAppointments()
    .filter(a => a.status === 'upcoming' && a.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
  const appointmentDates = new Set(upcomingAppointments.map(a => a.date));

  // Calendar month calculation: standard monthly calendar from 1 to last day of month
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  // In Romania week starts on Monday: Monday = 0, Sunday = 6
  // JS getDay(): Sunday = 0, Monday = 1 ... Saturday = 6
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Previous and next month handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  // Build grid of days
  interface CalendarDay {
    dayNumber: number;
    iso: string;
    status: 'taken' | 'missed' | 'future' | 'empty';
    isToday: boolean;
  }

  const calendarDays: (CalendarDay | null)[] = [];

  // Padding cells before the 1st day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days 1 .. daysInMonth in ascending natural order
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(viewYear, viewMonth, day);
    const iso = getLocalDateString(d);
    const isToday = iso === todayStr;

    let status: 'taken' | 'missed' | 'future' | 'empty' = 'future';

    // Fără data de început, numărăm de la prima doză notată (sau de azi), nu din trecutul nelimitat
    const startDate = profile.tamoxifen_start_date || firstDoseDate || todayStr;

    if (takenDates.has(iso)) {
      status = 'taken';
    } else if (missedDates.has(iso)) {
      status = 'missed';
    } else if (iso < startDate) {
      status = 'future';
    } else if (iso < todayStr) {
      // Past day in which no dose was taken: marked as missed / sarita
      status = 'missed';
    } else if (iso === todayStr) {
      status = isTodayTaken ? 'taken' : 'future';
    } else {
      status = 'future';
    }

    calendarDays.push({
      dayNumber: day,
      iso,
      status,
      isToday
    });
  }

  let applicableDaysInMonth = 0;
  let takenInMonth = 0;
  
  calendarDays.forEach(day => {
    if (day) {
      if (day.status === 'taken') {
        applicableDaysInMonth++;
        takenInMonth++;
      } else if (day.status === 'missed') {
        applicableDaysInMonth++;
      }
    }
  });

  // Fără zile de numărat (lună viitoare, tratament neînceput, azi încă nebifat) nu arătăm procent
  const adherenceMonth = applicableDaysInMonth > 0
    ? Math.min(100, Math.round((takenInMonth / applicableDaysInMonth) * 100))
    : null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        medication_name: medName.trim() || 'Tamoxifen',
        medication_dose: medDose.trim() || '20 mg',
        medication_frequency: medFrequency.trim() || '1 comprimat/zi',
        daily_reminder_time: medTime || '08:00'
      });
    }
    setEditing(false);
  };

  // Recent logs (up to 8 taken doses)
  const recentTakenDoses = doses
    .filter(d => d.status === 'taken')
    .slice(0, 8);

  const monthLabelRo = `${RO_MONTHS[viewMonth]} ${viewYear}`;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header matching Base44 */}
      <header className="px-2 pt-1 pb-1">
        <h1 className="font-serif text-3xl font-normal text-ink dark:text-white tracking-tight">
          Tratament
        </h1>
        <p className="text-[13px] text-ink-soft dark:text-gray-300 mt-1 font-sans">
          Planul tău zilnic și istoricul dozelor.
        </p>
      </header>

      {/* Main Pill Card matching Base44 media_1791362177286 */}
      <div className="sage-card rounded-[28px] p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-soft">
              <PillIcon className="w-9 h-9" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-sage-deep dark:text-sage-300">
                {profile.medication_name || medName}
              </h2>
              <p className="text-[13px] text-ink-soft dark:text-gray-300 mt-0.5">
                {profile.medication_dose || medDose} • {profile.medication_frequency || medFrequency}
              </p>
              <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> {profile.daily_reminder_time || medTime}
              </p>
              <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5">
                {stockLine(safeStock(profile.pill_stock_count))}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="tap-scale w-10 h-10 rounded-full bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-soft hover:bg-white transition-colors cursor-pointer"
            title="Editează tratamentul"
            aria-label="Editează tratamentul"
          >
            <Pencil className="w-4 h-4 text-sage-deep dark:text-sage-300" />
          </button>
        </div>

        {/* Dose Action Banner */}
        <div className="mt-4 pt-4 border-t border-sage/15 dark:border-sage-800/40">
          {!isTodayTaken ? (
            <button
              onClick={() => onTakeDose()}
              className="tap-scale w-full h-12 rounded-2xl bg-sage hover:bg-sage-deep text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-[14px]"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} /> Marchează doza de azi
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 text-sage-deep dark:text-sage-300 font-semibold text-[14px]">
              <Check className="w-5 h-5 text-sage-deep dark:text-sage-300" strokeWidth={2.5} />
              <span>Ai luat doza de azi. Felicitări!</span>
            </div>
          )}
        </div>
      </div>

      {/* Medicamentele mele: celelalte medicamente, doar notate */}
      <OtherMedicines
        treatmentLine={`${[profile.medication_name || 'Tamoxifen', profile.medication_dose].filter(Boolean).join(' ')}${profile.tamoxifen_start_date ? ` din ${formatDateRo(profile.tamoxifen_start_date)}` : ''}`}
      />

      {/* Memento zilnic în calendarul telefonului (fără server); după ce e pus, cardul dispare */}
      {!reminderSet && (
      <section aria-labelledby="reminder-title" className="organic-card rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <BellRing className="w-4 h-4 text-sage-deep dark:text-sage-300" aria-hidden="true" />
          <h2 id="reminder-title" className="micro-label">Memento zilnic</h2>
        </div>
        <p className="text-[13px] text-ink dark:text-gray-200 leading-relaxed">
          Pune un memento în calendarul telefonului, în fiecare zi la {reminderTime}. În memento scrie doar „{REMINDER_TEXT}”, fără numele medicamentului.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <a
            href={googleCalendarUrl(reminderTime)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markReminderSet}
            className="tap-scale py-2.5 px-3 rounded-2xl bg-sage-deep text-white text-[13px] font-semibold text-center"
          >
            Google Calendar
            <span className="sr-only"> (se deschide într-o filă nouă)</span>
          </a>
          <button
            type="button"
            onClick={() => {
              const ok = downloadReminderIcs(reminderTime);
              setReminderError(!ok);
              if (ok) markReminderSet();
            }}
            className="tap-scale py-2.5 px-3 rounded-2xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-[13px] font-semibold text-ink dark:text-gray-100"
          >
            Alt calendar (iPhone, Samsung…)
          </button>
        </div>
        {reminderError && (
          <p role="alert" className="text-[12px] text-ink dark:text-gray-100 font-semibold mt-3 leading-relaxed">
            Nu am putut crea fișierul de calendar. Încearcă din nou sau folosește Google Calendar.
          </p>
        )}
        <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-3 leading-relaxed">
          Dacă schimbi ora, adaugă din nou memento-ul și șterge-l pe cel vechi din calendar.
        </p>
      </section>
      )}

      {/* Card Aderență pe Luna Curentă */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="micro-label">Aderență · {monthLabelRo}</p>
          <span className="font-serif text-2xl text-sage-deep dark:text-sage-300">
            {adherenceMonth === null ? '—' : `${adherenceMonth}%`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-cream-deep dark:bg-darkbg-card mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-sage dark:bg-sage-400 transition-all duration-700"
            style={{ width: `${adherenceMonth ?? 0}%` }}
          />
        </div>
        <p className="text-[11px] text-ink-soft dark:text-gray-400 mt-2 font-medium">
          {adherenceMonth === null
            ? 'Încă nu sunt zile de numărat în această lună.'
            : `Ai marcat ${takenInMonth} din ${plural(applicableDaysInMonth, 'zi', 'zile')}.`}
        </p>
      </div>

      {/* Card Calendar Doze Lunar Normal (Zilele lunii de la 1 la ultima zi) */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-sage-deep dark:text-sage-300" />
            <p className="micro-label">Calendar doze</p>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="tap-scale p-1.5 rounded-full hover:bg-cream-deep dark:hover:bg-darkbg-card text-ink-soft dark:text-gray-300 transition-colors"
              title="Luna precedentă"
              aria-label="Luna precedentă"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-semibold text-ink dark:text-gray-200 capitalize min-w-[110px] text-center">
              {monthLabelRo}
            </span>
            <button
              onClick={handleNextMonth}
              className="tap-scale p-1.5 rounded-full hover:bg-cream-deep dark:hover:bg-darkbg-card text-ink-soft dark:text-gray-300 transition-colors"
              title="Luna următoare"
              aria-label="Luna următoare"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-1.5 px-2 mb-3 bg-cream dark:bg-darkbg-card/50 rounded-xl text-[11px] text-ink-soft dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sage" />
            <span>Luat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-peach-300" />
            <span>Nebifat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warmborder dark:bg-gray-600" />
            <span>Programat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarHeart className="w-3.5 h-3.5 text-blush-deep" aria-hidden="true" />
            <span>Control la medic</span>
          </div>
        </div>

        {/* Day of Week Header: L, M, M, J, V, S, D */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
            <span key={idx} className="text-[10px] text-ink-soft/70 dark:text-gray-400 font-semibold py-0.5">
              {d}
            </span>
          ))}
        </div>

        {/* 7-column Calendar Grid (Days 1 to N in ascending natural order) */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="w-8 h-8 mx-auto" />;
            }

            const { dayNumber, status, isToday } = cell;
            const hasAppointment = appointmentDates.has(cell.iso);

            return (
              <div key={cell.iso} className="relative flex flex-col items-center">
                {hasAppointment && (
                  <span className="absolute -top-1 right-0 z-10 w-4 h-4 rounded-full bg-white dark:bg-darkbg-surface shadow-xs flex items-center justify-center">
                    <CalendarHeart className="w-3 h-3 text-blush-deep" aria-hidden="true" />
                    <span className="sr-only">Control la medic</span>
                  </span>
                )}
                <button onClick={() => { if (status === "missed") onTakeDose(cell.iso); }}
                  className={`relative w-8 h-8 ${status === "missed" ? "cursor-pointer hover:bg-peach-200 hover:scale-110" : ""} rounded-xl flex items-center justify-center text-[11px] font-semibold transition-all ${
                    isToday
                      ? 'ring-2 ring-sage dark:ring-sage-400 ring-offset-1 ring-offset-white dark:ring-offset-darkbg-surface font-bold'
                      : ''
                  } ${
                    status === 'taken'
                      ? 'bg-sage text-white shadow-xs'
                      : status === 'missed'
                      ? 'bg-peach-100 text-peach-800 ring-1 ring-inset ring-peach-300'
                      : 'bg-cream-deep/60 dark:bg-darkbg-card text-ink dark:text-gray-300'
                  }`}
                  title={`${dayNumber} ${monthLabelRo} - ${
                    status === 'taken' ? 'Doză luată' : status === 'missed' ? 'Doză nebifată (Apasă pentru a bifa retroactiv)' : 'Viitoare / De luat'
                  }`}
                >
                  {status === 'taken' ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : status === 'missed' ? (
                    <>
                      {dayNumber}
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-peach-600" aria-hidden="true" />
                      <span className="sr-only">, nebifat</span>
                    </>
                  ) : (
                    dayNumber
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Programările următoare, din „Controale medicale” */}
      {upcomingAppointments.length > 0 && (
        <section aria-labelledby="appointments-title" className="organic-card rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CalendarHeart className="w-4 h-4 text-blush-deep" />
            <h2 id="appointments-title" className="micro-label">Programările următoare</h2>
          </div>
          <ul className="space-y-2">
            {upcomingAppointments.map((a) => (
              <li key={a.id} className="py-2 border-b border-warmborder/60 dark:border-darkbg-border last:border-0">
                <p className="text-[13px] font-semibold text-ink dark:text-gray-200">
                  {formatDateRo(a.date)}{a.time ? `, ${a.time}` : ''}
                </p>
                <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5 break-words">
                  {[a.specialty, a.doctor, a.center].filter(Boolean).join(' • ')}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Card Istoric Recent matching Base44 */}
      <div className="organic-card rounded-3xl p-5">
        <p className="micro-label mb-3">Istoric recent</p>
        <div className="space-y-2">
          {recentTakenDoses.map((l) => {
            const dateStr = l.taken_at || l.scheduled_for;
            return (
              <div
                key={l.id}
                className="flex items-center justify-between py-2 border-b border-warmborder/60 dark:border-darkbg-border last:border-0"
              >
                <span className="text-[13px] text-ink dark:text-gray-200">
                  {formatDateRo(dateStr)}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] text-sage-deep dark:text-sage-300 font-semibold">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Luat
                </span>
              </div>
            );
          })}
          {recentTakenDoses.length === 0 && (
            <p className="text-[13px] text-ink-soft/70 dark:text-gray-400 text-center py-4">
              Nicio doză marcată încă.
            </p>
          )}
        </div>
      </div>

      {/* Modal Editare Tratament */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-modal">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-warmborder dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-ink dark:text-white">
                Editează tratamentul
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-cream-deep dark:hover:bg-darkbg-card transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Denumire medicament
                </label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: Tamoxifen"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Doză
                  </label>
                  <input
                    type="text"
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="ex: 20 mg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Frecvență
                  </label>
                  <input
                    type="text"
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="ex: 1 comprimat/zi"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Ora administrării
                </label>
                <input
                  type="time"
                  value={medTime}
                  onChange={(e) => setMedTime(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-warmborder dark:border-darkbg-border mt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-ink-soft dark:text-gray-300 hover:bg-cream-deep dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-sage hover:bg-sage-deep text-white shadow-xs transition-colors cursor-pointer"
                >
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
