import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TimelineTab } from '../components/TimelineTab';
import { AuthModal } from '../components/AuthModal';
import { storageService, DEFAULT_PROFILE } from '../lib/supabase';
import { ClinicalMilestone } from '../types';
import App from '../App';

describe('Fără date clinice inventate', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(window.confirm).mockReturnValue(true);
  });

  it('pornește cu cronologie goală și profil clinic necompletat', () => {
    expect(storageService.getMilestones()).toEqual([]);
    expect(DEFAULT_PROFILE.histology).toBe('');
    expect(DEFAULT_PROFILE.stage).toBe('');
    expect(DEFAULT_PROFILE.er_status).toBe('');
  });

  it('Cronologia goală arată cum se adaugă o etapă și o salvează', () => {
    const onUpdateMilestones = vi.fn();
    render(
      <TimelineTab profile={DEFAULT_PROFILE} milestones={[]} documents={[]} onAddDocument={vi.fn()} onUpdateMilestones={onUpdateMilestones} />
    );

    expect(screen.getByText(/Încă nu ai adăugat nicio etapă/)).toBeInTheDocument();
    expect(screen.getByText('nicio dată setată')).toBeInTheDocument();
    expect(screen.queryByText(/Curabil/)).not.toBeInTheDocument();
    expect(screen.getByText('Diagnostic necompletat')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Adaugă etapă'));
    fireEvent.change(screen.getByPlaceholderText('Ex: Operație conservatoare'), { target: { value: 'Biopsie' } });
    fireEvent.click(screen.getByText('Salvează'));

    expect(onUpdateMilestones).toHaveBeenCalledWith([expect.objectContaining({ title: 'Biopsie', category: 'diagnostic' })]);
  });

  it('o etapă existentă poate fi ștearsă', () => {
    const milestone: ClinicalMilestone = { id: 'x1', category: 'chirurgie', event_date: '2026-06-25', title: 'Operație', description: '', key_details: {} };
    const onUpdateMilestones = vi.fn();
    render(
      <TimelineTab profile={DEFAULT_PROFILE} milestones={[milestone]} documents={[]} onAddDocument={vi.fn()} onUpdateMilestones={onUpdateMilestones} />
    );

    fireEvent.click(screen.getByText('Operație'));
    fireEvent.click(screen.getByText('Șterge'));

    expect(onUpdateMilestones).toHaveBeenCalledWith([]);
  });

  it('nu adaugă un document fără fișier', () => {
    const onAddDocument = vi.fn();
    render(<TimelineTab profile={DEFAULT_PROFILE} milestones={[]} documents={[]} onAddDocument={onAddDocument} />);

    fireEvent.click(screen.getByText('Încarcă PDF'));
    fireEvent.change(screen.getByPlaceholderText('ex: Mamografie_Control_Octombrie.pdf'), { target: { value: 'Analize' } });
    fireEvent.submit(screen.getByPlaceholderText('ex: Mamografie_Control_Octombrie.pdf').closest('form')!);

    expect(onAddDocument).not.toHaveBeenCalled();
  });

  it('Astăzi nu inventează data controlului sau medicul', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    expect(screen.getByText('Nicio dată setată')).toBeInTheDocument();
    expect(screen.queryByText(/Maria Popescu/)).not.toBeInTheDocument();
  });
});

describe('Siguranța datelor (aplicație doar locală)', () => {
  it('nu promite cloud și șterge datele locale după confirmare', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', { value: { ...window.location, reload }, configurable: true });
    localStorage.setItem('navimed_profile', '{"full_name":"Ana"}');

    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.queryByText(/cloud/i, { selector: 'h3' })).not.toBeInTheDocument();
    expect(screen.getByText('Datele tale stau doar pe acest dispozitiv')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Șterge toate datele de pe acest dispozitiv'));

    expect(localStorage.getItem('navimed_profile')).toBeNull();
    expect(reload).toHaveBeenCalled();
  });
});
