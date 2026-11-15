import json
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
DATA = Path(__file__).resolve().parents[1] / "data"

def read_source(filename: str) -> dict:
    return json.loads((DATA / filename).read_text(encoding="utf-8-sig"))

def test_nasa_power_api_source_versions_time_and_coordinates():
    products = {
        "NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json": ("IMERG", {"IMERG_PRECTOT"}),
        "NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json": ("MERRA2", {"T2M", "T2M_MAX", "T2M_MIN"}),
    }
    for name, (source, parameters) in products.items():
        data = read_source(name)
        header = data["header"]
        assert header["api"]["name"] == "POWER Daily API"
        assert header["api"]["version"] == "v2.10.3"
        assert source in header["sources"]
        assert header["time_standard"] == "UTC"
        assert header["start"] == "20000101"
        assert header["end"] == "20251231"
        assert data["geometry"]["type"] == "Point"
        assert data["geometry"]["coordinates"][:2] == [60.62, 41.55]
        assert set(data["properties"]["parameter"]) == parameters

def test_documentation_links_in_live_evidence_registry():
    data=client.get("/api/evidence")
    assert data.status_code == 200
    registry={r["id"]:r for r in data.json()}
    for id in ("nasa_imerg","nasa_power"):
        source=registry[id]
        assert source["documentation_url"].startswith("https://power.larc.nasa.gov/docs/")
    assert registry["farmer_inputs"]["url"] is None
    assert registry["farmer_inputs"]["documentation_url"] is None
