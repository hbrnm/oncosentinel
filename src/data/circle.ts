// „Cercul tău”: texte aprobate de proprietară (docs/etapa3-texte.md)

export const MOOD_LINES: { label: string; line: string }[] = [
  { label: 'Foarte bine', line: 'Azi mă simt foarte bine.' },
  { label: 'Bine', line: 'Azi mă simt bine.' },
  { label: 'Echilibrată', line: 'Azi sunt liniștită, nici bine, nici rău.' },
  { label: 'Rău', line: 'Azi e o zi mai grea pentru mine.' },
  { label: 'Foarte rău', line: 'Azi mi-e foarte greu.' }
];

export const HELP_IDEAS: string[] = [
  'Vino cu mine la următorul control.',
  'Sună-mă doar ca să vorbim puțin.',
  'Adu-mi o masă gata făcută.',
  'Ieși cu mine la o plimbare scurtă.',
  'Ajută-mă cu cumpărăturile sau cu treburile casei.',
  'Ascultă-mă, fără să-mi dai sfaturi.',
  'Amintește-mi, din când în când, de pastilă.',
  'Petrece puțin timp cu mine, fără să vorbim despre boală.',
  'Întreabă-mă cum mă simt și de ce am nevoie.',
  'Lasă-mă să mă odihnesc când am nevoie.'
];

export const buildSupporterMessage = (supporterName: string, patientFirstName: string, moodLine: string, ideas: string[]) => {
  const greeting = supporterName.trim() ? `Bună, ${supporterName.trim()}!` : 'Bună!';
  const help = ideas.length > 0 ? ` M-ar ajuta mult dacă:\n${ideas.map((i) => `– ${i}`).join('\n')}\n` : ' ';
  return `${greeting} ${moodLine}${help}Mulțumesc că ești alături de mine. ${patientFirstName}`.trim();
};

export const SHARE_COPIED = 'Am copiat mesajul. Lipește-l în aplicația în care vrei să-l trimiți.';
export const SHARE_FAILED = 'Nu am putut deschide trimiterea. Selectează textul de mai sus și copiază-l de mână.';
