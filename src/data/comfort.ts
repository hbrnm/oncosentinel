// Texte calde aprobate de proprietară (docs/etapa1-texte.md). Fără sfaturi medicale.

// Mesajele de după o notă în jurnal, după starea aleasă (1 = Foarte rău … 5 = Foarte bine)
export const JOURNAL_RESPONSES: Record<number, string[]> = {
  1: [
    'Mulțumesc că ai scris, chiar și într-o zi atât de grea. Nu trebuie să treci prin asta singură.',
    'Zilele grele contează și ele. Fii blândă cu tine azi, cât poți.',
    'Ai pus în cuvinte ce simți, și asta cere curaj. Dacă greutatea nu se ridică, vorbește cu cineva drag sau cu medicul tău.'
  ],
  2: [
    'O zi mai grea nu înseamnă că mergi înapoi. Ai grijă de tine cu răbdare.',
    'Mulțumesc că ai notat. Poate o plimbare scurtă, un ceai cald sau un mesaj către cineva drag te ajută puțin.',
    'E în regulă să nu fii bine azi. Mâine e o zi nouă.'
  ],
  3: [
    'O zi liniștită e și ea un lucru bun. Mulțumesc că ai trecut pe aici.',
    'Ai notat și azi. Pas cu pas, construiești o imagine clară pentru tine și pentru medic.',
    'Ce lucru mic ți-ar face ziua de mâine puțin mai frumoasă?'
  ],
  4: [
    'Mă bucur că a fost o zi bună. Păstrează-ți ceva din ea pentru zilele mai grele.',
    'Ce a făcut ziua de azi bună? Merită ținut minte.',
    'Zilele bune contează. Bucură-te de ea.'
  ],
  5: [
    'Ce frumos! Bucură-te din plin de ziua asta.',
    'O zi minunată merită sărbătorită, chiar și cu ceva mic.',
    'Mulțumesc că ți-ai notat și bucuria. Face parte din drum la fel de mult ca zilele grele.'
  ]
};

// Un mesaj pentru starea dată, care se schimbă de la o zi la alta
export const pickJournalResponse = (mood: number, date: Date = new Date()): string => {
  const list = JOURNAL_RESPONSES[mood] || JOURNAL_RESPONSES[3];
  return list[date.getDate() % list.length];
};

// Cardul de pe Astăzi dinaintea controlului (0 = ziua controlului, 1–3 = zile rămase)
export const controlSupportText = (daysLeft: number) =>
  daysLeft === 0
    ? { title: 'Multă putere azi', text: 'Ia cu tine lista de întrebări. Orice ai simți azi, nu ești singură.' }
    : {
        title: `Controlul se apropie: ${daysLeft === 1 ? 'mâine' : `peste ${daysLeft} zile`}`,
        text: 'E firesc să te simți neliniștită înaintea unui control. Multe femei simt la fel. Notează-ți întrebările și ia-ți un moment de liniște când ai nevoie.'
      };
