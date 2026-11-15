from __future__ import annotations
from datetime import date
from enum import Enum
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

class Water(str, Enum):
    available = "available"
    limited = "limited"
    none = "none"
    unknown = "unknown"

class Salinity(str, Enum):
    low = "low"
    high = "high"
    unknown = "unknown"

class Priority(str, Enum):
    water = "water"
    income = "income"
    soil = "soil"

class RotationStageInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    crop: Literal["wheat", "mungbean", "green_manure", "cotton", "fallow", "other"]
    sowing_date: date | None = None
    harvest_date: date | None = None

    @model_validator(mode="after")
    def check_stage(self) -> "RotationStageInput":
        if self.sowing_date and self.harvest_date and self.harvest_date < self.sowing_date:
            raise ValueError("Crop harvest must not precede sowing")
        return self


class CalendarEvent(BaseModel):
    stage: str
    date: str | None


class CalendarAssessment(BaseModel):
    status: Literal["not_evaluated", "missing_dates", "conflict", "chronological_only", "review"]
    events: list[CalendarEvent]
    missing: list[str]
    note_codes: list[str]
    duration_days: int | None


class ComparisonRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    water: Water = Water.unknown
    salinity: Salinity = Salinity.unknown
    priority: Priority = Priority.water
    planting_month: int = Field(default=7, ge=6, le=8)
    planting_day: int = Field(default=1, ge=1, le=31)
    equipment_available: bool | None = None
    current_rotation_is_example: bool = True
    current_rotation_description: str = Field(default="", max_length=300)
    current_rotation_stages: list[RotationStageInput] = Field(default_factory=list, max_length=8)

    # These are optional farmer-entered crop dates; none is inferred from satellite data.
    season_year: int = Field(default=2026, ge=2024, le=2099)
    wheat_harvest_date: date | None = None
    mungbean_harvest_date: date | None = None
    green_manure_sowing_date: date | None = None
    green_manure_end_date: date | None = None
    cotton_sowing_date: date | None = None

    # Optional observed or self-reported measurements, never calculated from POWER.
    irrigation_m3_ha: float | None = Field(default=None, ge=0, le=50000, allow_inf_nan=False)
    irrigation_source: Literal["unknown", "farmer_estimate", "metered"] = "unknown"
    irrigation_period: Literal["unknown", "summer_mungbean", "full_rotation"] = "unknown"
    salinity_ece_ds_m: float | None = Field(default=None, ge=0, le=100, allow_inf_nan=False)
    soil_ph: float | None = Field(default=None, ge=0, le=14, allow_inf_nan=False)
    soil_test_source: Literal["unknown", "farmer_estimate", "laboratory"] = "unknown"
    soil_sample_date: date | None = None
    soil_sample_depth_cm: int | None = Field(default=None, ge=1, le=500)

    @model_validator(mode="after")
    def validate_inputs(self) -> "ComparisonRequest":
        try:
            date(2025, self.planting_month, self.planting_day)
        except ValueError as exc:
            raise ValueError("Invalid sowing date") from exc
        if (not self.current_rotation_is_example
                and not self.current_rotation_description
                and not self.current_rotation_stages):
            raise ValueError("Describe the current crop rotation or add structured crop stages")
        fields = {
            "wheat_harvest_date": self.wheat_harvest_date,
            "mungbean_harvest_date": self.mungbean_harvest_date,
            "green_manure_sowing_date": self.green_manure_sowing_date,
            "green_manure_end_date": self.green_manure_end_date,
            "cotton_sowing_date": self.cotton_sowing_date,
        }
        for name, value in fields.items():
            expected = self.season_year + (name in {"green_manure_end_date", "cotton_sowing_date"})
            if value and value.year != expected:
                raise ValueError(f"{name} must be in {expected}; change season_year if required")
        if self.irrigation_m3_ha is not None and (
                self.irrigation_period == "unknown" or self.irrigation_source == "unknown"):
            raise ValueError("Irrigation quantity requires a time period and stated source")
        if (self.salinity_ece_ds_m is not None or self.soil_ph is not None) and self.soil_test_source == "unknown":
            raise ValueError("Soil values require a measurement source")
        return self

