import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { storageService } from '../lib/supabase';

describe('Test Complet de Flow Utilizator pe Noul Design Organic (End-to-End Simulation)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Simulare Pas-cu-Pas a Zilei Pacientei pe Noul Design: Onboarding -> Doză -> Stare Emoțională -> Control -> Resurse -> Documente', async () => {
    // -------------------------------------------------------------
    // ETAPA 1: Prima deschidere a aplicației (Onboarding)
    // -------------------------------------------------------------
    const { unmount } = render(<App />);

    expect(screen.getByText(/Bine ai venit în OncoSentinel/i)).toBeInTheDocument();

    // Pasul 1: Numele pacientei
    const nameInput = screen.getByPlaceholderText(/Introdu numele|Elena Popescu/i);
    fireEvent.change(nameInput, { target: { value: 'Andreea Ionescu' } });
    fireEvent.click(screen.getByText(/Continuă spre Alerte & Orar/i));

    // Pasul 2: Orar & Stoc pastile (30 pastile)
    fireEvent.click(screen.getByText(/Spre Supraveghere/i));

    // Pasul 3: Finalizare și pornire aplicație
    fireEvent.click(screen.getByText(/Pornește OncoSentinel/i));

    // Verificăm salutul personalizat în noul font Serif
    expect(screen.getAllByText(/Andreea/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Ești puternică\. Pas cu pas|Fiecare zi este un pas înainte|Ai făcut tot ce ai putut azi/i)).toBeInTheDocument();

    // -------------------------------------------------------------
    // ETAPA 2: Rutina de dimineață - Hero Card Tamoxifen
    // -------------------------------------------------------------
    // Verificăm statusul inițial: În așteptare
    expect(screen.getByText(/Tamoxifen 20 mg/i)).toBeInTheDocument();
    expect(screen.getByText(/1 comprimat \/ zi/i)).toBeInTheDocument();
    expect(screen.getByText(/În așteptare/i)).toBeInTheDocument();

    // Pacienta ia pastila și apasă pe butonul mare "Bifat ca luat"
    const takePillBtn = screen.getByText(/Bifat ca luat/i);
    fireEvent.click(takePillBtn);

    // Confirmare vizuală imediată
    expect(screen.getByText(/✓ Azi • Luat/i)).toBeInTheDocument();
    expect(screen.getByText(/Doza de azi este bifată cu succes!/i)).toBeInTheDocument();

    // Stocul scade automat în profil
    const profile = storageService.getProfile();
    expect(profile.pill_stock_count).toBe(29);

    // -------------------------------------------------------------
    // ETAPA 3: Notarea Stării Emoționale în Jurnal
    // -------------------------------------------------------------
    // Titlu dinamic de zi
    expect(screen.getByText(/Cum te simți azi\?/i)).toBeInTheDocument();

    // Pacienta se simte bine și selectează starea "Bun" (nivel 4 clinic)
    const goodMoodBtn = screen.getByText('Bun').closest('button');
    expect(goodMoodBtn).toBeTruthy();
    fireEvent.click(goodMoodBtn!);

    // Mesaj empatic contextual afișat
    expect(screen.getByText(/E în regulă să fie doar «bine»/i)).toBeInTheDocument();
    expect(screen.getByText(/Înregistrat azi/i)).toBeInTheDocument();
    expect(localStorage.getItem('navimed_today_mood')).toBe('bine');

    // -------------------------------------------------------------
    // ETAPA 4: Consultare Card Dual (Următorul Control & Citat)
    // -------------------------------------------------------------
    expect(screen.getByText(/URMĂTORUL CONTROL/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gândul de susținere|Îngrijirea de sine|Fiecare|Vindecarea|Ascultă-ți|Ești|Un pas|Ai făcut|Lasă|Fii mândră|Nu trebuie|Curajul/i).length).toBeGreaterThan(0);

    // Dă click pe cardul de control pentru a pregăti întrebările și a vedea data
    const controlCard = screen.getByText(/URMĂTORUL CONTROL/i).closest('div[class*="cursor-pointer"]');
    expect(controlCard).toBeTruthy();
    fireEvent.click(controlCard!);

    // Se deschide modalul de pregătire a consultației cu editorul de dată și medic
    expect(screen.getByText(/Pregătire pentru Consultația Oncologică/i)).toBeInTheDocument();
    expect(screen.getByText(/Programare Următorul Control/i)).toBeInTheDocument();

    // Închidem modalul de consult
    const closeBtns = screen.getAllByRole('button');
    const modalCloseBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (modalCloseBtn) fireEvent.click(modalCloseBtn);

    // -------------------------------------------------------------
    // ETAPA 5: Resurse de Liniște (Ancorare 5-4-3-2-1)
    // -------------------------------------------------------------
    fireEvent.click(screen.getByRole('button', { name: /Ajutor\s*acum/ }));
    fireEvent.click(screen.getByText(/Exercițiul 5-4-3-2-1/i));

    // Se deschide modalul de ancorare senzorială
    expect(screen.getByText(/Metoda de Ancorare 5-4-3-2-1/i)).toBeInTheDocument();
    expect(screen.getByText(/5 Lucruri pe care le Vezi/i)).toBeInTheDocument();

    // Închidem modalul de ancorare
    const groundingCloseBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-x'));
    if (groundingCloseBtn) fireEvent.click(groundingCloseBtn);

    // -------------------------------------------------------------
    // ETAPA 6: Navigare lină la Dosar Medical & Verificare Seif
    // -------------------------------------------------------------
    const timelineNavBtn = screen.getAllByText(/Dosar/i)[0];
    fireEvent.click(timelineNavBtn);

    expect(screen.getByText(/Supraveghere Oncologică & Imagistică/i)).toBeInTheDocument();
    expect(screen.getByText(/Seif Documente Medicale/i)).toBeInTheDocument();
    expect(screen.getByText(/Nu ai încărcat niciun document/i)).toBeInTheDocument();

    // -------------------------------------------------------------
    // ETAPA 7: Navigare la Ghiduri
    // -------------------------------------------------------------
    const guideNavBtn = screen.getByText('Ghiduri');
    fireEvent.click(guideNavBtn);

    expect(screen.getByText(/Ghiduri Clinice/i)).toBeInTheDocument();
    expect(screen.getByText(/Noutăți/i)).toBeInTheDocument();

    // -------------------------------------------------------------
    // ETAPA 8: Revenire pe „Astăzi” - Datele și starea sunt perfect conservate
    // -------------------------------------------------------------
    const todayNavBtn = screen.getByText('Astăzi');
    fireEvent.click(todayNavBtn);

    // Doza este în continuare marcată ca Luat
    expect(screen.getByText(/✓ Azi • Luat/i)).toBeInTheDocument();
    // Starea emoțională este în continuare Bifată
    expect(screen.getByText(/Înregistrat azi/i)).toBeInTheDocument();
  });
});
