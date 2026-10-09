import React, { useState } from 'react';
import { X, Calendar, Activity, Check } from 'lucide-react';
import { ClinicalMilestone, MilestoneCategory } from '../types';

interface MilestoneModalProps {
  milestone?: ClinicalMilestone; // If provided, edit mode
  onClose: () => void;
  onSave: (m: ClinicalMilestone) => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose, onSave }) => {
  const [title, setTitle] = useState(milestone?.title || '');
  const [category, setCategory] = useState<MilestoneCategory>(milestone?.category || 'diagnostic');
  const [date, setDate] = useState(milestone?.event_date?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(milestone?.description || '');

  const categories: { value: MilestoneCategory, label: string }[] = [
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'chirurgie', label: 'Chirurgie' },
    { value: 'radioterapie', label: 'Radioterapie' },
    { value: 'terapie_adjuvanta', label: 'Terapie Adjuvantă' }
  ];

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: milestone?.id || `m_${Date.now()}`,
      category,
      title: title.trim(),
      event_date: date,
      description: description.trim(),
      key_details: milestone?.key_details || {}
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-modal">
      <div className="w-full max-w-sm bg-white dark:bg-darkbg-card rounded-3xl p-5 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-cream-deep dark:bg-darkbg-surface text-ink-soft hover:bg-warmborder transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-sage" />
          <h2 className="text-lg font-bold text-ink dark:text-white">
            {milestone ? 'Editează Eveniment' : 'Adaugă Eveniment'}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-soft dark:text-gray-300 mb-1">
              Titlu Eveniment
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Operație conservatoare" 
              className="w-full px-3 py-2 bg-cream dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border rounded-xl text-sm focus:outline-none focus:border-sage text-ink dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-soft dark:text-gray-300 mb-1">
              Categorie
            </label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value as MilestoneCategory)} 
              className="w-full px-3 py-2 bg-cream dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border rounded-xl text-sm focus:outline-none focus:border-sage text-ink dark:text-white"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-soft dark:text-gray-300 mb-1">
              Data (Aproximativă)
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full pl-9 pr-3 py-2 bg-cream dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border rounded-xl text-sm focus:outline-none focus:border-sage text-ink dark:text-white"
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-ink-soft/70" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-soft dark:text-gray-300 mb-1">
              Descriere (Opțional)
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detalii despre eveniment..." 
              rows={3}
              className="w-full px-3 py-2 bg-cream dark:bg-darkbg-surface border border-warmborder dark:border-darkbg-border rounded-xl text-sm focus:outline-none focus:border-sage text-ink dark:text-white resize-none"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full h-11 mt-2 bg-sage hover:bg-sage-deep text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" /> Salvează
          </button>
        </div>
      </div>
    </div>
  );
};
