# Inventarul conținutului medical

Sarcina 002, etapa 0, pasul 1 (2026-10-08). Fiecare afirmație medicală din aplicație, cu starea ei. Afirmațiile se rescriu la pasul 2, din surse oficiale publice, și fiecare text nou trece prin proprietară înainte să intre în aplicație.

**Stări:**
- **GREȘIT**: afirmația e falsă sau înșelătoare; se repară primul.
- **DEFORMAT**: sursa există, dar textul spune altceva decât ea.
- **DE VERIFICAT**: încă nu am căutat sursa.
- **CONFIRMAT**: sursa e găsită și textul îi corespunde (cu sursa notată).
- **NU E MEDICAL**: text de interfață, rămâne.

## Prioritate 1: raportul PDF pentru medic (`src/lib/pdfGenerator.ts`) — REZOLVAT (2026-10-08)
Raportul ajunge la medic, deci aici o greșeală poate influența o decizie clinică.

| Linie | Text | Stare | De ce |
|---|---|---|---|
| 48 | „Tratament: Tamoxifen 20mg/zi” | GREȘIT | doza e scrisă fix; ignoră doza din profil (`medication_dose`) |
| 65 | „Status: Aderență optimă terapeutică pentru protecție împotriva recidivei mamare.” | GREȘIT | apare mereu, indiferent de procentul real de aderență |
| 131 | „Semne de tromboză venoasă profundă …: Negativ / Neraportat” | GREȘIT | aplicația nu întreabă despre tromboză; „Negativ” e o afirmație clinică falsă |
| 132–133 | „Sângerări vaginale anormale …: Neraportat”, „Dispnee bruscă …: Neraportat” | GREȘIT | aplicația nu întreabă despre ele; pot fi citite drept „verificat, absent” |
| 134 | „Interacțiuni medicamentoase verificate: Nu s-au înregistrat inhibitori CYP2D6 concomitenți.” | GREȘIT | aplicația nu înregistrează medicamentele luate |
| 30 | „Ghid Integrativ Oncologic” | DE VERIFICAT | eticheta sugerează un ghid clinic care nu există |
| 141 | „… are scop informativ de suport clinic.” | NU E MEDICAL | de păstrat, eventual mai clar: „date notate de pacientă” |

## Prioritate 2: „Noutăți” — REZOLVAT (2026-10-08): n1 rescris și aprobat, n2 scos (vezi docs/rescriere-etapa0.md)

### Starea inițială (`src/data/guides.ts`, `NEWS_PROTOCOLS`, afișate și pe Astăzi)

| Element | Afirmație din aplicație | Stare | Ce spune sursa |
|---|---|---|---|
| n1 ASCO 2026 | dozele mici (5 mg/zi) sunt „extrem de eficiente pentru DCIS” | DEFORMAT | Analiză cumulată (JCO 2026, DOI 10.1200/JCO-26-00841): beneficiu clar la femeile **la postmenopauză** (HR 0,51); fără protecție clară ipsilaterală la cele **înainte de menopauză**. |
| n1 | „incidența efectelor secundare … scade dramatic” | DE VERIFICAT | nu am găsit-o în rezumatele citite |
| n1 | 5 mg/zi sau 10 mg la două zile | CONFIRMAT | aceeași sursă |
| n1 | „discută cu medicul … nu modifica doza fără acordul medicului” | CONFIRMAT | sfat corect, de păstrat |
| n2 Stockholm | „beneficiu … la cancer de sân HR-pozitiv (Luminal A și B)”, „rată semnificativ redusă a recurenței la 15–20 de ani” | DEFORMAT | JNCI 2026 (doi 10.1093/jnci/djag049): cancer **invaziv**, tratament de **40 mg, 2 ani** (diferit de practica actuală, spune editorialul); beneficiul de lungă durată e la luminal A. Nu e despre DCIS. |
| n2 | „publicate în JNCI, iulie 2026” | CONFIRMAT | online 19 feb. 2026, numărul din iulie 2026 |

## Prioritate 3: ghidurile (`src/data/guides.ts`, `CLINICAL_GUIDES`)

