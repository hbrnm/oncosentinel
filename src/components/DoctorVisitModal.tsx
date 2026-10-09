import React, { useState, useEffect } from 'react';
import {
  X, Plus, Trash2, CheckCircle2, Circle, CalendarHeart, Clock, MapPin, MessageSquarePlus, Check, XCircle, History, FileDown, ClipboardList
} from 'lucide-react';
import { PatientProfile, DoseLog, SymptomLog } from '../types';
import { doctorSummary, plural, controlDateLabel } from '../lib/summary';
import { loadAppointments, saveAppointments, lastControlDate } from '../lib/appointments';
import { loadMedicines, medicineLabel } from '../lib/myMedicines';
const daysUntil = (dateStr?: string) => {
  if (!dateStr) return null;
  const target = new Date(dateStr + (dateStr.length <= 10 ? 'T00:00:00' : ''));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (isNaN(target.getTime())) return null;
  return Math.round((target.getTime() - today.getTime()) / 86400000);
};

export interface QuestionItem {
  id: string;
  question: string;
  category?: 'tamoxifen' | 'imagistica' | 'analize' | 'general';
  isAnswered: boolean;
  notes?: string;
}

export interface AppointmentItem {
  id: string;
  date: string;
  time?: string;
  specialty: string;
  doctor?: string;
  center?: string;
  status: 'upcoming' | 'completed' | 'missed' | 'cancelled';
  completedAt?: string;
}

interface DoctorVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'today' | 'timeline' | 'symptoms' | 'guide') => void;
  profile?: PatientProfile;
  doses?: DoseLog[];
  symptoms?: SymptomLog[];
}

