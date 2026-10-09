import React, { useState } from 'react';
import { Ban, MessageCircle, Info, Plus, Trash2, X, Store } from 'lucide-react';
import { OtherMedicine } from '../types';
import { findInteraction } from '../lib/interactions';
import { loadMedicines, saveMedicines, medicineLabel } from '../lib/myMedicines';
import { useBackToClose } from '../lib/backNavigation';

interface OtherMedicinesProps {
  /** „Tamoxifen 20 mg din 1 iulie 2025” (sau fără dată, dacă lipsește) */
  treatmentLine: string;
}

const inputClass = 'w-full h-11 px-3.5 rounded-xl border border-warmborder dark:border-darkbg-border bg-white dark:bg-darkbg-card text-[14px] text-ink dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sage';
const labelClass = 'block text-[12px] font-semibold text-ink-soft dark:text-gray-300 mb-1';

// „Medicamentele mele” (planul 007): celelalte medicamente, doar notate, comparate cu lista aprobată de interacțiuni
export const OtherMedicines: React.FC<OtherMedicinesProps> = ({ treatmentLine }) => {
  const [medicines, setMedicines] = useState<OtherMedicine[]>(loadMedicines);
  const [adding, setAdding] = useState(false);
  const [showPharmacist, setShowPharmacist] = useState(false);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [when, setWhen] = useState('');
  const [reason, setReason] = useState('');
  useBackToClose(adding, () => setAdding(false));
  useBackToClose(showPharmacist, () => setShowPharmacist(false));

  const update = (list: OtherMedicine[]) => {
    setMedicines(list);
    saveMedicines(list);
  };

  const openForm = () => {
    setName(''); setDose(''); setWhen(''); setReason('');
    setAdding(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update([...medicines, {
      id: `med_${Date.now()}`,
      name: name.trim(),
      dose: dose.trim() || undefined,
      when: when.trim() || undefined,
      reason: reason.trim() || undefined
    }]);
    setAdding(false);
  };

  const handleDelete = (m: OtherMedicine) => {
    if (confirm(`Sigur ștergi „${m.name}” din listă?`)) {
      update(medicines.filter(x => x.id !== m.id));
    }
  };

  return (
    <section aria-labelledby="other-medicines-title" className="organic-card rounded-3xl p-5">
      <h2 id="other-medicines-title" className="micro-label mb-2">Alte medicamente pe care le iau</h2>

      {medicines.length === 0 ? (
        <p className="text-[13px] text-ink-soft dark:text-gray-300 leading-relaxed">
          Nu ai notat alte medicamente. Adaugă-le aici, ca să le ai la îndemână la medic și la farmacie.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {medicines.map(m => {
            const match = findInteraction(m.name);
            return (
              <li key={m.id} className="rounded-2xl bg-white/70 dark:bg-darkbg-card/70 border border-warmborder dark:border-darkbg-border p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-ink dark:text-white break-words">
                      {[m.name, m.dose].filter(Boolean).join(' ')}
                    </p>
                    {(m.when || m.reason) && (
                      <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-0.5 break-words">
                        {[m.when, m.reason].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(m)}
                    className="tap-scale shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                    aria-label={`Șterge ${m.name}`}
                    title={`Șterge ${m.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {match ? (
                  <div className="mt-2.5 pt-2.5 border-t border-warmborder dark:border-darkbg-border">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${match.level === 'avoid' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-blush text-ink dark:bg-petal-950/40 dark:text-petal-200'}`}>
                      {match.level === 'avoid' ? <Ban className="w-3 h-3" aria-hidden="true" /> : <MessageCircle className="w-3 h-3" aria-hidden="true" />}
                      {match.levelLabel}
                    </span>
                    <p className="text-[13px] text-ink dark:text-gray-200 mt-1.5 leading-relaxed">{match.advice}</p>
                    <p className="text-[13px] text-ink dark:text-gray-200 mt-1 leading-relaxed font-medium">
                      Vorbește cu medicul înainte să schimbi ceva.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2.5 pt-2.5 border-t border-warmborder dark:border-darkbg-border text-[12px] text-ink-soft dark:text-gray-400 leading-relaxed flex gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Nu e în lista noastră scurtă de interacțiuni cu tamoxifenul. Lista nu e completă: întreabă farmacistul sau medicul.</span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap gap-2 mt-3.5">
        <button
          type="button"
          onClick={openForm}
          className="tap-scale px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-sage hover:bg-sage-deep text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Adaugă un medicament
        </button>
        {medicines.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPharmacist(true)}
            className="tap-scale px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-white/70 dark:bg-darkbg-card/70 text-sage-deep dark:text-sage-300 border border-sage-200 dark:border-sage-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Store className="w-4 h-4" aria-hidden="true" /> Arată farmacistului
          </button>
        )}
      </div>

      {adding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div role="dialog" aria-labelledby="add-medicine-title" className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-warmborder dark:border-darkbg-border mb-4">
              <h3 id="add-medicine-title" className="font-serif text-lg font-normal text-ink dark:text-white">
                Adaugă un medicament
              </h3>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                aria-label="Închide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label htmlFor="med-name" className={labelClass}>Numele medicamentului</label>
                <input id="med-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="med-dose" className={labelClass}>Doza (opțional)</label>
                <input id="med-dose" type="text" value={dose} onChange={(e) => setDose(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="med-when" className={labelClass}>Când îl iei (opțional)</label>
                <input id="med-when" type="text" value={when} onChange={(e) => setWhen(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="med-reason" className={labelClass}>Pentru ce (opțional)</label>
                <input id="med-reason" type="text" value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass} />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-warmborder dark:border-darkbg-border mt-4">
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-ink-soft dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-[13px] font-semibold bg-sage hover:bg-sage-deep text-white shadow-xs transition-colors cursor-pointer"
                >
                  Salvează
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPharmacist && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div role="dialog" aria-label="Arată farmacistului" className="bg-white dark:bg-darkbg-surface w-full max-w-sm rounded-3xl p-6 border border-sage-200 dark:border-darkbg-border shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-end -mt-2 -mr-2">
              <button
                type="button"
                onClick={() => setShowPharmacist(false)}
                className="p-1 rounded-full text-ink-soft hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors cursor-pointer"
                aria-label="Închide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-[20px] leading-snug text-ink dark:text-white font-serif break-words">
              <p>Iau {treatmentLine}.</p>
              <p>Iau și: {medicines.map(m => medicineLabel(m, false)).join(', ')}.</p>
              <p>Pot lua aceste medicamente împreună?</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
