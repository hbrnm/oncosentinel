import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { generateOncologyReport } from '../lib/pdfGenerator';
import { generateWeeklyPlannerPDF } from '../lib/weeklyPdfGenerator';

vi.mock('../lib/pdfGenerator', () => ({ generateOncologyReport: vi.fn() }));
vi.mock('../lib/weeklyPdfGenerator', () => ({ generateWeeklyPlannerPDF: vi.fn() }));

describe('PDF-urile din Jurnal se încarcă la cerere', () => {
  it('butoanele generează raportul și fișa săptămânală', async () => {
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} />);

    fireEvent.click(screen.getByText('Raport oncolog'));
    await waitFor(() => expect(generateOncologyReport).toHaveBeenCalledWith(DEFAULT_PROFILE, [], []));

    fireEvent.click(screen.getByText('Fișă frigider'));
    await waitFor(() => expect(generateWeeklyPlannerPDF).toHaveBeenCalled());
  });
});
