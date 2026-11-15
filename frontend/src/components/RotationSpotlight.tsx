import { ArrowUpRight, FlaskConical, Leaf, Heart, TriangleAlert } from 'lucide-react'
import type { Comparison } from '../types'
import { t, type Language, type TranslationKey } from '../i18n'
import { scientificText, rotationStatusKeys } from '../scienceText'

type Props = {language: Language; result: Comparison|null; dirty: boolean}

export function RotationSpotlight({language,result,dirty}:Props) {
  if(!result || dirty) return <section className="spotlight-pending" role="status">
    <FlaskConical size={23}/>
    <div><strong>{t(language,'spotlightTitle')}</strong>
      <p>{dirty?t(language,'spotlightPending'):t(language,'dataLoading')}</p></div>
  </section>

  return <section className="rotation-spotlight" data-testid="rotation-spotlight" aria-label={t(language,'spotlightTitle')}>
    <header className="spotlight-heading">
      <div><span className="overline">{t(language,'spotlightContext')}</span>
        <h2>{t(language,'spotlightTitle')}</h2><p>{t(language,'spotlightIntro')}</p></div>
      <span className="spotlight-mark"><Leaf size={19}/><span>NASA + ICARDA</span></span>
    </header>
    <div className="spotlight-grid">
      {result.rotations.map(item=>{
        // The illustrative baseline's first point is a missing harvest, not a benefit.
        // Prefer the explicitly lower-operation comparison while retaining all evidence below.
        const evidenceIndex=item.id==='A' && item.evidence_points.length>1?1:0
        const evidence=item.evidence_points[evidenceIndex]||''
        const evidenceCode=item.evidence_points_codes[evidenceIndex]||''
        const warningIndex=item.warnings_codes.findIndex(code=>code!=='climateWindow')
        const constraintIndex=warningIndex>=0?warningIndex:0
        return <article className={'spotlight-card spotlight-'+item.id} key={item.id} data-testid={`spotlight-${item.id}`}>
          <div className="spotlight-card-top">
            <span className="spotlight-letter">{item.id}</span>
            <span className={'spotlight-status '+item.status}>
              {t(language,rotationStatusKeys[item.status])}
            </span>
          </div>
          <p className="spotlight-option">{t(language,`spotlightOption${item.id}` as TranslationKey)}</p>
          <h3>{item.id==='A'&&item.title_key==='rotationA.customTitle'?item.title:
            scientificText(language,result,item.title_key,item.title)}</h3>
          <div className="spotlight-evidence">
            <span className="spotlight-label spotlight-label-good"><Heart size={17} fill="currentColor"/>{language==='ru'?'Что может быть полезно':language==='uz'?'Nima foydali bo‘lishi mumkin':'What could help'}</span>
            <p>{scientificText(language,result,evidenceCode,evidence)}</p>
          </div>
          <div className="spotlight-caution">
            <span className="spotlight-label spotlight-label-caution"><TriangleAlert size={18} fill="currentColor" stroke="var(--surface)"/>{language==='ru'?'На что обратить внимание':language==='uz'?'Nimaga e’tibor berish kerak':'What to watch for'}</span>
            <p>{scientificText(language,result,item.warnings_codes[constraintIndex]||'',item.warnings[constraintIndex]||'')}</p>
          </div>
          <button type="button" className="spotlight-detail" onClick={()=>{
            const card=document.getElementById(`rotation-detail-${item.id}`)
            const details=card?.querySelector<HTMLDetailsElement>('.rotation-expansion')
            if(details)details.open=true
            card?.scrollIntoView({behavior:'smooth',block:'start'})
          }}>
            {t(language,'spotlightInspect')} <ArrowUpRight size={16}/>
          </button>
        </article>
      })}
    </div>
  </section>
}
