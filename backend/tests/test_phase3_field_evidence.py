"""Phase 3: distinguish reported measurements, estimates and conflicting context.

No universal numerical ECe threshold is inferred for low/high salinity;
irrigation volume is never treated as adequate crop water supply.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def compare(**fields):
    response = client.post("/api/compare", json=fields)
    assert response.status_code == 200, response.text
    return response.json()


def checks(data, dimension):
    return [item for item in data["field_evidence"] if item["dimension"] == dimension]


def codes(data, dimension):
    return {item["note_code"] for item in checks(data, dimension)}


def test_no_measured_field_data_have_unknown_evidence_not_fabricated_verification():
    data = compare()
    assert "irrigationVolumeMissing" in codes(data, "irrigation")
    assert "soilEceMissing" in codes(data, "soil")
    assert "baselineResearchExample" in codes(data, "rotation")
    assert not any(item["source"] == "verified" for item in data["field_evidence"])


def test_farmer_estimated_irrigation_is_not_mislabeled_metered():
    data = compare(
        water="available",
        irrigation_m3_ha=1100,
        irrigation_period="summer_mungbean",
        irrigation_source="farmer_estimate",
    )
    items = checks(data, "irrigation")
    assert "irrigationEstimateUnverified" in codes(data, "irrigation")
    assert all(item["source"] != "reported_metered" for item in items)
    assert "irrigationEstimateUnverified" in data["rotations"][1]["unknowns_codes"]
    assert data["rotations"][1]["status"] == "conditional"


def test_reported_metered_volume_not_declared_independently_verified():
    data = compare(
        water="available",
        irrigation_m3_ha=1100,
        irrigation_period="summer_mungbean",
        irrigation_source="metered",
    )
    assert "irrigationMeasurementLimited" in codes(data, "irrigation")
    assert {item["source"] for item in checks(data, "irrigation")} == {"reported_metered"}
    assert not any("verified" in item.get("source", "") for item in data["field_evidence"])


def test_positive_irrigation_with_no_water_is_reconciliation_flag_not_inferred_supply():
    data = compare(
        water="none",
        irrigation_m3_ha=1200,
        irrigation_period="summer_mungbean",
        irrigation_source="metered",
    )
    assert "irrigationCategoryUnreconciled" in codes(data, "irrigation")
    for choice in data["rotations"][1:]:
        assert choice["status"] == "water-risk"
        assert "noIrrigation" in choice["warnings_codes"]
        assert "irrigationCategoryUnreconciled" in choice["warnings_codes"]


def test_zero_irrigation_with_available_water_requires_context_not_automatic_rejection():
    data = compare(
        water="available",
        irrigation_m3_ha=0,
        irrigation_period="summer_mungbean",
        irrigation_source="metered",
    )
    assert "irrigationCategoryUnreconciled" in codes(data, "irrigation")
    assert data["rotations"][1]["status"] == "conditional"
    assert "irrigationCategoryUnreconciled" in data["rotations"][1]["warnings_codes"]


def test_rotation_wide_irrigation_does_not_infer_summer_mungbean_supply():
    data = compare(
        water="none",
        irrigation_m3_ha=1000,
        irrigation_period="full_rotation",
        irrigation_source="metered",
    )
    assert "irrigationCategoryUnreconciled" not in codes(data, "irrigation")
    assert data["rotations"][1]["status"] == "water-risk"


def test_soil_farmer_estimate_not_presented_as_laboratory_result():
    data = compare(salinity="low", salinity_ece_ds_m=5.1,
                   soil_test_source="farmer_estimate")
    assert "soilEstimateUnverified" in codes(data, "soil")
    assert "soilCategoryUncalibrated" in codes(data, "soil")
    assert "soilMeasurementLimited" not in data["rotations"][1]["unknowns_codes"]


def test_lab_claim_without_sample_date_or_depth_is_incomplete():
    data = compare(salinity_ece_ds_m=4.2, soil_ph=7.5,
                   soil_test_source="laboratory")
    assert "soilLabMetadataIncomplete" in codes(data, "soil")
    assert "soilLabMetadataIncomplete" in data["rotations"][1]["unknowns_codes"]
    assert all(item["source"] == "reported_laboratory" for item in checks(data, "soil"))


def test_reported_lab_complete_metadata_removes_missing_metadata_warning_only():
    data = compare(salinity="high", salinity_ece_ds_m=1.0,
                   soil_test_source="laboratory",
                   soil_sample_date="2026-06-20", soil_sample_depth_cm=30)
    assert "soilLabMetadataIncomplete" not in codes(data, "soil")
    assert "soilCategoryUncalibrated" in codes(data, "soil")
    assert "soilMeasurementLimited" in codes(data, "soil")
    assert data["rotations"][1]["status"] == "needs-data"


def test_arbitrary_ece_is_not_reclassified_by_cotton_specific_threshold():
    for ece, label in [(0.1, "high"), (15.0, "low")]:
        data = compare(salinity=label, salinity_ece_ds_m=ece,
                       soil_test_source="laboratory",
                       soil_sample_date="2026-05-01", soil_sample_depth_cm=25)
        assert "soilCategoryUncalibrated" in codes(data, "soil")
        assert "salinityHigh" in data["rotations"][1]["warnings_codes"] if label == "high" else "salinityHigh" not in data["rotations"][1]["warnings_codes"]


def test_custom_baseline_stays_farmer_report_not_measured_impacts():
    data = compare(
        current_rotation_is_example=False,
        current_rotation_stages=[
            {"crop": "wheat", "sowing_date": "2025-10-01", "harvest_date": "2026-06-20"},
            {"crop": "mungbean", "sowing_date": "2026-07-01", "harvest_date": "2026-09-13"},
        ],
    )
    assert "baselineFarmerUnverified" in codes(data, "rotation")
    assert all(x["assessment"] == "unknown" for x in data["rotations"][0]["impacts"])
