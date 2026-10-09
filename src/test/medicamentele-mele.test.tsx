import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { TreatmentTab } from '../components/TreatmentTab';
import { DoctorVisitModal } from '../components/DoctorVisitModal';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { INTERACTIONS_DB, findInteraction, normalizeName } from '../lib/interactions';
import { MEDICINES_KEY } from '../lib/myMedicines';
import { backupService } from '../lib/backupService';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { foldRomanian } from '../lib/pdfText';

// Medicamentele mele (planul 007, etapa 1; deciziile proprietarei din 2026-10-09)

const texts: string[] = [];
const added = { pages: 0 };
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function () {
    const overrides: Record<string | symbol, unknown> = {};
    return new Proxy({}, {
      set: (_target, prop, value) => { overrides[prop] = value; return true; },
      get: (_target, prop) => {
        if (prop in overrides) return overrides[prop];
        if (prop === 'text') return (t: string | string[]) => { texts.push(([] as string[]).concat(t).join(' ')); };
        if (prop === 'splitTextToSize') return (t: string) => t.match(/.{1,90}(\s|$)/g) || [t];
        if (prop === 'addPage') return () => { added.pages++; };
        if (prop === 'lastAutoTable') return { finalY: 120 };
        return () => undefined;
      }
    });
  })
}));

const profile = { ...DEFAULT_PROFILE, medication_name: 'Tamoxifen', medication_dose: '20 mg', tamoxifen_start_date: '2025-07-01' };
const saved = (list: unknown[]) => localStorage.setItem(MEDICINES_KEY, JSON.stringify(list));

beforeEach(() => {
  localStorage.clear();
  texts.length = 0;
  added.pages = 0;
});
afterEach(() => vi.restoreAllMocks());

describe('Potrivirea cu lista aprobată', () => {
  it('recunoaște substanța fără diacritice și fără majuscule', () => {
    expect(findInteraction('Fluoxetină 20 mg')?.levelLabel).toBe('De evitat');
    expect(findInteraction('FLUOXETINA')?.levelLabel).toBe('De evitat');
    expect(findInteraction('ceai de sunătoare')?.substance).toMatch(/Sunătoare/);
    expect(findInteraction('Acenocumarol')?.levelLabel).toBe('Spune medicului');
    // grafia internațională, de pe unele cutii
    expect(findInteraction('Warfarin')?.levelLabel).toBe('Spune medicului');
    expect(findInteraction('Fluoxetine')?.levelLabel).toBe('De evitat');
    expect(findInteraction('Etinilestradiol')?.substance).toMatch(/estrogen/);
    expect(findInteraction('comprimate contraceptive')?.substance).toMatch(/estrogen/);
  });

  it('un medicament care nu e în listă nu se potrivește', () => {
    expect(findInteraction('Concor')).toBeUndefined();
    expect(findInteraction('')).toBeUndefined();
  });

  it('cuvintele de potrivire vin din numele aprobat al substanței sau sunt aprobate separat', () => {
    const approvedExtra = ['estradiol', 'contraceptiv']; // proprietara, 2026-10-09
    for (const item of INTERACTIONS_DB) {
      expect(item.match.length).toBeGreaterThan(0);
      const words = normalizeName(item.substance);
      for (const word of item.match.filter(w => !approvedExtra.includes(w))) expect(words).toContain(word.split(' ')[0]);
    }
  });
});

describe('O copie stricată', () => {
  it('nu blochează Tratamentul: intrările fără nume se ignoră', () => {
    saved([null, { id: 'x' }, { id: 'm1', name: 'Magneziu' }]);
    render(<TreatmentTab profile={profile} doses={[]} onTakeDose={() => {}} />);
    expect(screen.getByText('Magneziu')).toBeInTheDocument();
  });
});

