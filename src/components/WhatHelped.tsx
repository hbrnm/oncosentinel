import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { loadWhatHelped, saveWhatHelped } from '../lib/whatHelped';

// „Ce te-a ajutat altă dată” (planul 012): în Jurnal la o zi grea și în „Am nevoie de liniște acum”.
// hideWhenEmpty: în fereastra de liniște nu cerem să scrie ceva, arătăm doar ce are deja.
export const WhatHelped: React.FC<{ hideWhenEmpty?: boolean }> = ({ hideWhenEmpty }) => {
  const [items, setItems] = useState<string[]>(loadWhatHelped);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);

  if (hideWhenEmpty && items.length === 0) return null;

  const update = (list: string[]) => {
    setItems(list);
    saveWhatHelped(list);
  };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    update([...items, text]);
    setDraft('');
    setAdding(false);
    setSaved(true);
  };

  return (
    <section aria-labelledby="what-helped-title" className="mt-3 p-4 rounded-2xl bg-sage-soft/60 dark:bg-sage-900/20 border border-sage-100 dark:border-darkbg-border text-left">
      <h4 id="what-helped-title" className="text-[0.8125rem] font-semibold text-ink dark:text-gray-100">Ce te-a ajutat altă dată</h4>
      {items.length === 0 ? (
        <p className="text-[0.8125rem] text-ink-soft dark:text-gray-300 leading-relaxed mt-1">
          Ce te ajută într-o zi grea? Un om, un loc, o melodie. Scrie-le aici și ți le arăt când ai nevoie.
        </p>
      ) : (
        <ul className="mt-1.5 space-y-1 max-h-40 overflow-y-auto">
          {items.map((item, i) => (
            <li key={`${i}-${item}`} className="flex items-start gap-2 text-[0.8125rem] text-ink dark:text-gray-100">
              <span aria-hidden="true" className="mt-0.5">•</span>
              <span className="flex-1 min-w-0 break-words">{item}</span>
              <button
                type="button"
                onClick={() => { update(items.filter((_, j) => j !== i)); setSaved(false); }}
                aria-label={`Șterge „${item}”`}
                className="shrink-0 w-8 h-8 -my-1.5 rounded-full flex items-center justify-center text-ink-soft hover:text-ink dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {adding ? (
        <div className="mt-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
            maxLength={120}
            autoFocus
            aria-label="Ce te-a ajutat"
            placeholder="De exemplu: s-o sun pe sora mea"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-darkbg-card border border-sage-100 dark:border-darkbg-border text-[0.8125rem] text-ink dark:text-gray-100 placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" onClick={add} disabled={!draft.trim()} className="py-2 rounded-xl bg-sage-deep hover:bg-sage-800 text-white text-xs font-semibold disabled:opacity-50">
              Salvează
            </button>
            <button type="button" onClick={() => { setAdding(false); setDraft(''); }} className="py-2 rounded-xl border border-sage-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card text-ink dark:text-gray-100 text-xs font-semibold">
              Anulează
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => { setAdding(true); setSaved(false); }} className="mt-2 flex items-center gap-1 text-xs font-semibold text-sage-deep dark:text-sage-300 underline">
          <Plus className="w-3.5 h-3.5" /> Adaugă ceva
        </button>
      )}
      {saved && <p role="status" className="mt-2 text-xs text-ink-soft dark:text-gray-300">Am păstrat. Ți-l arăt când ai o zi grea.</p>}
    </section>
  );
};