### g1 „Tamoxifen și efectele secundare” — REZOLVAT (2026-10-08): rescris ca „Tamoxifen: ce face și cum îl iei”, aprobat
| Afirmație | Stare |
|---|---|
| SERM care blochează estrogenul în țesutul mamar | DE VERIFICAT (probabil corect) |
| „5–10 ani … ATLAS … reduce recurența cu 40–50% și mortalitatea cu ~30%” | DE VERIFICAT: ATLAS s-a făcut pe cancer invaziv, nu pe DCIS; cifrele trebuie luate exact din sursă |
| CYP2D6 → endoxifen; paroxetina, fluoxetina, bupropionul de evitat | DE VERIFICAT: recenziile găsite le susțin, dar arată că efectul clinic e controversat; textul spune „reduc drastic eficacitatea” |
| venlafaxina „excelentă”, citalopram/escitalopram „alternative sigure” | DE VERIFICAT: recenziile o susțin ca alternativă cu risc mic; formularea trebuie îndulcită |
| control ginecologic anual „obligatoriu”, cu ecografie transvaginală | DE VERIFICAT: ghidurile recomandă de obicei raportarea sângerărilor, nu neapărat ecografie de rutină |
| bufeuri „până la 80% dintre paciente”; gabapentina | DE VERIFICAT |
| „Ai uitat o doză? … nu lua niciodată doză dublă” | REZOLVAT (2026-10-08): după prospectul Tamoxifen Sandoz (ANMDMR), vezi `docs/rescriere-etapa0.md`, „Prospectul citit direct” |

### g2 „Managementul bufeurilor” — REZOLVAT (2026-10-08): rescris după NAMS 2023, aprobat
| Afirmație | Stare |
|---|---|
| cauza: termoreglarea din hipotalamus | DE VERIFICAT |
| straturi de haine, declanșatori (condimente, alcool, cofeină) | DE VERIFICAT (sfat general) |
| respirația ritmată „reduce frecvența și severitatea cu până la 50%” | DE VERIFICAT: cifră precisă fără sursă |

### g3 „Protocolul de control” — REZOLVAT (2026-10-08): rescris după NICE NG101 și ESMO 2024, aprobat
| Afirmație | Stare |
|---|---|
| „recomandat de ESMO / NCCN” | DE VERIFICAT: atribuire directă unor societăți |
| control la 6 luni în primii 2–3 ani, apoi anual | DE VERIFICAT |
| mamografie și/sau RMN anual; „ecografie transvaginală anuală” | DE VERIFICAT (vezi g1) |

## Prioritate 4: verificarea interacțiunilor (`src/lib/interactions.ts`) — REZOLVAT (2026-10-08): rescrisă din RCP și surse publice, aprobată și afișată în Ghiduri → Medicamente

### Starea inițială (nefolosită în aplicație)
Toate cele 11 intrări sunt DE VERIFICAT. De urmărit în special:
- **grepfrut**: marcat „Contraindicație: evită complet”. De verificat în prospect cât de puternică e de fapt interacțiunea.
- **paroxetina, fluoxetina, bupropionul**: marcate „Contraindicație majoră”. Sursele vorbesc de „de evitat dacă se poate”, iar datele clinice sunt contradictorii. „Reduce endoxifenul cu până la 70%” e o cifră fără sursă.
- **venlafaxina**: „prima linie … recomandată de NCCN/ASCO” e o atribuire fără sursă.
- **vitamina D**: „40–60 ng/ml este recomandat” e o valoare-țintă fără sursă.
- **magneziu, D3+K2**: marcate „Recomandat & Benefic”. Sunt recomandări de suplimente, nu interacțiuni.
- **gheara diavolului / curcumina**: „ușor efect antiplachetar” e o afirmație fără sursă.

