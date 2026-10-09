import React, { useState } from 'react';
import { X, Wind, Heart } from 'lucide-react';

export type CalmStep = 'welcome' | 'check';

interface CalmModalProps {
  step: CalmStep | null;
  onClose: () => void;
  onBreathe: () => void;
  onNeedHelp: () => void;
}

// „Am nevoie de liniște acum”: un mesaj cald → respirație → „Te simți puțin mai liniștită?”
export const CalmModal: React.FC<CalmModalProps> = ({ step, onClose, onBreathe, onNeedHelp }) => {
  const [feelsBetter, setFeelsBetter] = useState<boolean>(false);

  if (!step) return null;

  const close = () => {
    setFeelsBetter(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="calm-title"
        className="bg-cream dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-warmborder dark:border-darkbg-border shadow-2xl text-center relative"
      >
        <button
          onClick={close}
          aria-label="Închide"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-darkbg-card flex items-center justify-center text-ink-soft hover:text-ink dark:hover:text-white border border-warmborder dark:border-darkbg-border"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-sage-soft text-sage-deep dark:bg-sage-900/40 dark:text-sage-300 flex items-center justify-center mb-4">
          <Heart className="w-6 h-6" />
        </div>

        {step === 'welcome' && (
          <>
            <h2 id="calm-title" className="font-serif text-xl text-ink dark:text-white">Ești aici. E în regulă.</h2>
            <p className="text-sm text-ink-soft dark:text-gray-300 mt-2 leading-relaxed">
              Ce simți acum e greu, și e firesc. Hai să respirăm puțin împreună, în ritmul tău.
            </p>
            <button
              type="button"
              onClick={onBreathe}
              className="mt-5 w-full py-3 rounded-2xl bg-sage-deep hover:bg-sage-800 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" /> Respiră cu mine
            </button>
            <button type="button" onClick={onNeedHelp} className="mt-3 text-xs font-semibold text-sage-deep dark:text-sage-300 underline">
              Am nevoie de ajutor acum
            </button>
          </>
        )}

        {step === 'check' && !feelsBetter && (
          <>
            <h2 id="calm-title" className="font-serif text-xl text-ink dark:text-white">Te simți puțin mai liniștită?</h2>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFeelsBetter(true)}
                className="py-3 rounded-2xl bg-sage-deep hover:bg-sage-800 text-white text-sm font-semibold"
              >
                Da, puțin
              </button>
              <button
                type="button"
                onClick={onNeedHelp}
                className="py-3 rounded-2xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-ink dark:text-gray-100 text-sm font-semibold"
              >
                Nu încă
              </button>
            </div>
          </>
        )}

        {step === 'check' && feelsBetter && (
          <>
            <h2 id="calm-title" className="font-serif text-xl text-ink dark:text-white">Mă bucur.</h2>
            <p className="text-sm text-ink-soft dark:text-gray-300 mt-2">Poți reveni aici oricând.</p>
            <button type="button" onClick={close} className="mt-5 w-full py-3 rounded-2xl bg-sage-deep hover:bg-sage-800 text-white text-sm font-semibold">
              Închide
            </button>
          </>
        )}
      </div>
    </div>
  );
};
