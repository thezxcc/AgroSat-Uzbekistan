# AgroSat UI/UX V2 — Design Architecture

Date: 2026-11-14. Branch: `design-v2`. **No Python science logic or raw NASA source data modified.**

## Intent

The visual direction combines a readable agricultural dashboard with a restrained satellite-command-center aesthetic. It is inspired by the references supplied by the user, but the finished UI uses real AgroSat numbers, NASA GIBS imagery and honest source labels — not the fictitious fields, water-demand scores or NDVI badges present in decorative mockups.

## Two compatible themes

The design is built from CSS custom properties in `frontend/src/App.css`, not one-off recoloring. Most UI elements use the same semantic tokens in both themes.

| Token | Light — milk/sage | Dark — deep blue/green |
|---|---|---|
| `--canvas` | `#f1f4ee` | `#071b20` |
| `--surface` | `#fffefa` | `#102b31` |
| `--text` | `#1a342b` | `#e6f5ee` |
| `--accent` | `#1e7453` | `#44d9a2` |
| `--muted` | `#627a6d` | `#aec8bd` |
| `--line` | `#dce8dd` | `#284b50` |

System defaults: **English** every fresh page visit; **light** theme on first visit. The chosen theme persists via `localStorage('agrosat-color-theme')`; language switching never changes the theme. The theme toggle is labeled and has `aria-pressed`.

## Content hierarchy

1. Desktop sidebar: overview, rotation comparison, NASA satellite imagery, methods/sources. On mobile, top tabs remain available.
2. Top bar: location/region, challenge link, language selector and Light/Dark toggle.
3. Hero: real NASA MODIS GIBS July 2025 map, captioned as a *regional NDVI visualization, not a field-specific numerical value*; short explanation and functional link to satellite images.
4. Plain-language three-step tutorial.
5. Real NASA GPM/IMERG & POWER status, climate cards, 12-month precipitation chart and source links.
6. Farm input form and evidence-aware comparison.
7. New **six-factor A/B/C evidence matrix**. No invented recommendation score. Status colors represent unknown / conditional / risk; source and individual limitations remain in detailed cards.
8. Source trace, paper links, unknown measurements and scientific disclaimer.

## UI patterns

- Rounded 9–22px panels with subtle depth; no flickering animation.
- Dark theme uses accent glow only for meaningful active states, not misleading weather heatmaps.
- Responsive breakpoint at 1080px hides sidebar and uses existing tabs; smaller screens stack hero and crop cards.
- Supports 320px/390px viewport widths without document-level horizontal overflow; the matrix itself can scroll horizontally.
- Includes `prefers-reduced-motion` handling and visible keyboard focus rings.
- Do not use official NASA logo or imply sponsorship. Branding is AgroSat's own leaf/satellite mark.

## Scientific commitments retained

- Backend FastAPI and original NASA JSON remain the source of truth.
- Regional NASA MODIS image is explicitly attributed. No claim of exact farm boundary, actual crop species, yield, profitability, farm-specific soil salinity, or delivered canal irrigation.
- No "AI-powered prediction" wording: ChatGPT assisted implementation, but there is no embedded model.
- No unsourced numerical "85% suitability" cards or fictional evapotranspiration measurements.

## Verification

Local gate: `D:\AgroSat\check_all.ps1`.
- Python scientific API regression tests, NASA SHA-256 hashes and date continuity.
- TypeScript build/lint; three-language translation checks.
- Chrome browser scenarios across EN/RU/UZ and custom farmer inputs.
- Light/dark switch, persistence, contrast and mobile 390px/320px.
- Real A/B/C six-factor matrix matches backend evidence status.

## Out of scope

Live satellite feeds, field-level NDVI extraction/QA, numerical soil moisture, yields and profit forecasts remain future **science** stages, not visual decoration. Public hosting, GitHub push and submission are excluded until separately authorized.
