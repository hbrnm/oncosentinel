// Minutele de mișcare din Jurnal, pe zile (AAAA-LL-ZZ); doar pe dispozitiv, intră în copia de siguranță
export const MOVEMENT_KEY = 'oncosentinel_movement';
export const MAX_MOVEMENT_MINUTES = 600;

export type MovementLog = Record<string, number>;

export function loadMovement(): MovementLog {
  try {
    const parsed = JSON.parse(localStorage.getItem(MOVEMENT_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => typeof v === 'number' && v > 0)) as MovementLog;
  } catch (e) {
    return {};
  }
}

// 0 minute șterge ziua
export function saveMovementDay(day: string, minutes: number): MovementLog {
  const log = loadMovement();
  if (minutes > 0) log[day] = minutes;
  else delete log[day];
  localStorage.setItem(MOVEMENT_KEY, JSON.stringify(log));
  return log;
}
