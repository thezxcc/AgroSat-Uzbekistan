"""Quality and provenance checks for field data supplied by a farmer.

These checks do NOT classify soil ECe, infer crop water adequacy, or validate
a claimed lab/meter reading. A category refers to the farmer's assessment;
an ECe value is a separate observation with a separate source and date.
"""
from __future__ import annotations

from .schemas import ComparisonRequest


def _notice(dimension: str, source: str, code: str, note: str, review: bool = False) -> dict:
    return {
        "dimension": dimension, "source": source,
        "note_code": code, "note": note, "needs_review": review,
    }


def field_evidence(request: ComparisonRequest) -> list[dict]:
    findings: list[dict] = []

    if request.irrigation_m3_ha is None:
        findings.append(_notice(
            "irrigation", "not_supplied", "irrigationVolumeMissing",
            "An irrigation volume for a stated period has not been supplied.",
        ))
    elif request.irrigation_source == "farmer_estimate":
        findings.append(_notice(
            "irrigation", "farmer_estimate", "irrigationEstimateUnverified",
            "The entered irrigation quantity is a farmer estimate, not a verified "
            "meter reading. It cannot establish crop water adequacy.",
        ))
    else:
        findings.append(_notice(
            "irrigation", "reported_metered", "irrigationMeasurementLimited",
            "The farmer reports metered or documented irrigation for a stated period. "
            "The record has not been independently checked; crop water need and delivery "
            "timing are not modelled.",
        ))

    # Only flag apparent differences when both values concern the same summer crop
    # interval. Irrigation for the whole rotation cannot be assigned to mung bean.
    if (request.irrigation_m3_ha is not None
            and request.irrigation_period == "summer_mungbean"
            and ((request.water.value == "none" and request.irrigation_m3_ha > 0)
                 or (request.water.value == "available" and request.irrigation_m3_ha == 0))):
        findings.append(_notice(
            "irrigation",
            "farmer_estimate" if request.irrigation_source == "farmer_estimate"
            else "reported_metered",
            "irrigationCategoryUnreconciled",
            "The reported water availability and recorded summer irrigation may describe "
            "different dates or circumstances. Ask the farmer to reconcile them; "
            "neither proves water will be available for the planned crop.",
            review=True,
        ))

    if request.salinity_ece_ds_m is None:
        source = ("reported_laboratory" if request.soil_test_source == "laboratory"
                  and request.soil_ph is not None else
                  "farmer_estimate" if request.soil_test_source == "farmer_estimate"
                  and request.soil_ph is not None else "not_supplied")
        findings.append(_notice(
            "soil", source, "soilEceMissing",
            "No field soil ECe measurement has been provided. A qualitative salinity "
            "choice is not a laboratory result.",
        ))
    if request.salinity_ece_ds_m is not None or request.soil_ph is not None:
        if request.soil_test_source == "farmer_estimate":
            findings.append(_notice(
                "soil", "farmer_estimate", "soilEstimateUnverified",
                "The entered soil values are farmer estimates, not independently "
                "verified laboratory analyses or calibrated crop tolerance.",
            ))
        elif request.soil_test_source == "laboratory":
            findings.append(_notice(
                "soil", "reported_laboratory", "soilMeasurementLimited",
                "The farmer reports laboratory soil measurements. The report has not "
                "been independently verified and there is no calibrated local "
                "cultivar-specific yield response.",
            ))
            if request.soil_sample_date is None or request.soil_sample_depth_cm is None:
                findings.append(_notice(
                    "soil", "reported_laboratory", "soilLabMetadataIncomplete",
                    "The claimed laboratory soil result lacks a sampling date and/or "
                    "depth; check the report before using it for field decisions.",
                    review=True,
                ))
        # An absolute ECe value has no universal translation to a user-chosen
        # 'low' or 'high' class valid for all crops and soils.
        if (request.salinity_ece_ds_m is not None
                and request.salinity.value != "unknown"):
            findings.append(_notice(
                "soil",
                "farmer_estimate" if request.soil_test_source == "farmer_estimate"
                else "reported_laboratory",
                "soilCategoryUncalibrated",
                "The farmer's low/high salinity category is not derived from ECe by "
                "a validated local crop-specific threshold. Compare the lab report, "
                "sampling context and cultivar before interpreting the two together.",
                review=True,
            ))

    findings.append(_notice(
        "rotation",
        "research_example" if request.current_rotation_is_example else "farmer_description",
        "baselineResearchExample" if request.current_rotation_is_example else "baselineFarmerUnverified",
        "Rotation A is an illustrative literature example, not verified as the "
        "farmer's current practice."
        if request.current_rotation_is_example else
        "The farmer's crop sequence and dates are self-reported. Their order can be "
        "checked, but agronomic impacts and yields are not field-validated.",
    ))
    return findings
