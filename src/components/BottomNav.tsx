import React from 'react';
import { Home, FolderHeart, Activity, BookOpen } from 'lucide-react';

export type TabType = 'today' | 'timeline' | 'symptoms' | 'guide';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Astăzi', icon: Home },
    { id: 'timeline' as TabType, label: 'Dosar', icon: FolderHeart },
    { id: 'symptoms' as TabType, label: 'Jurnal & PDF', icon: Activity },
    { id: 'guide' as TabType, label: 'Ghid & Rețete', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-darkbg-surface/95 backdrop-blur-lg border-t border-sage-100 dark:border-darkbg-border pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-sage-600 dark:text-sage-300 font-medium'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-sage-50 dark:bg-sage-900/40 scale-105' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
