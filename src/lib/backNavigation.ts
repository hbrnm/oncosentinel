import { useEffect, useRef } from 'react';

/**
 * Butonul Back al telefonului (istoricul browserului).
 * - Fiecare ecran deschis adaugă o intrare: Back întoarce la ecranul anterior,
 *   iar de pe primul ecran (Astăzi) iese din aplicație.
 * - Fiecare fereastră deschisă adaugă o intrare: Back o închide.
 * O fereastră închisă din butonul ei își scoate intrarea; dacă nu se poate
 * (s-a deschis între timp alta), intrarea rămasă e sărită la următorul Back.
 */

const openWindows = new Map<number, () => void>();
// Id-uri crescătoare și după reîncărcare, ca intrările vechi să nu se confunde cu ferestre noi
let lastId = 0;
const newId = () => (lastId = Math.max(Date.now(), lastId + 1));
let ownBack = false;
let onScreen: ((screen: string) => void) | null = null;

const handlePop = (event: PopStateEvent) => {
  if (ownBack) {
    ownBack = false;
    return;
  }
  const state = event.state || {};
  const landedId = typeof state.window === 'number' ? state.window : 0;
  // Închide ferestrele deschise peste intrarea la care s-a ajuns, de sus în jos
  [...openWindows.keys()]
    .filter(id => id > landedId)
    .sort((a, b) => b - a)
    .forEach(id => {
      const close = openWindows.get(id);
      openWindows.delete(id);
      close?.();
    });
  if (landedId && !openWindows.has(landedId)) {
    // Intrarea unei ferestre închise deja: o sărim, după ce React a deschis
    // eventuala fereastră următoare (ex. respirația → „Te simți mai liniștită?”)
    setTimeout(() => {
      const current = window.history.state?.window;
      if (onScreen && current && !openWindows.has(current)) window.history.back();
    }, 0);
    return;
  }
  if (!landedId && typeof state.screen === 'string') onScreen?.(state.screen);
};

/** Pornește urmărirea; `show` afișează ecranul la care duce Back. */
export function startBackNavigation(firstScreen: string, show: (screen: string) => void): () => void {
  onScreen = show;
  window.history.replaceState({ screen: firstScreen }, '');
  window.addEventListener('popstate', handlePop);
  return () => {
    window.removeEventListener('popstate', handlePop);
    onScreen = null;
    ownBack = false;
  };
}

/** Un ecran nou deschis de utilizatoare. */
export function pushScreen(screen: string): void {
  window.history.pushState({ screen }, '');
}

/** Cât timp `isOpen` e adevărat, Back închide fereastra (apelează `onClose`). */
export function useBackToClose(isOpen: boolean, onClose: () => void): void {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const id = newId();
    const screen = window.history.state?.screen;
    window.history.pushState({ window: id, screen }, '');
    openWindows.set(id, () => closeRef.current());
    return () => {
      // Închisă cu Back: intrarea a fost deja consumată
      if (!openWindows.has(id)) return;
      openWindows.delete(id);
      // Închisă din buton: scoatem intrarea, dacă e încă ultima
      setTimeout(() => {
        // Doar cât timp aplicația ascultă (altfel Back-ul următor s-ar pierde)
        if (onScreen && window.history.state?.window === id) {
          ownBack = true;
          window.history.back();
        }
      }, 0);
    };
  }, [isOpen]);
}
