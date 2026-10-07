import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { QuickActions } from '../components/QuickActions';

describe('Base44 QuickActions Component', () => {
  it('renders all 4 quick action buttons with Romanian labels', () => {
    render(<QuickActions onNavigateToTab={vi.fn()} />);

    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/tratament/i)).toBeInTheDocument();
    expect(screen.getByText(/Ghiduri/i)).toBeInTheDocument();
    expect(screen.getByText(/medicale/i)).toBeInTheDocument();
    expect(screen.getByText(/Medici și/i)).toBeInTheDocument();
    expect(screen.getByText(/centre/i)).toBeInTheDocument();
    expect(screen.getByText(/Resurse/i)).toBeInTheDocument();
    expect(screen.getByText(/utile/i)).toBeInTheDocument();
  });

  it('triggers the correct callbacks when buttons are clicked', () => {
    const handleNavigate = vi.fn();
    const handleDoctor = vi.fn();
    const handleResources = vi.fn();

    render(
      <QuickActions
        onNavigateToTab={handleNavigate}
        onOpenDoctorModal={handleDoctor}
        onOpenResources={handleResources}
      />
    );

    // 1. Calendar tratament -> navigates to treatment tab
    const calendarBtn = screen.getByText(/Calendar/i).closest('button');
    expect(calendarBtn).toBeTruthy();
    fireEvent.click(calendarBtn!);
    expect(handleNavigate).toHaveBeenCalledWith('treatment');

    // 2. Ghiduri medicale -> navigates to guide tab
    const guidesBtn = screen.getByText(/Ghiduri/i).closest('button');
    expect(guidesBtn).toBeTruthy();
    fireEvent.click(guidesBtn!);
    expect(handleNavigate).toHaveBeenCalledWith('guide');

    // 3. Medici și centre -> opens doctor visit modal or profile
    const doctorBtn = screen.getByText(/Medici și/i).closest('button');
    expect(doctorBtn).toBeTruthy();
    fireEvent.click(doctorBtn!);
    expect(handleDoctor).toHaveBeenCalled();

    // 4. Resurse utile -> opens relaxing resources
    const resourcesBtn = screen.getByText(/Resurse/i).closest('button');
    expect(resourcesBtn).toBeTruthy();
    fireEvent.click(resourcesBtn!);
    expect(handleResources).toHaveBeenCalled();
  });
});
