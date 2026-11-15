# Scientific input datasets
These are unchanged source files copied from the prior research archive; do not edit them manually.

- `NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json` — NASA POWER daily point API, `IMERG_PRECTOT` (GPM IMERG-derived precipitation), units mm/day; latitude 41.55 N, longitude 60.62 E; dates 2000-01-01 to 2025-12-31. See https://power.larc.nasa.gov/ and https://gpm.nasa.gov/data/imerg .
- `NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json` — NASA POWER daily point temperature series `T2M`, `T2M_MAX`, `T2M_MIN` (gridded reanalysis), degrees Celsius; same coordinate and dates.
- NASA GIBS imagery in `frontend/public/imagery` are visualization PNGs, **not numeric pixel-value datasets**.

## Interpretation cautions
These gridded regional data are not observations of irrigation supply, ECe, crop yields, farm-specific soil moisture or crop type. All farm inputs are user reports and are NOT independently verified. The 75-day growing window is an illustrative crop-duration assumption. Historical counts are not a predictive probability of crop failure.
