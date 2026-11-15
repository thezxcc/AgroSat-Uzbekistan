import { useState } from 'react'
import { ClipboardCheck, ShieldAlert } from 'lucide-react'
import { t, type Language, type TranslationKey } from '../i18n'
import { scientificText } from '../scienceText'
import type { Comparison, FieldEvidenceCheck } from '../types'

const dimensionLabels: Record<FieldEvidenceCheck['dimension'], TranslationKey> = {
  soil:'fieldEvidenceDimension_soil',
  irrigation:'fieldEvidenceDimension_irrigation',
  rotation:'fieldEvidenceDimension_rotation',
}

const provenanceLabels: Record<FieldEvidenceCheck['source'], TranslationKey> = {
  not_supplied:'fieldEvidenceSource_not_supplied',
  farmer_estimate:'fieldEvidenceSource_farmer_estimate',
  reported_metered:'fieldEvidenceSource_reported_metered',
  reported_laboratory:'fieldEvidenceSource_reported_laboratory',
  research_example:'fieldEvidenceSource_research_example',
  farmer_description:'fieldEvidenceSource_farmer_description',
}

export function FieldEvidenceSummary({language,result}:{
  language:Language; result:Comparison
}) {
  const checks=result.field_evidence
  const reviewCount=checks.filter(note=>note.needs_review).length
  const [expanded,setExpanded]=useState(reviewCount>0)
  return <details className="field-evidence-summary" data-testid="field-evidence"
    open={expanded} onToggle={event=>setExpanded(event.currentTarget.open)}>
    <summary>
      <ClipboardCheck size={19} aria-hidden="true"/>
      <strong>{t(language,'fieldEvidenceTitle')}</strong>
      {reviewCount>0&&<span className="field-evidence-review">
        <ShieldAlert size={15} aria-hidden="true"/>
        {t(language,'fieldEvidenceReview')}: {reviewCount}
      </span>}
    </summary>
    <p className="field-evidence-intro">{t(language,'fieldEvidenceIntro')}</p>
    <div className="field-evidence-items">
      {checks.map((item,i)=><article key={item.dimension+'-'+item.note_code+'-'+i}
        className={item.needs_review?'field-evidence-item review':'field-evidence-item'}
        data-code={item.note_code} data-source={item.source}>
        <div className="field-evidence-meta">
          <strong>{t(language,dimensionLabels[item.dimension])}</strong>
          <small>{t(language,provenanceLabels[item.source])}</small>
          {item.needs_review&&<span>{t(language,'fieldEvidenceReview')}</span>}
        </div>
        <p>{scientificText(language,result,item.note_code,item.note)}</p>
      </article>)}
    </div>
  </details>
}
