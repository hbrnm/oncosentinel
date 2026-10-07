import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Clock, Pill, Sparkles, Flame, BatteryCharging, 
  Smile, ShieldAlert, AlertCircle, Calendar, RefreshCw, Wind, 
  Stethoscope, Heart, Bell, BellRing, Check, Activity, Dumbbell,
  ArrowRight, X, PhoneCall, ChevronRight, BookOpen, AlertOctagon, HeartHandshake
} from 'lucide-react';
import { PatientProfile, DoseLog } from '../types';
import { notificationsService } from '../lib/notifications';

interface DashboardTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onTakeDose: () => void;
  onSnoozeDose: () => void;
  onSaveQuickSymptom: (hotFlashes: number, energy: number, jointPain: number) => void;
  onOpenRedFlags: () => void;
  onOpenBreathing: () => void;
  onOpenDoctorVisit: () => void;
  onOpenGrounding: () => void;
  onOpenSupporter: () => void;
  onNavigateToRecipes?: (query?: string) => void;
  onNavigateToTab?: (tab: 'today' | 'timeline' | 'symptoms' | 'guide') => void;
}

export type MoodLevel = 'foarte_bine' | 'bine' | 'neutru' | 'rau' | 'foarte_rau';

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  doses,
  onTakeDose,
  onSnoozeDose,
  onSaveQuickSymptom,
  onOpenRedFlags,
  onOpenBreathing,
  onOpenDoctorVisit,
  onOpenGrounding,
  onOpenSupporter,
  onNavigateToRecipes,
  onNavigateToTab
}) => {
  const now = new Date();
  const currentHour = now.getHours();

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString(now);
  const todayDose = doses.find(d => {
    const dDate = d.taken_at ? new Date(d.taken_at) : new Date(d.scheduled_for);
    return getLocalDateString(dDate) === todayStr;
  });
  const isTakenToday = todayDose?.status === 'taken';

  // 1. Mood State (Persisted locally with date)
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(() => {
    const saved = localStorage.getItem('navimed_today_mood');
    const savedDate = localStorage.getItem('navimed_today_mood_date');
    if (saved && savedDate === todayStr) {
      return saved as MoodLevel;
    }
    return null;
  });

  const [moodMessage, setMoodMessage] = useState<string | null>(null);

  // 2. Control Date State (from localStorage or default)
  const [nextControlDate, setNextControlDate] = useState<string>(() => {
    return localStorage.getItem('navimed_next_control_date') || '2026-11-18';
  });

  // Calculate days until control normalized to midnight
  const targetDate = new Date(nextControlDate + 'T00:00:00');
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const diffMs = targetDate.getTime() - todayDate.getTime();
  const daysUntilControl = isNaN(diffMs) ? 0 : Math.ceil(diffMs / (1000 * 3600 * 24));
  const isUrgentControl = daysUntilControl >= 0 && daysUntilControl < 14;

  // 3. Inspiration Banner Visibility State (Conditional + 7 days dismiss)
  const [showInspirationBanner, setShowInspirationBanner] = useState<boolean>(() => {
    const dismissedUntil = localStorage.getItem('navimed_banner_dismissed_until');
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return false;
    }
    return true;
  });

  // 4. Contextual SOS FAB Visibility (Active on "foarte_rau" for 24h or manual dismiss)
  const [showSosFab, setShowSosFab] = useState<boolean>(() => {
    const sosUntil = localStorage.getItem('navimed_sos_visible_until');
    return Boolean(sosUntil && Number(sosUntil) > Date.now());
  });

  // Quick symptom states (preserved for test compatibility and full check-in)
  const [quickHotFlashes, setQuickHotFlashes] = useState<number>(0);
  const [quickEnergy, setQuickEnergy] = useState<number>(3);
  const [quickJoints, setQuickJoints] = useState<number>(0);
  const [symptomSavedNotice, setSymptomSavedNotice] = useState<boolean>(false);

  // Stock status
  const isLowStock = profile.pill_stock_count <= 7;

  // Handle Mood Selection
  const handleSelectMood = (mood: MoodLevel) => {
    setSelectedMood(mood);
    localStorage.setItem('navimed_today_mood', mood);
    localStorage.setItem('navimed_today_mood_date', todayStr);

    // Light haptic feedback if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(25); } catch (e) {}
    }

    // Contextual messages
    const messages: Record<MoodLevel, string> = {
      foarte_bine: 'Mă bucur că te simți bine. Continuă să ai grijă de tine!',
      bine: 'E în regulă să fie doar «bine». Fiecare pas contează.',
      neutru: 'Mulțumesc că ai notat. Rămâi atentă la corpul tău.',
      rau: 'E ok să nu fie ok. Ești văzută și sprijinită.',
      foarte_rau: 'Nu trebuie să treci prin asta singură. Ai resursele și apropiații alături.'
    };

    setMoodMessage(messages[mood]);
    setTimeout(() => {
      setMoodMessage(null);
    }, 4000);

    // If "foarte_rau", show SOS FAB for 24h
    if (mood === 'foarte_rau') {
      const until = Date.now() + 24 * 3600 * 1000;
      localStorage.setItem('navimed_sos_visible_until', until.toString());
      setShowSosFab(true);
    }
  };

  const handleDismissBanner = () => {
    const dismissedUntil = Date.now() + 7 * 24 * 3600 * 1000;
    localStorage.setItem('navimed_banner_dismissed_until', dismissedUntil.toString());
    setShowInspirationBanner(false);
  };

  const handleDismissSosFab = () => {
    localStorage.removeItem('navimed_sos_visible_until');
    setShowSosFab(false);
  };

  const handleTakeWithConfetti = () => {
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#7A9A8B', '#CA868C', '#D97746']
    });
    onTakeDose();
  };

  const handleSaveSymptoms = () => {
    onSaveQuickSymptom(quickHotFlashes, quickEnergy, quickJoints);
    setSymptomSavedNotice(true);
    setTimeout(() => setSymptomSavedNotice(false), 3000);
  };

  // Dynamic Greeting & Mood Title
  const patientFirstName = profile.full_name?.trim() ? profile.full_name.trim().split(' ')[0] : 'dragă';
  const greetingTime = currentHour < 12 ? 'Bună dimineața' : currentHour < 18 ? 'Bună ziua' : 'Bună seara';

  const moodSectionTitle = selectedMood
    ? 'Starea ta de azi'
    : currentHour < 17
    ? 'Cum te simți azi?'
    : 'Cum a fost ziua ta?';

  // Format Control Date in Romanian
  const formattedControlDate = new Date(nextControlDate).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-4 pb-24 animate-fade-in relative">

      {/* Top Empathetic Header Banner (Style faithfully inspired by mockup) */}
      <div className="pt-2 pb-1 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 dark:text-white tracking-tight leading-snug">
            {greetingTime}, <span className="text-sage-700 dark:text-sage-300">{patientFirstName}</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-normal leading-relaxed">
            Ești puternică. Pas cu pas. Ai grijă de tine.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-100 to-petal-100 dark:from-darkbg-card dark:to-darkbg-surface border border-sage-200/60 dark:border-darkbg-border flex items-center justify-center text-xl shadow-2xs shrink-0 select-none">
          🌸
        </div>
      </div>

      {/* Hero Card Tratament (Tamoxifen 20mg) */}
      <div className="bg-[#F2F7F4] dark:bg-darkbg-card rounded-3xl p-5 border border-sage-200/90 dark:border-darkbg-border shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isTakenToday 
                ? 'bg-sage-600 text-white shadow-xs' 
                : 'bg-white dark:bg-darkbg-surface text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-darkbg-border'
            }`}>
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sage-800 dark:text-sage-300 tracking-wider uppercase block">
                Tratament
              </span>
              <h2 className="text-base font-bold font-serif text-gray-900 dark:text-white leading-tight">
                Tamoxifen 20 mg
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                1 comprimat / zi • Ora: {profile.daily_reminder_time}
              </p>
            </div>
          </div>

          {/* Pill Badge */}
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
            isTakenToday 
              ? 'bg-sage-600 text-white border-sage-600 shadow-2xs' 
              : 'bg-white dark:bg-darkbg-surface text-amber-800 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/60'
          }`}>
            {isTakenToday ? '✓ Azi • Luat (Luat pentru azi)' : 'În așteptare'}
          </span>
        </div>

        {/* Action Button */}
        {isTakenToday ? (
          <div className="bg-white/80 dark:bg-darkbg-surface/80 border border-sage-200/70 dark:border-darkbg-border rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center space-x-2 text-sage-800 dark:text-sage-200 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-sage-600" />
              <span>Doza de azi este bifată cu succes!</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">Următoarea doză: Mâine la ora {profile.daily_reminder_time}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleTakeWithConfetti}
              className="py-3 px-4 min-h-[48px] rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bifat ca luat</span>
            </button>

            <button
              onClick={onSnoozeDose}
              className="py-3 px-4 min-h-[48px] rounded-2xl bg-white dark:bg-darkbg-surface hover:bg-gray-50 text-gray-700 dark:text-gray-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all border border-gray-200 dark:border-darkbg-border"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Amână 15 min</span>
            </button>
          </div>
        )}

        {/* Card Footer: Stock & Details */}
        <div className="mt-3 pt-2.5 border-t border-sage-200/60 dark:border-darkbg-border flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sage-600" />
            <span>Stoc rămas: <strong className="text-gray-800 dark:text-gray-200">{profile.pill_stock_count} pastile</strong></span>
          </span>
          <button
            onClick={() => onNavigateToTab?.('timeline')}
            className="text-sage-700 dark:text-sage-300 font-bold hover:underline flex items-center gap-0.5"
          >
            <span>Vezi detalii</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. Jurnal de Stare Emoțională (Cel mai proeminent conform cerinței #1) */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-sage-800 dark:text-sage-300 tracking-wider uppercase block">
              Jurnal de Stare
            </span>
            <h3 className="text-sm font-bold font-serif text-gray-900 dark:text-white">
              {moodSectionTitle}
            </h3>
          </div>
          {selectedMood && (
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              Înregistrat azi
            </span>
          )}
        </div>

        {/* 5 Emojis Selector (48px touch targets) */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { id: 'foarte_bine' as MoodLevel, emoji: '😊', label: 'Foarte bine' },
            { id: 'bine' as MoodLevel, emoji: '🙂', label: 'Bine' },
            { id: 'neutru' as MoodLevel, emoji: '😐', label: 'Neutru' },
            { id: 'rau' as MoodLevel, emoji: '🙁', label: 'Rău' },
            { id: 'foarte_rau' as MoodLevel, emoji: '😞', label: 'Foarte rău' },
          ].map((item) => {
            const isSelected = selectedMood === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectMood(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl min-h-[58px] transition-all transform active:scale-95 ${
                  isSelected
                    ? 'bg-sage-600 text-white shadow-sm scale-105'
                    : 'bg-[#F9FAF8] dark:bg-darkbg-card hover:bg-sage-50 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-darkbg-border'
                }`}
              >
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className={`text-[10px] mt-1 text-center font-medium leading-tight ${
                  isSelected ? 'text-white font-bold' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Empathetic contextual message with smooth appearance */}
        {moodMessage && (
          <div className="p-3 rounded-2xl bg-sage-50 dark:bg-sage-900/40 border border-sage-200/80 dark:border-sage-800/60 text-xs text-sage-900 dark:text-sage-200 font-medium animate-fade-in flex items-center justify-between">
            <span>{moodMessage}</span>
            <Sparkles className="w-3.5 h-3.5 text-sage-600 shrink-0" />
          </div>
        )}

        {/* Discret button if "Rău" or "Foarte rău" */}
        {(selectedMood === 'rau' || selectedMood === 'foarte_rau') && (
          <button
            type="button"
            onClick={onOpenSupporter}
            className="w-full py-2.5 px-3 rounded-2xl bg-petal-100 dark:bg-petal-900/40 hover:bg-petal-200 border border-petal-200 dark:border-petal-800/60 text-petal-900 dark:text-petal-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <HeartHandshake className="w-4 h-4 text-petal-700" />
            <span>Vreau să vorbesc cu cineva (Cercul de Sprijin) &rarr;</span>
          </button>
        )}
      </div>

      {/* 2. Card Dual: Următorul Control + Citat Empatic */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card Stânga: Următorul Control */}
        <div
          onClick={onOpenDoctorVisit}
          className={`cursor-pointer p-4 rounded-3xl border transition-all flex flex-col justify-between shadow-2xs ${
            isUrgentControl
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60'
              : 'bg-white dark:bg-darkbg-surface border-sage-100 dark:border-darkbg-border hover:border-sage-300'
          }`}
          title="Apasă pentru a vedea sau pregăti întrebările de control"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
                Următorul Control
              </span>
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
              {formattedControlDate}
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 font-medium">
              {daysUntilControl > 0 ? (
                <span className={isUrgentControl ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-sage-700 dark:text-sage-300'}>
                  peste {daysUntilControl} {daysUntilControl === 1 ? 'zi' : 'zile'}
                </span>
              ) : (
                <span className="text-rose-600 font-bold">Astăzi / În curs</span>
              )}
            </p>
          </div>
          <span className="text-[10px] text-gray-400 hover:text-sage-600 pt-2 flex items-center gap-0.5">
            Oncologie • Modifică &rarr;
          </span>
        </div>

        {/* Card Dreapta: Citat Empatic Roz-Pudrat */}
        <div className="bg-[#FAF2F2] dark:bg-darkbg-card p-4 rounded-3xl border border-petal-100 dark:border-darkbg-border flex flex-col justify-between shadow-2xs">
          <p className="text-xs font-serif text-gray-800 dark:text-gray-200 italic leading-relaxed">
            „Îngrijirea de sine nu este un lux, ci o parte din tratament.”
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-petal-700 dark:text-petal-300 font-medium">OncoSentinel</span>
            <span className="text-xs">🌿</span>
          </div>
        </div>
      </div>

      {/* 3. Resurse Utile – Row Orizontal Scrollabil */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Resurse de Liniște & Sprijin
          </h3>
          <span className="text-[10px] text-gray-400">Trage orizontal &rarr;</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
          {/* Card Ancorare 5-4-3-2-1 */}
          <div
            onClick={onOpenGrounding}
            className="cursor-pointer shrink-0 w-36 bg-white dark:bg-darkbg-surface p-3.5 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-2xs hover:border-sage-300 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-petal-100 dark:bg-petal-900/50 text-petal-700 dark:text-petal-300 flex items-center justify-center mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Ancorare 5-4-3-2-1
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Calmare senzorială</p>
            </div>
          </div>

          {/* Card Respirație Ghidată */}
          <div
            onClick={onOpenBreathing}
            className="cursor-pointer shrink-0 w-36 bg-white dark:bg-darkbg-surface p-3.5 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-2xs hover:border-sage-300 transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 flex items-center justify-center mb-2">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Respirație Ritm Paced
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Control bufeuri</p>
            </div>
          </div>

          {/* Card Cercul de Sprijin (Evidențiat dacă selectedMood === 'foarte_rau') */}
          <div
            onClick={onOpenSupporter}
            className={`cursor-pointer shrink-0 w-36 p-3.5 rounded-2xl shadow-2xs transition-all flex flex-col justify-between ${
              selectedMood === 'foarte_rau'
                ? 'bg-petal-50 dark:bg-darkbg-card border-2 border-petal-400 ring-2 ring-petal-200/50 animate-pulse'
                : 'bg-white dark:bg-darkbg-surface border border-sage-100 dark:border-darkbg-border hover:border-sage-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                Cercul de Sprijin
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Persoana dragă</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Maxim 2 Carduri Ghiduri / Noutăți + Buton „Vezi toate ghidurile” */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Ghiduri & Noutăți Clinice
          </h3>
          <button
            onClick={() => onNavigateToTab?.('guide')}
            className="text-[11px] font-bold text-sage-700 dark:text-sage-300 hover:underline flex items-center gap-0.5"
          >
            <span>Vezi toate ghidurile</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 1 Ghid: Tamoxifen & Nutriție */}
        <div
          onClick={() => onNavigateToTab?.('guide')}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F0F5F2] dark:bg-darkbg-card text-sage-700 dark:text-sage-300 flex items-center justify-center shrink-0 text-lg">
            🥦
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sage-700 dark:text-sage-300 uppercase">
              <span>Ghid Medical</span>
              <span>•</span>
              <span className="text-gray-400">Sursă: Ghid Clinic ASCO / NCCN</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
              Nutriție integrativă și metabolizarea estrogenilor
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              Cum susțin legumele crucifere (broccoli, varză) ficatul în timpul terapiei cu Tamoxifen.
            </p>
          </div>
        </div>

        {/* Card 2 Noutăți: Supraveghere DCIS */}
        <div
          onClick={() => onNavigateToTab?.('guide')}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
              <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200">
                Validat Clinic
              </span>
              <span className="text-gray-400">Octombrie 2026</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
              Recomandări actualizate de supraveghere mamografică
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              Protocolul de imagistică bilaterală la 6 luni după finalizarea radioterapiei pentru DCIS.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Banner de Inspirație (Condiționat: dacă starea este Rău/Foarte Rău sau rotativ) */}
      {showInspirationBanner && (
        <div className="bg-[#F5F8F6] dark:bg-darkbg-card p-4 rounded-3xl border border-sage-200/80 dark:border-darkbg-border relative flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-sage-200/80 dark:bg-sage-900/60 text-sage-700 flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div className="flex-1 pr-6">
            <p className="text-xs font-serif text-gray-800 dark:text-gray-200 italic leading-relaxed">
              „Nu ești doar un pacient. Ești o persoană cu o viață întreagă în față.”
            </p>
            <span className="text-[10px] text-sage-600 dark:text-sage-400 font-medium block mt-1">
              Curaj și răbdare pentru ziua de azi.
            </span>
          </div>
          <button
            type="button"
            onClick={handleDismissBanner}
            title="Închide pentru 7 zile"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6. Buton Semnale de Alarmă / Red Flags Ghid Rapid */}
      <button
        onClick={onOpenRedFlags}
        className="w-full py-3.5 px-4 rounded-3xl bg-rose-50/90 dark:bg-darkbg-card hover:bg-rose-100 dark:hover:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/50 text-xs font-medium flex items-center justify-between transition-all shadow-xs"
      >
        <span className="flex items-center gap-2 text-rose-950 dark:text-rose-100 font-semibold text-left">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Ghid rapid: Când trebuie să suni medicul de urgență?</span>
        </span>
        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-xl shrink-0">
          Deschide &rarr;
        </span>
      </button>

      {/* 7. Quick Symptom Check-in (Păstrat compact în card dedicat pentru flexibilitate & teste) */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-4 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-sage-600" />
            <span>Check-in Fizic Rapid (60 secunde)</span>
          </span>
          <button
            onClick={handleSaveSymptoms}
            className="text-[10px] font-bold bg-sage-500 hover:bg-sage-600 text-white px-2.5 py-1 rounded-xl transition-all"
          >
            Salvează
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Energy level */}
          <div>
            <span className="text-[11px] text-gray-500 block mb-1 flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-sage-600" /> Nivel de Energie
            </span>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setQuickEnergy(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-semibold ${
                    quickEnergy === lvl
                      ? 'bg-sage-600 text-white'
                      : 'bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Hot flashes intensity */}
          <div>
            <span className="text-[11px] text-gray-500 block mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-600" /> Bufeuri
            </span>
            <div className="grid grid-cols-6 gap-1">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setQuickHotFlashes(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-semibold ${
                    quickHotFlashes === lvl
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {symptomSavedNotice && (
          <p className="text-[11px] text-emerald-700 font-semibold text-center animate-fade-in">
            ✓ Check-in-ul fizic a fost notat!
          </p>
        )}

        {/* Dynamic Recipe recommendation when low energy */}
        {quickEnergy <= 2 && (
          <div 
            onClick={() => onNavigateToRecipes?.('energie')}
            className="cursor-pointer p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between text-xs hover:border-emerald-300 transition-all animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🥤</span>
              <div>
                <p className="font-bold text-emerald-950 dark:text-emerald-100 text-[11px]">Recomandare pentru energie:</p>
                <p className="text-emerald-800 dark:text-emerald-300 text-[10px]">Smoothie „Energie Curată” cu cacao pură & in</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">Vezi rețeta &rarr;</span>
          </div>
        )}
      </div>

      {/* 8. Contextual Floating Action Button (FAB) SOS */}
      {showSosFab && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-1.5 animate-bounce">
          <button
            onClick={onOpenRedFlags}
            className="py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS Urgențe</span>
          </button>
          <button
            onClick={handleDismissSosFab}
            className="w-7 h-7 rounded-full bg-white dark:bg-darkbg-surface text-gray-500 shadow border border-gray-200 flex items-center justify-center text-xs"
            title="Închide SOS"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
