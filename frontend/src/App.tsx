import { useEffect, useRef, useState } from 'react'
import { FlaskConical, MapPinned, ShieldAlert, Sprout } from 'lucide-react'
import { t, type Language } from './i18n'
import { compare, getClimate, getHealth, getMonthly, getEvidence, getCrops } from './api'
import { Header, Hero, Footer, Sidebar, HowItWorks } from './components/Layout'
import { initialTheme, applyTheme, type Theme } from './theme'
import { ClimateStatusBar, ClimateSummaryCards, ClimateRainfallChart } from './components/ClimateOverview'
import { FarmExplorer } from './components/FarmExplorer'
import { SatelliteImagery, ScientificContext } from './components/ScientificContext'
import { CropEvidencePanel } from './components/CropEvidencePanel'
import type { ClimateSummary, MonthlyClimate, Comparison, FarmInput, EvidenceSource, CropCatalog } from './types'
import './styles/foundation.css'
import './styles/comparison.css'
import './styles/jury-polish.css'
import './styles/farmer-easy.css'
import './styles/reference-skin.css'
import './styles/illustrations.css'
import './styles/crop-illustrations.css'
import './styles/science-easy.css'
import './styles/rotation-simple.css'
import './styles/farmer-accessibility.css'

const INITIAL_FARM: FarmInput = {
  water:'unknown', salinity:'unknown', priority:'water',
  planting_month:7, planting_day:1, equipment_available:null,
  current_rotation_is_example:true, current_rotation_description:'',
  current_rotation_stages:[], season_year:2026,
  wheat_harvest_date:null, mungbean_harvest_date:null,
  green_manure_sowing_date:null, green_manure_end_date:null, cotton_sowing_date:null,
  irrigation_m3_ha:null, irrigation_source:'unknown', irrigation_period:'unknown',
  salinity_ece_ds_m:null, soil_ph:null, soil_test_source:'unknown',
  soil_sample_date:null, soil_sample_depth_cm:null,
}

type Tab = 'compare' | 'observations' | 'science'