describe('În Tratament', () => {
  const renderTab = () => render(<TreatmentTab profile={profile} doses={[]} onTakeDose={() => {}} />);

  it('fără medicamente: textul de început, fără butonul pentru farmacist', () => {
    renderTab();
    expect(screen.getByText('Alte medicamente pe care le iau')).toBeInTheDocument();
    expect(screen.getByText('Nu ai notat alte medicamente. Adaugă-le aici, ca să le ai la îndemână la medic și la farmacie.')).toBeInTheDocument();
    expect(screen.queryByText('Arată farmacistului')).not.toBeInTheDocument();
  });

  it('adaugă un medicament și îl păstrează pe telefon', () => {
    renderTab();
    fireEvent.click(screen.getByText('Adaugă un medicament'));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Numele medicamentului'), { target: { value: 'Concor' } });
    fireEvent.change(within(dialog).getByLabelText('Doza (opțional)'), { target: { value: '5 mg' } });
    fireEvent.change(within(dialog).getByLabelText('Când îl iei (opțional)'), { target: { value: 'dimineața' } });
    fireEvent.change(within(dialog).getByLabelText('Pentru ce (opțional)'), { target: { value: 'tensiune' } });
    fireEvent.click(within(dialog).getByText('Salvează'));

    expect(screen.getByText('Concor 5 mg')).toBeInTheDocument();
    expect(screen.getByText('dimineața · tensiune')).toBeInTheDocument();
    expect(screen.getByText(/Nu e în lista noastră scurtă de interacțiuni cu tamoxifenul/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(MEDICINES_KEY)!)[0]).toMatchObject({ name: 'Concor', dose: '5 mg', when: 'dimineața', reason: 'tensiune' });
  });

  it('la potrivire arată nivelul în text, sfatul aprobat și trimiterea la medic', () => {
    saved([{ id: 'm1', name: 'Fluoxetină' }]);
    renderTab();
    expect(screen.getByText('De evitat')).toBeInTheDocument();
    expect(screen.getByText(INTERACTIONS_DB[0].advice)).toBeInTheDocument();
    expect(screen.getByText('Vorbește cu medicul înainte să schimbi ceva.')).toBeInTheDocument();
    expect(screen.queryByText(/Nu e în lista noastră scurtă/)).not.toBeInTheDocument();
  });

  it('ecranul pentru farmacist', () => {
    saved([{ id: 'm1', name: 'Concor', dose: '5 mg', when: 'dimineața', reason: 'tensiune' }, { id: 'm2', name: 'Magneziu' }]);
    renderTab();
    fireEvent.click(screen.getByText('Arată farmacistului'));
    const dialog = screen.getByRole('dialog', { name: 'Arată farmacistului' });
    expect(within(dialog).getByText('Iau Tamoxifen 20 mg din 1 iulie 2025.')).toBeInTheDocument();
    expect(within(dialog).getByText('Iau și: Concor 5 mg (dimineața), Magneziu.')).toBeInTheDocument();
    expect(within(dialog).getByText('Pot lua aceste medicamente împreună?')).toBeInTheDocument();
  });

  it('șterge un medicament după confirmare', () => {
    saved([{ id: 'm1', name: 'Concor' }]);
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderTab();
    fireEvent.click(screen.getByLabelText('Șterge Concor'));
    expect(confirm).toHaveBeenCalledWith('Sigur ștergi „Concor” din listă?');
    expect(screen.queryByText('Concor')).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(MEDICINES_KEY)!)).toEqual([]);
  });
});

describe('Pentru medic, PDF și copia de siguranță', () => {
  const list = [{ id: 'm1', name: 'Concor', dose: '5 mg', when: 'dimineața', reason: 'tensiune' }, { id: 'm2', name: 'Magneziu' }];

  it('„Pentru medic” arată lista', () => {
    saved(list);
    render(<DoctorVisitModal isOpen onClose={vi.fn()} profile={profile} doses={[]} symptoms={[]} />);
    expect(screen.getByText('Alte medicamente: Concor 5 mg (dimineața, tensiune); Magneziu.')).toBeInTheDocument();
  });

  it('raportul PDF are lista și nu mai spune că aplicația nu înregistrează medicamente', () => {
    saved(list);
    generateOncologyReport(profile, [], []);
    const report = texts.join('\n');
    expect(report).toContain(foldRomanian('Alte medicamente: Concor 5 mg (dimineața, tensiune); Magneziu.'));
    expect(report).not.toContain('nici alte medicamente');
  });

  it('o listă lungă continuă pe pagina următoare', () => {
    saved(Array.from({ length: 120 }, (_, i) => ({ id: `m${i}`, name: `Medicament ${i}`, dose: '10 mg', when: 'seara' })));
    generateOncologyReport(profile, [], []);
    expect(added.pages).toBeGreaterThan(0);
    expect(texts.join('\n')).toContain('Medicament 119');
  });

  it('raportul PDF fără medicamente notate', () => {
    generateOncologyReport(profile, [], []);
    expect(texts.join('\n')).toContain(foldRomanian('Pacienta nu a notat alte medicamente în aplicație.'));
  });

  it('copia de siguranță păstrează lista', async () => {
    saved(list);
    Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => { blob = b; return 'blob:x'; });
    URL.revokeObjectURL = vi.fn();
    backupService.exportCompleteBackup();
    const text = await blob!.text();
    localStorage.clear();
    await backupService.importBackupFromFile(new File([text], 'copie.json'));
    expect(localStorage.getItem(MEDICINES_KEY)).toContain('Magneziu');
  });
});
