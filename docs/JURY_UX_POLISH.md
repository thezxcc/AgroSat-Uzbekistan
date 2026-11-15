# AgroSat — NASA Jury UX Polish (local v2.1)

Date: 2026-11-14
Repository: `D:\AgroSat`
Branch: `ui-ux-jury-polish` (before merge)
Scope: Frontend layout, navigation, charts, translations and automated UI tests. **No backend science or original NASA dataset edits.**

## What changed

### Value in the first viewport
- Comparison is now the first major content block **after real NASA data readiness**.
- Main hero's primary button goes to the comparison instead of hiding it behind the rainfall chart.
- A/B/C scenario cards are displayed side-by-side on desktop, with localized titles, status, one grounded potential benefit, one limitation and functional buttons leading to detailed scientific evidence.
- If farm inputs change, the old comparison is hidden as stale until the user runs it again.
- The full evidence matrix, sources, six factors and missing measurements remain intact below the summary.

### Better readability and layout
- Expanded max content width to 1900px with responsive horizontal gutters.
- Sidebar uses 224px on large displays; navigation can jump directly to Climate & rainfall.
- Larger main titles, labels, metric numbers, chart columns, calendar year, source text, form fields and controls.
- More balanced surface spacing, reduced first-screen dead space and consistent design tokens.
- Includes a real 2025 annual NASA IMERG-derived precipitation value (94.5 mm at 1 decimal) in the top readiness bar and continues to show its selected year and millimetre units.
- Retained authentic NASA MODIS imagery, labeled as a regional visualization and **not** a field-level numeric NDVI product.

### Both themes retained
- Light: warm milky off-white, muted green and readable dark text.
- Dark: deep blue-green command-center palette, restrained cyan/green accents.
- Theme persists; language starts as English on each fresh visit; EN/RU/UZ have matching labels.
- Hover effects respect `prefers-reduced-motion`; buttons show keyboard focus.

### Preserve scientific responsibility
The website must not fabricate or imply measured farm-specific soil moisture, water savings, yield, profit, pest incidence or crop suitability scores. The A/B/C cards are derived **only** from existing FastAPI domain results (stable reason codes). Important uncertainty messages and ICARDA/NASA citations are still visible in each detailed option and the climate trace.

## Checks required before merge
- `D:\AgroSat\check_all.ps1` prints **ALL LOCAL AGROSAT QUALITY GATES: PASS**.
- Python/FastAPI scientific regression tests and NASA file hashes pass unchanged.
- Translation structural checks EN/RU/UZ and real scenario source-code localization checks pass.
- TypeScript build and zero-warning lint pass.
- Main Chrome smoke runs all languages, inputs, source tracing and imagery.
- Chrome theme smoke runs light/dark, persistence, data invariance, contrast and mobile layouts.
- New `frontend/scripts/jury-smoke.mjs` checks: A/B/C prominence in first 900px, first-screen heading, hero CTA, stale-result protection, no-irrigation alerts for B and C, six factor rows, evidence navigation, NASA source links, selected-year refresh, RU dark, UZ mobile and 320/390/768/1024px horizontal fit.
- Screenshots saved locally in `D:\AgroSat\artifacts\` (excluded from Git).

## Still NOT claimed
- Field-level calibration, quantitative MODIS NDVI extraction, real irrigation measurements or profit forecasting.
- Independent specialist review of Uzbek agronomy translations.
- Public cloud deployment, GitHub remote, or NASA submission.

## Demonstration flow
1. Open `http://127.0.0.1:5173`; English is default and light theme is selected on a fresh browser.
2. Show the real NASA MODIS screenshot and data readiness summary with dates and units.
3. Click **Compare three options**. Show A/B/C and the warnings without changing any form values.
4. Select **No irrigation available**, then click the *form* Compare button. B and C should report high water risk, not invent water availability.
5. Click **Read evidence and details** on B. Explain 6 qualitative factors, missing data and ICARDA study provenance.
6. Use the sidebar **Climate & rainfall** and select a different year to demonstrate genuine NASA daily-to-monthly recomputation.
7. Show the light/dark switch and then RU/UZ labels; end with limitations and NASA citation trace.

Local UI PASS is not equal to scientific field validation or competition submission.
