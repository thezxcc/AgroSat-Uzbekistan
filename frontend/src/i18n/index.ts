import { uiEn, uiRu, uiUz } from './ui'
import { scienceEn, scienceRu, scienceUz } from './science'
import { impactEn, impactRu, impactUz } from './impact'
import { agronomyEn, agronomyRu, agronomyUz } from './agronomy'

export const translations = {
  en: { ...uiEn, ...scienceEn, ...impactEn, ...agronomyEn },
  ru: { ...uiRu, ...scienceRu, ...impactRu, ...agronomyRu },
  uz: { ...uiUz, ...scienceUz, ...impactUz, ...agronomyUz },
}
export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en

export const languageLabels: Record<Language, string> = {
  en: 'English', ru: 'Русский', uz: 'O‘zbekcha',
}
export const languageLocales: Record<Language, string> = {
  en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ',
}
export function t(language: Language, key: TranslationKey, replacements?: Record<string, string | number>): string {
  const template: string = translations[language][key]
  if (!template) throw new Error('Missing translation: ' + language + '/' + key)
  return template.replace(/\{(\w+)\}/g, (_, variable: string) =>
    replacements && variable in replacements ? String(replacements[variable]) : '{' + variable + '}'
  )
}
