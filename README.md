# AgroSat Uzbekistan — NASA Space Apps 2026

**Challenge:** [Field Shift: Adapting Farms with NASA Data](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/)

AgroSat is an educational, explainable crop rotation comparison prototype for a pilot climate point near Urgench, Khorezm (41.55°N, 60.62°E). It uses **authentic NASA GPM/IMERG and POWER series** with farmer-entered constraints; no embedded generative AI is used.

## Architecture

```
D:\AgroSat
├─ backend/
│  ├─ app/
│  │  ├─ main.py            HTTP API and validation boundary (FastAPI)
│  │  ├─ schemas.py         Pydantic request/response contracts
│  │  ├─ repository.py      Immutable NASA data parsing/quality checks
│  │  ├─ service.py         Explainable rotation comparison logic
│  │  ├─ impact.py          Qualitative six-factor assessments
│  │  └─ evidence.py        Reference catalog and source IDs
│  ├─ data/                 Original NASA JSON and provenance
│  ├─ tests/                Automated scientific checks (pytest)
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx            Frontend orchestration and safe asynchronous API state
│  │  ├─ components/        Reusable UI, rotations, Khorezm science and references
│  │  ├─ styles/            Foundation, comparison and responsive jury polish
│  │  ├─ scienceText.ts     Central scientific-code localization
│  │  ├─ api.ts             Typed API client
│  │  └─ types.ts           Frontend data contracts
│  └─ public/imagery/       Original NASA GIBS map visualizations
├─ research/                Preparatory materials (gitignored)
├─ start_backend.ps1
├─ start_frontend.ps1
└─ start_local.ps1
```

The backend is the single authority for NASA data and scientific decisions; the frontend does not implement a competing scientific model.

## Local development (Windows PowerShell)

Prerequisites: Python 3.12+ and Node 22+.

```powershell
cd D:\AgroSat
py -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
cd frontend
npm.cmd install
cd ..
.\start_local.ps1
```

Open **http://127.0.0.1:5173**. API docs: http://127.0.0.1:8000/docs.

For manual startup in separate PowerShell windows:

```powershell
cd D:\AgroSat
.\start_backend.ps1
```

```powershell
cd D:\AgroSat
.\start_frontend.ps1
```

Run automated checks:

```powershell
cd D:\AgroSat\backend
.\.venv\Scripts\python.exe -m pytest -q
cd ..\frontend
npm.cmd run build
npm.cmd run lint
```

## API

- `GET /api/health` — data readiness and observation count.
- `GET /api/climate/{year}` — real annual NASA precipitation, extreme-heat and frost counts.
- `POST /api/compare` — illustrative 75-day crop window + A/B/C comparison with uncertainties.
- `GET /api/sources` — core provenance URLs.

Climate figures are calculated from source data, not hardcoded. The **NASA IMERG 2025 annual sum = 94.47 mm** is an automated regression test.

## Scientific integrity

- We compare **A** wheat → fallow → cotton, **B** wheat → mung bean → cotton and **C** wheat → mung bean → green manure → cotton.
- A is a *hypothetical regional research baseline*, not necessarily the user's current rotation.
- The form allows an arbitrary farmer-supplied current rotation without asserting its quantitative outcomes.
- B is a research alternative; do not imply the same published study measured all three equally.
- Missing laboratory salinity, soil properties, irrigation supply or yield are shown as **unknown**, never estimated from a satellite climate cell.
- 75-day crop development is a simplified assumption, not a cultivar-calibrated phenology model.
- No claims of yield gains, profits, or percentage water savings are generated without measured evidence.
- Satellite precipitation is **not** water delivered through irrigation channels.
- MODIS NASA GIBS PNGs are contextual visualizations, not calibrated numeric NDVI raster data.

