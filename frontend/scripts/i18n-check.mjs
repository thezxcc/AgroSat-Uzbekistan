import { uiEn, uiRu, uiUz } from '../src/i18n/ui.ts'
import { scienceEn, scienceRu, scienceUz } from '../src/i18n/science.ts'
import { impactEn, impactRu, impactUz } from '../src/i18n/impact.ts'
import { agronomyEn, agronomyRu, agronomyUz } from '../src/i18n/agronomy.ts'

const catalogs = {
  ui: {en: uiEn, ru: uiRu, uz: uiUz},
  science: {en: scienceEn, ru: scienceRu, uz: scienceUz},
  impact: {en: impactEn, ru: impactRu, uz: impactUz},
  agronomy: {en: agronomyEn, ru: agronomyRu, uz: agronomyUz},
}
const failures=[]
let checked=0
function placeholders(text) {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]))].sort().join(',')
}
for(const [name,book] of Object.entries(catalogs)) {
  const originalKeys=Object.keys(book.en).sort()
  for(const [locale,translations] of Object.entries(book)) {
    const allKeys=Object.keys(translations).sort()
    if(originalKeys.join('|')!==allKeys.join('|')) {
      failures.push(`${name} ${locale}: inconsistent key set`)
    }
    for(const key of originalKeys) {
      const source=book.en[key]
      const translated=translations[key]
      if(typeof translated!=='string'||!translated.trim()) {
        failures.push(`${name} ${locale}: ${key} missing`)
        continue
      }
      if(placeholders(source)!==placeholders(translated)) {
        failures.push(`${name} ${locale}: ${key} mismatched placeholders`)
      }
      checked+=1
    }
  }
}
if(failures.length) {
  console.error(failures.join('\n'))
  process.exitCode=1
} else {
  console.log(`PASS: ${checked} localized messages checked (English, Russian, Uzbek, matching parameter placeholders).`)
}
