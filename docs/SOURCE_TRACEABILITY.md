# AgroSat — Evidence traceability

Last updated 2026-11-14. Scientific sources checked against the **existing** V10 research archive, in particular `research/NASA-SpaceApps-2026-AgroSat-Preparation/03-Research/AGRONOMY_EVIDENCE_BOOK_V2.md`.

## Purpose
Every scenario must disclose which conclusions come from NASA, from scientific publications, and from farmer inputs. A paper about a particular experiment is never evidence that an unknown farm has identical outcomes.

## Data → claims
| Component / claim | Source IDs | Claim type | Do not infer |
|---|---|---|---|
| 26-year rainfall, monthly bars, 2025 total 94.47 mm | `nasa_imerg` | NASA IMERG-derived precipitation, retrieved through POWER point API | Actual field irrigation, crop-specific soil moisture |
| Temperature extremes and 75-day windows | `nasa_power` | Gridded NASA POWER reanalysis T2M_MAX/T2M_MIN | Exact farm weather, cultivar-calibrated yield or frost damage |
| A research baseline: wheat → fallow → cotton | `icarda_rotation_2023` | Studied or described regional rotation | Farmer's verified current practice |
| B research alternative: wheat → mung bean → cotton | `icarda_mungbean_2022` | Demonstrated post-wheat fast-maturing mung bean in Khorezm | A separate measured trial arm of the same 2023 study |
| C: wheat → mung bean → green manure → cotton | `icarda_rotation_2023` | Local rotation research | Guaranteed soil improvement or saved irrigation |
| Custom farmer baseline | `farmer_inputs` only | Unverified user report | Scientific evidence for crop-specific outcomes without data |

## Primary reading
- NASA POWER — https://power.larc.nasa.gov/
- NASA GPM IMERG mission — https://gpm.nasa.gov/data/imerg
- ICARDA/GIZ 2023 original source — https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588
- ICARDA 2022 field day original source — https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8

## Implementation
- Backend registry: `backend/app/evidence.py` (stable source identifiers, roles, URLs and limitations).
- API endpoint: `GET /api/evidence`.
- Comparison results: each rotation includes `source_ids`, and the complete result includes `climate_source_ids`.
- React: `frontend/src/components/SourceTrace.tsx` shows localized explanations and links. Scientific publication titles remain in their original language to avoid distorting citations.
- Checks: `backend/tests/test_evidence.py` ensures citations are present for appropriate scenarios, including custom farmer baseline. Chrome smoke test verifies NASA and ICARDA links and their correct conditional display in RU and EN.

## Access and evidence quality
This registry was built from the research archive that cites original publication PDFs. It does not claim to reproduce all figures from the papers. This application remains a research demonstration. A specific farm needs soil ECe, real irrigation volumes and scheduling, cultivar records and validation by agricultural experts. All model reports must retain those limits.

## What is still pending
- Numeric MODIS vegetation values with QA, parcel boundaries and land cover, field measurements.
- Quantitative soil nutrient / salinity change, pest abundance and market profit.
- Separate production HTTPS hosting, public GitHub repository and NASA competition submission.
