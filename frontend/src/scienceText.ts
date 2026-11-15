/** Canonical localization of scientific API reason codes.
 * English API text is a fallback only; climate values come from the response,
 * never from translated or user-supplied text.
 */
import { languageLocales, t, translations, type Language, type TranslationKey } from './i18n'
import type { Comparison, RotationResult } from './types'

export const rotationStatusKeys: Record<RotationResult['status'], TranslationKey> = {
  compare: 'statusCompare',
  conditional: 'statusConditional',
  'needs-data': 'statusNeedsData',
  'water-risk': 'statusWaterRisk',
  'limited-water-risk': 'statusLimitedWaterRisk',
  'calendar-conflict': 'statusCalendarConflict',
}

export function scientificText(
  language: Language,
  result: Comparison,
  code: string,
  englishFallback: string,
): string {
  if (!(code in translations[language])) return englishFallback
  const hot=new Intl.NumberFormat(languageLocales[language],{maximumFractionDigits:1})
    .format(result.mean_hot_days_40c)
  return t(language, code as TranslationKey, {
    hot,
    frost: result.years_with_frost,
    years: result.sample_years,
  })
}
