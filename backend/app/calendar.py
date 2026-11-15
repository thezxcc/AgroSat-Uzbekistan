"""Chronological, evidence-limited crop calendar checks for Khorezm.

Dates entered by the user are not inferred from NASA climate data.
A chronologically consistent sequence is NOT an agronomic feasibility prediction.
"""
from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .schemas import ComparisonRequest


def _serial(value: date | None) -> str | None:
    return value.isoformat() if value else None


def assess_calendar(request: "ComparisonRequest", identifier: str) -> dict:
    if identifier not in ("A", "B", "C"):
        raise ValueError("Unknown rotation ID")

    if identifier == "A":
        stages = request.current_rotation_stages if not request.current_rotation_is_example else []
        if not stages:
            return {"status": "not_evaluated", "events": [], "missing": [],
                    "note_codes": ["calendarBaselineNotEvaluated"], "duration_days": None}
        events = []
        conflicts = []
        missing = []
        last_known_date: date | None = None
        for i, stage in enumerate(stages):
            # Do not let an undated intermediate crop hide a contradiction
            # between any two known events in the user's declared order.
            for event_stage, event_date in (
                (f"baseline_{i}_{stage.crop}", stage.sowing_date),
                (f"baseline_{i}_{stage.crop}_end", stage.harvest_date),
            ):
                events.append({"stage": event_stage, "date": _serial(event_date)})
                if event_date is not None:
                    if last_known_date is not None and event_date < last_known_date:
                        conflicts.append("calendarOverlap")
                    last_known_date = event_date
            if stage.sowing_date is None or stage.harvest_date is None:
                missing.append(f"baseline_{i}_dates")
        status = ("conflict" if conflicts else
                  "missing_dates" if missing else "chronological_only")
        return {"status": status, "events": events, "missing": missing,
                "note_codes": conflicts or [("calendarIncomplete" if missing else "calendarSequenceOnly")],
                "duration_days": None}

    mung_sowing = date(request.season_year, request.planting_month, request.planting_day)
    events_by_stage = {
        "wheat_harvest": request.wheat_harvest_date,
        "mungbean_sowing": mung_sowing,
        "mungbean_harvest": request.mungbean_harvest_date,
        "green_manure_sowing": request.green_manure_sowing_date if identifier == "C" else None,
        "green_manure_end": request.green_manure_end_date if identifier == "C" else None,
        "cotton_sowing": request.cotton_sowing_date,
    }
    ordered = (["wheat_harvest", "mungbean_sowing", "mungbean_harvest", "cotton_sowing"]
               if identifier == "B" else
               ["wheat_harvest", "mungbean_sowing", "mungbean_harvest",
                "green_manure_sowing", "green_manure_end", "cotton_sowing"])
    missing = [key for key in ordered if events_by_stage[key] is None]
    # Compare all *known* stages, not just adjacent fields. If a middle
    # date is missing, an obviously reversed pair must still be rejected.
    known = [events_by_stage[key] for key in ordered if events_by_stage[key] is not None]
    conflicts = [
        "calendarOverlap"
        for previous, following in zip(known, known[1:])
        if previous > following
    ]
    raw_duration = ((request.mungbean_harvest_date - mung_sowing).days
                    if request.mungbean_harvest_date else None)
    # A harvest before sowing is a calendar contradiction, not a negative
    # 'growing period' for display or cultivar-range comparison.
    duration = raw_duration if raw_duration is not None and raw_duration >= 0 else None
    outside_reference = duration is not None and not 70 <= duration <= 75

    if conflicts:
        status, notes = "conflict", ["calendarOverlap"]
    elif missing:
        status, notes = "missing_dates", ["calendarIncomplete"]
    elif outside_reference:
        status, notes = "review", ["calendarDurdonaReference", "calendarSequenceOnly"]
    else:
        status, notes = "chronological_only", ["calendarSequenceOnly"]
    if outside_reference and "calendarDurdonaReference" not in notes:
        notes.append("calendarDurdonaReference")
    if identifier == "C" and "calendarWinterPeaStage" not in notes:
        notes.append("calendarWinterPeaStage")
    return {
        "status": status, "events": [
            {"stage": key, "date": _serial(events_by_stage[key])} for key in ordered
        ], "missing": missing, "note_codes": notes, "duration_days": duration,
    }
