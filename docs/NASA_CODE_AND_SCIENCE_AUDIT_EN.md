# AgroSat Uzbekistan — NASA Field Shift: Scientific and Code Compliance Review

**Review date:** 15 November 2026
**Challenge:** [Field Shift: Adapting Farms with NASA Data](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/)
**Status:** Reproducible software and public project materials verified; field-level agronomic impact and the official NASA submission status **not** verified.

> This is the project's technical review, **not** a NASA judging decision, certification, or claim of field validation. Historical internal milestone reports were consolidated into English for the public submission; their original content is preserved in the local development archive.

## Executive summary

AgroSat is an explainable, multilingual research prototype for exploring wheat–cotton rotation choices in Khorezm, Uzbekistan. Its working software combines NASA precipitation and temperature histories with literature-based crop evidence and optional farmer-provided field conditions. It compares three **illustrative scenarios** and shows potential risks, missing evidence, and follow-up checks; it does not predict farm yield or promise irrigation savings.

| Challenge aspect | Software / evidence status | Important limitation |
|---|---|---|
| Interactive crop rotation decision support | **Implemented and tested** | Educational exploration, not certified agronomic advice |
| NASA Earth observation data | **Implemented and source-checked** | Regional point history, not field measurements |
| Soil conditions and irrigation | **User-entered and validated** | No independent local soil laboratory or canal records |
| Crop characteristics | **Referenced to FAO and ICARDA** | Cultivar- and season-specific applicability varies |
| Farmer priorities and trade-offs | **Three-question flow plus detailed inputs** | Qualitative comparison, no universal winner |
| English / Uzbek / Russian interface | **Implemented and checked** | No independent farmer comprehension study |
| Public reproducible code and PDF slides | **Published and checked** | No independently hosted HTTPS application |
| Official NASA Project Tab submission | **Unverified** | Must be confirmed by the team in their NASA account |

## NASA datasets actually used

The project stores source JSON extracted from the **NASA POWER Daily API**, at **41.55° N, 60.62° E** near Urgench, for **1 January 2000 through 31 December 2025**: **9,497 daily dates**.

1. **GPM / IMERG precipitation**, parameter `IMERG_PRECTOT` delivered through NASA POWER, mm/day. The prototype computes regional daily, monthly and annual rainfall summaries. The archived 2025 total is **94.47 mm**.
2. **NASA POWER temperature**, parameters `T2M`, `T2M_MAX`, `T2M_MIN`, in degrees Celsius. These support historical extreme-heat, frost and 75-day planting-window comparisons. Temperature is reanalysis/model based, not a direct field thermometer.
3. **NASA GIBS / MODIS imagery**, included as two regional 2025 raster visualizations. Imagery is **visual context**, not quantitative field NDVI, crop classification, salinity or soil-moisture measurement.

The original JSON contents and checksums are preserved in [the NASA source manifest](../backend/data/NASA_SOURCES_MANIFEST.json). The application calculates climate metrics from these stored records. We did **not** download original native IMERG granules from GES DISC, and we do **not** compute a numerical NDVI product from the GIBS screenshots.

See [Data Sources and Credits](DATA_SOURCES_AND_CREDITS.md), [Source Traceability](SOURCE_TRACEABILITY.md) and [NASA resource methods](https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/).

## Crop rotation evidence and modelling boundaries

- **A: Wheat → fallow → cotton**. An illustrative reference case, *not* a documented real-world baseline and *not* automatically the best strategy.
- **B: Wheat → mung bean → cotton**. A possible additional crop, conditioned on irrigation and realistic planting windows. The cited ICARDA Khorezm **Durdona** example is about **70–75 days**, not a universal maturity estimate for all mung bean varieties.
- **C: Wheat → mung bean → winter pea (green manure) → cotton**. A separate winter pea stage follows mung bean and must finish before the next cotton season; it adds irrigation, operations, and crop calendar constraints.

The three scenarios are **not presented as three measured arms of a single controlled experiment**. FAO crop reference ranges and ICARDA regional work inform explanatory text. Farmer irrigation delivery, actual soil ECe/pH, pests, machinery and market conditions are not remotely measured.

## Software architecture and reproducibility

