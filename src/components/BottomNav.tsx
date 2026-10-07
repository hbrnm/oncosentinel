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

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 pointer-events-none pb-safe">
      <div className="mx-2 mb-3 organic-card rounded-[28px] px-1 py-1.5 grid grid-cols-5 shadow-lg pointer-events-auto bg-white/95 dark:bg-darkbg-surface/95 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tap-scale flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-[#4A6354] dark:text-sage-300 font-semibold'
                  : 'text-[#6B6259]/70 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                isActive ? 'bg-[#E8EDE7] dark:bg-sage-900/60 scale-105' : 'bg-transparent'
              }`}>
                <Icon className={`w-[17px] h-[17px] ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              </span>
              <span className="text-[10px] font-semibold tracking-tight truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
