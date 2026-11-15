import { ArrowRight, ChevronRight, Droplets, FlaskConical, Leaf, ShieldAlert, Thermometer, Waves, Heart, TriangleAlert } from 'lucide-react'
import { languageLocales, t, type Language } from '../i18n'
import { scientificText, rotationStatusKeys } from '../scienceText'
import type { Comparison, FarmInput, RotationResult, EvidenceSource } from '../types'
import { SourceTrace } from './SourceTrace'
import { ImpactDetails } from './ImpactDetails'
import { ComparisonMatrix } from './ComparisonMatrix'
import { RotationSpotlight } from './RotationSpotlight'
import { FieldDataInputs } from './FieldDataInputs'
import { farmInputIssues } from '../fieldValidation'
import { CalendarCheck } from './CalendarCheck'
import { FieldEvidenceSummary } from './FieldEvidenceSummary'
import { FarmerEasy } from './FarmerEasy'
import { easyText } from '../i18n/farmerEasy'

interface Props {
  language: Language
  farm: FarmInput
  onUpdate: <K extends keyof FarmInput>(key: K, value: FarmInput[K]) => void
  onPlantingDate: (month: number, day: number) => void
  onRun: () => void
  result: Comparison | null
  evidence: EvidenceSource[] | null
  busy: boolean
  ready: boolean
  dirty: boolean
}

function Field({label,children}:{label: string,children: React.ReactNode}) {
  return <label className="form-field"><span>{label}</span>{children}</label>
}

function Explanation({language, result, item, index, evidence}:{
  language: Language; result: Comparison; item: RotationResult; index: number; evidence: EvidenceSource[] | null
}) {
  const localize = (key:string, fallback:string): string =>
    scientificText(language,result,key,fallback)
  const title = item.id==='A' && item.title_key==='rotationA.customTitle'
    ? item.title : localize(item.title_key,item.title)
  return <article id={`rotation-detail-${item.id}`} className="rotation-card" data-testid={`rotation-${item.id}`}>
    <div className="rotation-header">
      <span className="rotation-label">{item.id}</span>
      <div><h3>{title}</h3><span className={'rotation-status '+item.status}>{t(language,rotationStatusKeys[item.status])}</span></div>
      <ChevronRight size={19} className="rot-chevron"/>
    </div>
    <div className="rotation-simple-visual">
      <img src={import.meta.env.BASE_URL+'illustrations/rotation-'+item.id.toLowerCase()+'.svg'}
        alt="" aria-hidden="true"/>
      <p>{localize(item.description_key,item.description)}</p>
    </div>
    <div className="rotation-simple-points">
      <div><span className="rotation-simple-label rotation-positive"><Heart size={18} fill="currentColor"/>{language==='ru'?'Что может быть полезно':language==='uz'?'Nima foydali bo‘lishi mumkin':'What could help'}</span>
        <p>{localize(item.evidence_points_codes[item.id==='A' && item.evidence_points.length>1?1:0]||'',
          item.evidence_points[item.id==='A' && item.evidence_points.length>1?1:0]||'')}</p></div>
      <div><span className="rotation-simple-label rotation-warning"><TriangleAlert size={19} fill="currentColor" stroke="var(--surface)"/>{language==='ru'?'На что обратить внимание':language==='uz'?'Nimaga e’tibor berish kerak':'What to watch for'}</span>
        <p>{localize(item.warnings_codes.find(code=>code!=='climateWindow')||item.warnings_codes[0]||'',
          item.warnings[item.warnings_codes.findIndex(code=>code!=='climateWindow')>=0?item.warnings_codes.findIndex(code=>code!=='climateWindow'):0]||'')}</p></div>
    </div>
    <details className="rotation-expansion">
      <summary>{language==='ru'?'Календарь, источники и подробности':language==='uz'?'Kalendar, manbalar va batafsil ma’lumot':'Calendar, sources and details'}<ChevronRight size={17}/></summary>
    <div className="tag-line"><Leaf size={14}/>{localize(item.evidence_key,item.evidence)}</div>
    <div className="rotation-columns">
      <div><b>{t(language,'rotationBenefits')}</b>
        {item.evidence_points.map((str,i)=><p key={i}>• {localize(item.evidence_points_codes[i],str)}</p>)}
      </div>
      <div><b>{t(language,'rotationRisks')}</b>
        {item.warnings.map((str,i)=><p key={i}>• {localize(item.warnings_codes[i],str)}</p>)}
      </div>
    </div>
    <CalendarCheck language={language} assessment={item.calendar}/>
    <ImpactDetails language={language} entries={item.impacts}/>
    <SourceTrace language={language} evidence={evidence} ids={item.source_ids}/>
    {item.unknowns.length>0 && <details className="unknown-details" open={index===1}>
      <summary><FlaskConical size={15}/>{t(language,'rotationUnknowns')}</summary>
      <div>{item.unknowns.map((str,i)=><p key={i}>• {localize(item.unknowns_codes[i],str)}</p>)}</div>
    </details>}
    </details>
  </article>
}

