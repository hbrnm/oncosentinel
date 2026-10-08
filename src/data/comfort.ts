// Texte calde aprobate de proprietară (docs/etapa1-texte.md, docs/etapa5-texte.md). Fără sfaturi medicale.

// Mesajele de după o notă în jurnal, după starea aleasă (1 = Foarte rău … 5 = Foarte bine)
export const JOURNAL_RESPONSES: Record<number, string[]> = {
  1: [
    'Mulțumesc că ai scris, chiar și într-o zi atât de grea. Nu trebuie să treci prin asta singură.',
    'Zilele grele contează și ele. Fii blândă cu tine azi, cât poți.',
    'Ai pus în cuvinte ce simți, și asta cere curaj. Dacă greutatea nu se ridică, vorbește cu cineva drag sau cu medicul tău.',
    'Azi a fost greu. Nu trebuie să repari nimic acum; e destul că ai ajuns până aici.',
    'Lasă ziua asta să fie ce a fost. Mâine o iei de la capăt, în ritmul tău.',
    'Ce ai simțit azi e real și contează. Ai voie să te odihnești fără să te simți vinovată.',
    'Dacă poți, spune-i cuiva drag cum îți e. Nu trebuie să cari singură greutatea asta.',
    'Chiar și într-o zi grea, ai avut grijă de tine scriind aici. Asta înseamnă ceva.',
    'Respiră încet de câteva ori. Ziua asta va trece, chiar dacă acum nu pare.',
    'Fii pentru tine prietena care ai fi pentru altcineva într-o zi ca asta.'
  ],
  2: [
    'O zi mai grea nu înseamnă că mergi înapoi. Ai grijă de tine cu răbdare.',
    'Mulțumesc că ai notat. Poate o plimbare scurtă, un ceai cald sau un mesaj către cineva drag te ajută puțin.',
    'E în regulă să nu fii bine azi. Mâine e o zi nouă.',
    'Oboseala e și ea un semn: corpul îți cere puțină odihnă. Ascultă-l cât poți.',
    'Azi poți face mai puțin. Și e în regulă.',
    'Ai ajuns la capătul unei zile obositoare. Lasă lucrurile mici pentru mâine.',
    'Un pahar cu apă, o pătură, câteva minute de liniște: lucruri mici care pot ajuta.',
    'Mulțumesc că ai notat, chiar și obosită. Fiecare notă te ajută să vezi drumul mai clar.',
    'Nu trebuie să fii puternică în fiecare zi. Uneori e destul să fii.',
    'Odihnește-te fără grabă. Mâine te așteaptă cu răbdare.'
  ],
  3: [
    'O zi liniștită e și ea un lucru bun. Mulțumesc că ai trecut pe aici.',
    'Ai notat și azi. Pas cu pas, construiești o imagine clară pentru tine și pentru medic.',
    'Ce lucru mic ți-ar face ziua de mâine puțin mai frumoasă?',
    'Liniștea de azi e un dar mic. Păstrează-o cu tine.',
    'Mulțumesc că ai scris. Zilele obișnuite sunt și ele o parte frumoasă a drumului.',
    'Ce ți-a adus liniștea azi? Poate merită repetat.',
    'O zi fără furtuni e un motiv bun de recunoștință.',
    'Ai grijă de tine la fel de blând și mâine.',
    'Pas cu pas, zi cu zi. Azi a fost un pas bun.',
    'Mă bucur că ai avut o zi mai așezată. O meriți.'
  ],
  4: [
    'Mă bucur că a fost o zi bună. Păstrează-ți ceva din ea pentru zilele mai grele.',
    'Ce a făcut ziua de azi bună? Merită ținut minte.',
    'Zilele bune contează. Bucură-te de ea.',
    'Ce bine că ai avut o zi bună! Ține minte cum te-ai simțit.',
    'Zilele bune îți dau putere pentru cele care vin. Bucură-te de ea.',
    'Poate împarți ceva din bucuria de azi cu cineva drag.',
    'Mulțumesc că ai scris și într-o zi bună. Și ele merită notate.',
    'Ai avut grijă de tine, și se vede. Continuă în ritmul tău.',
    'Un zâmbet de azi e o amintire bună pentru mâine.',
    'Mă bucur pentru tine. Lasă-te să te bucuri fără griji.'
  ],
  5: [
    'Ce frumos! Bucură-te din plin de ziua asta.',
    'O zi minunată merită sărbătorită, chiar și cu ceva mic.',
    'Mulțumesc că ți-ai notat și bucuria. Face parte din drum la fel de mult ca zilele grele.',
    'Ce zi frumoasă! Merită o mică sărbătoare.',
    'Bucuria ta de azi contează la fel de mult ca orice altceva din drumul tău.',
    'Ține minte ziua asta: e dovada că vin și zile foarte bune.',
    'Ce te-a făcut să te simți atât de bine? Notează-ți, ca să-ți amintești.',
    'Lasă bucuria de azi să te însoțească și mâine.',
    'Poate împarți vestea bună cu cineva drag. Bucuria crește când e împărțită.',
    'Zilele ca asta merită păstrate. Mulțumesc că ai notat-o.'
  ]
};

