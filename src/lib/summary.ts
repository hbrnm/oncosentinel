import { DoseLog, SymptomLog } from '../types';
import { moodLabelFromState } from './mood';

// Rezumate din ce a notat pacienta; textele sunt aprobate (docs/etapa2-texte.md)

export const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Zilele (AAAA-LL-ZZ) din ultimele `days` zile, inclusiv azi, cel mai devreme de la `startDate`
const lastDays = (days: number, from = 0, startDate = '', today = new Date()) => {
  const out: string[] = [];
  for (let i = from + days - 1; i >= from; i--) {
    const iso = localDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
    if (!startDate || iso >= startDate) out.push(iso);
  }
  return out;
};

const takenDays = (doses: DoseLog[]) =>
  new Set(doses.filter(d => d.status === 'taken').map(d => localDay(new Date(d.taken_at || d.scheduled_for))));

// Zile cu doza marcată ca luată, din zilele date, de la începutul tratamentului
const takenIn = (doses: DoseLog[], startDate: string, days: string[]) => {
  const window = days.filter(iso => !startDate || iso >= startDate);
  const taken = takenDays(doses);
  return { taken: window.filter(iso => taken.has(iso)).length, total: window.length };
};

// Perioada din „Pentru medic” și din raportul PDF: ultimele 28 de zile sau,
// cu `since` (data ultimului control), de a doua zi după control până azi
export const periodDays = (since?: string, today = new Date()) => {
  if (!since) return lastDays(28, 0, '', today);
  const [y, m, d] = since.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const count = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return lastDays(Math.max(count, 0), 0, '', today);
};

// „12 iulie”; cu anul, dacă nu e anul curent
export const controlDateLabel = (iso: string, today = new Date()) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('ro-RO', y === today.getFullYear()
    ? { day: 'numeric', month: 'long' }
    : { day: 'numeric', month: 'long', year: 'numeric' });
};

// „1 zi”, „5 zile”, „30 de zile”; la fel pentru note
export const plural = (n: number, one: string, few: string) =>
  n === 1 ? `1 ${one}` : n > 0 && (n % 100 === 0 || n % 100 >= 20) ? `${n} de ${few}` : `${n} ${few}`;

// „Drumul tratamentului” pe Astăzi: doar timpul parcurs de la `startDate`, rotunjit în jos, fără durată totală
export const treatmentJourneyText = (startDate: string, today = new Date()): string | null => {
  if (!startDate) return null;
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  if (!Number.isFinite(days) || days < 1) return null;
  // Început pe 29–31: în lunile mai scurte, luna se împlinește în ultima zi
  const day = Math.min(d, new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate());
  const months = (end.getFullYear() - y) * 12 + end.getMonth() - (m - 1) - (end.getDate() < day ? 1 : 0);
  const years = Math.floor(months / 12);
  if (years > 0 && months % 12 === 0 && end.getDate() === day) {
    return `Azi se ${years === 1 ? 'împlinește' : 'împlinesc'} ${plural(years, 'an', 'ani')} de când ai început tratamentul. Felicitări din inimă.`;
  }
  const time = months < 1
    ? (days < 7 ? plural(days, 'zi', 'zile') : plural(Math.floor(days / 7), 'săptămână', 'săptămâni'))
    : years < 1
      ? plural(months, 'lună', 'luni')
      : months % 12 === 0
        ? plural(years, 'an', 'ani')
        : `${plural(years, 'an', 'ani')} și ${plural(months % 12, 'lună', 'luni')}`;
  return `Ești pe drum de ${time}.`;
};

const logsIn = (symptoms: SymptomLog[], days: string[]) => {
  const set = new Set(days);
  return symptoms.filter(s => set.has(localDay(new Date(s.logged_at))));
};

const average = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;

