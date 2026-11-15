# AgroSat Uzbekistan — Engineering and Scientific Review History

**Public English overview of the technical and scientific review conducted on 14–15 November 2026.**

Earlier detailed milestone notes were written internally in Russian. For the NASA-facing public repository, the verified findings, outstanding limitations and pointers to executable checks have been consolidated into English. **This document is a concise review index, not a word-for-word translation of every historical note.** The original milestone notes remain archived on the development machine.

For the current, detailed assessment, see [NASA Code and Science Audit](NASA_CODE_AND_SCIENCE_AUDIT_EN.md).

## 1. Technical architecture and independent code checks

The project separates responsibilities between the React/TypeScript frontend and FastAPI/Python backend. Data inputs are validated; the NASA source JSON is cached and used as the authority for climate calculations. The comparison logic is explicit and does not invoke an external machine-learning model.

Checks include invalid-input handling, scientific boundary cases, API matrix combinations, UI rendering, browser interaction, data integrity and reproducibility. A previous internal review also examined error handling, request concurrency, dependencies and basic software security. No independent penetration test has been performed.

**Inspectable implementation:** [backend/app](../backend/app/), [backend/tests](../backend/tests/), [frontend/src](../frontend/src/), [CI workflow](../.github/workflows/ci.yml).

## 2. Khorezm agronomy and source verification

The research stage distinguished **regional evidence** from **field observations**:

- ICARDA's 2022 Khorezm report supports an example of Durdona mung bean after wheat with an approximately 70–75-day period; this is **not universal** for all varieties.
- ICARDA/GIZ's 2023 work informs the wheat–mung bean–winter pea green-manure–cotton sequence.
- FAO crop-water, salinity and EcoCrop references provide **indicative background**, not observed local water delivery, measured soil salinity or proven yield increase.
- Regional irrigation and soil constraints are described in published Khorezm environmental studies.

The three example pathways are **not comparable trial arms measured together**. See [Data Sources and Credits](DATA_SOURCES_AND_CREDITS.md), [Crop Reference Implementation](../backend/app/crops.py) and [Source Traceability](SOURCE_TRACEABILITY.md).

## 3. NASA resource selection and data feasibility

The project considered several NASA Earth observation products before selecting inputs suitable for a small, reproducible pilot. Three NASA-related inputs appear in the published application:

| NASA resource | Actual status | Usage |
|---|---|---|
| GPM IMERG via NASA POWER | **Integrated** | Daily regional precipitation, mm/day |
| NASA POWER temperature | **Integrated** | Temperature extrema, heat/frost counts and historical windows |
| NASA GIBS / MODIS | **Visual context** | Two real regional imagery samples, no numerical NDVI |
| SMAP numerical soil moisture | **Not integrated** | Examined sample had no acceptable valid measurements |
| MODIS MOD13Q1 / Landsat derived NDVI | **Not integrated** | Would require quality flags, georeferenced processing and independent validation |
| Other potential NASA products (e.g. GLDAS, ECOSTRESS) | **Not integrated** | Additional data should not be added without a defensible method |

The practical consequence is deliberate: numerical results must be derived from verified stored data, not from visually inferred colours or fabricated soil moisture.

See [NASA Source Manifest](../backend/data/NASA_SOURCES_MANIFEST.json) and [Scientific Evidence](SOURCE_TRACEABILITY.md).

## 4. Stepwise implementation and regression fixes

| Stage | Main work | Public inspection points |
|---|---|---|
| 1: Calendar consistency | Correctly order post-wheat, mung bean, winter pea and next cotton stages; detect invalid and missing dates | [Calendar rules](../backend/app/calendar.py) and [tests](../backend/tests/test_phase1_calendar_regressions.py) |
| 2: Crop provenance | Associate each crop reference value with the correct source, species/variety and applicability notes | [Crop evidence](../backend/app/crops.py), [source traceability](SOURCE_TRACEABILITY.md) |
| 3: Field measurement provenance | Accept structured farmer reports with source, timing and units; preserve unknowns; validate ECe, pH and irrigation inputs | [Field evidence](../backend/app/field_evidence.py), [tests](../backend/tests/test_phase3_field_evidence.py) |
| 4: NASA data integrity | Keep raw point JSON and hashes; distinguish valid observations, images and rejected inputs | [NASA manifest](../backend/data/NASA_SOURCES_MANIFEST.json), [source audit](../backend/scripts/stage4_source_audit.py) |
| 5: Farmer-first interface | Three accessible questions, three crop scenarios, six-dimensional risk explanations and three languages | [Farmer interface](../frontend/src/components/FarmerEasy.tsx), [comparison matrix](../frontend/src/components/ComparisonMatrix.tsx) |
| 6: Competition materials | Seven English slides, public README, data credits and AI disclosure | [Presentation](../presentation/AgroSat_Uzbekistan_NASA_2026_FINAL.pdf), [README](../README.md) |
| 7: Reproducible release | One-command Docker launch, native local launcher, GitHub Actions tests | [Quick Start](../QUICKSTART.md), [CI](../.github/workflows/ci.yml) |

These stages document **software verification**, not agronomic field trials.

## 5. Historical concerns addressed

- Incorrect inference from missing irrigation or soil values: **unknown is kept unknown**.
- The winter-pea stage must be separate and chronologically feasible, but chronology alone does not prove crop suitability.
- Satellite imagery cannot establish field-level NDVI or irrigation delivery; images are labelled as context.
- In a nested frontend URL, static illustrations use the correct base path; a regression check covers this case.
- Comparisons are qualitative; there are no claimed quantitative profits, yields or water savings.

## 6. Unresolved questions

Independent farmer comprehension, cultivar-specific durations, local soil testing, measured irrigation supply, actual water/yield impact, security review and fully hosted public HTTPS deployment remain unverified. NASA account/project submission status is also unknown to the code repository.

For reviewer-friendly operation, see [Judges Guide](../JUDGES_GUIDE.md) and [Quick Start](../QUICKSTART.md).

**AI assistance:** Code, testing, editorial work and historical review received AI assistance. Scientific numeric outputs are produced from the preserved NASA source data, not a generative prediction model.
