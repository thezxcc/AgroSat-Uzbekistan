import type { ImpactEntry } from './types'
import type { TranslationKey } from './i18n'

export const dimensionKeys: Record<ImpactEntry['dimension'], TranslationKey> = {
  water: 'impactDimensionWater',
  soil_cover: 'impactDimensionSoil',
  nutrients: 'impactDimensionNutrients',
  pests: 'impactDimensionPests',
  labor: 'impactDimensionLabor',
  market: 'impactDimensionMarket',
}

export const assessmentKeys: Record<ImpactEntry['assessment'], TranslationKey> = {
  risk:'impactStatusRisk',
  conditional:'impactStatusConditional',
  unknown:'impactStatusUnknown',
}
