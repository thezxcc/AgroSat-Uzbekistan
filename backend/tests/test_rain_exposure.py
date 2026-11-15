"""NASA 75-day precipitation is computed from actual daily IMERG, never inferred irrigation."""
from datetime import date, timedelta
from math import isclose
from app.repository import get_climate, planting_windows


def test_nasa_precipitation_exposure_is_exactly_daily_window_sums():
    climate=get_climate()
    days=75
    rain=[]
    for year in range(2000,2026):
        sow=date(year,7,1)
        values=[climate[(sow+timedelta(days=i)).strftime('%Y%m%d')]['rain_mm'] for i in range(days)]
        assert len(values)==days
        assert all(value is not None and value>=0 for value in values)
        rain.append(sum(values))
    window=planting_windows(7,1)
    assert window['sample_years']==26
    assert window['days_per_window']==days
    assert isclose(window['mean_rain_mm_window'],round(sum(rain)/len(rain),2),abs_tol=0.01)
    assert isclose(window['min_rain_mm_window'],round(min(rain),2),abs_tol=0.01)
    assert isclose(window['max_rain_mm_window'],round(max(rain),2),abs_tol=0.01)
    assert 0 <= window['min_rain_mm_window'] <= window['mean_rain_mm_window'] <= window['max_rain_mm_window']


def test_sowing_date_changes_actual_rainfall_window():
    july=planting_windows(7,1)
    august=planting_windows(8,15)
    assert july['mean_rain_mm_window']!=august['mean_rain_mm_window']
    assert july['max_rain_mm_window']!=august['max_rain_mm_window']


def test_known_dates_which_reverse_order_conflict_even_with_missing_middle():
    from app.schemas import ComparisonRequest
    from app.calendar import assess_calendar
    request=ComparisonRequest.model_validate({
        'green_manure_sowing_date':'2026-06-20',
        # Mung harvest is not supplied; green manure cannot start before mung sowing.
    })
    c=assess_calendar(request,'C')
    assert c['status']=='conflict'
    assert 'mungbean_harvest' in c['missing']


def test_missing_precipitation_does_not_get_replaced_with_irrigation():
    from fastapi.testclient import TestClient
    from app.main import app
    response=TestClient(app).post('/api/compare',json={
        'water':'none','planting_month':7,'planting_day':1
    })
    assert response.status_code==200
    model=response.json()
    assert model['mean_rain_mm_window']>=0
    assert model['min_rain_mm_window']>=0
    for option in model['rotations'][1:]:
        assert option['status']=='water-risk'
        assert 'noIrrigation' in option['warnings_codes']
