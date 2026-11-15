from __future__ import annotations
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .repository import get_climate, year_summary, monthly_summary
from .schemas import (
    ClimateMetrics, ComparisonRequest, ComparisonResponse,
    CropCatalogResponse, EvidenceEntry, HealthResponse, MonthlyClimate,
)
from .service import compare_rotations
from .evidence import registry
from .crops import CROP_REFERENCES, CROP_SOURCES

app = FastAPI(title="AgroSat Uzbekistan API", version="0.1.0")
# For production set CORS_ORIGINS=https://yourname.github.io (comma-separated allowed origins).
allowed_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=allowed_origins, allow_credentials=False, allow_methods=["GET","POST"], allow_headers=["Content-Type"])

@app.get("/api/health", response_model=HealthResponse)
def health():
    return {"status":"ok","records":len(get_climate()),"source":"NASA POWER / GPM IMERG original JSON 2000–2025"}

@app.get("/api/climate/{year}", response_model=ClimateMetrics)
def climate_summary(year: int):
    try:
        return year_summary(year)
    except ValueError as ex:
        raise HTTPException(status_code=422,detail=str(ex)) from ex

@app.get("/api/climate/{year}/monthly", response_model=MonthlyClimate)
def climate_monthly(year: int):
    try:
        return monthly_summary(year)
    except ValueError as ex:
        raise HTTPException(status_code=422, detail=str(ex)) from ex


@app.post("/api/compare", response_model=ComparisonResponse)
def comparison(request: ComparisonRequest):
    try:
        return compare_rotations(request)
    except ValueError as ex:
        raise HTTPException(status_code=422,detail=str(ex)) from ex

@app.get("/api/evidence", response_model=list[EvidenceEntry])
def evidence_sources():
    return registry()

@app.get("/api/crops", response_model=CropCatalogResponse)
def crop_references():
    """Published crop reference ranges with applicability and source links."""
    return {"crops": CROP_REFERENCES, "sources": CROP_SOURCES,
            "disclaimer": "Regional reference data, not field-calibrated crop water or yield predictions."}


@app.get("/api/sources")
def sources():
    return [
        {"name":"NASA GPM IMERG","url":"https://gpm.nasa.gov/data/imerg", "use":"Daily precipitation, 2000–2025"},
        {"name":"NASA POWER","url":"https://power.larc.nasa.gov/", "use":"Gridded daily air temperature (MERRA-2-derived)"},
        {"name":"ICARDA","url":"https://repo.mel.cgiar.org/", "use":"Local Khorezm rotation experiments"},
        {"name":"FAO","url":"https://www.fao.org/land-water/databases-and-software/crop-information/en/", "use":"Crop and water research methodology"}
    ]
