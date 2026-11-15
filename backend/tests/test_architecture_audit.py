"""Scientific and request-contract regression tests added by architecture audit."""
from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.schemas import ComparisonRequest
from app.impact import rotation_impacts
from app.evidence import references_for_rotation
from app.repository import planting_windows, year_summary, monthly_summary

client = TestClient(app)

@pytest.mark.parametrize("month,day", [(6, 31), (7, 32), (2, 10), (8, 0)])
def test_invalid_sowing_calendar_is_rejected_at_schema_boundary(month, day):
    response = client.post("/api/compare", json={
        "planting_month": month, "planting_day": day
    })
    assert response.status_code == 422

def test_unstructured_blank_custom_rotation_is_rejected():
    response = client.post("/api/compare", json={
        "current_rotation_is_example": False,
        "current_rotation_description": "    "
    })
    assert response.status_code == 422

def test_unused_external_fields_are_rejected():
    response = client.post("/api/compare", json={
        "water": "limited", "secret_extra_input": "not needed"
    })
    assert response.status_code == 422

@pytest.mark.parametrize("identifier", ["Z", "x", ""])
def test_unknown_rotation_ids_fail_closed(identifier):
    request = ComparisonRequest()
    with pytest.raises(ValueError):
        rotation_impacts(identifier, request)
    with pytest.raises(ValueError):
        references_for_rotation(identifier, True)

def test_mungbean_and_green_manure_seasons_not_conflated():
    data = client.post("/api/compare", json={
        "water": "available", "priority": "soil",
    }).json()["rotations"]
    assert "greenManureSeason" not in data[1]["warnings_codes"]
    assert "greenManureSeason" in data[2]["warnings_codes"]
    note = data[2]["warnings"][data[2]["warnings_codes"].index("greenManureSeason")]
    assert "after" in note.lower()
    assert "75-day" in note

def test_monthly_total_matches_yearly_source():
    for year in (2000, 2010, 2025):
        y = year_summary(year)["total_precipitation_mm"]
        months = monthly_summary(year)["months"]
        assert len(months) == 12
        assert abs(sum(item["precipitation_mm"] for item in months)-y) <= .07

def test_historical_window_is_repeatable_and_cached():
    a = planting_windows(7, 1)
    b = planting_windows(7, 1)
    assert a is b
    assert a["sample_years"] == 26
