# NASA Space Apps 2026 — AgroSat Uzbekistan: Project Submission Draft (ENGLISH)
**Status (15 Nov 2026): LOCAL APP/SLIDES VERIFIED; PUBLIC HOSTING AND NASA SUBMISSION NOT CONFIRMED. Replace [PUBLIC ...] placeholders BEFORE submission.**
Challenge: Field Shift: Adapting Farms with NASA Data.
Event: Universal Event. Confirm the two actual registered participants appear in the SAME event and team, with required guardian registration for any under-18 participant. Do NOT publish minor names, voices or identifiable photographs in the demo slides.

## Project title
AgroSat Uzbekistan — Explainable Crop Rotation Decisions Using NASA Data

## High-level summary
AgroSat helps farmers in Khorezm, Uzbekistan explore three wheat–cotton rotation pathways using 26 years of NASA climate observations, crop-science literature and optional field inputs. It checks historical heat/frost exposure, irrigation uncertainty, crop-stage chronology and six qualitative tradeoffs without inventing yields, profits, soil salinity or water savings.

## The problem
In irrigated Khorezm near the lower Amu Darya, crop choices depend on canal irrigation, soil salinity, drainage, available machinery and short seasonal windows. Leaving land fallow after wheat may miss an opportunity for a short-season crop, but adding a crop without water or an achievable calendar can create serious risk. General satellite climate layers cannot determine a farm's measured salinity or the water actually delivered from an irrigation canal.

## Our solution
AgroSat is a three-language (English, Russian, Uzbek) React/FastAPI research dashboard that:
1. Loads original NASA-derived daily precipitation and daily air-temperature files for 2000–2025 near Urgench, Khorezm (41.55°N, 60.62°E).
2. Shows monthly/annual precipitation, annual extremes (Tmax≥40°C; Tmin≤0°C) and 75-day historical exposure for user-selected mung bean sowing dates.
3. Compares (A) wheat–fallow–cotton; (B) wheat–mung bean–cotton; (C) wheat–mung bean–winter pea green manure–cotton. Scenario A is an illustrative reference, **not** necessarily the farmer's actual rotation. Option B is a research-derived alternative, **not** an additional measured arm of the same 2023 trial.
4. Accepts user-entered water access, salinity category, machinery and priorities; optionally accepts structured actual crop stages, dates, reported/recorded irrigation in m³/ha, soil ECe (dS/m), pH and data provenance.
   The farmer-first interface asks three accessible questions one at a time and distinguishes no irrigation (high water risk) from limited irrigation (water risk), rather than automatically recommending a crop.
5. Performs chronology checks: a separate winter-pea stage must follow mung bean harvest and finish before the next cotton sowing. The labels distinguish missing dates, conflicting dates, merely chronological order and cultivar-duration review. Chronological order never proves agronomic suitability.
6. Explains six dimensions (water, living cover, nutrients, pests/diseases, labour/machinery, market) and identifies unknowns with hyperlinks to NASA, ICARDA and FAO.

## NASA Earth observation datasets actually used
1. **GPM/IMERG precipitation delivered via NASA POWER**: NASA POWER Daily API v2.10.3 parameter `IMERG_PRECTOT`, sources `IMERG`, UTC 2000-01-01 through 2025-12-31, 9,497 daily values at the chosen regional point; units mm/day. The annual total for 2025 is **94.47 mm**, calculated from these files. We did **not** separately download GPM IMERG granules from GES DISC.
2. **NASA POWER temperature**: `T2M_MAX` and `T2M_MIN` (with `T2M` present), sources `MERRA2/POWER`, degrees Celsius, same coordinates/UTC/time range. Historical heat and frost days are **reanalysis-derived**, not a farm thermometer or a forecast. In 2025 the chosen series counts 21 very hot days (Tmax≥40°C) and 115 days with Tmin≤0°C.
3. **NASA GIBS / MODIS regional vegetation imagery**: July and September 2025 16-day vegetation visualization. The two local PNGs are contextual regional pictures; **no numeric field NDVI, crop classification or water status is calculated** from their colours.

The original NASA JSON files are retained unchanged with SHA-256 checksums in `backend/data/NASA_SOURCES_MANIFEST.json`. Their metadata confirm API v2.10.3, UTC and coordinates [60.62,41.55,100.94]. All annual and monthly precipitation is calculated from original daily values.