- **Frontend:** React, TypeScript, Vite, language dictionaries for English / Uzbek / Russian, responsive layout and accessible explanations.
- **Backend:** Python, FastAPI, Pydantic, input validation, cached NASA JSON parsing and rule-based qualitative comparison.
- **Data authority:** the backend provides scientific results; the UI displays explanations and translations.
- **Deployment for reviewers:** [Quick Start](../QUICKSTART.md), `docker compose up --build`, then **http://localhost:8080**; a Windows one-click and a Python-based launcher are also supplied.
- **Public project:** [thezxcc/AgroSat-Uzbekistan](https://github.com/thezxcc/AgroSat-Uzbekistan), including [seven-slide PDF presentation](../presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf) and [jury walkthrough](../JUDGES_GUIDE.md).

No NASA account, individual API key, field database or external NASA service is needed at runtime: the archived source files are included.

## Tests and observations verified locally and through GitHub

| Validation | Verified evidence |
|---|---|
| Python API/science tests | **93 passed** in a fresh Python environment; one non-blocking third-party deprecation warning |
| Localization | **1,128** messages checked across EN / RU / UZ |
| React TypeScript production build | **Passed**; lint reported 0 errors / 0 warnings |
| Input matrix | **36 combinations** of water, salinity and priority checked, plus **9** invalid requests rejected |
| NASA source integrity | Original JSON SHA-256 checked against the tracked manifest |
| Browser interaction and images | Chrome desktop and mobile checks; all **10 SVG** and **2 MODIS PNG** assets present and accessible |
| GitHub CI | Backend, frontend and **clean-clone Docker startup** all passed on the published repository |
| Public presentation | **7 English slides** in both PDF and editable PowerPoint; names of both team members shown |
| Public download | Repo, presentation and README images tested without authentication |

The current public GitHub Actions workflow is the reproducible source of truth for automatic results: [Tests and Build](https://github.com/thezxcc/AgroSat-Uzbekistan/actions/workflows/ci.yml).

**Test caveat:** static checks and automated scenarios demonstrate software behavior, not on-farm effectiveness, independent human usability or production-scale security.

## Assessment against NASA's five judging dimensions

This is an internal **qualitative assessment**, not an official NASA score.

- **Relevance:** Directly addresses NASA Field Shift by connecting remote climate evidence, crop requirements and farmer priorities.
- **Validity:** Real archived NASA source data and traceable FAO/ICARDA references; unknown field inputs are labelled as unknown. Field-scale calibration remains unverified.
- **Creativity:** Explainable A/B/C alternatives, uncertainty-aware guidance, multi-factor matrix and three-question interface. Market uniqueness has not been demonstrated.
- **Impact:** Potential benefit for planning in water-constrained Khorezm. No verified yield, water, income or environmental impact measurements.
- **Presentation:** Seven-slide English demo, public code, reproducible setup and a short jury guide. A live hosted website is optional and has not been verified.

## Known limitations and remaining external steps

1. **Official NASA submission:** Project Tab entries, team registration requirements and actual **Submitted** status are account-controlled and have not been verified independently.
2. **Scientific scope:** regional rainfall and temperature do not measure the irrigation water delivered to a field; the system does not estimate farm-specific yield, profit, salinity or quantitative water savings.
3. **Satellite scope:** SMAP numeric soil-moisture sample was excluded after failing validity checks; MODIS GIBS images are visual only. No field NDVI computation is claimed.
4. **Human validation:** no independently reported farmer usability study, agronomist certification, laboratory soil test or on-farm trial.
5. **Hosting:** GitHub Pages alone cannot run the FastAPI backend. Source-code reproducibility is verified, but a hosted public HTTPS site is not asserted.
6. **Security:** tests and dependency checks do not constitute an independent penetration test.

For technical detail, consult the actual application [source code](../backend/app/), [scientific test cases](../backend/tests/), [data sources](DATA_SOURCES_AND_CREDITS.md) and [earlier engineering milestones](ENGINEERING_REVIEW_HISTORY_EN.md). The presence of the documentation does not mean NASA has accepted or judged the entry.

## AI use and attribution

AI tools were used to assist research organization, code and test drafting/review, translation, documentation and presentation development. Some decorative presentation characters are AI-generated and labelled. **AgroSat does not run a generative AI model**, and no NASA data are fabricated by AI. Project code is MIT licensed; external publications, satellite imagery and software retain their applicable terms.
