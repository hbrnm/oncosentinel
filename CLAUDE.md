# CLAUDE.md

Reguli de lucru pentru OncoSentinel (aplicație Vite + React 19 + TypeScript + Supabase de însoțire pentru paciente cu DCIS în tratament cu Tamoxifen). Designul de referință e în `base44/`, planurile și specificațiile în `docs/`.

## 1. Principii

1. **Gândește înainte de cod:** nu presupune; spune presupunerile; dacă există mai multe interpretări, prezintă-le; dacă e neclar, oprește-te și întreabă.
2. **Simplitate:** minimul de cod care rezolvă problema; nimic speculativ, fără abstracții pentru o singură folosire.
3. **Modificări chirurgicale:** atinge doar ce cere sarcina; păstrează stilul existent; nu „îmbunătăți” codul din jur; șterge doar ce ai lăsat tu nefolosit.
4. **Execuție orientată spre rezultat:** transformă sarcina în criterii verificabile (un test care reproduce bug-ul, apoi îl face să treacă); la sarcini cu mai mulți pași, un plan scurt cu verificarea fiecărui pas.

### Deciziile proprietarului — întotdeauna ca chestionar
Orice decizie care îi revine proprietarului (produs, texte, conținut medical, furnizori, ce intră în aplicație) i se prezintă ca **chestionar cu variante** (AskUserQuestion), cu varianta recomandată prima și marcată „(Recomandat)”. Excepție: instrucțiunile despre cum își configurează singur ceva (Supabase, Vercel, GitHub) rămân text pas cu pas.

## 2. Proiect — ce trebuie știut

- **Structură:** `src/App.tsx` (taburile aplicației), `src/components/` (taburi și modale), `src/lib/` (Supabase, PDF, notificări, backup, interacțiuni), `src/data/` (ghiduri, rețete, citate), `src/types/index.ts`.
- **Node 22+.**
- **Teste:** Vitest + Testing Library (jsdom), în `src/test/`. Orice comportament nou sau bug reparat vine cu test. Înainte de push: `npm test` și `npm run build`.
- **Supabase:** migrațiile sunt fișiere noi în `supabase/migrations/` (`AAAAMMZZ_nume.sql`). Nimic nu se rulează direct pe producție fără acordul proprietarului. Clientul (`src/lib/supabase.ts`) poate fi `null` când lipsesc variabilele: codul trebuie să funcționeze și local (localStorage).
- **Securitate și date de sănătate:** în `src/` doar `VITE_SUPABASE_URL` + anon key; nicio cheie secretă. Datele pacientei (profil, simptome, jurnal, documente) se citesc și se scriu doar pentru utilizatorul autentificat (RLS); nimic public nou în Storage.
- **Conținut medical:** nu inventa doze, interacțiuni, simptome sau recomandări clinice. Dacă lipsește o informație, scrie „DE COMPLETAT: …” și întreabă proprietarul. Simptomele severe trimit mereu spre medic sau 112.
- **UI:** culorile prin tokenii din `src/index.css` / `tailwind.config.js` (sage, petal, peach…) și sistemul din `base44/01_DESIGN_SYSTEM.md`, nu valori noi hardcodate; status prin text (+ icon), nu doar culoare; fără overflow la 390px.
- **Texte:** română cu ș/ț cu virgulă; ton cald, clar; erorile spun ce s-a întâmplat și ce poate face utilizatoarea.

## 3. Lucrul cu subagenți — orchestrator + agenți

Sesiunea principală e **orchestratorul**: înțelege cererea, planifică, ia deciziile sensibile și verifică tot ce aduc agenții. Agenții din `.claude/agents/` execută și raportează scurt. Proprietarul a aprobat delegarea: orchestratorul îi folosește din proprie inițiativă, după regulile de mai jos, fără să mai ceară voie.

| Agent | Model | Când |
|---|---|---|
| `explorare` | Haiku | căutări care ar cere multe citiri („unde se folosește…”, „ce componente scriu în…”); doar citire |
| `testare` | Sonnet | rularea testelor Vitest / build; întoarce doar ce a picat și de ce |
| `executie` | Sonnet | sarcini bine definite, cu model de urmat: o componentă după modelul alteia, un test după modelul altuia, aceeași schimbare în mai multe taburi |
| `verificare` | Sonnet | înaintea fiecărui push care schimbă cod: citește diff-ul față de regulile din acest fișier |

**Rămân la orchestrator, niciodată delegate:** deciziile proprietarului (chestionar), conținutul medical, migrațiile și orice SQL pe Supabase, politicile RLS/Storage, `vite.config.ts`, dependențele noi, workflow-urile CI, commit, push, PR, merge. Tot ce atinge producția.

**Integrarea PR-urilor:** proprietara a aprobat ca orchestratorul să deschidă și să integreze singur PR-urile utile, fără revizuirea ei, după ce trec `npm test`, `npm run build`, agentul `verificare` și verificările din GitHub. Textele noi și conținutul medical se aprobă în continuare prin chestionar înainte de PR; SQL-ul pe Supabase de producție tot cu acordul ei.

**Când nu deleg:** modificări mici sau legate între ele, unde explicația pentru agent ar fi mai lungă decât lucrul în sine.

**Cum deleg:** sarcina pentru agent conține tot ce îi trebuie (agentul pornește fără contextul conversației): ce să facă, fișierele exacte, fișierul-model, ce să NU atingă, cum arată „gata”. Agenții independenți (fără fișiere comune) pot rula în paralel. Ce întoarce un agent se verifică înainte de folosire: orchestratorul citește diff-ul și rulează testele. O greșeală a agentului o repară orchestratorul sau o retrimite cu instrucțiuni mai clare.

**Lucrările mari** (mai multe etape sau sesiuni): fișier de sarcină în `.tasks/NNN-nume.md` după `.tasks/README.md`, cu planul pe etape și un rezumat după fiecare etapă (ce s-a făcut, commit, ce urmează). La reluarea după pierderea contextului se citește întâi fișierul de sarcină.
