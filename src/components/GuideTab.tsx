import React, { useState } from 'react';
import { 
  Search, AlertOctagon, CheckCircle2, AlertTriangle, 
  Apple, Dumbbell, Sparkles, ShieldAlert, BookOpen, HeartHandshake, Bone, Utensils 
} from 'lucide-react';
import { searchInteractions } from '../lib/interactions';
import { DrugInteraction } from '../types';
import { RecipesSection } from './RecipesSection';
import { ExerciseSection } from './ExerciseSection';

interface GuideTabProps {
  onOpenRedFlags: () => void;
}

export const GuideTab: React.FC<GuideTabProps> = ({ onOpenRedFlags }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'interactions' | 'recipes' | 'exercise' | 'intimate' | 'bones' | 'nutrition' | 'skincare'>('recipes');

  const interactions: DrugInteraction[] = searchInteractions(searchQuery);

  const getRiskBadge = (level: DrugInteraction['riskLevel'], label: string) => {
    switch (level) {
      case 'CONTRAINDICATED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-rose-600 dark:text-rose-400" /> {label}
          </span>
        );
      case 'CAUTION':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" /> {label}
          </span>
        );
      case 'SAFE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {label}
          </span>
        );
    }
  };

  const navItems = [
    { id: 'recipes' as const, label: 'Rețete & Meniu', icon: Utensils },
    { id: 'exercise' as const, label: 'Sport & Mobilitate', icon: Dumbbell },
    { id: 'interactions' as const, label: 'Interacțiuni', icon: Search },
    { id: 'intimate' as const, label: 'Intim & Mucoase', icon: HeartHandshake },
    { id: 'bones' as const, label: 'Oase & DEXA', icon: Bone },
    { id: 'nutrition' as const, label: 'Ghid Nutriție', icon: Apple },
    { id: 'skincare' as const, label: 'Piele & RT', icon: Sparkles }
  ];

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      
      {/* Scrollable Sub-navigation tabs */}
      <div className="flex gap-1.5 overflow-x-auto p-1 bg-gray-100 dark:bg-darkbg-card rounded-2xl text-[11px] scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`py-2 px-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-darkbg-surface text-sage-900 dark:text-sage-200 shadow-xs font-semibold'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Sub-Tab: Recipes & Meal Ideas */}
      {activeSubTab === 'recipes' && (
        <RecipesSection />
      )}

      {/* 2. Sub-Tab: Exercise & Mobility */}
      {activeSubTab === 'exercise' && (
        <ExerciseSection />
      )}

      {/* 3. Sub-Tab: Drug & Herb Interactions */}
      {activeSubTab === 'interactions' && (
        <div className="space-y-3.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Caută supliment sau medicament (ex: Sunătoare, Venlafaxină, Paroxetină)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-darkbg-surface border border-sage-100 dark:border-darkbg-border focus:outline-none focus:border-sage-500 text-gray-900 dark:text-white shadow-xs"
            />
          </div>

          <div className="bg-sage-50/70 dark:bg-sage-900/30 p-3 rounded-2xl border border-sage-200/80 dark:border-sage-800/60 text-xs text-gray-700 dark:text-gray-200">
            <strong>Ghid CYP2D6:</strong> Tamoxifenul are nevoie de o enzimă hepatică (CYP2D6) pentru a deveni activ. Evită antidepresivele puternic inhibitoare (Paroxetină, Fluoxetină) și folosește alternative sigure precum Venlafaxina.
          </div>

          <div className="space-y-2.5">
            {interactions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-darkbg-surface p-4 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                    {item.substance}
                  </h4>
                  {getRiskBadge(item.riskLevel, item.riskLabel)}
                </div>

                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Mecanism:</strong> {item.mechanism}
                </p>

                <div className="p-2.5 rounded-xl bg-gray-50/80 dark:bg-darkbg-card text-[11px] text-gray-700 dark:text-gray-300 space-y-1 border border-gray-100 dark:border-darkbg-border">
                  <div><strong>Recomandare:</strong> {item.recommendation}</div>
                  <div className="text-gray-500 dark:text-gray-400">{item.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sub-Tab: Intimate Health & Mucosal Hydration (Non-Hormonal) */}
      {activeSubTab === 'intimate' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <HeartHandshake className="w-5 h-5 text-petal-600 dark:text-petal-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Sănătatea Intimă & Uscăciunea Mucoaselor (Ghid Non-Hormonal)
            </h3>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200">
            <strong>Regulă de Aur Oncologică:</strong> În cancerul mamar cu receptori estrogenici pozitivi (ER+), nu se utilizează ovule sau creme vaginale cu estrogeni fără aprobarea explicită a medicului oncolog curant.
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                💧 1. Hidratante Vaginale pe Bază de Acid Hialuronic
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Gelurile sau ovulele cu acid hialuronic cu masă moleculară mică și policarbofil refac bariera de hidratare fără niciun conținut hormonal. Se aplică de 2–3 ori pe săptămână pentru refacerea troficității mucoasei.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🌿 2. Lubrifianți pe Bază de Silicon sau Apă Pură
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Pentru confort în viața intimă, folosește lubrifianți neutri, fără parfum, parabeni sau substanțe încălzitoare/răcoritoare iritante.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🥑 3. Ulei de Cătină (Omega-7)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Acizii grași Omega-7 (acid palmitoleic) din cătină susțin hidratarea fiziologică a tuturor epiteliilor și mucoaselor (ochi uscați, gură uscată, mucoasă vaginală).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sub-Tab: Bone Health & DEXA */}
      {activeSubTab === 'bones' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <Bone className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Sănătatea Oaselor & Monitorizarea DEXA
            </h3>
          </div>

          <div className="p-3 bg-sage-50 dark:bg-sage-900/30 border border-sage-200 dark:border-sage-800/60 rounded-2xl text-[11px] text-gray-700 dark:text-gray-200">
            <strong>Particularitate Tamoxifen:</strong> La femeile aflate la menopauză, Tamoxifenul are un efect <em>estrogen-agonist</em> benefic pe os (ajută la conservarea densității osoase), însă monitorizarea rămâne esențială.
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                📊 Osteodensitometria (DEXA)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Recomandată ca evaluare de bază la începerea hormonoterapiei, apoi repetată la fiecare 1–2 ani conform indicației medicului.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                ☀️ Vitamina D3 + Vitamina K2
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Ținta optimă serică de 25-OH-Vitamina D este între 40–60 ng/ml. Vitamina K2 (MK-7) asigură direcționarea calciului în matricea osoasă și previne depunerea în vasele de sânge.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-darkbg-card border border-gray-100 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🏃‍♀️ Stimul Mecanic: Exerciții cu Greutatea Corpului
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Mersul pe jos în pas vioi, urcatul scărilor și genuflexiunile ușoare transmit unde de impact osului, stimulând osteoblastele să sintetizeze țesut osos nou.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-Tab: Nutrition */}
      {activeSubTab === 'nutrition' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <Apple className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Nutriție Integrativă în Tratamentul cu Tamoxifen
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🥦 1. Legume Crucifere (Zilnic)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Broccoli, conopidă, varză, rucola, varză de Bruxelles. Conțin <em>sulforafan</em> și <em>indol-3-carbinol</em>, care sprijină ficatul în faza a II-a de detoxifiere a metaboliților estrogenici.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🌾 2. Fibre Solubile & Microbiom
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Ovăz, semințe de in măcinate (1 lingură/zi), leguminoase. Fibrele leagă excesul de estrogeni eliminați în bilă și previn reabsorbția lor intestinală (circulația enterohepatică).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                💧 3. Hidratare & Răcorire pentru Bufeuri
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Minim 2-2.5 litri de apă/zi. Redu consumul de cafea fierbinte, alcool și condimente iuți, deoarece acestea activează direct centrul termoregulator hipotalamic, declanșând bufeuri.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Sub-Tab: Skincare post-RT */}
      {activeSubTab === 'skincare' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <Sparkles className="w-5 h-5 text-petal-600 dark:text-petal-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Ghidul Pielii după Radioterapie
            </h3>
          </div>

          <div className="space-y-2.5 text-gray-600 dark:text-gray-300">
            <p>• <strong>Emoliente neutre:</strong> Aplică zilnic creme hidratante fără parfum, fără parabeni și fără alcool (ex. pe bază de ceramide sau acid hialuronic).</p>
            <p>• <strong>Protecție UV maximă:</strong> Pielea iradiată rămâne fotosensibilă timp de minim 1-2 ani. Folosește cremă cu SPF 50+ dacă zona este expusă la soare.</p>
            <p>• <strong>Haine lejere:</strong> Bumbac moale 100%, fără sutiene cu armătură metalică dură care ar putea crea frecare pe cicatrice sau pe zona tratată.</p>
          </div>
        </div>
      )}

      {/* Emergency Red Flags Button - High contrast */}
      <button
        onClick={onOpenRedFlags}
        className="w-full py-3.5 px-4 rounded-3xl bg-rose-50/90 dark:bg-darkbg-card hover:bg-rose-100 dark:hover:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/50 text-xs font-medium flex items-center justify-between transition-all shadow-xs"
      >
        <span className="flex items-center gap-2 text-rose-950 dark:text-rose-100 font-semibold text-left">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Semnale de Alarmă Medicale (Când suni medicul)</span>
        </span>
        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-xl shrink-0">
          Vezi &rarr;
        </span>
      </button>

    </div>
  );
};
