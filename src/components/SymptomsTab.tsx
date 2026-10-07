import React, { useState } from 'react';
import { 
  FileDown, Flame, Moon, Battery, Heart, Droplets, 
  Send, Sparkles, Check, Clock, TrendingDown, BarChart3, Activity,
  ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import { SymptomLog, PatientProfile, DoseLog } from '../types';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { generateWeeklyPlannerPDF } from '../lib/weeklyPdfGenerator';

interface SymptomsTabProps {
  profile: PatientProfile;
  symptoms: SymptomLog[];
  doses: DoseLog[];
  onAddSymptomLog: (log: Omit<SymptomLog, 'id'>) => void;
}

export const SymptomsTab: React.FC<SymptomsTabProps> = ({
  profile,
  symptoms,
  doses,
  onAddSymptomLog
}) => {
  // Form State
  const [hotFlashesCount, setHotFlashesCount] = useState<number>(0);
  const [hotFlashesIntensity, setHotFlashesIntensity] = useState<number>(1);
  const [nightSweats, setNightSweats] = useState<boolean>(false);
  const [fatigueLevel, setFatigueLevel] = useState<number>(1);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [moodState, setMoodState] = useState<string>('Echilibrată');
  const [jointPainLevel, setJointPainLevel] = useState<number>(0);
  const [selectedJointAreas, setSelectedJointAreas] = useState<string[]>([]);
  const [mucosalDryness, setMucosalDryness] = useState<number>(0);
  const [waterIntake, setWaterIntake] = useState<number>(2000);
  const [notes, setNotes] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showDetailedForm, setShowDetailedForm] = useState<boolean>(false);

  const jointAreasList = ['genunchi', 'articulații mâini', 'șolduri', 'umeri', 'coloană'];
  const moodsList = ['Echilibrată', 'Calmă', 'Optimistă', 'Obosită', 'Anxioasă'];

  const toggleJointArea = (area: string) => {
    if (selectedJointAreas.includes(area)) {
      setSelectedJointAreas(selectedJointAreas.filter(a => a !== area));
    } else {
      setSelectedJointAreas([...selectedJointAreas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptomLog({
      logged_at: new Date().toISOString(),
      hot_flashes_count: hotFlashesCount,
      hot_flashes_intensity: hotFlashesIntensity,
      night_sweats: nightSweats,
      fatigue_level: fatigueLevel,
      sleep_quality: sleepQuality,
      mood_state: moodState,
      joint_pain_level: jointPainLevel,
      joint_pain_areas: selectedJointAreas,
      mucosal_dryness: mucosalDryness,
      water_intake_ml: waterIntake,
      notes: notes.trim() ? notes : undefined
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Trend statistics calculation
  const recentLogs = symptoms.slice(0, 7).reverse();
  const avgHotFlashes = symptoms.length > 0
    ? (symptoms.reduce((acc, s) => acc + s.hot_flashes_intensity, 0) / symptoms.length).toFixed(1)
    : '1.5';
  const zeroJointPainPercent = symptoms.length > 0
    ? Math.round((symptoms.filter(s => s.joint_pain_level === 0).length / symptoms.length) * 100)
    : 70;

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* 1. PDF Export Action Card with Both Oncologist Report & Fridge Weekly Sheet */}
      <div className="bg-gradient-to-r from-sage-500 to-sage-600 dark:from-sage-600 dark:to-sage-700 text-white rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="max-w-md">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-100 block">
            Rapoarte & Fise Printabile
          </span>
          <h3 className="text-sm font-bold mt-0.5">
            Documente Medicale & Organizare Acasă
          </h3>
          <p className="text-[11px] text-sage-100 mt-1 leading-tight">
            Descarcă rezumatul oficial pentru medicul oncolog sau fișa fizică săptămânală de pus pe frigider.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              const savedList = localStorage.getItem('navimed_shopping_list');
              const list = savedList ? JSON.parse(savedList) : [];
              const exercise = parseInt(localStorage.getItem('navimed_exercise_minutes') || '45', 10);
              generateWeeklyPlannerPDF(profile, list, exercise);
            }}
            className="bg-white/90 hover:bg-white text-sage-900 active:scale-95 px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            title="Descarcă fișa de bifat pentru frigider"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Fișă Frigider</span>
          </button>

          <button
            onClick={() => generateOncologyReport(profile, doses, symptoms)}
            className="bg-white text-sage-800 hover:bg-sage-50 active:scale-95 px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            title="Raport complet pentru oncolog"
          >
            <FileDown className="w-4 h-4 text-sage-600" />
            <span>Raport Oncolog</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Trends & Statistics Card */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Tendințe Simptome (7 Zile)
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Intensitate bufeuri & mobilitate</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Stabil
          </span>
        </div>

        {/* Dynamic SVG Bar Chart */}
        <div className="p-3 bg-gray-50/80 dark:bg-darkbg-card rounded-2xl border border-gray-100 dark:border-darkbg-border">
          <div className="flex items-end justify-between h-24 pt-4 px-2">
            {recentLogs.map((log, index) => {
              const heightPercent = Math.max(15, (log.hot_flashes_intensity / 5) * 100);
              const dateLabel = new Date(log.logged_at).toLocaleDateString('ro-RO', { weekday: 'narrow' });
              return (
                <div key={log.id || index} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {log.hot_flashes_intensity}/5
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-6 rounded-t-lg transition-all ${
                      log.hot_flashes_intensity <= 1
                        ? 'bg-sage-500'
                        : log.hot_flashes_intensity <= 3
                        ? 'bg-amber-500'
                        : 'bg-rose-600'
                    }`}
                  ></div>
                  <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Insight Stats */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-darkbg-border">
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-darkbg-card text-center">
            <span className="text-[10px] text-gray-500 block">Medie Bufeuri</span>
            <strong className="text-xs font-bold text-gray-900 dark:text-white">{avgHotFlashes} / 5</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-darkbg-card text-center">
            <span className="text-[10px] text-gray-500 block">Fără dureri articulare</span>
            <strong className="text-xs font-bold text-sage-700 dark:text-sage-300">{zeroJointPainPercent}% din zile</strong>
          </div>
        </div>
      </div>

      {/* 3. Detailed Symptoms Form (Collapsible for Clean, Fluid UX) */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
        <div 
          onClick={() => setShowDetailedForm(!showDetailedForm)}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/40 text-sage-600 dark:text-sage-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Adaugă Înregistrare Detaliată
              </h3>
              <p className="text-[11px] text-gray-500">
                {showDetailedForm ? 'Completează parametrii de azi' : 'Atinge aici pentru scor detaliat, mucoase & notițe'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            className="p-1.5 rounded-xl bg-gray-100 dark:bg-darkbg-card text-gray-500 group-hover:text-sage-600 transition-colors"
          >
            {showDetailedForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showDetailedForm && (
          <form onSubmit={(e) => { handleSubmit(e); setShowDetailedForm(false); }} className="mt-4 pt-4 border-t border-gray-100 dark:border-darkbg-border space-y-4 animate-fade-in">

        {/* Section: Vasomotor */}
        <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Bufeuri & Transpirații
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {hotFlashesCount} episoade azi
            </span>
          </div>

          <div>
            <label className="text-[11px] text-gray-500 block mb-1">
              Frecvență episoade:
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={hotFlashesCount}
              onChange={(e) => setHotFlashesCount(parseInt(e.target.value))}
              className="w-full accent-sage-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>Intensitate bufeu:</span>
              <strong className="text-gray-700 dark:text-gray-300">Scor {hotFlashesIntensity} / 5</strong>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {[0, 1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setHotFlashesIntensity(val)}
                  className={`py-1 rounded-lg text-xs font-semibold ${
                    hotFlashesIntensity === val
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-darkbg-surface text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-darkbg-border'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={nightSweats}
              onChange={(e) => setNightSweats(e.target.checked)}
              className="rounded text-sage-600 focus:ring-sage-500"
            />
            <span>Am avut transpirații nocturne noaptea trecută</span>
          </label>
        </div>

        {/* Section: Articular */}
        <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Dureri / Rigiditate Articulară
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Grad {jointPainLevel} / 5
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="5"
            value={jointPainLevel}
            onChange={(e) => setJointPainLevel(parseInt(e.target.value))}
            className="w-full accent-sage-500 cursor-pointer"
          />

          <div>
            <span className="text-[11px] text-gray-500 block mb-1.5">Zone afectate:</span>
            <div className="flex flex-wrap gap-1.5">
              {jointAreasList.map((area) => {
                const isSelected = selectedJointAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleJointArea(area)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-sage-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-darkbg-surface text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-darkbg-border'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Mood & Sleep */}
        <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200">
            <span>Stare de Spirit & Somn</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {moodsList.map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMoodState(m)}
                className={`py-1 rounded-lg text-[11px] font-medium transition-all ${
                  moodState === m
                    ? 'bg-petal-300 dark:bg-petal-900/60 text-petal-950 dark:text-petal-100 font-bold'
                    : 'bg-white dark:bg-darkbg-surface text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-darkbg-border'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">Calitate somn:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((sq) => (
                <button
                  type="button"
                  key={sq}
                  onClick={() => setSleepQuality(sq)}
                  className={`w-6 h-6 rounded-md text-xs font-semibold ${
                    sleepQuality === sq
                      ? 'bg-sage-500 text-white'
                      : 'bg-white dark:bg-darkbg-surface text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-darkbg-border'
                  }`}
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Notes */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
            Notițe suplimentare sau întrebări pentru medic:
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Ușoară senzație de căldură după-amiaza, plimbare de 30 min..."
            className="w-full p-3 rounded-2xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border focus:outline-none focus:border-sage-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-sage-500 hover:bg-sage-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-sage-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span>Salvează Înregistrarea în Jurnal</span>
        </button>

        {isSaved && (
          <div className="p-2.5 rounded-xl bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-300 text-xs text-center font-medium animate-fade-in flex items-center justify-center gap-1">
            <Check className="w-4 h-4" /> Jurnalul a fost actualizat cu succes!
          </div>
        )}
          </form>
        )}
      </div>

      {/* 4. History Feed */}
      <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Ultimele înregistrări de simptome</span>
        </h4>

        <div className="space-y-2.5">
          {symptoms.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-4">
              Nu există înregistrări anterioare. Completează formularul de mai sus pentru a nota prima stare.
            </p>
          ) : (
            symptoms.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-gray-800 dark:text-gray-200">
                  <span>{new Date(log.logged_at).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  <span className="text-[11px] text-sage-600 dark:text-sage-400 font-normal">
                    {log.mood_state} • Somn {log.sleep_quality}/5
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-[11px]">
                  Bufeuri: {log.hot_flashes_count} ep. (intensitate {log.hot_flashes_intensity}/5) • Dureri: {log.joint_pain_level}/5 ({log.joint_pain_areas.join(', ') || 'fără'})
                </p>
                {log.notes && (
                  <p className="text-[11px] text-gray-500 italic mt-0.5">"{log.notes}"</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
