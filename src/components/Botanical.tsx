import React from 'react';

export interface BotanicalProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BotanicalBranch - Hand-drawn organic botanical branch illustration from Base44
 */
export const BotanicalBranch: React.FC<BotanicalProps> = ({ className = '', style }) => {
  return (
    <svg viewBox="0 0 120 180" className={`overflow-visible ${className}`} style={style} fill="none" aria-hidden="true">
      {/* Central Stem reaching gracefully to top */}
      <path d="M60 178 C60 120 60 70 60 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
      {/* Lower leaves */}
      <path d="M60 145 C48 141 40 133 36 121 C48 123 56 131 60 143" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M60 125 C72 121 80 113 84 101 C72 103 64 111 60 123" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      {/* Mid leaves */}
      <path d="M60 100 C48 96 40 88 36 76 C48 78 56 86 60 98" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M60 78 C72 74 80 66 84 54 C72 56 64 64 60 76" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      {/* Upper leaf pair near top */}
      <path d="M60 54 C50 50 44 42 40 32 C50 34 56 42 60 52" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      {/* Delicate blush berries at top tip */}
      <circle cx="60" cy="14" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="51" cy="22" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
      <circle cx="69" cy="22" r="3.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    </svg>
  );
};

/**
 * LeafSprig - Minimal delicate leaf accent for quote cards
 */
export const LeafSprig: React.FC<BotanicalProps> = ({ className = '', style }) => {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M40 76 C40 56 40 36 40 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M40 56 C32 54 26 48 22 40 C30 42 36 48 40 54" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
      <path d="M40 40 C48 38 54 32 58 24 C50 26 44 32 40 38" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
      <path d="M40 26 C34 24 30 18 28 12 C34 14 38 20 40 24" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
};

/**
 * PillIcon - Minimal 3D-angled pill icon from Base44
 */
export const PillIcon: React.FC<BotanicalProps> = ({ className = '', style }) => {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" aria-hidden="true">
      <rect x="6" y="22" width="52" height="20" rx="10" transform="rotate(-30 32 32)" fill="#E8EDE7" stroke="#5E7A68" strokeWidth="1.6" />
      <path d="M22 18 L42 38" stroke="#5E7A68" strokeWidth="1.6" strokeLinecap="round" transform="rotate(-30 32 32)" />
      <rect x="6" y="22" width="26" height="20" rx="10" transform="rotate(-30 32 32)" fill="#5E7A68" opacity="0.35" />
    </svg>
  );
};
