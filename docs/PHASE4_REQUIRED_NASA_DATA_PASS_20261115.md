# AgroSat Uzbekistan — NASA Resources Gate 4 closure (2026-11-15)

## Gate decision: PASS for REQUIRED NASA DATA USE AND SCIENTIFIC TRACEABILITY
**Not** a PASS for optional numeric SMAP/NDVI integration, live public hosting, independent field validation, or NASA submission.

### Authoritative challenge
NASA Space Apps 2026 — Field Shift: Adapting Farms with NASA Data:
https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/
The application combines NASA Earth observations, local farmer conditions, crop-science references and rotation scenarios as the challenge requests. Using *all* listed optional data products is not required.

### Actual numeric NASA inputs (local SHA-256 and daily completeness PASS)
- **NASA GPM/IMERG-derived precipitation via NASA POWER Daily API**: `IMERG_PRECTOT`, source header `IMERG`, 2000-01-01–2025-12-31 inclusive, **9,497** daily values, **mm/day**, regional point **41.55 N, 60.62 E**. Archived unmodified source: `backend/data/NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json`. SHA-256 `44d87290e75fb6a04e4869b40323741957178df3792ab9979eec91f0d04e98af`. Independently recomputed 2025 total: **94.47 mm**. It is **not** a GES DISC granule or field irrigation measurement.
- **NASA POWER temperature from MERRA-2/POWER**: `T2M`, `T2M_MAX`, `T2M_MIN`, **degrees Celsius**, same UTC daily period and coordinates. Original file: `backend/data/NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json`. SHA-256 `052a36f708949ba5ba8177eae7852709b0e0384616336a86e7011daca255aca3`. Reanalysis-derived weather is **not** field thermometer or forecast.
- **Version in stored NASA POWER JSON**: API v2.10.3 (as recorded by original file metadata). NASA POWER API documentation: https://power.larc.nasa.gov/docs/services/api/temporal/daily/ and methodology https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/ ; IMERG description https://gpm.nasa.gov/data/imerg .

### Satellite visualization and rejected numeric candidates
- NASA GIBS/MODIS regional vegetation PNGs dated July and September 2025 appear in `frontend/public/imagery/`. Source service: https://gibs.earthdata.nasa.gov/ . These are **images only**, not calibrated numerical NDVI rasters or field-level crop classifications. Pixel-level QA and extraction are not claimed.
- Archived SMAP candidate arrays for summer 2025: **92/92 missing values** in both SFMC and RZMC; rejected from numeric app use. No soil-moisture value or field inference is claimed.
- MOD13Q1.061 science raster (250 m, 16-day compositing, QA required), Landsat Collection 2 Level 2 (30 m, valid cloud mask and scaling required), ECOSTRESS and other products have **not** been integrated. Their absence does not invalidate using real NASA data already included.
- These are regional observations. Local ECe, soil chemistry, canal irrigation, crop yields, profit and measured water savings remain unknown unless entered by the user and supported by appropriate provenance.

### Independent science references
Primary crop-context references are linked and attributed in `backend/app/evidence.py`, `backend/app/crops.py`, and `docs/NASA_SUBMISSION_DRAFT_EN_2026.md`: ICARDA Khorezm 2022 and rotation research 2023; FAO EcoCrop and crop water manuals. They are contextual literature, **not** measured results of all A/B/C scenarios.

### Reproducible verification (15 Nov 2026, local Windows workstation)
- `backend/scripts/stage4_source_audit.py` -> PASS NASA hashes, metadata, 9,497 daily values and explicit SMAP rejection.
- `backend/.venv/Scripts/python.exe -m pytest -q` -> **92 passed**, one Starlette/httpx deprecation warning.
- `frontend npm run lint` -> zero errors/warnings; localization -> 1,125 message checks; `npm run build` -> PASS.
- Full `check_all.ps1` -> **ALL LOCAL AGROSAT QUALITY GATES: PASS**, including API and Chrome tests.

### Gate distinction
**Stage 4 mandatory source integrity/provenance scope: PASS.** **Additional satellite-layer integration: NOT DONE (optional future research).** This report is not a declaration of public deployment, submitted status or independently validated farm performance.
