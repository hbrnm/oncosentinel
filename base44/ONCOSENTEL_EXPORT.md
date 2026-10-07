\# OncoSentinel — Export complet pentru alt agent

\> **\*\*Scop:\*\*** PWA mobile-first, empatic, non-clinical pentru supraviețuitoare ale cancerului de sân aflate în terapie endocrină pe termen lung (Tamoxifen). Urmărire medicație, jurnal emoțional, programări medicale și ghiduri clinice.  
\>  
\> **\*\*Stack:\*\*** React 18 \+ Vite \+ Tailwind CSS \+ Base44 SDK (backend-as-a-service: auth, DB, integrations). Mobile-first, max-width 440px, PWA-ready.  
\>  
\> **\*\*Limbă:\*\*** Toate textele UI sunt în română, ton cald și încurajator.

\#\# 📁 Structură fișiere

\`\`\`  
OncoSentinel/  
├── index.html                          \# Shell HTML, fonturi, meta PWA  
├── package.json                         \# Dependințe  
├── vite.config.js                       \# Config Vite \+ plugin Base44  
├── tailwind.config.js                   \# Tailwind cu token-uri custom  
├── postcss.config.js  
├── jsconfig.json  
├── base44/  
│   ├── config.jsonc                     \# Config app Base44  
│   ├── entities/  
│   │   ├── User.jsonc                   \# Utilizator (built-in, customizat)  
│   │   ├── Medication.jsonc             \# Medicament \+ RLS per-user  
│   │   ├── DoseLog.jsonc                \# Log doze \+ RLS per-user  
│   │   ├── MoodEntry.jsonc              \# Jurnal dispoziție \+ RLS per-user  
│   │   ├── Appointment.jsonc            \# Programări \+ RLS per-user  
│   │   ├── Guide.jsonc                  \# Ghiduri clinice (admin-only write)  
│   │   └── NewsUpdate.jsonc             \# Noutăți clinice (admin-only write)  
│   └── functions/  
│       └── sendAppointmentReminder/  
│           └── entry.ts                 \# Email confirmare programare  
└── src/  
    ├── main.jsx                         \# Entry point React  
    ├── App.jsx                           \# Router \+ auth gate \+ onboarding gate  
    ├── index.css                         \# Token-uri CSS \+ componente custom  
    ├── api/base44Client.js              \# SDK Base44 inițializat  
    ├── lib/  
    │   ├── onco.js                       \# Helpers: date RO, mood, greeting  
    │   ├── AuthContext.jsx               \# Context auth global  
    │   ├── app-params.js                 \# Parametri app (token, appId)  
    │   ├── authReturnTo.js               \# Validare redirect sigur  
    │   ├── query-client.js               \# React Query client  
    │   ├── utils.js                      \# cn() utility  
    │   └── PageNotFound.jsx              \# 404  
    ├── components/  
    │   ├── AppLayout.jsx                 \# Shell \+ bottom nav  
    │   ├── BottomNav.jsx                 \# Navigație 5 tab-uri  
    │   ├── StatusBar.jsx                 \# Fake status bar iOS  
    │   ├── MedicationHeroCard.jsx        \# Card medicament pe Astăzi  
    │   ├── QuickActions.jsx              \# Grid 4 scurtături  
    │   ├── MoodPicker.jsx                \# Selector dispoziție 5 niveluri  
    │   ├── AppointmentBanner.jsx         \# Banner programare azi/mâine  
    │   ├── Botanical.jsx                 \# SVG line-art botanic  
    │   ├── SectionHeader.jsx             \# Titlu secțiune \+ acțiune  
    │   ├── ProtectedRoute.jsx            \# Guard auth  
    │   ├── ScrollToTop.jsx               \# Scroll reset la navigare  
    │   ├── AuthLayout.jsx                \# Layout pagini auth  
    │   ├── GoogleIcon.jsx                \# Logo Google  
    │   ├── UserNotRegisteredError.jsx    \# Ecran user neînregistrat  
    │   └── ui/                           \# shadcn/ui components (standard)  
    ├── pages/  
    │   ├── Astazi.jsx                    \# Home — dashboard zilnic  
    │   ├── Tratament.jsx                 \# Plan medicație \+ calendar doze  
    │   ├── Jurnal.jsx                    \# Jurnal dispoziție \+ istoric  
    │   ├── Ghiduri.jsx                   \# Listă ghiduri \+ noutăți  
    │   ├── GuideDetail.jsx               \# Detaliu ghid (markdown)  
    │   ├── NewsDetail.jsx                \# Detaliu noutate (markdown)  
    │   ├── Profil.jsx                    \# Profil \+ setări \+ programări  
    │   ├── Onboarding.jsx                \# Wizard 4 pași  
    │   ├── Login.jsx                     \# Login (boilerplate Base44)  
    │   ├── Register.jsx                  \# Register (boilerplate)  
    │   ├── ForgotPassword.jsx            \# Forgot password (boilerplate)  
    │   ├── ResetPassword.jsx             \# Reset password (boilerplate)  
    │   └── OAuthConsent.jsx              \# OAuth consent (boilerplate)  
    ├── hooks/  
    │   ├── use-mobile.jsx  
    │   └── use-size.jsx  
    └── utils/index.ts  
\`\`\`

\#\# 📋 Conținutul exportului

Acest export este împărțit în mai multe fișiere:

1\. **\*\*\`ONCOSENTEL\_EXPORT.md\`\*\*** (acest fișier) — Overview, structură, note  
2\. **\*\*\`export/01\_DESIGN\_SYSTEM.md\`\*\*** — Paleta, tipografie, CSS, Tailwind config  
3\. **\*\*\`export/02\_ENTITIES.md\`\*\*** — Schemele DB (entități \+ RLS)  
4\. **\*\*\`export/03\_BACKEND.md\`\*\*** — Funcție backend \+ config infra  
5\. **\*\*\`export/04\_COMPONENTS.md\`\*\*** — Toate componentele custom  
6\. **\*\*\`export/05\_PAGES.md\`\*\*** — Toate paginile aplicației  
7\. **\*\*\`export/06\_LIB.md\`\*\*** — Lib-uri (onco.js, AuthContext, App.jsx, etc.)

\#\# 🔑 Note pentru agentul care primește acest export

1\. **\*\*Platforma:\*\*** App-ul folosește Base44 ca backend (auth, DB, integrări). SDK-ul se inițializează în \`src/api/base44Client.js\`. Entitățile sunt scheme JSON stocate în \`base44/entities/\`.

2\. **\*\*RLS (Row-Level Security):\*\*** Toate entitățile sensibile (Medication, DoseLog, MoodEntry, Appointment) au RLS per-user (\`created\_by\_id: "{{user.id}}"\`). Ghidurile și noutățile sunt public-read, admin-only write.

3\. **\*\*Auth:\*\*** Paginile de login/register/forgot/reset sunt boilerplate Base44 (nu sunt incluse complet aici — sunt standard shadcn). Context-ul auth este în \`src/lib/AuthContext.jsx\`.

4\. **\*\*Onboarding gate:\*\*** Dacă \`user.onboarding\_complete\` este false, se afișează wizard-ul de onboarding în loc de app.

5\. **\*\*SDK calls:\*\*** Toate operațiile cu entitățile folosesc \`base44.entities.EntityName.filter/create/update/delete\`. Funcțiile backend se apelează cu \`base44.functions.invoke("functionName", payload)\`.

6\. **\*\*shadcn/ui:\*\*** Componentele UI standard (Button, Input, Dialog, Switch, Label, Textarea, Image, Toaster) sunt în \`src/components/ui/\` — sunt componentele standard shadcn, nemodificate.

7\. **\*\*PWA:\*\*** \`index.html\` referențiază \`/manifest.json\` (trebuie creat pentru PWA complet) și are \`theme-color\` \+ viewport configurat pentru mobile.

8\. **\*\*Funcționalitate neimplementată încă:\*\***  
   \- Sincronizarea cu Google Calendar (necesită connector Google Calendar)  
   \- Notificări push mobile (necesită build nativ iOS/Android)  
   \- Reminder-uri programate zilnice (necesită workflow/scheduled task)  
