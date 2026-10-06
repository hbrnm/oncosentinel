import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Clock, Pill, Sparkles, Flame, BatteryCharging, 
  Smile, ShieldAlert, AlertCircle, Calendar, RefreshCw, Wind, 
  Stethoscope, Heart, Bell, BellRing, Check, Activity, Dumbbell 
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
}

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
  onNavigateToRecipes
}) => {
  // Check if today's dose was taken
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDose = doses.find(d => (d.taken_at || d.scheduled_for).slice(0, 10) === todayStr);
  const isTakenToday = todayDose?.status === 'taken';

  // Quick symptom state
  const [quickHotFlashes, setQuickHotFlashes] = useState<number>(1);
  const [quickEnergy, setQuickEnergy] = useState<number>(3);
  const [quickJoints, setQuickJoints] = useState<number>(0);
  const [symptomSavedNotice, setSymptomSavedNotice] = useState<boolean>(false);

  // Exercise tracking state (weekly target: 150 mins)
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('navimed_exercise_minutes');
    return saved ? parseInt(saved, 10) : 45;
  });
  const [exerciseNotice, setExerciseNotice] = useState<string | null>(null);

  const handleAddExerciseMinutes = (mins: number, label: string) => {
    const updated = exerciseMinutes + mins;
    setExerciseMinutes(updated);
    localStorage.setItem('navimed_exercise_minutes', updated.toString());
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#698b69', '#a4c2a5', '#d4e2d4']
    });
    setExerciseNotice(`+${mins} min (${label}) adăugate la obiectivul săptămânal!`);
    setTimeout(() => setExerciseNotice(null), 3000);
  };

  // Notification status
  const [notificationsActive, setNotificationsActive] = useState<boolean>(() => {
    return notificationsService.getPermission() === 'granted';
  });

  const handleEnableNotifications = async () => {
    const granted = await notificationsService.requestPermission();
    if (granted) {
      setNotificationsActive(true);
      notificationsService.sendImmediateNotification(
        'NaviMed: Notificări Active! 🌸',
        `Te vom atenționa zilnic la ora ${profile.daily_reminder_time} pentru doza de Tamoxifen (20 mg).`
      );
    }
  };

  // Motivational quote of the day
  const motivationalQuotes = [
    "Fiecare zi cu tratament este o cărămidă solidă la protecția ta împotriva recidivei.",
    "Ascultă-ți corpul cu blândețe și răbdare. Recuperarea este un drum pas cu pas.",
    "Ești mai puternică decât simptomele trecătoare. Ai învins o etapă grea!",
    "O pastilă mică pentru o viață lungă și liniștită."
  ];
  const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  const handleTakeWithConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#7A9A8B', '#E8C5C8', '#D97746']
    });
    onTakeDose();
  };

  const handleSaveSymptoms = () => {
    onSaveQuickSymptom(quickHotFlashes, quickEnergy, quickJoints);
    setSymptomSavedNotice(true);
    setTimeout(() => setSymptomSavedNotice(false), 3000);
  };

  // Stock status
  const isLowStock = profile.pill_stock_count <= 7;

  // Generate 28-day adherence history calendar data
  const calendarDays = Array.from({ length: 28 }, (_, i) => {
    const daysAgo = 27 - i;
    const date = new Date(Date.now() - daysAgo * 86400000);
    const dateStr = date.toISOString().slice(0, 10);
    const isToday = daysAgo === 0;
    const isTaken = isToday ? isTakenToday : (i !== 7);
    return {
      dayNum: date.getDate(),
      isToday,
      isTaken,
      dateStr
    };
  });

  const takenCount = calendarDays.filter(d => d.isTaken).length;
  const adherencePercent = Math.round((takenCount / 28) * 100);

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* 1. Daily Empathetic Banner */}
      <div className="bg-gradient-to-br from-sage-50 to-petal-50/70 dark:from-darkbg-card dark:to-darkbg-surface p-4 rounded-3xl border border-sage-100/80 dark:border-darkbg-border shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-petal-200/80 dark:bg-petal-900/50 flex items-center justify-center shrink-0 text-petal-700 dark:text-petal-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider text-sage-800 dark:text-sage-300 uppercase">
              Mesajul de Azi
            </span>
            <p className="text-xs text-gray-700 dark:text-gray-300 italic mt-0.5 leading-relaxed">
              "{quote}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tamoxifen Adherence Card */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs transition-all relative overflow-hidden">
        
        {/* Soft Decorative Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 dark:bg-sage-900/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3.5 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              isTakenToday 
                ? 'bg-sage-500 text-white shadow-xs' 
                : 'bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300'
            }`}>
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Tamoxifen 20 mg
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sage-600" /> Ora programată: {profile.daily_reminder_time}
              </p>
            </div>
          </div>

          {/* High-contrast status badge */}
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            isTakenToday 
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60' 
              : 'bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/60'
          }`}>
            {isTakenToday ? 'Luat pentru azi' : 'În așteptare'}
          </span>
        </div>

        {/* Action Buttons */}
        {isTakenToday ? (
          <div className="bg-sage-50 dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/40 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sage-700 dark:text-sage-300 mb-1">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Doza de azi este bifată cu succes!</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Continuă să te hidratezi bine pe tot parcursul zilei.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleTakeWithConfetti}
              className="py-3 px-4 rounded-2xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-sage-200 dark:shadow-none transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Bifat ca luat</span>
            </button>

            <button
              onClick={onSnoozeDose}
              className="py-3 px-4 rounded-2xl bg-gray-100 dark:bg-darkbg-card hover:bg-gray-200 dark:hover:bg-darkbg-border text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all border border-transparent dark:border-darkbg-border"
            >
              <Clock className="w-4 h-4" />
              <span>Amână 15 min</span>
            </button>
          </div>
        )}

        {/* 28-Day Visual Adherence Mini-Calendar */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-darkbg-border">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sage-600" />
              <span>Calendar lunar de aderență</span>
            </span>
            <span className="text-[11px] font-bold text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/50 px-2 py-0.5 rounded-md">
              {adherencePercent}% rată ({takenCount}/28 zile)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 p-2.5 bg-gray-50/80 dark:bg-darkbg-card rounded-2xl border border-gray-100 dark:border-darkbg-border text-center">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`py-1 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center transition-all ${
                  day.isToday && !day.isTaken
                    ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                    : day.isTaken
                    ? 'bg-sage-500 text-white shadow-2xs'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
                title={`${day.dateStr}: ${day.isTaken ? 'Luat' : 'Neluat'}`}
              >
                <span>{day.dayNum}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock & Prescription Tracker */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
            <Pill className="w-3.5 h-3.5 text-sage-600" />
            <span>Stoc rămas: <strong className="text-gray-800 dark:text-gray-200">{profile.pill_stock_count} pastile</strong></span>
          </div>

          {isLowStock ? (
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Rețetă necesară (&lt;7 zile)
            </span>
          ) : (
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Următorul control: în 4 luni
            </span>
          )}
        </div>

        {/* Missed dose guide helper */}
        <div className="mt-2.5 p-2 bg-gray-50 dark:bg-darkbg-card rounded-xl text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-1.5 border border-gray-100 dark:border-darkbg-border">
          <RefreshCw className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
          <span>Ai uitat doza? Ia-o imediat ce îți amintești. Dacă e aproape de ora următoarei doze, sări peste ea. <strong>Nu dubla niciodată doza!</strong></span>
        </div>

      </div>

      {/* 3. Essential Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Doctor Visit Prep */}
        <div
          onClick={onOpenDoctorVisit}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-3 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">
              Medic Q&A
            </h4>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">
            Checklist control
          </p>
        </div>

        {/* Grounding 5-4-3-2-1 */}
        <div
          onClick={onOpenGrounding}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-3 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-7 h-7 rounded-xl bg-petal-100 dark:bg-petal-900/50 text-petal-700 dark:text-petal-200 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">
              Ancorare
            </h4>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">
            Liniște 5-4-3-2-1
          </p>
        </div>

        {/* Supporter Circle */}
        <div
          onClick={onOpenSupporter}
          className="cursor-pointer bg-white dark:bg-darkbg-surface p-3 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-xs hover:border-sage-300 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight">
              Apropiați
            </h4>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">
            Cercul de sprijin
          </p>
        </div>
      </div>

      {/* 4. Notification Activator Card */}
      <div className="bg-white dark:bg-darkbg-surface p-3.5 rounded-2xl border border-sage-100 dark:border-darkbg-border shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            notificationsActive 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300' 
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300'
          }`}>
            {notificationsActive ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white block text-xs">
              Alarme pe telefon la {profile.daily_reminder_time}
            </span>
            <span className="text-[10px] text-gray-500">
              {notificationsActive ? 'Notificările sunt active' : 'Atinge pentru a activa notificările'}
            </span>
          </div>
        </div>

        {notificationsActive ? (
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 px-2 py-1 rounded-lg flex items-center gap-1">
            <Check className="w-3 h-3" /> Activ
          </span>
        ) : (
          <button
            onClick={handleEnableNotifications}
            className="text-[11px] font-bold text-white bg-sage-500 hover:bg-sage-600 px-3 py-1.5 rounded-xl shadow-2xs transition-all"
          >
            Activează
          </button>
        )}
      </div>

      {/* 5. Hot Flash Rescue Banner (Paced Breathing Shortcut) */}
      <div 
        onClick={onOpenBreathing}
        className="cursor-pointer bg-gradient-to-r from-sage-50 to-petal-50 dark:from-darkbg-card dark:to-darkbg-surface p-4 rounded-3xl border border-sage-200/80 dark:border-sage-800/50 shadow-xs hover:border-sage-300 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-sage-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">
              Simți un bufeu sau o stare de căldură?
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
              Apasă pentru 1 minut de respirație ghidată antistres
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-sage-700 dark:text-sage-300 bg-white dark:bg-darkbg-card px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-darkbg-border shadow-2xs">
          Începe &rarr;
        </span>
      </div>

      {/* 5b. Weekly Exercise & Physical Activity Tracker (ASCO/ACS 150 min Goal) */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Mișcare & Mobilitate Săptămânală</span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Ținta medicală ASCO: 150 min / săptămână
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            {exerciseMinutes} / 150 min
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-darkbg-card rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sage-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((exerciseMinutes / 150) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            <span>{Math.round((exerciseMinutes / 150) * 100)}% din țintă atins</span>
            <span>{Math.max(0, 150 - exerciseMinutes)} min rămase</span>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="pt-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Înregistrează mișcarea de azi:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleAddExerciseMinutes(15, 'Plimbare')}
              className="py-2 px-2 rounded-xl bg-gray-50 dark:bg-darkbg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200/80 dark:border-darkbg-border text-gray-700 dark:text-gray-300 hover:text-emerald-700 text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5"
            >
              <span>🚶‍♀️ +15 min</span>
              <span className="text-[9px] text-gray-400 font-normal">Plimbare</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddExerciseMinutes(30, 'Mers alert')}
              className="py-2 px-2 rounded-xl bg-gray-50 dark:bg-darkbg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200/80 dark:border-darkbg-border text-gray-700 dark:text-gray-300 hover:text-emerald-700 text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5"
            >
              <span>🏃‍♀️ +30 min</span>
              <span className="text-[9px] text-gray-400 font-normal">Mers alert</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddExerciseMinutes(20, 'Stretching')}
              className="py-2 px-2 rounded-xl bg-gray-50 dark:bg-darkbg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-gray-200/80 dark:border-darkbg-border text-gray-700 dark:text-gray-300 hover:text-emerald-700 text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5"
            >
              <span>🧘‍♀️ +20 min</span>
              <span className="text-[9px] text-gray-400 font-normal">Mobilitate</span>
            </button>
          </div>
        </div>

        {exerciseNotice && (
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold text-center animate-fade-in">
            ✨ {exerciseNotice}
          </p>
        )}
      </div>

      {/* 6. Quick 60-Second Symptom Check-in */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-petal-100 dark:bg-petal-900/50 text-petal-700 dark:text-petal-200 flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Cum te simți astăzi?
            </h3>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Check-in 60 sec</span>
        </div>

        <div className="space-y-3.5">
          {/* Hot flashes intensity */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Bufeuri & Călduri
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {quickHotFlashes === 0 ? 'Deloc' : `Nivel ${quickHotFlashes} / 5`}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setQuickHotFlashes(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    quickHotFlashes === lvl
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-darkbg-border border border-transparent dark:border-darkbg-border'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Energy level */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" /> Nivel de Energie
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {['', 'Epuizată', 'Scăzută', 'Normală', 'Bună', 'Excelentă'][quickEnergy]}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setQuickEnergy(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    quickEnergy === lvl
                      ? 'bg-sage-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-darkbg-border border border-transparent dark:border-darkbg-border'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Joint stiffness */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
              <span>Dureri / Rigiditate articulară</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {['Fără dureri', 'Ușoare', 'Moderate', 'Supărătoare'][quickJoints]}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['Fără', 'Ușoare', 'Medii', 'Mari'].map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuickJoints(idx)}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    quickJoints === idx
                      ? 'bg-sage-700 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-darkbg-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-darkbg-border border border-transparent dark:border-darkbg-border'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveSymptoms}
            className="w-full py-2.5 rounded-2xl bg-sage-50 dark:bg-sage-900/40 hover:bg-sage-100 dark:hover:bg-sage-900/60 text-sage-900 dark:text-sage-200 font-semibold text-xs border border-sage-200/80 dark:border-sage-800 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Înregistrează Starea Zilei</span>
          </button>

          {symptomSavedNotice && (
            <p className="text-[11px] text-center text-sage-700 dark:text-sage-300 font-semibold animate-fade-in">
              ✨ Înregistrarea a fost salvată în dosarul tău!
            </p>
          )}

          {/* Smart Symptom-to-Recipe Recommendation Card */}
          {quickHotFlashes >= 2 && (
            <div 
              onClick={() => onNavigateToRecipes?.('bufeuri')}
              className="cursor-pointer p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between text-xs hover:border-amber-300 transition-all animate-fade-in"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🫖</span>
                <div>
                  <p className="font-bold text-amber-950 dark:text-amber-100 text-[11px]">Recomandare pentru bufeuri:</p>
                  <p className="text-amber-800 dark:text-amber-300 text-[10px]">Infuzie rece de hibiscus & salvie (calmează căldura)</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 shrink-0">Vezi rețeta &rarr;</span>
            </div>
          )}

          {quickEnergy <= 2 && quickHotFlashes < 2 && (
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

          {quickJoints >= 2 && quickHotFlashes < 2 && quickEnergy > 2 && (
            <div 
              onClick={() => onNavigateToRecipes?.('somon')}
              className="cursor-pointer p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between text-xs hover:border-blue-300 transition-all animate-fade-in"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🐟</span>
                <div>
                  <p className="font-bold text-blue-950 dark:text-blue-100 text-[11px]">Recomandare anti-inflamatorie articulații:</p>
                  <p className="text-blue-800 dark:text-blue-300 text-[10px]">File de somon sălbatic bogat în acizi grași Omega-3</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 shrink-0">Vezi rețeta &rarr;</span>
            </div>
          )}
        </div>
      </div>

      {/* 7. Integrative Oncology Spotlight */}
      <div className="bg-gradient-to-r from-sage-50/90 to-petal-50/70 dark:from-darkbg-card dark:to-darkbg-surface rounded-3xl p-4 border border-sage-100 dark:border-darkbg-border flex items-start space-x-3">
        <div className="w-9 h-9 rounded-2xl bg-sage-100 dark:bg-sage-800 text-sage-800 dark:text-sage-200 flex items-center justify-center shrink-0 text-base">
          🥦
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
            Nutriție Integrativă: Legumele Crucifere
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
            Broccoli, conopida și varza conțin indol-3-carbinol și sulforafan, compuși care susțin ficatul în metabolizarea fiziologică a estrogenilor.
          </p>
        </div>
      </div>

      {/* 8. Emergency Red Flags shortcut banner */}
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

    </div>
  );
};
