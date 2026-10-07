import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, Plus, Trash2, CheckCircle2, Circle, Stethoscope, HelpCircle } from 'lucide-react';

interface QuestionItem {
  id: string;
  question: string;
  category: 'tamoxifen' | 'imagistica' | 'analize' | 'general';
  isAnswered: boolean;
  notes?: string;
}

interface DoctorVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    question: 'Când este programată prima mamografie bilaterală de control după radioterapie?',
    category: 'imagistica',
    isAnswered: false,
    notes: 'De obicei la 6-12 luni post-radioterapie.'
  },
  {
    id: 'q2',
    question: 'Avem nevoie de ecografie transvaginală de rutină pentru monitorizarea grosimii endometrului?',
    category: 'tamoxifen',
    isAnswered: false,
    notes: 'Tamoxifenul stimulează ușor endometrul; se recomandă evaluare anuală sau la orice sângerare.'
  },
  {
    id: 'q3',
    question: 'Ce analize de sânge specifice verificăm (TGO/TGP, profil lipidic, calciu, fosfatază alcalină)?',
    category: 'analize',
    isAnswered: false,
    notes: 'Metabolizarea hepatică a Tamoxifenului necesită probe hepatice periodice.'
  },
  {
    id: 'q4',
    question: 'Dacă bufeurile nocturne se intensifică, putem discuta despre o opțiune non-hormonală (Venlafaxină)?',
    category: 'tamoxifen',
    isAnswered: false,
    notes: 'Inhibitor sigur fără impact pe CYP2D6.'
  },
  {
    id: 'q5',
    question: 'Când este indicată repetarea osteodensitometriei (scor DEXA) pentru sănătatea oaselor?',
    category: 'imagistica',
    isAnswered: false
  }
];

export const DoctorVisitModal: React.FC<DoctorVisitModalProps> = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const saved = localStorage.getItem('navimed_doctor_questions');
    return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
  });
  const [newQuestionText, setNewQuestionText] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('navimed_doctor_questions', JSON.stringify(questions));
  }, [questions]);

  if (!isOpen) return null;

  const toggleAnswered = (id: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, isAnswered: !q.isAnswered } : q));
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

    setQuestions([...questions, newItem]);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const answeredCount = questions.filter(q => q.isAnswered).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-sage-200 dark:border-darkbg-border overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-50 to-petal-50 dark:from-darkbg-card dark:to-darkbg-surface p-5 border-b border-sage-100 dark:border-darkbg-border flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                Pregătire pentru Consultația Oncologică
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Checklist cu întrebări esențiale pentru medicul tău
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors border border-gray-100 dark:border-darkbg-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Editable Control Date & Doctor Section */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>Programare Următorul Control</span>
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-300 font-semibold">Salvare automată</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Dată investigație / control:</label>
                <input
                  type="date"
                  value={localStorage.getItem('navimed_next_control_date') || '2026-11-18'}
                  onChange={(e) => {
                    localStorage.setItem('navimed_next_control_date', e.target.value);
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-blue-200 dark:border-darkbg-border text-xs text-gray-800 dark:text-gray-200 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Medic Curant / Clinică:</label>
                <input
                  type="text"
                  placeholder="ex: Dr. Maria Popescu"
                  defaultValue={localStorage.getItem('navimed_doctor_name') || 'Dr. Maria Popescu'}
                  onChange={(e) => {
                    localStorage.setItem('navimed_doctor_name', e.target.value);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-blue-200 dark:border-darkbg-border text-xs text-gray-800 dark:text-gray-200 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Progress Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-sage-50/80 dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/60 text-xs">
            <span className="text-sage-900 dark:text-sage-200 font-semibold">
              Progres discuție: {answeredCount} din {questions.length} lămurite
            </span>
            <span className="text-[11px] font-bold text-sage-700 dark:text-sage-300">
              {Math.round((answeredCount / (questions.length || 1)) * 100)}%
            </span>
          </div>

          {/* Questions list */}
          <div className="space-y-2.5">
            {questions.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.isAnswered
                    ? 'bg-gray-50/60 dark:bg-darkbg-card/50 border-gray-200 dark:border-darkbg-border opacity-70'
                    : 'bg-white dark:bg-darkbg-card border-gray-200/80 dark:border-darkbg-border shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <button
                    onClick={() => toggleAnswered(item.id)}
                    className="mt-0.5 text-sage-600 dark:text-sage-400 shrink-0 hover:scale-110 transition-transform"
                    title={item.isAnswered ? 'Marchează ca nelămurită' : 'Marchează ca discutată cu medicul'}
                  >
                    {item.isAnswered ? (
                      <CheckCircle2 className="w-5 h-5 text-sage-600 fill-sage-100 dark:fill-sage-900" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-relaxed ${
                      item.isAnswered
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.question}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 italic">
                        Context clinic: {item.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(item.id)}
                    className="text-gray-400 hover:text-rose-500 p-1 rounded-lg transition-colors shrink-0"
                    title="Șterge întrebarea"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom question form */}
          <form onSubmit={handleAddQuestion} className="pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adaugă o întrebare nouă pentru medic..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-2xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border focus:outline-none focus:border-sage-500 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adaugă</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-darkbg-card border-t border-gray-100 dark:border-darkbg-border flex justify-between items-center text-xs text-gray-500">
          <span>Întrebările sunt salvate automat în telefonul tău.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sage-600 text-white font-semibold text-xs"
          >
            Închide
          </button>
        </div>

      </div>
    </div>
  );
};
