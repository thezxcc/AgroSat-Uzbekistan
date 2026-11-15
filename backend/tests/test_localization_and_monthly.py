from fastapi.testclient import TestClient
from app.main import app
from app.repository import monthly_summary, year_summary

client = TestClient(app)

def test_monthly_sums_match_annual_with_rounding_tolerance():
    for year in (2000, 2010, 2021, 2025):
        m = monthly_summary(year)
        assert len(m["months"]) == 12
        assert [x["month"] for x in m["months"]] == list(range(1, 13))
        assert abs(sum(x["precipitation_mm"] for x in m["months"]) - year_summary(year)["total_precipitation_mm"]) < 0.09

def test_monthly_api_invalid_year():
    assert client.get("/api/climate/2026/monthly").status_code == 422

def test_reason_codes_stable_and_parallel():
    r = client.post("/api/compare", json={"water": "none", "priority": "soil", "salinity": "high"}).json()
    assert r["disclaimer_code"] == "scientificDisclaimer"
    for option in r["rotations"]:
        assert option["title_key"].startswith("rotation")
        for name in ("warnings", "unknowns", "evidence_points"):
            assert len(option[name]) == len(option[name + "_codes"])
            assert all(isinstance(x, str) and x for x in option[name + "_codes"])
    assert "noIrrigation" in r["rotations"][1]["warnings_codes"]
    assert "soilGoal" in r["rotations"][2]["evidence_points_codes"]

def test_custom_baseline_has_distinct_codes_and_no_fallow_assertion():
    r = client.post("/api/compare", json={
        "current_rotation_is_example": False,
        "current_rotation_description": "alfalfa/wheat"
    }).json()
    a = r["rotations"][0]
    assert a["title"] == "alfalfa/wheat"
    assert "fallowNotRecovery" not in a["warnings_codes"]
    assert "noExtraHarvest" not in a["evidence_points_codes"]
    assert "customNeedsValidation" in a["evidence_points_codes"]