// „Săptămâna ta”: ultimele 7 zile, comparate cu cele 7 dinainte
export const weekSummary = (symptoms: SymptomLog[], today = new Date()): string[] => {
  const thisWeek = logsIn(symptoms, lastDays(7, 0, '', today));
  const lastWeek = logsIn(symptoms, lastDays(7, 7, '', today));
  const lines: string[] = [];

  const daysNoted = new Set(thisWeek.map(s => localDay(new Date(s.logged_at)))).size;
  if (daysNoted === 0) return ['Săptămâna asta nu ai notat încă. Jurnalul te așteaptă, când vrei.'];
  lines.push(daysNoted === 1 ? 'Ai notat într-o zi din ultimele 7.' : `Ai notat în ${daysNoted} din ultimele 7 zile.`);

  const moods = thisWeek.map(s => s.mood_state).filter((m): m is string => Boolean(m));
  if (moods.length > 0) {
    const counts = new Map<string, number>();
    moods.forEach(m => counts.set(m, (counts.get(m) || 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    lines.push(`Cel mai des te-ai simțit: ${moodLabelFromState(top)}.`);
  }

  const sleepNow = thisWeek.map(s => s.sleep_quality).filter((v): v is number => typeof v === 'number');
  const sleepBefore = lastWeek.map(s => s.sleep_quality).filter((v): v is number => typeof v === 'number');
  if (sleepNow.length > 0 && sleepBefore.length > 0) {
    const diff = average(sleepNow) - average(sleepBefore);
    if (diff >= 0.5) lines.push('Ai dormit mai bine decât săptămâna trecută.');
    else if (diff <= -0.5) lines.push('Somnul a fost mai greu decât săptămâna trecută. Dacă te supără, spune-i medicului.');
    else lines.push('Somnul a fost cam la fel ca săptămâna trecută.');
  }

  // Bufeurile se compară doar din intrările cu simptome (notele simple nu le au)
  const withFlashes = (logs: SymptomLog[]) => logs.filter(s => typeof s.hot_flashes_count === 'number');
  if (withFlashes(thisWeek).length > 0 && withFlashes(lastWeek).length > 0) {
    const flashesNow = thisWeek.reduce((sum, s) => sum + (s.hot_flashes_count || 0), 0);
    const flashesBefore = lastWeek.reduce((sum, s) => sum + (s.hot_flashes_count || 0), 0);
    if (flashesNow < flashesBefore) lines.push('Ai notat mai puține bufeuri decât săptămâna trecută.');
    else if (flashesNow > flashesBefore) lines.push('Ai notat mai multe bufeuri decât săptămâna trecută. Ghidul despre bufeuri te poate ajuta.');
  }

  return lines;
};

const SYMPTOMS: { label: string; noted: (s: SymptomLog) => boolean }[] = [
  { label: 'Bufeuri', noted: s => (s.hot_flashes_count || 0) > 0 },
  { label: 'Dureri articulare', noted: s => (s.joint_pain_level || 0) > 0 },
  { label: 'Dureri osoase', noted: s => (s.bone_pain_level || 0) > 0 },
  { label: 'Oboseală puternică (4–5 din 5)', noted: s => (s.fatigue_level || 0) >= 4 },
  { label: 'Somn slab (1–2 din 5)', noted: s => typeof s.sleep_quality === 'number' && s.sleep_quality <= 2 },
  { label: 'Greață', noted: s => (s.nausea_level || 0) > 0 },
  { label: 'Dureri de cap', noted: s => (s.headache || 0) > 0 },
  { label: 'Ceață mentală', noted: s => (s.brain_fog || 0) > 0 },
  { label: 'Uscăciune a mucoaselor', noted: s => (s.mucosal_dryness || 0) > 0 }
];

// Starea notată cel mai des în note, cu numărul de note
const topMood = (notes: SymptomLog[]) => {
  const counts = new Map<string, number>();
  notes.forEach(s => { if (s.mood_state) counts.set(s.mood_state, (counts.get(s.mood_state) || 0) + 1); });
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? { label: moodLabelFromState(top[0]), count: top[1] } : null;
};

// „Pentru medic”: ultimele 4 săptămâni sau, cu `since`, de la ultimul control
export const doctorSummary = (symptoms: SymptomLog[], doses: DoseLog[], startDate: string, since?: string) => {
  const days = periodDays(since);
  const logs = logsIn(symptoms, days);
  // Notele (stare + gânduri) și simptomele sunt intrări separate; cele vechi le au pe amândouă
  const notes = logs.filter(s => s.kind !== 'symptoms');
  const symptomLogs = logs.filter(s => s.kind !== 'note');
  const top = SYMPTOMS
    .map(({ label, noted }) => ({ label, count: symptomLogs.filter(noted).length }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(s => `${s.label}: ${s.count === 1 ? 'într-o notă' : `în ${plural(s.count, 'notă', 'note')}`}`);
  return { days: days.length, doses: takenIn(doses, startDate, days), notes: notes.length, mood: topMood(notes), top };
};

// „O mică victorie”: praguri pe total, nu pe zile la rând
const VICTORIES = [
  { id: 'doze-365', kind: 'doses', at: 365, text: 'Un an de doze marcate. Felicitări din inimă.' },
  { id: 'doze-100', kind: 'doses', at: 100, text: '100 de zile cu doza marcată. Un drum lung, parcurs zi de zi.' },
  { id: 'doze-30', kind: 'doses', at: 30, text: '30 de zile cu doza marcată. Ești constantă, și se vede.' },
  { id: 'doze-7', kind: 'doses', at: 7, text: 'O săptămână de doze marcate. Fiecare zi contează.' },
  { id: 'note-50', kind: 'notes', at: 50, text: '50 de note în jurnal. Povestea ta, scrisă cu grijă.' },
  { id: 'note-10', kind: 'notes', at: 10, text: '10 note în jurnal. Îți faci timp pentru tine, și asta contează.' },
  { id: 'note-1', kind: 'notes', at: 1, text: 'Prima ta notă în jurnal. Mulțumesc că ai început.' }
] as const;

// Cea mai mare victorie atinsă și încă nevăzută, plus toate pragurile atinse din aceeași categorie (de marcat ca văzute)
export const nextVictory = (doses: DoseLog[], symptoms: SymptomLog[], seen: string[]) => {
  const totals = { doses: takenDays(doses).size, notes: symptoms.filter(s => s.kind !== 'symptoms').length };
  const reached = VICTORIES.filter(v => totals[v.kind] >= v.at);
  const next = reached.find(v => !seen.includes(v.id));
  if (!next) return null;
  return { id: next.id, text: next.text, reachedIds: reached.filter(v => v.kind === next.kind).map(v => v.id) };
};

// „Ultimele 3 luni”: 13 săptămâni (cea mai veche prima), doar din intrările cu simptome;
// o valoare lipsește (null) când în săptămâna aceea nu s-a notat
export interface TrendWeek { start: string; end: string; flashes: number | null; joint: number | null; sleep: number | null }

export const TREND_WEEKS = 13;

export const symptomTrend = (symptoms: SymptomLog[], today = new Date()): TrendWeek[] => {
  const symptomLogs = symptoms.filter(s => s.kind !== 'note');
  const weeks: TrendWeek[] = [];
  for (let i = TREND_WEEKS - 1; i >= 0; i--) {
    const days = lastDays(7, i * 7, '', today);
    const logs = logsIn(symptomLogs, days);
    const values = (pick: (s: SymptomLog) => number | undefined, min: number) =>
      logs.map(pick).filter((v): v is number => typeof v === 'number' && v >= min);
    const flashes = values(s => s.hot_flashes_count, 0);
    const joint = values(s => s.joint_pain_level, 0);
    const sleep = values(s => s.sleep_quality, 1);
    weeks.push({
      start: days[0],
      end: days[days.length - 1],
      flashes: flashes.length > 0 ? flashes.reduce((a, b) => a + b, 0) : null,
      joint: joint.length > 0 ? Math.round(average(joint) * 10) / 10 : null,
      sleep: sleep.length > 0 ? Math.round(average(sleep) * 10) / 10 : null
    });
  }
  return weeks;
};

// Graficul apare după simptome notate în cel puțin două săptămâni
export const trendHasData = (weeks: TrendWeek[]) =>
  weeks.filter(w => w.flashes !== null || w.joint !== null || w.sleep !== null).length >= 2;

// „6–12 oct.”, sau „29 sept. – 5 oct.” peste luni
export const weekLabel = (w: TrendWeek) => {
  const toDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
  const start = toDate(w.start);
  const end = toDate(w.end);
  const short = (d: Date) => d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
  return start.getMonth() === end.getMonth() ? `${start.getDate()}–${short(end)}` : `${short(start)} – ${short(end)}`;
};
