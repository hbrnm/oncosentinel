// „Ce te-a ajutat altă dată”: lucrurile scrise de pacientă; doar pe dispozitiv, intră în copia de siguranță
export const WHAT_HELPED_KEY = 'oncosentinel_what_helped';

export function loadWhatHelped(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(WHAT_HELPED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(t => typeof t === 'string' && t.trim()) : [];
  } catch (e) {
    return [];
  }
}

export function saveWhatHelped(list: string[]): void {
  localStorage.setItem(WHAT_HELPED_KEY, JSON.stringify(list));
}
