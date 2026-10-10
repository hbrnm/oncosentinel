# 013 — Ghiduri noi: alimentație, mișcare, meditație și yoga

**Stare:** în lucru (PR)
**Ramura:** claude/ghiduri-noi, din `main`

## Scop
Ghidurile erau puține (3). Proprietara a cerut ghiduri despre alimentație, sport și antrenament cu greutăți, meditație și yoga. Le scriem din surse oficiale, cu sursa la fiecare ghid, iar proprietara le aprobă înainte să intre în aplicație.

Deciziile proprietarei (2026-10-10):
- trei ghiduri: alimentație (g4), mișcare și greutăți (g5), meditație și yoga (g6); fără ghid despre somn;
- doar ghiduri text, fără funcții noi (meditație ghidată sau minute de mișcare în Jurnal): se decid după testare;
- textele g4, g5 și g6 sunt aprobate așa cum apar în `docs/ghiduri-noi.md`.

## În afara scopului
Meditație ghidată, jurnal de mișcare, programe de exerciții cu greutăți sau posturi de yoga (lipsesc din surse).

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Documentare din surse, texte, aprobare, ghidurile în aplicație | gata | ramura claude/ghiduri-noi |

## Rezumat pe etape
### Etapa 1 (2026-10-10)
- Surse: WCRF International 2024 (supraviețuitoare de cancer de sân, rezumat executiv); ACS 2022 (Rock și colab., PDF integral); ACSM 2019 (Campbell și colab., PMC8576825); SIO–ASCO 2023 (Carlson și colab., JCO 41(28):4562–4591, citit prin rezumatul ONS și PubMed; tabelul ASCO nu s-a putut deschide din rețea).
- `src/data/guides.ts`: g4, g5, g6 (g6 are categoria `emotional`, care exista deja în tip, dar nu era folosită). Test nou în `medical-content.test.ts`.
- `npm test` (294/294) și `npm run build` trec.

## Cum verific la final
Ghiduri: apar 6 carduri; fiecare dintre g4–g6 se deschide și își arată sursa.

## Următorul pas
Verificare, PR, integrare.
