import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../App';
import { NEWS_PROTOCOLS, getNewsOfTheDay } from '../data/guides';

describe('Vestea bună a zilei', () => {
  it('se schimbă în fiecare zi și trece prin toate noutățile', () => {
    const ids = [0, 1, 2, 3, 4].map(i => getNewsOfTheDay(new Date(2026, 9, 9 + i, 12)).id);
    expect(new Set(ids).size).toBe(NEWS_PROTOCOLS.length);
  });

  it('rămâne aceeași toată ziua, de la miezul nopții până seara', () => {
    expect(getNewsOfTheDay(new Date(2026, 9, 9, 0, 1)).id).toBe(getNewsOfTheDay(new Date(2026, 9, 9, 23, 59)).id);
  });

  describe('pe Astăzi', () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem('oncosentinel_onboarded', 'true');
      localStorage.setItem('navimed_profile', JSON.stringify({ full_name: 'Ana', daily_reminder_time: '08:00', pill_stock_count: 30 }));
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 9, 10, 12));
    });
    afterEach(() => vi.useRealTimers());

    it('arată noutatea zilei și o deschide întreagă, cu sursa', () => {
      const today = getNewsOfTheDay(new Date(2026, 9, 10, 12));
      render(<App />);
      expect(screen.getByText(/Vestea bună a zilei/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText(today.title));
      expect(screen.getByRole('heading', { name: today.title })).toBeInTheDocument();
      expect(screen.getByText(/Ce înseamnă pentru tine/)).toBeInTheDocument();
      // Textul se afișează formatat, fără semnele de markdown
      expect(screen.queryByText(/###|\*\*/)).not.toBeInTheDocument();
    });

    it('Back închide noutatea în lista Ghidului, apoi întoarce la Astăzi', async () => {
      const today = getNewsOfTheDay(new Date(2026, 9, 10, 12));
      const back = async () => act(async () => {
        window.history.back();
        await new Promise(r => setTimeout(r, 30));
      });
      render(<App />);
      fireEvent.click(screen.getByText(today.title));
      await back();
      await waitFor(() => expect(screen.getByRole('heading', { name: 'Ghiduri' })).toBeInTheDocument());
      expect(screen.queryByRole('heading', { name: today.title })).not.toBeInTheDocument();
      await back();
      await waitFor(() => expect(screen.getByText(/Vestea bună a zilei/i)).toBeInTheDocument());
    });
  });
});
