# AgroSat Uzbekistan — Local PASS Report

**14 November 2026 — competition development on the local authorized PC**  
**Code location:** `D:\AgroSat`  
**Git:** local branch `main`. No remote origin, no GitHub push, no NASA submission.

## Tested and PASS
- Python / FastAPI: **35 of 35 automated tests**.
- NASA source integrity: original SHA-256 values checked for two genuine NASA POWER point API JSON files. **9,497 dates (2000–2025)**, no missing precipitation, no missing min/max temperatures, no inverted minimum/maximum.
- Regression value: **NASA GPM/IMERG-derived 2025 precipitation 94.47 mm** (regional estimate near Urgench; NOT irrigation delivery).
- Frontend React/TypeScript: **production build PASS**, **lint 0 warnings / 0 errors**.
- English, Russian, Uzbek: **651 localized message instances** checked, keys and format placeholders align.
- Live scientific API: **7 scenarios**, **1,065 localized explanation references** checked.
- Automated Google Chrome: **English default**, switching to Russian and Uzbek, localized scientific messages, actual 12-month GPM chart, real NASA data, user-supplied rotation, warning when no water, visible MODIS imagery, mobile width 390px without overflow, **0 JavaScript errors**.
- Entire suite: `.\check_all.ps1` printed **ALL LOCAL AGROSAT QUALITY GATES: PASS**.

## What is NOT included in local PASS
- Actual field-level validation, calibrated crop yields or economic outcomes: **not performed**.
- Fully calibrated soil water balance, detailed pest forecasting or numeric soil salinity mapping: **not implemented**.
- A review of the translations by a native Uzbek-language agronomist: **recommended, not performed**.
- Hosting the Python API and static React frontend over public HTTPS: **pending**.
- GitHub remote push, public repository and NASA Space Apps project submission: **pending by user's instruction**.

## Science scope
Three research scenarios A (wheat–fallow–cotton), B (wheat–mung bean–cotton) and C (wheat–mung bean–green manure–cotton). The existing farm rotation can be provided as free text, but impacts remain **unknown** without structured crop and field measurements. Six qualitative dimensions represent conditional evidence and missing measurements, not verified numerical scores.

References to local soil conditions, savings, income and potential yield must be evidence-limited. Missing values are shown as unknown. No generative AI is embedded in the website; ChatGPT helped author code, tests and documentation and is disclosed.

## Student verification before submission
Open `http://127.0.0.1:5173`. Use the three-language switcher. Change irrigation to *none*, compare and inspect water risk. Enter a custom rotation to see a non-validated baseline. Read sources and scientific limitations. Check the project in a real browser and explain NASA POWER versus GPM IMERG to the judges. Then review public hosting and the NASA Project Tab separately.

## New evidence trail (same day)
- `GET /api/evidence` provides a source registry with NASA GPM/IMERG via POWER, NASA POWER temperature, the ICARDA 2022 mung bean field demonstration, ICARDA/GIZ 2023 rotation research, and unverified user inputs.
- Every rotation carries explicit `source_ids`; custom user baselines cite only user input, **not** an ICARDA experiment.
- React provides three-language expandable source evidence and links under the rainfall chart and rotations.
- Evidence checks added: source IDs, custom farmer baseline, official NASA resource families, publication links, and real Chrome behavior.
- All local quality gates repeated after these changes and passed.
- Scientific details and precise evidence limits: `docs/SOURCE_TRACEABILITY.md`.

## Design V2 local PASS (2026-11-14)
- The requested milk/sage light and deep-blue/green dark dashboard themes are implemented in the React frontend. The theme toggle is independent of the EN/RU/UZ switch, with English as the default on fresh visits.
- The hero displays **genuine** NASA GIBS vegetation visualization, not fabricated field NDVI values.
- Scientific results include an immediate three-option A/B/C matrix across six qualitative factors, with no invented scores.
- Full local quality gate: 35 Python tests, 702 translation instances, 7 live API scenarios, Chrome theme persistence/responsiveness and scientific comparisons, and 0 browser JavaScript errors — **PASS**.
- Detailed report: `docs/DESIGN_V2_PASS_REPORT.md`. GitHub publishing and NASA submission are still pending.

## Current jury-first UX iteration — complete local gate

The existing dashboard was refined rather than rebuilt. Comparison A/B/C is visible in the first desktop viewport, real NASA dates and precipitation remain on screen, result cards offer direct links to scientific evidence, and all three languages plus light/dark themes work. The new Chrome jury-path automation verifies navigation, inputs, six factors, source links, responsive layout and absence of JavaScript errors. Latest results: **35 Python tests**, **735 translation checks**, **7 API scenarios**, and three browser flows **PASS**. Details: `docs/JURY_UX_POLISH.md` and `docs/JURY_UX_PASS_REPORT.md`.
