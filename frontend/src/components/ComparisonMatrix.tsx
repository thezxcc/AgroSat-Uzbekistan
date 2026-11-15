import { BarChart3, Info } from 'lucide-react'
import { t, translations, type Language, type TranslationKey } from '../i18n'
import type { Comparison, ImpactEntry } from '../types'
import { dimensionKeys, assessmentKeys } from '../impactLabels'

const order: ImpactEntry['dimension'][] = ['water','soil_cover','nutrients','pests','labor','market']
const nextStepKeys: Record<ImpactEntry['dimension'], TranslationKey> = {
  water:'matrixNextWater',
  soil_cover:'matrixNextSoilCover',
  nutrients:'matrixNextNutrients',
  pests:'matrixNextPests',
  labor:'matrixNextLabor',
  market:'matrixNextMarket',
}

export function ComparisonMatrix({language,result}:{language:Language,result:Comparison}) {
  const getNote = (key:string, fallback:string) =>
    key in translations[language] ? t(language,key as TranslationKey) : fallback

  return <section className="comparison-matrix" aria-label={t(language,'matrixTitle')} data-testid="comparison-matrix">
    <div className="matrix-heading">
      <div className="matrix-icon"><BarChart3 size={19}/></div>
      <div><h3>{t(language,'matrixTitle')}</h3><p>{t(language,'matrixIntro')}</p></div>
    </div>
    <div className="matrix-scroll">
      <table className="matrix-table">
        <thead><tr>
          <th scope="col">{t(language,'impactTitle')}</th>
          {result.rotations.map(item=><th key={item.id} scope="col" title={getNote(item.title_key,item.title)}>
            <span className="matrix-letter">{item.id}</span>
          </th>)}
        </tr></thead>
        <tbody>{order.map(dimension=><tr key={dimension}>
          <th scope="row">{t(language,dimensionKeys[dimension])}</th>
          {result.rotations.map(item=>{
            const impact=item.impacts.find(x=>x.dimension===dimension)
            if(!impact)return <td key={item.id}>—</td>
            return <td key={item.id}>
              <div className="matrix-cell">
                <span className={'matrix-state '+impact.assessment}>
                  {t(language,assessmentKeys[impact.assessment])}
                </span>
                <details className="matrix-why" data-testid={`matrix-why-${item.id}-${dimension}`}>
                  <summary aria-label={`${t(language,'matrixWhy')} — ${item.id}: ${t(language,dimensionKeys[dimension])}`}>
                    <Info size={13} aria-hidden="true"/>{t(language,'matrixWhy')}
                  </summary>
                  <div className="matrix-why-content">
                    <strong>{t(language,'matrixReason')}</strong>
                    <p>{getNote(impact.note_code,impact.note)}</p>
                    <strong>{t(language,'matrixNextStep')}</strong>
                    <p>{t(language,nextStepKeys[dimension])}</p>
                    <small>{t(language,'matrixLimits')}</small>
                  </div>
                </details>
              </div>
            </td>
          })}</tr>)}</tbody>
      </table>
    </div>
    <p className="matrix-caption"><Info size={14}/>{t(language,'matrixNote')}</p>
  </section>
}
