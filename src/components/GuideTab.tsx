import React, { useState } from 'react';
import { 
  Search, AlertOctagon, CheckCircle2, AlertTriangle, 
  Apple, Dumbbell, Sparkles, ShieldAlert, BookOpen, HeartHandshake, Bone, Utensils,
  FileText, ShieldCheck, ChevronRight, ArrowLeft
} from 'lucide-react';
import { searchInteractions } from '../lib/interactions';
import { DrugInteraction } from '../types';
import { RecipesSection } from './RecipesSection';
import { ExerciseSection } from './ExerciseSection';

interface GuideTabProps {
  onOpenRedFlags: () => void;
}

interface ClinicalGuide {
  id: string;
  tag: string;
  title: string;
  summary: string;
  content: string;
  category: 'tratament' | 'stil_viata' | 'emotional' | 'monitorizare';
}

interface NewsProtocol {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

const CLINICAL_GUIDES: ClinicalGuide[] = [
  {
    id: 'g1',
    tag: 'GHIDURI & PROTOCOALE',
    title: 'Tamoxifen: Ghid complet de administrare și aderență',
    summary: 'De ce este recomandat 5 ani în DCIS, cum acționează la nivelul receptorilor estrogenici și cum să gestionezi regularitatea dozelor.',
    category: 'tratament',
    content: `### Despre Tamoxifen în DCIS

Tamoxifenul este un modulator selectiv al receptorilor estrogenici (SERM). În celulele mamare, el blochează receptorii de estrogen, împiedicând stimularea oricăror celule restante.

#### De ce 5 ani?
Studiile clinice internaționale (NSABP B-24, NSABP B-14) au demonstrat că terapia endocrină pe o durată de 5 ani reduce cu aproximativ **40-50%** riscul de recidivă ipsilaterală (în același sân) și contralaterală (în celălalt sân).

#### Sfaturi de aur pentru administrare:
1. **Regularitatea orei**: Alege o oră convenabilă (de exemplu 08:00 dimineața sau la micul dejun) și menține-o zilnic.
2. **Ce faci dacă uiți o doză**: Ia comprimatul de îndată ce îți amintești. Dacă este aproape ora pentru următoarea doză, sari peste cea uitată și revino la programul normal. Nu dubla doza.
3. **Fără întrerupere bruscă**: Nu întrerupe tratamentul fără să discuți în prealabil cu medicul oncolog curant.`
  },
  {
    id: 'g2',
    tag: 'STIL DE VIAȚĂ & CONFORT',
    title: 'Managementul bufeurilor și transpirațiilor nocturne',
    summary: 'Strategii practice non-hormonale: îmbrăcăminte în straturi, igiena somnului, respirație ritmată și răcorire.',
    category: 'stil_viata',
    content: `### Înțelegerea Bufeurilor

Bufeurile sunt cauzate de o ușoară dereglare temporară a centrului de termoreglare din hipotalamus, cauzată de blocarea estrogenilor.

#### Tehnici validate de control:
* **Îmbrăcăminte în straturi (layering)**: Folosește materiale naturale (bumbac, in, bambus) pe care le poți îndepărta ușor la debutul unui val de căldură.
* **Respirație ghidată paced breathing**: 6 respirații lente pe minut (inspiri 5 secunde, expiri 5 secunde) reduc frecvența și severitatea bufeului cu până la 50%.
* **Evitarea declanșatorilor termici**: Mâncăruri picante, băuturi fierbinți, alcoolul seara și spațiile supraîncălzite.
* **Perne cu gel de răcire**: Oferă un somn odihnitor și previn trezirile nocturne frecvente.`
  },
  {
    id: 'g3',
    tag: 'SUPRAVEGHERE & IMAGISTICĂ',
    title: 'Protocolul de control la 6 luni și mamografie anuală',
    summary: 'Calendarul recomandat de societățile internaționale (ESMO / NCCN) pentru supravegherea oncologică post-operatorie.',
    category: 'monitorizare',
    content: `### Protocolul de Supraveghere în DCIS

După finalizarea tratamentului local (chirurgie conservatoare și radioterapie), supravegherea este cheia liniștii tale pe termen lung.

#### Etapele recomandate:
1. **Control clinic oncologic**: la fiecare 6 luni în primii 2-3 ani, apoi anual.
2. **Mamografie digitală bilaterală**: prima la 6-12 luni post-radioterapie, ulterior la fiecare 12 luni.
3. **Ecografie mamară complementară**: deosebit de utilă în cazul sânilor denși.
4. **Control ginecologic cu ecografie transvaginală**: anual, pentru monitorizarea grosimii endometrului.`
  }
];

const CLINICAL_NEWS: NewsProtocol[] = [
  {
    id: 'n1',
    title: 'Actualizare ESMO 2026: Beneficiul aderenței continue pe 5 ani',
    date: '2026-10-01',
    summary: 'Noi date confirmă menținerea protecției oncologice la 10 și 15 ani pentru pacientele care finalizează cura de 5 ani.',
    content: `Noile ghiduri clinice prezentate de Societatea Europeană de Oncologie Medicală (ESMO) reconfirmă beneficiul de protecție cumulativă al Tamoxifenului. 

Studiile pe termen lung arată că menținerea aderenței de peste 80% în primii ani oferă o scădere susținută a riscului mamar chiar și la 10-15 ani de la diagnostic.`
  },
  {
    id: 'n2',
    title: 'Recomandare NCCN: Suplimentarea cu Vitamina D3 și Calciu',
    date: '2026-09-15',
    summary: 'Valori optime ale 25-OH Vitaminei D în sânge (>40 ng/mL) sunt esențiale pentru densitatea osoasă și starea de energie.',
    content: `Ghidul NCCN 2026 recomandă testarea anuală a nivelului seric de 25-hidroxivitamina D. 

Pentru susținerea densității minerale osoase și a funcției articulare, se recomandă doze zilnice de 1000 - 2000 UI Vitamina D3 alături de un aport alimentar adecvat de calciu.`
  }
];

export const GuideTab: React.FC<GuideTabProps> = ({ onOpenRedFlags }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'clinical' | 'recipes' | 'exercise' | 'interactions' | 'intimate' | 'bones' | 'nutrition' | 'skincare'>('clinical');
  const [selectedGuide, setSelectedGuide] = useState<ClinicalGuide | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsProtocol | null>(null);

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
    { id: 'clinical' as const, label: 'Ghiduri & Noutăți', icon: BookOpen },
    { id: 'recipes' as const, label: 'Rețete & Meniu', icon: Utensils },
    { id: 'exercise' as const, label: 'Sport & Mobilitate', icon: Dumbbell },
    { id: 'interactions' as const, label: 'Interacțiuni', icon: Search },
    { id: 'intimate' as const, label: 'Intim & Mucoase', icon: HeartHandshake },
    { id: 'bones' as const, label: 'Oase & DEXA', icon: Bone },
    { id: 'nutrition' as const, label: 'Ghid Nutriție', icon: Apple },
    { id: 'skincare' as const, label: 'Piele & RT', icon: Sparkles }
  ];

