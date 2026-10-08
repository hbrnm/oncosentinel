import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { storageService } from '../lib/supabase';

describe('Suite de Teste Utilizator E2E - OncoSentinel Flow Complet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('1. Flux Onboarding (3 pași) -> Salvare Profil -> Persistență Nume și Setări', async () => {
    render(<App />);

    expect(screen.getByText(/Bine ai venit în OncoSentinel/i)).toBeInTheDocument();

    // Pasul 1: Nume
    const nameInput = screen.getByPlaceholderText(/Introdu numele|Elena Popescu/i);
    fireEvent.change(nameInput, { target: { value: 'Ioana Dumitrescu' } });

    // Mergem la Pasul 2
    const step2Btn = screen.getByText(/Continuă spre Alerte & Orar/i);
    fireEvent.click(step2Btn);

    // Pasul 2: Modificăm stocul de pastile la 60
    const stockInput = screen.getByDisplayValue('30');
    fireEvent.change(stockInput, { target: { value: '60' } });

    // Mergem la Pasul 3
    const step3Btn = screen.getByText(/Spre Supraveghere/i);
    fireEvent.click(step3Btn);

    // Pasul 3: Finalizăm configurarea
    const finishBtn = screen.getByText(/Pornește OncoSentinel/i);
    fireEvent.click(finishBtn);

    // Verificăm persistența în localStorage
    expect(localStorage.getItem('oncosentinel_onboarded')).toBe('true');
    const savedProfile = storageService.getProfile();
    expect(savedProfile.full_name).toBe('Ioana Dumitrescu');
    expect(savedProfile.pill_stock_count).toBe(60);

    // Navbar-ul trebuie să salute pacienta pe nume
    expect(screen.getByText(/Bună, Ioana/i)).toBeInTheDocument();
  });

  it('2. Flux Aderență Tamoxifen: Luare Doză -> Scădere Stoc -> Calendar Actualizat', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    localStorage.setItem('navimed_profile', JSON.stringify({
      full_name: 'Ioana Dumitrescu',
      tamoxifen_start_date: new Date().toISOString().slice(0, 10),
      pill_stock_count: 30,
      daily_reminder_time: '08:30'
    }));

    render(<App />);

    // Înainte de luare: verificăm badge-ul de status și butonul de luare ("Bifat ca luat")
    const waitingBadges = screen.getAllByText(/În așteptare/i);
    expect(waitingBadges.length).toBeGreaterThan(0);

    const takePillBtn = screen.getByText(/Bifat ca luat/i);
    expect(takePillBtn).toBeInTheDocument();

    // Apăsăm că am luat pastila
    fireEvent.click(takePillBtn);

    // Verificăm confirmarea vizuală
    expect(screen.getByText(/Luat pentru azi/i)).toBeInTheDocument();
    expect(screen.getByText(/Doza de azi este bifată cu succes/i)).toBeInTheDocument();

    // Verificăm persistența dozei în storage
    const doses = storageService.getDoseLogs();
    expect(doses.length).toBe(1);
    expect(doses[0].status).toBe('taken');

    // Verificăm scăderea automată a stocului de pastile (30 -> 29)
    const updatedProfile = storageService.getProfile();
    expect(updatedProfile.pill_stock_count).toBe(29);
  });

  it('3. Navigare între Module: Tab-urile Astăzi, Dosar, Jurnal, Ghiduri', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Verificăm prezența tab-ului implicit: Today
    expect(screen.getByText(/Tamoxifen 20 mg/i)).toBeInTheDocument();

    // Navigăm la Jurnal Simptome
    const symptomsTabBtn = screen.getByText('Jurnal');
    fireEvent.click(symptomsTabBtn);
    expect(screen.getByText(/Rapoarte & Fise/i)).toBeInTheDocument();
    expect(screen.getByText(/Istoric/i)).toBeInTheDocument();

    // Navigăm la Ghiduri
    const guideTabBtn = screen.getByText('Ghiduri');
    fireEvent.click(guideTabBtn);
    expect(screen.getByText(/Ghiduri Clinice/i)).toBeInTheDocument();
    expect(screen.getByText(/Noutăți/i)).toBeInTheDocument();
  });

  it('4. Flux Jurnal Simptome: Deschidere Formular -> Notiță -> Salvare -> Afișare în Istoric', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Trecem la tab-ul Jurnal
    const symptomsTabBtn = screen.getByText('Jurnal');
    fireEvent.click(symptomsTabBtn);

    // Notăm o notă în jurnal
    const notesInput = screen.getByPlaceholderText(/Notează un gând, un simptom/i);
    fireEvent.change(notesInput, { target: { value: 'M-am simțit foarte energică azi după plimbare.' } });

    // Alegem o dispoziție
    const moodBtn = screen.getByLabelText('Bine');
    fireEvent.click(moodBtn);

    // Salvăm înregistrarea
    const saveBtn = screen.getByText(/Salvează în jurnal/i);
    fireEvent.click(saveBtn);

    // Verificăm salvarea în localStorage și afișarea în istoric
    const matchingElements = await screen.findAllByText(/M-am simțit foarte energică azi după plimbare./i);
    expect(matchingElements.length).toBeGreaterThan(0);
    const savedSymptoms = storageService.getSymptomLogs();
    expect(savedSymptoms.length).toBeGreaterThan(0);
    expect(savedSymptoms[0].notes).toBe('M-am simțit foarte energică azi după plimbare.');
  });

  it('6. Flux Modale Clinice & Suport: Deschiderea și Închiderea Modalelor', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Testăm Deschiderea Cercului de Sprijin din Dashboard
    fireEvent.click(screen.getByRole('button', { name: /Ajutor\s*acum/ }));
    fireEvent.click(screen.getByText(/Trimite un mesaj persoanei tale de sprijin/i));
    expect(screen.getByText(/Conectează o persoană dragă de încredere/i)).toBeInTheDocument();

    // Închidem modalul apăsând pe butonul de închidere X din modal
    const closeBtns = screen.getAllByRole('button');
    const closeBtn = closeBtns.find(b => b.className.includes('rounded-full') && b.querySelector('svg'));
    if (closeBtn) fireEvent.click(closeBtn);

    // Testăm Butonul Semnale de Alarmă / Red Flags din Dashboard
    fireEvent.click(screen.getByRole('button', { name: /Ajutor\s*acum/ }));
    fireEvent.click(screen.getByText('Vezi semnalele de alarmă'));
    expect(screen.getByRole('heading', { name: 'Semnale de alarmă' })).toBeInTheDocument();
    expect(screen.getByText(/Durere sau umflare la un singur picior/i)).toBeInTheDocument();
  });

  it('7. Flux Jurnal Emoțional: Selecție Stare -> Mesaj Empatic Contextual -> Salvare Locală', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Găsim butonul "Foarte bun" (nivel 5)
    const greatMoodBtn = screen.getByText('Foarte bun').closest('button');
    expect(greatMoodBtn).toBeTruthy();
    fireEvent.click(greatMoodBtn!);

    // Verificăm apariția mesajului empatic contextual
    expect(screen.getByText(/Mă bucur că te simți bine/i)).toBeInTheDocument();

    // Verificăm apariția etichetei "Înregistrat azi"
    expect(screen.getByText(/Înregistrat azi/i)).toBeInTheDocument();

    // Verificăm persistența în localStorage
    expect(localStorage.getItem('navimed_today_mood')).toBe('foarte_bine');
  });

  it('8. Flux Stare Vulnerabilă: Rău / Foarte Rău -> Apariție Buton Cercul de Sprijin & SOS FAB', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Selectăm starea "Dificil" (nivel 1)
    const veryBadMoodBtn = screen.getByText('Dificil').closest('button');
    expect(veryBadMoodBtn).toBeTruthy();
    fireEvent.click(veryBadMoodBtn!);

    // Verificăm mesajul empatic de susținere
    expect(screen.getByText(/Nu trebuie să treci prin asta singură/i)).toBeInTheDocument();

    // Verificăm apariția butonului discret spre Cercul de Sprijin
    const talkSupportBtn = screen.getByText(/Vreau să vorbesc cu cineva/i);
    expect(talkSupportBtn).toBeInTheDocument();

    // Verificăm apariția butonului Floating SOS Urgențe
    const sosFab = screen.getByText(/SOS Urgențe/i);
    expect(sosFab).toBeInTheDocument();
  });

  it('9. Flux Card Control & Dismiss Banner de Inspirație pe 7 zile', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    // Setăm data următorului control la 10 zile în viitor
    const futureDate = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    localStorage.setItem('navimed_next_control_date', futureDate);

    render(<App />);

    // Verificăm calculul dinamic al zilelor (peste 10 zile)
    expect(screen.getByText(/peste 10 zile/i)).toBeInTheDocument();

    // Verificăm prezența inițială a bannerului de inspirație
    const bannerQuote = screen.getByText(/Nu ești doar un pacient/i);
    expect(bannerQuote).toBeInTheDocument();

    // Închidem bannerul folosind butonul X
    const dismissBannerBtn = screen.getByTitle(/Închide pentru 7 zile/i);
    fireEvent.click(dismissBannerBtn);

    // Bannerul trebuie să dispară din DOM
    expect(screen.queryByText(/Nu ești doar un pacient/i)).not.toBeInTheDocument();

    // Verificăm salvarea timestamp-ului de dismiss în localStorage
    const dismissedUntil = localStorage.getItem('navimed_banner_dismissed_until');
    expect(dismissedUntil).toBeTruthy();
    expect(Number(dismissedUntil)).toBeGreaterThan(Date.now());
  });
});
