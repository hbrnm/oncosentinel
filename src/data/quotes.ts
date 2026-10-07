/**
 * Curated empathetic and mindful quotes for breast cancer survivors & endocrine therapy.
 * Rotation based on time of day, day of year, or manual refresh tap.
 */

export interface MindfulQuote {
  id: string;
  text: string;
  author: string;
  tag?: 'dimineata' | 'zi' | 'seara' | 'general';
}

export const MINDFUL_QUOTES: MindfulQuote[] = [
  // Dimineața (Energie calmă, răbdare, respirație)
  {
    id: 'q1',
    text: '„Îngrijirea de sine nu este un lux, ci o parte din tratament.”',
    author: 'OncoSentinel',
    tag: 'dimineata'
  },
  {
    id: 'q2',
    text: '„Fiecare dimineață este o dovadă a puterii tale. Ia fiecare oră pe rând.”',
    author: 'Gândul zilei',
    tag: 'dimineata'
  },
  {
    id: 'q3',
    text: '„Vindecarea nu este o cursă, ci o călătorie de blândețe cu propriul corp.”',
    author: 'Gândul zilei',
    tag: 'dimineata'
  },

  // După-amiaza (Echilibru, pauză, acceptare)
  {
    id: 'q4',
    text: '„Ascultă-ți corpul: dacă îți cere odihnă, oferă-i-o fără nicio vinovăție.”',
    author: 'OncoSentinel',
    tag: 'zi'
  },
  {
    id: 'q5',
    text: '„Ești mult mai puternică decât momentele în care te simți vulnerabilă.”',
    author: 'Gândul zilei',
    tag: 'zi'
  },
  {
    id: 'q6',
    text: '„Un pas mic făcut astăzi este un pas mare pentru sănătatea ta de mâine.”',
    author: 'OncoSentinel',
    tag: 'zi'
  },

  // Seara (Liniște, recunoștință, eliberare)
  {
    id: 'q7',
    text: '„Ai făcut tot ce ai putut astăzi, și asta este mai mult decât de ajuns.”',
    author: 'Liniște de seară',
    tag: 'seara'
  },
  {
    id: 'q8',
    text: '„Lasă grijile deoparte pentru noapte. Mâine soarele va răsări din nou pentru tine.”',
    author: 'Liniște de seară',
    tag: 'seara'
  },
  {
    id: 'q9',
    text: '„Fii mândră de fiecare zi pe care ai parcurs-o cu curaj și răbdare.”',
    author: 'OncoSentinel',
    tag: 'seara'
  },

  // Generale (Suport emoțional cald)
  {
    id: 'q10',
    text: '„Nu trebuie să fii puternică în fiecare secundă. E perfect în regulă să fii doar tu.”',
    author: 'Gândul zilei',
    tag: 'general'
  },
  {
    id: 'q11',
    text: '„Curajul nu înseamnă lipsa fricii, ci decizia de a merge mai departe cu blândețe.”',
    author: 'OncoSentinel',
    tag: 'general'
  },
  {
    id: 'q12',
    text: '„Fiecare comprimat luat este un scut pentru viitorul tău luminos.”',
    author: 'OncoSentinel',
    tag: 'general'
  }
];

/**
 * Returns a quote based on current hour and day, or deterministic index
 */
export function getMindfulQuoteForHour(currentHour: number, manualOffset = 0): MindfulQuote {
  // Filter candidates suited for current time of day or general
  let period: 'dimineata' | 'zi' | 'seara' = 'dimineata';
  if (currentHour >= 12 && currentHour < 18) {
    period = 'zi';
  } else if (currentHour >= 18 || currentHour < 5) {
    period = 'seara';
  }

  const pool = MINDFUL_QUOTES.filter(q => q.tag === period || q.tag === 'general');
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Combine day of year + time slot (morning / noon / evening) + manual offset
  const timeSlot = period === 'dimineata' ? 0 : period === 'zi' ? 1 : 2;
  const index = Math.abs((dayOfYear * 3 + timeSlot + manualOffset) % pool.length);
  return pool[index] || MINDFUL_QUOTES[0];
}
