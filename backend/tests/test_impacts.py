from fastapi.testclient import TestClient
from app.main import app

client=TestClient(app)
DIMENSIONS={"water","soil_cover","nutrients","pests","labor","market"}

def get_result(**inputs):
    r=client.post("/api/compare",json=inputs)
    assert r.status_code==200
    return r.json()["rotations"]

def test_dimensions_complete_per_scenario():
    options=get_result()
    assert len(options)==3
    for option in options:
        assert {x["dimension"] for x in option["impacts"]}==DIMENSIONS
        assert all(x["assessment"] in {"risk","unknown","conditional"} for x in option["impacts"])
        assert all(x["note_code"] and x["note"] for x in option["impacts"])

def test_no_water_is_flagged_as_risk_for_added_crops():
    options=get_result(water="none")
    assert options[1]["impacts"][0]["assessment"]=="risk"
    assert options[2]["impacts"][0]["assessment"]=="risk"
    assert options[0]["impacts"][0]["assessment"]=="unknown"

def test_available_water_is_not_proof_of_full_irrigation():
    options=get_result(water="available")
    for option in options[1:]:
        assert option["impacts"][0]["assessment"]=="conditional"
        assert "unknown" in option["impacts"][0]["note"]

def test_custom_farm_current_is_not_assumed_to_be_fallow():
    options=get_result(current_rotation_is_example=False,current_rotation_description="alfalfa/wheat")
    assert all(x["assessment"]=="unknown" for x in options[0]["impacts"])
    assert all(x["note_code"]=="impactCustomUnknown" for x in options[0]["impacts"])

def test_market_is_unmeasured_even_if_income_goal():
    options=get_result(priority="income",water="available")
    for option in options[1:]:
        market=next(x for x in option["impacts"] if x["dimension"]=="market")
        assert market["assessment"]=="unknown"
