import React from 'react';
import { TrendingUp } from 'lucide-react';
import { SymptomLog } from '../types';
import { symptomTrend, trendHasData, weekLabel, TrendWeek } from '../lib/summary';

// „Ultimele 3 luni”: trei grafice mici, câte unul pe simptom, cu scala lui; textele sunt aprobate de proprietară

type Series = { key: 'flashes' | 'joint' | 'sleep'; label: string; column: string; max: (weeks: TrendWeek[]) => number };

const SERIES: Series[] = [
  { key: 'flashes', label: 'Bufeuri: câte ai notat pe săptămână', column: 'Bufeuri', max: weeks => Math.max(1, ...weeks.map(w => w.flashes ?? 0)) },
  { key: 'joint', label: 'Dureri articulare: media notelor, de la 0 la 5', column: 'Dureri articulare', max: () => 5 },
  { key: 'sleep', label: 'Somn: media notelor, de la 1 la 5 (5 = foarte bine)', column: 'Somn', max: () => 5 }
];

const W = 300;
const H = 56;
const SLOT = W / 13;
const BAR = 12;

// Bară cu colțurile de sus rotunjite, sprijinită pe linia de jos
const barPath = (x: number, h: number) => {
  const r = Math.min(4, h, BAR / 2);
  const y = H - h;
  return `M${x},${H} V${y + r} Q${x},${y} ${x + r},${y} H${x + BAR - r} Q${x + BAR},${y} ${x + BAR},${y + r} V${H} Z`;
};

const format = (v: number) => v.toLocaleString('ro-RO');

const MiniBars: React.FC<{ series: Series; weeks: TrendWeek[] }> = ({ series, weeks }) => {
  const max = series.max(weeks);
  // Doar ultima săptămână notată primește valoarea scrisă deasupra barei
  const lastIndex = weeks.reduce((last, w, i) => (w[series.key] !== null ? i : last), -1);
  return (
    <figure className="m-0">
      <figcaption className="text-[0.75rem] font-semibold text-ink dark:text-gray-200 mb-1.5">{series.label}</figcaption>
      <svg viewBox={`0 -14 ${W} ${H + 15}`} className="w-full h-auto overflow-visible" aria-hidden="true">
        <line x1="0" y1={H + 0.5} x2={W} y2={H + 0.5} className="stroke-sage-200 dark:stroke-darkbg-border" strokeWidth="1" />
        {weeks.map((w, i) => {
          const v = w[series.key];
          if (v === null) return null;
          const x = i * SLOT + (SLOT - BAR) / 2;
          const h = Math.max((v / max) * H, v > 0 ? 2 : 0);
          return (
            <g key={w.start}>
              {/* zona de atingere mai mare decât bara, pentru indiciul cu valoarea */}
              <rect x={i * SLOT} y={-14} width={SLOT} height={H + 14} fill="transparent">
                <title>{`${weekLabel(w)}: ${format(v)}`}</title>
              </rect>
              {h > 0 && <path d={barPath(x, h)} className="fill-sage-500 dark:fill-sage-400 pointer-events-none" />}
              {i === lastIndex && (
                <text x={x + BAR / 2} y={H - h - 4} textAnchor="middle" className="fill-ink dark:fill-gray-200 text-[0.6875rem] font-semibold pointer-events-none">
                  {format(v)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between text-[0.6875rem] text-ink-soft dark:text-gray-400 mt-1">
        <span>{weekLabel(weeks[0])}</span>
        <span>{weekLabel(weeks[weeks.length - 1])}</span>
      </div>
    </figure>
  );
};

export const TrendChart: React.FC<{ symptoms: SymptomLog[] }> = ({ symptoms }) => {
  const weeks = symptomTrend(symptoms);
  const hasData = trendHasData(weeks);
  return (
    <section aria-labelledby="trend-title" className="organic-card rounded-[28px] p-5">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-sage-deep dark:text-sage-400" aria-hidden="true" />
        <h2 id="trend-title" className="font-serif text-lg text-ink dark:text-white">Ultimele 3 luni</h2>
      </div>
      {!hasData ? (
        <p className="text-[0.8125rem] text-ink-soft dark:text-gray-400 leading-relaxed">Graficul apare după ce notezi simptome în cel puțin două săptămâni.</p>
      ) : (
        <>
          <p className="text-[0.8125rem] text-ink-soft dark:text-gray-400 mb-4">Cum au evoluat, săptămână cu săptămână, din ce ai notat tu.</p>
          <div className="space-y-5">
            {SERIES.map(s => <MiniBars key={s.key} series={s} weeks={weeks} />)}
          </div>
          {/* Aceleași valori ca tabel, pentru cititorul de ecran */}
          <div className="sr-only">
            <table>
              <caption>Ultimele 3 luni</caption>
              <thead>
                <tr><th scope="col">Săptămâna</th>{SERIES.map(s => <th key={s.key} scope="col">{s.column}</th>)}</tr>
              </thead>
              <tbody>
                {weeks.map(w => (
                  <tr key={w.start}>
                    <th scope="row">{weekLabel(w)}</th>
                    {SERIES.map(s => <td key={s.key}>{w[s.key] === null ? '–' : format(w[s.key] as number)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.6875rem] text-ink-soft dark:text-gray-400 italic mt-4">Săptămânile fără note rămân goale.</p>
        </>
      )}
    </section>
  );
};
