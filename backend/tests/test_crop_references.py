"""References must retain scope and never turn general literature into farm yields."""
from fastapi.testclient import TestClient
from app.main import app

client=TestClient(app)

def test_four_referenced_crops_have_distinct_sources():
    response=client.get("/api/crops")
    assert response.status_code==200
    obj=response.json()
    crops={r["id"]:r for r in obj["crops"]}
    assert set(crops)=={"wheat","mungbean","green_manure","cotton"}
    assert crops["mungbean"]["scientific_name"]=="Vigna radiata"
    assert crops["mungbean"]["growing_period_days"]==[70,75]
    assert crops["mungbean"]["seasonal_water_need_mm"] is None
    assert "uz_durdona_2026" in crops["mungbean"]["source_ids"]
    assert crops["green_manure"]["seasonal_water_need_mm"] is None
    assert crops["wheat"]["seasonal_water_need_mm"]==[450,650]
    assert crops["cotton"]["seasonal_water_need_mm"]==[700,1300]
    assert all(id in obj["sources"] for crop in crops.values() for id in crop["source_ids"])
    assert all(obj["sources"][id]["url"].startswith("https://")
               for id in obj["sources"])

def test_annual_rainfall_not_mistaken_for_crop_irrigation():
    obj=client.get("/api/crops").json()
    assert "not field-calibrated" in obj["disclaimer"]
    for crop in obj["crops"]:
        assert "predicted_yield" not in crop
        assert "annual_rain_mm_2025" not in crop

def test_all_calendar_codes_have_no_unknown_dates_as_feasible():
    obj=client.post("/api/compare",json={}).json()
    b=obj["rotations"][1]["calendar"]
    assert b["status"]=="missing_dates"
    assert "calendarIncomplete" in b["note_codes"]
    assert "wheat_harvest" in b["missing"]
