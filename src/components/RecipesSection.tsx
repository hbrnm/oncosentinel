import React, { useState } from 'react';
import { 
  Utensils, Clock, Sparkles, ChevronDown, ChevronUp, 
  AlertOctagon, Check, Leaf, Coffee, Flame, Heart, Search, X,
  ShoppingBag, Plus 
} from 'lucide-react';
import { ONCOLOGY_RECIPES, RecipeItem } from '../lib/recipes';
import { ShoppingListModal, ShoppingItem } from './ShoppingListModal';

export const RecipesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('toate');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>('r1');
  const [isShoppingListOpen, setIsShoppingListOpen] = useState<boolean>(false);
  const [addedRecipeNotice, setAddedRecipeNotice] = useState<string | null>(null);

  const categories = [
    { id: 'toate', label: 'Toate' },
    { id: 'mic_dejun', label: 'Mic Dejun' },
    { id: 'pranz', label: 'Prânz' },
    { id: 'cina', label: 'Cină' },
    { id: 'bufeuri_bauturi', label: 'Băuturi Bufeuri' },
    { id: 'gustari', label: 'Gustări' }
  ];

  const filteredRecipes = ONCOLOGY_RECIPES.filter(recipe => {
    const matchesCategory = selectedCategory === 'toate' || recipe.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesTitle = recipe.title.toLowerCase().includes(query);
    const matchesBenefit = recipe.oncologyBenefit.toLowerCase().includes(query);
    const matchesIngredients = recipe.ingredients.some(i => i.toLowerCase().includes(query));
    const matchesTip = recipe.tip?.toLowerCase().includes(query);

    return matchesTitle || matchesBenefit || matchesIngredients || matchesTip;
  });

  const handleAddRecipeToShoppingList = (recipe: RecipeItem) => {
    const saved = localStorage.getItem('navimed_shopping_list');
    const currentList: ShoppingItem[] = saved ? JSON.parse(saved) : [];
    
    const newItems: ShoppingItem[] = recipe.ingredients.map(ing => ({
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: ing,
      recipeSource: recipe.title,
      isBought: false,
      addedAt: new Date().toISOString()
    }));

    const updated = [...newItems, ...currentList];
    localStorage.setItem('navimed_shopping_list', JSON.stringify(updated));
    setAddedRecipeNotice(recipe.id);
    setTimeout(() => setAddedRecipeNotice(null), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Critical Oncology Warning Box */}
      <div className="p-4 rounded-3xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/60 shadow-xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className="text-xs flex-1">
          <h4 className="font-bold text-rose-950 dark:text-rose-100">
            Regulă Majoră de Siguranță: Fără Grapefruit!
          </h4>
          <p className="text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
            Grapefruitul, sucul de grapefruit și portocalele amare (Seville) conțin furanocumarine care blochează enzima hepatică CYP3A4 și pot altera concentrația terapeutică de Tamoxifen. <strong>Evită-le complet în alimentație.</strong>
          </p>
        </div>
      </div>

      {/* Search & Shopping List Bar */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după ingredient, bufeuri, articulații..."
            className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-sage-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsShoppingListOpen(true)}
          className="px-3.5 py-2.5 rounded-2xl bg-sage-50 dark:bg-sage-900/40 border border-sage-200 dark:border-sage-800 text-sage-900 dark:text-sage-200 hover:bg-sage-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all shrink-0"
        >
          <ShoppingBag className="w-4 h-4 text-sage-600" />
          <span className="hidden sm:inline">Listă</span> Cumpărături
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-sage-600 text-white shadow-2xs'
                : 'bg-white dark:bg-darkbg-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-darkbg-border hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recipes List */}
      <div className="space-y-3">
        {filteredRecipes.map((recipe) => {
          const isExpanded = expandedRecipeId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="bg-white dark:bg-darkbg-surface rounded-3xl p-4 border border-sage-100 dark:border-darkbg-border shadow-xs space-y-3 transition-all"
            >
              {/* Header */}
              <div
                onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                className="cursor-pointer flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sage-50 dark:bg-sage-900/60 text-sage-800 dark:text-sage-300 border border-sage-200/80 dark:border-sage-800/60">
                      {recipe.categoryLabel}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sage-600" /> {recipe.timeMinutes} min
                    </span>
                    {recipe.source && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/50">
                        {recipe.source}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                    {recipe.title}
                  </h3>
                </div>

                <button className="text-gray-400 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Oncology Mechanism Badge */}
              <div className="p-2.5 rounded-2xl bg-sage-50/70 dark:bg-darkbg-card border border-sage-100 dark:border-darkbg-border text-[11px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                <span><strong>De ce ajută corpul:</strong> {recipe.oncologyBenefit}</span>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="pt-2 border-t border-gray-100 dark:border-darkbg-border space-y-3 animate-fade-in text-xs">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-sage-600" />
                      <span>Ingrediente necesare:</span>
                    </h4>
                    <ul className="space-y-1 pl-4 list-disc text-gray-600 dark:text-gray-300 text-[11px]">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1.5 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-sage-600" />
                      <span>Mod de preparare simplu:</span>
                    </h4>
                    <ol className="space-y-1 pl-4 list-decimal text-gray-600 dark:text-gray-300 text-[11px]">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Practical tip */}
                  {recipe.tip && (
                    <div className="p-2.5 bg-petal-50 dark:bg-petal-900/20 border border-petal-200/80 dark:border-petal-900/40 rounded-xl text-[11px] text-petal-900 dark:text-petal-200 flex items-start gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-petal-600 shrink-0 mt-0.5" />
                      <span><strong>Sfat practic:</strong> {recipe.tip}</span>
                    </div>
                  )}

                  {/* Add to shopping list action button */}
                  <div className="pt-1 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddRecipeToShoppingList(recipe)}
                      className="w-full py-2 px-3 rounded-xl bg-sage-50 hover:bg-sage-100 dark:bg-sage-900/40 dark:hover:bg-sage-900/60 border border-sage-200 dark:border-sage-800 text-sage-900 dark:text-sage-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      {addedRecipeNotice === recipe.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-300">Adăugate în Lista de Cumpărături!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-sage-600" />
                          <span>Adaugă Ingredientele în Listă</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRecipes.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-darkbg-card rounded-3xl border border-dashed border-gray-300 dark:border-darkbg-border">
            <Utensils className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nicio rețetă găsită</p>
            <p className="text-xs text-gray-500 mt-1">Încearcă să cauți alt termen sau resetează filtrele.</p>
          </div>
        )}
      </div>

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
      />

    </div>
  );
};
