"""Each displayed crop reference number must link to its actual primary evidence.

FAO general species/season values are not validated Durdona irrigation or crop yields.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

EXPECTED = {
    "wheat": {"seasonal_water_need_mm": ["fao_water"]},
    "mungbean": {
        "growing_period_days": ["icarda_mungbean_2022"],
        "temperature_optimum_c": ["fao_ecocrop"],
        "soil_ph_optimum": ["fao_ecocrop"],
        "salinity_note_code": ["fao_ecocrop"],
    },
    "green_manure": {},
    "cotton": {
        "seasonal_water_need_mm": ["fao_water"],
        "salinity_note_code": ["fao_salinity"],
    },
}
METRIC_KEYS = {
    "growing_period_days", "temperature_optimum_c", "soil_ph_optimum",
    "salinity_note_code", "seasonal_water_need_mm",
}

def test_citation_directly_attached_to_each_numerical_crop_metric():
    response = client.get("/api/crops")
    assert response.status_code == 200
    data = response.json()
    crops = {entry["id"]: entry for entry in data["crops"]}
    assert crops.keys() == EXPECTED.keys()
    for crop_id, expected in EXPECTED.items():
        crop = crops[crop_id]
        assert crop["metric_source_ids"] == expected
        assert set(crop["metric_source_ids"]).issubset(METRIC_KEYS)
        for key, sources in crop["metric_source_ids"].items():
            assert sources
            assert all(s in crop["source_ids"] for s in sources)
            assert all(s in data["sources"] for s in sources)
            assert (crop.get(key) is not None) and (
                key != "salinity_note_code" or crop[key] != "cropSaltUnknown"
            )
        for metric in ("growing_period_days", "temperature_optimum_c",
                       "soil_ph_optimum", "seasonal_water_need_mm"):
            if crop.get(metric) is not None:
                assert metric in crop["metric_source_ids"], (crop_id, metric)
            else:
                assert metric not in crop["metric_source_ids"], (crop_id, metric)

def test_source_scopes_are_not_misrepresented():
    response = client.get("/api/crops")
    assert response.status_code == 200
    by_id = {crop["id"]: crop for crop in response.json()["crops"]}
    assert by_id["wheat"]["seasonal_water_need_mm"] == [450, 650]
    assert by_id["cotton"]["seasonal_water_need_mm"] == [700, 1300]
    assert "season" in by_id["wheat"]["water_scope"].lower()
    assert "season" in by_id["cotton"]["water_scope"].lower()
    assert by_id["mungbean"]["growing_period_days"] == [70, 75]
    assert "durdona" in by_id["mungbean"]["growing_period_scope"].lower()
    assert by_id["mungbean"]["temperature_optimum_c"] == [21, 36]
    assert by_id["mungbean"]["soil_ph_optimum"] == [5.5, 6.2]
    assert by_id["mungbean"]["seasonal_water_need_mm"] is None
    assert by_id["green_manure"]["seasonal_water_need_mm"] is None
    assert all("predicted_yield" not in crop for crop in by_id.values())
