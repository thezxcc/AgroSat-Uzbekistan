"""Conservative reference catalog from source documents, not a prediction engine.

Do not treat broad FAO ranges as the actual irrigation supply or crop demand
on a single Khorezm field. Mungbean water needs are deliberately UNQUANTIFIED:
FAO's generic 'bean' entry is not verified for Durdona Vigna radiata.
"""
from __future__ import annotations

CROP_REFERENCES = [
    {
        "id": "wheat", "scientific_name": "Triticum spp.",
        "growing_period_days": None, "growing_period_scope": None,
        "temperature_optimum_c": None,
        "soil_ph_optimum": None, "salinity_note_code": "cropSaltUnknown",
        "seasonal_water_need_mm": [450, 650],
        "water_scope": "FAO indicative cereal wheat water requirement, entire growing season; not delivered irrigation.",
        "metric_source_ids": {"seasonal_water_need_mm": ["fao_water"]},
        "source_ids": ["fao_water"],
        "notes": ["Variety and autumn/winter conditions must be confirmed locally."],
    },
    {
        "id": "mungbean", "scientific_name": "Vigna radiata",
        "growing_period_days": [70, 75],
        "growing_period_scope": "Khorezm example: early cultivar Durdona (ICARDA 2022), not all mung beans.",
        "temperature_optimum_c": [21, 36],
        "soil_ph_optimum": [5.5, 6.2],
        "salinity_note_code": "cropSaltMung",
        "seasonal_water_need_mm": None, "water_scope": None,
        "metric_source_ids": {
            "growing_period_days": ["icarda_mungbean_2022"],
            "temperature_optimum_c": ["fao_ecocrop"],
            "soil_ph_optimum": ["fao_ecocrop"],
            "salinity_note_code": ["fao_ecocrop"],
        },
        "source_ids": ["icarda_mungbean_2022", "fao_ecocrop", "uz_durdona_2026"],
        "notes": ["EcoCrop species ranges are indicative, not local cultivar flowering tolerance.",
                  "Annual EcoCrop rainfall cannot be equated with summer irrigation requirement.",
                  "A 2026 Uzbek cultivar comparison reports 70–76 days for Durdona under studied conditions, not a calibration for all Khorezm fields."],
    },
    {
        "id": "green_manure", "scientific_name": "Pisum sativum (winter pea example)",
        "growing_period_days": None, "growing_period_scope": None,
        "temperature_optimum_c": None, "soil_ph_optimum": None,
        "salinity_note_code": "cropSaltUnknown",
        "seasonal_water_need_mm": None, "water_scope": None,
        "metric_source_ids": {},
        "source_ids": ["icarda_rotation_2023"],
        "notes": ["Winter pea is planted AFTER mung bean harvest; a separate season before cotton.",
                  "No locally verified soil improvement percentage or water demand is supplied."],
    },
    {
        "id": "cotton", "scientific_name": "Gossypium hirsutum",
        "growing_period_days": None, "growing_period_scope": None,
        "temperature_optimum_c": None, "soil_ph_optimum": None,
        "salinity_note_code": "cropSaltCotton",
        "seasonal_water_need_mm": [700, 1300],
        "water_scope": "FAO indicative cotton crop water requirement, entire growing season; not irrigation supply.",
        "metric_source_ids": {
            "seasonal_water_need_mm": ["fao_water"],
            "salinity_note_code": ["fao_salinity"],
        },
        "source_ids": ["fao_water", "fao_salinity"],
        "notes": ["FAO historical soil ECe salt threshold of 7.7 dS/m is species-level reference, not a field yield calculation."],
    },
]

CROP_SOURCES = {
    "fao_water": {
        "publisher": "FAO", "label": "Crop water needs — training manual Chapter 3",
        "url": "https://www.fao.org/4/s2022e/s2022e07.htm",
    },
    "fao_ecocrop": {
        "publisher": "FAO EcoCrop", "label": "Vigna radiata ecology",
        "url": "https://ecocrop.apps.fao.org/ecocrop/srv/en/dataSheet?id=2150",
    },
    "fao_salinity": {
        "publisher": "FAO", "label": "Crop salt tolerance (Maas 1986), historical reference",
        "url": "https://www.fao.org/4/T0667E/t0667e07.htm",
    },
    "icarda_mungbean_2022": {
        "publisher": "ICARDA", "label": "2022 Durdona mung bean demonstration, Khorezm",
        "url": "https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8",
    },
    "icarda_rotation_2023": {
        "publisher": "ICARDA/GIZ", "label": "2023 wheat–mung bean–green manure–cotton",
        "url": "https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588",
    },
    "uz_durdona_2026": {
        "publisher": "Agrobusiness, Science and Technology (2026)",
        "label": "Durdona vs Hosildor phenology: cultivar and planting-date effects",
        "url": "https://agrobiznesjournal.uz/index.php/ast/article/view/485",
    },
}
