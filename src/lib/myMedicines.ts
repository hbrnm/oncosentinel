import { OtherMedicine } from '../types';

// „Medicamentele mele”: doar pe dispozitiv, ca programările; intră în copia de siguranță
export const MEDICINES_KEY = 'navimed_other_medicines';

export function loadMedicines(): OtherMedicine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(MEDICINES_KEY) || '[]');
    // O copie veche sau stricată nu trebuie să blocheze ecranele: păstrăm doar intrările cu nume
    return Array.isArray(parsed) ? parsed.filter(m => m && typeof m.name === 'string' && m.name.trim()) : [];
  } catch (e) {
    return [];
  }
}

export function saveMedicines(list: OtherMedicine[]): void {
  localStorage.setItem(MEDICINES_KEY, JSON.stringify(list));
}

// „Concor 5 mg (dimineața, tensiune)”; pentru ecranul farmacistului, fără „pentru ce”
export const medicineLabel = (m: OtherMedicine, withReason = true) => {
  const details = [m.when, withReason ? m.reason : undefined].filter(Boolean).join(', ');
  return `${[m.name, m.dose].filter(Boolean).join(' ')}${details ? ` (${details})` : ''}`;
};
