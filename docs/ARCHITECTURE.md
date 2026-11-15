# AgroSat Architecture Decision Record — 14 Nov 2026

## Goal
Single-region educational decision-support web app. Separate presentation, input validation, authentic scientific data reading and deterministic decision rules. No embedded AI.

## Components
- **React + TypeScript** (`frontend/src/App.tsx`): collects farm inputs, presents regional climate summaries and comparisons, displays NASA GIBS maps. It does not calculate agronomic conclusions.
- **Typed API client** (`frontend/src/api.ts`): network boundary and explicit HTTP failures.
- **FastAPI** (`backend/app/main.py`): independent HTTP interface; request validation via Pydantic (`schemas.py`); configurable CORS.
- **Domain service** (`backend/app/service.py`): rules for scenario A/B/C, evidence levels, unknown values and risk flags. No React or HTTP dependency.
- **NASA repository** (`backend/app/repository.py`): reads immutable point-data JSON from NASA, checks matching dates, sentinel values and computes annual/window metrics. Cached once in-process. All annual calculations use 9497 daily keys.
- **Scientific provenance** (`backend/data/SOURCES.md`): units, spatial and temporal limits, source URLs.
- **Tests** (`backend/tests`, `frontend/scripts/browser-smoke.mjs`): mathematical regression, API, missing evidence, actual Chrome desktop/mobile.

## Request flow
`React form → typed JSON HTTP request → Pydantic validation → domain service → NASA climate repository → JSON result → React visualization`.

## Assumptions and limitations
- All historical weather is based on *one regional grid point* (41.55 N / 60.62 E), not a field boundary.
- NASA GPM/IMERG precipitation `IMERG_PRECTOT` in mm/day; NASA POWER `T2M_MAX/MIN` in °C. These are gridded/reanalysis products, not directly measured local canal flow.
- 75 days is an illustrative duration, NOT a phenological calibration for each mung bean variety.
- Historical temperature exposure is not a predictive probability of crop failure.
- Farmer water and soil inputs are unverified reports; unknown stays unknown.
- No yields, monetary returns or actual irrigation volumes are computed.
- Qualitative published research is attributed, not converted into invented numerical crop effects.
- All output should be reviewed by the student before presentation.

## Nonfunctional requirements
- Strict schema validation and explicit HTTP errors; no silent fallback to fabricated data.
- Original data copied unchanged; SHA verification can be added in a release manifest.
- Public repository must exclude archive backups and secrets.
- Development CORS restricted to localhost; production permitted origins must be configured.
- No database, authentication, or field-level personally identifying information in the contest MVP.

## Hosting
A public React build needs a static frontend host; FastAPI requires a separate Python host. Optional `render.yaml` provisions a Python webservice. Frontend `VITE_API_URL` and backend `CORS_ORIGINS` must match HTTPS domains.

## Planned enhancements after MVP
- Authenticated, documented extraction of numeric MODIS NDVI with quality flags.
- Spatial support for confirmed parcel boundaries and local ECe testing.
- Independent ETo/crop-water model validation, local agronomic measurements and fair revenue comparisons.
- Multi-season uncertainty quantification and field trial protocol.

## Multilingual design (2026-11-14)
- The Python science service outputs stable explanation codes alongside backward-compatible English API texts.
- `frontend/src/i18n/ui.ts`, `science.ts`, `impact.ts` contain English, Russian, and Uzbek translations, checked for matching keys and interpolation placeholders.
- `frontend/src/i18n/index.ts` is the only translation access module; English is always the default, with no stored browser preference.
- React translation is pure: switching language never changes farm input values, NASA source data or Python scientific decisions.
- `frontend/src/components/ImpactDetails.tsx` renders six qualitative impact factors with no scores.
- `backend/app/impact.py` implements those factors independently of the presentation code.
- Backend `repository.monthly_summary` creates 12 genuine NASA IMERG precipitation totals per year; frontend bars show these, not mocked values.

## Verification evidence
- `backend/data/NASA_SOURCES_MANIFEST.json` pins raw NASA source checksums.
- `backend/tests/test_dataset_integrity.py` guards temporal continuity, data quality, hashes.
- `frontend/scripts/i18n-check.mjs` checks translation completeness.
- `frontend/scripts/api-catalog-check.mjs` checks translated reason codes on actual API responses.
- `frontend/scripts/browser-smoke.mjs` checks three languages, responsive UI, MODIS, changing farm inputs and browser errors in Chrome.
- `check_all.ps1` orchestrates all local checks.
