export type Water = 'unknown' | 'available' | 'limited' | 'none'
export type Salinity = 'unknown' | 'low' | 'high'
export type Priority = 'water' | 'income' | 'soil'

export type CropId = 'wheat' | 'mungbean' | 'green_manure' | 'cotton' | 'fallow' | 'other'

export interface FarmerCropStage {
  crop: CropId
  sowing_date: string | null
  harvest_date: string | null
}

export interface CalendarAssessment {
  status: 'not_evaluated' | 'missing_dates' | 'conflict' | 'chronological_only' | 'review'
  events: {stage: string; date: string | null}[]
  missing: string[]
  note_codes: string[]
  duration_days: number | null
}

export interface CropReference {
  id: string
  scientific_name: string
  growing_period_days: number[] | null
  growing_period_scope: string | null
  temperature_optimum_c: number[] | null
  soil_ph_optimum: number[] | null
  salinity_note_code: string
  seasonal_water_need_mm: number[] | null
  water_scope: string | null
  source_ids: string[]
  /** Original evidence for each measured/reference field, never implied from a generic crop source. */
  metric_source_ids: Partial<Record<
    'growing_period_days' | 'temperature_optimum_c' | 'soil_ph_optimum' |
    'salinity_note_code' | 'seasonal_water_need_mm', string[]>>
  notes: string[]
}

export interface CropCatalog {
  crops: CropReference[]
  sources: Record<string,{publisher: string; label: string; url: string}>
  disclaimer: string
}

export interface FarmInput {
  water: Water
  salinity: Salinity
  priority: Priority
  planting_month: number
  planting_day: number
  equipment_available: boolean | null
  current_rotation_is_example: boolean
  current_rotation_description: string
  current_rotation_stages: FarmerCropStage[]
  season_year: number
  wheat_harvest_date: string | null
  mungbean_harvest_date: string | null
  green_manure_sowing_date: string | null
  green_manure_end_date: string | null
  cotton_sowing_date: string | null
  irrigation_m3_ha: number | null
  irrigation_source: 'unknown' | 'farmer_estimate' | 'metered'
  irrigation_period: 'unknown' | 'summer_mungbean' | 'full_rotation'
  salinity_ece_ds_m: number | null
  soil_ph: number | null
  soil_test_source: 'unknown' | 'farmer_estimate' | 'laboratory'
  soil_sample_date: string | null
  soil_sample_depth_cm: number | null
}

export interface ClimateSummary {
  year: number
  total_precipitation_mm: number
  hot_days_40c: number
  frost_days_0c: number
}

export interface MonthlyClimate {
  year: number
  months: {
    month: number
    precipitation_mm: number
    hot_days_40c: number
    frost_days_0c: number
  }[]
}

export interface ImpactEntry {
  dimension: 'water' | 'soil_cover' | 'nutrients' | 'pests' | 'labor' | 'market'
  assessment: 'risk' | 'conditional' | 'unknown'
  note: string
  note_code: string
}

export interface RotationResult {
  id: 'A' | 'B' | 'C'
  title: string
  title_key: string
  description: string
  description_key: string
  evidence: string
  evidence_key: string
  warnings: string[]
  warnings_codes: string[]
  evidence_points: string[]
  evidence_points_codes: string[]
  unknowns: string[]
  unknowns_codes: string[]
  status: 'compare' | 'conditional' | 'needs-data' | 'water-risk' | 'limited-water-risk' | 'calendar-conflict'
  impacts: ImpactEntry[]
  source_ids: string[]
  calendar: CalendarAssessment
}

export interface EvidenceSource {
  id: string
  publisher: string
  name: string
  url: string | null
  type: string
  role: string
  limitation: string
  documentation_url?: string | null
}

export interface FieldEvidenceCheck {
  dimension: 'soil' | 'irrigation' | 'rotation'
  source: 'not_supplied' | 'farmer_estimate' | 'reported_metered' |
    'reported_laboratory' | 'research_example' | 'farmer_description'
  note_code: string
  note: string
  needs_review: boolean
}

export interface Comparison {
  sample_years: number
  sowing_date: string
  days_per_window: number
  mean_hot_days_40c: number
  years_with_frost: number
  annual_rain_mm_2025: number
  mean_rain_mm_window: number
  min_rain_mm_window: number
  max_rain_mm_window: number
  rotations: RotationResult[]
  disclaimer: string
  disclaimer_code: string
  climate_source_ids: string[]
  field_evidence: FieldEvidenceCheck[]
}
