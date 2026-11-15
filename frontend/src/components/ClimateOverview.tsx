import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Droplets, Satellite, Thermometer, Wind } from 'lucide-react'
import { languageLocales, t, type Language, type TranslationKey } from '../i18n'
import type { ClimateSummary, MonthlyClimate, EvidenceSource } from '../types'
import { SourceTrace } from './SourceTrace'

interface SummaryProps {
  language: Language
  health: { status: string; records: number } | null
  climate: ClimateSummary | null
  year: number
  onYear: (year: number) => void
}
interface ChartProps {
  language: Language
  monthly: MonthlyClimate | null
  evidence: EvidenceSource[] | null
  year: number
}
function formatNumber(language:Language,value:number,decimals=0) {
  return new Intl.NumberFormat(languageLocales[language],{
    minimumFractionDigits:decimals,maximumFractionDigits:decimals
  }).format(value)
}
function Metric({icon:Icon,label,value,unit,foot,tone}:{
  icon: LucideIcon
  label: string
  value: string
  unit: string
  foot: string
  tone: 'water' | 'heat' | 'frost'
}) {
  return <article className={'metric metric-'+tone}>
    <div className="metric-head"><span className="metric-icon"><Icon size={20}/></span><span>{label}</span></div>
    <div className="metric-value">{value}<small>{unit}</small></div>
    <p className="metric-foot">{foot}</p>
  </article>
}

export function ClimateStatusBar({language,health,climate,year}: Pick<SummaryProps,'language'|'health'|'climate'|'year'>) {
  const isReady=health?.status==='ok'
  return <div className="data-bar" aria-label={t(language,'dataStatus')}>
      <div className="data-title"><span className="status-icon"><Satellite size={20}/></span>
        <div><strong>{t(language,'dataStatus')}</strong>
          <small>{isReady?t(language,'dataVerified'):t(language,'dataConnecting')}</small></div>
      </div>
      <span className={isReady?'status-ready':'status-wait'}>{t(language,isReady?'dataReadyBadge':'dataUnavailableBadge')}</span>
      <div className="data-facts">
        <div className="data-fact"><b>{isReady?formatNumber(language,health.records):'—'}</b><small>{t(language,'dailyRecords')}</small></div>
        <div className="data-fact"><b>2000–2025</b><small>{t(language,'historicalCoverage')}</small></div>
        <div className="data-fact"><b>2</b><small>{t(language,'nasaDatasets')}</small></div>
        <div className="data-fact data-fact-rain"><b>{climate?formatNumber(language,climate.total_precipitation_mm,1):'—'} <span>{t(language,'mm')}</span></b>
          <small>{year} · {t(language,'metricRain')}</small></div>
      </div>
    </div>
}

export function ClimateSummaryCards({language,climate,year,onYear}:SummaryProps) {
  return <section className="climate-snapshot" aria-label={t(language,'sectionSatellite')}>
    <div className="section-header climate-header">
      <div><span className="overline">{t(language,'sectionSatellite')}</span>
        <h2>{t(language,'environmentTitle')}</h2>
        <p>{t(language,'environmentDescription')}</p></div>
      <div className="year-picker"><label htmlFor="year"><CalendarDays size={14}/>{t(language,'referenceYear')}</label>
        <select id="year" value={year} onChange={event=>onYear(Number(event.target.value))}>
          {Array.from({length:26},(_,i)=>2025-i).map(value=><option key={value} value={value}>{value}</option>)}
        </select>
      </div>
    </div>
    <div className="metrics">
      <Metric icon={Droplets} tone="water" label={t(language,'metricRain')}
        value={climate?formatNumber(language,climate.total_precipitation_mm,1):'—'}
        unit={t(language,'mm')} foot={t(language,'metricRainFoot')}/>
      <Metric icon={Thermometer} tone="heat" label={t(language,'metricHeat')}
        value={climate?formatNumber(language,climate.hot_days_40c):'—'}
        unit={t(language,'days')} foot={t(language,'metricHeatFoot')}/>
      <Metric icon={Wind} tone="frost" label={t(language,'metricFrost')}
        value={climate?formatNumber(language,climate.frost_days_0c):'—'}
        unit={t(language,'days')} foot={t(language,'metricFrostFoot')}/>
    </div>
  </section>
}

export function ClimateRainfallChart({language,monthly,evidence,year}:ChartProps) {
  const values=monthly?.year===year?monthly.months:[]
  const max=Math.max(1,...values.map(x=>x.precipitation_mm))
  const month=(value:number)=>t(language,`month${value}` as TranslationKey)
  return <section id="climate-chart" className="chart-card">
    <div className="chart-title">
      <div><span className="overline">NASA GPM / IMERG · 2000–2025</span>
        <h3>{t(language,'rainChartTitle')}</h3>
        <p>{t(language,'rainChartSubtitle',{year})}</p></div>
      <div className="chart-period"><CalendarDays size={17}/>{year}</div>
    </div>
    {values.length===12?<div className="rainfall-chart" role="img" aria-label={t(language,'rainChartTitle')}>
      {values.map(value=>{
        const height=Math.max(1.4,Math.round(value.precipitation_mm/max*100))
        const label=`${month(value.month)}: ${formatNumber(language,value.precipitation_mm,1)} ${t(language,'mm')}`
        return <div className="rain-column" key={value.month} title={label} aria-label={label}>
          <b>{formatNumber(language,value.precipitation_mm,1)}</b>
          <div className="rain-track"><div className="rain-bar" style={{height:`${height}%`}}/></div>
          <span>{month(value.month)}</span>
        </div>
      })}
    </div>:<p className="chart-empty">{t(language,'rainNoData')}</p>}
    <p className="image-caption">{t(language,'rainChartSource')}</p>
    <SourceTrace language={language} evidence={evidence} ids={['nasa_imerg','nasa_power']} climate/>
  </section>
}
