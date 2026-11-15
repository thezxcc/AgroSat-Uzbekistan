from fastapi.testclient import TestClient
from app.main import app
from app.repository import get_climate,year_summary,planting_windows

client=TestClient(app)

def test_archive_date_count():
    assert len(get_climate()) == 9497

def test_2025_rain():
    assert year_summary(2025)["total_precipitation_mm"] == 94.47

def test_health():
    r=client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["records"] == 9497

def test_invalid_year():
    assert client.get("/api/climate/2030").status_code == 422

def test_comparison_three():
    r=client.post("/api/compare",json={"water":"unknown","salinity":"unknown"})
    assert r.status_code == 200
    assert len(r.json()["rotations"]) == 3

def test_no_water():
    r=client.post("/api/compare",json={"water":"none"}).json()
    assert r["rotations"][1]["status"] == "water-risk"
    assert r["rotations"][2]["status"] == "water-risk"

def test_not_assume_farmer_current():
    r=client.post("/api/compare",json={"current_rotation_is_example":False,"current_rotation_description":"cotton-wheat"}).json()
    assert r["rotations"][0]["title"] == "cotton-wheat"

def test_unknown_soil_is_unknown():
    r=client.post("/api/compare",json={"salinity":"unknown"}).json()
    assert any("ECe" in x for x in r["rotations"][0]["unknowns"])

def test_invalid_date():
    r=client.post("/api/compare",json={"planting_month":6,"planting_day":31})
    assert r.status_code == 422

def test_sources():
    r=client.get("/api/sources")
    assert any("NASA" in x["name"] for x in r.json())

def test_window():
    r=planting_windows(7,1)
    assert r["sample_years"] == 26
    assert r["years_with_frost"] == 0
