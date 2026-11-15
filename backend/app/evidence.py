"""Reviewed scientific data and publication registry.

Registry URLs are anchored to the V10 research evidence book. Individual links
identify evidence provenance, not guarantee transferability to a specific farm.
"""
from __future__ import annotations

from dataclasses import dataclass

@dataclass(frozen=True)
class Evidence:
    id: str
    publisher: str
    name: str
    url: str | None
    type: str
    role: str
    limitation: str
    documentation_url: str | None = None

SOURCES: dict[str, Evidence] = {
    "nasa_imerg": Evidence(
        "nasa_imerg", "NASA GPM / NASA POWER",
        "GPM IMERG-derived precipitation (IMERG_PRECTOT), 2000–2025",
        "https://power.larc.nasa.gov/",
        "earth_observation",
        "Historical regional daily precipitation used to characterize seasonal exposure.",
        "Point/grid-scale estimate, not the water delivered by an irrigation canal.",
        "https://power.larc.nasa.gov/docs/methodology/data/sources_meteorology/",
    ),
    "nasa_power": Evidence(
        "nasa_power", "NASA POWER",
        "Daily maximum and minimum air temperature (T2M_MAX, T2M_MIN), 2000–2025",
        "https://power.larc.nasa.gov/",
        "reanalysis",
        "Historical heat and frost counts in hypothetical crop-growing windows.",
        "Reanalysis gridded estimates, not a field thermometer or crop yield forecast.",
        "https://power.larc.nasa.gov/docs/services/api/temporal/daily/",
    ),
    "icarda_mungbean_2022": Evidence(
        "icarda_mungbean_2022", "ICARDA / CGIAR",
        "Farmers' Field Day Demonstrates Improved Variety and Production Practices to Grow Mungbean Crops in Innovative Crop Rotations in Khorezm (2022)",
        "https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8",
        "regional_study",
        "Local example of early maturing mung bean (Durdona), sowing date and post-wheat production considerations.",
        "Demonstration study and specific variety; not proof of harvest or profitability for every farm.",
    ),
    "icarda_rotation_2023": Evidence(
        "icarda_rotation_2023", "ICARDA / GIZ / CGIAR",
        "A short-duration mungbean variety shows potential to sustain wheat-cotton rotation through soil improvement besides additional income and improved human nutrition in the Aral Sea Region (2023)",
        "https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588",
        "regional_study",
        "Research on winter wheat-cotton and wheat-mung bean-green manure-cotton rotation variants.",
        "Outcomes are from specific trial settings; our B variant was not a separate measured arm in the same comparison.",
    ),
    "farmer_inputs": Evidence(
        "farmer_inputs", "User-provided",
        "Farm water, soil, equipment, purpose and current rotation",
        None,
        "unverified_input",
        "Constraints entered in the form; they change conditional eligibility flags.",
        "Self-report is not independently validated and no actual farm measurements are collected.",
    ),
}

def registry() -> list[dict]:
    return [vars(source) for source in SOURCES.values()]

def references_for_rotation(identifier: str, is_example: bool) -> list[str]:
    if identifier not in ("A", "B", "C"):
        raise ValueError(f"Unknown rotation identifier: {identifier}")
    if identifier == "A" and not is_example:
        return ["farmer_inputs"]
    if identifier == "A":
        return ["icarda_rotation_2023", "farmer_inputs"]
    if identifier == "B":
        return ["icarda_mungbean_2022", "farmer_inputs", "nasa_power"]
    return ["icarda_rotation_2023", "farmer_inputs", "nasa_power"]
