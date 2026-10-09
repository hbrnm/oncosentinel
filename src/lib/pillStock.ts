import { plural } from './summary';

// „Pastilele se termină” (planul 008): pragul și „Mai târziu” se țin pe dispozitiv
export const LOW_STOCK = 7;
export const STOCK_SNOOZE_KEY = 'oncosentinel_stock_snooze_until';
const SNOOZE_DAYS = 2;
const DAY = 24 * 60 * 60 * 1000;

export const shouldRemindStock = (stock: number, now: Date = new Date()) => {
  const until = Date.parse(localStorage.getItem(STOCK_SNOOZE_KEY) || '');
  if (!Number.isNaN(until) && until > now.getTime()) return false;
  return stock <= LOW_STOCK;
};

export const snoozeStockReminder = (now: Date = new Date()) => {
  localStorage.setItem(STOCK_SNOOZE_KEY, new Date(now.getTime() + SNOOZE_DAYS * DAY).toISOString());
};

// După o cutie nouă, cardul poate apărea din nou când stocul scade iar
export const clearStockSnooze = () => localStorage.removeItem(STOCK_SNOOZE_KEY);

// „6 pastile”, „o pastilă”, „23 de pastile”
const pills = (n: number) => (n === 1 ? 'o pastilă' : plural(n, 'pastilă', 'pastile'));

export const lowStockText = (stock: number, medName: string) =>
  stock <= 0
    ? 'Pastilele notate s-au terminat. Dacă ai deja o cutie nouă, adaug-o aici, ca să știi mereu câte mai ai.'
    : `Mai ai ${pills(stock)} de ${medName}. E un moment bun să ceri o rețetă nouă și să treci pe la farmacie.`;

export const stockLine = (stock: number) =>
  stock <= 0 ? 'Pastilele notate s-au terminat.' : `Mai ai ${pills(stock)}.`;

export const addedPillsText = (added: number, total: number) =>
  `Am adăugat ${plural(added, 'pastilă', 'pastile')}. Acum ai ${total}.`;
