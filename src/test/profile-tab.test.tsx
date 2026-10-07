import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProfileTab } from '../components/ProfileTab';
import { PatientProfile, DoseLog } from '../types';

describe('ProfileTab Component (Base44 Design)', () => {
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

  const mockDoses: DoseLog[] = [];

  it('renders user details, current medication card, appointments, and notification toggles', () => {
    render(
      <ProfileTab
        profile={mockProfile}
        doses={mockDoses}
        onUpdateProfile={vi.fn()}
        onNavigateToTab={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /^Profil$/i })).toBeInTheDocument();
    expect(screen.getByText('Andreea Popescu')).toBeInTheDocument();
    expect(screen.getAllByText('DCIS').length).toBeGreaterThan(0);
    expect(screen.getByText('Tratament curent')).toBeInTheDocument();
    expect(screen.getByText('Controale medicale')).toBeInTheDocument();
    expect(screen.getByText('Notificări')).toBeInTheDocument();
    expect(screen.getByText('Reminder doză zilnică')).toBeInTheDocument();
    expect(screen.getByText('Reminder controale')).toBeInTheDocument();
  });

  it('navigates to treatment tab when clicking Gestionează tratamentul', () => {
    const handleNavigate = vi.fn();
    render(
      <ProfileTab
        profile={mockProfile}
        doses={mockDoses}
        onUpdateProfile={vi.fn()}
        onNavigateToTab={handleNavigate}
      />
    );

    const manageBtn = screen.getByText(/Gestionează tratamentul/i);
    fireEvent.click(manageBtn);
    expect(handleNavigate).toHaveBeenCalledWith('treatment');
  });

  it('allows editing display name and saving', () => {
    const handleUpdate = vi.fn();
    render(
      <ProfileTab
        profile={mockProfile}
        doses={mockDoses}
        onUpdateProfile={handleUpdate}
        onNavigateToTab={vi.fn()}
      />
    );

    const editProfileBtn = screen.getByTitle('Modifică profilul');
    fireEvent.click(editProfileBtn);

    expect(screen.getByText('Date Profil & Situație')).toBeInTheDocument();
    const saveBtn = screen.getByText('Salvează');
    fireEvent.click(saveBtn);

    expect(handleUpdate).toHaveBeenCalledWith(expect.objectContaining({
      full_name: 'Andreea Popescu',
      histology: 'DCIS',
      stage: 'Grad 0'
    }));
  });
});
