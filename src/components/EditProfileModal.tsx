import React, { useState } from 'react';
import { X, User, Calendar, Clock, Pill, Mail, Save, Check } from 'lucide-react';
import { PatientProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onSave: (updated: PatientProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [fullName, setFullName] = useState(profile.full_name);
  const [histology, setHistology] = useState(profile.histology || '');
  const [stage, setStage] = useState(profile.stage || '');
  const [erStatus, setErStatus] = useState(profile.er_status || '');
  const [prStatus, setPrStatus] = useState(profile.pr_status || '');
  const [her2Status, setHer2Status] = useState(profile.her2_status || '');
  const [reminderTime, setReminderTime] = useState(profile.daily_reminder_time);
  const [startDate, setStartDate] = useState(profile.tamoxifen_start_date || '');
  const [stock, setStock] = useState<number | ''>(profile.pill_stock_count ?? 30);
  const [email, setEmail] = useState(profile.email || '');
  const [oncologistEmail, setOncologistEmail] = useState(profile.oncologist_email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setHistology(profile.histology || '');
      setStage(profile.stage || '');
      setErStatus(profile.er_status || '');
      setPrStatus(profile.pr_status || '');
      setHer2Status(profile.her2_status || '');
      setReminderTime(profile.daily_reminder_time || '08:30');
      setStock(profile.pill_stock_count ?? 30);
      setStartDate(profile.tamoxifen_start_date || '');
      setOncologistEmail(profile.oncologist_email || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      full_name: fullName.trim(),
      email: email.trim() || undefined,
      histology: histology.trim() || profile.histology,
      stage: stage.trim() || profile.stage,
      er_status: erStatus.trim() || profile.er_status,
      pr_status: prStatus.trim() || profile.pr_status,
      her2_status: her2Status.trim() || profile.her2_status,
      daily_reminder_time: reminderTime,
      pill_stock_count: stock === '' ? 0 : Number(stock),
      tamoxifen_start_date: startDate,
      oncologist_email: oncologistEmail.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-modal overflow-y-auto">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-warmborder dark:border-darkbg-border mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-white">
                Date Pacientă & Situație Medicală
              </h3>
              <p className="text-[11px] text-ink-soft dark:text-gray-400">
                Configurează datele tale reale și situația clinică
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-cream-deep dark:bg-darkbg-card flex items-center justify-center text-ink-soft hover:text-ink dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Date Personale */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block">
              Nume și prenume:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Introdu numele tău..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>

          {/* Adresa ta de E-mail */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block">
              Adresa ta de e-mail:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: pacient@exemplu.ro"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>

          {/* 2. Situație Clinică & Diagnostic */}
          <div className="p-3.5 rounded-2xl bg-cream-deep/60 dark:bg-darkbg-card/60 border border-sage-100 dark:border-darkbg-border space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sage-800 dark:text-sage-300">
                Situație Clinică & Diagnostic
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block">
                Diagnostic / Histopatologie:
              </label>
              <input
                type="text"
                value={histology}
                onChange={(e) => setHistology(e.target.value)}
                placeholder="ex: Carcinom Ductal In Situ (DCIS)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block">
                Stadiu clinic:
              </label>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder="ex: Grad 0 (TisN0M0, G2)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>

            {/* Receptori hormonali */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-0.5">
                  Receptor ER:
                </label>
                <input
                  type="text"
                  value={erStatus}
                  onChange={(e) => setErStatus(e.target.value)}
                  placeholder="ex: Pozitiv (>90%)"
                  className="w-full px-2 py-1.5 rounded-lg text-[11px] bg-white dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-0.5">
                  Receptor PR:
                </label>
                <input
                  type="text"
                  value={prStatus}
                  onChange={(e) => setPrStatus(e.target.value)}
                  placeholder="ex: Pozitiv (>80%)"
                  className="w-full px-2 py-1.5 rounded-lg text-[11px] bg-white dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-0.5">
                  Status HER2:
                </label>
                <input
                  type="text"
                  value={her2Status}
                  onChange={(e) => setHer2Status(e.target.value)}
                  placeholder="ex: Negativ"
                  className="w-full px-2 py-1.5 rounded-lg text-[11px] bg-white dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Programare & Tratament */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">
                Ora administrării:
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">
                Stoc pastile în cutie:
              </label>
              <div className="relative">
                <Pill className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  value={stock}
                  placeholder="Număr pastile"
                  onChange={(e) => {
                    const val = e.target.value;
                    setStock(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                  }}
                  className="w-full pl-9 pr-2 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">
              Data de începere a Tamoxifenului:
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">
              E-mail medic oncolog (pentru rapoarte):
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-soft/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={oncologistEmail}
                onChange={(e) => setOncologistEmail(e.target.value)}
                placeholder="dr.oncolog@exemplu.ro"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-md shadow-sage-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profil Salvat!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvează Modificările</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* SOS Emergency Guide prominent button in Profile Modal */}
        <div className="mt-4 pt-3 border-t border-warmborder dark:border-darkbg-border">
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('navimed_open_red_flags'));
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
          >
            <span>🚨 Ghid Semnale de Alarmă & Urgențe (SOS)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
