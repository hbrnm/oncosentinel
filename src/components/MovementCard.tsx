import React, { useState } from 'react';
import { Footprints } from 'lucide-react';
import { MAX_MOVEMENT_MINUTES } from '../lib/movement';
import { plural } from '../lib/summary';

// „Mișcare azi” (planul 014): doar minutele, fără țintă; totalul apare în „Săptămâna ta”
export const MovementCard: React.FC<{ savedMinutes?: number; onSave: (minutes: number) => void }> = ({ savedMinutes, onSave }) => {
  const [draft, setDraft] = useState(savedMinutes ? String(savedMinutes) : '');
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);

  const save = () => {
    const minutes = Number(draft);
    if (draft.trim() === '' || !Number.isInteger(minutes) || minutes < 0 || minutes > MAX_MOVEMENT_MINUTES) {
      setMessage({ error: true, text: `Scrie un număr de minute între 0 și ${MAX_MOVEMENT_MINUTES}.` });
      return;
    }
    onSave(minutes);
    setMessage({ error: false, text: `Am notat ${plural(minutes, 'minut', 'minute')} azi.` });
  };

  return (
    <section aria-labelledby="movement-title" className="bg-white dark:bg-darkbg-surface rounded-3xl p-5 border border-sage-100 dark:border-darkbg-border shadow-xs">
      <div className="flex items-center gap-2 mb-1">
        <Footprints className="w-4 h-4 text-sage-deep dark:text-sage-400" />
        <h2 id="movement-title" className="font-serif text-lg text-ink dark:text-white">Mișcare azi</h2>
      </div>
      <p className="text-[0.8125rem] text-ink-soft dark:text-gray-300 mb-3">
        Mers, yoga, grădină, orice fel de mișcare. Câte minute ai făcut azi?
      </p>
      <div className="flex flex-wrap gap-2">
        {[10, 20, 30].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setDraft(String(m)); setMessage(null); }}
            aria-pressed={draft === String(m)}
            className={`px-3 h-10 rounded-xl text-xs font-semibold border transition-colors ${
              draft === String(m)
                ? 'bg-sage-deep text-white border-sage-deep'
                : 'bg-white dark:bg-darkbg-card text-ink dark:text-gray-100 border-sage-100 dark:border-darkbg-border'
            }`}
          >
            {m} min
          </button>
        ))}
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_MOVEMENT_MINUTES}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setMessage(null); }}
          aria-label="Minute de mișcare azi"
          placeholder="Minute"
          className="w-24 h-10 px-3 rounded-xl bg-white dark:bg-darkbg-card border border-sage-100 dark:border-darkbg-border text-[0.8125rem] text-ink dark:text-gray-100 placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      </div>
      <button type="button" onClick={save} className="w-full mt-3 h-11 rounded-2xl bg-sage-deep hover:bg-sage-800 text-white text-sm font-semibold">
        {savedMinutes ? 'Actualizează' : 'Salvează'}
      </button>
      {message && (
        <p role={message.error ? 'alert' : 'status'} className={`mt-2 text-xs ${message.error ? 'text-rose-700 dark:text-rose-300' : 'text-ink-soft dark:text-gray-300'}`}>
          {message.text}
        </p>
      )}
    </section>
  );
};
