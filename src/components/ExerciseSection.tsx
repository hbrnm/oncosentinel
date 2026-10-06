import React, { useState } from 'react';
import { 
  Activity, Dumbbell, ShieldCheck, Heart, Sparkles, 
  ChevronRight, AlertCircle, ArrowUpRight, Flame, Smile, Check 
} from 'lucide-react';

export const ExerciseSection: React.FC<{ onNavigateToTracker?: () => void }> = ({ onNavigateToTracker }) => {
  const [activeCategory, setActiveCategory] = useState<'toate' | 'umăr' | 'oase' | 'cardio' | 'siguranta'>('toate');

  const exercises = [
    {
      id: 'ex1',
      category: 'umăr',
      title: 'Urcarea Degetelor pe Perete (Wall Climbing)',
      target: 'Mobilitate umăr & flexibilitate pectorală (Post-Lumpectomie & Radioterapie)',
      time: '5-7 min zilnic',
      instructions: [
        'Stai cu fața la un perete la o distanță de aproximativ 20 cm.',
        'Așază degetele ambelor mâini pe perete la nivelul taliei.',
        'Urcă degetele încet pe perete, ca un păianjen, cât mai sus posibil fără a simți durere ascuțită.',
        'Când ajungi la punctul maxim confortabil, menține poziția timp de 15 secunde și respiră adânc.',
        'Coboară degetele lent la poziția inițială. Repetă de 5 ori.'
      ],
      benefit: 'Previne retracția capsulei articulare a umărului și fibroza țesuturilor moi iradiate.'
    },
    {
      id: 'ex2',
      category: 'umăr',
      title: 'Deschiderea Toracică din Șezut (Chest Opener)',
      target: 'Extensie posturală și eliberarea tensiunii pectorale',
      time: '3-5 min',
      instructions: [
        'Așază-te confortabil pe un scaun cu spatele drept și tălpile pe sol.',
        'Așază palmele ușor la ceafă fără a trage de gât.',
        'Pe inspir, trage coatele ușor spre spate, deschizând pieptul și privind ușor în sus.',
        'Pe expir, revino ușor la poziția neutră. Repetă de 8-10 ori.'
      ],
      benefit: 'Contracarează tendința involuntară de a rotunji umerii pentru protejarea zonei operate.'
    },
    {
      id: 'ex3',
      category: 'oase',
      title: 'Așezări Asistate pe Scaun (Chair Squats)',
      target: 'Densitate osoasă femur & bazin, forță picioare',
      time: '10 min',
      instructions: [
        'Stai în fața unui scaun stabil cu picioarele depărtate la lățimea umerilor.',
        'Îndoaie genunchii și coboară bazinul lent până atingi ușor șezutul scaunului (fără a te lăsa complet pe el).',
        'Împinge în călcâie și revino în picioare, contractând fesierii.',
        'Execută 2 serii a câte 8-10 repetări, cu pauză de 1 minut între serii.'
      ],
      benefit: 'Impactul mecanic blând pe oasele mari stimulează osteoblastele și previne osteopenia indusă de scăderea estrogenică.'
    },
    {
      id: 'ex4',
      category: 'oase',
      title: 'Ridicări pe Vârfuri & Pompă Venos-Limfatică',
      target: 'Circulație periferică & tonus gambe',
      time: '5 min',
      instructions: [
        'Sprijină palmele ușor pe speteaza unui scaun pentru echilibru.',
        'Ridică-te lent pe vârfuri cât mai sus posibil, menține 2 secunde.',
        'Coboară lent călcâiele pe podea.',
        'Fă 3 serii de câte 12 repetări.'
      ],
      benefit: 'Activează pompa musculară a gambei, facilitând întoarcerea sângelui și a limfei către inimă.'
    },
    {
      id: 'ex5',
      category: 'cardio',
      title: 'Mersul pe Jos Alert în Aer Liber (Brisk Walking)',
      target: 'Sănătate cardiovasculară, control bufeuri & calitatea somnului',
      time: '30 min / sesiune (țintă ASCO)',
      instructions: [
        'Mergi într-un ritm în care pulsul crește ușor, dar poți încă purta o conversație fără să gâfâi.',
        'Poartă încălțăminte comodă cu amortizare bună.',
        'Dacă simți oboseală, începe cu 15 minute și crește cu 5 minute în fiecare săptămână.'
      ],
      benefit: 'Studiile clinice demonstrează că 150 min/săptămână de mers pe jos reduc frecvența bufeurilor nocturne cu până la 50% și combat insomnia.'
    }
  ];

  const filtered = activeCategory === 'toate' 
    ? exercises 
    : exercises.filter(e => e.category === activeCategory);

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ASCO/ACS Recommendation Header Banner */}
      <div className="p-4 rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-900/60 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Activity className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <h4 className="font-bold text-emerald-950 dark:text-emerald-100">
            Ghidul Oncologic de Mișcare (ASCO & American Cancer Society)
          </h4>
          <p className="text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
            Recomandarea medicală de aur pentru supraviețuitoarele de cancer mamar este de <strong>150 de minute pe săptămână</strong> de activitate moderată. Mișcarea regulată reduce riscul de recurență, ameliorează durerile articulare date de Tamoxifen și susține densitatea osoasă.
          </p>
        </div>
      </div>

      {/* Safety Rules for DCIS & Post-Radiotherapy */}
      <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 shadow-xs space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-950 dark:text-amber-100 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Reguli de Aur de Siguranță Post-Tratament</span>
        </div>
        <ul className="space-y-1.5 pl-4 list-disc text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
          <li><strong>Progresie lentă:</strong> Nu forța niciodată dincolo de o senzație ușoară de întindere. Dacă apare durere ascuțită, oprește-te.</li>
          <li><strong>Atenție la brațul operat:</strong> Dacă simți o senzație de greutate, tensiune sau umflare în braț/mână (semne de atenționare limfatică), ridică brațul pe o pernă și consultă medicul.</li>
          <li><strong>Hidratare constantă:</strong> Bea apă rece înainte și după mișcare pentru a preveni vasodilatația bruscă și bufeurile.</li>
          <li><strong>Pielea iradiată:</strong> Evită hainele strâmte din fibre sintetice care freacă zona sânului operat; alege bumbac lejer.</li>
        </ul>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'toate', label: 'Toate' },
          { id: 'umăr', label: 'Mobilitate Umăr & Torace' },
          { id: 'oase', label: 'Oase & Forță (DEXA)' },
          { id: 'cardio', label: 'Cardio & Anti-Bufeuri' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? 'bg-sage-600 text-white shadow-2xs'
                : 'bg-white dark:bg-darkbg-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-darkbg-border hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-3">
        {filtered.map((ex) => (
          <div
            key={ex.id}
            className="bg-white dark:bg-darkbg-surface rounded-3xl p-4 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sage-50 dark:bg-sage-900/60 text-sage-800 dark:text-sage-300 border border-sage-200/80 dark:border-sage-800/60">
                  {ex.target}
                </span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-1.5">
                  {ex.title}
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-darkbg-card px-2 py-1 rounded-xl">
                ⏱️ {ex.time}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-100 dark:border-darkbg-border text-[11px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
              <span><strong>Beneficiu oncologic:</strong> {ex.benefit}</span>
            </div>

            <div className="pt-1 text-xs space-y-1.5">
              <h4 className="font-bold text-gray-900 dark:text-white text-[11px]">Pași de execuție:</h4>
              <ol className="space-y-1 pl-4 list-decimal text-gray-600 dark:text-gray-300 text-[11px]">
                {ex.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
