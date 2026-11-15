import { Droplets, ExternalLink, Leaf, Sprout, ShieldAlert, CalendarDays, FlaskConical } from 'lucide-react'
import { t, type Language } from '../i18n'

const research=[
  {
    id:'mung',
    icon:Sprout,
    title:'regionMungTitle',
    description:'regionMungText',
    url:'https://mel.cgiar.org/reporting/download/hash/fba943f8c8f8343218dfcf56484114a8',
    publisher:'ICARDA / CGIAR · 2022',
  },
  {
    id:'soil',
    icon:Droplets,
    title:'regionSoilTitle',
    description:'regionSoilText',
    url:'https://www.mdpi.com/2073-4441/10/2/208',
    publisher:'Water · Khorezm study (2018)',
  },
  {
    id:'green',
    icon:Leaf,
    title:'regionGreenTitle',
    description:'regionGreenText',
    url:'https://mel.cgiar.org/reporting/download/hash/6b054f0772e3ad9f8cd6d8b3e76af588',
    publisher:'ICARDA / GIZ · 2023',
  },
] as const

const friendlyRegion={
 en:{title:'What matters for a field in Khorezm?',intro:'Before choosing an extra crop, check water, soil and timing.',
  cards:[
   {title:'Irrigation water',description:'After harvesting wheat, an extra summer crop needs a confirmed water supply.'},
   {title:'Salty soil',description:'Soil salinity may limit crop choice. A local soil test helps clarify the risk.'},
   {title:'The growing season',description:'Mung bean and winter pea need their own sowing and harvesting windows.'}
  ],more:'Local studies and research links',moreDescription:'Read original Khorezm research and local data sources'},
 ru:{title:'Что важно для поля в Хорезме?',intro:'Перед дополнительным посевом проверьте три вещи: воду, почву и сроки.',
  cards:[
   {title:'Вода для полива',description:'После уборки пшеницы дополнительной культуре нужна доступная вода.'},
   {title:'Соль в почве',description:'Засоление может ограничивать выбор культур. Уточните состояние почвы на поле.'},
   {title:'Сроки посева',description:'Маш и озимый горох требуют времени. Проверьте, поместятся ли они в сезон.'}
  ],more:'Исследования Хорезма и ссылки',moreDescription:'Оригинальные местные исследования и открытые источники'},
 uz:{title:'Xorazm dalasi uchun nima muhim?',intro:'Qo‘shimcha ekin ekishdan oldin suv, tuproq va muddatni tekshiring.',
  cards:[
   {title:'Sug‘orish suvi',description:'Bug‘doy yig‘imidan keyin qo‘shimcha ekin uchun suv bo‘lishi kerak.'},
   {title:'Tuproqdagi tuz',description:'Sho‘rlanish ekin tanlashga ta’sir qiladi. Dalangiz tuprog‘ini tekshiring.'},
   {title:'Ekish muddatlari',description:'Mosh va kuzgi no‘xat uchun vaqt kerak. Mavsumga mos kelishini tekshiring.'}
  ],more:'Xorazm tadqiqotlari va manbalar',moreDescription:'Asl mahalliy tadqiqotlar va ochiq manbalar'}
} as const
const simpleIcons=[Droplets,FlaskConical,CalendarDays]
export function RegionalContext({language}:{language: Language}) {
  const simple=friendlyRegion[language]
  return <section className="regional-context" aria-label={t(language,'regionTitle')}>
    <span className="overline">{t(language,'regionEyebrow')}</span>
    <h3>{simple.title}</h3>
    <p className="region-intro">{simple.intro}</p>
    <div className="regional-simple-cards">{simple.cards.map((card,index)=>{
     const Icon=simpleIcons[index]
     return <article key={card.title}>
       <span className="regional-simple-icon"><Icon size={24}/></span>
       <h4>{card.title}</h4><p>{card.description}</p>
     </article>
    })}</div>
    <details className="regional-studies">
      <summary>{simple.more}<small>{simple.moreDescription}</small></summary>
    <h4 className="regional-study-heading">{t(language,'regionTitle')}</h4>
    <p className="regional-study-intro">{t(language,'regionIntro')}</p>
    <div className="region-cards">
      {research.map(({id,icon:Icon,title,description,url,publisher})=><article key={id}>
        <Icon size={20} aria-hidden="true"/>
        <h4>{t(language,title)}</h4>
        <p>{t(language,description)}</p>
        <a href={url} target="_blank" rel="noreferrer noopener">
          {t(language,'regionOpenSource')} <ExternalLink size={14}/>
        </a>
        <small>{publisher}</small>
      </article>)}
    </div>
    <div className="region-data-row">
      <div><strong>{t(language,'regionGovTitle')}</strong>
        <p>{t(language,'regionGovText')}</p></div>
      <a href="https://gov.uz/ru/agro/pages/ochiq-ma-lumotlar-reyestri"
        target="_blank" rel="noreferrer noopener">
        {t(language,'regionOpenSource')} <ExternalLink size={14}/>
      </a>
    </div>
    <p className="region-disclaimer"><ShieldAlert size={16}/>{t(language,'regionNote')}</p>
    </details>
  </section>
}
