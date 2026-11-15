<div align="center">

# 🌱 AgroSat Uzbekistan

### Smarter crop rotation decisions, grounded in NASA Earth observations.

**NASA Space Apps Challenge 2026 · Field Shift: Adapting Farms with NASA Data**

[![Challenge](https://img.shields.io/badge/NASA_Space_Apps-2026-175d4f?style=for-the-badge)](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/)
![Region](https://img.shields.io/badge/Pilot-Khorezm%2C_Uzbekistan-36886d?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-EN_%7C_RU_%7C_UZ-7cbf94?style=for-the-badge)

**Real climate evidence · Clear uncertainty · Farmer-first design**

[Explore the challenge](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/) · [View the 7-slide presentation](presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf) · [Browse our sources](docs/DATA_SOURCES_AND_CREDITS.md)

</div>

---

![AgroSat website — NASA-informed farmer helper and original satellite context](docs/images/agrosat-home.png)

## 🚀 Run it yourself — one command

**No NASA API key, account or external database required.** The repository includes the historical NASA data used by this prototype.

| Your computer | What to run | Open in your browser |
|---|---|---|
| **Docker installed (Windows / macOS / Linux)** | `docker compose up --build` | **http://localhost:8080** |
| **Windows, without Docker** | Double-click **`START_HERE.bat`** | **http://127.0.0.1:5173** |
| **macOS / Linux, without Docker** | `python3 run.py` | **http://127.0.0.1:5173** |

For Docker, run the command in the directory you cloned. For native setup, install **Python 3.12+** and **Node.js 22.12+ / 24+** first; the starter will create an isolated Python environment and run `pip` and `npm ci` automatically. Initial installation needs internet; subsequent starts reuse installed dependencies. Press **Ctrl+C** to stop.

**[Clone/download instructions, platform requirements and troubleshooting →](QUICKSTART.md)**

> GitHub Pages by itself does not run FastAPI. The commands above start **both** the website and its scientific API. A publicly hosted demo needs a separate deployed API or a single-host deployment.

## The idea

**What should a farmer grow after harvesting wheat?**

In Khorezm, Uzbekistan, that decision depends on much more than the season. Irrigation water may be limited, soils may be saline, and an additional crop needs enough time before the next planting.

**AgroSat** is an educational decision-support prototype that combines **26 years of NASA climate history**, regional crop research and information provided by the farmer. Instead of making an unjustified recommendation, it helps users understand **what might work, what could go wrong and what to check next**.

> **Our principle:** Satellite data can explain regional climate conditions. It cannot tell us how much canal water reached one field or replace a laboratory soil test.

## Explore three pathways

| | Example sequence | What the prototype investigates |
|:--:|---|---|
| **A** | Wheat → fallow → cotton | Illustrative reference scenario; **not** a claim about the farmer's actual rotation |
| **B** | Wheat → mung bean → cotton | Potential extra crop, conditional on irrigation and a feasible growing season |
| **C** | Wheat → mung bean → winter pea green manure → cotton | Added soil-management stage with **additional** water, labour and seasonal constraints |

![Three explained crop rotation scenarios with grounded advantages and warnings](docs/images/agrosat-rotations.png)

The three options are **research scenarios**, not a ranked list of guaranteed outcomes. They are not presented as three measured treatments from a single trial.

## How AgroSat works

```text
NASA climate records       Local crop research        Farmer's field context
IMERG + POWER              ICARDA + FAO              Water · Soil · Priorities
       \                         |                          /
        └────────────────────────┼─────────────────────────┘
                                 ▼
                    Explainable comparison engine
                                 ▼
                 A / B / C · Risks · Missing evidence
                                 ▼
                         What to check next
```

1. **Answer three easy questions** about irrigation, soil salinity and your main goal. “I don't know” is a valid answer.
2. **Explore A, B and C**, including one clear potential advantage and one important caution per scenario.
3. **Open the evidence when needed**: crop calendars, NASA observations, the six-factor assessment and original scientific sources.
4. **Check the next action** before making a farm decision — such as confirming canal-water delivery or obtaining a soil test.

### Key features

- **EN / RU / UZ interface** with approachable wording, illustrations and light/dark themes.
- **Original NASA time series** for rainfall, heat and frost exposure — including historical 75-day windows.
- **Explainable, qualitative trade-offs** for water, soil cover, nutrients, pests, field operations and market considerations.
- **Calendar checks** for contradictory or missing sowing/harvest dates, including the separate winter green-manure stage.
- **Optional real field information**: farmer-reported irrigation amount, soil ECe, pH, sampling details and their source.
- **Research transparency**: citations, data provenance, unknowns and limitations are accessible in the interface.

## NASA data used

The pilot climate point is near **Urgench, Khorezm (41.55° N, 60.62° E)**. Data cover **1 January 2000 – 31 December 2025**: **9,497 daily dates** per climate series.

| Input | Product / parameter | How we use it |
|---|---|---|
| Precipitation | **NASA GPM IMERG**, `IMERG_PRECTOT`, delivered via **NASA POWER Daily API** | Historical daily, monthly and annual precipitation |
| Temperature | **NASA POWER** `T2M`, `T2M_MAX`, `T2M_MIN` | Historical hot/frost days and seasonal exposure |
| Vegetation imagery | **NASA GIBS / MODIS** regional images (2025) | Visual context only — **not** numerical field NDVI |

**Data integrity:** Original NASA JSON inputs and their SHA-256 hashes are tracked in [the source manifest](backend/data/NASA_SOURCES_MANIFEST.json). The code recomputes climate summaries from those files rather than using invented numbers.

**Illustrative result:** The archived NASA IMERG-derived 2025 annual precipitation at the pilot point is **94.47 mm**. That does **not** represent water delivered through irrigation canals.

> **What AgroSat does not predict:** farm-specific yields, profit, irrigation savings, laboratory salinity, crop classification, field-level NDVI or the success of a planting decision. Satellite climate cells are regional estimates, not field measurements.

## Research and source credits

The figures and crop assumptions are **not made up**. This project builds on the following identifiable primary sources:

| Source | Purpose | Original reference |
|---|---|---|
| **NASA POWER** | Daily meteorology and data access | [POWER Daily API documentation](https://power.larc.nasa.gov/docs/services/api/temporal/daily/) |
| **NASA GPM / IMERG** | Precipitation product represented in POWER | [GPM IMERG](https://gpm.nasa.gov/data/imerg) · [POWER data-source methodology](https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/) |
| **NASA GIBS** | MODIS imagery used for regional visualization | [Global Imagery Browse Services](https://gibs.earthdata.nasa.gov/) |
| **ICARDA / CGIAR (2022)** | Early Durdona mung bean example in Khorezm (~70–75 days) | [Field-day report](https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8) |
| **ICARDA / GIZ (2023)** | Wheat–mung bean–winter pea green manure–cotton research | [Original rotation research](https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588) |
| **FAO EcoCrop** | Species-level preferences for `Vigna radiata` | [EcoCrop mung bean](https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2150) |
| **FAO** | General crop water requirements and salinity references | [Crop water needs](https://www.fao.org/4/s2022e/s2022e07.htm) · [Salt tolerance](https://www.fao.org/4/T0667E/t0667e07.htm) |
| **Water (2018)** | Published regional water / saline-soil context for Khorezm | [Khorezm study](https://www.mdpi.com/2073-4441/10/2/208) |
| **Uzbekistan Ministry of Agriculture** | Public context, not verified individual farm measurements | [Open-data registry](https://gov.uz/ru/agro/pages/ochiq-ma-lumotlar-reyestri) |

**Full bibliography, source-to-claim mapping and image/software credits:** [DATA_SOURCES_AND_CREDITS.md](docs/DATA_SOURCES_AND_CREDITS.md) · [Scientific traceability](docs/SOURCE_TRACEABILITY.md).

Published values are indicative and must be interpreted within their original scope; for example, Durdona's reported crop duration is **not** a universal maturity period for every mung bean variety.

## Technology

| Frontend | Backend | Quality and data |
|---|---|---|
| React · TypeScript · Vite · Lucide | Python · FastAPI · Pydantic | NASA JSON · pytest · Chrome browser checks |
| Responsive design · EN/RU/UZ · Light/dark | Validated REST endpoints · Source tracing | GitHub Actions · SHA-256 provenance |

The backend is the **single scientific decision authority**. UI translations never change the underlying calculations.

## Manual development setup (optional)

**Most users should use the quick-start above**; the steps below are for developers who want to manage the two servers themselves.


**Prerequisites:** Python 3.12+ and Node.js 22+.

```powershell
git clone https://github.com/thezxcc/AgroSat-Uzbekistan.git
cd AgroSat-Uzbekistan

py -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt

cd frontend
npm.cmd ci
cd ..

.\start_local.ps1
```

Open **http://127.0.0.1:5173/** in the browser. Interactive API docs: **http://127.0.0.1:8000/docs**.

**Run every local quality check** (with both servers running):

```powershell
.\check_all.ps1
```

The local gate includes **93 Python tests**, **1,128 localized-message checks**, TypeScript build/lint, scientific regressions, Chrome user journeys, responsive checks and a nested-hosting asset check. These are **local test results**, not evidence of public deployment, field effectiveness or official NASA judging status.

## Deployment notes

GitHub Pages can serve the **static React frontend**, but not Python/FastAPI. A working public demo requires a separately hosted **HTTPS backend** and matching configuration:

- Set `VITE_BASE_PATH=/AgroSat-Uzbekistan/` for a GitHub Pages project subpath.
- Build with `VITE_API_URL=https://YOUR_PUBLIC_BACKEND`.
- Set `CORS_ORIGINS=https://thezxcc.github.io` on the FastAPI host (or use the actual frontend origin).
- Confirm all requests and NASA imagery work in an incognito browser.

See [deployment checklist](DEPLOYMENT_CHECKLIST.md) and [optional Render backend configuration](render.yaml). **No public live-demo URL is claimed until it has been deployed and tested.**

## Project materials

- **[Seven-slide English NASA presentation (PDF)](presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf)**
- **[Editable PowerPoint](presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pptx)**
- **[Methodology and scientific traceability](docs/SOURCE_TRACEABILITY.md)**
- **[Code / scientific audit](docs/COMPLETE_NASA_CODE_COMPLIANCE_AUDIT_20261115_RU.md)**

## Responsible use and attribution

AgroSat is a **research and educational prototype**. It cannot replace local agronomic expertise, laboratory soil measurements or confirmed irrigation records. Farmers should validate constraints before planting.

**AI assistance:** OpenAI ChatGPT supported research organization, code drafting and review, translations, automated tests, documentation and presentation development. **No generative AI inference service is embedded in the application**. The scientific outputs use the stored climate observations and explicit software rules.

The original project source is released under the [MIT License](LICENSE). NASA, CGIAR/ICARDA, FAO and other third-party datasets, images and research retain their original ownership and usage terms. AgroSat is a student-led project **created for** NASA Space Apps Challenge, not an official NASA product or endorsement.

---

<div align="center">

**Built in Uzbekistan for clearer, evidence-informed farming decisions. 🌱**

*Satellite observations can reveal climate patterns. Responsible decisions begin with knowing what they cannot reveal.*

</div>
