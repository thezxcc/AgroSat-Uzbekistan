import { BookOpen } from 'lucide-react'
import { t, translations, type Language, type TranslationKey } from '../i18n'
import type { ImpactEntry } from '../types'
import { dimensionKeys, assessmentKeys } from '../impactLabels'

export function ImpactDetails({language,entries}:{language: Language,entries: ImpactEntry[]}) {
  return <details className="impact-details">
    <summary><BookOpen size={16}/>{t(language,'impactTitle')}</summary>
    <p className="impact-intro">{t(language,'impactExplain')}</p>
    <div className="impact-items">{entries.map(entry=><div className="impact-item" key={entry.dimension}>
      <div className="impact-heading"><strong>{t(language,dimensionKeys[entry.dimension])}</strong>
        <span className={'impact-level '+entry.assessment}>{t(language,assessmentKeys[entry.assessment])}</span>
      </div>
      <p>{entry.note_code in translations[language]
        ? t(language,entry.note_code as TranslationKey)
        : entry.note}</p>
    </div>)}</div>
  </details>
}
