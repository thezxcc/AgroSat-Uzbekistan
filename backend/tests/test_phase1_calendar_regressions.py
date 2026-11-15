"""Regression tests for farm-calendar ambiguity and field-data safety.

Unknown intermediate dates must never conceal a known chronological contradiction.
The tests exercise the real public API, not a locally invented scenario score.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def scenario(payload):
    response = client.post("/api/compare", json=payload)
    assert response.status_code == 200, response.text
    return {item["id"]: item for item in response.json()["rotations"]}


def test_real_baseline_cannot_hide_conflict_behind_missing_middle_crop():
    results = scenario({
        "current_rotation_is_example": False,
        "current_rotation_stages": [
            {"crop": "wheat", "sowing_date": "2025-10-10", "harvest_date": "2026-06-24"},
            {"crop": "fallow"},
            {"crop": "mungbean", "sowing_date": "2026-06-10", "harvest_date": "2026-09-01"},
        ],
    })
    assert results["A"]["calendar"]["status"] == "conflict"
    assert "calendarOverlap" in results["A"]["calendar"]["note_codes"]
    assert results["A"]["status"] == "calendar-conflict"
    assert "calendarOverlap" in results["A"]["warnings_codes"]
    assert all(x["assessment"] == "unknown" for x in results["A"]["impacts"])


def test_real_baseline_reversed_sowing_dates_flagged_with_missing_harvest():
    results = scenario({
        "current_rotation_is_example": False,
        "current_rotation_stages": [
            {"crop": "wheat", "sowing_date": "2026-09-01"},
            {"crop": "mungbean", "sowing_date": "2026-08-15", "harvest_date": "2026-10-15"},
        ],
    })
    assert results["A"]["calendar"]["status"] == "conflict"


def test_unknown_dates_keep_custom_baseline_uncertain():
    results = scenario({
        "current_rotation_is_example": False,
        "current_rotation_stages": [
            {"crop": "wheat", "sowing_date": "2025-10-01", "harvest_date": "2026-06-20"},
            {"crop": "fallow"},
            {"crop": "cotton", "sowing_date": "2027-04-02", "harvest_date": "2027-09-01"},
        ],
    })
    assert results["A"]["calendar"]["status"] == "missing_dates"


def test_reversed_mung_planting_and_harvest_displays_conflict_without_negative_duration():
    results = scenario({
        "season_year": 2026,
        "planting_month": 7,
        "planting_day": 1,
        "mungbean_harvest_date": "2026-06-26",
    })
    assert results["B"]["calendar"]["status"] == "conflict"
    assert results["C"]["calendar"]["status"] == "conflict"
    assert results["B"]["calendar"]["duration_days"] is None
    assert "calendarOverlap" in results["C"]["calendar"]["note_codes"]


def test_no_irrigation_and_chronologically_complete_calendar_stays_water_risk():
    results = scenario({
        "water": "none",
        "wheat_harvest_date": "2026-06-24",
        "mungbean_harvest_date": "2026-09-13",
        "green_manure_sowing_date": "2026-10-01",
        "green_manure_end_date": "2027-03-15",
        "cotton_sowing_date": "2027-04-15",
    })
    assert results["C"]["calendar"]["status"] == "chronological_only"
    assert results["C"]["status"] == "water-risk"
    assert "noIrrigation" in results["C"]["warnings_codes"]
