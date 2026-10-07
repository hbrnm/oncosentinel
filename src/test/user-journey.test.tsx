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
    const nameInput = screen.getByPlaceholderText(/ex: Elena Popescu/i);
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

  it('3. Navigare între Module: Tab-urile Astăzi, Dosar, Jurnal & PDF, Ghid & Rețete', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Verificăm prezența tab-ului implicit: Today
    expect(screen.getByText(/Tamoxifen 20 mg/i)).toBeInTheDocument();

    // Navigăm la Dosar Medical
    const timelineTabBtn = screen.getByText('Dosar');
    fireEvent.click(timelineTabBtn);
    expect(screen.getByText(/Supraveghere Oncologică & Imagistică/i)).toBeInTheDocument();
    expect(screen.getByText(/Seif Documente Medicale/i)).toBeInTheDocument();

    // Navigăm la Jurnal Simptome
    const symptomsTabBtn = screen.getByText('Jurnal & PDF');
    fireEvent.click(symptomsTabBtn);
    expect(screen.getByText(/Rapoarte & Fise Printabile/i)).toBeInTheDocument();
    expect(screen.getByText(/Adaugă Înregistrare Detaliată/i)).toBeInTheDocument();

    // Navigăm la Ghid & Rețete
    const guideTabBtn = screen.getByText('Ghid & Rețete');
    fireEvent.click(guideTabBtn);
    expect(screen.getByText(/Rețete & Meniu/i)).toBeInTheDocument();
    expect(screen.getByText(/Sport & Mobilitate/i)).toBeInTheDocument();
  });

  it('4. Flux Jurnal Simptome: Deschidere Formular -> Notiță -> Salvare -> Afișare în Istoric', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Trecem la tab-ul Jurnal & PDF
    const symptomsTabBtn = screen.getByText('Jurnal & PDF');
    fireEvent.click(symptomsTabBtn);

    // Istoricul inițial este gol
    expect(screen.getByText(/Nu există înregistrări anterioare/i)).toBeInTheDocument();

    // Deschidem formularul detaliat
    const openFormTrigger = screen.getByText(/Adaugă Înregistrare Detaliată/i);
    fireEvent.click(openFormTrigger);

    // Notăm o notă în jurnal
    const notesInput = screen.getByPlaceholderText(/Ușoară senzație de căldură după-amiaza/i);
    fireEvent.change(notesInput, { target: { value: 'M-am simțit foarte energică azi după plimbare.' } });

    // Salvăm înregistrarea
    const saveBtn = screen.getByText(/Salvează Înregistrarea în Jurnal/i);
    fireEvent.click(saveBtn);

    // Verificăm apariția în istoric
    expect(screen.getByText(/"M-am simțit foarte energică azi după plimbare."/i)).toBeInTheDocument();

    // Verificăm salvarea în localStorage
    const savedSymptoms = storageService.getSymptomLogs();
    expect(savedSymptoms.length).toBe(1);
    expect(savedSymptoms[0].notes).toBe('M-am simțit foarte energică azi după plimbare.');
  });

  it('5. Flux Interconectat: Recomandare Rețetă din Dashboard deschide Tab-ul Ghid & Rețete', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // În secțiunea Nivel de Energie din Dashboard, selectăm nivelul 2 (scăzut)
    const energyHeading = screen.getByText(/Nivel de Energie/i);
    const energyContainer = energyHeading.closest('div')?.parentElement;
    expect(energyContainer).toBeTruthy();

    const lowEnergyBtn = energyContainer!.querySelector('button:nth-child(2)');
    expect(lowEnergyBtn).toBeTruthy();
    fireEvent.click(lowEnergyBtn!);

    // Apare recomandarea automată cu legătură către rețetă
    const recipeRecommendation = await screen.findByText(/Smoothie „Energie Curată”/i);
    expect(recipeRecommendation).toBeInTheDocument();

    // Dăm click pe containerul recomandării
    const recipeCard = recipeRecommendation.closest('div[class*="cursor-pointer"]');
    expect(recipeCard).toBeTruthy();
    fireEvent.click(recipeCard!);

    // Suntem redirecționați automat în modulul Ghid & Rețete
    expect(screen.getByText(/Rețete & Meniu/i)).toBeInTheDocument();
    expect(screen.getByText(/Sport & Mobilitate/i)).toBeInTheDocument();
  });

  it('6. Flux Modale Clinice & Suport: Deschiderea și Închiderea Modalelor', async () => {
    localStorage.setItem('oncosentinel_onboarded', 'true');
    render(<App />);

    // Testăm Deschiderea Cercului de Sprijin din Dashboard
    const supporterCard = screen.getByText(/Cercul de sprijin/i);
    fireEvent.click(supporterCard);
    expect(screen.getByText(/Conectează o persoană dragă de încredere/i)).toBeInTheDocument();

    // Închidem modalul apăsând pe butonul de închidere X din modal
    const closeBtns = screen.getAllByRole('button');
    const closeBtn = closeBtns.find(b => b.className.includes('rounded-full') && b.querySelector('svg'));
    if (closeBtn) fireEvent.click(closeBtn);

    // Testăm Butonul Semnale de Alarmă / Red Flags din Dashboard
    const redFlagsBtn = screen.getByText(/Când trebuie să suni medicul de urgență/i);
    fireEvent.click(redFlagsBtn);
    expect(screen.getByText(/Ghid de Semnale de Alarmă/i)).toBeInTheDocument();
    expect(screen.getByText(/Tromboză Venoasă Profundă/i)).toBeInTheDocument();
  });
});
