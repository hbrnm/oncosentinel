import React, { useState } from 'react';
import { PillIcon } from './Botanical';
import { Check, Pencil, CalendarDays, Clock, X, Pill, Bell } from 'lucide-react';
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

  // Compute 28 days
  const now = new Date();
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString(now);

  // Taken dates set
  const takenDates = new Set(
    doses
      .filter(d => d.status === 'taken')
      .map(d => {
        const dDate = d.taken_at ? new Date(d.taken_at) : new Date(d.scheduled_for);
        return getLocalDateString(dDate);
      })
  );

  const isTodayTaken = takenDates.has(todayStr);

  const days: { iso: string; taken: boolean; isToday: boolean; day: number; dow: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = getLocalDateString(d);
    days.push({
      iso,
      taken: takenDates.has(iso),
      isToday: iso === todayStr,
      day: d.getDate(),
      dow: d.getDay() // 0 = Sun, 1 = Mon ...
    });
  }

  // Count taken days that fall in the 28-day window
  const takenInWindowCount = days.filter(d => d.taken).length;
  const adherence = Math.min(100, Math.round((takenInWindowCount / Math.max(days.length, 1)) * 100));

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

      {/* Card Aderență matching Base44 */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="micro-label">Aderență · ultimele 4 săptămâni</p>
          <span className="font-serif text-2xl text-[#4A6354] dark:text-sage-300">
            {adherence}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#F5F2EB] dark:bg-darkbg-card mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5E7A68] dark:bg-sage-400 transition-all duration-700"
            style={{ width: `${adherence}%` }}
          />
        </div>
        <p className="text-[11px] text-[#6B6259] dark:text-gray-400 mt-2 font-medium">
          {takenInWindowCount} doze luate din {days.length} zile.
        </p>
      </div>

      {/* Card Calendar Doze matching Base44 */}
      <div className="organic-card rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
          <p className="micro-label">Calendar doze</p>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <div key={d.iso} className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-[#6B6259]/60 dark:text-gray-400 font-medium">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'][d.dow]}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-semibold transition-all ${
                  d.isToday ? 'ring-2 ring-[#5E7A68] dark:ring-sage-400 ring-offset-1 ring-offset-white dark:ring-offset-darkbg-surface' : ''
                } ${
                  d.taken
                    ? 'bg-[#5E7A68] text-white shadow-xs'
                    : d.iso < todayStr
                    ? 'bg-[#F5F2EB]/80 dark:bg-darkbg-card text-[#6B6259]/40 dark:text-gray-500'
                    : 'bg-[#F5F2EB]/40 dark:bg-darkbg-card/40 text-[#6B6259] dark:text-gray-400'
                }`}
              >
                {d.taken ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : d.day}
              </div>
            </div>
          ))}
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
