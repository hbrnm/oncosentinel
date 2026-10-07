import React, { useState } from 'react';
import { PillIcon } from './Botanical';
import { Check, Pencil, CalendarDays, Clock, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { PatientProfile, DoseLog } from '../types';

interface TreatmentTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onTakeDose: () => void;
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

    if (takenDates.has(iso)) {
      status = 'taken';
    } else if (missedDates.has(iso)) {
      status = 'missed';
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

  // Monthly stats: count taken, missed, total elapsed days in month up to today
  const totalElapsedDaysInViewMonth = Math.min(
    daysInMonth,
    viewYear === now.getFullYear() && viewMonth === now.getMonth()
      ? now.getDate()
      : viewDate < now
      ? daysInMonth
      : 0
  );

  const takenInViewMonth = Array.from(takenDates).filter((iso) => {
    const [y, m] = iso.split('-').map(Number);
    return y === viewYear && m === viewMonth + 1;
  }).length;

  const adherenceMonth = totalElapsedDaysInViewMonth > 0
    ? Math.min(100, Math.round((takenInViewMonth / totalElapsedDaysInViewMonth) * 100))
    : 100;

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
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Header matching Base44 */}
      <header className="px-2 pt-1 pb-1">
        <h1 className="font-serif text-3xl font-normal text-[#3A332E] dark:text-white tracking-tight">
          Tratament
        </h1>
        <p className="text-[13px] text-[#6B6259] dark:text-gray-300 mt-1 font-sans">
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
              <h2 className="font-serif text-xl font-normal text-[#4A6354] dark:text-sage-300">
                {profile.medication_name || medName}
              </h2>
              <p className="text-[13px] text-[#6B6259] dark:text-gray-300 mt-0.5">
                {profile.medication_dose || medDose} • {profile.medication_frequency || medFrequency}
              </p>
              <p className="text-[12px] text-[#6B6259] dark:text-gray-400 mt-0.5 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> {profile.daily_reminder_time || medTime}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="tap-scale w-10 h-10 rounded-full bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-soft hover:bg-white transition-colors cursor-pointer"
            title="Editează tratamentul"
            aria-label="Editează tratamentul"
          >
            <Pencil className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
          </button>
        </div>

        {/* Dose Action Banner */}
        <div className="mt-4 pt-4 border-t border-[#5E7A68]/15 dark:border-sage-800/40">
          {!isTodayTaken ? (
            <button
              onClick={onTakeDose}
              className="tap-scale w-full h-12 rounded-2xl bg-[#5E7A68] hover:bg-[#4A6354] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-[14px]"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} /> Marchează doza de azi
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 text-[#4A6354] dark:text-sage-300 font-semibold text-[14px]">
              <Check className="w-5 h-5 text-[#4A6354] dark:text-sage-300" strokeWidth={2.5} />
              <span>Ai luat doza de azi. Felicitări!</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Aderență pe Luna Curentă */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="micro-label">Aderență · {monthLabelRo}</p>
          <span className="font-serif text-2xl text-[#4A6354] dark:text-sage-300">
            {adherenceMonth}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#F5F2EB] dark:bg-darkbg-card mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5E7A68] dark:bg-sage-400 transition-all duration-700"
            style={{ width: `${adherenceMonth}%` }}
          />
        </div>
        <p className="text-[11px] text-[#6B6259] dark:text-gray-400 mt-2 font-medium">
          {takenInViewMonth} doze luate din {totalElapsedDaysInViewMonth > 0 ? totalElapsedDaysInViewMonth : daysInMonth} zile.
        </p>
      </div>

      {/* Card Calendar Doze Lunar Normal (Zilele lunii de la 1 la ultima zi) */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
            <p className="micro-label">Calendar doze</p>
          </div>

          {/* Month Navigator */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="tap-scale p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkbg-card text-[#6B6259] dark:text-gray-300 transition-colors"
              title="Luna precedentă"
              aria-label="Luna precedentă"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-semibold text-[#3A332E] dark:text-gray-200 capitalize min-w-[110px] text-center">
              {monthLabelRo}
            </span>
            <button
              onClick={handleNextMonth}
              className="tap-scale p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-darkbg-card text-[#6B6259] dark:text-gray-300 transition-colors"
              title="Luna următoare"
              aria-label="Luna următoare"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 py-1.5 mb-3 bg-[#FAF8F5] dark:bg-darkbg-card/50 rounded-xl text-[11px] text-[#6B6259] dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5E7A68]" />
            <span>Luat (verde)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span>Sărit (roșu)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAE5DE] dark:bg-gray-600" />
            <span>Programat</span>
          </div>
        </div>

        {/* Day of Week Header: L, M, M, J, V, S, D */}
        <div className="grid grid-cols-7 gap-1.5 text-center mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
            <span key={idx} className="text-[10px] text-[#6B6259]/70 dark:text-gray-400 font-semibold py-0.5">
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

            return (
              <div key={cell.iso} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-semibold transition-all ${
                    isToday
                      ? 'ring-2 ring-[#5E7A68] dark:ring-sage-400 ring-offset-1 ring-offset-white dark:ring-offset-darkbg-surface font-bold'
                      : ''
                  } ${
                    status === 'taken'
                      ? 'bg-[#5E7A68] text-white shadow-xs'
                      : status === 'missed'
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'bg-[#F5F2EB]/60 dark:bg-darkbg-card text-[#3A332E] dark:text-gray-300'
                  }`}
                  title={`${dayNumber} ${monthLabelRo} - ${
                    status === 'taken' ? 'Doză luată' : status === 'missed' ? 'Doză sărită' : 'Viitoare / De luat'
                  }`}
                >
                  {status === 'taken' ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : status === 'missed' ? (
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    dayNumber
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Istoric Recent matching Base44 */}
      <div className="organic-card rounded-3xl p-5">
        <p className="micro-label mb-3">Istoric recent</p>
        <div className="space-y-2">
          {recentTakenDoses.map((l) => {
            const dateStr = l.taken_at || l.scheduled_for;
            return (
              <div
                key={l.id}
                className="flex items-center justify-between py-2 border-b border-[#EAE5DE]/60 dark:border-darkbg-border last:border-0"
              >
                <span className="text-[13px] text-[#3A332E] dark:text-gray-200">
                  {formatDateRo(dateStr)}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#4A6354] dark:text-sage-300 font-semibold">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Luat
                </span>
              </div>
            );
          })}
          {recentTakenDoses.length === 0 && (
            <p className="text-[13px] text-[#6B6259]/70 dark:text-gray-400 text-center py-4">
              Nicio doză marcată încă.
            </p>
          )}
        </div>
      </div>

      {/* Modal Editare Tratament */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE] dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-[#3A332E] dark:text-white">
                Editează tratamentul
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="p-1 rounded-full text-[#6B6259] hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                  Denumire medicament
                </label>
                <input
                  type="text"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                  placeholder="ex: Tamoxifen"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                    Doză
                  </label>
                  <input
                    type="text"
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                    placeholder="ex: 20 mg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                    Frecvență
                  </label>
                  <input
                    type="text"
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                    placeholder="ex: 1 comprimat/zi"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                  Ora administrării
                </label>
                <input
                  type="time"
                  value={medTime}
                  onChange={(e) => setMedTime(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE5DE] dark:border-darkbg-border mt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#6B6259] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[#5E7A68] hover:bg-[#4A6354] text-white shadow-xs transition-colors cursor-pointer"
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