function App() {
  // Deliberately do NOT persist language: every fresh visit starts in English.
  const [language,setLanguage] = useState<Language>('en')
  const [theme,setTheme] = useState<Theme>(initialTheme)
  const [farm,setFarm] = useState<FarmInput>(INITIAL_FARM)
  const [health,setHealth] = useState<{status:string;records:number}|null>(null)
  const [climate,setClimate] = useState<ClimateSummary|null>(null)
  const [monthly,setMonthly] = useState<MonthlyClimate|null>(null)
  const [result,setResult] = useState<Comparison|null>(null)
  const [evidence,setEvidence] = useState<EvidenceSource[]|null>(null)
  const [cropCatalog,setCropCatalog] = useState<CropCatalog|null>(null)
  const [selectedYear,setSelectedYear] = useState(2025)
  const [tab,setTab] = useState<Tab>('compare')
  const [activeNav,setActiveNav] = useState<Tab | 'overview' | 'climate'>('compare')
  const [busy,setBusy] = useState(false)
  const [dirty,setDirty] = useState(false)
  const [error,setError] = useState<string|null>(null)
  // A delayed response must never overwrite the result of newer farmer inputs.
  const inputRevision = useRef(0)
  const compareRequestId = useRef(0)

  useEffect(()=>{ applyTheme(theme) },[theme])

  useEffect(()=>{
    document.documentElement.lang=language
    document.title='AgroSat Uzbekistan | NASA Space Apps 2026'
  },[language])

  useEffect(()=>{
    let active=true
    // Independent requests: a temporary failure of the bibliography must not
    // disable the farm application or hide climate observations.
    void getHealth().then(status=>{if(active)setHealth(status)})
      .catch(e=>{if(active)setError(String(e))})
    void getEvidence().then(sources=>{if(active)setEvidence(sources)})
      .catch(e=>{if(active)setError(String(e))})
    void getCrops().then(crops=>{if(active)setCropCatalog(crops)})
      .catch(e=>{if(active)setError(String(e))})

    const revision=inputRevision.current
    const requestId=++compareRequestId.current
    void compare(INITIAL_FARM).then(comparison=>{
      if(active && inputRevision.current===revision && compareRequestId.current===requestId)
        setResult(comparison)
    }).catch(e=>{
      if(active && inputRevision.current===revision && compareRequestId.current===requestId)
        setError(String(e))
    })
    return ()=>{active=false}
  },[])

  useEffect(()=>{
    let active=true
    // Yearly metrics remain usable if one of the two endpoints is unavailable.
    void getClimate(selectedYear).then(value=>{if(active)setClimate(value)})
      .catch(e=>{if(active)setError(String(e))})
    void getMonthly(selectedYear).then(value=>{if(active)setMonthly(value)})
      .catch(e=>{if(active)setError(String(e))})
    return ()=>{active=false}
  },[selectedYear])

  const update = <K extends keyof FarmInput>(key:K,value:FarmInput[K])=>{
    inputRevision.current++
    setFarm(previous=>({...previous,[key]:value}))
    setDirty(true)
  }
  const updateDate = (month:number,day:number)=>{
    inputRevision.current++
    setFarm(previous=>({...previous,planting_month:month,planting_day:day}))
    setDirty(true)
  }
  const run = async ()=>{
    const revision=inputRevision.current
    const requestId=++compareRequestId.current
    setBusy(true);setError(null)
    try {
      const comparison=await compare(farm)
      // The form may have changed while the network request was pending.
      if(requestId!==compareRequestId.current || revision!==inputRevision.current)return
      setResult(comparison)
      setDirty(false)
      setTab('compare')
      setActiveNav('compare')
    }catch(e){
      if(requestId===compareRequestId.current && revision===inputRevision.current)
        setError(String(e))
    }finally{
      if(requestId===compareRequestId.current)setBusy(false)
    }
  }

  const navigate = (next: Tab | 'overview' | 'climate') => {
    setActiveNav(next)
    if(next==='overview') {
      setTab('compare')
      window.scrollTo({top:0,behavior:'smooth'})
    } else if(next==='climate') {
      document.getElementById('climate-snapshot')?.scrollIntoView({behavior:'smooth',block:'start'})
    } else {
      setTab(next)
      window.requestAnimationFrame(()=>document.getElementById('content-tabs')?.scrollIntoView({behavior:'smooth',block:'start'}))
    }
  }

  return <div className="app-shell">
    <Sidebar language={language} selected={activeNav} onNavigate={navigate}/>
    <div className="workspace">
    <Header language={language} onLanguage={setLanguage} theme={theme} onTheme={()=>setTheme(previous=>previous==='light'?'dark':'light')}/>
    <main>
      <Hero language={language} onCompare={()=>{setTab('compare');setActiveNav('compare');window.requestAnimationFrame(()=>document.getElementById('farmer-start')?.scrollIntoView({behavior:'smooth',block:'start'}))}} onShowImagery={()=>navigate('observations')}/>
      <ClimateStatusBar language={language} health={health} climate={climate} year={selectedYear}/>
      {error && <div className="error" role="alert"><ShieldAlert size={20}/>
        <span>{t(language,'dataErrorPrefix')} {error}. {t(language,'dataErrorSuffix')}</span></div>}
      <nav id="content-tabs" className="tabs" role="tablist" aria-label={t(language,'guideTitle')}>
        <button type="button" role="tab" aria-selected={tab==='compare'}
          className={tab==='compare'?'active':''} onClick={()=>{setTab('compare');setActiveNav('compare')}}>
          <Sprout size={16}/>{t(language,'tabCompare')}</button>
        <button type="button" role="tab" aria-selected={tab==='observations'}
          className={tab==='observations'?'active':''} onClick={()=>{setTab('observations');setActiveNav('observations')}}>
          <MapPinned size={16}/>{t(language,'tabObservations')}</button>
        <button type="button" role="tab" aria-selected={tab==='science'}
          className={tab==='science'?'active':''} onClick={()=>{setTab('science');setActiveNav('science')}}>
          <FlaskConical size={16}/>{t(language,'tabScience')}</button>
      </nav>
      {tab==='compare' && <FarmExplorer language={language} farm={farm} onUpdate={update}
        onPlantingDate={updateDate} onRun={run} result={result} evidence={evidence}
        busy={busy} ready={health?.status==='ok'} dirty={dirty}/>}
      {tab==='observations' && <SatelliteImagery language={language}/>}
      {tab==='science' && <>
        <ScientificContext language={language}/>
        <CropEvidencePanel language={language} catalog={cropCatalog}/>
      </>}
      <HowItWorks language={language}/>
      <div id="climate-snapshot">
        <ClimateSummaryCards language={language} health={health} climate={climate}
          year={selectedYear} onYear={year=>{
            setClimate(null);setMonthly(null);setSelectedYear(year)
          }}/>
      </div>
      <ClimateRainfallChart language={language} monthly={monthly} evidence={evidence} year={selectedYear}/>
      <Footer language={language}/>
    </main>
    </div>
  </div>
}
export default App
