# Data sources, scientific references and credits

**AgroSat Uzbekistan — NASA Space Apps Challenge 2026**

This document identifies the **actual data inputs**, the **research used for scenario assumptions**, and the **limits of each source**. A linked publication does not prove an unmeasured effect for a particular farm.

## 1. NASA datasets integrated into the software

| ID | Original input | Location and temporal scope | Method / use |
|---|---|---|---|
| `nasa_imerg` | `backend/data/NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json` | 41.55° N, 60.62° E; 2000-01-01 to 2025-12-31, 9,497 days | `IMERG_PRECTOT`, mm/day, accessed through NASA POWER daily point API, source GPM/IMERG |
| `nasa_power` | `backend/data/NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json` | Same regional point, dates, 9,497 days | `T2M`, `T2M_MAX`, `T2M_MIN` in °C, NASA POWER/MERRA-2-derived temperature |
| Visual only | `frontend/public/imagery/modis_2025_july.png` and `modis_2025_september.png` | Regional images for 2025 | NASA GIBS MODIS vegetation visualization. **No numeric NDVI, soil moisture or crop classification** is extracted |

Original JSON file hashes and acquisition metadata: [NASA_SOURCES_MANIFEST.json](../backend/data/NASA_SOURCES_MANIFEST.json).

- [NASA POWER](https://power.larc.nasa.gov/)
- [NASA POWER — Daily API documentation](https://power.larc.nasa.gov/docs/services/api/temporal/daily/)
- [NASA POWER — meteorological data sources (including IMERG)](https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/)
- [NASA GPM — IMERG precipitation](https://gpm.nasa.gov/data/imerg)
- [NASA Earthdata GIBS](https://gibs.earthdata.nasa.gov/)

**Interpretation:** Gridded satellite/reanalysis data are regional context, not field-level irrigation delivery, measured soil ECe, a yield model or a weather forecast. The project has **not** separately downloaded native IMERG granules from GES DISC. The GIBS images are not quantitative NDVI products.

## 2. Crop and regional research

| Source | How used | Boundary |
|---|---|---|
| [ICARDA / CGIAR 2022 Khorezm field-day report](https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8) | Example of Durdona mung bean after wheat, reported ~70–75-day maturity | Variety- and management-specific: not a universal growing period |
| [ICARDA / GIZ 2023 rotation research](https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588) | Regional wheat–mung bean–green manure–cotton sequence; winter pea follows mung bean | Not proof that all options were measured as arms of one experiment, nor guaranteed soil improvement |
| [FAO EcoCrop — `Vigna radiata`](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2150) | Species-level temperature and pH reference ranges | These do not automatically describe the Durdona variety or any specific Khorezm field |
| [FAO — Crop water needs](https://www.fao.org/4/s2022e/s2022e07.htm) | Indicative whole-season evapotranspiration reference ranges for wheat/cotton | Not actual local irrigation supply |
| [FAO — Crop salt tolerance](https://www.fao.org/4/T0667E/t0667e07.htm) | Historical literature thresholds for particular crops | Not a measured salinity classification for an unknown field |
| [Water (2018) — Khorezm environmental research](https://www.mdpi.com/2073-4441/10/2/208) | Published soil salinity, drainage and irrigation context | Regional results, not a laboratory result for the user |
| [Uzbekistan Ministry of Agriculture — open data registry](https://gov.uz/ru/agro/pages/ochiq-ma-lumotlar-reyestri) | Context about accessible public agricultural datasets | This prototype does not assert integrated government field-specific measurements |

## 3. Source-to-claim map

| Claim / functionality | Basis |
|---|---|
| Historical precipitation, 2025 regional total 94.47 mm | Original `nasa_imerg` daily NASA POWER point JSON |
| Historical hot/frost exposure and 75-day windows | Original `nasa_power` temperature JSON |
| A: wheat → fallow → cotton | **Illustrative reference scenario** — not the farmer's documented current rotation |
| B: wheat → mung bean → cotton | 2022 ICARDA post-wheat mung bean evidence; conditional research scenario |
| C: wheat → mung bean → winter pea → cotton | 2023 ICARDA/GIZ rotation description; **winter stage separately checked** |
| Irrigation status, salinity category, machinery, field soil metrics | User-entered and source-labelled values; **not independently verified** |
| Possible benefits, warnings, missing information | Qualitative rule-based assessments; **no numerical yield, water savings or profit predictions** |

Additional detail: [SOURCE_TRACEABILITY.md](SOURCE_TRACEABILITY.md), [backend evidence registry](../backend/app/evidence.py) and [crop reference registry](../backend/app/crops.py).

## 4. Visuals, software and attribution

- **NASA GIBS imagery:** the two MODIS regional images shown in the website; original data/service credit to NASA Earthdata/GIBS. Contextual illustrations are not derived field measurements.
- **Crop and rotation illustrations:** custom SVG artwork in `frontend/public/illustrations/` used as explanatory visuals, not NASA raster products or scientific charts.
- **Project screenshots:** captured from the actual AgroSat frontend and provided under `docs/images/`.
- **UI:** [React](https://react.dev/), [Vite](https://vite.dev/), [TypeScript](https://www.typescriptlang.org/), [Lucide icons](https://lucide.dev/).
- **API and tests:** [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://docs.pydantic.dev/), [pytest](https://docs.pytest.org/), Playwright/Chrome-based browser test scripts.
- **Original source code:** [MIT License](../LICENSE). External imagery, publications and datasets retain their own licenses and attribution requirements.

## 5. AI assistance and scientific transparency

OpenAI ChatGPT supported source organization, code drafting/review, tests, language drafts, docs and presentation work. **The running AgroSat application contains no generative AI prediction model** and sends no farmer inputs to a generative AI model. All climate numbers are read from the stored NASA files.

This prototype is for **exploration and education**. It has not conducted a validated field trial, calibrated each crop variety or measured changes in farm profitability, soil organic matter or irrigation demand. Historical patterns are not predictions of future outcomes.

**Official challenge:** [NASA Space Apps 2026 — Field Shift](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/).
