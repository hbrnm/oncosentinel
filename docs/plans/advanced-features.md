# Plan de Implementare: Funcționalități Avansate OncoSentinel

**Obiectiv Principal:** Implementarea celor 4 module noi, păstrând designul minimalist, organic (Base44) și structura actuală a aplicației (fără tab-uri noi, fără aglomerare vizuală).

## Faza 1: Raportul pentru Oncolog (PDF Inteligent)
*   **Ce facem:** Un script care adună istoricul de simptome (grafice/tendințe), aderența la pastile și cronologia medicală într-un PDF gata de printat.
*   **Integrare UI (Minimală):** Adăugăm un singur buton elegant de tip *„Descarcă Raport Medic”* în tab-ul `Profil` sau la acțiunile rapide din `Dashboard`.
*   **Impact vizual:** Nul asupra fluxului zilnic, oferă doar o funcție în plus la cerere.

## Faza 2: Intervenție Activă la Simptome Severe
*   **Ce facem:** Un sistem de detecție la salvarea jurnalului. Dacă un simptom are scorul 4 sau 5 (sever).
*   **Integrare UI (Minimală):** Nu modificăm interfața existentă. Doar adăugăm un *Pop-up (Modal)* în stilul celor pe care le avem deja, care apare instant după salvarea unui simptom sever, oferind un sfat rapid și un link către secțiunea de Ghid/Rețete existentă.
*   **Impact vizual:** Apare doar contextual, strict când este nevoie de ajutor.

## Faza 3: Motivare (Streaks) & Notificări
*   **Ce facem:** Urmărim câte zile la rând a fost luată pastila la timp și permitem setarea unei alarme.
*   **Integrare UI (Minimală):** 
    *   *Streaks:* Adăugăm o mică iconiță (ex: o flacără subtilă 🔥 cu numărul de zile) în header-ul din `Dashboard`, lângă mesajul de salut.
    *   *Notificări:* Un simplu selector de oră (Time Picker) în secțiunea de `Profil` -> *Setări Tratament*.
*   **Impact vizual:** Foarte discret, complet integrat în header și meniul de profil existent.

## Faza 4: Analiza Automată a Documentelor (AI OCR)
*   **Ce facem:** Funcția inteligentă care „citește” buletinele medicale și creează evenimente pe linia timpului.
*   **Integrare UI (Minimală):** În tab-ul actual `Timeline`, acolo unde sunt listate documentele încărcate, vom pune un buton mic cu niște steluțe (✨ *Analizează*). Când e apăsat, va deschide pur și simplu *Modalul de Eveniment* (pe care l-am făcut azi) pre-completat cu datele găsite de AI, așteptând doar confirmarea pacientei.
*   **Impact vizual:** Folosește 100% componentele pe care le-am construit deja astăzi.

---
*Status:* **Așteaptă începerea implementării**