Primary public sources: [NASA GPM/IMERG](https://gpm.nasa.gov/data/imerg), [NASA POWER](https://power.larc.nasa.gov/), [NASA Earthdata](https://earthdata.nasa.gov/), [ICARDA](https://repo.mel.cgiar.org/), [FAO](https://www.fao.org/land-water/).

## AI disclosure

ChatGPT (OpenAI) was used as a development assistant for TypeScript, Python, testing, project documentation and code review. No generative AI service is called from this application. All outputs and scientific claims require human review.

## Publishing

GitHub Pages is suitable for the static React build **but does not run Python**. A public demo therefore requires a separate FastAPI host (e.g. Render, Fly.io or another Python-capable provider) and `VITE_API_URL` pointing to its HTTPS API endpoint. API CORS must allow the exact deployed frontend origin. Do **not** push secrets or any private files. Configure both services and verify public requests before submitting.

The official NASA project submission and proof of publication remain separate actions and have **not yet been performed**.

License for original project source: MIT (see LICENSE). Dataset and imagery terms remain with their original providers.

## Multilingual interface
The website starts in **English on every fresh visit**. Use the top-right language selector to switch to **Русский** or **O‘zbekcha (Latin script)**. Translation covers the form, climate data, graphs, six agronomic comparison factors, scientific reasons, sources, glossary and errors; the Python API returns stable reason codes so scientific calculations do not depend on language.

## Extra NASA-specific decision criteria
Each rotation has a qualitative, evidence-limited analysis of:
1. irrigation and water risk;
2. living soil cover;
3. soil nutrients and organic residues;
4. pests and diseases;
5. field operations and machinery;
6. additional harvest and local market.

These are **conditional or unknown assessments**, never fabricated scores. For a user-entered current rotation the system does not infer details from unstructured text and marks the dimensions unknown.

## Complete local checks
After starting both servers using `.\start_local.ps1`, run:

```powershell
cd D:\AgroSat
.\check_all.ps1
```

The current unified quality gate verifies **93 Python scientific/API tests**, TypeScript lint and production build, **1,128 translated message instances** (English/Russian/Uzbek) and real Chrome suites covering NASA source integrity, crop calendars, water risks, delayed API requests, scientific evidence, screen widths down to 320 px, and all 18 matrix explanations. It checks that fresh visits default to English, rejects invalid rotation requests, and confirms no stale farm result can overwrite newer inputs. Local PASS is not a field-validated yield forecast or proof of NASA submission.

Review `docs/USER_GUIDE_RU.md`, `docs/ARCHITECTURE.md`, and `docs/LOCAL_PASS_REPORT.md`.

## Data integrity
The NASA input file hashes are frozen in `backend/data/NASA_SOURCES_MANIFEST.json`. The backend tests prove both files match their original SHA-256 checksums and verify 9,497 complete daily dates without missing precipitation or temperature measurements. The monthly rainfall chart is recomputed from those genuine daily values. This does **not** validate accuracy against every physical field in Khorezm.

## Source traceability inside the app
Click **Where does this assessment come from?** (RU: «Откуда взяты эти выводы?», UZ: «Bu xulosalar qayerdan olingan?») under each rotation, or the similar section beneath the rainfall graph. The citations distinguish regional NASA observations/reanalysis, ICARDA regional research and user-provided facts. Farmer-entered rotations are **not** presented as verified studies. Detailed provenance: `docs/SOURCE_TRACEABILITY.md`.

## User-selected satellite dashboard design

The `design-v2` interface uses shared semantic CSS tokens for both light (milky cream/sage) and dark (deep blue/green) themes. A theme toggle next to the language selector persists the preferred theme; English remains the default language on each fresh visit. The hero shows authentic NASA MODIS imagery **without fake field NDVI numbers**. A side-by-side six-factor matrix makes scientific uncertainty across rotations A/B/C visible.

Design documentation: `docs/DESIGN_V2.md`. Run `.\check_all.ps1` to verify both themes and scientific regression tests locally.

## NASA jury UX polish — v2.1

The homepage now places three scientifically grounded rotation previews A/B/C immediately after the NASA data status instead of burying the main function below the annual chart. Each card links to its detailed evidence and warnings; previously calculated output is marked stale when farmer inputs change. Larger typography, wider content, prominent climate units, direct Climate & rainfall navigation, accessible contrast and preserved light/dark plus EN/RU/UZ modes make the live demo easier. NASA/ICARDA citations and no-fabricated-data safeguards remain unchanged. See `docs/JURY_UX_POLISH.md` for architecture and the NASA judge demo workflow. Run `.\check_all.ps1` before any merge or deployment.

## 14 November 2026 — architecture, NASA and Khorezm scientific audit

The codebase was independently rechecked for request/response contracts, separation of concerns, input validation, failure handling, React asynchronous race conditions, scientific provenance, and supply-chain dependencies. The existing NASA JSON was not modified.

Important enhancements:
- Reject undefined rotation IDs, invalid sowing dates, unexpected API request fields, and blank farmer-specified crop rotations. Response schema validates both annual/monthly climate and evidence endpoints.
- Suppress stale API results when farm parameters change while a comparison request is in flight; support continued farm analysis if the evidence registry is unavailable. Automated Chrome race tests reproduce these cases.
- Centralize scientific explanation translation; split the former monolithic CSS into three ordered stylesheet modules.
- Add Khorezm-specific scientific context, primary ICARDA papers, Uzbek Ministry open-data registry and links to the NASA POWER methodology. Correct the calendar interpretation: winter-pea green manure is grown after mung bean harvest, **not inside** the same 75-day window.
- Expand the local quality gate to **49 Python tests, 783 EN/RU/UZ translation checks, 7 API scenarios, four Chrome suites**, TS production build and zero-warning lint.
- Research limitations remain: no measured ECe, actual irrigation volume, validated crop-specific yield/profit model, or numeric field NDVI. This is an explainable screening prototype, not a calibrated farm forecast.

Full reports:
- `docs/CODE_AND_UNIVERSAL_READINESS_AUDIT_20261114_RU.md` — architecture audit, NASA Universal and Field Shift compliance assessment, priorities and risks.
- `docs/KHOREZM_SCIENTIFIC_VERIFICATION_20261114_RU.md` — NASA POWER/IMERG provenance, ICARDA 2022/2023, Uzbekistan open data, scientific limitations.

**Universal Event:** two registered participants are required for Global Judging; the fact that this application works locally does not satisfy registration, public demonstration, NASA Project Tab, or competition submission. No GitHub origin has been linked or public deployment performed.

## 14 November evening — AgroSat science v3 / NASA jury preparation

New evidence-limited agricultural features added **without replacing original NASA inputs or the existing design**:

- User-entered, structured current crop rotation: crop names and optional actual sowing/harvest dates for up to 8 stages. The old free-text baseline remains available; unsupported agricultural impacts remain UNKNOWN.
- Chronological B/C crop calendar: wheat harvest → mung bean sowing/harvest → optional winter-pea green manure → cotton next year. Explicit states: dates missing, contradictory sequence, merely chronological sequence, cultivar duration needs review. **Chronology alone never means agronomic feasibility.**
- Optional user-origin field data: actual/reported irrigation in **m³/ha with period/source**, laboratory or reported soil ECe in **dS/m**, pH, sample date/depth; no automatic conversion from rainfall to delivered canal irrigation and no spurious cultivar yield thresholds.
- Curated four-crop reference catalog `GET /api/crops`: FAO wheat/cotton whole-season water-need ranges, FAO EcoCrop mung bean species preferences, and ICARDA's Durdona 70–75-day example. References are cited as **indicative and not site-calibrated**. No undocumented water figure is assigned to Durdona or winter pea.
- New **real 75-day IMERG precipitation exposure**: mean and historical min/max from 26 original NASA years, next to heat/frost indicators, explicitly not canal irrigation.
- Five browser smoke suites now include invalid/partial calendar, no-water risk, field measurement origin, structured baseline, source links, theme/language and mobile viewport checks. **74 Python tests / 1,017 EN-RU-UZ structural checks / 7 API scenarios / 1,233 code references — local PASS.**
- NASA Universal demo materials are prepared *locally*, not published: exact **7 English PowerPoint slides**, builder `presentation/build_slides.ps1`; actual slideshow at `artifacts/AgroSat_NASA_2026_7slides.pptx`. English Project Tab text with citation/AI-tool disclosure: `docs/NASA_SUBMISSION_DRAFT_EN_2026.md`. Documentation of potential verified additional satellite sources and limitations: `docs/SATELLITE_DATA_FEASIBILITY_20261114_RU.md`.

**Publication and NASA submission deliberately deferred to Nov 15 per team instruction.** GitHub remote and public HTTPS links remain unconfigured; NASA Project Tab still awaits team owners' actions and verification that both participants are formally registered in the same Universal Event.

## Phase 1 scientific calendar safety audit (2026-11-14)

Five additional API regressions and a dedicated Chrome scenario found and resolved a real issue: a farmer-defined rotation could hide a known date conflict behind a missing intermediate stage. The application now marks custom baseline A as `calendar-conflict` when known dates contradict one another and never displays negative mung bean growing durations. All six browser suites, 79 Python tests, 1,032 localization checks, and 1,233 live scientific-code references pass. Original NASA JSON remains unmodified. See `docs/STEPWISE_COMPLETION_ROADMAP_20261114_RU.md` for the previously agreed stages followed by optional jury enhancements, and `docs/PHASE1_SCIENCE_CALENDAR_PASS_20261114_RU.md` for the concrete failing and passing regressions.

## Phase 2 (2026-11-15) — individual FAO / ICARDA source trace for each crop metric

Wheat water 450–650 mm and cotton water 700–1300 mm are **FAO ETcrop indicative whole-season ranges**, never actual irrigation delivered. Mung bean Durdona 70–75 days is from **ICARDA Khorezm 2022**; Vigna radiata 21–36°C and soil pH 5.5–6.2 are **FAO EcoCrop species-level reference ranges**, not Durdona cultivar thresholds. Winter-pea green manure has **no fabricated seasonal water or crop duration value**. Historical FAO cotton ECe 7.7 dS/m is a **reference yield-decline onset**, not a field-specific safe cutoff.

The typed `/api/crops` output now provides `metric_source_ids` for each documented field; direct source links render alongside numeric values in EN/RU/UZ and are regression-tested in Chrome. The integrated quality gate on the active code now checks **81 Python tests, 1,035 translations, 1,233 API science references and 7 Chrome suites**, production TypeScript build and zero-warning lint. See `docs/PHASE2_CROP_EVIDENCE_PASS_20261115_RU.md` for primary URLs and explicit limits. The original NASA climate datasets remain unchanged.

## Phase 3 (2026-11-15): field data provenance and measurement consistency

The field-input audit now distinguishes **farmer estimates**, **user-reported metered irrigation**, **user-reported laboratory soil analysis**, **research example A**, and **user-supplied rotation A**, without claiming independent validation. A new typed `field_evidence` section in `/api/compare` attaches stable scientific codes and sources to soil, irrigation and rotation statements. The comparison UI displays these checks in EN/RU/UZ and highlights data that require reconciliation. A high/low salinity category is **not** derived automatically from ECe, and irrigation availability is not equated to a recorded m³/ha amount. Missing laboratory date/depth produces a review notice rather than a fabricated result.

React form validation now rejects non-finite and out-of-range field values before they can silently become `null` in JSON. The scientific climate calculations and original NASA files have **not changed**. The unified local QA gate has **92 Python tests, 1,095 translation checks, 12 live API scenarios / 2,277 localized scientific references, eight Chrome suites plus one frontend numeric-bound test**, with 0 JS errors and a clean TS build. One third-party Starlette deprecation warning remains. The Stage 3 report is `docs/PHASE3_FIELD_EVIDENCE_PASS_20261115_RU.md`; the updated roadmap is `docs/STEPWISE_COMPLETION_ROADMAP_20261114_RU.md`.
