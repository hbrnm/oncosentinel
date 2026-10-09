import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles, Calendar, Heart, Check, ArrowRight, X, PhoneCall, ChevronRight, BookOpen, HeartHandshake, CalendarHeart, ShieldCheck, Pill
} from 'lucide-react';
import { PatientProfile, DoseLog, SymptomLog } from '../types';
import { CLINICAL_GUIDES, NEWS_PROTOCOLS } from '../data/guides';
import { BotanicalBranch, LeafSprig, PillIcon } from './Botanical';
import { QuickActions } from './QuickActions';
import { controlSupportText } from '../data/comfort';
import { nextVictory, treatmentJourneyText } from '../lib/summary';
import { shouldRemindBackup, lastBackupText, snoozeBackupReminder } from '../lib/backupReminder';
import { shouldRemindStock, snoozeStockReminder, clearStockSnooze, lowStockText, addedPillsText, safeStock, MAX_BOX } from '../lib/pillStock';
import { AppointmentBanner } from './AppointmentBanner';
import { getMindfulQuoteForHour } from '../data/quotes';
import { moodLevelFromState } from '../lib/mood';
import { useBackToClose } from '../lib/backNavigation';
import { clickable } from '../lib/clickable';

interface DashboardTabProps {
  profile: PatientProfile;
  doses: DoseLog[];
  symptoms?: SymptomLog[];
  onTakeDose: (dateIso?: string) => void;
  onOpenRedFlags: () => void;
  onOpenBreathing: () => void;
  onOpenDoctorVisit: () => void;
  onOpenGrounding: () => void;
  onOpenSupporter: () => void;
  onOpenHelp?: () => void;
  onOpenDataSafety?: () => void;
  /** „Am o cutie nouă”: adaugă pastilele la stoc; false dacă salvarea n-a reușit */
  onAddPills?: (count: number) => boolean;
  /** Starea aleasă aici se salvează ca nota de azi din Jurnal (treapta 1–5) */
  onSaveMood?: (level: number) => void;
  onNavigateToTab?: (tab: 'today' | 'treatment' | 'timeline' | 'journal' | 'guide' | 'profile') => void;
}

