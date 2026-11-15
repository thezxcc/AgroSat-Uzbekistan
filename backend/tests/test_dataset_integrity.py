import hashlib
import json
from datetime import datetime, timedelta
from pathlib import Path
from app.repository import get_climate

DATA = Path(__file__).resolve().parents[1] / "data"
MANIFEST = json.loads((DATA / "NASA_SOURCES_MANIFEST.json").read_text(encoding="utf-8"))

def test_immutable_source_sha256():
    for source in MANIFEST["files"]:
        digest = hashlib.sha256((DATA / source["filename"]).read_bytes()).hexdigest()
        assert digest == source["sha256"], source["filename"]

def test_2000_2025_daily_calendar_complete():
    data = get_climate()
    start = datetime.strptime(MANIFEST["dates"]["from"], "%Y-%m-%d")
    last = datetime.strptime(MANIFEST["dates"]["to"], "%Y-%m-%d")
    expected = set()
    current = start
    while current <= last:
        expected.add(current.strftime("%Y%m%d"))
        current += timedelta(days=1)
    assert set(data) == expected
    assert len(data) == MANIFEST["dates"]["expected_days"]

def test_no_missing_temperature_or_precipitation():
    for day, record in get_climate().items():
        assert all(record.get(name) is not None for name in ("rain_mm", "tmax_c", "tmin_c")), day
        assert record["rain_mm"] >= 0, day
        assert record["tmax_c"] >= record["tmin_c"], day

def test_no_implausible_daily_precipitation_spikes_in_selected_imerg_product():
    assert max(record["rain_mm"] for record in get_climate().values()) < 100

def test_coordinates_are_regional_point_not_field_identifier():
    assert MANIFEST["point"] == {"lat": 41.55, "long": 60.62}