  // Detailed Modal for Clinical Guide or News
  if (selectedGuide) {
    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        <div className="flex items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setSelectedGuide(null)}
            className="tap-scale w-10 h-10 rounded-full bg-white dark:bg-darkbg-card border border-[#EAE5DE] dark:border-darkbg-border flex items-center justify-center shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#3A332E] dark:text-white" />
          </button>
          <span className="text-[13px] text-[#6B6259] dark:text-gray-300 font-medium">
            Înapoi la Ghiduri
          </span>
        </div>

        <div className="organic-card rounded-3xl p-6">
          <span className="micro-label text-[#4A6354] dark:text-sage-300">{selectedGuide.tag}</span>
          <h1 className="font-serif text-2xl text-[#3A332E] dark:text-white mt-2 leading-tight">
            {selectedGuide.title}
          </h1>
          <p className="text-[14px] text-[#6B6259] dark:text-gray-300 mt-3 leading-relaxed font-sans">
            {selectedGuide.summary}
          </p>
          <div className="h-px bg-[#EAE5DE]/60 dark:bg-darkbg-border my-5" />
          <div className="prose dark:prose-invert max-w-none text-[13px] text-[#3A332E] dark:text-gray-200 leading-relaxed whitespace-pre-line space-y-3">
            {selectedGuide.content}
          </div>
        </div>
      </div>
    );
  }

  if (selectedNews) {
    return (
      <div className="space-y-4 pb-20 animate-fade-in">
        <div className="flex items-center gap-2 pt-1 pb-1">
          <button
            onClick={() => setSelectedNews(null)}
            className="tap-scale w-10 h-10 rounded-full bg-white dark:bg-darkbg-card border border-[#EAE5DE] dark:border-darkbg-border flex items-center justify-center shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#3A332E] dark:text-white" />
          </button>
          <span className="text-[13px] text-[#6B6259] dark:text-gray-300 font-medium">
            Înapoi la Noutăți
          </span>
        </div>

        <div className="organic-card rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#E8EDE7] dark:bg-sage-900/60 flex items-center justify-center text-[#4A6354] dark:text-sage-300">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] text-[#6B6259] dark:text-gray-400 font-medium">{selectedNews.date}</span>
          </div>
          <h1 className="font-serif text-2xl text-[#3A332E] dark:text-white mt-1 leading-tight">
            {selectedNews.title}
          </h1>
          <p className="text-[14px] text-[#6B6259] dark:text-gray-300 mt-3 leading-relaxed">
            {selectedNews.summary}
          </p>
          <div className="h-px bg-[#EAE5DE]/60 dark:bg-darkbg-border my-5" />
          <div className="text-[13px] text-[#3A332E] dark:text-gray-200 leading-relaxed whitespace-pre-line">
            {selectedNews.content}
          </div>
        </div>
      </div>
    );
  }

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
              className={`py-2 px-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
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

      {/* 0. Sub-Tab: Base44 Clinical Guides & News Updates */}
      {activeSubTab === 'clinical' && (
        <div className="space-y-6">
          {/* Ghiduri Medicale Section matching Base44 Ghiduri.jsx */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
              <h2 className="font-serif text-lg text-[#3A332E] dark:text-white">Ghiduri medicale</h2>
            </div>
            <div className="space-y-3">
              {CLINICAL_GUIDES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g)}
                  className="tap-scale organic-card rounded-3xl p-4 text-left w-full flex items-start justify-between gap-3 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="micro-label text-[#4A6354] dark:text-sage-300 mb-1">{g.tag}</p>
                    <h3 className="font-serif text-[16px] text-[#3A332E] dark:text-white leading-snug">
                      {g.title}
                    </h3>
                    <p className="text-[12px] text-[#6B6259] dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                      {g.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B6259]/60 shrink-0 mt-2" />
                </button>
              ))}
            </div>
          </section>

          {/* Noutăți & Protocoale Section matching Base44 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#4A6354] dark:text-sage-300" />
              <h2 className="font-serif text-lg text-[#3A332E] dark:text-white">Noutăți & protocoale</h2>
            </div>
            <div className="space-y-3">
              {CLINICAL_NEWS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNews(n)}
                  className="tap-scale organic-card rounded-3xl p-4 text-left w-full flex items-start gap-3.5 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="shrink-0 w-11 h-11 rounded-2xl bg-[#E8EDE7] dark:bg-sage-900/60 flex items-center justify-center text-[#4A6354] dark:text-sage-300">
                    <ShieldCheck className="w-5 h-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="micro-label text-[#4A6354] dark:text-sage-300">Noutăți</span>
                      <span className="text-[10px] text-[#6B6259]/70 dark:text-gray-400">·</span>
                      <span className="text-[10px] text-[#6B6259]/70 dark:text-gray-400">{n.date}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#3A332E] dark:text-white mt-1 leading-snug">
                      {n.title}
                    </p>
                    <p className="text-[11.5px] text-[#6B6259] dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {n.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B6259]/60 shrink-0 mt-3" />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

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
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-darkbg-surface border border-sage-100 dark:border-darkbg-border focus:outline-hidden focus:border-sage-500 text-gray-900 dark:text-white shadow-xs"
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

      {/* 4. Sub-Tab: Intimate Health & Mucosal Hydration (Non-Hormonal) */}
      {activeSubTab === 'intimate' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <HeartHandshake className="w-5 h-5 text-petal-600 dark:text-petal-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Sănătatea Intimă & Uscăciunea Mucoaselor (Ghid Non-Hormonal)
            </h3>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200">
            ⚠️ <strong>Important:</strong> În DCIS și terapia cu Tamoxifen, se evită ovulele sau cremele cu estrogeni activi (chiar și cu acțiune locală), cu excepția cazului în care există recomandarea expresă a medicului oncolog.
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                💧 Hidratare de lungă durată (Non-hormonală)
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Geluri vaginale pe bază de acid hialuronic și vitamina E (aplicate de 2-3 ori pe săptămână, seara). Mențin umiditatea tisulară fără a introduce hormoni în organism.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                🧴 Lubrifianți pe bază de apă sau silicon
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Folosește lubrifianți curați, fără parfum și fără glicerină pentru a preveni iritațiile și infecțiile urinare recurente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-Tab: Bone Health & Osteoporosis Prevention */}
      {activeSubTab === 'bones' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <Bone className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Sănătatea Oaselor & Monitorizarea DEXA
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Tamoxifenul are un efect protector osos la femeile aflate în post-menopauză, dar este important să menții o densitate osoasă optimă prin nutriție și exercițiu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">🥛 Calciu Alimentar (1000-1200 mg/zi)</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Iaurt grecesc, kefir, brânzeturi maturate, migdale, semințe de susan și tofu îmbogățit cu calciu.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-200/80 dark:border-darkbg-border">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">☀️ Vitamina D3 & K2</h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Menține nivelul de 25-OH-vitamina D la peste 40 ng/mL prin expunere moderată la soare și suplimentare la indicația medicului.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Sub-Tab: Nutrition Guidelines */}
      {activeSubTab === 'nutrition' && (
        <div className="bg-white dark:bg-darkbg-surface p-5 rounded-3xl border border-sage-100 dark:border-darkbg-border shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-sage-800 dark:text-sage-300">
            <Apple className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Principiile Nutriției Anti-Estrogenice & Metabolice
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

      {/* 7. Sub-Tab: Skincare post-RT */}
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
        className="w-full py-3.5 px-4 rounded-3xl bg-rose-50/90 dark:bg-darkbg-card hover:bg-rose-100 dark:hover:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/50 text-xs font-medium flex items-center justify-between transition-all shadow-xs cursor-pointer"
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
