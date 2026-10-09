import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { DashboardTab } from '../components/DashboardTab';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { shouldRemindStock, snoozeStockReminder, lowStockText, stockLine, addedPillsText, safeStock, STOCK_SNOOZE_KEY } from '../lib/pillStock';

// Pastilele se termină (planul 008; deciziile proprietarei din 2026-10-09)

const NOW = new Date(2026, 9, 9, 12, 0);
const profile = (stock: number) => ({ ...DEFAULT_PROFILE, medication_name: 'Tamoxifen', pill_stock_count: stock });

beforeEach(() => localStorage.clear());
afterEach(() => vi.useRealTimers());

describe('Când apare cardul', () => {
  it('la 7 pastile sau mai puțin', () => {
    expect(shouldRemindStock(8, NOW)).toBe(false);
    expect(shouldRemindStock(7, NOW)).toBe(true);
    expect(shouldRemindStock(0, NOW)).toBe(true);
  });

  it('„Mai târziu” îl ascunde 2 zile', () => {
    snoozeStockReminder(NOW);
    expect(shouldRemindStock(3, new Date(2026, 9, 10, 12))).toBe(false);
    expect(shouldRemindStock(3, new Date(2026, 9, 11, 13))).toBe(true);
  });
});

describe('Textele', () => {
  it('cardul, rândul din Tratament și confirmarea', () => {
    expect(lowStockText(6, 'Tamoxifen')).toBe('Mai ai 6 pastile de Tamoxifen. E un moment bun să ceri o rețetă nouă și să treci pe la farmacie.');
    expect(lowStockText(1, 'Tamoxifen')).toBe('Mai ai o pastilă de Tamoxifen. E un moment bun să ceri o rețetă nouă și să treci pe la farmacie.');
    expect(lowStockText(0, 'Tamoxifen')).toBe('Pastilele notate s-au terminat. Dacă ai deja o cutie nouă, adaug-o aici, ca să știi mereu câte mai ai.');
    expect(stockLine(23)).toBe('Mai ai 23 de pastile.');
    expect(stockLine(1)).toBe('Mai ai o pastilă.');
    expect(stockLine(0)).toBe('Pastilele notate s-au terminat.');
    expect(addedPillsText(30, 36)).toBe('Am adăugat 30 de pastile. Acum ai 36.');
  });
});

describe('Pe Astăzi', () => {
  const renderToday = (stock: number, onAddPills = vi.fn(() => true)) => {
    render(
      <DashboardTab
        profile={profile(stock)}
        doses={[]}
        onTakeDose={() => {}}
        onOpenRedFlags={() => {}}
        onOpenBreathing={() => {}}
        onOpenDoctorVisit={() => {}}
        onOpenGrounding={() => {}}
        onOpenSupporter={() => {}}
        onAddPills={onAddPills}
      />
    );
    return onAddPills;
  };

  it('cu stoc suficient nu apare', () => {
    renderToday(20);
    expect(screen.queryByText('Pastilele se termină curând')).not.toBeInTheDocument();
  });

  it('„Am o cutie nouă” adaugă pastilele și confirmă', () => {
    const onAddPills = renderToday(6);
    expect(screen.getByText('Pastilele se termină curând')).toBeInTheDocument();
    expect(screen.getByText(/Mai ai 6 pastile de Tamoxifen/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Am o cutie nouă'));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText('Câte pastile are cutia nouă?')).toHaveValue(30);
    fireEvent.click(within(dialog).getByText('Adaugă'));
    expect(onAddPills).toHaveBeenCalledWith(30);
    expect(screen.getByRole('status')).toHaveTextContent('Am adăugat 30 de pastile. Acum ai 36.');
  });

  it('fără confirmare dacă salvarea n-a reușit; număr nevalid nu se adaugă', () => {
    const onAddPills = renderToday(6, vi.fn(() => false));
    fireEvent.click(screen.getByText('Am o cutie nouă'));
    const input = within(screen.getByRole('dialog')).getByLabelText('Câte pastile are cutia nouă?');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.submit(input.closest('form')!);
    expect(onAddPills).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '30' } });
    fireEvent.submit(input.closest('form')!);
    expect(onAddPills).toHaveBeenCalledWith(30);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('„Anulează” închide fereastra fără să schimbe stocul', () => {
    const onAddPills = renderToday(6);
    fireEvent.click(screen.getByText('Am o cutie nouă'));
    fireEvent.click(screen.getByText('Anulează'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onAddPills).not.toHaveBeenCalled();
  });

  it('„Mai târziu” ascunde cardul', () => {
    renderToday(3);
    fireEvent.click(screen.getByText('Mai târziu'));
    expect(screen.queryByText('Pastilele se termină curând')).not.toBeInTheDocument();
    expect(localStorage.getItem(STOCK_SNOOZE_KEY)).not.toBeNull();
  });
});

describe('Un profil vechi fără stoc', () => {
  it('se socotește 0, nu NaN', () => {
    expect(safeStock(undefined)).toBe(0);
    expect(safeStock(NaN)).toBe(0);
    expect(safeStock(-3)).toBe(0);
    expect(safeStock(12)).toBe(12);
    expect(shouldRemindStock(undefined as unknown as number, NOW)).toBe(true);
  });
});

describe('În Tratament', () => {
  it('arată stocul pe cardul medicamentului', () => {
    render(<TreatmentTab profile={profile(23)} doses={[]} onTakeDose={() => {}} />);
    expect(screen.getByText('Mai ai 23 de pastile.')).toBeInTheDocument();
  });
});
