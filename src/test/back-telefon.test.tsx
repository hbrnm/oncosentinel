import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import App from '../App';

// Butonul Back al telefonului (2026-10-08): ecranul anterior, ferestrele se închid,
// iar aplicația se închide doar de pe Astăzi

const back = async () => {
  await act(async () => {
    window.history.back();
    await new Promise(r => setTimeout(r, 30));
  });
};

const tab = (name: string) => fireEvent.click(screen.getByRole('button', { name, exact: true } as any));
const onJournal = () => screen.queryByText('Un spațiu blând pentru emoțiile tale.') !== null;
const onGuides = () => screen.queryByRole('heading', { name: 'Ghiduri' }) !== null;
const onToday = () => screen.queryByText(/Ești puternică|Fiecare zi este un pas|Ai făcut tot ce ai putut/) !== null;

describe('Back pe telefon', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('oncosentinel_onboarded', 'true');
  });

  it('întoarce la ecranul anterior, până la Astăzi', async () => {
    render(<App />);
    tab('Jurnal');
    tab('Ghiduri');
    expect(onGuides()).toBe(true);

    await back();
    await waitFor(() => expect(onJournal()).toBe(true));
    await back();
    await waitFor(() => expect(onToday()).toBe(true));
    // Pe Astăzi nu mai e nimic în aplicație de întors: următorul Back iese
    expect(window.history.state).toEqual({ screen: 'today' });
  });

  it('închide fereastra deschisă și rămâne pe același ecran', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Ajutor/ }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await back();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onToday()).toBe(true);
    expect(window.history.state).toEqual({ screen: 'today' });
  });

  it('după o fereastră închisă din butonul ei, Back nu are o apăsare „moartă”', async () => {
    render(<App />);
    tab('Jurnal');
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    await act(async () => {});
    fireEvent.click(screen.getAllByRole('button', { name: /Închide/ })[0]);
    await act(async () => { await new Promise(r => setTimeout(r, 30)); });
    expect(onJournal()).toBe(true);

    await back();
    await waitFor(() => expect(onToday()).toBe(true));
  });

  it('un ghid deschis se închide cu Back, iar lista rămâne', async () => {
    render(<App />);
    tab('Ghiduri');
    fireEvent.click(screen.getAllByText(/Tamoxifen: ce face și cum îl iei/)[0]);
    expect(onGuides()).toBe(false);

    await back();
    await waitFor(() => expect(onGuides()).toBe(true));
  });

  it('Back din respirația pornită din „liniște” arată întrebarea, apoi o închide', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Am nevoie de liniște acum' }));
    fireEvent.click(screen.getByRole('button', { name: /Respiră cu mine/ }));
    await act(async () => { await new Promise(r => setTimeout(r, 30)); });

    await back();
    await waitFor(() => expect(screen.getByText(/Te simți puțin mai liniștită/)).toBeInTheDocument());
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.getByText(/Te simți puțin mai liniștită/)).toBeInTheDocument();

    await back();
    await waitFor(() => expect(screen.queryByText(/Te simți puțin mai liniștită/)).not.toBeInTheDocument());
    expect(onToday()).toBe(true);
  });
});
