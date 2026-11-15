import { ExternalLink, BookOpen, Satellite, ShieldAlert } from 'lucide-react'
import type { EvidenceSource } from '../types'
import { t, type Language, type TranslationKey } from '../i18n'

const names: Record<string, TranslationKey> = {
  nasa_imerg: 'traceSourceNASA_IMERG',
  nasa_power: 'traceSourceNASA_POWER',
  icarda_mungbean_2022: 'traceSourceICARDA_2022',
  icarda_rotation_2023: 'traceSourceICARDA_2023',
  farmer_inputs: 'traceSourceFarmer',
}

interface Props {
  language: Language
  ids: string[]
  evidence: EvidenceSource[] | null
  climate?: boolean
}
export function SourceTrace({language, ids, evidence, climate=false}: Props) {
  const sources=ids.map(id=>evidence?.find(item=>item.id===id)).filter((x):x is EvidenceSource=>Boolean(x))
  return <details className="source-trace" data-testid={climate?'climate-trace':'rotation-trace'}>
    <summary><BookOpen size={15}/>{t(language,climate?'traceDataTitle':'traceTitle')}</summary>
    <div className="source-trace-body">
      <p>{t(language,'traceIntro')}</p>
      {sources.length>0 ? <ul>{sources.map(source=><li key={source.id}>
        <div className="source-role">
          {source.type==='unverified_input'?<ShieldAlert size={15}/>:<Satellite size={15}/>}
          <strong>{t(language,names[source.id]||'traceTitle')}</strong>
        </div>
        <small>{source.type==='unverified_input'?t(language,'tracePublisherFarmer'):source.publisher}</small>
        {source.documentation_url && <a className="source-method" href={source.documentation_url}
          target="_blank" rel="noopener noreferrer">
          {t(language,'traceMethodology')} <ExternalLink size={13}/>
        </a>}
        {source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">
          {t(language,'traceOpen')} <ExternalLink size={13}/>
        </a>:<span className="no-source-url">{t(language,'traceFarmerNoLink')}</span>}
      </li>)}</ul> : <p className="trace-empty">{t(language,'traceEmpty')}</p>}
      {climate && <p className="trace-warning">{t(language,'traceWarning')}</p>}
    </div>
  </details>
}
