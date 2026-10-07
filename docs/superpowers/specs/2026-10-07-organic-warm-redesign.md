# OncoSentinel - Specificație de Redesign UI/UX Cald, Organic & Matur

**Data:** 2026-10-07  
**Stare:** Aprobat de utilizator  
**Obiectiv principal:** Redesign complet al interfeței mobile și al arhitecturii vizuale (PWA), rezolvând problema de scalare și afișaj miniaturizat pe Android, adoptând stilul „Sanctuar Cald & Organic” conform mockup-ului de înaltă fidelitate validat.

---

## 1. Viziune & Limbaj Vizual (Design System)

### 1.1 Paletă Cromatică & Texturi
- **Fundal General (Canvas):** Bej cald, crem natural (`#FAF8F5` în mod zi, `#171F1A` în mod noapte).
- **Suprafețe Carduri:** Alb natural cald (`#FFFFFF` cu tentă discretă, bordură caldă `#EAE5DE`), eliminând aspectul rece de spital.
- **Salvie Caldă (Sage Green - Culoare Primară de Protecție & Aderență):**
  - Accent principal: `#5E7E6A` / `#6D8B74`
  - Fundal luminos pentru badge-uri și carduri de tratament: `#EAF1EC`
- **Pudră / Petală Caldă (Accent Empatic & Încurajare):**
  - Rozaliu-pudrat delicat: `#FDF2F2` / `#F8E8E8`
  - Text de accent: `#8C5358`
- **Tipografie:**
  - **Titluri & Antet:** Font Serif clasic, matur și elegant (ex: `Lora` sau `Playfair Display`), conferind căldură, demnitate și claritate.
  - **Corp de text, etichete & numere:** Font Sans-serif aerisit (`Plus Jakarta Sans` / `Inter`), cu dimensiuni de bază mărite (minimum 15px-16px pentru body, minimum 13px pentru subtitluri).

---

## 2. Diagnoză & Rezolvare Tehnică Viewport (Android PWA Fix)

1. **Meta Viewport Optimizat:**
   - Înlocuirea meta tag-ului rigid cu setarea fluidă completă:
     ```html
     <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
     ```
   - Permiterea scalării native și evitarea zoom-out-ului forțat pe ecrane Android cu DPI mare.
2. **Container Mobil Elastic:**
   - Pe ecrane mobile (`< 640px`), aplicația ocupă 100% din lățimea ecranului (`w-full`), cu padding lateral confortabil (`px-4 sm:px-5`), eliminând spațierea artificială îngustă (`max-w-md` forțat la 448px centrat pe ecrane late de telefon).
3. **Touch Targets (Accesibilitate Medicală):**
   - Toate butoanele interactive, acțiunile rapide și selectorii au o zonă de atingere minimă de **48x48px** (cardul de luare a dozei având **56px înălțime**).

---

## 3. Arhitectura Ecranului Principal („Astăzi”)

Ecranul principal este reproiectat fidel mockup-ului aprobat:

### 3.1 Antet Personalizat & Salut Empatic
- **Salut:** `Bună dimineața, {Nume}` în font Serif mare (24px-28px), elegant.
- **Mesaj de susținere:** *„Ești puternică. Pas cu pas. Ai grijă de tine.”*
- **Elemente secundare:** Pictogramă discretă de clopoțel (alarme zilnice) și accent grafic floral/botanic minimalist.

### 3.2 Hero Card de Tratament (Tamoxifen 20 mg)
- Fundal cald de salvie deschisă (`#EAF1EC` / bordură `#D5E2D8`).
- Ilustrație/iconiță pastilă clară.
- Text tratament: `Tamoxifen 20 mg • 1 comprimat/zi`.
- Buton Pill Status:
  - Când este în așteptare: buton mare, clar `Bifează ca luat`.
  - Când este luat: etichetă marcată cu bifă `✓ Azi • Luat` în salvie intensă.
- Subsol card: `Următoarea doză: Mâine, {ora}` + link `Vezi detalii >`.

### 3.3 Butoane Rapide de Acces (Grid 4 Coloane)
Patru butoane liniare, aerisite, cu iconițe elegante și etichete lizibile:
1. **Calendar tratament** (Aderență & zile)
2. **Ghiduri medicale** (Interacțiuni & contraindicații)
3. **Medici și centre** (Q&A & contact oncolog)
4. **Resurse utile** (Ancorare 5-4-3-2-1, respirație, cercul de sprijin)

### 3.4 Secțiune Duală (Următorul Control & Citat de Îngrijire)
- **Stânga - Card Următorul Control:**
  - Etichetă: `URMĂTORUL CONTROL`
  - Data clară (ex: `18 noiembrie 2026`)
  - Detaliu: `Oncologie • Dr. {Nume Medic}` (sau generic dacă nu este setat) + săgeată interactivă pentru editare dată.
- **Dreapta - Card Empatic Roz-Pudrat:**
  - Citat stilizat: *„Îngrijirea de sine nu este un lux, ci o parte din tratament.”*
  - Mică frunză botanică stilizată.

### 3.5 Jurnalul de Stare & Monitorizare Emoțională
- Titlu: *„Cum te-ai simțit în ultima săptămână?”* / *„Starea ta de azi”*.
- 5 pictograme circulare mari de stare emoțională (Foarte bine, Bine, Neutru, Rău, Foarte rău), cu feedback vizual salvie pentru starea selectată.

### 3.6 Carduri de Ghiduri, Rețete & Noutăți
- **Card Ghid:** *„Tamoxifen și efectele secundare”* / *„Nutriție și somn”* cu rezumat și imagine liniștitoare.
- **Card Noutăți & Recomandări DCIS:** Actualizări medicale validate clinic.
- **Banner de Inspirație:** Card verde-deschis cu ilustrație botanică și citatul *„Nu ești doar un pacient. Ești o persoană cu o viață întreagă în față.”*

---

## 4. Bara de Navigare Inferioară (Bottom Nav)

Bara de navigare este actualizată la cele 5 secțiuni din mockup:
1. **Astăzi** (Home / Panou principal)
2. **Tratament** (Calendar lunar, stoc pastile, istoric aderență)
3. **Jurnal** (Simptome, bufeuri, stări, export rapoarte PDF)
4. **Ghiduri** (Rețete, alimente contraindicate, mișcare ASCO, oase)
5. **Profil** (Date medicale DCIS, medic, alarme, suport de urgență SOS)

---

## 5. Criterii de Verificare & Testare

1. **Testare E2E:** Menținerea integrității funcționale (toate testele din `npm test` trebuie să treacă fără regresii).
2. **Compatibilitate Mobilă & Android:** Verificarea pe ecran mobil că elementele nu se mai micșorează și că butoanele au zone de atingere confortabile.
3. **Build curat:** `npm run build` fără erori de compilare TypeScript/Vite.
