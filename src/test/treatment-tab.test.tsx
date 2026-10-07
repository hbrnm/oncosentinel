import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TreatmentTab } from '../components/TreatmentTab';
import { PatientProfile, DoseLog } from '../types';

describe('TreatmentTab Component (Base44 Design)', () => {
  const mockProfile: PatientProfile = {
    full_name: 'Andreea Popescu',
    histology: 'DCIS',
    stage: 'Grad 0',
    er_status: 'Pozitiv',
    pr_status: 'Pozitiv',
    her2_status: 'Negativ',
    tamoxifen_start_date: '2026-09-01',
    pill_stock_count: 28,
    daily_reminder_time: '08:00',
    medication_name: 'Tamoxifen',
    medication_dose: '20 mg',
    medication_frequency: '1 comprimat/zi'
  };

  const mockDoses: DoseLog[] = [
    {
      id: 'dose_1',
      medication_name: 'Tamoxifen 20mg',
      scheduled_for: new Date().toISOString(),
      taken_at: new Date().toISOString(),
      status: 'taken'
    }
  ];

  it('renders header, medication card, adherence, and calendar sections', () => {
    render(
      <TreatmentTab
        profile={mockProfile}
        doses={mockDoses}
        onTakeDose={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /^Tratament$/i })).toBeInTheDocument();
    expect(screen.getByText(/Planul tău zilnic și istoricul dozelor\./i)).toBeInTheDocument();
    expect(screen.getByText('Tamoxifen')).toBeInTheDocument();
    expect(screen.getByText(/20 mg • 1 comprimat\/zi/i)).toBeInTheDocument();
    expect(screen.getByText(/Aderență/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar doze/i)).toBeInTheDocument();
    expect(screen.getByText(/Istoric recent/i)).toBeInTheDocument();
  });

  it('shows congratulations banner when dose for today is already taken', () => {
    render(
      <TreatmentTab
        profile={mockProfile}
        doses={mockDoses}
        onTakeDose={vi.fn()}
      />
    );

    expect(screen.getByText(/Ai luat doza de azi\. Felicitări!/i)).toBeInTheDocument();
  });

  it('allows taking dose if not yet taken today', () => {
    const handleTake = vi.fn();
    render(
      <TreatmentTab
        profile={mockProfile}
        doses={[]}
        onTakeDose={handleTake}
      />
    );

    const markBtn = screen.getByText(/Marchează doza de azi/i);
    expect(markBtn).toBeInTheDocument();
    fireEvent.click(markBtn);
    expect(handleTake).toHaveBeenCalled();
  });

  it('opens and saves treatment editing dialog', () => {
    const handleUpdate = vi.fn();
    render(
      <TreatmentTab
        profile={mockProfile}
        doses={mockDoses}
        onTakeDose={vi.fn()}
        onUpdateProfile={handleUpdate}
      />
    );

    const editBtn = screen.getByTitle('Editează tratamentul');
    fireEvent.click(editBtn);

    expect(screen.getByText('Editează tratamentul')).toBeInTheDocument();
    const saveBtn = screen.getByText('Salvează');
    fireEvent.click(saveBtn);

    expect(handleUpdate).toHaveBeenCalledWith(expect.objectContaining({
      medication_name: 'Tamoxifen',
      medication_dose: '20 mg'
    }));
  });
});
