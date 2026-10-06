import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Trash2, Plus, Copy, Share2, Sparkles } from 'lucide-react';

export interface ShoppingItem {
  id: string;
  name: string;
  recipeSource?: string;
  isBought: boolean;
  addedAt: string;
}

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose
}) => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('navimed_shopping_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [newItemName, setNewItemName] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);

  useEffect(() => {
    localStorage.setItem('navimed_shopping_list', JSON.stringify(items));
  }, [items]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBought: !item.isBought } : item
    ));
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearBought = () => {
    setItems(prev => prev.filter(item => !item.isBought));
  };

  const handleClearAll = () => {
    if (window.confirm('Sigur vrei să golești întreaga listă de cumpărături?')) {
      setItems([]);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      recipeSource: 'Personal',
      isBought: false,
      addedAt: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
    setNewItemName('');
  };

  const handleCopyList = () => {
    if (items.length === 0) return;
    const pending = items.filter(i => !i.isBought);
    const bought = items.filter(i => i.isBought);
    
    let text = `🛒 Lista de Cumpărături NaviMed:\n\n`;
    if (pending.length > 0) {
      text += `De cumpărat:\n` + pending.map(i => `▫️ ${i.name}`).join('\n') + `\n\n`;
    }
    if (bought.length > 0) {
      text += `Bifate:\n` + bought.map(i => `✅ ${i.name}`).join('\n');
    }

    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const pendingCount = items.filter(i => !i.isBought).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-darkbg-surface w-full max-w-md rounded-3xl p-5 border border-sage-200 dark:border-darkbg-border shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-darkbg-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sage-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Listă Cumpărături Rețete</span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-200">
                    {pendingCount} de luat
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-500">Ingrediente sănătoase pentru planul tău</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddItem} className="flex gap-2 pt-3 pb-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Adaugă ingredient sau produs (ex: semințe de in)..."
            className="flex-1 px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-darkbg-card border border-gray-200 dark:border-darkbg-border text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-sage-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adaugă</span>
          </button>
        </form>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1 scrollbar-thin">
          {items.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400 space-y-2">
              <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
              <p className="text-xs font-medium">Lista ta este goală momentan.</p>
              <p className="text-[11px] text-gray-400">
                Poți adăuga ingrediente direct din rețetele din Ghid cu butonul <strong>„Adaugă în listă”</strong>!
              </p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  item.isBought
                    ? 'bg-gray-50/70 dark:bg-darkbg-card/40 border-gray-100 dark:border-darkbg-border opacity-60'
                    : 'bg-white dark:bg-darkbg-card border-sage-100/80 dark:border-darkbg-border shadow-2xs hover:border-sage-300'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                    item.isBought 
                      ? 'bg-sage-600 border-sage-600 text-white' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg-surface'
                  }`}>
                    {item.isBought && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <span className={`text-xs font-medium block truncate ${
                      item.isBought ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {item.name}
                    </span>
                    {item.recipeSource && (
                      <span className="text-[9px] text-gray-400 block truncate">
                        din: {item.recipeSource}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                  title="Șterge produs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-gray-100 dark:border-darkbg-border flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyList}
                className="px-3 py-2 rounded-xl bg-sage-50 dark:bg-sage-900/40 text-sage-900 dark:text-sage-200 border border-sage-200/80 dark:border-sage-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-sage-100 transition-all shadow-2xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedNotice ? 'Copiat!' : 'Copiază'}</span>
              </button>
              <button
                type="button"
                onClick={handleClearBought}
                className="px-2.5 py-2 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-medium hover:bg-gray-100 dark:hover:bg-darkbg-card transition-colors"
                title="Curăță produsele bifate"
              >
                Șterge bifate
              </button>
            </div>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold px-2 py-1 rounded-lg"
            >
              Golește tot
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
