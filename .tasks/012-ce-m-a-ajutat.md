# 012 — Ce te-a ajutat altă dată

**Stare:** gata (PR #64)
**Ramura:** claude/ce-m-a-ajutat, din `main`

## Scop
O listă scrisă de pacientă cu lucrurile care au ajutat-o într-o zi grea (un om, un loc, o melodie), arătată când are nevoie. Fără conținut medical.

Deciziile proprietarei (2026-10-10):
- apare în Jurnal, după salvare, la „Greu” și „Obosită” (în date: „Foarte rău”, „Rău”) și în „Am nevoie de liniște acum”, pe primul ecran, sub „Respiră cu mine”;
- se păstrează doar pe dispozitiv (localStorage `oncosentinel_what_helped`, protejată de PIN ca restul) și intră în copia de siguranță; fără Supabase;
- textele aprobate: „Ce te-a ajutat altă dată”; „Ce te ajută într-o zi grea? Un om, un loc, o melodie. Scrie-le aici și ți le arăt când ai nevoie.”; „Adaugă ceva”; „De exemplu: s-o sun pe sora mea”; „Salvează” / „Anulează”; „Șterge „…”” (pentru cititorul de ecran); „Am păstrat. Ți-l arăt când ai o zi grea.”

## În afara scopului
Sincronizare în cont, editare din Profil, sugestii scrise de noi.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Lista în Jurnal și în fereastra de liniște, copia de siguranță | gata | PR #64 |

## Rezumat pe etape
### Etapa 1 (2026-10-10)
- `src/lib/whatHelped.ts`, `src/components/WhatHelped.tsx`; folosit în `JournalTab.tsx` (mood ≤ 2) și `CalmModal.tsx`; `backupService.ts` (`what_helped`).
- Formulat de Claude după decizii: în fereastra de liniște lista apare doar dacă are ceva în ea (fără invitația de a scrie, într-un moment de criză); un rând are cel mult 120 de caractere.
- Test nou `ce-m-a-ajutat.test.tsx`. `npm test` (293/293) și `npm run build` trec.
- Mutat din copia locală în clonul git.
- PR #64 integrat după `npm test` (293/293), `npm run build` și Vercel.
- Agentul `verificare`: nimic blocant; reparate butonul „Șterge” (32 px), scroll pe listă (max-h-40) și testul de backup care restaurează `window.location`. Lăsate: confirmarea `role="status"` inserată după salvare (ca mesajul Jurnalului; o regiune mereu prezentă strică testele care caută un singur status), importul care nu verifică tipul listei (`loadWhatHelped` filtrează la citire).
- Verificarea la 390px: nefăcută (Playwright nu e instalat); de văzut pe telefon, în aplicația publicată.

## Cum verific la final
`npm test` trece; în aplicație, la 390px: Jurnal → „Greu” → Salvează → apare lista; „Am nevoie de liniște acum” o arată după ce are ceva în ea.

## Următorul pas
Planul 012 e încheiat; de verificat pe telefon la 390px. Lucrul următor: doar la cererea proprietarei.
