from __future__ import annotations

from .schemas import ComparisonRequest
from .repository import planting_windows, year_summary
from .impact import rotation_impacts
from .evidence import references_for_rotation
from .calendar import assess_calendar
from .field_evidence import field_evidence

# Every scientific explanation has a stable language-independent code. The
# English string preserves backwards compatibility for API consumers; web
# clients localize the code without changing the underlying scientific rules.
Message = tuple[str, str]


def _message_bundle(items: list[Message], name: str) -> dict:
    return {name: [text for _, text in items], f"{name}_codes": [code for code, _ in items]}


def _rotation(
    identifier: str,
    title_key: str,
    title: str,
    description_key: str,
    description: str,
    evidence_key: str,
    evidence: str,
    status: str,
    warnings: list[Message],
    evidence_points: list[Message],
    unknowns: list[Message],
) -> dict:
    return {
        "id": identifier,
        "title": title,
        "title_key": title_key,
        "description": description,
        "description_key": description_key,
        "evidence": evidence,
        "evidence_key": evidence_key,
        "status": status,
        **_message_bundle(warnings, "warnings"),
        **_message_bundle(evidence_points, "evidence_points"),
        **_message_bundle(unknowns, "unknowns"),
    }


def compare_rotations(request: ComparisonRequest) -> dict:
    climate = planting_windows(request.planting_month, request.planting_day)
    sowing_date = f"{request.planting_month:02d}-{request.planting_day:02d}"

    observations = field_evidence(request)
    shared_unknowns: list[Message] = [
        (item["note_code"], item["note"]) for item in observations
        if item["dimension"] in ("irrigation", "soil")
        and item["note_code"] != "irrigationCategoryUnreconciled"
    ]
    if request.equipment_available is None:
        shared_unknowns.append(("machineryMissing", "Machinery availability has not been confirmed."))

    if request.current_rotation_is_example:
        baseline = _rotation(
            "A", "rotationA.title", "Wheat → fallow → cotton",
            "rotationA.description",
            "Illustrative research baseline; it is NOT the farmer's verified current rotation.",
            "rotationA.evidence", "Published regional crop-rotation research (ICARDA/GIZ); demonstration case only.",
            "compare",
            [("fallowNotRecovery", "Fallow is not proof of soil recovery; irrigation and soil outcomes still require evaluation.")],
            [
                ("noExtraHarvest", "No additional summer market crop in the modeled gap."),
                ("fewerOperations", "Fewer assumed summer field operations than added-crop scenarios."),
            ],
            list(shared_unknowns),
        )
    else:
        supplied = request.current_rotation_description.strip() or " → ".join(
            stage.crop.replace("_", " ") for stage in request.current_rotation_stages
        )
        baseline = _rotation(
            "A", "rotationA.customTitle", supplied,
            "rotationA.customDescription",
            "Farmer-provided description. No crop-specific quantitative impacts assumed.",
            "rotationA.customEvidence", "User-supplied baseline, not independently validated.",
            "compare",
            [("customNotEvaluated", "No agronomic impacts are calculated for an unspecified user-provided rotation.")],
            [("customNeedsValidation", "Farmer-provided description only; verify crops, calendar and field conditions.")],
            [*shared_unknowns, ("rotationDetailsMissing", "Current rotation needs calendar, inputs and field verification.")],
        )

    exposure: Message = (
        "climateWindow",
        f"Historical 75-day window: {climate['mean_hot_days_40c']} days/year with Tmax ≥40°C "
        f"and frost in {climate['years_with_frost']} of {climate['sample_years']} years. "
        "Climate-cell estimates, not a yield prediction.",
    )

    def candidate(identifier: str) -> dict:
        warnings: list[Message] = [exposure]
        unknowns: list[Message] = list(shared_unknowns)
        status = "needs-data"
        if request.water.value == "none":
            status = "water-risk"
            warnings.append(("noIrrigation", "Additional summer crops cannot be recommended without confirmed irrigation or stored soil water."))
        elif request.water.value == "limited":
            # Distinguish insufficient water from confirmed absence of irrigation.
            status = "limited-water-risk"
            warnings.append(("irrigationUncertain", "Irrigation feasibility remains uncertain."))
        elif request.water.value == "available":
            status = "conditional"
            if request.irrigation_m3_ha is not None:
                warnings.append(("irrigationNeedUncalibrated",
                    "Reported irrigation amount does not establish whether it meets crop needs; "
                    "it may be an estimate. Timing and soil water remain unknown."))
            else:
                warnings.append(("irrigationUnquantified",
                    "Water availability reported, but crop irrigation need and delivery are not quantified."))
        else:
            warnings.append(("irrigationUncertain", "Irrigation feasibility remains uncertain."))
        for item in observations:
            if item["note_code"] == "irrigationCategoryUnreconciled":
                warnings.append((item["note_code"], item["note"]))
        if request.salinity.value == "high":
            warnings.append(("salinityHigh", "Elevated salinity reported: mung bean salt tolerance is not locally calibrated."))
        if request.equipment_available is False:
            warnings.append(("equipmentAbsent", "Field operations may not be feasible with available equipment."))
        if identifier == "C":
            warnings.append(("greenManureWater", "A green-manure crop adds operations and may add water demand."))
            warnings.append(("greenManureSeason",
                "The ICARDA example grows winter pea AFTER mung bean harvest. "
                "It is a separate seasonal stage, not part of this 75-day mung bean window; "
                "verify enough time before the next cotton crop."))
        unknowns.extend([
            ("yieldUnknown", "Yield, irrigation requirement and profit are NOT predicted."),
            ("varietyPhenologyMissing", "Variety-specific flowering stress and field observations are needed."),
        ])
        evidence_points: list[Message] = [
            ("possibleAdditionalHarvest", "Fast-maturing mung bean may provide an additional harvest if season and irrigation permit."),
            ("legumeBenefitsUnproven", "Legumes may contribute to rotation diversity; benefits require local field confirmation."),
        ]
        if request.priority.value == "soil" and identifier == "C":
            evidence_points.append(("soilGoal", "User priority: soil condition; impacts not quantified."))
        elif request.priority.value == "income":
            unknowns.append(("profitInputsMissing", "Local farm-gate price and itemized production costs needed to compare income."))
        elif request.priority.value == "water":
            unknowns.append(("waterSavingsUnverified", "Water-saving claims require measured irrigation, evapotranspiration and field validation."))

        is_c = identifier == "C"
        return _rotation(
            identifier,
            "rotationC.title" if is_c else "rotationB.title",
            "Wheat → mung bean → green manure → cotton" if is_c else "Wheat → mung bean → cotton",
            "rotationC.description" if is_c else "rotationB.description",
            ("Cover/green manure adds potential soil-management benefits, with additional season and water constraints."
             if is_c else "Potential additional summer crop; timing, irrigation, salinity and next-crop constraints must be checked."),
            "rotationBC.evidence",
            "ICARDA/GIZ literature; B is a research alternative, not a measured arm of the same field trial.",
            status, warnings, evidence_points, unknowns,
        )

    rotations = [baseline, candidate("B"), candidate("C")]
    for option in rotations:
        option["impacts"] = rotation_impacts(option["id"], request)
        option["source_ids"] = references_for_rotation(option["id"], request.current_rotation_is_example)
        option["calendar"] = assess_calendar(request, option["id"])
        # Surface known date conflicts in the card summary for the user's
        # own baseline A too, not only the two research alternatives B/C.
        if option["calendar"]["status"] == "conflict":
            if option["status"] != "water-risk":
                option["status"] = "calendar-conflict"
            option["warnings_codes"].append("calendarOverlap")
            option["warnings"].append(
                "Reported dates overlap, so this crop sequence needs correction before it can be considered."
            )

    return {
        **climate,
        "sowing_date": sowing_date,
        "annual_rain_mm_2025": year_summary(2025)["total_precipitation_mm"],
        "rotations": rotations,
        "disclaimer": "Educational regional comparison only. No farm-specific yield, income, soil salinity or irrigation volume is inferred from satellite climate cells.",
        "disclaimer_code": "scientificDisclaimer",
        "climate_source_ids": ["nasa_imerg", "nasa_power"],
        "field_evidence": observations,
    }
