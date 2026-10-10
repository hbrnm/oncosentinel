# 011 — Audit playbook Claude Code

**Stare:** în lucru (etapa 3: implementare)
**Ramura:** nouă, din `main`, la începutul etapei 3

## Scop
Proprietara vrea un proces de lucru reutilizabil, cu mai puține erori și modificări inutile, costuri mai mici și context păstrat între sesiuni. Pornim de la `docs/playbook-claude-code.md`. Nu se rescrie de la zero: se păstrează structura (9 secțiuni) și principiile și se adaugă doar modificările aprobate. Mediul ei: Claude Code pe web (sesiuni cloud).

Raportul de audit (etapele 1–2), cu motivele și sursele oficiale: [Audit playbook Claude Code — Etapa 1](https://claude.ai/code/artifact/0736e457-749c-48b0-a972-57987a0bc36e).

Decizii (2026-10-10):
- toate cele 6 modificări obligatorii;
- opționalele le-a lăsat la alegerea orchestratorului: intră toate, mai puțin R14 (exemplul de skill pentru PR, speculativ, `CLAUDE.md` are doar 54 de rânduri);
- implementarea se face într-o sesiune nouă, din acest fișier;
- nu se creează fișiere auxiliare; setarea OncoSentinel (`.claude/settings.json`, mediul cloud) nu se schimbă în această sarcină.

## În afara scopului
- Orice schimbare în `CLAUDE.md`, `.claude/agents/`, `.claude/settings.json` sau în codul OncoSentinel.
- Documentul din Claude Docs (versiunea editabilă) nu se sincronizează automat; după integrare, se actualizează sau se notează că `docs/` e sursa.

## Modificările aprobate (în `docs/playbook-claude-code.md`)
| # | Unde | Ce se adaugă |
|---|---|---|
| R11 | §5 Siguranță | Variabilele unui mediu cloud le poate citi oricine folosește mediul: fără chei secrete de producție acolo (ex. Supabase `service_role`); dacă e nevoie de o cheie de API, *network secret* (Pro/Max), pe care Claude nu o vede. |
| R10 | §2 Pasul 0 (tabel) + §5 | Regulă de permisiuni în `.claude/settings.json`: `"permissions": {"deny": ["Read(./.env)", "Read(./.env.*)"]}`; se aplică și în cloud (sesiune cu un singur repo). Limită: nu oprește un script care citește indirect. |
| R1 | §5 Siguranță | `CLAUDE.md` e un sfat pe care Claude îl urmează, nu un blocaj; ce nu trebuie să se întâmple niciodată → permisiuni (R10) sau hook. |
| R12 | §2 Pasul 0 (tabel) | Rând nou: mediul cloud (setup script, ex. `npm ci`; nivel de rețea; variabile). Notă: `~/.claude/settings.json` și `.claude/settings.local.json` nu ajung în cloud; ce trebuie aplicat stă în `.claude/settings.json` din repo. |
| R4 | §3 Ciclul + §8 șablon `.tasks` | Fișierul de sarcină: commit + push după fiecare etapă (containerul cloud se șterge). Șablonul primește „În afara scopului” și „Cum verific la final”. |
| R7 | §9 Greșeli (tabel) + șablon `CLAUDE.md` | Testele nu depind de data de azi, de rețea sau de ordinea rulării; data se fixează în test (incidentul din PR #54). |
| R9 | §3 Ciclul | Pasul 0 al fiecărei sesiuni: testele pe `main`; dacă pică, întâi un PR separat de reparare. |
| R6 | §3 Ciclul / §4 | Rezumatul etapei și PR-ul conțin dovada: comanda și rezultatul (ex. „274/274 trec”). |
| R2 | §2 + §8 șablon `CLAUDE.md` | Sub 200 de rânduri; fără ce Claude află din cod; procedurile lungi sau rare → skill; testul „Dacă șterg regula, greșește Claude?”. |
| R5 | §4 sau §3 pasul 2 | Fără plan dacă schimbarea se descrie într-o propoziție; modul plan pentru schimbări în mai multe fișiere sau cu abordare nesigură (în cloud se alege din meniul sesiunii). |
| R3 | §1 sau §2 (agenți) | `description` scurtă, care spune când se folosește agentul; agenții nu pot pune întrebări (deciziile rămân la orchestrator); raportul intră în contextul principal, de aici limitele de rânduri. Notă: există agentul încorporat `Explore`. |
| R15 | §6 Economie | În cloud nu există `/clear`: sesiune nouă din bara laterală; `/compact` cu instrucțiune; după două corectări eșuate, sesiune nouă cu o cerere mai bună. |
| R8 | §8 șablon `CLAUDE.md` | Un rând pentru convenții: numele ramurilor, prefixele commit-urilor (`feat:`, `fix:`, `test:`, `docs:`), ce conține PR-ul. |
| R13 | §2 sau §9 | Regula de decizie: hook doar pentru ce trebuie să se întâmple de fiecare dată și doar după ce o regulă din `CLAUDE.md` a fost încălcată; skill când repeți aceleași instrucțiuni sau o secțiune din `CLAUDE.md` a devenit procedură; altfel nimic. |

Sursele oficiale sunt în raport (secțiunea „Surse”). Formulările se verifică din nou acolo, nu din memorie.

## Etape
| # | Etapa | Stare | Commit |
|---|---|---|---|
| 1 | Audit fără modificări | gata | — |
| 2 | Raport și aprobare | gata | — |
| 3 | Implementare în `docs/playbook-claude-code.md` | de făcut | |
| 4 | Validare (agentul `verificare` pe diff: corectitudine tehnică, coerență, contradicții, complexitate) + rezumat al diferențelor pentru proprietară | de făcut | |

## Cum verific la final
- Fiecare dintre cele 14 modificări apare în playbook (bifă pe tabelul de mai sus).
- Nicio contradicție între secțiuni (ex. §5 vs §9, șabloanele din §8 vs regulile din §2).
- Structura cu 9 secțiuni rămâne; textul nu crește cu mai mult de aproximativ o treime.
- PR doar cu `docs/` și `.tasks/`; Vercel verde; integrare după regulile din `CLAUDE.md`.

## Rezumat pe etape
### Etapele 1–2 (2026-10-10)
Audit pe 9 domenii, comparat cu 10 pagini din documentația oficială Claude Code. 15 recomandări (6 obligatorii); 14 aprobate. Raportul e în Claude Docs (link mai sus). Nimic schimbat în repo în afară de acest fișier.

## Următorul pas
Sesiune nouă: „Continuă sarcina 011 din `.tasks/011-audit-playbook.md`, etapa 3.”
