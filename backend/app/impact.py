from __future__ import annotations
from .schemas import ComparisonRequest

DIMENSIONS = ("water", "soil_cover", "nutrients", "pests", "labor", "market")

def item(dimension: str, assessment: str, code: str, message: str) -> dict:
    return {
        "dimension": dimension,
        "assessment": assessment,
        "note_code": code,
        "note": message,
    }

def rotation_impacts(identifier: str, request: ComparisonRequest) -> list[dict]:
    """Qualitative evidence matrix; no crop yields, scores or savings are inferred."""
    if identifier not in ("A", "B", "C"):
        raise ValueError(f"Unknown rotation identifier: {identifier}")
    if identifier == "A" and not request.current_rotation_is_example:
        return [
            item(d, "unknown", "impactCustomUnknown",
                 "Farmer's rotation is not yet described in sufficient detail to assess this dimension.")
            for d in DIMENSIONS
        ]

    if identifier == "A":
        return [
            item("water", "unknown", "impactAwater",
                 "Rainfall alone does not determine how much irrigation a fallow field receives."),
            item("soil_cover", "conditional", "impactAcover",
                 "A fallow interval may lack a living cover crop; retained residues can change exposure."),
            item("nutrients", "unknown", "impactAnutrients",
                 "Fallow does not by itself prove improvement in nitrogen or organic matter."),
            item("pests", "unknown", "impactApests",
                 "Pest or disease reduction depends on the organisms, residues and management."),
            item("labor", "conditional", "impactAlabor",
                 "No additional summer harvest is planned, but field maintenance may still be required."),
            item("market", "conditional", "impactAmarket",
                 "No extra summer crop is sold in this scenario; other economic effects are not measured."),
        ]

    if request.water.value == "none":
        water = item("water", "risk", "impactWaterNone",
                     "Without confirmed irrigation or usable stored soil water, summer cropping has high water risk.")
    elif request.water.value == "available":
        water = item("water", "conditional", "impactWaterAvailable",
                     "Access to irrigation is reported, but volume, timing and crop water requirement are unknown.")
    elif request.water.value == "limited":
        water = item("water", "risk", "impactWaterLimited",
                     "Limited irrigation may prevent crop establishment or completion; verify delivered water.")
    else:
        water = item("water", "unknown", "impactWaterUnknown",
                     "Water supply is unknown, so summer crop feasibility cannot be established.")

    if identifier == "B":
        return [
            water,
            item("soil_cover", "conditional", "impactBcover",
                 "Mung bean may shorten the period without a living crop after wheat, if planting succeeds."),
            item("nutrients", "conditional", "impactBnutrients",
                 "As a legume, mung bean may contribute to nitrogen cycling; net soil benefit is not measured."),
            item("pests", "unknown", "impactBpests",
                 "A different crop can change pest and disease cycles, but local pest pressure is unknown."),
            item("labor", "conditional", "impactBlabor",
                 "Sowing, irrigation, harvesting and cleaning add field operations."),
            item("market", "unknown", "impactBmarket",
                 "A possible mung bean harvest has no calculated profit without prices, costs and yields."),
        ]
    return [
        water,
        item("soil_cover", "conditional", "impactCcover",
             "Green manure may extend living soil cover, but depends on an achievable crop calendar."),
        item("nutrients", "conditional", "impactCnutrients",
             "Green manure may increase organic inputs; changes must be demonstrated by soil tests."),
        item("pests", "unknown", "impactCpests",
             "Effects on pests and diseases depend on species, timing and local observations."),
        item("labor", "conditional", "impactClabor",
             "The extra green-manure stage adds establishment and soil-incorporation work."),
        item("market", "unknown", "impactCmarket",
             "Green manure is not assumed to have a market harvest; total costs and returns are unmeasured."),
    ]
