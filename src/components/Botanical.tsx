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
    <svg viewBox="0 0 120 160" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M60 158 C60 120 60 90 60 50" stroke="#7A9A8B" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M60 130 C48 126 40 118 36 106 C48 108 56 116 60 128" stroke="#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M60 110 C72 106 80 98 84 86 C72 88 64 96 60 108" stroke="#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M60 88 C48 84 40 76 36 64 C48 66 56 74 60 86" stroke="#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M60 66 C72 62 80 54 84 42 C72 44 64 52 60 64" stroke="#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <circle cx="60" cy="40" r="5" fill="#DFB2B5" opacity="0.45" />
      <circle cx="52" cy="48" r="3.5" fill="#DFB2B5" opacity="0.35" />
      <circle cx="68" cy="48" r="3.5" fill="#DFB2B5" opacity="0.35" />
    </svg>
  );
};

/**
 * LeafSprig - Minimal delicate leaf accent for quote cards
 */
export const LeafSprig: React.FC<BotanicalProps> = ({ className = '', style }) => {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M40 76 C40 56 40 36 40 16" stroke="#7A9A8B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M40 56 C32 54 26 48 22 40 C30 42 36 48 40 54" stroke="#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <path d="M40 40 C48 38 54 32 58 24 C50 26 44 32 40 38" stroke="#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
      <path d="M40 26 C34 24 30 18 28 12 C34 14 38 20 40 24" stroke="#7A9A8B" strokeWidth="1.1" strokeLinecap="round" opacity="0.45" />
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
