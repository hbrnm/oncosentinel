import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EditProfileModal } from '../components/EditProfileModal';
import { PatientProfile } from '../types';

describe('EditProfileModal', () => {
  const mockProfile: PatientProfile = {
    full_name: 'Andreea Popescu',
    histology: 'DCIS',
    stage: 'Grad 0',
    er_status: 'Pozitiv',
    pr_status: 'Pozitiv',
    her2_status: 'Negativ',
    tamoxifen_start_date: '2026-09-01',
    pill_stock_count: 28,
    daily_reminder_time: '08:00'
  };

  it('opens without crashing and saves the edited Tamoxifen start date', () => {
    const onSave = vi.fn();
    const { container } = render(
      <EditProfileModal isOpen={true} onClose={vi.fn()} profile={mockProfile} onSave={onSave} />
    );

    const startDateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(startDateInput.value).toBe('2026-09-01');

    fireEvent.change(startDateInput, { target: { value: '2026-09-15' } });
    fireEvent.click(screen.getByText('Salvează Modificările'));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ tamoxifen_start_date: '2026-09-15' }));
  });
});
