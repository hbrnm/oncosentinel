import React, { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 4;
          } else {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  if (!isOpen) return null;

  const phaseInstruction = {
    inhale: { text: 'Inspiră lin pe nas...', subtitle: 'Umple plămânii și relaxează umerii', scale: 'scale-125' },
    hold: { text: 'Menține aerul blând...', subtitle: 'Observă senzația de calm interior', scale: 'scale-125' },
    exhale: { text: 'Expiră lent pe gură...', subtitle: 'Lasă tensiunea și căldura să se risipească', scale: 'scale-90' }
  }[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div role="dialog" aria-modal="true" aria-labelledby="breathing-title" className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute w-48 h-48 bg-sage-100 dark:bg-sage-900/30 rounded-full blur-3xl -top-10 -left-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Închide"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-deep dark:bg-darkbg-card flex items-center justify-center text-ink-soft hover:text-ink dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-1.5 text-xs text-sage-800 dark:text-sage-300 font-bold uppercase tracking-wider mb-1">
          <Wind className="w-4 h-4 text-sage-600" />
          <span id="breathing-title">Respirație lentă</span>
        </div>

        <p className="text-[11px] text-ink-soft dark:text-gray-400 mb-6 max-w-[240px]">
          Câteva minute de respirație lentă, pentru un moment de liniște.
        </p>

        {/* Breathing Circle Widget */}
        <div className="relative w-48 h-48 flex items-center justify-center my-2">
          {/* Outer Ripple */}
          <div
            className={`absolute inset-0 rounded-full bg-sage-100/60 dark:bg-sage-900/30 transition-transform duration-1000 ease-in-out ${
              phase === 'inhale' ? 'scale-110 opacity-70' : phase === 'hold' ? 'scale-110 opacity-90' : 'scale-95 opacity-30'
            }`}
          ></div>

          {/* Central Pulsing Sphere */}
          <div
            className={`w-36 h-36 rounded-full bg-gradient-to-tr from-sage-500 to-sage-400 dark:from-sage-600 dark:to-sage-500 shadow-xl shadow-sage-200 dark:shadow-none flex flex-col items-center justify-center text-white transition-all duration-1000 ease-in-out ${
              phaseInstruction.scale
            }`}
          >
            <span className="text-3xl font-extrabold tracking-tight">{secondsLeft}</span>
            <span className="text-[11px] font-medium tracking-wide opacity-90 uppercase mt-0.5">secunde</span>
          </div>
        </div>

        {/* Instruction Text */}
        <div className="mt-6 mb-4 min-h-[50px]">
          <h3 className="text-sm font-bold text-ink dark:text-white">
            {phaseInstruction.text}
          </h3>
          <p className="text-xs text-ink-soft dark:text-gray-400 mt-0.5">
            {phaseInstruction.subtitle}
          </p>
        </div>

        {/* Cycle Counter */}
        <div className="w-full pt-3 border-t border-warmborder dark:border-darkbg-border flex items-center justify-between text-xs text-ink-soft">
          <span>Cicluri completate: <strong className="text-ink dark:text-gray-200">{cycleCount}</strong></span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="text-sage-700 dark:text-sage-300 font-semibold hover:underline"
          >
            {isActive ? 'Pauză' : 'Reia'}
          </button>
        </div>

      </div>
    </div>
  );
};
