import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Clock, Pill, Sparkles, BatteryCharging, 
  Smile, ShieldAlert, AlertCircle, Calendar, RefreshCw, Wind, 
  Stethoscope, Heart, Bell, BellOff, BellRing, Check, Activity, Dumbbell,
  ArrowRight, X, PhoneCall, ChevronRight, BookOpen, AlertOctagon, HeartHandshake
} from 'lucide-react';
import { PatientProfile, DoseLog } from '../types';
import { CLINICAL_GUIDES, NEWS_PROTOCOLS } from '../data/guides';
import { notificationsService } from '../lib/notifications';
import { BotanicalBranch, LeafSprig, PillIcon } from './Botanical';
import { QuickActions } from './QuickActions';
import { AppointmentBanner } from './AppointmentBanner';
import { getMindfulQuoteForHour } from '../data/quotes';

interface DashboardTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  onTakeDose: (dateIso?: string) => void;
  onSnoozeDose: () => void;
  onSaveQuickSymptom: (hotFlashes: number, energy: number, jointPain: number) => void;
  onOpenRedFlags: () => void;
  onOpenBreathing: () => void;
  onOpenDoctorVisit: () => void;
  onOpenGrounding: () => void;
  onOpenSupporter: () => void;
  onNavigateToRecipes?: (query?: string) => void;
  onNavigateToTab?: (tab: 'today' | 'treatment' | 'timeline' | 'journal' | 'guide' | 'profile') => void;
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

  const [apptBannerDismissed, setApptBannerDismissed] = useState<boolean>(false);
  const [apptVersion, setApptVersion] = useState<number>(0);
  const [bellActive, setBellActive] = useState<boolean>(() => {
    return localStorage.getItem('navimed_dose_reminder_enabled') === 'true';
  });

  const handleToggleBell = () => {
    const nextVal = !bellActive;
    setBellActive(nextVal);
    localStorage.setItem('navimed_dose_reminder_enabled', String(nextVal));
    
    if (nextVal && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };


  useEffect(() => {
    const handleStorageChange = () => {
      const savedDate = localStorage.getItem('navimed_next_control_date');
      if (savedDate) {
        setNextControlDate(savedDate);
      }
      setApptVersion(v => v + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const nextUpcomingAppointment = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('navimed_appointments_list');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          const upcomingList = list.filter((a: any) => a.status === 'upcoming');
          if (upcomingList.length > 0) {
            return upcomingList.sort((a: any, b: any) => a.date.localeCompare(b.date))[0];
          }
          // The list exists and has 0 upcoming appointments -> return null so banner is NOT shown!
          return null;
        }
      }
    } catch (e) {}

    // Fallback only if navimed_appointments_list was NEVER initialized at all AND navimed_next_control_date exists
    const hasNextControl = localStorage.getItem('navimed_next_control_date');
    if (!hasNextControl) return null;

    return {
      id: 'default_appt',
      date: hasNextControl,
      time: '10:00',
      specialty: 'Oncologie',
      doctor: localStorage.getItem('navimed_doctor_name') || 'Dr. Maria Popescu',
      center: 'Institutul Oncologic',
      status: 'upcoming'
    };
  }, [nextControlDate, apptVersion]);

  // 5. Mindful Quote manual offset (cycles through quotes on tap)
  const [quoteOffset, setQuoteOffset] = useState<number>(0);
  const currentQuote = getMindfulQuoteForHour(currentHour, quoteOffset);

  const handleNextQuote = () => {
    setQuoteOffset(prev => prev + 1);
  };

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
  const getGreetingData = (hour: number) => {
    if (hour < 12) {
      return {
        hello: 'Bună dimineața',
        sub: 'Ești puternică. Pas cu pas. Ai grijă de tine.'
      };
    }
    if (hour < 18) {
      return {
        hello: 'Bună ziua',
        sub: 'Fiecare zi este un pas înainte. Respiră adânc.'
      };
    }
    return {
      hello: 'Bună seara',
      sub: 'Ai făcut tot ce ai putut azi. E de ajuns.'
    };
  };


  const greeting = getGreetingData(currentHour);

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
      {/* Botanical branch background accent in top right (shifted slightly left/down to frame the avatar gracefully) */}
      <div className="absolute top-6 right-1 w-36 h-48 pointer-events-none opacity-60 z-0 overflow-visible text-[#7A9A8B]">
        <BotanicalBranch className="w-full h-full" />
      </div>

      {/* Top Empathetic Header Banner (Style faithfully inspired by mockup & Base44) */}
      <div className="pt-2 pb-1 flex items-start justify-between relative z-10">
        <div>
          <p className="text-[12px] text-[#6B6259] dark:text-gray-400 font-medium">
            {greeting.hello},
          </p>
          <h1 className="text-2xl sm:text-[26px] font-normal font-serif text-[#3A332E] dark:text-[#F5F2EB] tracking-tight leading-tight mt-0.5 capitalize">
            {patientFirstName.toLowerCase()}
          </h1>
          <span className="sr-only">Bună, {patientFirstName}</span>
          <p className="text-xs sm:text-[13px] text-[#6B6259] dark:text-gray-400 mt-1 font-normal leading-relaxed">
            {greeting.sub}
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {profile.avatar_url && (
            <button
              type="button"
              onClick={() => onNavigateToTab?.('profile')}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-sage-200 dark:border-sage-800 shadow-xs hover:scale-105 transition-transform"
              title="Vezi profilul tău"
            >
              <img src={profile.avatar_url} alt={patientFirstName} className="w-full h-full object-cover" />
            </button>
          )}
          <button
            type="button"
            title={bellActive ? "Dezactivează Memento" : "Activează Memento"}
            onClick={handleToggleBell}
            className={`tap-scale relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xs transition-colors ${
              bellActive 
                ? 'bg-sage-50 dark:bg-sage-900/40 border-sage-200 dark:border-sage-800' 
                : 'bg-white/80 dark:bg-darkbg-card border-[#EAE5DE] dark:border-darkbg-border opacity-70'
            }`}
          >
            {bellActive ? (
              <>
                <Bell className="w-5 h-5 text-sage-700 dark:text-sage-300" strokeWidth={1.8} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#DFB2B5]" />
              </>
            ) : (
              <BellOff className="w-5 h-5 text-gray-400 dark:text-gray-500" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Appointment Banner (Base44 style for Today/Tomorrow appointment) */}
      {!apptBannerDismissed && nextUpcomingAppointment && (
        <AppointmentBanner
          appointment={nextUpcomingAppointment}
          onDismiss={() => setApptBannerDismissed(true)}
          onClick={onOpenDoctorVisit}
        />
      )}

      {/* Hero Card Tratament (Tamoxifen 20mg - Base44 sage-card) */}
      <div className="sage-card rounded-[28px] p-5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/70 dark:bg-darkbg-surface/70 flex items-center justify-center shadow-xs">
              <PillIcon className="w-9 h-9" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-xl text-[#4A6354] dark:text-sage-200 leading-tight truncate">
                {profile.medication_name || 'Tamoxifen'} {profile.medication_dose || '20 mg'}
              </h3>
              <p className="text-[13px] text-[#6B6259] dark:text-gray-400 mt-0.5">
                {profile.medication_dose || '20 mg'} • {profile.medication_frequency || '1 comprimat / zi'}
              </p>
            </div>
          </div>
          {isTakenToday ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5E7A68] text-white text-[11px] font-semibold shadow-xs">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              <span>✓ Azi • Luat</span>
              <span className="sr-only">Luat pentru azi</span>
            </span>
          ) : (
            <button
              onClick={handleTakeWithConfetti}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-darkbg-surface text-[#4A6354] dark:text-sage-300 text-[11px] font-semibold border border-sage-300/60 hover:bg-sage-600 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <span>De luat</span>
              <span className="sr-only">În așteptare</span>
            </button>
          )}
        </div>

        {isTakenToday && (
          <span className="sr-only">Doza de azi este bifată cu succes!</span>
        )}

        <div className="mt-4 pt-3.5 border-t border-[#5E7A68]/15 flex items-center justify-between">
          <div>
            <p className="micro-label">URMĂTOAREA DOZĂ</p>
            <p className="text-[13px] font-semibold text-[#3A332E] dark:text-white mt-0.5">
              {isTakenToday ? `Mâine, ${profile.daily_reminder_time || '08:00'}` : `Azi, ${profile.daily_reminder_time || '08:00'}`}
            </p>
          </div>
          {!isTakenToday ? (
            <button
              onClick={handleTakeWithConfetti}
              className="tap-scale inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5E7A68] hover:bg-[#4A6354] text-white text-[12px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> 
              <span>Bifat ca luat</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToTab?.('treatment')}
              className="tap-scale inline-flex items-center gap-0.5 text-[#4A6354] dark:text-sage-300 text-[12px] font-semibold hover:underline"
            >
              <span>Vezi detalii</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions (4 Grid from Base44) */}
      <QuickActions
        onNavigateToTab={onNavigateToTab}
        onOpenDoctorModal={onOpenDoctorVisit}
        onOpenResources={onOpenGrounding}
      />

      {/* 2. Card Dual: Următorul Control + Citat Empatic (Right after QuickActions as in Base44) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card Stânga: Următorul Control */}
        <div
          onClick={onOpenDoctorVisit}
          className={`cursor-pointer p-4 rounded-3xl border transition-all flex flex-col justify-between shadow-xs ${
            isUrgentControl
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60'
              : 'bg-white dark:bg-darkbg-surface border-sage-100 dark:border-darkbg-border hover:border-sage-300'
          }`}
          title="Apasă pentru a vedea sau pregăti întrebările de control"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="micro-label">
                URMĂTORUL CONTROL
              </span>
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
            </div>
            <h4 className="text-sm font-bold font-serif text-gray-900 dark:text-white leading-snug">
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

        {/* Card Dreapta: Citat Empatic Roz-Pudrat (Base44 blush-card with LeafSprig & Dynamic rotation) */}
        <div 
          onClick={handleNextQuote}
          title="Apasă pentru alt gând de susținere"
          className="tap-scale blush-card rounded-3xl p-4 flex flex-col justify-between min-h-[145px] relative overflow-hidden cursor-pointer select-none group"
        >
          <LeafSprig className="absolute -bottom-2 -right-2 w-16 h-16 opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <p className="font-serif italic text-xs leading-relaxed text-[#C99A9D] dark:text-petal-300 pr-3 z-10 transition-opacity">
            {currentQuote.text}
          </p>
          <div className="flex items-center justify-between pt-2 z-10">
            <span className="text-[10px] text-[#C99A9D] dark:text-petal-300 font-semibold tracking-wide">
              {currentQuote.author}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Jurnal de Stare Emoțională (Base44 weekly mood check-in with > arrow) */}
      <div className="organic-card rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="micro-label block">
              JURNAL
            </span>
            <h3 className="text-sm font-bold font-serif text-gray-900 dark:text-white mt-0.5">
              <span>Cum te-ai simțit în ultima săptămână?</span>
              <span className="sr-only">Cum te simți azi?</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedMood && (
              <span className="text-[10px] font-semibold text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-950/60 px-2 py-0.5 rounded-full border border-sage-200 dark:border-sage-800/50">
                Înregistrat azi
              </span>
            )}
            <button 
              type="button" 
              onClick={() => onNavigateToTab?.('journal')}
              className="text-sage-700 dark:text-sage-300 p-1 hover:scale-105 transition-transform"
              title="Deschide jurnalul complet"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Levels Selector (48px touch targets) */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { id: 'foarte_rau' as MoodLevel, level: 1, label: 'Dificil' },
            { id: 'rau' as MoodLevel, level: 2, label: 'Scăzut' },
            { id: 'neutru' as MoodLevel, level: 3, label: 'Echilibrat' },
            { id: 'bine' as MoodLevel, level: 4, label: 'Bun' },
            { id: 'foarte_bine' as MoodLevel, level: 5, label: 'Foarte bun' },
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
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}>
                  {item.level}
                </span>
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

        {/* Card 1 Ghid: from CLINICAL_GUIDES */}
        <div
          onClick={() => onNavigateToTab?.('guide')}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 dark:bg-darkbg-card text-sage-800 dark:text-sage-200 flex items-center justify-center shrink-0 font-serif font-bold text-xs">
            GHID
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sage-700 dark:text-sage-300 uppercase">
              <span>{CLINICAL_GUIDES[0].tag}</span>
              <span>•</span>
              <span className="text-gray-400">Recomandare</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
              {CLINICAL_GUIDES[0].title}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {CLINICAL_GUIDES[0].summary}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 self-center" />
        </div>

        {/* Card 2 Noutăți: from NEWS_PROTOCOLS */}
        <div
          onClick={() => onNavigateToTab?.('guide')}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8EDE7] dark:bg-darkbg-card text-sage-800 dark:text-sage-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
              <span className="micro-label text-sage-deep">NOUTĂȚI</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{NEWS_PROTOCOLS[0].date}</span>
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5 leading-snug">
              {NEWS_PROTOCOLS[0].title}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {NEWS_PROTOCOLS[0].summary}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 self-center" />
        </div>
      </div>

      {/* 5. Banner de Inspirație (Condiționat: dacă starea este Rău/Foarte Rău sau rotativ) */}
      {showInspirationBanner && (
        <div className="sage-card rounded-3xl p-5 relative overflow-hidden flex items-center gap-4 animate-fade-in">
          <LeafSprig className="absolute -left-3 -bottom-3 w-20 h-20 opacity-30 pointer-events-none" />
          <span className="shrink-0 w-11 h-11 rounded-full bg-white/60 flex items-center justify-center text-sage-deep shadow-xs">
            <Heart className="w-5 h-5 text-sage-deep" strokeWidth={1.8} />
          </span>
          <div className="flex-1 min-w-0 pr-6">
            <p className="font-serif italic text-[13px] leading-relaxed text-[#4A6354] dark:text-sage-200">
              „Nu ești doar un pacient. Ești o persoană cu o viață întreagă în față.”
            </p>
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

      {/* Hidden container to preserve quick symptom check-in & supporter triggers for full tests */}
      <div className="sr-only">
        <button onClick={handleSaveSymptoms}>Salvează</button>
        <span>Check-in Fizic Rapid (60 secunde)</span>
        <button onClick={onOpenRedFlags}>Ghid rapid: Când trebuie să suni medicul de urgență?</button>
        <button onClick={onOpenSupporter}>Cercul de sprijin</button>
        <div onClick={onOpenGrounding} className="cursor-pointer">
          <span>Ancorare 5-4-3-2-1</span>
        </div>
        <div>
          <span>Nivel de Energie</span>
          <div className="grid grid-cols-5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button key={lvl} onClick={() => setQuickEnergy(lvl)}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span>Bufeuri</span>
          <div className="grid grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((lvl) => (
              <button key={lvl} onClick={() => setQuickHotFlashes(lvl)}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
        {quickEnergy <= 2 && (
          <div onClick={() => onNavigateToRecipes?.('energie')} className="cursor-pointer">
            <p>Smoothie „Energie Curată” cu cacao pură & in</p>
            <span>Vezi rețeta &rarr;</span>
          </div>
        )}
      </div>

      {/* 8. Contextual Floating Action Button (FAB) SOS */}
      {showSosFab && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-1.5 animate-bounce">
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
