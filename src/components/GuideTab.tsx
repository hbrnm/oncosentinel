import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText,
  ShieldCheck,
  Utensils,
  Pill,
  Search,
  Ban,
  MessageCircle
} from 'lucide-react';
import { RenderMarkdown } from './Markdown';

import { CLINICAL_GUIDES, NEWS_PROTOCOLS as CLINICAL_NEWS, ClinicalGuide, NewsProtocol } from '../data/guides';
import { RECIPES } from '../data/recipes';
import { searchInteractions } from '../lib/interactions';
import { useBackToClose } from '../lib/backNavigation';

export interface GuideTabProps {
  onOpenRedFlags: () => void;
}

type GuideCategory = 'clinical' | 'news' | 'nutrition' | 'medicines';

export const GuideTab: React.FC<GuideTabProps> = ({ onOpenRedFlags }) => {
  const [selectedGuide, setSelectedGuide] = useState<Omit<ClinicalGuide, 'category'> | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsProtocol | null>(null);
  const [activeCategory, setActiveCategory] = useState<GuideCategory>('clinical');
  const [medicineQuery, setMedicineQuery] = useState<string>('');
  // Back pe telefon închide ghidul sau știrea deschisă
  useBackToClose(selectedGuide !== null, () => setSelectedGuide(null));
  useBackToClose(selectedNews !== null, () => setSelectedNews(null));
  const medicines = searchInteractions(medicineQuery);

  if (selectedGuide) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setSelectedGuide(null)}
            className="tap-scale w-10 h-10 rounded-full bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border flex items-center justify-center shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink dark:text-white" />
          </button>
          <span className="text-[13px] text-ink-soft dark:text-gray-300 font-medium">
            Înapoi
          </span>
        </div>

        <div className="organic-card rounded-3xl overflow-hidden">
          {selectedGuide.image_url && (
            <img src={selectedGuide.image_url} alt="Cover" className="w-full h-48 object-cover object-center" />
          )}
          <div className="p-6">
          <span className="micro-label text-sage-deep dark:text-sage-300">{selectedGuide.tag}</span>
          <h1 className="font-serif text-2xl text-ink dark:text-white mt-2 leading-tight">
            {selectedGuide.title}
          </h1>
          <p className="text-[14px] text-ink-soft dark:text-gray-300 mt-3 leading-relaxed font-sans">
            {selectedGuide.summary}
          </p>
          <div className="h-px bg-warmborder/60 dark:bg-darkbg-border my-5" />
          <div className="text-[14px]">
            <RenderMarkdown content={selectedGuide.content} />
          </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedNews) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setSelectedNews(null)}
            className="tap-scale w-10 h-10 rounded-full bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border flex items-center justify-center shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-ink dark:text-white" />
          </button>
          <span className="text-[13px] text-ink-soft dark:text-gray-300 font-medium">
            Înapoi
          </span>
        </div>

        <div className="organic-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-sage-soft dark:bg-sage-900/60 flex items-center justify-center text-sage-deep dark:text-sage-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] text-ink-soft dark:text-gray-400 font-medium">{selectedNews.date}</span>
          </div>
          <h1 className="font-serif text-2xl text-ink dark:text-white mt-1 leading-tight">
            {selectedNews.title}
          </h1>
          <p className="text-[14px] text-ink-soft dark:text-gray-300 mt-3 leading-relaxed">
            {selectedNews.summary}
          </p>
          <div className="h-px bg-warmborder/60 dark:bg-darkbg-border my-5" />
          <div className="text-[13px] text-ink dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {selectedNews.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="px-2 pt-1 pb-4 relative">
        <h1 className="font-heading text-2xl text-gray-900 dark:text-white">Ghiduri</h1>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Informații clinice, nutriție și medicamente.</p>
        
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          <button 
            onClick={() => setActiveCategory('clinical')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeCategory === 'clinical' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Ghiduri Clinice
          </button>
          <button 
            onClick={() => setActiveCategory('news')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeCategory === 'news' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Noutăți
          </button>
          <button 
            onClick={() => setActiveCategory('nutrition')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeCategory === 'nutrition' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Nutriție & Rețete
          </button>
          <button 
            onClick={() => setActiveCategory('medicines')}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${activeCategory === 'medicines' ? 'bg-sage-deep text-white shadow-md' : 'bg-white text-ink-soft border border-warmborder dark:bg-darkbg-surface dark:border-darkbg-border dark:text-gray-300'}`}
          >
            Medicamente
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {activeCategory === 'clinical' && (
          <section className="animate-fade-in">
            <div className="space-y-3">
              {CLINICAL_GUIDES.map((g) => (
                <button 
                  key={g.id} 
                  onClick={() => setSelectedGuide(g)}
                  className="tap-scale organic-card rounded-3xl overflow-hidden text-left w-full flex flex-col cursor-pointer"
                >
                  {g.image_url && (
                    <div className="relative h-36 w-full">
                      <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur text-[9px] font-semibold uppercase tracking-wider text-sage-deep">
                        {g.tag}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {!g.image_url && <p className="micro-label mb-1 text-sage-deep dark:text-sage-400">{g.tag}</p>}
                      <h3 className="font-heading text-[16px] text-ink dark:text-white leading-snug">{g.title}</h3>
                      <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{g.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-soft/50 dark:text-gray-500 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'news' && (
          <section className="animate-fade-in">
            <div className="space-y-3">
              {CLINICAL_NEWS.map((n) => (
                <button 
                  key={n.id} 
                  onClick={() => setSelectedNews(n)}
                  className="tap-scale organic-card rounded-3xl p-4 text-left w-full flex items-start gap-3.5 cursor-pointer"
                >
                  <span className="flex-shrink-0 w-11 h-11 rounded-2xl bg-sage-soft dark:bg-sage-900/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-sage-deep dark:text-sage-300" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="micro-label text-sage-deep dark:text-sage-400">Noutăți</span>
                      <span className="text-[10px] text-ink-soft/70 dark:text-gray-500">• </span>
                      <span className="text-[10px] text-ink-soft/70 dark:text-gray-500">{n.date}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-ink dark:text-white mt-1 leading-snug">{n.title}</p>
                    {n.summary && <p className="text-[11.5px] text-ink-soft dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">{n.summary}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-soft/50 dark:text-gray-500 flex-shrink-0 mt-3" />
                </button>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'nutrition' && (
          <section className="animate-fade-in">
            <div className="space-y-3">
              {RECIPES.map((g) => (
                <button 
                  key={g.id} 
                  onClick={() => setSelectedGuide(g)}
                  className="tap-scale organic-card rounded-3xl overflow-hidden text-left w-full flex flex-col cursor-pointer"
                >
                  {g.image_url && (
                    <div className="relative h-36 w-full">
                      <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur text-[9px] font-semibold uppercase tracking-wider text-sage-deep">
                        {g.tag}
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {!g.image_url && <p className="micro-label mb-1 text-sage-deep dark:text-sage-400">{g.tag}</p>}
                      <h3 className="font-heading text-[16px] text-ink dark:text-white leading-snug">{g.title}</h3>
                      <p className="text-[12px] text-ink-soft dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{g.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-soft/50 dark:text-gray-500 flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'medicines' && (
          <section className="animate-fade-in space-y-3">
            <p className="text-[12px] text-ink dark:text-gray-200 bg-sage-soft dark:bg-sage-900/30 p-3 rounded-2xl border border-sage-200/80 dark:border-sage-800/40 leading-relaxed">
              Medicamente și suplimente care contează în timpul tratamentului cu tamoxifen. Lista nu e completă: verifică întotdeauna cu medicul sau farmacistul înainte să începi ceva nou.
            </p>
            <label className="relative block">
              <span className="sr-only">Caută un medicament sau un supliment</span>
              <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                placeholder="Caută: ex. paroxetină, sunătoare"
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl text-[13px] bg-white dark:bg-darkbg-card border border-warmborder dark:border-darkbg-border text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </label>
            {medicines.length === 0 && (
              <p className="text-[12px] text-ink-soft dark:text-gray-400 px-1">
                Nu am găsit „{medicineQuery}” în listă. Asta nu înseamnă că e sigur: întreabă medicul sau farmacistul.
              </p>
            )}
            {medicines.map((item) => (
              <div key={item.substance} className="organic-card rounded-3xl p-4">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${item.level === 'avoid' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : 'bg-blush text-ink dark:bg-petal-950/40 dark:text-petal-200'}`}>
                  {item.level === 'avoid' ? <Ban className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                  {item.levelLabel}
                </span>
                <h3 className="font-heading text-[15px] text-ink dark:text-white leading-snug mt-2 flex items-start gap-1.5">
                  <Pill className="w-4 h-4 text-sage-deep mt-0.5 shrink-0" />
                  {item.substance}
                </h3>
                <p className="text-[12.5px] text-ink-soft dark:text-gray-300 mt-1.5 leading-relaxed">{item.advice}</p>
                <p className="text-[10.5px] text-ink-soft/80 dark:text-gray-500 mt-2 italic">Sursa: {item.source}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};
