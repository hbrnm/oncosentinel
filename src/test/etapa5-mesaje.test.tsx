import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { JournalTab } from '../components/JournalTab';
import { DEFAULT_PROFILE } from '../lib/supabase';
import { JOURNAL_RESPONSES, TOPIC_RESPONSES, CRISIS_RESPONSE, journalResponseFor } from '../data/comfort';

// Texte aprobate de proprietară (docs/etapa5-texte.md)
describe('Mesajele de după nota din Jurnal', () => {
  it('fiecare stare are 10 mesaje', () => {
    for (const mood of [1, 2, 3, 4, 5]) expect(JOURNAL_RESPONSES[mood]).toHaveLength(10);
  });

  it('cuvintele de criză aduc mesajul fix, la orice stare și cu sau fără diacritice', () => {
    expect(journalResponseFor(5, 'Nu mai vreau să trăiesc')).toEqual({ text: CRISIS_RESPONSE, crisis: true });
    expect(journalResponseFor(1, 'm-am gandit sa-mi fac rau').crisis).toBe(true);
    expect(journalResponseFor(3, 'Uneori simt că nu mai are rost').crisis).toBe(true);
    expect(journalResponseFor(1, 'Azi a fost o zi grea la serviciu').crisis).toBe(false);
  });

  it('subiectul notei aduce mesajul lui, doar la Greu, Obosită și Liniștită', () => {
    const [control, frica, somn, oboseala, bufeuri, singuratate] = TOPIC_RESPONSES.map(t => t.text);
    expect(journalResponseFor(1, 'Mâine am control și mi-e FRICĂ').text).toBe(control);
    expect(journalResponseFor(2, 'Mi-e teamă de tot').text).toBe(frica);
    expect(journalResponseFor(3, 'N-am dormit deloc').text).toBe(somn);
    expect(journalResponseFor(2, 'Sunt foarte obosită').text).toBe(oboseala);
    expect(journalResponseFor(1, 'Bufeuri toată ziua').text).toBe(bufeuri);
    expect(journalResponseFor(1, 'Mă simt singură').text).toBe(singuratate);
    // la stările bune rămâne lista stării
    expect(JOURNAL_RESPONSES[4]).toContain(journalResponseFor(4, 'Am dormit bine').text);
    // fără subiect: lista stării
    expect(JOURNAL_RESPONSES[2]).toContain(journalResponseFor(2, 'O zi oarecare').text);
    // „o singură dată” nu înseamnă singurătate
    expect(JOURNAL_RESPONSES[1]).toContain(journalResponseFor(1, 'Am uitat pastila o singură dată').text);
    expect(journalResponseFor(2, 'Am multe temeri').text).toBe(frica);
    // „temperatura” sau „sistemul” nu înseamnă frică
    expect(JOURNAL_RESPONSES[3]).toContain(journalResponseFor(3, 'Temperatura afară, sistemul nou').text);
  });

  it('în Jurnal, o notă de criză arată „Sună la 112” și „Am nevoie de ajutor”, chiar la o stare bună', () => {
    const onOpenHelp = vi.fn();
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} onOpenHelp={onOpenHelp} />);

    fireEvent.click(screen.getByRole('button', { name: 'Bine' }));
    fireEvent.change(screen.getByPlaceholderText(/Notează un gând/), { target: { value: 'Vreau să mor' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));

    const status = screen.getByRole('status');
    expect(within(status).getByText(CRISIS_RESPONSE)).toBeInTheDocument();
    expect(within(status).getByRole('link', { name: /Sună la 112/ })).toHaveAttribute('href', 'tel:112');
    fireEvent.click(within(status).getByText('Am nevoie de ajutor'));
    expect(onOpenHelp).toHaveBeenCalled();
  });

  it('o notă obișnuită nu arată butonul 112', () => {
    render(<JournalTab profile={DEFAULT_PROFILE} symptoms={[]} doses={[]} onAddSymptomLog={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bine' }));
    fireEvent.change(screen.getByPlaceholderText(/Notează un gând/), { target: { value: 'O plimbare frumoasă' } });
    fireEvent.click(screen.getByText('Salvează în jurnal'));
    expect(within(screen.getByRole('status')).queryByRole('link', { name: /112/ })).not.toBeInTheDocument();
  });
});