## Agricultural science & local knowledge
- ICARDA's 2022 Khorezm farmer field-day report discusses the early Durdona mung bean cultivar maturing in approximately **70–75 days** after June wheat harvest. Timing, water, machinery and available labour are limiting factors. This figure is **not** valid for every mung bean cultivar.
- ICARDA/GIZ's 2023 rotation research investigates wheat–mung bean–green manure–cotton pathways, placing winter pea **after** mung bean harvest.
- FAO EcoCrop's *Vigna radiata* entry gives indicative species temperature and soil preferences; the generic FAO water-need ranges for wheat and cotton are **not measured irrigation delivery** at this farm.
- Khorezm irrigation, soil salinity and drainage are supported by published regional research. Farm-specific laboratory ECe, groundwater level and water delivery must be measured or explicitly marked unknown.

## What the demonstration proves
The software can load and process real NASA climate files, explain historical temperature/rainfall exposure, show three comparable scenarios, detect an impossible ordering of farmer-supplied crop dates, flag summer water risk when irrigation is unavailable and cite the evidence for each point. The code and data workflows are tested automatically. We do **not** claim validated yield improvement, reduced water consumption, crop-specific salinity response or actual profitability.

## Limits and next research
This is an evidence-limited educational decision support prototype, not an agronomic advisory guarantee. Before a field recommendation, obtain local variety information, actual sowing/harvest dates, irrigation timing and volume, laboratory ECe/pH and measured soil conditions. A future QA-checked MODIS MOD13Q1 / Landsat surface-reflectance NDVI analysis is possible, but has not been performed on the existing NASA GIBS images.

## Project links — REPLACE BEFORE SUBMISSION
- Live public application: [PUBLIC DEMO HTTPS URL]
- Public project/source code: [PUBLIC REPOSITORY OR FILE URL]
- Seven-slide English demonstration: [PUBLIC SLIDE URL]
All links must work in a private/incognito browser without login or access requests.

## AI disclosure (be precise)
OpenAI ChatGPT assisted research organization, source reconciliation, Python/FastAPI and React/TypeScript code drafting and review, translation drafts, test design, documentation and slide scripting. The application contains **no generative AI model, inference service or automated farm prediction**, and all NASA climate values originate in the stored NASA JSON files. Human team participants are responsible for source verification, testing, project design, decisions and final submission. Screenshots and NASA GIBS maps shown in the demonstration are not generated scientific measurements.

## Source and asset credits (public links)
- NASA Space Apps Challenge Field Shift: https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/
- NASA POWER Daily API: https://power.larc.nasa.gov/docs/services/api/temporal/daily/
- NASA POWER meteorological source methods: https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/
- NASA GPM IMERG: https://gpm.nasa.gov/data/imerg
- NASA GIBS Earthdata visualization: https://gibs.earthdata.nasa.gov/
- NASA MOD13Q1.061 product (future numerical NDVI only): https://doi.org/10.5067/MODIS/MOD13Q1.061
- ICARDA farmer field day 2022: https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8
- ICARDA/GIZ crop rotation 2023: https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588
- FAO EcoCrop Vigna radiata: https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2150
- FAO Crop Water Needs chapter: https://www.fao.org/4/s2022e/s2022e07.htm
- FAO Crop Salt Tolerance: https://www.fao.org/4/T0667E/t0667e07.htm
- Khorezm environmental science: https://www.mdpi.com/2073-4441/10/2/208
- Uzbekistan Ministry of Agriculture open data: https://gov.uz/ru/agro/pages/ochiq-ma-lumotlar-reyestri
- UI and icons: React, Vite, TypeScript, Lucide under their respective open-source licenses; backend: Python, FastAPI, Pydantic, Uvicorn, pytest; original AgroSat code MIT (see LICENSE).

## NASA submission check (15 Nov 2026)
- [ ] Both team members visibly registered and confirmed in the SAME Universal Event; parent/guardian requirements checked.
- [ ] English project title/summary/detailed explanation in the Team Project Tab.
- [ ] Challenge is Field Shift.
- [ ] Real NASA source selection and usage explained with product identifiers, dates and units.
- [ ] All third-party sources/assets and OpenAI-assisted coding disclosed.
- [ ] Public final project URL and public slide URL work without sign-in.
- [ ] Seven slides **including** title and closing slides (not 8).
- [ ] Verify correct team owner timezone, final local deadline **2026-11-15 23:59**; check Project Tab actual form.
- [ ] Explicitly click Submit for Judging, verify SUBMITTED status (a saved draft is insufficient).

Important: GitHub hosting is not mandatory; public accessibility and actual submission are separate from local quality gates. The current Team Project Tab has not been independently inspected. Do not claim that the project was submitted until its status is confirmed.