export const DoctorVisitModal: React.FC<DoctorVisitModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToTab,
  profile,
  doses = [],
  symptoms = []
}) => {
  // Tab within appointments: 'upcoming' or 'history'
  const [apptTab, setApptTab] = useState<'upcoming' | 'history'>('upcoming');

  // 1. Appointments list state
  const [appointments, setAppointments] = useState<AppointmentItem[]>(loadAppointments);
  const [fromLastControl, setFromLastControl] = useState<boolean>(false);

  // 2. Questions list state (Empty by default per user request - no preset questions)
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const saved = localStorage.getItem('navimed_doctor_questions_custom');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 3. Form dialog states
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: '',
    time: '09:00',
    specialty: 'Oncologie',
    doctor: '',
    center: ''
  });

  const [newQuestionText, setNewQuestionText] = useState('');

  // Re-sync appointments from localStorage whenever the modal is opened
  useEffect(() => {
    if (!isOpen) return;
    setAppointments(loadAppointments());
  }, [isOpen]);

  // Persist appointments and update legacy key for Dashboard sync
  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  // Persist questions
  useEffect(() => {
    localStorage.setItem('navimed_doctor_questions_custom', JSON.stringify(questions));
  }, [questions]);

  if (!isOpen) return null;

  const handleSaveAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptForm.date) return;

    const newAppt: AppointmentItem = {
      id: `appt_${Date.now()}`,
      date: apptForm.date,
      time: apptForm.time,
      specialty: apptForm.specialty || 'Oncologie',
      doctor: apptForm.doctor,
      center: apptForm.center,
      status: 'upcoming'
    };

    setAppointments(prev => [...prev, newAppt].sort((a, b) => a.date.localeCompare(b.date)));
    setShowAddAppt(false);
    setApptForm({ date: '', time: '09:00', specialty: 'Oncologie', doctor: '', center: '' });
  };

  const handleDeleteAppt = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleMarkCompleted = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  const handleMarkMissed = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'missed',
          completedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  const handleRestoreUpcoming = (id: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'upcoming'
        };
      }
      return a;
    }));
  };

  const toggleAnswered = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isAnswered: !q.isAnswered } : q));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newItem: QuestionItem = {
      id: `q_${Date.now()}`,
      question: newQuestionText.trim(),
      category: 'general',
      isAnswered: false
    };

    setQuestions(prev => [...prev, newItem]);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming' && (daysUntil(a.date) ?? 0) >= 0);
  const historyAppts = appointments.filter(a => a.status === 'completed' || a.status === 'missed' || (a.status === 'upcoming' && (daysUntil(a.date) ?? 0) < 0));
  const answeredCount = questions.filter(q => q.isAnswered).length;
  // „Pentru medic”: ultimele 4 săptămâni (texte aprobate, docs/etapa2-texte.md)
  // sau de la ultimul control (planul 005, texte aprobate 2026-10-09)
  const lastControl = lastControlDate(appointments);
  const since = fromLastControl && lastControl ? lastControl : undefined;
  const otherMedicines = loadMedicines();
  const forDoctor = doctorSummary(symptoms, doses, profile?.tamoxifen_start_date || '', since);

  const handleDownloadReport = () => {
    if (!profile) return;
    import('../lib/pdfGenerator')
      .then(({ generateOncologyReport }) => generateOncologyReport(profile, doses, symptoms, since))
      .catch(() => alert('Nu am putut pregăti PDF-ul. Verifică conexiunea la internet și încearcă din nou.'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-cream dark:bg-darkbg-surface w-full max-w-md rounded-[32px] shadow-2xl border border-warmborder dark:border-darkbg-border overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header - Base44 Calm Warm Style */}
        <div className="px-6 pt-5 pb-4 bg-white/70 dark:bg-darkbg-card/70 border-b border-warmborder dark:border-darkbg-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-soft dark:bg-sage-900/60 text-sage-deep dark:text-sage-300 flex items-center justify-center shadow-xs">
              <CalendarHeart className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink dark:text-white leading-tight">
                Controale Medicale
              </h2>
              <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5">
                Programările tale și întrebările pentru medic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tap-scale w-9 h-9 rounded-full bg-white dark:bg-darkbg-card flex items-center justify-center text-ink-soft hover:text-ink dark:hover:text-white transition-colors border border-warmborder dark:border-darkbg-border cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* SECȚIUNEA 1: CARDUL CONTROALE MEDICALE (Exact ca în Base44 Profil) */}
          <div className="organic-card rounded-[28px] p-5 border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <CalendarHeart className="w-4 h-4 text-sage-deep dark:text-sage-300" />
                <p className="micro-label">CONTROALE MEDICALE</p>
              </div>
              <button 
                onClick={() => setShowAddAppt(prev => !prev)}
                className="tap-scale w-8 h-8 rounded-full bg-sage-soft dark:bg-sage-900/60 text-sage-deep dark:text-sage-300 flex items-center justify-center cursor-pointer hover:bg-sage-200 transition-colors"
                title="Adaugă un control nou"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Form de adăugare inline dacă se apasă pe + */}
            {showAddAppt && (
              <form onSubmit={handleSaveAppt} className="mb-4 p-4 rounded-2xl bg-cream-deep/80 dark:bg-darkbg-surface/80 border border-warmborder dark:border-darkbg-border space-y-3 animate-fade-in">
                <h4 className="font-serif text-xs font-bold text-ink dark:text-white">Adaugă control nou</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">Data:</label>
                    <input
                      type="date"
                      value={apptForm.date}
                      onChange={e => setApptForm({ ...apptForm, date: e.target.value })}
                      required
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-xs text-ink dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">Ora:</label>
                    <input
                      type="time"
                      value={apptForm.time}
                      onChange={e => setApptForm({ ...apptForm, time: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-xs text-ink dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">Specialitate:</label>
                    <input
                      type="text"
                      placeholder="ex: Oncologie"
                      value={apptForm.specialty}
                      onChange={e => setApptForm({ ...apptForm, specialty: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-xs text-ink dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">Medic:</label>
                    <input
                      type="text"
                      placeholder="ex: Dr. Maria Popescu"
                      value={apptForm.doctor}
                      onChange={e => setApptForm({ ...apptForm, doctor: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-xs text-ink dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-ink-soft dark:text-gray-400 block mb-1">Centru / Spital:</label>
                  <input
                    type="text"
                    placeholder="ex: Institutul Oncologic"
                    value={apptForm.center}
                    onChange={e => setApptForm({ ...apptForm, center: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-xs text-ink dark:text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAppt(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-ink-soft hover:bg-warmborder transition-colors cursor-pointer"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-sage hover:bg-sage-deep text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Salvează controlul
                  </button>
                </div>
              </form>
            )}

            {/* Sub-tabs: Următoarele controale vs Istoric */}
            <div className="flex rounded-2xl bg-cream-deep/80 dark:bg-darkbg-surface/80 p-1 mb-3.5 border border-warmborder/80 dark:border-darkbg-border">
              <button
                type="button"
                onClick={() => setApptTab('upcoming')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  apptTab === 'upcoming'
                    ? 'bg-white dark:bg-darkbg-card text-ink dark:text-white shadow-xs'
                    : 'text-ink-soft dark:text-gray-400 hover:text-ink'
                }`}
              >
                Viitoare ({upcomingAppts.length})
              </button>
              <button
                type="button"
                onClick={() => setApptTab('history')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  apptTab === 'history'
                    ? 'bg-white dark:bg-darkbg-card text-ink dark:text-white shadow-xs'
                    : 'text-ink-soft dark:text-gray-400 hover:text-ink'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Istoric ({historyAppts.length})
              </button>
            </div>

            {/* TAB 1: CONTROALE VIITOARE */}
            {apptTab === 'upcoming' && (
              <div className="space-y-2.5">
                {upcomingAppts.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-cream-deep/50 dark:bg-darkbg-surface/50 border border-dashed border-warmborder dark:border-darkbg-border text-center">
                    <p className="text-[13px] text-ink-soft dark:text-gray-400">
                      Niciun control viitor.
                    </p>
                    <p className="text-[11px] text-ink-soft/70 dark:text-gray-500 mt-1">
                      Apasă pe butonul + de mai sus pentru a adăuga următoarea programare.
                    </p>
                  </div>
                ) : (
                  upcomingAppts.map((a) => {
                    const d = daysUntil(a.date);
                    const dateObj = new Date(a.date + 'T00:00');
                    const monthName = isNaN(dateObj.getTime()) ? 'LUNA' : dateObj.toLocaleDateString('ro-RO', { month: 'short' });
                    const dayNum = isNaN(dateObj.getTime()) ? '-' : dateObj.getDate();

                    return (
                      <div key={a.id} className="p-3.5 rounded-2xl bg-cream-deep/60 dark:bg-darkbg-surface/50 border border-warmborder/60 dark:border-darkbg-border space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-darkbg-card flex flex-col items-center justify-center shadow-xs">
                            <span className="text-[9.5px] text-ink-soft dark:text-gray-400 font-bold uppercase tracking-tight">
                              {monthName}
                            </span>
                            <span className="font-serif text-lg text-sage-deep dark:text-sage-300 font-bold leading-none mt-0.5">
                              {dayNum}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-ink dark:text-white leading-tight">
                              {a.specialty}
                            </p>
                            {a.doctor && (
                              <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5 font-medium">
                                {a.doctor}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[11px] text-ink-soft/80 dark:text-gray-400">
                              {a.time && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-sage-light" /> {a.time}
                                </span>
                              )}
                              {a.center && (
                                <span className="flex items-start gap-1">
                                  <MapPin className="w-3 h-3 text-sage-light shrink-0 mt-0.5" aria-hidden="true" />
                                  <span>{a.center}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {d !== null && d >= 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                d === 0
                                  ? 'bg-petal-200 text-petal-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold'
                                  : d === 1
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-sage-soft text-sage-deep dark:bg-sage-900/60 dark:text-sage-300'
                              }`}>
                                {d === 0 ? 'Azi' : d === 1 ? 'Mâine' : `peste ${d} zile`}
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteAppt(a.id)}
                              className="text-ink-soft/50 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                              title="Șterge definitiv controlul"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Butoane de marcare respectare control */}
                        <div className="pt-2 border-t border-warmborder/60 dark:border-darkbg-border flex items-center justify-between gap-2">
                          <span className="text-[10.5px] text-ink-soft dark:text-gray-400 font-medium">Ai fost la control?</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(a.id)}
                              className="tap-scale px-2.5 py-1 rounded-xl bg-sage hover:bg-sage-deep text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                              title="Marchează ca efectuat"
                            >
                              <Check className="w-3 h-3" /> Am fost
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkMissed(a.id)}
                              className="tap-scale px-2.5 py-1 rounded-xl bg-cream-deep dark:bg-darkbg-card hover:bg-rose-50 dark:hover:bg-rose-950/30 text-ink-soft hover:text-rose-600 dark:text-gray-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer border border-warmborder dark:border-darkbg-border transition-colors"
                              title="Marchează ca ratat"
                            >
                              <XCircle className="w-3 h-3" /> Nu am ajuns
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: ISTORIC CONTROALE */}
            {apptTab === 'history' && (
              <div className="space-y-2.5">
                {historyAppts.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-cream-deep/50 dark:bg-darkbg-surface/50 border border-dashed border-warmborder dark:border-darkbg-border text-center">
                    <p className="text-[13px] text-ink-soft dark:text-gray-400">
                      Nu există încă controale în istoric.
                    </p>
                    <p className="text-[11px] text-ink-soft/70 dark:text-gray-500 mt-1">
                      Când marchezi o programare ca efectuată sau ratată, va fi salvată aici.
                    </p>
                  </div>
                ) : (
                  historyAppts.map((a) => {
                    const dateObj = new Date(a.date + 'T00:00');
                    const formattedDate = !isNaN(dateObj.getTime())
                      ? dateObj.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })
                      : a.date;
                    const isCompleted = a.status === 'completed';

                    return (
                      <div key={a.id} className="p-3 rounded-2xl bg-cream-deep/50 dark:bg-darkbg-surface/40 border border-warmborder/60 dark:border-darkbg-border flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}>
                              {isCompleted ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isCompleted ? 'Efectuat' : 'Neefectuat'}
                            </span>
                            <span className="text-[11px] text-ink-soft dark:text-gray-400 font-medium">
                              {formattedDate}
                            </span>
                          </div>

                          <p className="text-[13px] font-semibold text-ink dark:text-white mt-1">
                            {a.specialty}
                          </p>
                          {(a.doctor || a.center) && (
                            <p className="text-[11.5px] text-ink-soft dark:text-gray-400 mt-0.5">
                              {a.doctor ? `${a.doctor} • ` : ''}{a.center || ''}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRestoreUpcoming(a.id)}
                            className="text-[11px] text-sage-deep dark:text-sage-300 hover:underline px-2 py-1 cursor-pointer font-medium"
                            title="Mută înapoi la programări viitoare"
                          >
                            Reactivează
                          </button>
                          <button
                            onClick={() => handleDeleteAppt(a.id)}
                            className="text-ink-soft/50 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                            title="Șterge din istoric"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* SECȚIUNEA 2: ÎNTREBĂRILE MELE PENTRU MEDIC (Curate, fără presetări, customizate de pacientă) */}
          <div className="organic-card rounded-[28px] p-5 border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-sage-deep dark:text-sage-300" />
                <p className="micro-label">ÎNTREBĂRI PENTRU MEDIC</p>
              </div>
              {questions.length > 0 && (
                <span className="text-[11px] font-semibold text-sage-deep dark:text-sage-300">
                  {answeredCount} din {questions.length} lămurite
                </span>
              )}
            </div>

            {/* Formular adăugare întrebare nouă */}
            <form onSubmit={handleAddQuestion} className="flex gap-2">
              <input
                type="text"
                placeholder="Scrie o întrebare pentru consultație..."
                value={newQuestionText}
                onChange={e => setNewQuestionText(e.target.value)}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-2xl text-xs bg-cream dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border focus:outline-none focus:border-sage text-ink dark:text-white"
              />
              <button
                type="submit"
                className="tap-scale px-4 py-2.5 rounded-2xl bg-sage hover:bg-sage-deep text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adaugă</span>
              </button>
            </form>

            {/* Listă de întrebări */}
            <div className="space-y-2">
              {questions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-cream dark:bg-darkbg-surface/50 border border-dashed border-warmborder dark:border-darkbg-border text-center">
                  <p className="text-xs text-ink-soft dark:text-gray-400">
                    Nu ai adăugat încă întrebări pentru medic.
                  </p>
                  <p className="text-[11px] text-ink-soft/70 dark:text-gray-500 mt-1">
                    Notează aici tot ce vrei să discuți la următoarea consultație (efecte secundare, analize etc.).
                  </p>
                </div>
              ) : (
                questions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      item.isAnswered
                        ? 'bg-cream/70 dark:bg-darkbg-surface/40 border-warmborder dark:border-darkbg-border opacity-65'
                        : 'bg-cream/70 dark:bg-darkbg-surface/70 border-warmborder dark:border-darkbg-border shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <button
                        onClick={() => toggleAnswered(item.id)}
                        className="mt-0.5 text-sage dark:text-sage-400 shrink-0 hover:scale-110 transition-transform cursor-pointer"
                        title={item.isAnswered ? 'Marchează ca nelămurită' : 'Marchează ca discutată cu medicul'}
                      >
                        {item.isAnswered ? (
                          <CheckCircle2 className="w-4 h-4 text-sage fill-sage-soft dark:fill-sage-950" />
                        ) : (
                          <Circle className="w-4 h-4 text-ink-soft/70" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-relaxed ${
                          item.isAnswered
                            ? 'line-through text-ink-soft/70 dark:text-gray-500'
                            : 'text-ink dark:text-white'
                        }`}>
                          {item.question}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(item.id)}
                        className="text-ink-soft/70 hover:text-rose-500 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Șterge întrebarea"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECȚIUNEA 3: PENTRU MEDIC */}
          {profile && (
            <section aria-labelledby="for-doctor-title" className="organic-card rounded-[28px] p-5 border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-sage-deep dark:text-sage-300" />
                <h3 id="for-doctor-title" className="micro-label">Pentru medic</h3>
              </div>
              {lastControl ? (
                <div role="group" aria-label="Perioada" className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-sage-soft dark:bg-darkbg-surface">
                  {[
                    { value: false, label: 'Ultimele 4 săptămâni' },
                    { value: true, label: 'De la ultimul control' }
                  ].map(option => (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={fromLastControl === option.value}
                      onClick={() => setFromLastControl(option.value)}
                      className={`tap-scale py-2 px-2 rounded-xl text-[12px] font-semibold ${fromLastControl === option.value ? 'bg-sage-deep text-white' : 'text-ink dark:text-gray-200'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <p className="text-[12px] text-ink-soft dark:text-gray-400">
                {since
                  ? `Ce ai notat de la controlul din ${controlDateLabel(since)} (${plural(forDoctor.days, 'zi', 'zile')}). Poți arăta ecranul sau descărca raportul.`
                  : 'Ce ai notat în ultimele 4 săptămâni. Poți arăta ecranul sau descărca raportul.'}
              </p>
              {!lastControl && (
                <p className="text-[11px] text-ink-soft dark:text-gray-400">
                  După primul control trecut în „Controale medicale”, vei putea alege și perioada de la ultimul control.
                </p>
              )}
              <ul className="space-y-1.5 text-[13px] text-ink dark:text-gray-100">
                <li>Doza marcată ca luată: {forDoctor.doses.taken} din {plural(forDoctor.doses.total, 'zi', 'zile')}.</li>
                <li>Note în jurnal: {forDoctor.notes}.</li>
                {forDoctor.mood && (
                  <li>Starea notată cel mai des: {forDoctor.mood.label} ({plural(forDoctor.mood.count, 'notă', 'note')}).</li>
                )}
                <li>
                  {forDoctor.top.length > 0 ? (
                    <>
                      Ce ai notat cel mai des:
                      <ul className="mt-1 ml-4 list-disc space-y-0.5">
                        {forDoctor.top.map((line) => <li key={line}>{line}</li>)}
                      </ul>
                    </>
                  ) : 'Nu ai notat simptome.'}
                </li>
                <li>Întrebări încă nediscutate: {questions.length - answeredCount}.</li>
                {otherMedicines.length > 0 && (
                  <li>Alte medicamente: {otherMedicines.map(m => medicineLabel(m)).join('; ')}.</li>
                )}
              </ul>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="tap-scale w-full py-2.5 rounded-xl bg-sage-deep hover:bg-sage-800 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" /> Descarcă raportul PDF
              </button>
              <p className="text-[11px] text-ink-soft dark:text-gray-400 italic">Datele sunt cele notate de tine; o zi nemarcată nu înseamnă neapărat doză omisă.</p>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white/70 dark:bg-darkbg-card border-t border-warmborder dark:border-darkbg-border flex justify-between items-center text-xs text-ink-soft dark:text-gray-400">
          <span className="text-[11px]">Se salvează automat în telefon.</span>
          <button
            onClick={onClose}
            className="tap-scale px-4 py-2 rounded-xl bg-sage hover:bg-sage-deep text-white font-semibold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Închide
          </button>
        </div>

      </div>
    </div>
  );
};
