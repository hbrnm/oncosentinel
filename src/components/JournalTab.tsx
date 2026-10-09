import React, { useState, useEffect } from 'react';
import {
  Heart, BookOpen, Leaf, ClipboardList, ChevronDown, ChevronUp, FileDown, Flame, Check, Trash2, PhoneCall
} from 'lucide-react';
import { LeafSprig } from './Botanical';
import { MoodPicker, getMood } from './MoodPicker';
import { PatientProfile, DoseLog, SymptomLog } from '../types';
import { formatDateRo } from './TreatmentTab';
import { journalResponseFor } from '../data/comfort';
import { weekSummary } from '../lib/summary';

// Generatoarele PDF (jsPDF) se încarcă doar la cerere, nu la pornirea aplicației
const PDF_LOAD_ERROR = 'Nu am putut pregăti PDF-ul. Verifică conexiunea la internet și încearcă din nou.';

// Ziua locală (AAAA-LL-ZZ), nu cea din UTC
const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

interface JournalTabProps {
  profile: PatientProfile;
  symptoms: SymptomLog[];
  doses: DoseLog[];
  onAddSymptomLog: (log: Omit<SymptomLog, 'id'>) => void;
  onUpdateSymptomLog?: (id: string, log: Omit<SymptomLog, 'id'>) => void;
  onDeleteSymptomLog?: (id: string) => void;
  onRestoreSymptomLog?: (log: SymptomLog) => void;
  onNavigateToTab?: (tab: 'guide') => void;
  onOpenHelp?: () => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  profile,
  symptoms,
  doses,
  onAddSymptomLog,
  onUpdateSymptomLog,
  onDeleteSymptomLog,
  onRestoreSymptomLog,
  onOpenHelp
}) => {
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  // Mesajul cald de după salvare (aprobat, docs/etapa1-texte.md)
  const [response, setResponse] = useState<{ mood: number; text: string; crisis: boolean } | null>(null);
  
  // Detailed form state
  const [showDetailedForm, setShowDetailedForm] = useState<boolean>(false);
  const [hotFlashesCount, setHotFlashesCount] = useState<number>(0);
  const [hotFlashesIntensity, setHotFlashesIntensity] = useState<number>(0);
  const [nightSweats] = useState<boolean>(false);
  const [fatigueLevel, setFatigueLevel] = useState<number>(0);
  const [jointPainLevel, setJointPainLevel] = useState<number>(0);
  const [selectedJointAreas] = useState<string[]>([]);
  const [mucosalDryness, setMucosalDryness] = useState<number>(0);
  const [waterIntake] = useState<number>(2000);
  const [severeSymptomsAlert, setSevereSymptomsAlert] = useState<Partial<SymptomLog> | null>(null);
  const [bonePainLevel, setBonePainLevel] = useState<number>(0);
  const [nauseaLevel, setNauseaLevel] = useState<number>(0);
  const [brainFog, setBrainFog] = useState<number>(0);
  const [headache, setHeadache] = useState<number>(0);
  const [sleepQuality, setSleepQuality] = useState<number>(3);

  const todayStr = localDay(new Date());
  // Nota (stare + gânduri) și simptomele se salvează separat, câte una pe zi;
  // a doua salvare din aceeași zi o actualizează pe cea existentă
  const todayEntries = symptoms.filter(s => localDay(new Date(s.logged_at)) === todayStr);
  const todayNote = todayEntries.find(s => s.kind === 'note');
  const todaySymptoms = todayEntries.find(s => s.kind === 'symptoms');

  // Efectul de pe buton după salvare: bifă și „Salvat” câteva secunde
  const [savedFlash, setSavedFlash] = useState<'note' | 'symptoms' | null>(null);
  useEffect(() => {
    if (!savedFlash) return;
    const timer = setTimeout(() => setSavedFlash(null), 2000);
    return () => clearTimeout(timer);
  }, [savedFlash]);

  // Ștergerea din Istoric se poate anula câteva secunde
  const [lastDeleted, setLastDeleted] = useState<SymptomLog | null>(null);
  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  const handleDelete = (log: SymptomLog) => {
    if (!onDeleteSymptomLog) return;
    onDeleteSymptomLog(log.id);
    setLastDeleted(log);
  };

  const handleUndoDelete = () => {
    if (lastDeleted) onRestoreSymptomLog?.(lastDeleted);
    setLastDeleted(null);
  };

  // Completează din ce ai salvat azi (intrările vechi au și nota, și simptomele).
  // Fiecare parte se completează doar când apare intrarea ei, ca salvarea uneia
  // să nu șteargă ce ai schimbat, nesalvat, în cealaltă.
  const legacyToday = todayEntries.find(s => !s.kind);
  const noteSource = todayNote || legacyToday;
  const symptomSource = todaySymptoms || legacyToday;

  useEffect(() => {
    if (!noteSource) return;
    const moodMap: Record<string, number> = {
      'Foarte bine': 5,
      'Bine': 4,
      'Echilibrată': 3,
      'Rău': 2,
      'Foarte rău': 1
    };
    setMood(noteSource.mood_state ? moodMap[noteSource.mood_state] || 3 : 3);
    setNote(noteSource.notes || '');
  }, [noteSource?.id]);

  useEffect(() => {
    const log = symptomSource;
    if (!log) return;
    if (log.hot_flashes_count !== undefined) setHotFlashesCount(log.hot_flashes_count);
    if (log.hot_flashes_intensity !== undefined) setHotFlashesIntensity(log.hot_flashes_intensity);
    if (log.fatigue_level !== undefined) setFatigueLevel(log.fatigue_level);
    if (log.joint_pain_level !== undefined) setJointPainLevel(log.joint_pain_level);
    if (log.bone_pain_level !== undefined) setBonePainLevel(log.bone_pain_level);
    if (log.nausea_level !== undefined) setNauseaLevel(log.nausea_level);
    if (log.brain_fog !== undefined) setBrainFog(log.brain_fog);
    if (log.headache !== undefined) setHeadache(log.headache);
    if (log.sleep_quality !== undefined) setSleepQuality(log.sleep_quality);
    if (log.mucosal_dryness !== undefined) setMucosalDryness(log.mucosal_dryness);
  }, [symptomSource?.id]);

  // Salvează sau actualizează intrarea de azi de tipul dat. O intrare veche de azi
  // (fără tip, cu notă și simptome) se actualizează pe partea salvată, ca să nu se dubleze.
  const saveToday = (existing: SymptomLog | undefined, data: Omit<SymptomLog, 'id'>) => {
    // După o salvare nouă, nota ștearsă nu mai poate fi readusă (rămâne una pe zi)
    setLastDeleted(null);
    if (existing && onUpdateSymptomLog) onUpdateSymptomLog(existing.id, data);
    else if (legacyToday && onUpdateSymptomLog) {
      const { id, ...legacy } = legacyToday;
      onUpdateSymptomLog(id, { ...legacy, ...data, kind: undefined });
    } else onAddSymptomLog(data);
  };

  // „Salvează în jurnal”: doar starea și gândurile
  const handleSave = () => {
    setSaving(true);
    // Use a default mood level of 3 (Echilibrată) if none selected
    const effectiveMood = mood ?? 3;
    const moodLabels: Record<number, string> = {
      1: 'Foarte rău', 2: 'Rău', 3: 'Echilibrată', 4: 'Bine', 5: 'Foarte bine'
    };
    saveToday(todayNote, {
      logged_at: new Date().toISOString(),
      kind: 'note',
      mood_state: moodLabels[effectiveMood] || 'Echilibrată',
      notes: note.trim() ? note.trim() : undefined
    });
    setResponse({ mood: effectiveMood, ...journalResponseFor(effectiveMood, note) });
    setSaving(false);
    setSavedFlash('note');
  };

  // „Salvează simptomele”: doar formularul de simptome
  const handleSaveSymptoms = () => {
    setSaving(true);
    const symptomData: Omit<SymptomLog, 'id'> = {
      logged_at: new Date().toISOString(),
      kind: 'symptoms',
      hot_flashes_count: hotFlashesCount,
      hot_flashes_intensity: hotFlashesIntensity,
      night_sweats: nightSweats,
      fatigue_level: fatigueLevel,
      sleep_quality: sleepQuality,
      joint_pain_level: jointPainLevel,
      joint_pain_areas: selectedJointAreas,
      mucosal_dryness: mucosalDryness,
      bone_pain_level: bonePainLevel,
      nausea_level: nauseaLevel,
      brain_fog: brainFog,
      headache: headache,
      water_intake_ml: waterIntake
    };
    saveToday(todaySymptoms, symptomData);
    setSaving(false);
    setSavedFlash('symptoms');

    const hasSevere =
      hotFlashesIntensity >= 4 ||
      jointPainLevel >= 4 ||
      bonePainLevel >= 4 ||
      nauseaLevel >= 4 ||
      fatigueLevel >= 4 ||
      brainFog >= 4;

    if (hasSevere) {
      // Rămâne pe ecran până o închide utilizatoarea
      setSevereSymptomsAlert(symptomData);
    }
  };

  // Group history by date (using logged_at string)
  const historyGrouped = symptoms.reduce((acc, log) => {
    const date = localDay(new Date(log.logged_at));
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {} as Record<string, SymptomLog[]>);
  
  const sortedDates = Object.keys(historyGrouped).sort().reverse();

  const getMoodLevelFromState = (state?: string) => {
    const moodMap: Record<string, number> = {
      'Foarte bine': 5,
      'Bine': 4,
      'Echilibrată': 3,
      'Rău': 2,
      'Foarte rău': 1
    };
    return moodMap[state || ''] || 3;
  };


  return (
    <>
      <div className="fixed bottom-[11rem] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm flex flex-col gap-2">
      {lastDeleted && (
        <div role="status" className="bg-ink text-white rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between gap-3 animate-fade-in">
          <p className="text-[13px]">Nota a fost ștearsă.</p>
          <button type="button" onClick={handleUndoDelete} className="tap-scale text-[13px] font-bold underline shrink-0">
            Anulează
          </button>
        </div>
      )}
      {severeSymptomsAlert && (
        <div role="alert" className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 shadow-lg flex items-start gap-3 animate-fade-in">
          <span className="text-rose-500 text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700">Ai notat un simptom puternic</p>
            <p className="text-[11px] text-rose-600 mt-0.5">Dacă nu trece sau te îngrijorează, spune-i medicului tău.</p>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">
              La simptome grave sau dacă te simți în pericol, sună la <a href="tel:112" className="underline">112</a>.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('navimed_open_red_flags'))}
              className="mt-1.5 text-[11px] font-bold text-rose-700 underline"
            >
              Vezi semnalele de alarmă
            </button>
          </div>
          <button onClick={() => setSevereSymptomsAlert(null)} aria-label="Închide alerta" className="text-rose-400 hover:text-rose-600 text-sm font-bold">✕</button>
        </div>
      )}
      </div>
    <div className="min-h-screen animate-fade-in">
      <header className="px-2 pt-1 pb-4 relative">
        <LeafSprig className="absolute top-0 right-0 w-14 h-14 text-sage-200 dark:text-sage-900/50 opacity-50" />
        <h1 className="font-serif text-2xl text-gray-900 dark:text-white">Jurnal</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Un spațiu blând pentru emoțiile tale.</p>
      </header>

      <div className="space-y-5">
        {/* Săptămâna ta: rezumat în cuvinte, doar din ce a notat pacienta */}
        <section aria-labelledby="week-title" className="organic-card rounded-[28px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-sage-deep dark:text-sage-400" />
            <h2 id="week-title" className="font-serif text-lg text-ink dark:text-white">Săptămâna ta</h2>
          </div>
          <ul className="space-y-1.5">
            {weekSummary(symptoms).map((line) => (
              <li key={line} className="text-[13px] text-ink dark:text-gray-200 leading-relaxed">{line}</li>
            ))}
          </ul>
          <p className="text-[11px] text-ink-soft dark:text-gray-400 italic mt-3">Rezumatul vine doar din ce ai notat tu.</p>
        </section>

        {/* Mood Card */}
        <div className="bg-blush dark:bg-petal-950/30 rounded-[28px] p-5 relative overflow-hidden border border-petal-100 dark:border-petal-900/30">
          <LeafSprig className="absolute -bottom-3 -right-3 w-20 h-20 opacity-40 text-petal-300 dark:text-petal-900/50" />
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-blush-deep dark:text-petal-400" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-blush-deep dark:text-petal-400">Cum te simți azi?</p>
          </div>
          <p className="text-[13px] text-ink-soft dark:text-petal-300/80 mb-4">Alege dispoziția de azi. Nu există răspuns greșit.</p>
          
          <MoodPicker value={mood} onChange={(m) => { setMood(m); setResponse(null); }} compact />
          
          <div className="mt-5">
            <h3 className="text-sm font-bold text-ink-soft dark:text-petal-300 mb-3 flex items-center gap-1.5">
              <LeafSprig className="w-4 h-4" />
              Gândurile mele de azi
            </h3>
            <textarea 
              value={note}
              onChange={(e) => { setNote(e.target.value); setResponse(null); }}
              placeholder="Notează un gând, un simptom, sau o bucurie de azi..."
              className="w-full min-h-[120px] p-4 rounded-3xl bg-white/70 dark:bg-darkbg/50 border border-petal-200/60 dark:border-petal-900/40 text-[14px] resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-petal-300 transition-all disabled:opacity-70 shadow-sm" 
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`w-full mt-3 h-12 rounded-2xl text-white font-semibold shadow-sm disabled:opacity-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
              savedFlash === 'note' ? 'bg-sage-deep scale-[1.02]' : 'bg-petal-600 hover:bg-petal-600/90'
            }`}
          >
            {savedFlash === 'note' ? (
              <><Check className="w-5 h-5" strokeWidth={3} /> Salvat</>
            ) : saving ? "Salvez..." : noteSource ? "Actualizează nota de azi" : "Salvează în jurnal"}
          </button>
          {response && (
            <div role="status" className="mt-3 p-4 rounded-2xl bg-white/80 dark:bg-darkbg-card border border-petal-200/60 dark:border-petal-900/40 flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-blush-deep shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-ink dark:text-gray-100">Am salvat nota de azi.</p>
                <p className="text-[13px] text-ink dark:text-gray-100 leading-relaxed mt-0.5">{response.text}</p>
                {response.crisis && (
                  <a href="tel:112" className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-petal-700 hover:bg-petal-800 text-white text-sm font-bold">
                    <PhoneCall className="w-4 h-4" /> Sună la 112
                  </a>
                )}
                {(response.mood === 1 || response.crisis) && onOpenHelp && (
                  <button type="button" onClick={onOpenHelp} className="mt-2 text-xs font-semibold text-sage-deep dark:text-sage-300 underline">
                    Am nevoie de ajutor
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Form Toggle */}
        <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
          <div 
            onClick={() => setShowDetailedForm(!showDetailedForm)}
            className="flex items-center justify-between cursor-pointer select-none group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sage-50 dark:bg-sage-900/40 text-sage-600 dark:text-sage-300 flex items-center justify-center transition-transform group-hover:scale-105">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Formular detaliat simptome
                </h3>
                <p className="text-[11px] text-gray-500">
                  Bufeuri, dureri articulare, mucoase
                </p>
              </div>
            </div>
            <button type="button" className="text-gray-400 group-hover:text-sage-600 transition-colors">
              {showDetailedForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showDetailedForm && (
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-darkbg-border space-y-4 animate-fade-in">
              {/* Detailed Form Fields */}
              <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Bufeuri & Transpirații
                  </span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {hotFlashesCount} episoade azi
                  </span>
                </div>
                <div>
                  <input type="range" min="0" max="10" value={hotFlashesCount} onChange={(e) => setHotFlashesCount(parseInt(e.target.value))} className="w-full accent-sage-500 cursor-pointer" />
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>Intensitate bufeu:</span>
                  <strong className="text-gray-700 dark:text-gray-300">Scor {hotFlashesIntensity} / 5</strong>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <button type="button" key={val} onClick={() => setHotFlashesIntensity(val)} className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${hotFlashesIntensity === val ? 'bg-sage-600 text-white' : 'bg-white dark:bg-darkbg text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-darkbg-border'}`}>{val}</button>
                  ))}
                </div>
              </div>

              
              {/* Other Symptoms */}
              <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border space-y-4">
                
                {/* Dureri Articulare */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Dureri Articulare</span>
                    <span>Scor {jointPainLevel}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={jointPainLevel} onChange={(e) => setJointPainLevel(parseInt(e.target.value))} className="w-full accent-amber-500 cursor-pointer" />
                </div>

                {/* Dureri Osoase */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Dureri Osoase</span>
                    <span>Scor {bonePainLevel}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={bonePainLevel} onChange={(e) => setBonePainLevel(parseInt(e.target.value))} className="w-full accent-amber-600 cursor-pointer" />
                </div>

                {/* Nivel Oboseală / Energie */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Nivel Oboseală</span>
                    <span>Scor {fatigueLevel}/5</span>
                  </div>
                  <input type="range" min="0" max="5" aria-label="Nivel oboseală" value={fatigueLevel} onChange={(e) => setFatigueLevel(parseInt(e.target.value))} className="w-full accent-sage-500 cursor-pointer" />
                </div>

                {/* Ceață Mentală */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Ceață Mentală</span>
                    <span>Scor {brainFog}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={brainFog} onChange={(e) => setBrainFog(parseInt(e.target.value))} className="w-full accent-indigo-400 cursor-pointer" />
                </div>

                {/* Greață */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Greață</span>
                    <span>Scor {nauseaLevel}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={nauseaLevel} onChange={(e) => setNauseaLevel(parseInt(e.target.value))} className="w-full accent-teal-500 cursor-pointer" />
                </div>

                {/* Uscăciune Mucoasă/Vaginală */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Uscăciune Vaginală / Mucoase</span>
                    <span>Scor {mucosalDryness}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={mucosalDryness} onChange={(e) => setMucosalDryness(parseInt(e.target.value))} className="w-full accent-rose-400 cursor-pointer" />
                </div>
                
                {/* Dureri de cap */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Durere de cap (Cefalee)</span>
                    <span>Scor {headache}/5</span>
                  </div>
                  <input type="range" min="0" max="5" value={headache} onChange={(e) => setHeadache(parseInt(e.target.value))} className="w-full accent-purple-400 cursor-pointer" />
                </div>

                {/* Calitatea Somnului */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                    <span>Calitatea Somnului de azi-noapte</span>
                    <span>Scor {sleepQuality}/5</span>
                  </div>
                  <input type="range" min="1" max="5" value={sleepQuality} onChange={(e) => setSleepQuality(parseInt(e.target.value))} className="w-full accent-blue-400 cursor-pointer" />
                </div>

              </div>

              <button 
                onClick={handleSaveSymptoms}
                disabled={saving}
                className={`w-full h-12 rounded-2xl disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${
                  savedFlash === 'symptoms' ? 'bg-sage-deep scale-[1.02]' : 'bg-sage-600 hover:bg-sage-700'
                }`}>
                {savedFlash === 'symptoms' ? (
                  <><Check className="w-5 h-5" strokeWidth={3} /> Salvat</>
                ) : saving ? 'Salvez...' : 'Salvează simptomele'}
              </button>
            </div>
          )}
        </div>

        {/* PDF Export Section */}
        <div className="bg-gradient-to-r from-sage-500 to-sage-600 dark:from-sage-600 dark:to-sage-700 text-white rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-md">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-100 block">
              Rapoarte & Fise
            </span>
            <h3 className="text-sm font-bold mt-0.5">
              Documente Medicale
            </h3>
            <p className="text-[11px] text-sage-100 mt-1 leading-tight">
              Descarcă rezumatul pentru medicul oncolog sau fișa săptămânală.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                const list = JSON.parse(localStorage.getItem('navimed_shopping_list') || '[]');
                const exercise = parseInt(localStorage.getItem('navimed_exercise_minutes') || '45', 10);
                import('../lib/weeklyPdfGenerator')
                  .then(({ generateWeeklyPlannerPDF }) => generateWeeklyPlannerPDF(profile, list, exercise))
                  .catch(() => alert(PDF_LOAD_ERROR));
              }}
              className="bg-white/90 hover:bg-white text-sage-900 active:scale-95 px-3 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>Fișă frigider</span>
            </button>

            <button
              onClick={() => {
                import('../lib/pdfGenerator')
                  .then(({ generateOncologyReport }) => generateOncologyReport(profile, doses, symptoms))
                  .catch(() => alert(PDF_LOAD_ERROR));
              }}
              className="bg-white text-sage-800 hover:bg-sage-50 active:scale-95 px-3 py-2.5 rounded-2xl text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <FileDown className="w-4 h-4 text-sage-600" />
              <span>Raport oncolog</span>
            </button>
          </div>
        </div>

        {/* History Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 mt-2">
            <BookOpen className="w-4 h-4 text-sage-600 dark:text-sage-400" />
            <h2 className="font-serif text-lg text-gray-900 dark:text-white">Istoric</h2>
          </div>
          <div className="space-y-3">
            {sortedDates.length === 0 && (
              <div className="bg-white dark:bg-darkbg-surface rounded-3xl p-6 text-center border border-sage-100 dark:border-darkbg-border">
                <Leaf className="w-8 h-8 text-sage-200 dark:text-sage-800 mx-auto mb-2" />
                <p className="text-[13px] text-gray-500">Încă nu ai înregistrări. Prima ta notă va apărea aici.</p>
              </div>
            )}
            
            {sortedDates.map((date) => (
              <div key={date} className="bg-white dark:bg-darkbg-surface rounded-3xl p-4 border border-sage-100 dark:border-darkbg-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-sage-500 mb-3">{formatDateRo(date)}</p>
                <div className="space-y-3">
                  {historyGrouped[date].map((e) => {
                    const m = getMood(getMoodLevelFromState(e.mood_state));
                    const isSymptoms = e.kind === 'symptoms';
                    return (
                      <div key={e.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage-50 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300 flex items-center justify-center font-semibold text-xs border border-sage-200/60 dark:border-sage-800">
                          {isSymptoms ? <ClipboardList className="w-4 h-4" aria-hidden="true" /> : `${getMoodLevelFromState(e.mood_state)}/5`}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{isSymptoms ? 'Simptome' : m.label}</p>
                            {onDeleteSymptomLog && (
                              <button
                                type="button"
                                onClick={() => handleDelete(e)}
                                aria-label={isSymptoms ? 'Șterge simptomele' : 'Șterge nota'}
                                title={isSymptoms ? 'Șterge simptomele' : 'Șterge nota'}
                                className="tap-scale shrink-0 -mt-2.5 -mr-2 w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft hover:text-blush-deep transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {e.notes && <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{e.notes}</p>}
                          
                          {/* Show additional symptoms if logged */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {(e.hot_flashes_count || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Bufeuri: {e.hot_flashes_count} (Intensitate {e.hot_flashes_intensity}/5)
                              </span>
                            )}
                            {(e.joint_pain_level || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Articulații: {e.joint_pain_level}/5
                              </span>
                            )}
                            {(e.bone_pain_level || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Oase: {e.bone_pain_level}/5
                              </span>
                            )}
                            {(e.fatigue_level || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Oboseală: {e.fatigue_level}/5
                              </span>
                            )}
                            {(e.nausea_level || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Greață: {e.nausea_level}/5
                              </span>
                            )}
                            {(e.brain_fog || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Ceață mentală: {e.brain_fog}/5
                              </span>
                            )}
                            {(e.mucosal_dryness || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Uscăciune mucoase: {e.mucosal_dryness}/5
                              </span>
                            )}
                            {(e.headache || 0) > 0 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Cefalee: {e.headache}/5
                              </span>
                            )}
                            {e.sleep_quality !== undefined && e.sleep_quality !== 3 && (
                              <span className="text-[9px] font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
                                Somn: {e.sleep_quality}/5
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};