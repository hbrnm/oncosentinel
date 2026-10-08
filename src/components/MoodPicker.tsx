import React from 'react';
import { MOOD_LABELS } from '../lib/mood';

// Aceleași etichete și aceeași ordine (1 → 5) ca pe Astăzi
export const MOODS = [
  { level: 1, label: MOOD_LABELS[1], emoji: "😢", feedback: "E ok să nu fie ok. Te auzim și te sprijinim. Nu ești singură în asta." },
  { level: 2, label: MOOD_LABELS[2], emoji: "😔", feedback: "Îmi pare rău că azi e mai greu. Fii blândă cu tine — și mâine e o nouă zi." },
  { level: 3, label: MOOD_LABELS[3], emoji: "😐", feedback: "Zilele neutre sunt și ele normale. Nu trebuie să simți mereu ceva deosebit." },
  { level: 4, label: MOOD_LABELS[4], emoji: "🙂", feedback: "E bine să te simți bine. Micile bucurii contează enorm în fiecare zi." },
  { level: 5, label: MOOD_LABELS[5], emoji: "😊", feedback: "Mă bucur că te simți bine. Continuă să ai grijă de tine cu aceeași blândețe." },
];

export const getMood = (level: number) => MOODS.find((m) => m.level === level) || MOODS[2];

interface MoodPickerProps {
  value: number | null;
  onChange?: (level: number) => void;
  compact?: boolean;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({ value, onChange, compact = false }) => {
  const selected = value ? getMood(value) : null;
  
  return (
    <div>
      <div className={`flex items-center justify-between ${compact ? "gap-1.5" : "gap-2"}`}>
        {MOODS.map((m) => {
          const active = value === m.level;
          return (
            <button 
              key={m.level} 
              type="button" 
              onClick={() => onChange?.(m.level)}
              aria-pressed={active} 
              aria-label={m.label}
              className="tap-scale flex flex-col items-center gap-2 group cursor-pointer"
            >
              <span className={`flex items-center justify-center rounded-full transition-all duration-300 font-semibold text-sm ${
                compact ? "w-11 h-11" : "w-12 h-12"
              } ${
                active
                  ? "bg-sage-600 text-white scale-105 shadow-md ring-4 ring-sage-100 dark:ring-sage-900"
                  : "bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 group-hover:bg-stone-50"
              }`}>
                {m.level}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                active ? "text-sage-700 dark:text-sage-300" : "text-gray-500"
              }`}>{m.label}</span>
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-4 px-1">
          <p className="text-[13px] leading-relaxed text-gray-500 font-body italic animate-fade-in">
            {selected.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