class ClimateMetrics(BaseModel):
    total_precipitation_mm: float
    hot_days_40c: int
    frost_days_0c: int
    year: int

class MonthMetrics(BaseModel):
    month: int
    precipitation_mm: float
    hot_days_40c: int
    frost_days_0c: int

class MonthlyClimate(BaseModel):
    year: int
    months: list[MonthMetrics] = Field(min_length=12, max_length=12)


class CropSourceRecord(BaseModel):
    publisher: str
    label: str
    url: str


class CropReferenceRecord(BaseModel):
    """Literature reference only, never a field-specific crop prediction."""
    id: Literal["wheat", "mungbean", "green_manure", "cotton"]
    scientific_name: str
    growing_period_days: list[int] | None = Field(default=None, min_length=2, max_length=2)
    growing_period_scope: str | None
    temperature_optimum_c: list[float] | None = Field(default=None, min_length=2, max_length=2)
    soil_ph_optimum: list[float] | None = Field(default=None, min_length=2, max_length=2)
    salinity_note_code: str
    seasonal_water_need_mm: list[float] | None = Field(default=None, min_length=2, max_length=2)
    water_scope: str | None
    source_ids: list[str] = Field(min_length=1)
    metric_source_ids: dict[
        Literal["growing_period_days", "temperature_optimum_c", "soil_ph_optimum",
                "salinity_note_code", "seasonal_water_need_mm"], list[str]
    ]
    notes: list[str]


class CropCatalogResponse(BaseModel):
    crops: list[CropReferenceRecord] = Field(min_length=4, max_length=4)
    sources: dict[str, CropSourceRecord]
    disclaimer: str


class HealthResponse(BaseModel):
    status: Literal["ok"]
    records: int = Field(ge=1)
    source: str

class EvidenceEntry(BaseModel):
    id: str
    publisher: str
    name: str
    url: str | None
    type: str
    role: str
    limitation: str
    documentation_url: str | None = None

class ImpactEntry(BaseModel):
    dimension: Literal["water", "soil_cover", "nutrients", "pests", "labor", "market"]
    assessment: Literal["unknown", "conditional", "risk"]
    note: str
    note_code: str

class RotationResult(BaseModel):
    id: Literal["A", "B", "C"]
    title: str
    title_key: str
    description: str
    description_key: str
    evidence: str
    evidence_key: str
    warnings: list[str]
    warnings_codes: list[str]
    evidence_points: list[str]
    evidence_points_codes: list[str]
    unknowns: list[str]
    unknowns_codes: list[str]
    status: Literal["compare", "conditional", "needs-data", "water-risk", "limited-water-risk", "calendar-conflict"]
    impacts: list[ImpactEntry]
    source_ids: list[str]
    calendar: CalendarAssessment


class FieldEvidenceCheck(BaseModel):
    dimension: Literal["irrigation", "soil", "rotation"]
    source: Literal[
        "not_supplied", "farmer_estimate", "reported_metered",
        "reported_laboratory", "research_example", "farmer_description",
    ]
    note_code: str
    note: str
    needs_review: bool

class ComparisonResponse(BaseModel):
    sample_years: int
    sowing_date: str
    days_per_window: int
    mean_hot_days_40c: float
    years_with_frost: int
    annual_rain_mm_2025: float
    mean_rain_mm_window: float = Field(ge=0)
    min_rain_mm_window: float = Field(ge=0)
    max_rain_mm_window: float = Field(ge=0)
    rotations: list[RotationResult]
    disclaimer: str
    disclaimer_code: str
    climate_source_ids: list[str]
    field_evidence: list[FieldEvidenceCheck]
