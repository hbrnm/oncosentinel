# 001 — Curățare după auditul codului generat

**Stare:** în lucru
**Ramura:** fix/erori-care-blocheaza (etapele 1–3, PR #2), claude/curatare-audit-etapa4 (etapa 4)

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
| 4 | Rămase din audit (vezi mai jos) | gata, în afară de conținutul medical | d7713c2…c10f29b |

## Rezumat pe etape
### Etapele 1–3 (2026-10-08)
- Etapa 1: ecranul alb de la editarea profilului, butonul rămas de la simularea AI, insert-ul Supabase al dozei, tipuri; `npm run build` rulează acum `tsc --noEmit`.
- Etapa 2: `DEFAULT_MILESTONES` scos, profilul implicit fără valori clinice, fără „Curabil / Grad 0” și „Toate etapele finalizate cu succes”, fără data fixă a controlului și fără medic/centru/oră inventate; cronologia are „Adaugă etapă”, „Modifică” și „Șterge” (prin `MilestoneModal`, care exista dar nu era folosit); documentele cer un fișier real.
- Etapa 3: `AuthModal` → „Siguranța datelor”; scoase butoanele către tabela `user_backups` (inexistentă) și verificarea Supabase din `App`; migrația dozelor redenumită `20261007_create_dose_logs.sql` (avea aceeași versiune ca schema).
- `npm test` (30) și `npm run build` trec.

**Neverificat:** dacă migrațiile au fost deja aplicate în proiectul Supabase al aplicației (conectorul vede doar alt proiect). Dacă da, redenumirea trebuie potrivită cu istoricul din baza de date.

**Date existente:** utilizatoarele care au deja salvate etapele sau profilul demo le păstrează; le pot șterge sau modifica acum din aplicație.

### Etapa 4 (2026-10-08)
Deciziile proprietarei: memento fără promisiune; stocarea explicată + mesaj la spațiu plin; conținutul medical rămâne cum e.
1. Jurnalul calculează ziua locală, nu UTC (d7713c2); testele rulează cu TZ Europe/Bucharest.
2. Cod mort șters: SymptomsTab, SymptomModal, ExerciseSection, RecipesSection, ShoppingListModal, SevereSymptomModal, `src/lib/recipes.ts`, `fix.cjs`, `fixJournal.cjs` (ca4900e).
3. `.env` scos din git (+ `.env.example`); migrație nouă `20261008_set_search_path_updated_at.sql`, **neaplicată** (57ce807).
4. jsPDF încărcat la cerere: pachetul principal 1,13 MB → 0,70 MB (23125b1).
5. Scoase clopoțelul, cardul „Notificări”, cererea de permisiune la pornire și mesajul „Alarma a fost amânată” (6f3c30d).
6. Salvările locale prind spațiul plin cu mesaj clar; datele care nu încap (documente, jurnal, doze, profil, etape) nu mai apar fals pe ecran; „Siguranța datelor” explică necriptarea și limita (d951378).
7. NaviMed → OncoSentinel în texte, copie de siguranță (copiile vechi se restaurează), cache SW; cheile `navimed_*` rămân (d43054d).
8. 405 culori hex → tokeni din design system (c10f29b); verificat vizual la 390px.
- `npm test` (41) și `npm run build` trec.

**De aplicat de proprietară:** migrația `20261008_set_search_path_updated_at.sql`, dacă tabela `dose_logs` există în proiectul Supabase.

**Găsite pe parcurs — decizii (2026-10-08):** Dosar → număr real + trimitere spre Cronologie (făcut); alerta severă rămâne până e închisă + 112 + semnale de alarmă (făcut); `interactions.ts` rămâne deoparte până la verificarea medicală; `@supabase/supabase-js` se păstrează.
- Profil → „Dosar Medical” e o machetă cu numere inventate („12 documente”, „3 documente”, „5 documente”) și un buton „Încarcă document” fără efect; documentele reale sunt în Cronologie.
- `src/lib/interactions.ts` (verificarea interacțiunilor) nu e folosit nicăieri în aplicație.
- Alerta de simptome severe din Jurnal trimite la medic, dar nu menționează 112 și dispare după 5 secunde.
- `@supabase/supabase-js` e încă în pachet, deși clientul nu mai e folosit.

## Rămase din audit (etapa 4) — lista inițială
- datele de sănătate necriptate în localStorage; limita de ~5 MB pentru documente;
- memento-ul zilnic promis, dar neprogramat;
- jurnalul calculează „azi” în UTC (`JournalTab.tsx`);
- cod mort: `SymptomsTab`, `SymptomModal`, `ExerciseSection`, `src/data/recipes.ts` vs `src/lib/recipes.ts`, `fix.cjs`, `fixJournal.cjs`;
- jsPDF/html2canvas încărcate la pornire (pachet de 1,1 MB);
- `.env` urmărit în git (doar cheie anon); funcția trigger fără `search_path`;
- conținutul medical (interacțiuni, ghiduri) fără surse, de verificat de un medic; **rămâne cum e (decizia proprietarei, 2026-10-08)**;
- culori hardcodate în loc de tokeni; numele vechi „NaviMed”.

## Următorul pas
Review și merge pentru PR #4; apoi aplicarea migrației `20261008_set_search_path_updated_at.sql` de către proprietară.
