# 003 — Audit, copie de siguranță, curățenie, viteză

**Stare:** în lucru
**Ramura:** claude/plan-produs-next-step-kx1wr8 (câte un PR pe etapă, din main)

## Scop
Decizia proprietarei (2026-10-08), după ce a terminat observațiile de la testare: audit general al aplicației, verificarea copiei de siguranță, curățenie de cod și o aplicație mai rapidă. Din audit nu se repară nimic fără acordul ei (chestionar).

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Audit: toate ecranele și ferestrele la 390px, cu litere normale și A+; listă de probleme | gata (`docs/audit-2026-10-08.md`) | |
| 2 | Reparațiile alese de proprietară din audit | gata | |
| 3 | Copia de siguranță: o copie veche (dinainte de jurnalul separat și de lista de controale) se restaurează corect | gata | |
| 4 | Curățenie de cod: importuri, variabile și funcții nefolosite | gata | |
| 5 | Viteză: împărțirea pachetului JS (avertismentul de la build); `vite.config.ts` doar la orchestrator | de făcut | |

## Rezumat pe etape
### Etapele 1 și 2 (2026-10-08)
- Audit cu Playwright pe date realiste, cu litere normale și A+: niciun overflow orizontal. 9 probleme în `docs/audit-2026-10-08.md`.
- Proprietara a ales 1, 5, 6, 8, 9. Starea zilei: etichetele și conversiile sunt în `src/lib/mood.ts`, iar în date rămân valorile vechi (compatibil cu notele salvate). Pe Astăzi, starea aleasă creează sau actualizează nota de azi (`handleSaveTodayMood` în App), fără să atingă gândurile scrise.
- După `verificare` (nimic blocant): intrarea veche de azi (fără tip) e actualizată din Astăzi, nu dublată; Astăzi ia starea doar din nota de azi.
- `npm test` (163) și `npm run build` trec; verificat la 390px și cu A+.


### Etapa 3 (2026-10-08)
- O copie veche (note fără tip, control salvat doar ca dată, fără listă) se citește corect: notele apar în Jurnal cu etichetele noi și cu simptomele, iar controlul apare pe Astăzi.
- Reparat: pe un telefon nou, după restaurare, apărea din nou configurarea inițială peste datele restaurate (marcajul nu era în copie). Acum restaurarea unui profil marchează aplicația ca fiind configurată. Copia păstrează și victoriile deja văzute.
- Găsit în plus: pe Astăzi, zilele până la control se rotunjeau în sus, iar peste schimbarea orei (25 octombrie) apărea o zi în plus. Acum se rotunjesc corect.
- Test nou `copie-veche.test.tsx` (pică pe codul vechi). `npm test` (167) și `npm run build` trec.

### Etapa 4 (2026-10-08)
- `tsc --noUnusedLocals` găsea 55 de nume nefolosite (mai ales iconuri importate, plus `isLowStock`, `moodSectionTitle`, `savedToday`, `toggleJointArea`, `sageLight`); acum 0. Fără schimbări vizibile.
- `npm test` (167) și `npm run build` trec.

## Următorul pas
Etapa 5: viteză (împărțirea pachetului JS).
