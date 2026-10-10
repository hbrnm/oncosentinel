import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { DoseLog, SymptomLog } from '../types';

const texts: string[] = [];

// Un document jsPDF fals care reține textele scrise în raport
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function () {
    const overrides: Record<string | symbol, unknown> = {};
    return new Proxy({}, {
      set: (_target, prop, value) => { overrides[prop] = value; return true; },
      get: (_target, prop) => {
        if (prop in overrides) return overrides[prop];
        if (prop === 'text') return (t: string) => { texts.push(t); };
        if (prop === 'splitTextToSize') return (t: string) => [t];
        if (prop === 'lastAutoTable') return { finalY: 120 };
        return () => undefined;
      }
    });
  })
}));

const taken = (iso: string): DoseLog => ({ id: iso, medication_name: 'Tamoxifen', scheduled_for: `${iso}T08:00:00`, taken_at: `${iso}T08:00:00`, status: 'taken' });
const report = () => texts.join('\n');

describe('Raportul PDF pentru medic', () => {
  beforeEach(() => {
    texts.length = 0;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-08T12:00:00'));
  });

  afterEach(() => vi.useRealTimers());

  it('folosește doza din profil, nu 20 mg scris fix', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, medication_dose: '5 mg', tamoxifen_start_date: '2026-01-01' }, [], []);

    expect(report()).toContain('Tamoxifen 5 mg');
    expect(report()).not.toContain('20mg');
  });

  it('calculează aderența pe zilele reale din ultimele 28, nu 100% din dozele marcate', () => {
    const doses = ['2026-10-01', '2026-10-02', '2026-10-03'].map(taken);
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, doses, []);

    expect(report()).toContain('3 din 28 de zile (11%)');
    expect(report()).not.toMatch(/Aderență optimă/);
  });

  it('numără doar zilele de la începutul tratamentului', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-10-04' }, ['2026-10-05'].map(taken), []);

    expect(report()).toContain('1 din 5 zile (20%)');
  });

  it('spune clar când tratamentul nu a început încă', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-11-01' }, [], []);

    expect(report()).toContain('Tratamentul nu a început înca în perioada raportului (ultimele 28 de zile).');
  });

  it('fără dată de start numără toate cele 28 de zile', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '' }, ['2026-10-08'].map(taken), []);

    expect(report()).toContain('1 din 28 de zile (4%)');
    expect(report()).toContain('Start: necompletat');
  });

  it('scrie textul fără ă, ș, ț, pe care fontul PDF le-ar omite', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], []);

    expect(report()).toContain('Raport Periodic de Aderenta');
    expect(report()).not.toMatch(/[ăĂșȘşŞțȚţŢ]/);
  });

  it('nu afirmă semnale de alarmă sau interacțiuni pe care aplicația nu le urmărește', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], []);

    expect(report()).not.toMatch(/Negativ|Neraportat|inhibitori CYP2D6|Ghid Integrativ/);
    expect(report()).toMatch(/nu înregistreaza semnale de alarma/);
  });
});

describe('Raportul PDF: evoluția în ultimele 3 luni', () => {
  beforeEach(() => {
    texts.length = 0;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-08T12:00:00'));
  });

  afterEach(() => vi.useRealTimers());

  const sym = (iso: string, extra: Partial<SymptomLog>): SymptomLog =>
    ({ id: iso, logged_at: `${iso}T12:00:00`, kind: 'symptoms', ...extra } as SymptomLog);

  it('cu simptome în două săptămâni, are secțiunea cu graficele și semnalele de alarmă devin 5', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], [
      sym('2026-10-07', { hot_flashes_count: 4, joint_pain_level: 2, sleep_quality: 3 }),
      sym('2026-09-20', { hot_flashes_count: 1, sleep_quality: 4 })
    ]);

    // Textul din PDF e scris fără ș, ț, ă (pdfText.ts)
    expect(report()).toContain('4. EVOLUTIA ÎN ULTIMELE 3 LUNI (PE SAPTAMÂNI)');
    expect(report()).toContain('5. SEMNALE DE ALARMA SI ALTE MEDICAMENTE');
    // Etichetele din PDF sunt pentru medic (decizia proprietarei, 2026-10-10)
    expect(report()).toContain('Bufeuri: câte a notat pacienta pe saptamâna');
    expect(report()).toContain('Somn: media notelor, 1–5 (5 = foarte bine)');
    expect(report()).not.toContain('ai notat');
  });

  it('fără destule date, secțiunea lipsește', () => {
    generateOncologyReport({ ...DEFAULT_PROFILE, tamoxifen_start_date: '2026-01-01' }, [], []);

    expect(report()).not.toContain('EVOLUTIA');
    expect(report()).toContain('4. SEMNALE DE ALARMA SI ALTE MEDICAMENTE');
  });
});
