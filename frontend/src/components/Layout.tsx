import {
  Activity, ArrowUpRight, CheckCircle2, Droplets, ExternalLink, FlaskConical,
  Leaf, MapPinned, Moon, Satellite, ShieldAlert, Sprout, Sun, Earth,
} from 'lucide-react'
import { languageLabels, t, type Language } from '../i18n'
import { easyText as e } from '../i18n/farmerEasy'
import type { Theme } from '../theme'

type Section = 'compare' | 'observations' | 'science'

interface ControlsProps {
  language: Language
  onLanguage: (value: Language) => void
  theme: Theme
  onTheme: () => void
}

export function Header({language, onLanguage, theme, onTheme}: ControlsProps) {
  return <header className="topbar"><div className="top-inner">
    <div className="top-location"><span className="location-dot"/><span>{t(language,'heroPlace')}</span>
      <span className="top-location-divider">/</span><strong>{t(language,'dashboardBadge')}</strong></div>
    <div className="top-actions">
      <a className="nav-source" href="https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/" target="_blank" rel="noreferrer">
        NASA Space Apps 2026 <ExternalLink size={14}/>
      </a>
      <label className="language-control">
        <span>{t(language,'languageLabel')}</span>
        <select data-testid="language-select" aria-label={t(language,'languageLabel')} value={language}
          onChange={event=>onLanguage(event.target.value as Language)}>
          {(['en','ru','uz'] as const).map(item=><option value={item} key={item}>{languageLabels[item]}</option>)}
        </select>
      </label>
      <button type="button" className="theme-switch" data-testid="theme-toggle" onClick={onTheme}
        aria-label={t(language,theme==='light'?'themeDark':'themeLight')}
        title={t(language,theme==='light'?'themeDark':'themeLight')} aria-pressed={theme==='dark'}>
        {theme==='light'?<Moon size={18}/>:<Sun size={18}/>}
        <span>{t(language,theme==='light'?'themeDark':'themeLight')}</span>
      </button>
    </div>
  </div></header>
}

export function Sidebar({language, selected, onNavigate}:{
  language: Language
  selected: Section | 'overview' | 'climate'
  onNavigate: (tab: Section|'overview'|'climate') => void
}) {
  return <aside className="app-sidebar" aria-label={t(language,'sidebarSection')}>
    <div className="sidebar-identity">
      <div className="sidebar-mark"><Leaf size={23}/></div>
      <span><b>AgroSat</b><small>UZBEKISTAN</small></span>
    </div>
    <div className="sidebar-signal"><span className="signal-pulse"/> {t(language,'sidebarCaption')}</div>
    <p className="sidebar-label">{t(language,'sidebarSection')}</p>
    <nav className="sidebar-links">
      <button type="button" className={selected==='overview'?'active':''} onClick={()=>onNavigate('overview')}><Activity size={19}/>{t(language,'navOverview')}</button>
      <button type="button" className={selected==='compare'?'active':''} onClick={()=>onNavigate('compare')}>
        <Sprout size={19}/>{t(language,'tabCompare')}
      </button>
      <button type="button" className={selected==='observations'?'active':''} onClick={()=>onNavigate('observations')}>
        <MapPinned size={19}/>{t(language,'tabObservations')}
      </button>
      <button type="button" className={selected==='climate'?'active':''} onClick={()=>onNavigate('climate')}>
        <Droplets size={19}/>{t(language,'sidebarClimate')}
      </button>
      <button type="button" className={selected==='science'?'active':''} onClick={()=>onNavigate('science')}>
        <FlaskConical size={19}/>{t(language,'tabScience')}
      </button>
    </nav>
    <div className="sidebar-bottom">
      <div className="sidebar-bottom-icon"><Satellite size={20}/></div>
      <strong>NASA Earth data</strong><span>2000–2025</span>
      <p>{t(language,'heroProvenance')}</p>
    </div>
  </aside>
}

export function Hero({language,onCompare,onShowImagery}:{
  language: Language
  onCompare: () => void
  onShowImagery: () => void
}) {
  return <>
    <section className="hero" id="top">
      <div className="hero-content">
        <div className="eyebrow"><Satellite size={15}/>{e(language,'eyebrow')}</div>
        <h1>{e(language,'headline')}</h1>
        <p>{e(language,'subtitle')}</p>
        <div className="hero-actions">
          <button type="button" onClick={onCompare} className="hero-primary">
            {e(language,'primary')} <ArrowUpRight size={18}/>
          </button>
          <button type="button" onClick={onShowImagery} className="hero-secondary">
            {e(language,'secondary')}
          </button>
          <span className="hero-geo"><span className="pin-dot"/> 41.55° N · 60.62° E</span>
        </div>
        <div className="hero-notes">
          <span><CheckCircle2 size={15}/>{t(language,'heroNoteData')}</span>
          <span><ShieldAlert size={15}/>{t(language,'heroNoteLimits')}</span>
          <span><FlaskConical size={15}/>{t(language,'heroNoteExplain')}</span>
        </div>
      </div>
      <div className="hero-earth-decoration" aria-hidden="true"><Earth size={156} strokeWidth={0.7}/></div>
      <figure className="hero-map-preview">
        <div className="hero-map-label"><span className="map-live-dot"/>{t(language,'heroPreview')}</div>
        <img src={import.meta.env.BASE_URL+'imagery/modis_2025_july.png'} alt={t(language,'heroPreviewSource')}/>
        <figcaption><Satellite size={14}/><strong>{t(language,'heroPreviewSource')}</strong><small>{t(language,'heroPreviewHint')}</small></figcaption>
      </figure>
    </section>
  </>
}

export function HowItWorks({language}:{language:Language}) {
  return <section className="onboarding" aria-label={t(language,'guideTitle')}>
      <div className="onboarding-header">
        <span className="overline">FIELD SHIFT · NASA SPACE APPS</span>
        <h2>{t(language,'guideTitle')}</h2>
        <p>{t(language,'guideIntro')}</p>
      </div>
      <div className="onboarding-steps">
        <article><span className="step-icon"><Satellite size={19}/></span><div><h3>{t(language,'guideStep1Title')}</h3><p>{t(language,'guideStep1Text')}</p></div></article>
        <article><span className="step-icon"><Droplets size={19}/></span><div><h3>{t(language,'guideStep2Title')}</h3><p>{t(language,'guideStep2Text')}</p></div></article>
        <article><span className="step-icon"><Sprout size={19}/></span><div><h3>{t(language,'guideStep3Title')}</h3><p>{t(language,'guideStep3Text')}</p></div></article>
      </div>
    </section>
}

export function Footer({language}:{language: Language}) {
  return <footer>
    <div className="footer-brand"><Satellite size={18}/><b>AGROSAT</b><span>{t(language,'footerMotto')}</span></div>
    <div><p>{t(language,'footerEvent')}</p><p>{t(language,'footerDisclaimer')}</p></div>
  </footer>
}
