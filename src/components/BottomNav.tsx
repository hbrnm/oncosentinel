import React from 'react';
import { Home, Pill, BookOpen, Library, User } from 'lucide-react';

export type TabType = 'today' | 'treatment' | 'journal' | 'guide' | 'profile' | 'timeline';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Astăzi', icon: Home },
    { id: 'treatment' as TabType, label: 'Tratament', icon: Pill },
    { id: 'journal' as TabType, label: 'Jurnal', icon: BookOpen },
    { id: 'guide' as TabType, label: 'Ghiduri', icon: Library },
    { id: 'profile' as TabType, label: 'Profil', icon: User },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 pointer-events-none pb-safe">
      <div className="mx-2 mb-2 sm:mb-4 organic-card rounded-[28px] px-2 py-2.5 relative grid grid-cols-5 shadow-lg pointer-events-auto bg-white/95 dark:bg-darkbg-surface/95 backdrop-blur-md">
        {/* Cercul tabului activ alunecă între taburi (o coloană = o cincime din lățimea fără margini) */}
        <span
          aria-hidden="true"
          data-testid="nav-indicator"
          className={`absolute top-5 left-2 w-[calc((100%-1rem)/5)] h-10 flex justify-center pointer-events-none transition-transform duration-300 ease-out ${activeIndex < 0 ? 'opacity-0' : ''}`}
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
        >
          <span className="w-10 h-10 rounded-full bg-sage-soft dark:bg-sage-900/60 scale-105" />
        </span>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tap-scale relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2.5 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-sage-deep dark:text-sage-300 font-semibold'
                  : 'text-ink-soft/70 dark:text-gray-400 hover:text-ink'
              }`}
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full">
                <Icon className={`w-[22px] h-[22px] sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              </span>
              <span className="text-[10px] font-semibold tracking-tight truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
