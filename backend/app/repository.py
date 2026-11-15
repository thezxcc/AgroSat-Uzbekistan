from __future__ import annotations
import json
from functools import lru_cache
from pathlib import Path
from datetime import date, timedelta
from collections import defaultdict

DATA = Path(__file__).resolve().parents[1] / "data"
IMERG = DATA / "NASA_IMERG_Urgench_2000_2025_DAILY_SOURCE.json"
POWER = DATA / "NASA_POWER_TEMPERATURE_Urgench_2000_2025_DAILY_SOURCE.json"

def valid_number(x: object) -> float | None:
    if x is None or isinstance(x, bool):
        return None
    try:
        val = float(x)
    except (ValueError, TypeError):
        return None
    return val if -990 < val < 1e6 else None

@lru_cache(maxsize=1)
def get_climate() -> dict[str, dict[str, float | None]]:
    """Source of truth: immutable NASA JSON, parsed once per process."""
    rain = json.loads(IMERG.read_text(encoding="utf-8-sig"))["properties"]["parameter"]["IMERG_PRECTOT"]
    temp = json.loads(POWER.read_text(encoding="utf-8-sig"))["properties"]["parameter"]
    if set(rain) != set(temp["T2M_MAX"]) or set(rain) != set(temp["T2M_MIN"]):
        raise ValueError("NASA dates do not match")
    out = {}
    for key in sorted(rain):
        precipitation = valid_number(rain[key])
        out[key] = {
            "rain_mm": precipitation if precipitation is not None and precipitation >= 0 else None,
            "tmax_c": valid_number(temp["T2M_MAX"].get(key)),
            "tmin_c": valid_number(temp["T2M_MIN"].get(key)),
        }
    return out

@lru_cache(maxsize=26)
def year_summary(year: int) -> dict:
    if not 2000 <= year <= 2025:
        raise ValueError("Selected year not in 2000-2025 source")
    rows = {d:v for d,v in get_climate().items() if d.startswith(str(year))}
    valid = [v["rain_mm"] for v in rows.values() if v["rain_mm"] is not None]
    if len(valid) < 360:
        raise ValueError("Insufficient precipitation coverage")
    return {
        "year":year,
        "total_precipitation_mm":round(sum(valid),2),
        "hot_days_40c":sum(v["tmax_c"] is not None and v["tmax_c"] >= 40 for v in rows.values()),
        "frost_days_0c":sum(v["tmin_c"] is not None and v["tmin_c"] <= 0 for v in rows.values())
    }

@lru_cache(maxsize=26)
def monthly_summary(year: int) -> dict:
    """Twelve monthly NASA summaries for a fully observed calendar year."""
    year_summary(year)  # Validates year and overall rain coverage.
    records = get_climate()
    months = []
    for month in range(1, 13):
        month_records = [
            values for day, values in records.items()
            if day.startswith(f"{year}{month:02d}")
        ]
        rain_values = [v["rain_mm"] for v in month_records if v["rain_mm"] is not None]
        if len(rain_values) != len(month_records) or not month_records:
            raise ValueError(f"Insufficient NASA data for {year}-{month:02d}")
        months.append({
            "month": month,
            "precipitation_mm": round(sum(rain_values), 2),
            "hot_days_40c": sum(v["tmax_c"] is not None and v["tmax_c"] >= 40 for v in month_records),
            "frost_days_0c": sum(v["tmin_c"] is not None and v["tmin_c"] <= 0 for v in month_records),
        })
    return {"year": year, "months": months}


@lru_cache(maxsize=180)
def planting_windows(month: int, day: int, duration: int = 75) -> dict:
    try:
        date(2025, month, day)
    except ValueError as ex:
        raise ValueError("Invalid date") from ex
    climate = get_climate()
    years = []
    for year in range(2000, 2026):
        start = date(year, month, day)
        values = [climate.get((start + timedelta(days=i)).strftime("%Y%m%d")) for i in range(duration)]
        if not all(v is not None and v["tmax_c"] is not None
                   and v["tmin_c"] is not None and v["rain_mm"] is not None for v in values):
            continue
        years.append({
            "year":year,
            "hot":sum(v["tmax_c"] >= 40 for v in values),
            "frost":sum(v["tmin_c"] <= 0 for v in values),
            "rain":sum(v["rain_mm"] for v in values),
        })
    if not years:
        raise ValueError("No complete NASA windows")
    return {
        "sample_years":len(years),
        "mean_hot_days_40c":round(sum(v["hot"] for v in years)/len(years),1),
        "years_with_frost":sum(v["frost"] > 0 for v in years),
        "days_per_window":duration,
        "mean_rain_mm_window":round(sum(v["rain"] for v in years)/len(years),2),
        "min_rain_mm_window":round(min(v["rain"] for v in years),2),
        "max_rain_mm_window":round(max(v["rain"] for v in years),2),
    }
