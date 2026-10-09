import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TreatmentTab } from '../components/TreatmentTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { buildReminderIcs, googleCalendarUrl, REMINDER_TEXT } from '../lib/calendarReminder';

// Memento zilnic în calendarul telefonului (2026-10-08)

const now = new Date(2026, 9, 8, 10, 0);

describe('Memento în calendar', () => {
  afterEach(() => vi.restoreAllMocks());

  it('fișierul de calendar are un eveniment zilnic, la ora pastilei, cu alertă și text discret', () => {
    const ics = buildReminderIcs('21:30', now);
    expect(ics).toContain('DTSTART:20261008T213000');
    expect(ics).toContain('DTEND:20261008T214500');
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain(`SUMMARY:${REMINDER_TEXT}`);
    expect(ics).not.toMatch(/Tamoxifen|mg/i);
    expect(ics.split('\r\n')[0]).toBe('BEGIN:VCALENDAR');
  });

  it('legătura Google Calendar deschide evenimentul zilnic completat', () => {
    const url = new URL(googleCalendarUrl('08:05', now));
    expect(url.hostname).toBe('calendar.google.com');
    expect(url.searchParams.get('text')).toBe(REMINDER_TEXT);
    expect(url.searchParams.get('dates')).toBe('20261008T080500/20261008T082000');
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
  });

  it('cardul din Tratament arată ora pastilei și descarcă fișierul de calendar', () => {
    const createUrl = vi.fn(() => 'blob:memento');
    Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, daily_reminder_time: '21:30' }} doses={[]} onTakeDose={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Memento zilnic' })).toBeInTheDocument();
    expect(screen.getByText(/în fiecare zi la 21:30/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Google Calendar\s*\(se deschide într-o filă nouă\)/ }).getAttribute('href')).toContain('calendar.google.com');

    fireEvent.click(screen.getByRole('button', { name: 'Alt calendar (iPhone, Samsung…)' }));
    expect(createUrl).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });

  it('o oră invalidă din date vechi cade pe 08:00, în aceeași zi', () => {
    expect(buildReminderIcs('25:99', now)).toContain('DTSTART:20261008T080000');
  });

  it('dacă fișierul nu se poate crea, cardul spune ce să facă', () => {
    Object.assign(URL, { createObjectURL: () => { throw new Error('nu'); } });
    render(<TreatmentTab profile={DEFAULT_PROFILE} doses={[]} onTakeDose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alt calendar (iPhone, Samsung…)' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Nu am putut crea fișierul de calendar. Încearcă din nou sau folosește Google Calendar.');
  });
});

describe('Cardul de memento după ce e pus', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('dispare după Google Calendar', () => {
    render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, daily_reminder_time: '21:30' }} doses={[]} onTakeDose={() => {}} />);
    fireEvent.click(screen.getByRole('link', { name: /^Google Calendar/ }));
    expect(screen.queryByRole('heading', { name: 'Memento zilnic' })).not.toBeInTheDocument();
  });

  it('rămâne ascuns la redeschidere, dar revine dacă se schimbă ora pastilei', () => {
    Object.assign(URL, { createObjectURL: () => 'blob:memento', revokeObjectURL: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { unmount } = render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, daily_reminder_time: '21:30' }} doses={[]} onTakeDose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alt calendar (iPhone, Samsung…)' }));
    unmount();

    const { rerender } = render(<TreatmentTab profile={{ ...DEFAULT_PROFILE, daily_reminder_time: '21:30' }} doses={[]} onTakeDose={() => {}} />);
    expect(screen.queryByRole('heading', { name: 'Memento zilnic' })).not.toBeInTheDocument();
    rerender(<TreatmentTab profile={{ ...DEFAULT_PROFILE, daily_reminder_time: '08:00' }} doses={[]} onTakeDose={() => {}} />);
    expect(screen.getByText(/în fiecare zi la 08:00/)).toBeInTheDocument();
  });

  it('nu dispare dacă fișierul de calendar nu s-a putut crea', () => {
    Object.assign(URL, { createObjectURL: () => { throw new Error('nu'); } });
    render(<TreatmentTab profile={DEFAULT_PROFILE} doses={[]} onTakeDose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alt calendar (iPhone, Samsung…)' }));
    expect(screen.getByRole('heading', { name: 'Memento zilnic' })).toBeInTheDocument();
  });
});
