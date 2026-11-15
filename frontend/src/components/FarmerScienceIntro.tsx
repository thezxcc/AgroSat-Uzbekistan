import { ClipboardCheck, Droplets, BookOpenCheck, Sprout } from 'lucide-react'
import type { Language } from '../i18n'

const content = {
 en:{
  eyebrow:'AGROSAT EXPLAINS IT SIMPLY',
  title:'What should I check before choosing a crop?',
  intro:'You do not need to understand NASA charts. Start with three things about your own field.',
  points:[
   {title:'Will there be enough irrigation water?',text:'Check when canal water will reach the field and how much will be available.'},
   {title:'Is the soil salty?',text:'If you are unsure, ask a local agronomist about a soil test before planting.'},
   {title:'Will the crop fit the season?',text:'Check the wheat harvest date, the next sowing date and access to labour.'}
  ],
  conclusion:'AgroSat compares possible crop rotations using NASA climate history and Khorezm research. It does not automatically choose a crop for you.',
  guide:'Want to see why? Open the research explanations below.'
 },
 ru:{
  eyebrow:'AGROSAT ОБЪЯСНЯЕТ ПРОСТО',
  title:'Что проверить перед выбором культуры?',
  intro:'Разбираться в графиках NASA не нужно. Для начала достаточно знать три вещи о своём поле.',
  points:[
   {title:'Хватит ли воды для полива?',text:'Уточните, когда дадут воду из канала и сколько её будет.'},
   {title:'Есть ли в почве соль?',text:'Если не знаете, уточните у местного агронома, нужен ли анализ почвы.'},
   {title:'Успеет ли культура вырасти?',text:'Проверьте даты уборки пшеницы и следующего посева, а также наличие работников.'}
  ],
  conclusion:'AgroSat сравнивает возможные севообороты по истории климата NASA и исследованиям Хорезма, но не выбирает культуру за вас.',
  guide:'Хотите узнать почему? Научные объяснения можно раскрыть ниже.'
 },
 uz:{
  eyebrow:'AGROSAT SODDA TUSHUNTIRADI',
  title:'Ekin tanlashdan oldin nimani tekshirish kerak?',
  intro:'NASA grafiklarini tushunishingiz shart emas. Avval dalangiz haqida uchta oddiy narsani aniqlang.',
  points:[
   {title:'Sug‘orish suvi yetadimi?',text:'Kanaldan suv qachon kelishini va qancha suv bo‘lishini tekshiring.'},
   {title:'Tuproq sho‘rlanganmi?',text:'Bilmasangiz, tuproq tahlili kerakmi deb mahalliy agronomdan so‘rang.'},
   {title:'Ekin mavsumga sig‘adimi?',text:'Bug‘doy yig‘imi, keyingi ekish muddatlari va ishchilar borligini tekshiring.'}
  ],
  conclusion:'AgroSat NASA iqlim tarixi va Xorazm tadqiqotlari bilan almashlab ekish variantlarini solishtiradi, ammo ekinni sizning o‘rningizga tanlamaydi.',
  guide:'Nima uchun? Quyida ilmiy izohlarni ochishingiz mumkin.'
 }
} as const
const icons=[Droplets,BookOpenCheck,Sprout]
export function FarmerScienceIntro({language}:{language:Language}) {
 const c=content[language]
 return <section className="science-farmer-intro" aria-labelledby="science-farmer-title">
  <span className="overline">{c.eyebrow}</span>
  <h2 id="science-farmer-title">{c.title}</h2>
  <p className="science-farmer-lead">{c.intro}</p>
  <div className="science-farmer-cards">{c.points.map((point,index)=>{
   const Icon=icons[index]
   return <article key={point.title}>
    <div className="science-farmer-icon"><Icon size={23}/></div>
    <h3>{index+1}. {point.title}</h3>
    <p>{point.text}</p>
   </article>
  })}</div>
  <p className="science-farmer-conclusion"><ClipboardCheck size={20}/>{c.conclusion}</p>
  <p className="science-farmer-guide">{c.guide}</p>
 </section>
}
