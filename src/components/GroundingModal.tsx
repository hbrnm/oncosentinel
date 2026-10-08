import React, { useState } from 'react';
import { X, Sparkles, Eye, Hand, Ear, Smile, Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroundingModal: React.FC<GroundingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [personalReflection, setPersonalReflection] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps = [
    {
      number: 5,
      title: '5 Lucruri pe care le Vezi',
      icon: Eye,
      color: 'bg-blue-500',
      instruction: 'Uită-te atent în jurul tău și observă 5 detalii vizuale mici: o reflexie de lumină, textura unei pături, o plantă, o culoare caldă.',
      prompt: 'Observă-le fără să le judeci. Adu-ți privirea complet în prezent.'
    },
    {
      number: 4,
      title: '4 Lucruri pe care le Poți Atinge',
      icon: Hand,
      color: 'bg-emerald-500',
      instruction: 'Concentrează-te pe 4 senzații tactile: tălpile sprijinite ferm pe podea, atingerea hainelor de bumbac pe umeri, un inel, suprafața netedă a telefonului.',
      prompt: 'Simte greutatea corpului tău ancorată și în siguranță pe scaun sau pat.'
    },
    {
      number: 3,
      title: '3 Sunete pe care le Auzi',
      icon: Ear,
      color: 'bg-purple-500',
      instruction: 'Ascultă cu atenție 3 sunete distincte: ticăitul unui ceas, un foșnet din depărtare, propria ta respirație lentă și regulată.',
      prompt: 'Sunetele vin și pleacă, exact ca gândurile și bufeurile trecătoare.'
    },
    {
      number: 2,
      title: '2 Mirosuri pe care le Simți',
      icon: Sparkles,
      color: 'bg-amber-500',
      instruction: 'Inspiră adânc pe nas. Poate simți parfumul unui ceai de mușețel, aerul proaspăt de la fereastră sau aroma unei creme hidratante blânde.',
      prompt: 'Inspiră aer proaspăt și lasă corpul să se răcorească natural.'
    },
    {
      number: 1,
      title: '1 Gând de Recunoștință pentru Corpul Tău',
      icon: Heart,
      color: 'bg-rose-500',
      instruction: 'Amintește-ți că organismul tău s-a vindecat după operație și radioterapie și că fiecare celulă lucrează în fiecare secundă pentru protecția ta.',
      prompt: 'Scrie un scurt gând de blândețe pentru tine astăzi:'
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Soft decorative glow */}
        <div className="absolute w-40 h-40 bg-petal-100 dark:bg-petal-900/20 rounded-full blur-3xl -top-10 -right-10 pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 dark:bg-darkbg-card flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <>
            {/* Step Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sage-800 dark:text-sage-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span>Metoda de Ancorare 5-4-3-2-1</span>
            </div>

            {/* Stepper Dots */}
            <div className="flex gap-1.5 mb-5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-sage-600'
                      : idx < currentStep
                      ? 'bg-sage-300 dark:bg-sage-700'
                      : 'bg-gray-200 dark:bg-darkbg-card'
                  }`}
                />
              ))}
            </div>

            {/* Step Icon & Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-2xl ${current.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pasul {currentStep + 1} din 5</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {current.title}
                </h3>
              </div>
            </div>

            {/* Instruction Body */}
            <div className="space-y-2 mb-4 bg-gray-50/70 dark:bg-darkbg-card p-3.5 rounded-2xl border border-gray-100 dark:border-darkbg-border text-xs leading-relaxed">
              <p className="text-gray-700 dark:text-gray-200">
                {current.instruction}
              </p>
              <p className="text-gray-500 dark:text-gray-400 italic text-[11px]">
                {current.prompt}
              </p>

              {currentStep === 4 && (
                <textarea
                  rows={2}
                  value={personalReflection}
                  onChange={(e) => setPersonalReflection(e.target.value)}
                  placeholder="Ex: Îi sunt recunoscătoare corpului meu că este puternic și se reface în fiecare zi..."
                  className="w-full p-2.5 mt-2 rounded-xl text-xs bg-white dark:bg-darkbg-surface border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-white focus:outline-none focus:border-sage-500"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentStep === 0
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-card'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Înapoi</span>
              </button>

              <button
                onClick={handleNext}
                className="py-2.5 px-4 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>{currentStep === 4 ? 'Finalizează' : 'Următorul'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* Completion State */
          <div className="text-center py-4 space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-sage-100 dark:bg-sage-900/60 text-sage-600 dark:text-sage-300 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Ești ancorată și în siguranță
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
              Ți-ai oferit un moment de respiro. Amintește-ți că poți reveni oricând la această tehnică.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-sage-500 hover:bg-sage-600 text-white font-bold text-xs shadow-xs"
            >
              Înapoi la OncoSentinel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
