import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Base44 Dashboard Layout Alignment (Astăzi)', () => {
  it('renders all sections faithfully according to Base44 export', () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem(
      'navimed_profile',
      JSON.stringify({
        full_name: 'Andreea Popescu',
        daily_reminder_time: '08:00',
        pill_stock_count: 30,
      })
    );

    const { container } = render(<App />);

    // 1. Botanical branch in top header background
    const botanicalBranch = container.querySelector('svg.overflow-visible, svg[viewBox="0 0 120 180"], svg[viewBox="0 0 120 160"]');
    expect(botanicalBranch).toBeInTheDocument();

    // 2. Notification Bell in top right
    expect(screen.getByTitle(/Notificări & Memento/i)).toBeInTheDocument();

    // 3. Medication Hero Card (Tamoxifen 20 mg)
    expect(screen.getByText(/Tamoxifen 20 mg/i)).toBeInTheDocument();

    // 4. 4 Quick Actions (Calendar tratament, Ghiduri medicale, Medici și centre, Resurse utile)
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getAllByText(/tratament/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ghiduri/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/medicale/i)).toBeInTheDocument();
    expect(screen.getByText(/Medici și/i)).toBeInTheDocument();
    expect(screen.getByText(/centre/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Resurse/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/utile/i)).toBeInTheDocument();

    // 5. Dual Cards: Următorul Control & Blush Quote with LeafSprig
    expect(screen.getByText(/URMĂTORUL CONTROL/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gândul de susținere|Îngrijirea de sine|Fiecare|Vindecarea|Ascultă-ți|Ești|Un pas|Ai făcut|Lasă|Fii mândră|Nu trebuie|Curajul/i).length).toBeGreaterThan(0);
    const leafSprig = container.querySelector('svg[viewBox="0 0 80 80"]');
    expect(leafSprig).toBeInTheDocument();

    // 6. Emotional Mood Journal (5 faces)
    expect(screen.getByText(/Cum te-ai simțit în ultima săptămână\?/i)).toBeInTheDocument();
    expect(screen.getByText('Foarte bine')).toBeInTheDocument();
    expect(screen.getByText('Bine')).toBeInTheDocument();
    expect(screen.getByText('Neutru')).toBeInTheDocument();
    expect(screen.getByText('Rău')).toBeInTheDocument();
    expect(screen.getByText('Foarte rău')).toBeInTheDocument();

    // 7. Clinical Guide & News Cards
    expect(screen.getByText(/Tamoxifen și efectele secundare/i)).toBeInTheDocument();
    expect(screen.getByText(/Recomandări actualizate pentru monitorizarea pe termen lung/i)).toBeInTheDocument();

    // 8. Inspiration Banner
    expect(screen.getByText(/Nu ești doar un pacient/i)).toBeInTheDocument();
  });
});
