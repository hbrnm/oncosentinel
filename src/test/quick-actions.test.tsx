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
    expect(screen.getAllByText(/medicale/i).length).toBe(2);
    expect(screen.getByText(/Controale/i)).toBeInTheDocument();
    expect(screen.getByText(/Dosar/i)).toBeInTheDocument();
    expect(screen.getAllByText(/medical/i).length).toBeGreaterThan(0);
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

    // 3. Controale medicale -> opens doctor visit modal or profile
    const doctorBtn = screen.getByText(/Controale/i).closest('button');
    expect(doctorBtn).toBeTruthy();
    fireEvent.click(doctorBtn!);
    expect(handleDoctor).toHaveBeenCalled();

    // 4. Dosar medical -> navigates to timeline (or opens resources via callback if provided)
    const resourcesBtn = screen.getByText(/Dosar/i).closest('button');
    expect(resourcesBtn).toBeTruthy();
    fireEvent.click(resourcesBtn!);
  });
});