export function FarmExplorer({language,farm,onUpdate,onPlantingDate,onRun,result,evidence,busy,ready,dirty}:Props) {
  const inputIssues = farmInputIssues(farm)
  const missingRotation = inputIssues.includes('currentRequired')
  const numeric = (n:number)=>new Intl.NumberFormat(languageLocales[language],{maximumFractionDigits:1}).format(n)
  return <>
    <FarmerEasy language={language} farm={farm} onUpdate={onUpdate} onRun={onRun}
      result={result} busy={busy} ready={ready} dirty={dirty} invalid={inputIssues.length>0}/>
    <div id="full-comparison" className="full-comparison">
    <RotationSpotlight language={language} result={result} dirty={dirty}/>
    <section className="analysis-layout">
    <div className="farm-panel">
      <div className="panel-top"><span className="overline">{t(language,'sectionFarm')}</span>
        <h2>{t(language,'farmTitle')}</h2><p>{t(language,'farmHelp')}</p></div>
      <div className="farm-fields">
        <Field label={t(language,'inputWater')}>
          <select value={farm.water} onChange={e=>onUpdate('water',e.target.value as FarmInput['water'])}>
            <option value="unknown">{t(language,'waterUnknown')}</option>
            <option value="available">{t(language,'waterAvailable')}</option>
            <option value="limited">{t(language,'waterLimited')}</option>
            <option value="none">{t(language,'waterNone')}</option>
          </select>
        </Field>
        <Field label={t(language,'inputSalinity')}>
          <select value={farm.salinity} onChange={e=>onUpdate('salinity',e.target.value as FarmInput['salinity'])}>
            <option value="unknown">{t(language,'saltUnknown')}</option>
            <option value="low">{t(language,'saltLow')}</option>
            <option value="high">{t(language,'saltHigh')}</option>
          </select>
        </Field>
        <Field label={t(language,'inputGoal')}>
          <select value={farm.priority} onChange={e=>onUpdate('priority',e.target.value as FarmInput['priority'])}>
            <option value="water">{t(language,'goalWater')}</option>
            <option value="income">{t(language,'goalIncome')}</option>
            <option value="soil">{t(language,'goalSoil')}</option>
          </select>
        </Field>
        <Field label={t(language,'inputSowing')}>
          <select value={`${farm.planting_month}-${farm.planting_day}`} onChange={e=>{
            const [m,day] = e.target.value.split('-').map(Number)
            onPlantingDate(m,day)
          }}>
            <option value="6-20">20/06</option>
            <option value="7-1">01/07</option>
            <option value="7-15">15/07</option>
            <option value="8-1">01/08</option>
            <option value="8-15">15/08</option>
          </select>
        </Field>
        <Field label={t(language,'inputMachinery')}>
          <select value={farm.equipment_available===null?'unknown':String(farm.equipment_available)}
            onChange={e=>onUpdate('equipment_available',e.target.value==='unknown'?null:e.target.value==='true')}>
            <option value="unknown">{t(language,'machineUnknown')}</option>
            <option value="true">{t(language,'machineYes')}</option>
            <option value="false">{t(language,'machineNo')}</option>
          </select>
        </Field>
        <div className="check-row"><label><input type="checkbox" checked={!farm.current_rotation_is_example}
          onChange={e=>onUpdate('current_rotation_is_example',!e.target.checked)}/>
          {t(language,'currentCheckbox')}</label></div>
        {!farm.current_rotation_is_example && <Field label={t(language,'currentLabel')}>
          <input value={farm.current_rotation_description}
            onChange={e=>onUpdate('current_rotation_description',e.target.value)}
            maxLength={300} placeholder={t(language,'currentPlaceholder')}
            aria-invalid={missingRotation} aria-describedby={missingRotation?'rotationRequiredHelp':undefined}/>
          {missingRotation && <span className="form-validation" id="rotationRequiredHelp" role="status">
            {t(language,'currentRequired')}
          </span>}
        </Field>}
      </div>
      <FieldDataInputs language={language} farm={farm} onUpdate={onUpdate}/>
      {dirty && <p role="status" className="dirty-notice">{t(language,'inputsChanged')}</p>}
      <button className="run-btn" disabled={busy || !ready || inputIssues.length>0} type="button" onClick={onRun}>
        {busy?t(language,'running'):t(language,'runButton')}<ArrowRight size={18}/>
      </button>
      <p className="form-note"><ShieldAlert size={14}/>{t(language,'formNote')}</p>
    </div>
    <div className="comparison-panel">
      <div className="panel-top"><span className="overline">{t(language,'sectionResults')}</span>
        <h2>{t(language,'resultsTitle')}</h2><p>{t(language,'resultsHelp')}</p></div>
      {result && !dirty ? <>
        <div className="model-banner">
          <div><Thermometer size={19}/><strong>{numeric(result.mean_hot_days_40c)}</strong>
            <small>{t(language,'meanHotWindow')}</small></div>
          <div><Waves size={19}/><strong>{result.years_with_frost} / {result.sample_years}</strong>
            <small>{t(language,'frostYears')}</small></div>
          <div><Droplets size={19}/><strong>{numeric(result.mean_rain_mm_window)} {t(language,'mm')}</strong>
            <small>{t(language,'rainWindowMetric')}</small></div>
        </div>
        <p className="rain-window-range">{t(language,'rainWindowRange',{
          min:numeric(result.min_rain_mm_window),
          max:numeric(result.max_rain_mm_window),
        })}</p>
        <FieldEvidenceSummary language={language} result={result}/>
        <ComparisonMatrix language={language} result={result}/>
      </> : <div className="loading">{dirty?t(language,'inputsChanged'):t(language,'dataLoading')}</div>}
    </div>
    {result && !dirty && <section className="rotation-details-section" aria-label={t(language,'resultsTitle')}>
      <div className="rotation-details-heading">
        <span className="overline">{t(language,'spotlightContext')}</span>
        <h2>{easyText(language,'detailTitle')}</h2>
        <p>{easyText(language,'detailIntro')}</p>
      </div>
      <div className="rotation-list">{result.rotations.map((r,index)=><Explanation key={r.id} item={r}
        index={index} result={result} language={language} evidence={evidence}/>)}</div>
    </section>}
    </section>
    </div>
  </>
}
