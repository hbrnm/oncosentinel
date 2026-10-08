import React from 'react';
import { CalendarDays, FileText, Stethoscope, FolderHeart } from 'lucide-react';

export interface QuickActionsProps {
  onNavigateToTab?: (tab: 'today' | 'treatment' | 'timeline' | 'journal' | 'guide' | 'profile') => void;
  onOpenDoctorModal?: () => void;
  onOpenResources?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigateToTab,
  onOpenDoctorModal,
  onOpenResources,
}) => {
  const actions = [
    {
      label1: 'Calendar',
      label2: 'tratament',
      icon: CalendarDays,
      tint: 'bg-[#E8EDE7] text-[#4A6354] dark:bg-sage-950/60 dark:text-sage-300',
      onClick: () => onNavigateToTab?.('treatment'),
    },
    {
      label1: 'Ghiduri',
      label2: 'medicale',
      icon: FileText,
      tint: 'bg-[#F6ECEC] text-[#C99A9D] dark:bg-petal-950/60 dark:text-petal-300',
      onClick: () => onNavigateToTab?.('guide'),
    },
    {
      label1: 'Medici și',
      label2: 'centre',
      icon: Stethoscope,
      tint: 'bg-[#E8EDE7] text-[#4A6354] dark:bg-sage-950/60 dark:text-sage-300',
      onClick: () => {
        if (onOpenDoctorModal) onOpenDoctorModal();
        else onNavigateToTab?.('profile');
      },
    },
    {
      label1: 'Dosar',
      label2: 'medical',
      icon: FolderHeart,
      tint: 'bg-[#F6ECEC] text-[#C99A9D] dark:bg-petal-950/60 dark:text-petal-300',
      onClick: () => {
        onNavigateToTab?.('timeline');
      },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {actions.map(({ label1, label2, icon: Icon, tint, onClick }) => (
        <button
          key={`${label1}-${label2}`}
          type="button"
          onClick={onClick}
          className="tap-scale flex flex-col items-center gap-2.5 organic-card rounded-3xl p-3 pt-4 hover:shadow-md transition-all active:scale-95 text-left w-full cursor-pointer"
        >
          <span className={`flex items-center justify-center w-12 h-12 rounded-2xl ${tint} transition-transform`}>
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <span className="text-[10.5px] font-semibold text-[#3A332E] dark:text-white leading-tight text-center">
            {label1}
            <br />
            {label2}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
