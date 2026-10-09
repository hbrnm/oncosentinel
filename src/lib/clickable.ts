import type { KeyboardEvent } from 'react';

// Pentru cardurile apăsabile care nu pot fi <button> (au titluri înăuntru):
// cititorul de ecran le anunță ca butoane și se deschid și cu Enter sau Spațiu.
export const clickable = (onActivate: () => void) => ({
  role: 'button' as const,
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return; // tastele din butoanele dinăuntru rămân ale lor
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  },
});
