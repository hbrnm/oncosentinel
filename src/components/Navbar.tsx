import React from 'react';
import { Heart, ShieldCheck, Settings } from 'lucide-react';
import { PatientProfile } from '../types';
import { clickable } from '../lib/clickable';

interface NavbarProps {
  profile: PatientProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  fontSize: 'normal' | 'large';
  setFontSize: (val: 'normal' | 'large') => void;
  onOpenRedFlags: () => void;
  onOpenProfile: () => void;
  onOpenBreathing: () => void;
  onOpenAuth: () => void;
  onOpenDoctorVisit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  onOpenRedFlags,
  onOpenProfile,
  onOpenBreathing,
  onOpenAuth,
  onOpenDoctorVisit
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-darkbg-surface/95 backdrop-blur-md border-b border-sage-100 dark:border-darkbg-border px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* App Title & Patient Info */}
        <div 
          {...clickable(onOpenProfile)}
          className="flex items-center space-x-2.5 cursor-pointer group"
          title="Editează profilul și setările de tratament"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-tr from-sage-500 to-sage-400 dark:from-sage-600 dark:to-sage-500 flex items-center justify-center text-white shadow-sm shadow-sage-200 dark:shadow-none group-hover:scale-105 transition-transform border border-sage-200/50">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <Heart className="w-5 h-5 fill-white/90" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-semibold text-ink dark:text-white text-base tracking-tight leading-none group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors">
                OncoSentinel
              </h1>
              <span className="text-[10px] font-semibold bg-sage-100 dark:bg-sage-900/80 text-sage-800 dark:text-sage-300 border border-sage-200/60 dark:border-sage-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-sage-600 dark:text-sage-400" /> DCIS
              </span>
            </div>
            <p className="text-xs text-ink-soft dark:text-gray-400 mt-0.5 font-normal flex items-center gap-1">
              <span>{profile.full_name?.trim() ? `Bună, ${profile.full_name.trim().split(' ')[0]}` : 'Bună!'}</span>
              <Settings className="w-3 h-3 text-ink-soft group-hover:text-sage-500" />
            </p>
          </div>
        </div>

        {/* Clean Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Data Safety Button */}
          <button
            onClick={onOpenAuth}
            title="Siguranța datelor"
            aria-label="Siguranța datelor"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-ink dark:text-gray-200 bg-cream-deep dark:bg-darkbg-card hover:bg-warmborder dark:hover:bg-darkbg-border transition-colors border border-transparent dark:border-darkbg-border"
          >
            <ShieldCheck className="w-4 h-4 text-sage-600 dark:text-sage-300" />
          </button>

          {/* Text Size Toggle */}
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold text-ink dark:text-gray-200 bg-cream-deep dark:bg-darkbg-card hover:bg-warmborder dark:hover:bg-darkbg-border transition-colors border border-transparent dark:border-darkbg-border"
            title="Schimbă mărimea fontului"
          >
            {fontSize === 'normal' ? 'A+' : 'A-'}
          </button>

          {/* Dark Mode Toggle Removed */}
        </div>

      </div>
    </header>
  );
};
