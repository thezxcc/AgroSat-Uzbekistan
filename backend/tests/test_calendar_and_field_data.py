"""Khorezm field calendar is chronological screening, not yield prediction."""
from fastapi.testclient import TestClient
import pytest
from app.main import app

client=TestClient(app)

BASE={
    "season_year":2026,
    "planting_month":7,
    "planting_day":1,
    "wheat_harvest_date":"2026-06-24",
    "mungbean_harvest_date":"2026-09-13", # 74 days after 1 July
    "green_manure_sowing_date":"2026-10-01",
    "green_manure_end_date":"2027-03-15",
    "cotton_sowing_date":"2027-04-15",
}
def results(payload):
    response=client.post("/api/compare",json=payload)
    assert response.status_code==200, response.text
    return {option["id"]:option for option in response.json()["rotations"]}

def test_default_dates_unverified_not_claimed_feasible():
    cases=results({})
    assert cases["A"]["calendar"]["status"]=="not_evaluated"
    assert cases["B"]["calendar"]["status"]=="missing_dates"
    assert cases["C"]["calendar"]["status"]=="missing_dates"

def test_chronological_rotation_with_durdona_reference_window():
    cases=results(BASE)
    assert cases["B"]["calendar"]["status"]=="chronological_only"
    assert cases["C"]["calendar"]["status"]=="chronological_only"
    assert cases["C"]["calendar"]["duration_days"]==74
    assert len(cases["C"]["calendar"]["events"])==6
    assert "calendarWinterPeaStage" in cases["C"]["calendar"]["note_codes"]

def test_green_manure_overlap_does_not_pass():
    payload={**BASE,"green_manure_sowing_date":"2026-08-20"}
    cases=results(payload)
    assert cases["B"]["calendar"]["status"]=="chronological_only"
    assert cases["C"]["calendar"]["status"]=="conflict"
    assert cases["C"]["status"]=="calendar-conflict"
    assert "calendarOverlap" in cases["C"]["warnings_codes"]
    assert "calendarOverlap" in cases["C"]["calendar"]["note_codes"]

def test_following_cotton_before_green_manure_ends_fails():
    payload={**BASE,"green_manure_end_date":"2027-05-12"}
    cases=results(payload)
    assert cases["C"]["calendar"]["status"]=="conflict"

def test_short_mung_window_is_review_not_automatic_fail():
    cases=results({**BASE,"mungbean_harvest_date":"2026-08-26"})
    assert cases["B"]["calendar"]["status"]=="review"
    assert "calendarDurdonaReference" in cases["B"]["calendar"]["note_codes"]

def test_partial_calendar_is_unknown_not_feasible():
    cases=results({"wheat_harvest_date":"2026-06-20"})
    assert "mungbean_harvest" in cases["B"]["calendar"]["missing"]
    assert cases["B"]["calendar"]["status"]=="missing_dates"

@pytest.mark.parametrize("payload",[
    {"wheat_harvest_date":"2025-06-20"},
    {"green_manure_end_date":"2026-11-30"},
    {"irrigation_m3_ha":1400},
    {"irrigation_m3_ha":-10,"irrigation_source":"metered","irrigation_period":"summer_mungbean"},
    {"irrigation_m3_ha":"NaN","irrigation_source":"metered","irrigation_period":"summer_mungbean"},
    {"salinity_ece_ds_m":4.2},
    {"soil_ph":14.8,"soil_test_source":"laboratory"},
    {"soil_sample_depth_cm":1000},
    {"current_rotation_is_example":False,"current_rotation_stages":[{"crop":"unexpected"}]},
    {"current_rotation_is_example":False,"current_rotation_stages":[{"crop":"wheat","sowing_date":"2026-10-01","harvest_date":"2026-05-01"}]},
])
def test_unverified_or_invalid_field_inputs_rejected(payload):
    response=client.post("/api/compare",json=payload)
    assert response.status_code==422, response.text

def test_optional_measured_values_are_not_invented_as_crop_supply():
    cases=results({
        "water":"available",
        "irrigation_m3_ha":1100,"irrigation_source":"metered",
        "irrigation_period":"summer_mungbean",
        "salinity_ece_ds_m":5.0,"soil_test_source":"laboratory",
        "soil_sample_date":"2026-06-20","soil_sample_depth_cm":30,
    })
    for k in ("B","C"):
        assert cases[k]["status"]=="conditional"
        assert "irrigationNeedUncalibrated" in cases[k]["warnings_codes"]
        assert "soilMeasurementLimited" in cases[k]["unknowns_codes"]
        assert "soilEceMissing" not in cases[k]["unknowns_codes"]

def test_structured_farmer_rotation_is_not_treated_as_verified_yield():
    cases=results({
        "current_rotation_is_example":False,
        "current_rotation_stages":[
            {"crop":"wheat","sowing_date":"2025-10-15","harvest_date":"2026-06-20"},
            {"crop":"mungbean","sowing_date":"2026-07-02","harvest_date":"2026-09-14"},
        ],
    })
    assert cases["A"]["calendar"]["status"]=="chronological_only"
    assert cases["A"]["title"]=="wheat → mungbean"
    assert all(x["assessment"]=="unknown" for x in cases["A"]["impacts"])
