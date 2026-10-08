# 001 — Curățare după auditul codului generat

**Stare:** în lucru
**Ramura:** fix/erori-care-blocheaza

## Scop
Auditul din 2026-10-08 a găsit erori care blocau aplicația, date clinice inventate și promisiuni false de sincronizare în cloud. Deciziile proprietarei (2026-10-08):
- se repară întâi erorile care blochează;
- cronologia și profilul clinic pornesc goale, pacienta își adaugă singură etapele;
- aplicația rămâne doar locală, cu texte corecte; autentificarea se ascunde, fereastra devine „Siguranța datelor” (export, import, ștergere de pe dispozitiv).

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Erori TypeScript care blocau aplicația + typecheck în build | gata | 67819cf |
| 2 | Fără date clinice inventate (cronologie, profil, control, medic, documente fără fișier) | gata | (acest commit) |
| 3 | Aplicație doar locală: „Siguranța datelor”, fără cloud, migrație redenumită | gata | (acest commit) |
| 4 | Rămase din audit (vezi mai jos) | de făcut | |

## Rezumat pe etape
### Etapele 1–3 (2026-10-08)
- Etapa 1: ecranul alb de la editarea profilului, butonul rămas de la simularea AI, insert-ul Supabase al dozei, tipuri; `npm run build` rulează acum `tsc --noEmit`.
- Etapa 2: `DEFAULT_MILESTONES` scos, profilul implicit fără valori clinice, fără „Curabil / Grad 0” și „Toate etapele finalizate cu succes”, fără data fixă a controlului și fără medic/centru/oră inventate; cronologia are „Adaugă etapă”, „Modifică” și „Șterge” (prin `MilestoneModal`, care exista dar nu era folosit); documentele cer un fișier real.
- Etapa 3: `AuthModal` → „Siguranța datelor”; scoase butoanele către tabela `user_backups` (inexistentă) și verificarea Supabase din `App`; migrația dozelor redenumită `20261007_create_dose_logs.sql` (avea aceeași versiune ca schema).
- `npm test` (30) și `npm run build` trec.

**Neverificat:** dacă migrațiile au fost deja aplicate în proiectul Supabase al aplicației (conectorul vede doar alt proiect). Dacă da, redenumirea trebuie potrivită cu istoricul din baza de date.

**Date existente:** utilizatoarele care au deja salvate etapele sau profilul demo le păstrează; le pot șterge sau modifica acum din aplicație.

## Rămase din audit (etapa 4, de decis)
- datele de sănătate necriptate în localStorage; limita de ~5 MB pentru documente;
- memento-ul zilnic promis, dar neprogramat;
- jurnalul calculează „azi” în UTC (`JournalTab.tsx`);
- cod mort: `SymptomsTab`, `SymptomModal`, `ExerciseSection`, `src/data/recipes.ts` vs `src/lib/recipes.ts`, `fix.cjs`, `fixJournal.cjs`;
- jsPDF/html2canvas încărcate la pornire (pachet de 1,1 MB);
- `.env` urmărit în git (doar cheie anon); funcția trigger fără `search_path`;
- conținutul medical (interacțiuni, ghiduri) fără surse, de verificat de un medic;
- culori hardcodate în loc de tokeni; numele vechi „NaviMed”.

## Următorul pas
PR cu etapele 1–3, apoi proprietara alege ordinea pentru etapa 4.
