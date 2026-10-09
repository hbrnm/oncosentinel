import React, { useState } from 'react';
import { 
  Heart, Sparkles, User, Clock, Pill, Calendar, 
  ShieldCheck, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { PatientProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  profile?: PatientProfile;
  onComplete: (configuredProfile: PatientProfile, nextControlDate: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  profile, 
  onComplete 
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(profile?.full_name || '');
  const [reminderTime, setReminderTime] = useState<string>(profile?.daily_reminder_time || '08:30');
  const [dose, setDose] = useState<string>(profile?.medication_dose || '20 mg');
  const [pillStock, setPillStock] = useState<number | ''>(profile?.pill_stock_count ?? 30);
  const [tamoxifenStartDate, setTamoxifenStartDate] = useState<string>(profile?.tamoxifen_start_date || new Date().toISOString().slice(0, 10));
  const [controlDate, setControlDate] = useState<string>(() => localStorage.getItem('navimed_next_control_date') || '');

  React.useEffect(() => {
    if (isOpen && profile) {
      if (profile.full_name) setName(profile.full_name);
      if (profile.daily_reminder_time) setReminderTime(profile.daily_reminder_time);
      if (profile.medication_dose) setDose(profile.medication_dose);
      if (profile.pill_stock_count !== undefined) setPillStock(profile.pill_stock_count);
      if (profile.tamoxifen_start_date) setTamoxifenStartDate(profile.tamoxifen_start_date);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleFinish = () => {
    const configuredProfile: PatientProfile = {
      ...(profile || {
        full_name: '',
        histology: '',
        stage: '',
        er_status: '',
        pr_status: '',
        her2_status: '',
        tamoxifen_start_date: new Date().toISOString().slice(0, 10),
        pill_stock_count: 30,
        daily_reminder_time: '08:30',
        oncologist_email: ''
      }),
      full_name: name.trim() || profile?.full_name || '',
      tamoxifen_start_date: tamoxifenStartDate,
      pill_stock_count: pillStock === '' ? 0 : Number(pillStock),
      daily_reminder_time: reminderTime,
      medication_dose: dose.trim() || profile?.medication_dose || '20 mg'
    };

    onComplete(configuredProfile, controlDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-modal">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl relative overflow-hidden">
        
        {/* Soft Background Decorative Glow */}
        <div className="absolute w-44 h-44 bg-sage-100 dark:bg-sage-900/30 rounded-full blur-3xl -top-12 -right-12 pointer-events-none"></div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-sage' : 'bg-warmborder dark:bg-gray-700'}`}></div>
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-sage' : 'bg-warmborder dark:bg-gray-700'}`}></div>
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-sage' : 'bg-warmborder dark:bg-gray-700'}`}></div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
            Pasul {step} din 3
          </span>
        </div>

        {/* STEP 1: Welcome & Patient Name */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sage-500 to-sage-400 text-white flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 fill-white/90" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-ink dark:text-white leading-tight">
                Bine ai venit în OncoSentinel
              </h3>
              <p className="text-xs text-ink-soft dark:text-gray-300 mt-1 leading-relaxed">
                Ghidul tău personalizat pentru protecție, aderență la tratament și supraveghere medicală activă.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                Cum dorești să te numim în aplicație?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-soft/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Introdu numele tău..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-sage-50 dark:bg-sage-900/30 border border-sage-200/80 dark:border-sage-800/60 text-xs text-ink-soft dark:text-gray-300">
              <div className="flex items-center gap-1.5 font-bold text-sage-800 dark:text-sage-300 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-sage-600" />
                <span>Pentru tine, după DCIS</span>
              </div>
              <p className="text-[11px]">
                Aplicația este optimizată special pentru pacienta post-chirurgie și radioterapie, aflată în tratament cu tamoxifen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-2xl bg-sage hover:bg-sage-deep active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sage-200 dark:shadow-none transition-all"
            >
              <span>Continuă spre Alerte & Orar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Tamoxifen Reminder & Stock */}
        {step === 2 && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-ink dark:text-white leading-tight">
                  Tratamentul cu tamoxifen
                </h3>
                <p className="text-[11px] text-ink-soft">Ora și stocul de pastile</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                La ce oră iei de obicei pastila?
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-ink-soft/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500 font-bold"
                  required
                />
              </div>
              <p className="text-[10px] text-ink-soft mt-0.5">
                Ia-l la aceeași oră în fiecare zi: e mai ușor să nu uiți.
              </p>
            </div>

            <div>
              <label htmlFor="onboarding-dose" className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                Ce doză ți-a prescris medicul?
              </label>
              <input
                id="onboarding-dose"
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500 font-bold"
              />
              <p className="text-[10px] text-ink-soft mt-0.5">
                Scrie cum apare pe rețetă.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                  Stoc pastile (cutie):
                </label>
                <input
                  type="number"
                  min="0"
                  value={pillStock}
                  placeholder="Număr pastile"
                  onChange={(e) => {
                    const val = e.target.value;
                    setPillStock(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                  Data de început:
                </label>
                <input
                  type="date"
                  value={tamoxifenStartDate}
                  onChange={(e) => setTamoxifenStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:border-sage-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-2xl bg-cream-deep dark:bg-darkbg-card text-ink dark:text-gray-300 font-semibold text-xs"
              >
                Înapoi
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-2xl bg-sage hover:bg-sage-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sage-200 dark:shadow-none"
              >
                <span>Spre Supraveghere</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Surveillance Control Date & Finish */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-ink dark:text-white leading-tight">
                  Supraveghere Imagistică (6 Luni)
                </h3>
                <p className="text-[11px] text-ink-soft">Mamografie bilaterală & Ecografie</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-ink dark:text-gray-300 block mb-1">
                Data următorului control programat:
              </label>
              <input
                type="date"
                value={controlDate}
                onChange={(e) => setControlDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl text-xs bg-cream dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white font-bold focus:outline-none focus:border-sage-500"
              />
              <p className="text-[10px] text-ink-soft mt-1">
                Aplicația va afișa automat numărătoarea inversă a zilelor rămase și te va ajuta să pregătești întrebările pentru medic.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Totul este configurat!</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Toate aceste setări pot fi modificate oricând ulterior din profilul tău. Datele rămân private pe telefonul tău.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl bg-cream-deep dark:bg-darkbg-card text-ink dark:text-gray-300 font-semibold text-xs"
              >
                Înapoi
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="w-2/3 py-3 rounded-2xl bg-sage hover:bg-sage-deep active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pornește OncoSentinel</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
