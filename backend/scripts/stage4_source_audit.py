"""Stage 4: fail-safe audit of NASA source products; no new farm claims."""
import hashlib
import json
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "backend" / "data"
IMAGES = ROOT / "frontend" / "public" / "imagery"


def audit():
    manifest = json.loads((DATA / "NASA_SOURCES_MANIFEST.json").read_text(encoding="utf-8-sig"))
    assert manifest["dates"]["expected_days"] == 9497
    assert manifest["point"] == {"lat": 41.55, "long": 60.62}
    results = []
    for item in manifest["files"]:
        path = DATA / item["filename"]
        assert path.is_file(), f"missing dataset: {path.name}"
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        assert digest == item["sha256"], f"original NASA source modified: {path.name}"
        src = json.loads(path.read_text(encoding="utf-8-sig"))
        assert src["header"]["start"] == "20000101"
        assert src["header"]["end"] == "20251231"
        assert src["header"]["api"]["version"] == "v2.10.3"
        assert src["header"]["time_standard"] == "UTC"
        assert src["geometry"]["coordinates"][:2] == [60.62, 41.55]
        variables = [item["variable"]] if isinstance(item["variable"], str) else item["variable"]
        for var in variables:
            dates = src["properties"]["parameter"][var]
            assert len(dates) == 9497, (var, len(dates))
            start = datetime(2000, 1, 1)
            assert all((start + timedelta(days=i)).strftime("%Y%m%d") in dates for i in range(9497))
            assert all(isinstance(v, (int, float)) and v != -999 for v in dates.values()), var
        results.append({"dataset": path.name, "sha256": digest, "variables": variables, "days": 9497, "status": "NUMERIC_VALIDATED"})
    assert "IMERG" in json.loads((DATA / manifest["files"][0]["filename"]).read_text(encoding="utf-8-sig"))["header"]["sources"]
    smap_path = DATA / "SMAP_REJECTED_SAMPLE_2025.json"
    smap = json.loads(smap_path.read_text(encoding="utf-8-sig"))
    smap_result = {}
    for var in ("SFMC", "RZMC"):
        values = smap["properties"]["parameter"][var]
        valid = sum(1 for value in values.values() if isinstance(value, (int, float)) and value != -999)
        assert len(values) == 92 and valid == 0, f"SMAP audit changed: investigate {var}"
        smap_result[var] = {"count": len(values), "valid": valid}
    for name in ("modis_2025_july.png", "modis_2025_september.png"):
        assert (IMAGES / name).is_file(), f"missing MODIS image {name}"
    return {
        "project": "AgroSat Uzbekistan", "stage": 4,
        "nasa_daily": results, "smap": smap_result,
        "smap_decision": "REJECT_NUMERIC_NO_VALID_VALUES",
        "modis_decision": "IMAGERY_ONLY_NO_NUMERIC_NDVI",
        "other_sources": "NOT_INTEGRATED_WITHOUT_LOCAL_SCIENTIFIC_QA",
        "field_level_inference": False,
    }


if __name__ == "__main__":
    print(json.dumps(audit(), ensure_ascii=False, indent=2))