## Prioritate 5: rețetele (`src/data/recipes.ts`, fila Ghiduri → Nutriție) — REZOLVAT (2026-10-08): idei de mese fără afirmații terapeutice; infuzia de salvie scoasă; scoase și atribuirile neverificate (Breast Cancer UK, WCRF, PCRM)
Fiecare rețetă are „Sursă: General”, adică nicio sursă. Afirmațiile de sănătate sunt DE VERIFICAT, iar unele sunt formulate ca efecte terapeutice:
- in: „efect anti-estrogenic la nivelul receptorilor mamari”; ovăz: „leagă metaboliții estrogenici din bilă”;
- zmeură: „acid elagic antitumoral”; broccoli: „faza a II-a de detoxifiere hepatică”;
- Omega-3: „ameliorând durerile articulare cauzate de Tamoxifen”;
- ghimbir: „combate greața … reduce rigiditatea articulară”;
- salvie: „Elixir Antibufeuri … planta de referință … reglarea centrului hipotalamic”;
- ou: „colină … regenerarea ficatului în timpul metabolizării Tamoxifenului”;
- maia: „reducând balonarea asociată cu modificările hormonale”;
- smoothie: „recomandat frecvent în comunitățile de paciente pentru oboseala cronică”.

Propunere pentru pasul 2: rețetele rămân ca idei de mese echilibrate, fără afirmații terapeutice, iar salvia trece prin verificarea interacțiunilor înainte de a fi recomandată.

## Prioritate 6: alte ecrane — REZOLVAT (2026-10-08): respirație, ancorare, pornire, persoana de sprijin, semnalele de alarmă și alerta din jurnal
| Fișier | Text | Stare |
|---|---|---|
| `BreathingModal.tsx:73` | „Validat clinic pentru calmarea rapidă a bufeurilor și reducerea stimulului adrenergic.” | DE VERIFICAT: „validat clinic” fără sursă |
| `GroundingModal.tsx:190` | „Ai redus ritmul cardiac …” | DE VERIFICAT: afirmă un efect fiziologic; mai sigur „Ți-ai oferit un moment de respiro” |
| `OnboardingModal.tsx:163` | „Recomandare clinică: aceeași oră în fiecare dimineață pentru nivel sanguin constant.” | DE VERIFICAT: prospectul cere probabil aceeași oră, nu neapărat dimineața |
| `OnboardingModal.tsx:118`, `SupporterModal.tsx:51`, `pdfGenerator.ts:48` | „Tamoxifen 20mg” scris fix | GREȘIT pentru pacientele cu altă doză (ex. 5 mg); doza trebuie luată din profil |
| `RedFlagsModal.tsx` | TVP (umflare unilaterală → medic imediat), TEP (sufocare bruscă → 112), sângerare vaginală → medic, tulburări vizuale → oftalmolog | DE VERIFICAT în prospect; direcția e corectă (simptomele severe trimit la medic sau la 112) |
| `JournalTab.tsx` | prag „simptom sever” = intensitate ≥ 4 din 5 | DE VERIFICAT: prag ales arbitrar, fără sursă |
| `TreatmentTab.tsx`, `DoctorVisitModal.tsx`, `EditProfileModal.tsx` | etichete, câmpuri, procent de aderență calculat | NU E MEDICAL |

## Surse folosite până acum
- *Low-Dose Tamoxifen in Noninvasive Breast Neoplasia: Long-Term Results From an Individual-Participant Data Pooled Analysis*, JCO 2026, https://ascopubs.org/doi/10.1200/JCO-26-00841 (rezumat în ASCO Post: https://ascopost.com/news/june-2026/low-dose-tamoxifen-in-noninvasive-breast-neoplasia)
- Danielsson O. și colab., *Tamoxifen therapy benefit in luminal A and B breast cancer with 20-year follow-up*, JNCI 2026;118:1248–1256, https://doi.org/10.1093/jnci/djag049 și editorialul https://doi.org/10.1093/jnci/djag126
- Massachusetts General Hospital Center for Women's Mental Health, *Clinical Update 2019: Tamoxifen and Antidepressants*, https://womensmentalhealth.org/posts/clinical-update-2019-tamoxifen-and-antidepressants/ (recenzie, nu ghid oficial)

## Următorul pas (pasul 2)
1. Repar întâi **raportul PDF** (prioritatea 1): doza din profil, aderența descrisă după procentul real, fără rânduri „Negativ/Neraportat” pentru lucruri pe care aplicația nu le întreabă. Asta nu cere text medical nou, doar scoate afirmațiile false.
2. Rescriu „Noutăți” și ghidurile din sursele oficiale (prospectul aprobat în România, ghidurile ESMO/NCCN pentru pacienți) și ți le arăt spre aprobare.
