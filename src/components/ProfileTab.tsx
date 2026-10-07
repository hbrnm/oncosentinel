import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Pill, CalendarHeart, Bell, LogOut, Pencil, Plus, 
  ChevronRight, MapPin, Check, X, ShieldCheck, Heart, Clock
} from 'lucide-react';
import { PillIcon } from './Botanical';
import { PatientProfile, DoseLog } from '../types';
import { formatDateRo } from './TreatmentTab';

interface AppointmentItem {
  id: string;
  date: string;
  time?: string;
  specialty: string;
  doctor?: string;
  center?: string;
  status: 'upcoming' | 'done' | 'cancelled';
}

interface ProfileTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onUpdateProfile: (updated: PatientProfile) => void;
  onNavigateToTab: (tab: 'today' | 'treatment' | 'timeline' | 'symptoms' | 'guide' | 'profile') => void;
  onOpenAuth?: () => void;
}

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return null;
  const target = new Date(dateStr + (dateStr.length <= 10 ? 'T00:00:00' : ''));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (isNaN(target.getTime())) return null;
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  doses,
  onUpdateProfile,
  onNavigateToTab,
  onOpenAuth
}) => {
  // 1. Display name state & edit modal
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(profile.full_name || 'Andreea');

  // 2. Reminders settings state
  const [doseReminderEnabled, setDoseReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('navimed_dose_reminder_enabled') !== 'false';
  });
  const [apptReminderEnabled, setApptReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('navimed_appt_reminder_enabled') !== 'false';
  });

  const handleToggleDoseReminder = () => {
    const nextVal = !doseReminderEnabled;
    setDoseReminderEnabled(nextVal);
    localStorage.setItem('navimed_dose_reminder_enabled', String(nextVal));
  };

  const handleToggleApptReminder = () => {
    const nextVal = !apptReminderEnabled;
    setApptReminderEnabled(nextVal);
    localStorage.setItem('navimed_appt_reminder_enabled', String(nextVal));
  };

  // 3. Appointments list state
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    const saved = localStorage.getItem('navimed_appointments_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const legacyDate = localStorage.getItem('navimed_next_control_date') || '2026-11-18';
    const legacyDoctor = localStorage.getItem('navimed_doctor_name') || 'Dr. Maria Popescu';
    return [
      {
        id: 'appt_1',
        date: legacyDate,
        time: '10:00',
        specialty: 'Oncologie',
        doctor: legacyDoctor,
        center: 'Institutul Oncologic',
        status: 'upcoming'
      }
    ];
  });

  // Add Appointment Dialog
  const [addAppt, setAddAppt] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: '',
    specialty: 'Oncologie',
    doctor: '',
    center: ''
  });

  const handleSaveAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptForm.date) return;
    const newAppt: AppointmentItem = {
      id: `appt_${Date.now()}`,
      date: apptForm.date,
      specialty: apptForm.specialty || 'Oncologie',
      doctor: apptForm.doctor || '',
      center: apptForm.center || '',
      status: 'upcoming'
    };
    const updated = [...appointments, newAppt].sort((a, b) => a.date.localeCompare(b.date));
    setAppointments(updated);
    localStorage.setItem('navimed_appointments_list', JSON.stringify(updated));
    localStorage.setItem('navimed_next_control_date', updated[0].date);
    if (updated[0].doctor) {
      localStorage.setItem('navimed_doctor_name', updated[0].doctor);
    }
    window.dispatchEvent(new Event('storage'));
    setAddAppt(false);
    setApptForm({ date: '', specialty: 'Oncologie', doctor: '', center: '' });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      full_name: nameVal.trim() || 'Andreea'
    });
    setEditName(false);
  };

  const upcoming = appointments.filter((a) => {
    const d = daysUntil(a.date);
    return a.status === 'upcoming' && d !== null && d >= 0;
  });

  const displayName = profile.full_name?.trim() || 'Andreea';

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Header matching Base44 */}
      <header className="px-2 pt-1 pb-1">
        <h1 className="font-serif text-3xl font-normal text-[#3A332E] dark:text-white tracking-tight">
          Profil
        </h1>
        <p className="text-[13px] text-[#6B6259] dark:text-gray-300 mt-1 font-sans">
          Informațiile tale, tratamentul și preferințele de notificare.
        </p>
      </header>

      {/* 1. User Header Card matching Base44 Profil.jsx */}
      <div className="organic-card rounded-[28px] p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#E8EDE7] dark:bg-sage-900/60 flex items-center justify-center shrink-0">
          <UserIcon className="w-7 h-7 text-[#4A6354] dark:text-sage-300" strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="font-serif text-xl text-[#3A332E] dark:text-white truncate">
              {displayName}
            </h2>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#E8EDE7] dark:bg-sage-900/70 text-[#4A6354] dark:text-sage-300 text-[10px] font-semibold border border-sage-200/50">
              DCIS
            </span>
          </div>
          <p className="text-[12px] text-[#6B6259] dark:text-gray-400 truncate mt-0.5">
            {profile.oncologist_email || 'Profil pacient protejat'}
          </p>
        </div>
        <button
          onClick={() => {
            setNameVal(displayName);
            setEditName(true);
          }}
          className="tap-scale w-10 h-10 rounded-full bg-[#F5F2EB] dark:bg-darkbg-card flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          title="Modifică numele"
          aria-label="Modifică numele"
        >
          <Pencil className="w-4 h-4 text-[#6B6259] dark:text-gray-300" />
        </button>
      </div>

      {/* 2. Tratament Curent Card (sage-card) matching Base44 */}
      <div className="sage-card rounded-[28px] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Pill className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
          <p className="micro-label">Tratament curent</p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-xs shrink-0">
            <PillIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="font-serif text-lg text-[#4A6354] dark:text-sage-300 leading-tight">
              {profile.medication_name || 'Tamoxifen'}
            </p>
            <p className="text-[12px] text-[#6B6259] dark:text-gray-300 mt-0.5">
              {profile.medication_dose || '20 mg'} • {profile.medication_frequency || '1 comprimat/zi'} • {profile.daily_reminder_time || '08:00'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('treatment')}
          className="tap-scale mt-4 w-full text-[13px] font-semibold text-[#4A6354] dark:text-sage-300 flex items-center justify-center gap-1 py-2.5 rounded-2xl bg-white/60 dark:bg-darkbg-card/60 hover:bg-white/80 transition-colors cursor-pointer"
        >
          Gestionează tratamentul <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Controale Medicale Card matching Base44 */}
      <div className="organic-card rounded-[28px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarHeart className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
            <p className="micro-label">Controale medicale</p>
          </div>
          <button
            onClick={() => setAddAppt(true)}
            className="tap-scale w-8 h-8 rounded-full bg-[#E8EDE7] dark:bg-sage-900/60 flex items-center justify-center hover:bg-sage-200 transition-colors cursor-pointer"
            title="Adaugă control"
            aria-label="Adaugă control"
          >
            <Plus className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
          </button>
        </div>
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <p className="text-[13px] text-[#6B6259]/70 dark:text-gray-400 text-center py-3">
              Niciun control viitor. Adaugă unul cu butonul +.
            </p>
          )}
          {upcoming.map((a) => {
            const d = daysUntil(a.date);
            const dateObj = new Date(a.date + (a.date.length <= 10 ? 'T00:00:00' : ''));
            const monthShort = dateObj.toLocaleDateString('ro-RO', { month: 'short' });
            const dayNum = dateObj.getDate();

            return (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-2xl bg-[#F5F2EB]/50 dark:bg-darkbg-card/50">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-darkbg-surface flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[10px] text-[#6B6259] dark:text-gray-400 font-medium uppercase leading-tight">
                    {monthShort}
                  </span>
                  <span className="font-serif text-lg text-[#4A6354] dark:text-sage-300 leading-none">
                    {dayNum}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#3A332E] dark:text-gray-200">
                    {a.specialty}
                  </p>
                  {a.doctor && (
                    <p className="text-[12px] text-[#6B6259] dark:text-gray-400 mt-0.5">
                      {a.doctor}
                    </p>
                  )}
                  {a.center && (
                    <p className="text-[11px] text-[#6B6259]/80 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#4A6354] dark:text-sage-300" />
                      <span>{a.center}</span>
                    </p>
                  )}
                </div>
                {d !== null && d >= 0 && (
                  <span className="shrink-0 px-2 py-1 rounded-full bg-[#E8EDE7] dark:bg-sage-900/60 text-[#4A6354] dark:text-sage-300 text-[10px] font-semibold">
                    peste {d} {d === 1 ? 'zi' : 'zile'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Notificări Card cu Comutatoare Switch matching Base44 */}
      <div className="organic-card rounded-[28px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
          <p className="micro-label">Notificări</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#3A332E] dark:text-gray-200">
                Reminder doză zilnică
              </p>
              <p className="text-[11px] text-[#6B6259] dark:text-gray-400 mt-0.5">
                Memento blând la ora administrării ({profile.daily_reminder_time || '08:00'})
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleDoseReminder}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                doseReminderEnabled ? 'bg-[#5E7A68]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={doseReminderEnabled}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  doseReminderEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-[#EAE5DE]/60 dark:bg-darkbg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#3A332E] dark:text-gray-200">
                Reminder controale
              </p>
              <p className="text-[11px] text-[#6B6259] dark:text-gray-400 mt-0.5">
                Înainte de următoarea programare medicală
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleApptReminder}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                apptReminderEnabled ? 'bg-[#5E7A68]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              role="switch"
              aria-checked={apptReminderEnabled}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  apptReminderEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Acțiune Autentificare / Sincronizare Cloud */}
      {onOpenAuth && (
        <button
          onClick={onOpenAuth}
          className="tap-scale w-full organic-card rounded-2xl p-4 flex items-center justify-center gap-2 text-[#4A6354] dark:text-sage-300 font-semibold text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sincronizare Cloud & Siguranță Date</span>
        </button>
      )}

      {/* Dialog Modificare Nume */}
      {editName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE] dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-[#3A332E] dark:text-white">
                Numele tău
              </h3>
              <button
                type="button"
                onClick={() => setEditName(false)}
                className="p-1 rounded-full text-[#6B6259] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                placeholder="ex: Andreea"
                autoFocus
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditName(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-[#6B6259] hover:bg-gray-100 transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[#5E7A68] text-white hover:bg-[#4A6354] transition-colors"
                >
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog Adăugare Control */}
      {addAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE] dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-[#3A332E] dark:text-white">
                Adaugă control
              </h3>
              <button
                type="button"
                onClick={() => setAddAppt(false)}
                className="p-1 rounded-full text-[#6B6259] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAppt} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={apptForm.date}
                  onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                    Specialitate
                  </label>
                  <input
                    type="text"
                    value={apptForm.specialty}
                    onChange={(e) => setApptForm({ ...apptForm, specialty: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                    placeholder="ex: Oncologie"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                    Medic
                  </label>
                  <input
                    type="text"
                    value={apptForm.doctor}
                    onChange={(e) => setApptForm({ ...apptForm, doctor: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                    placeholder="Dr. Popescu"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#6B6259] dark:text-gray-300 mb-1">
                  Centru / Spital
                </label>
                <input
                  type="text"
                  value={apptForm.center}
                  onChange={(e) => setApptForm({ ...apptForm, center: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EAE5DE] dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-[#3A332E] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#5E7A68]"
                  placeholder="ex: Institutul Oncologic"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#EAE5DE] dark:border-darkbg-border mt-4">
                <button
                  type="button"
                  onClick={() => setAddAppt(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-[#6B6259] hover:bg-gray-100 transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={!apptForm.date}
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-[#5E7A68] hover:bg-[#4A6354] text-white disabled:opacity-50 transition-colors"
                >
                  Adaugă
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
