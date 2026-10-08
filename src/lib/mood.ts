// Starea zilei: aceleași 5 trepte pe Astăzi și în Jurnal (decizia proprietarei, 2026-10-08).
// În date rămân valorile vechi ('Foarte rău' … 'Foarte bine'), ca notele salvate deja să fie citite la fel.

export const MOOD_LABELS: Record<number, string> = {
  1: 'Greu', 2: 'Obosită', 3: 'Liniștită', 4: 'Bine', 5: 'Foarte bine'
};

const STATE_BY_LEVEL: Record<number, string> = {
  1: 'Foarte rău', 2: 'Rău', 3: 'Echilibrată', 4: 'Bine', 5: 'Foarte bine'
};

const LEVEL_BY_STATE: Record<string, number> = {
  'Foarte rău': 1, 'Rău': 2, 'Echilibrată': 3, 'Bine': 4, 'Foarte bine': 5
};

/** Valoarea salvată în notă pentru o treaptă 1–5. */
export const moodStateFromLevel = (level: number) => STATE_BY_LEVEL[level] || STATE_BY_LEVEL[3];

/** Treapta 1–5 dintr-o valoare salvată (necunoscută sau lipsă: 3). */
export const moodLevelFromState = (state?: string) => LEVEL_BY_STATE[state || ''] || 3;

/** Eticheta afișată pentru o valoare salvată. */
export const moodLabelFromState = (state?: string) => MOOD_LABELS[moodLevelFromState(state)];
