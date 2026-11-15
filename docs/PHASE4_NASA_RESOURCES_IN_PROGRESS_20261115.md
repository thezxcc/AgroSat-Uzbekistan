# Historical stage-4 checkpoint (superseded by PHASE4_REQUIRED_NASA_DATA_PASS_20261115.md)

# AgroSat — Stage 4 NASA Resources audit (15 November 2026)

Status: **IN PROGRESS**. This is a reproducible local-data gate, not an assertion that new satellite products have been integrated.

## Implemented now
- `research/stage4_source_audit.py` checks the unchanged raw NASA POWER dataset SHA-256 values, source metadata, coordinates, UTC dates, 9497 daily observations for 2000–2025 and complete variables `IMERG_PRECTOT`, `T2M`, `T2M_MAX`, `T2M_MIN`.
- It inspects the archived SMAP candidate (July–September 2025) and rejects both `SFMC` and `RZMC` for numerical use because each has 92 missing values (`-999`), zero valid observations.
- It verifies the two MODIS imagery assets exist without claiming pixels are calibrated NDVI.
- This scientific audit runs in `check_all.ps1` before the full local application checks. Raw NASA files are not changed.

## Next work, not complete
1. For each relevant NASA candidate, document exact product ID/version, source URL, temporal extent, grid resolution, units, quality flags and local valid-value count.
2. Investigate authentic MOD13Q1.061 quality-screened numeric raster or Landsat L2 scene for a justified area/date; only if reproducible and valid.
3. Investigate SMAP NSIDC original data product only if local, quality-screened measurements are accessible; do not confuse ~9 km model estimates with a farm sensor.
4. Verify references and credit wording on NASA Project Tab. No quantitative crop yield, salinity, canal irrigation or NDVI is presently inferred from these images.

## Important
Phase 3 is already PASS (92 backend tests and browser evidence checks). Stage 4 is not yet PASS as a fully integrated new satellite layer. Public deployment/submission remains a separate Stage 8.