// Un mesaj pentru starea dată, care se schimbă de la o zi la alta
export const pickJournalResponse = (mood: number, date: Date = new Date()): string => {
  const list = JOURNAL_RESPONSES[mood] || JOURNAL_RESPONSES[3];
  return list[date.getDate() % list.length];
};

// Nota fără diacritice și cu litere mici, ca „frică”, „frica” și „FRICĂ” să fie găsite la fel
const normalize = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, ' ');

// Cuvinte despre a-și face rău: mesaj fix cu 112, la orice stare (docs/etapa5-texte.md)
const CRISIS_PATTERN = /vreau sa mor|nu mai vreau sa traiesc|sa (mi|imi) iau viata|sinucid|sa ma omor|sa (mi|imi) fac rau|nu mai are rost/;

export const CRISIS_RESPONSE =
  'Ce ai scris contează mult și nu trebuie să treci singură prin asta. Dacă te gândești să-ți faci rău, sună acum la 112 sau vorbește chiar acum cu cineva în care ai încredere.';

// Mesaje pe subiecte, doar la Greu, Obosită și Liniștită; primul subiect găsit câștigă
export const TOPIC_RESPONSES: { pattern: RegExp; text: string }[] = [
  {
    pattern: /\b(control|analize|rezultat|mamografi|ecografi)/,
    text: 'Așteptarea unui control sau a unor rezultate poate fi apăsătoare. E firesc să te temi. Notează-ți întrebările pentru medic și ia-ți momente de liniște.'
  },
  {
    pattern: /\b(frica|frici\b|teama|ma tem|temer|anxiet|panic|ingrijor)/,
    text: 'Frica e grea de purtat. Nu trebuie să o ascunzi: vorbește cu cineva drag sau cu medicul tău despre ce te îngrijorează. Când e greu, butonul cu inimă te ajută să respiri.'
  },
  {
    pattern: /\b(somn|dorm|insomni|noaptea)/,
    text: 'Nopțile fără somn fac totul mai greu. Dacă se repetă, notează-le și spune-i medicului: împreună puteți găsi ce ajută.'
  },
  {
    pattern: /\b(obosit|oboseal|epuizat|fara energie)/,
    text: 'Oboseala poate fi foarte reală în aceste luni. Fă-ți loc pentru odihnă și, dacă nu trece, spune-i medicului.'
  },
  {
    pattern: /\b(bufeu|transpir)/,
    text: 'Bufeurile pot fi obositoare. Notează-le la simptome, ca să le poți discuta cu medicul. În Ghiduri găsești ce ajută, după studii.'
  },
  {
    pattern: /\b(ma simt singura|sunt singura|singuratat|nimeni\b)/,
    text: 'Poate te simți singură azi. Din „Cercul tău” poți trimite un mesaj cuiva drag, cu ce ți-ar fi de ajutor.'
  }
];

// Mesajul de după notă: criză, apoi subiect (stările 1–3), apoi lista stării
export const journalResponseFor = (mood: number, note = '', date: Date = new Date()): { text: string; crisis: boolean } => {
  const text = normalize(note);
  if (CRISIS_PATTERN.test(text)) return { text: CRISIS_RESPONSE, crisis: true };
  if (mood <= 3) {
    const topic = TOPIC_RESPONSES.find(t => t.pattern.test(text));
    if (topic) return { text: topic.text, crisis: false };
  }
  return { text: pickJournalResponse(mood, date), crisis: false };
};

// Cardul de pe Astăzi dinaintea controlului (0 = ziua controlului, 1–3 = zile rămase)
export const controlSupportText = (daysLeft: number) =>
  daysLeft === 0
    ? { title: 'Multă putere azi', text: 'Ia cu tine lista de întrebări. Orice ai simți azi, nu ești singură.' }
    : {
        title: `Controlul se apropie: ${daysLeft === 1 ? 'mâine' : `peste ${daysLeft} zile`}`,
        text: 'E firesc să te simți neliniștită înaintea unui control. Multe femei simt la fel. Notează-ți întrebările și ia-ți un moment de liniște când ai nevoie.'
      };
