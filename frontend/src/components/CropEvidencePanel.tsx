import { BookOpen, ExternalLink, Leaf } from 'lucide-react'
import { t, type Language, type TranslationKey } from '../i18n'
import type { CropCatalog, CropReference } from '../types'

const cropNames:Record<string,TranslationKey>={
  wheat:'cropWheat',mungbean:'cropMungbean',
  green_manure:'cropGreenManure',cotton:'cropCotton'
}
const scopeNames:Record<string,TranslationKey>={
  wheat:'cropScopeWheat',
  mungbean:'cropScopeMung',
  green_manure:'cropScopeGreen',
  cotton:'cropScopeCotton',
}
const saltNames:Record<string,TranslationKey>={
  cropSaltMung:'cropSaltMung',cropSaltCotton:'cropSaltCotton',
  cropSaltUnknown:'cropSaltUnknown',
}
const ranges=(v:number[]|null,unit:string)=>
  v?.length===2?`${v[0]}–${v[1]} ${unit}`:null

function CropCard({language,crop,catalog}:{
  language:Language;crop:CropReference;catalog:CropCatalog
}) {
  const statistics = [
    {key:'cropReferenceDurationGeneric',field:'growing_period_days',
      value:ranges(crop.growing_period_days,t(language,'calendarDayUnit'))},
    {key:'cropReferenceTemp',field:'temperature_optimum_c',
      value:ranges(crop.temperature_optimum_c,'°C')},
    {key:'cropReferencePH',field:'soil_ph_optimum',
      value:ranges(crop.soil_ph_optimum,'pH')},
    {key:'cropReferenceWater',field:'seasonal_water_need_mm',
      value:ranges(crop.seasonal_water_need_mm,'mm')},
  ] as const
  const metricCitations = (field:keyof CropReference['metric_source_ids']) =>
    crop.metric_source_ids[field]?.map(id=>{
      const source=catalog.sources[id]
      return source?<a key={id} href={source.url} target="_blank" rel="noopener noreferrer"
        className="crop-metric-source" title={source.label}
        aria-label={t(language,'cropMetricSource')+': '+source.publisher+' — '+source.label}>
        <ExternalLink size={11} aria-hidden="true"/>{source.publisher}</a>:null
    })
  return <article className="crop-reference">
    <div className="crop-reference-top"><Leaf size={20}/><div>
      <h4>{t(language,cropNames[crop.id]||'cropOther')}</h4>
      <em>{crop.scientific_name}</em></div>
    </div>
    <div className="crop-reference-content">
      <img className="crop-reference-illustration"
        src={import.meta.env.BASE_URL+'illustrations/crop-'+crop.id.replaceAll('_','-')+'.svg'} alt="" aria-hidden="true"/>
      <div className="crop-reference-details">
    <dl>{statistics.map(entry=><div key={entry.key}>
      <dt>{t(language,entry.key)}</dt>
      <dd>{entry.value??t(language,'cropReferenceNoValue')}
        {entry.value && metricCitations(entry.field)}
      </dd>
    </div>)}</dl>
    <p className="crop-salt"><strong>{t(language,'cropReferenceSalt')}: </strong>
      {t(language,saltNames[crop.salinity_note_code]||'cropSaltUnknown')}
      {metricCitations('salinity_note_code')}
    </p>
    <p className="crop-scope"><strong>{t(language,'cropReferenceScope')}: </strong>
      {t(language,scopeNames[crop.id]||'cropReferenceCaution')}</p>
    {crop.source_ids.map(id=>{
      const source=catalog.sources[id]
      return source?<a key={id} href={source.url} target="_blank" rel="noopener noreferrer"
        className="crop-source"><ExternalLink size={13}/>{source.publisher}: {source.label}</a>:null
    })}
      </div>
    </div>
  </article>
}
export function CropEvidencePanel({language,catalog}:{
  language:Language; catalog:CropCatalog|null
}) {
  if(!catalog)return null
  return <details className="crop-evidence-panel crop-evidence-disclosure" data-testid="crop-reference-panel">
    <summary className="crop-evidence-summary">{language==='ru'?'Какие культуры мы сравниваем?':language==='uz'?'Qaysi ekinlarni solishtiramiz?':'Which crops are we comparing?'}
      <small>{language==='ru'?'Пшеница, маш, озимый горох и хлопчатник — подробнее о каждой культуре':language==='uz'?'Bug‘doy, mosh, kuzgi no‘xat va paxta — har biri haqida batafsil':'Wheat, mung bean, winter pea and cotton — more details on each'}</small>
    </summary>
    <div className="crop-evidence-heading"><BookOpen size={21}/><div>
      <span className="overline">FAO · ICARDA · KHOREZM</span>
      <h3>{t(language,'cropReferenceTitle')}</h3>
      <p>{t(language,'cropReferenceIntro')}</p></div></div>
    <div className="crop-references">{catalog.crops.map(crop=>
      <CropCard key={crop.id} language={language} crop={crop} catalog={catalog}/>)}</div>
    <p className="crop-ref-disclaimer">{t(language,'cropReferenceDisclaimer')}</p>
  </details>
}
