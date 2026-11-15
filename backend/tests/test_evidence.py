from fastapi.testclient import TestClient
from app.main import app
from app.evidence import SOURCES, references_for_rotation
client = TestClient(app)

def test_evidence_registry_has_verified_source_links():
    response = client.get("/api/evidence")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 5
    assert {entry["id"] for entry in items} == set(SOURCES)
    for item in items:
        if item["type"] != "unverified_input":
            assert item["url"] and item["url"].startswith("https://")
        assert item["limitation"]

def test_nasa_resources_are_present_in_actual_comparison():
    result = client.post("/api/compare", json={"water": "none"}).json()
    assert result["climate_source_ids"] == ["nasa_imerg","nasa_power"]
    for rotation in result["rotations"]:
        assert all(id in SOURCES for id in rotation["source_ids"])
    assert "icarda_mungbean_2022" in result["rotations"][1]["source_ids"]
    assert "icarda_rotation_2023" in result["rotations"][2]["source_ids"]

def test_custom_farm_baseline_does_not_claim_icarda_trial_proof():
    result = client.post("/api/compare",json={
        "current_rotation_is_example":False,
        "current_rotation_description":"alfalfa → cotton"
    }).json()
    assert result["rotations"][0]["source_ids"] == ["farmer_inputs"]

def test_example_baseline_has_regional_published_source():
    assert references_for_rotation("A",True)==["icarda_rotation_2023","farmer_inputs"]