export type MoodLevel = 'foarte_bine' | 'bine' | 'neutru' | 'rau' | 'foarte_rau';

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  doses,
  symptoms = [],
  onTakeDose,
  onOpenRedFlags,
  onOpenBreathing,
  onOpenDoctorVisit,
  onOpenGrounding,
  onOpenSupporter,
  onOpenHelp,
  onOpenDataSafety,
  onAddPills,
  onSaveMood,
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

  // 1. Starea de azi vine din nota de azi din Jurnal (o alegere de aici o salvează acolo)
  const MOOD_IDS: MoodLevel[] = ['foarte_rau', 'rau', 'neutru', 'bine', 'foarte_bine'];
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(() => {
    const todayNote = symptoms.find(s => s.kind !== 'symptoms' && s.mood_state && getLocalDateString(new Date(s.logged_at)) === todayStr);
    return todayNote ? MOOD_IDS[moodLevelFromState(todayNote.mood_state) - 1] : null;
  });

  const [moodMessage, setMoodMessage] = useState<string | null>(null);

  // 2. Control Date State (from localStorage or default)
  const [nextControlDate, setNextControlDate] = useState<string>(() => {
    return localStorage.getItem('navimed_next_control_date') || '';
  });

  // „O mică victorie”: pragurile văzute se țin minte pe dispozitiv
  const [seenVictories, setSeenVictories] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('oncosentinel_victories_seen') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const victory = nextVictory(doses, symptoms, seenVictories);

  // Copia amintită: se recalculează la fiecare afișare, ca să dispară după o copie făcută din „Siguranța datelor”
  const [, setBackupSnoozed] = useState(0);
  const showBackupReminder = !!onOpenDataSafety && shouldRemindBackup(doses, symptoms);
  const handleSnoozeBackup = () => {
    snoozeBackupReminder();
    setBackupSnoozed(n => n + 1);
  };

  // Pastilele se termină: cardul apare la 7 pastile sau mai puțin; „Mai târziu” îl ascunde 2 zile
  const [, setStockSnoozed] = useState(0);
  const [addingPills, setAddingPills] = useState(false);
  const [newBoxCount, setNewBoxCount] = useState('30');
  const [stockMessage, setStockMessage] = useState<string | null>(null);
  useBackToClose(addingPills, () => setAddingPills(false));
  const stock = safeStock(profile.pill_stock_count);
  const showStockReminder = !!onAddPills && shouldRemindStock(stock);
  // Confirmarea dispare la următoarea doză marcată
  useEffect(() => setStockMessage(null), [doses.length]);
  const handleSnoozeStock = () => {
    snoozeStockReminder();
    setStockSnoozed(n => n + 1);
  };
  const handleAddPills = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(newBoxCount);
    if (!onAddPills || !Number.isInteger(count) || count < 1 || count > MAX_BOX) return;
    if (!onAddPills(count)) return;
    clearStockSnooze();
    setStockMessage(addedPillsText(count, stock + count));
    setAddingPills(false);
  };
  const handleThanksVictory = () => {
    if (!victory) return;
    const updated = [...new Set([...seenVictories, ...victory.reachedIds])];
    setSeenVictories(updated);
    localStorage.setItem('oncosentinel_victories_seen', JSON.stringify(updated));
  };

  // Calculate days until control normalized to midnight
  const targetDate = new Date(nextControlDate + 'T00:00:00');
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const diffMs = targetDate.getTime() - todayDate.getTime();
  // Rotunjit, nu în sus: la schimbarea orei (octombrie, martie) o zi are 23 sau 25 de ore
  const daysUntilControl = isNaN(diffMs) ? 0 : Math.round(diffMs / (1000 * 3600 * 24));
  const isUrgentControl = Boolean(nextControlDate) && daysUntilControl >= 0 && daysUntilControl < 14;

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
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  // Doar după bifarea de acum: animația nu rulează la fiecare deschidere a paginii
  const [justTaken, setJustTaken] = useState(false);
  useBackToClose(showPhotoModal, () => setShowPhotoModal(false));


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
      specialty: 'Oncologie',
      doctor: localStorage.getItem('navimed_doctor_name') || undefined,
      status: 'upcoming'
    };
  }, [nextControlDate, apptVersion]);

  // 5. Mindful Quote manual offset (cycles through quotes on tap)
  const [quoteOffset, setQuoteOffset] = useState<number>(0);
  const currentQuote = getMindfulQuoteForHour(currentHour, quoteOffset);

  const handleNextQuote = () => {
    setQuoteOffset(prev => prev + 1);
  };


  // Handle Mood Selection
  const handleSelectMood = (mood: MoodLevel) => {
    setSelectedMood(mood);
    localStorage.setItem('navimed_today_mood', mood);
    onSaveMood?.(MOOD_IDS.indexOf(mood) + 1);
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
      // canvas-confetti cere culori literale: sage-light, petal-500, peach-600
      colors: ['#7A9A8B', '#CA868C', '#D97746'],
      disableForReducedMotion: true
    });
    setJustTaken(true);
    onTakeDose();
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
  const journeyText = treatmentJourneyText(profile.tamoxifen_start_date || '', now);

  // Format Control Date in Romanian
  const formattedControlDate = new Date(nextControlDate).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-4 animate-cascade relative">
      {/* Botanical branch background accent in top right (shifted slightly left/down to frame the avatar gracefully) */}
      <div className="absolute top-6 right-1 w-36 h-48 pointer-events-none opacity-60 z-0 overflow-visible text-sage-light">
        <BotanicalBranch className="w-full h-full animate-sway" />
      </div>

      {/* Top Empathetic Header Banner (Style faithfully inspired by mockup & Base44) */}
      <div className="pt-2 pb-1 flex items-start justify-between relative z-10">
        <div>
          <p className="text-[12px] text-ink-soft dark:text-gray-400 font-medium">
            {greeting.hello},
          </p>
          <h1 className="text-2xl sm:text-[26px] font-normal font-serif text-ink dark:text-cream-deep tracking-tight leading-tight mt-0.5 capitalize">
            {patientFirstName.toLowerCase()}
          </h1>
          <span className="sr-only">Bună, {patientFirstName}</span>
          <p className="text-xs sm:text-[13px] text-ink-soft dark:text-gray-400 mt-1 font-normal leading-relaxed">
            {greeting.sub}
          </p>
          {journeyText && (
            <p className="text-xs sm:text-[13px] text-sage-700 dark:text-sage-300 mt-1 font-medium leading-relaxed">
              {journeyText}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {profile.avatar_url && (
            <button
              type="button"
              onClick={() => setShowPhotoModal(true)}
              className="w-11 h-11 rounded-full overflow-hidden border-2 border-sage-200 dark:border-sage-800 shadow-xs hover:scale-105 transition-transform cursor-pointer"
              title="Apasă pentru a mări fotografia sau a deschide profilul"
            >
              <img src={profile.avatar_url} alt={patientFirstName} className="w-full h-full object-cover" />
            </button>
          )}
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

      {/* Sprijin înaintea controlului: cu 3 zile înainte și în ziua controlului */}
      {nextControlDate && daysUntilControl >= 0 && daysUntilControl <= 3 && (
        <section aria-label="Sprijin înaintea controlului" className="rounded-[28px] p-5 bg-blush dark:bg-petal-950/30 border border-petal-100 dark:border-petal-900/30">
          <h2 className="font-serif text-lg text-ink dark:text-white flex items-center gap-2">
            <CalendarHeart className="w-5 h-5 text-blush-deep" />
            {controlSupportText(daysUntilControl).title}
          </h2>
          <p className="text-[13px] text-ink-soft dark:text-gray-300 mt-1.5 leading-relaxed">{controlSupportText(daysUntilControl).text}</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button type="button" onClick={onOpenDoctorVisit} className="tap-scale py-2.5 px-2 rounded-2xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-[12px] font-semibold text-ink dark:text-gray-100">
              Întrebările pentru medic
            </button>
            <button type="button" onClick={onOpenBreathing} className="tap-scale py-2.5 px-2 rounded-2xl bg-sage-deep text-white text-[12px] font-semibold">
              Un moment de liniște
            </button>
          </div>
        </section>
      )}

      {showBackupReminder && (
        <section aria-label="O copie pentru liniștea ta" className="rounded-[28px] p-5 bg-sage-soft dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/40 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sage-deep dark:text-sage-300 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h2 className="micro-label text-sage-deep dark:text-sage-300">O copie pentru liniștea ta</h2>
            <p className="text-[14px] text-ink dark:text-white mt-1 leading-relaxed">
              Datele tale stau doar pe acest telefon. {lastBackupText()}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={onOpenDataSafety} className="tap-scale px-4 py-2 rounded-xl bg-sage-deep text-white text-xs font-semibold">
                Fac copia acum
              </button>
              <button type="button" onClick={handleSnoozeBackup} className="tap-scale px-4 py-2 rounded-xl border border-sage-200 dark:border-sage-800/60 text-sage-deep dark:text-sage-300 text-xs font-semibold">
                Mai târziu
              </button>
            </div>
          </div>
        </section>
      )}

      {showStockReminder && (
        <section aria-label="Pastilele se termină curând" className="rounded-[28px] p-5 bg-sage-soft dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/40 flex items-start gap-3">
          <Pill className="w-5 h-5 text-sage-deep dark:text-sage-300 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h2 className="micro-label text-sage-deep dark:text-sage-300">Pastilele se termină curând</h2>
            <p className="text-[14px] text-ink dark:text-white mt-1 leading-relaxed">
              {lowStockText(stock, profile.medication_name || 'Tamoxifen')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { setNewBoxCount('30'); setAddingPills(true); }} className="tap-scale px-4 py-2 rounded-xl bg-sage-deep text-white text-xs font-semibold">
                Am o cutie nouă
              </button>
              <button type="button" onClick={handleSnoozeStock} className="tap-scale px-4 py-2 rounded-xl border border-sage-200 dark:border-sage-800/60 text-sage-deep dark:text-sage-300 text-xs font-semibold">
                Mai târziu
              </button>
            </div>
          </div>
        </section>
      )}

      {stockMessage && (
        <p role="status" className="rounded-2xl px-4 py-3 bg-sage-soft dark:bg-sage-900/30 text-[13px] text-sage-deep dark:text-sage-300 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" /> {stockMessage}
        </p>
      )}

      {addingPills && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-modal">
          <form role="dialog" aria-labelledby="new-box-title" onSubmit={handleAddPills} className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl">
            <label id="new-box-title" htmlFor="new-box-count" className="block font-serif text-lg text-ink dark:text-white mb-3">
              Câte pastile are cutia nouă?
            </label>
            <input
              id="new-box-count"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_BOX}
              step={1}
              value={newBoxCount}
              onChange={(e) => setNewBoxCount(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage"
              required
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button type="button" onClick={() => setAddingPills(false)} className="px-4 py-2 rounded-xl text-[13px] font-medium text-ink-soft dark:text-gray-300 hover:bg-cream-deep dark:hover:bg-darkbg-card">
                Anulează
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-sage hover:bg-sage-deep text-white shadow-xs">
                Adaugă
              </button>
            </div>
          </form>
        </div>
      )}

      {victory && (
        <section aria-label="O mică victorie" className="rounded-[28px] p-5 bg-sage-soft dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/40 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sage-deep dark:text-sage-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="micro-label text-sage-deep dark:text-sage-300">O mică victorie</h2>
            <p className="text-[14px] text-ink dark:text-white mt-1 leading-relaxed">{victory.text}</p>
            <button type="button" onClick={handleThanksVictory} className="tap-scale mt-3 px-4 py-2 rounded-xl bg-sage-deep text-white text-xs font-semibold">
              Mulțumesc
            </button>
          </div>
        </section>
      )}

      {/* Hero Card Tratament (Tamoxifen 20mg - Base44 sage-card) */}
      <div className="sage-card rounded-[28px] p-5 relative overflow-hidden">
        {/* Cu litere mari, eticheta trece sub nume, ca numele să nu se rupă */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/70 dark:bg-darkbg-surface/70 flex items-center justify-center shadow-xs">
              <PillIcon className="w-9 h-9" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-sage-deep dark:text-sage-200 leading-tight break-words">
                {profile.medication_name || 'Tamoxifen'}
              </h2>
              <p className="text-[13px] text-ink-soft dark:text-gray-400 mt-0.5">
                {profile.medication_dose || '20 mg'} • {profile.medication_frequency || '1 comprimat / zi'}
              </p>
            </div>
          </div>
          {isTakenToday ? (
            <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage text-white text-[11px] font-semibold shadow-xs ${justTaken ? 'animate-pop' : ''}`}>
              <Check className={`w-3.5 h-3.5 ${justTaken ? 'animate-draw-check' : ''}`} strokeWidth={3} />
              <span>Luat azi</span>
            </span>
          ) : (
            <button
              onClick={handleTakeWithConfetti}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-darkbg-surface text-sage-deep dark:text-sage-300 text-[11px] font-semibold border border-sage-300/60 hover:bg-sage-600 hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <span>De luat</span>
              <span className="sr-only">În așteptare</span>
            </button>
          )}
        </div>

        {isTakenToday && (
          <span className="sr-only">Doza de azi este bifată cu succes!</span>
        )}

        <div className="mt-4 pt-3.5 border-t border-sage/15 flex items-center justify-between">
          <div>
            <p className="micro-label">URMĂTOAREA DOZĂ</p>
            <p className="text-[13px] font-semibold text-ink dark:text-white mt-0.5">
              {isTakenToday ? `Mâine, ${profile.daily_reminder_time || '08:00'}` : `Azi, ${profile.daily_reminder_time || '08:00'}`}
            </p>
          </div>
          {!isTakenToday ? (
            <button
              onClick={handleTakeWithConfetti}
              className="tap-scale inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sage hover:bg-sage-deep text-white text-[12px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> 
              <span>Bifat ca luat</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToTab?.('treatment')}
              className="tap-scale inline-flex items-center gap-0.5 text-sage-deep dark:text-sage-300 text-[12px] font-semibold hover:underline"
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
        onOpenHelp={onOpenHelp}
      />

      {/* 2. Card Dual: Următorul Control + Citat Empatic (Right after QuickActions as in Base44) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card Stânga: Următorul Control */}
        <div
          {...clickable(onOpenDoctorVisit)}
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
            <h3 className="text-sm font-bold font-serif text-ink dark:text-white leading-snug">
              {nextControlDate ? formattedControlDate : 'Nicio dată setată'}
            </h3>
            <p className="text-[11px] text-ink-soft dark:text-gray-300 mt-1 font-medium">
              {!nextControlDate ? (
                <span>Apasă ca să adaugi controlul</span>
              ) : daysUntilControl > 0 ? (
                <span className={isUrgentControl ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-sage-700 dark:text-sage-300'}>
                  peste {daysUntilControl} {daysUntilControl === 1 ? 'zi' : 'zile'}
                </span>
              ) : (
                <span className="text-rose-600 font-bold">Astăzi / În curs</span>
              )}
            </p>
          </div>
          <span className="text-[10px] text-ink-soft hover:text-sage-600 pt-2 flex items-center gap-0.5">
            Oncologie • Modifică &rarr;
          </span>
        </div>

        {/* Card Dreapta: Citat Empatic Roz-Pudrat (Base44 blush-card with LeafSprig & Dynamic rotation) */}
        <div 
          {...clickable(handleNextQuote)}
          title="Apasă pentru alt gând de susținere"
          className="tap-scale blush-card rounded-3xl p-4 flex flex-col justify-between min-h-[145px] relative overflow-hidden cursor-pointer select-none group"
        >
          <LeafSprig className="absolute -bottom-2 -right-2 w-16 h-16 opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <p className="font-serif italic text-xs leading-relaxed text-petal-700 dark:text-petal-300 pr-3 z-10 transition-opacity">
            {currentQuote.text}
          </p>
          <div className="flex items-center justify-between pt-2 z-10">
            <span className="text-[10px] text-petal-700 dark:text-petal-300 font-semibold tracking-wide">
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
            <h3 className="text-sm font-bold font-serif text-ink dark:text-white mt-0.5">
              Cum te simți azi?
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
            { id: 'foarte_rau' as MoodLevel, level: 1, label: 'Greu' },
            { id: 'rau' as MoodLevel, level: 2, label: 'Obosită' },
            { id: 'neutru' as MoodLevel, level: 3, label: 'Liniștită' },
            { id: 'bine' as MoodLevel, level: 4, label: 'Bine' },
            { id: 'foarte_bine' as MoodLevel, level: 5, label: 'Foarte bine' },
          ].map((item) => {
            const isSelected = selectedMood === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectMood(item.id)}
                className={`flex flex-col items-center justify-start px-0.5 py-2 rounded-2xl min-h-[58px] transition-all duration-300 ease-out transform active:scale-95 ${
                  isSelected
                    ? 'bg-sage-600 text-white shadow-sm scale-110'
                    : 'bg-cream dark:bg-darkbg-card hover:bg-sage-50 text-ink dark:text-gray-300 border border-warmborder dark:border-darkbg-border'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-cream-deep dark:bg-stone-800 text-ink dark:text-stone-300'
                }`}>
                  {item.level}
                </span>
                <span className={`text-[10px] mt-1 text-center font-medium leading-tight tracking-tight ${
                  isSelected ? 'text-white font-bold' : 'text-ink-soft dark:text-gray-400'
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-gray-400">
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
          {...clickable(() => onNavigateToTab?.('guide'))}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 dark:bg-darkbg-card text-sage-800 dark:text-sage-200 flex items-center justify-center shrink-0 font-serif font-bold text-xs">
            GHID
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sage-700 dark:text-sage-300 uppercase">
              <span>{CLINICAL_GUIDES[0].tag}</span>
              <span>•</span>
              <span className="text-ink-soft">Recomandare</span>
            </div>
            <h4 className="text-xs font-bold text-ink dark:text-white mt-0.5">
              {CLINICAL_GUIDES[0].title}
            </h4>
            <p className="text-[11px] text-ink-soft dark:text-gray-400 mt-1 line-clamp-2">
              {CLINICAL_GUIDES[0].summary}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-ink-soft shrink-0 self-center" />
        </div>

        {/* Card 2 Noutăți: from NEWS_PROTOCOLS */}
        <div
          {...clickable(() => onNavigateToTab?.('guide'))}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all flex items-start gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-soft dark:bg-darkbg-card text-sage-800 dark:text-sage-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
              <span className="micro-label text-sage-deep">NOUTĂȚI</span>
              <span className="text-ink-soft">•</span>
              <span className="text-ink-soft">{NEWS_PROTOCOLS[0].date}</span>
            </div>
            <h4 className="text-xs font-bold text-ink dark:text-white mt-0.5 leading-snug">
              {NEWS_PROTOCOLS[0].title}
            </h4>
            <p className="text-[11px] text-ink-soft dark:text-gray-400 mt-1 line-clamp-2">
              {NEWS_PROTOCOLS[0].summary}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-ink-soft shrink-0 self-center" />
        </div>
      </div>

      {/* 5. Banner de Inspirație (Condiționat: dacă starea este Rău/Foarte Rău sau rotativ) */}
      {showInspirationBanner && (
        <div className="sage-card rounded-3xl p-5 relative overflow-hidden flex items-center gap-4 animate-fade-in">
          <span className="shrink-0 w-11 h-11 rounded-full bg-white/60 flex items-center justify-center text-sage-deep shadow-xs">
            <Heart className="w-5 h-5 text-sage-deep" strokeWidth={1.8} />
          </span>
          <div className="flex-1 min-w-0 pr-6">
            <p className="font-serif italic text-[13px] leading-relaxed text-sage-deep dark:text-sage-200">
              „Nu ești doar un pacient. Ești o persoană cu o viață întreagă în față.”
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismissBanner}
            title="Închide pentru 7 zile"
            className="absolute top-3 right-3 text-ink-soft hover:text-ink dark:hover:text-gray-200 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 8. Contextual Floating Action Button (FAB) SOS */}
      {showSosFab && (
        <div className="fixed bottom-24 right-4 z-50 flex items-center gap-1.5 animate-bounce">
          <button
            onClick={onOpenRedFlags}
            className="py-2.5 px-4 rounded-full bg-petal-700 hover:bg-petal-800 text-white text-xs font-bold shadow-lg flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS Urgențe</span>
          </button>
          <button
            onClick={handleDismissSosFab}
            className="w-7 h-7 rounded-full bg-white dark:bg-darkbg-surface text-ink-soft shadow border border-warmborder flex items-center justify-center text-xs"
            title="Închide SOS"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 9. Modal Mărire Fotografie Profil */}
      {showPhotoModal && profile.avatar_url && (
        <div 
          onClick={() => setShowPhotoModal(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-modal"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-sage-200 dark:border-darkbg-border text-center space-y-4 animate-scale-up"
          >
            <div className="flex items-center justify-between pb-2 border-b border-warmborder dark:border-darkbg-border">
              <h3 className="font-serif text-lg font-normal text-ink dark:text-white">
                Fotografie de profil
              </h3>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-cream-deep dark:hover:bg-darkbg-card transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-sage-200 dark:border-sage-800 shadow-md">
              <img 
                src={profile.avatar_url} 
                alt={patientFirstName} 
                className="w-full h-full object-cover" 
              />
            </div>

            <div>
              <p className="font-serif text-base text-ink dark:text-white font-medium">
                {profile.full_name || 'Pacientă'}
              </p>
              <p className="text-xs text-ink-soft dark:text-gray-400 mt-0.5">
                {profile.email || (profile.oncologist_email ? `Medic: ${profile.oncologist_email}` : 'Profil pacient securizat')}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoModal(false);
                  onNavigateToTab?.('profile');
                }}
                className="w-full py-2.5 rounded-xl bg-sage-deep hover:bg-sage-800 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Deschide Profilul Complet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="w-full py-2 rounded-xl text-xs text-ink-soft dark:text-gray-400 hover:bg-cream-deep dark:hover:bg-darkbg-card transition-colors"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
