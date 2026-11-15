from fastapi.testclient import TestClient
from app.main import app
from app.repository import get_climate, planting_windows
client=TestClient(app)

def test_cant_infer_irrigation_from_precipitation():
    result=client.post('/api/compare',json={'water':'unknown'}).json()
    assert all(any('irrigation' in x.lower() for x in r['unknowns']) for r in result['rotations'])

def test_no_fabricated_profits_or_yield():
    result=client.post('/api/compare',json={'priority':'income','water':'available'}).json()
    assert 'No farm-specific yield' in result['disclaimer']
    assert all(r['status']!='predicted' for r in result['rotations'])

def test_field_baseline_no_fallow_assertion():
    result=client.post('/api/compare',json={'current_rotation_is_example':False,'current_rotation_description':'alfalfa-wheat'}).json()
    first=result['rotations'][0]
    assert first['title']=='alfalfa-wheat'
    assert all('Fallow' not in w for w in first['warnings'])
    assert all('Fewer assumed summer' not in w for w in first['evidence_points'])

def test_year_2000_daily_records_include_leap_day():
    data=get_climate()
    assert '20000229' in data
    assert data['20000229']['rain_mm'] is not None

def test_late_sowing_changes_frost_exposure():
    july=planting_windows(7,1)
    august=planting_windows(8,15)
    assert august['years_with_frost']>july['years_with_frost']

def test_api_rejects_invalid_water_enum():
    assert client.post('/api/compare',json={'water':'definitely'}).status_code==422


def test_limited_irrigation_headline_matches_water_impact():
    from app.schemas import ComparisonRequest
    from app.service import compare_rotations

    report = compare_rotations(ComparisonRequest(water="limited"))
    for option in report["rotations"]:
        if option["id"] in ("B", "C"):
            assert option["status"] == "limited-water-risk"
            water = next(i for i in option["impacts"] if i["dimension"] == "water")
            assert water["assessment"] == "risk"
    baseline = report["rotations"][0]
    assert baseline["status"] == "compare"
