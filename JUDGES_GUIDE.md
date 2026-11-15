# NASA Space Apps judges: AgroSat in 2 minutes

**Challenge:** [Field Shift: Adapting Farms with NASA Data](https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/)  
**Pilot region:** Khorezm, Uzbekistan — regional climate point near Urgench (41.55° N, 60.62° E).  
**Goal:** Help a farmer explore constraints when choosing what to grow after wheat, without presenting invented yield or water-savings estimates.

## 1. Launch it (one command)

After [cloning or downloading this repository](QUICKSTART.md), open a terminal in its root directory. With Docker Compose v2 installed and Docker running, execute:

```bash
docker compose up --build
```

Open **http://localhost:8080**. Both React and FastAPI start together. NASA datasets are already in the repository. No NASA account, database or API credentials are needed.

**Without Docker:** Windows users can double-click `START_HERE.bat`; macOS/Linux users can run `python3 run.py` after installing Python 3.12+ and Node.js 22.12+/24+. Full details: [QUICKSTART.md](QUICKSTART.md).

## 2. Try the main user journey

| Step | What to do | What to look for |
|---|---|---|
| **A. Understand the problem** | View the landing page and three crop rotation cards | A wheat → fallow → cotton, B wheat → mung bean → cotton, C wheat → mung bean → **winter pea green manure** → cotton |
| **B. Answer the questions** | Select irrigation availability, soil-salinity knowledge and your priority | Simple language, three questions, and a next-step explanation; you can specify what you do not know |
| **C. Compare the scenarios** | Open the detailed A/B/C comparison and source explanations | Water and soil risks, qualitative trade-offs, missing evidence and clearly marked research scenarios |
| **D. Verify NASA data** | Explore **Climate & rainfall** and **Satellite images** | 2000–2025 daily observations, historical heat/frost/rainfall patterns, real regional imagery |
| **E. Check scientific transparency** | Expand **Methods & sources** and individual evidence panels | NASA, ICARDA and FAO links, applicability caveats, provenance of farmer-entered data |

The English-language interface is the default on a fresh visit; Russian and Uzbek are also available. Try a mobile-sized viewport or switch the light/dark theme.

## 3. Check the evidence, not only the UI

- **NASA GPM IMERG precipitation:** `IMERG_PRECTOT` through the NASA POWER daily API.
- **NASA POWER temperature:** `T2M`, `T2M_MAX`, `T2M_MIN`.
- **9,497 daily dates, 2000–2025**, at the pilot regional point; historical 2025 IMERG-derived precipitation total **94.47 mm**.
- **NASA MODIS / GIBS** images are visual context; **we do not calculate numerical field-level NDVI**.
- **ICARDA and FAO** support the regional crop sequences and reference values. The 70–75-day mung bean example is variety-specific, not a universal prediction.

**Links:** [NASA data and research credits](docs/DATA_SOURCES_AND_CREDITS.md) · [Source-to-claim traceability](docs/SOURCE_TRACEABILITY.md) · [Seven-slide presentation (PDF)](presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf).

## 4. Reproducibility and boundaries

[![Tests and build](https://github.com/thezxcc/AgroSat-Uzbekistan/actions/workflows/ci.yml/badge.svg)](https://github.com/thezxcc/AgroSat-Uzbekistan/actions/workflows/ci.yml)

GitHub Actions runs scientific/API tests, TypeScript lint/build, translation checks and a **clean-clone Docker smoke test** that requests the real NASA-powered API and checks that the three comparison results exist.

You can also open **http://localhost:8080/api/health** in Docker mode and verify a JSON response containing `"status": "ok"` and `"records": 9497`.

**Limitations:** AgroSat is a research and educational decision-support prototype. It is **not field-validated** and does not predict actual crop yield, income, canal irrigation delivery, numeric soil salinity or percentage water savings. A date-consistent rotation is not necessarily feasible for a particular farm. NASA satellite/reanalysis climate data provide regional context, not farm measurements.

**AI assistance disclosure:** OpenAI ChatGPT supported research organization, software drafting and review, translations, documentation and tests. The application itself does **not** call a generative AI service.

**Source and licensing:** Original project code [MIT](LICENSE); third-party scientific resources and imagery retain their own terms. The project is a NASA Space Apps 2026 entry, **not** an official NASA product.

---

**Return to [README](README.md)** · **[Setup / troubleshooting](QUICKSTART.md)** · **[Slide deck](presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf)**
