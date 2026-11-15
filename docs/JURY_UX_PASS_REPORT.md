# AgroSat — NASA Jury UX Polish LOCAL PASS

Date: 2026-11-14. Authorized PC: `D:\AgroSat`.
This report supersedes the earlier UI-only pass count for the latest frontend iteration.

## Delivery
- Premium AgriTech × NASA Earth Intelligence visual style **preserved** in milky light mode and deep teal/navy dark mode.
- More readable titles, crop scenario labels, source references, chart labels and metric figures.
- Workspace expanded up to 1900px; sidebar balanced at 224px.
- One-click navigation to Climate & rainfall.
- NASA status with real 9,497 daily records, 2000–2025 period and actual chosen-year IMERG precipitation in mm.
- First-screen A/B/C rotation preview cards, showing one grounded advantage/context and one meaningful limitation, with a working evidence-detail button.
- Changed farmer inputs hide stale previews until a new comparison is computed.
- The complete scientific API output, qualitative 6-factor matrix, source links and unknowns are still present.
- Daily NASA datasets in `backend/data` and backend code were **not modified**.
- Real MODIS image is used as a regional visualization; no fictional field NDVI or numerical crop scores.

## Local gate results
- Python: **35/35 tests PASS** (1 third-party Starlette/httpx deprecation warning).
- Translations: **735 entries checked across English, Russian and Uzbek**.
- Real API: **7 scenarios; 1,065 localized scientific explanation references PASS**.
- Frontend TypeScript build: **PASS**.
- Oxlint: **0 errors and 0 warnings**.
- Main Chrome smoke: **PASS** (languages, scientific comparison, data source links, historical chart, mobile).
- Theme Chrome smoke: **PASS** (light/dark, persistent preference, no data change on toggle, viewport 320/390).
- NASA jury Chrome smoke: **PASS** (first-viewport A/B/C, hero CTA, stale-result protection, water risk in B/C, evidence navigation, year switching with 12 real NASA months, Russian dark mode, Uzbek mobile, no horizontal overflow at widths 320/390/768/1024).
- JavaScript runtime errors in tested flows: **0**.
- Unified command: `D:\AgroSat\check_all.ps1` printed **ALL LOCAL AGROSAT QUALITY GATES: PASS**.

## Screenshots (local, intentionally not in Git)
- `D:\AgroSat\artifacts\jury-light-firstscreen.png`
- `D:\AgroSat\artifacts\jury-dark-ru-full.png`
- `D:\AgroSat\artifacts\jury-mobile-uz-spotlights.png`
- `D:\AgroSat\artifacts\agrosat-dark-viewport.png`

## Scientific/release boundaries
The checks establish a **working local research demonstration**. They do not establish a field-calibrated yield forecast, accuracy of numerical NDVI at a particular farm, actual irrigation amounts, fertilizer impact, or profit. Public deployment, GitHub remote and NASA submission remain undone by instruction. Specialist review of the agronomy translations is still recommended.

## Manual walkthrough
1. Open `http://127.0.0.1:5173`; observe map and NASA status.
2. Click **Compare three options**; see A/B/C immediately.
3. Scroll to farmer inputs; set irrigation to **No irrigation available**; run Compare.
4. B and C show high water risk; open the detailed evidence and source links.
5. Click sidebar **Climate & rainfall**; change year, inspect NASA dates/units and the 12-month rainfall chart.
6. Switch Light/Dark and languages; research calculations do not change.
