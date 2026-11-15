import { ExternalLink, FlaskConical, ShieldAlert } from 'lucide-react'
import { t, type Language } from '../i18n'
import { RegionalContext } from './RegionalContext'
import { FarmerScienceIntro } from './FarmerScienceIntro'

export function SatelliteImagery({language}:{language: Language}) {
  const base = import.meta.env.BASE_URL
  return <section className="satellite-section">
    <div className="section-header"><div><span className="overline">{t(language,'sectionImagery')}</span>
      <h2>{t(language,'imageryTitle')}</h2><p>{t(language,'imageryHelp')}</p>
    </div></div>
    <div className="image-pair">
      <figure><img loading="lazy" src={base+'imagery/modis_2025_july.png'} alt={t(language,'imageryDateJul')}/>
        <figcaption><b>{t(language,'imageryDateJul')}</b><span>{t(language,'imageryComposite')}</span></figcaption>
      </figure>
      <figure><img loading="lazy" src={base+'imagery/modis_2025_september.png'} alt={t(language,'imageryDateSep')}/>
        <figcaption><b>{t(language,'imageryDateSep')}</b><span>{t(language,'imageryComposite')}</span></figcaption>
      </figure>
    </div>
    <p className="image-caption">{t(language,'imageryDisclaimer')}</p>
  </section>
}

const references = [
  {name:'NASA GPM IMERG',key:'sourceGpm',url:'https://gpm.nasa.gov/data/imerg'},
  {name:'NASA POWER',key:'sourcePower',url:'https://power.larc.nasa.gov/'},
  {name:'ICARDA',key:'sourceIcarda',url:'https://repo.mel.cgiar.org/'},
  {name:'FAO',key:'sourceFao',url:'https://www.fao.org/land-water/'},
] as const

const glossary = [
  {name:'glossaryRotation',meaning:'glossaryRotationDesc'},
  {name:'glossaryFallow',meaning:'glossaryFallowDesc'},
  {name:'glossaryMung',meaning:'glossaryMungDesc'},
  {name:'glossaryGreen',meaning:'glossaryGreenDesc'},
  {name:'glossaryNDVI',meaning:'glossaryNDVIDesc'},
  {name:'glossaryECe',meaning:'glossaryECeDesc'},
] as const

const readableResearch={
 en:{title:'Why does AgroSat ask about water and soil?',subtitle:'Optional: local research, scientific method and source links'},
 ru:{title:'Почему AgroSat спрашивает о воде и почве?',subtitle:'Необязательно: исследования Хорезма, научный метод и ссылки'},
 uz:{title:'Nega AgroSat suv va tuproq haqida so‘raydi?',subtitle:'Ixtiyoriy: Xorazm tadqiqotlari, ilmiy usul va manbalar'}
} as const

export function ScientificContext({language}:{language: Language}) {
  return <section className="science-section science-easy-section">
    <FarmerScienceIntro language={language}/>
    <details className="science-technical-disclosure" data-testid="science-research-details">
      <summary><strong>{readableResearch[language].title}</strong>
        <span>{readableResearch[language].subtitle}</span></summary>
    <RegionalContext language={language}/>
    <div><span className="overline">{t(language,'scienceOverline')}</span><h2>{t(language,'scienceTitle')}</h2>
      <p>{t(language,'scienceBody')}</p>
      <div className="science-callout"><FlaskConical size={21}/><p>
        <b>{t(language,'scienceCannot')}</b> {t(language,'scienceCannotBody')}
      </p></div>
    </div>
    <details className="science-subdetails">
      <summary>{language==='ru'?'Посмотреть источники NASA, ICARDA и FAO':language==='uz'?'NASA, ICARDA va FAO manbalari':'View NASA, ICARDA and FAO sources'}</summary>
    <div className="source-list">
      <span className="overline">{t(language,'scienceReferences')}</span>
      {references.map(source=><a href={source.url} key={source.name} target="_blank" rel="noreferrer">
        <span><b>{source.name}</b><small>{t(language,source.key)}</small></span><ExternalLink size={18}/>
      </a>)}
    </div>
    </details>
    <details className="science-subdetails">
      <summary>{language==='ru'?'Пояснения сложных слов':language==='uz'?'Murakkab so‘zlar izohi':'Simple explanations of technical terms'}</summary>
    <div className="glossary">
      <h3>{t(language,'glossaryTitle')}</h3>
      <div className="glossary-grid">{glossary.map(item=><article key={item.name}>
        <strong>{t(language,item.name)}</strong><p>{t(language,item.meaning)}</p>
      </article>)}</div>
    </div>
    </details>
    <div className="ai-note"><ShieldAlert size={18}/>{t(language,'aiDisclosure')}</div>
    </details>
  </section>
}
