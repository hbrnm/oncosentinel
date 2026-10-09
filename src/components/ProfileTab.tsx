import React, { useState, useEffect } from 'react';
import {
  User as UserIcon, Pill, CalendarHeart, Pencil, Plus, ChevronRight, MapPin, X, ShieldCheck, Camera, FileText
} from 'lucide-react';
import { PillIcon } from './Botanical';
import { PatientProfile, DoseLog } from '../types';
import type { AppointmentItem } from './DoctorVisitModal';
import { loadAppointments, saveAppointments } from '../lib/appointments';
import { useBackToClose } from '../lib/backNavigation';

interface ProfileTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onUpdateProfile: (updated: PatientProfile) => void;
  onNavigateToTab: (tab: 'today' | 'treatment' | 'timeline' | 'journal' | 'guide' | 'profile') => void;
  onOpenAuth?: () => void;
  documentsCount?: number;
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
  onOpenAuth,
  documentsCount = 0
}) => {
  // 1. Display name & profile edit modal state
  const [activeTab, setActiveTab] = useState<'settings' | 'dossier'>('settings');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [nameVal, setNameVal] = useState(profile.full_name || '');
  const [reminderTimeVal, setReminderTimeVal] = useState(profile.daily_reminder_time || '08:00');
  const [histologyVal, setHistologyVal] = useState(profile.histology || '');
  const [stageVal, setStageVal] = useState(profile.stage || '');
  const [erVal, setErVal] = useState(profile.er_status || '');
  const [prVal, setPrVal] = useState(profile.pr_status || '');
  const [her2Val, setHer2Val] = useState(profile.her2_status || '');
  const [emailVal, setEmailVal] = useState(profile.email || '');
  const [oncologistEmailVal, setOncologistEmailVal] = useState(profile.oncologist_email || '');
  const [avatarVal, setAvatarVal] = useState(profile.avatar_url || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNameVal(profile.full_name || '');
    setEmailVal(profile.email || '');
    setOncologistEmailVal(profile.oncologist_email || '');
    setReminderTimeVal(profile.daily_reminder_time || '08:00');
    setHistologyVal(profile.histology || '');
    setStageVal(profile.stage || '');
    setErVal(profile.er_status || '');
    setPrVal(profile.pr_status || '');
    setHer2Val(profile.her2_status || '');
    setAvatarVal(profile.avatar_url || '');
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Te rugăm să alegi o imagine mai mică de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize down if too big (max 400x400) to keep localStorage fast and lightweight
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarVal(resizedDataUrl);
          onUpdateProfile({
            ...profile,
            avatar_url: resizedDataUrl
          });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarVal('');
    onUpdateProfile({
      ...profile,
      avatar_url: undefined
    });
  };

  // 3. Appointments list state
  // Aceeași listă ca în „Controale medicale”; se recitește când aceasta se schimbă
  const [appointments, setAppointments] = useState<AppointmentItem[]>(loadAppointments);
  useEffect(() => {
    const reload = () => setAppointments(loadAppointments());
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  // Add Appointment Dialog
  const [addAppt, setAddAppt] = useState(false);
  useBackToClose(editProfileOpen, () => setEditProfileOpen(false));
  useBackToClose(addAppt, () => setAddAppt(false));
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
    saveAppointments(updated);
    setAddAppt(false);
    setApptForm({ date: '', specialty: 'Oncologie', doctor: '', center: '' });
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      full_name: nameVal.trim(),
      email: emailVal.trim() || undefined,
      oncologist_email: oncologistEmailVal.trim() || undefined,
      histology: histologyVal.trim() || profile.histology,
      stage: stageVal.trim() || profile.stage,
      er_status: erVal.trim() || profile.er_status,
      pr_status: prVal.trim() || profile.pr_status,
      her2_status: her2Val.trim() || profile.her2_status,
      daily_reminder_time: reminderTimeVal
    });
    setEditProfileOpen(false);
  };

  const upcoming = appointments.filter((a) => {
    const d = daysUntil(a.date);
    return a.status === 'upcoming' && d !== null && d >= 0;
  });

  const displayName = profile.full_name?.trim() || 'Pacientă';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header matching Base44 */}
      <header className="px-2 pt-1 pb-1">
        <h1 className="font-serif text-3xl font-normal text-ink dark:text-white tracking-tight">
          Profil
        </h1>
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'settings' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Setări & Tratament
          </button>
          <button 
            onClick={() => setActiveTab('dossier')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'dossier' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Dosar Medical
          </button>
        </div>
        <p className="text-[13px] text-ink-soft dark:text-gray-300 mt-1 font-sans">
          Informațiile tale și tratamentul.
        </p>
      </header>

      {activeTab === 'settings' && (
        <div className="space-y-5">

      {/* 1. User Header Card matching Base44 Profil.jsx */}
      <div className="organic-card rounded-[28px] p-5 flex items-center gap-4">
        {/* Hidden File Input for Avatar */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="relative shrink-0 group">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full overflow-hidden bg-sage-soft dark:bg-sage-900/60 flex items-center justify-center border-2 border-sage-200 dark:border-sage-800 hover:opacity-90 transition-opacity cursor-pointer relative"
            title="Schimbă fotografia de profil"
            aria-label="Schimbă fotografia de profil"
          >
            {avatarVal ? (
              <img 
                src={avatarVal} 
                alt={displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <UserIcon className="w-7 h-7 text-sage-deep dark:text-sage-300" strokeWidth={1.6} />
            )}
            
            {/* Camera Overlay Icon on Hover / Always accessible on mobile */}
            <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </span>
          </button>

          {/* Quick badge button for mobile touch */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sage-deep text-white flex items-center justify-center shadow-md border-2 border-white dark:border-darkbg-surface hover:bg-sage-800 transition-colors"
            title="Adaugă sau schimbă fotografia"
          >
            <Camera className="w-3 h-3" />
          </button>

          {/* Remove photo button if photo exists */}
          {avatarVal && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-darkbg-surface hover:bg-rose-600 transition-colors"
              title="Șterge fotografia"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <h2 className="font-serif text-xl text-ink dark:text-white break-words min-w-0">
              {displayName}
            </h2>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-sage-soft dark:bg-sage-900/70 text-sage-deep dark:text-sage-300 text-[10px] font-semibold border border-sage-200/50">
              {profile.histology?.includes('DCIS') ? 'DCIS' : (profile.stage || 'Diagnostic necompletat')}
            </span>
          </div>
          <p className="text-[12px] text-ink-soft dark:text-gray-400 truncate mt-0.5">
            {profile.email || (profile.oncologist_email ? `Medic: ${profile.oncologist_email}` : 'Profil pacient securizat')}
          </p>
        </div>
        <button
          onClick={() => {
            setNameVal(profile.full_name || '');
            setEmailVal(profile.email || '');
            setOncologistEmailVal(profile.oncologist_email || '');
            setReminderTimeVal(profile.daily_reminder_time || '08:00');
            setHistologyVal(profile.histology || '');
            setStageVal(profile.stage || '');
            setErVal(profile.er_status || '');
            setPrVal(profile.pr_status || '');
            setHer2Val(profile.her2_status || '');
            setEditProfileOpen(true);
          }}
          className="tap-scale w-10 h-10 rounded-full bg-cream-deep dark:bg-darkbg-card flex items-center justify-center hover:bg-cream-deep transition-colors cursor-pointer"
          title="Modifică profilul"
          aria-label="Modifică profilul"
        >
          <Pencil className="w-4 h-4 text-ink-soft dark:text-gray-300" />
        </button>
      </div>

      {/* 1.5. Card Situație Medicală & Diagnostic */}
      <div className="organic-card rounded-[28px] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-deep dark:text-sage-300" />
            <p className="micro-label">Diagnostic & Receptori</p>
          </div>
          <button
            onClick={() => {
              setNameVal(profile.full_name || '');
              setHistologyVal(profile.histology || '');
              setStageVal(profile.stage || '');
              setErVal(profile.er_status || '');
              setPrVal(profile.pr_status || '');
              setHer2Val(profile.her2_status || '');
              setEditProfileOpen(true);
            }}
            className="text-[11px] font-semibold text-sage-deep dark:text-sage-300 hover:underline"
          >
            Modifică
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-[13px] font-semibold text-ink dark:text-gray-200">
            {profile.histology || 'Diagnostic necompletat'}
          </p>
          <p className="text-[12px] text-ink-soft dark:text-gray-400">
            {profile.stage || 'Stadiu necompletat'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-warmborder/60 dark:border-darkbg-border text-center">
          <div className="p-2 rounded-xl bg-cream-deep/60 dark:bg-darkbg-card/60">
            <span className="text-[10px] text-ink-soft dark:text-gray-400 block font-medium">Receptor ER</span>
            <span className="text-[11px] font-bold text-sage-deep dark:text-sage-300 truncate block">{profile.er_status || '—'}</span>
          </div>
          <div className="p-2 rounded-xl bg-cream-deep/60 dark:bg-darkbg-card/60">
            <span className="text-[10px] text-ink-soft dark:text-gray-400 block font-medium">Receptor PR</span>
            <span className="text-[11px] font-bold text-sage-deep dark:text-sage-300 truncate block">{profile.pr_status || '—'}</span>
          </div>
          <div className="p-2 rounded-xl bg-cream-deep/60 dark:bg-darkbg-card/60">
            <span className="text-[10px] text-ink-soft dark:text-gray-400 block font-medium">Status HER2</span>
            <span className="text-[11px] font-bold text-ink dark:text-gray-200 truncate block">{profile.her2_status || '—'}</span>
          </div>
        </div>
      </div>

      {/* 2. Tratament Curent Card (sage-card) matching Base44 */}
      <div className="sage-card rounded-[28px] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Pill className="w-4 h-4 text-sage-deep dark:text-sage-300" />
          <p className="micro-label">Tratament curent</p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-darkbg-card/70 flex items-center justify-center shadow-xs shrink-0">
            <PillIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="font-serif text-lg text-sage-deep dark:text-sage-300 leading-tight">
              {profile.medication_name || 'Tamoxifen'}
            </p>
            <p className="text-[12px] text-ink-soft dark:text-gray-300 mt-0.5">
              {profile.medication_dose || '20 mg'} • {profile.medication_frequency || '1 comprimat/zi'} • {profile.daily_reminder_time || '08:00'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('treatment')}
          className="tap-scale mt-4 w-full text-[13px] font-semibold text-sage-deep dark:text-sage-300 flex items-center justify-center gap-1 py-2.5 rounded-2xl bg-white/60 dark:bg-darkbg-card/60 hover:bg-white/80 transition-colors cursor-pointer"
        >
          Gestionează tratamentul <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Controale Medicale Card matching Base44 */}
      <div className="organic-card rounded-[28px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarHeart className="w-4 h-4 text-sage-deep dark:text-sage-300" />
            <p className="micro-label">Controale medicale</p>
          </div>
          <button
            onClick={() => setAddAppt(true)}
            className="tap-scale w-8 h-8 rounded-full bg-sage-soft dark:bg-sage-900/60 flex items-center justify-center hover:bg-sage-200 transition-colors cursor-pointer"
            title="Adaugă control"
            aria-label="Adaugă control"
          >
            <Plus className="w-4 h-4 text-sage-deep dark:text-sage-300" />
          </button>
        </div>
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <p className="text-[13px] text-ink-soft/70 dark:text-gray-400 text-center py-3">
              Niciun control viitor. Adaugă unul cu butonul +.
            </p>
          )}
          {upcoming.map((a) => {
            const d = daysUntil(a.date);
            const dateObj = new Date(a.date + (a.date.length <= 10 ? 'T00:00:00' : ''));
            const monthShort = dateObj.toLocaleDateString('ro-RO', { month: 'short' });
            const dayNum = dateObj.getDate();

            return (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-2xl bg-cream-deep/50 dark:bg-darkbg-card/50">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-darkbg-surface flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[10px] text-ink-soft dark:text-gray-400 font-medium uppercase leading-tight">
                    {monthShort}
                  </span>
                  <span className="font-serif text-lg text-sage-deep dark:text-sage-300 leading-none">
                    {dayNum}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink dark:text-gray-200">
                    {a.specialty}
                  </p>
                  {a.doctor && (
                    <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5">
                      {a.doctor}
                    </p>
                  )}
                  {a.center && (
                    <p className="text-[11px] text-ink-soft/80 dark:text-gray-400 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-sage-deep dark:text-sage-300 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{a.center}</span>
                    </p>
                  )}
                </div>
                {d !== null && d >= 0 && (
                  <span className="shrink-0 px-2 py-1 rounded-full bg-sage-soft dark:bg-sage-900/60 text-sage-deep dark:text-sage-300 text-[10px] font-semibold">
                    peste {d} {d === 1 ? 'zi' : 'zile'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Siguranța datelor */}
      {onOpenAuth && (
        <button
          onClick={onOpenAuth}
          className="tap-scale w-full organic-card rounded-2xl p-4 flex items-center justify-center gap-2 text-sage-deep dark:text-sage-300 font-semibold text-[14px] hover:bg-cream transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Siguranța datelor</span>
        </button>
      )}
      </div>
      )}

      {/* Dosar medical: documentele reale stau în Cronologie */}
      {activeTab === 'dossier' && (
        <div className="space-y-4 animate-fade-in">
          <div className="organic-card p-5 rounded-3xl">
            <h3 className="font-serif text-xl text-ink dark:text-white">Dosar Medical</h3>
            <p className="text-[13px] text-ink-soft dark:text-gray-400 mt-1">
              {documentsCount === 0
                ? 'Încă nu ai încărcat niciun document.'
                : documentsCount === 1
                  ? 'Ai 1 document salvat pe acest dispozitiv.'
                  : `Ai ${documentsCount} documente salvate pe acest dispozitiv.`}
            </p>
            <button
              type="button"
              onClick={() => onNavigateToTab('timeline')}
              className="tap-scale mt-4 w-full px-4 py-2.5 rounded-2xl bg-sage-deep text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Vezi și încarcă documente în Cronologie</span>
            </button>
          </div>
        </div>
      )}

      {/* Dialog Modificare Date Profil & Situație Medicală */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-modal overflow-y-auto">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-warmborder dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-ink dark:text-white">
                Date Profil & Situație
              </h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-cream-deep transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfileForm} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Nume și prenume
                </label>
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="Introdu numele tău..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Adresa ta de E-mail
                </label>
                <input
                  type="email"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: pacient@exemplu.ro"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  E-mail Medic Oncolog (opțional)
                </label>
                <input
                  type="email"
                  value={oncologistEmailVal}
                  onChange={(e) => setOncologistEmailVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: medic.oncolog@spital.ro"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Diagnostic / Histopatologie
                </label>
                <input
                  type="text"
                  value={histologyVal}
                  onChange={(e) => setHistologyVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: Carcinom Ductal In Situ (DCIS)"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Stadiu clinic
                </label>
                <input
                  type="text"
                  value={stageVal}
                  onChange={(e) => setStageVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: Grad 0 (TisN0M0, G2)"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Receptor ER
                  </label>
                  <input
                    type="text"
                    value={erVal}
                    onChange={(e) => setErVal(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[12px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="Pozitiv"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Receptor PR
                  </label>
                  <input
                    type="text"
                    value={prVal}
                    onChange={(e) => setPrVal(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[12px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="Pozitiv"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Status HER2
                  </label>
                  <input
                    type="text"
                    value={her2Val}
                    onChange={(e) => setHer2Val(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[12px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="ex: Negativ"
                  />
                </div>
              </div>

              
              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Ora administrării
                </label>
                <input
                  type="time"
                  value={reminderTimeVal}
                  onChange={(e) => setReminderTimeVal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-ink-soft hover:bg-cream-deep transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-sage text-white hover:bg-sage-deep transition-colors"
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-modal">
          <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-warmborder dark:border-darkbg-border mb-4">
              <h3 className="font-serif text-lg font-normal text-ink dark:text-white">
                Adaugă control
              </h3>
              <button
                type="button"
                onClick={() => setAddAppt(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-cream-deep transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAppt} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={apptForm.date}
                  onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Specialitate
                  </label>
                  <input
                    type="text"
                    value={apptForm.specialty}
                    onChange={(e) => setApptForm({ ...apptForm, specialty: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="ex: Oncologie"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                    Medic
                  </label>
                  <input
                    type="text"
                    value={apptForm.doctor}
                    onChange={(e) => setApptForm({ ...apptForm, doctor: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                    placeholder="Dr. Popescu"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1">
                  Centru / Spital
                </label>
                <input
                  type="text"
                  value={apptForm.center}
                  onChange={(e) => setApptForm({ ...apptForm, center: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
                  placeholder="ex: Institutul Oncologic"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-warmborder dark:border-darkbg-border mt-4">
                <button
                  type="button"
                  onClick={() => setAddAppt(false)}
                  className="px-4 py-2 rounded-xl text-[13px] text-ink-soft hover:bg-cream-deep transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={!apptForm.date}
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-sage hover:bg-sage-deep text-white disabled:opacity-50 transition-colors"
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
