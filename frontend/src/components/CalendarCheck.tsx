import { CalendarCheck2, CalendarX2, Clock3 } from 'lucide-react'
import { t, type Language, type TranslationKey } from '../i18n'

import type { CalendarAssessment } from '../types'

const stageNames:Record<string,TranslationKey>={
  wheat_harvest:'dateWheat',
  mungbean_sowing:'inputSowing',
  mungbean_harvest:'dateMung',
  green_manure_sowing:'dateGreenSow',
  green_manure_end:'dateGreenEnd',
  cotton_sowing:'dateCotton',
}
const cropKeys:Record<string,TranslationKey>={
  wheat:'cropWheat',mungbean:'cropMungbean',green_manure:'cropGreenManure',
  cotton:'cropCotton',fallow:'cropFallow',other:'cropOther'
}
const statuses:Record<CalendarAssessment['status'],TranslationKey>={
  not_evaluated:'calendarStatus_not_evaluated',
  missing_dates:'calendarStatus_missing_dates',
  conflict:'calendarStatus_conflict',
  chronological_only:'calendarStatus_chronological_only',
  review:'calendarStatus_review',
}
function nameForStage(language:Language,key:string):string {
  const known=stageNames[key]
  if(known)return t(language,known)
  const [,index,crop,ended]=key.match(/^baseline_(\d+)_(\w+?)(_end)?$/)||[]
  if(index!==undefined && crop) return [
    String(Number(index)+1),t(language,cropKeys[crop]||'cropOther'),
    ended ? t(language,'stageHarvest') : t(language,'stageSowing')
  ].join(' · ')
  return key
}
function formatDate(language:Language,value:string|null):string {
  if(!value)return '—'
  const day=new Date(value+'T00:00:00')
  return new Intl.DateTimeFormat(language==='ru'?'ru-RU':language==='uz'?'uz-UZ':'en-GB',
    {day:'numeric',month:'short',year:'numeric'}).format(day)
}

export function CalendarCheck({language,assessment}:{
  language:Language
  assessment:CalendarAssessment
}) {
  const {status,events,note_codes,duration_days}=assessment
  return <div className={'calendar-check calendar-'+status} data-testid="calendar-check">
    <div className="calendar-check-header">
      {status==='conflict'?<CalendarX2 size={20}/>:<CalendarCheck2 size={20}/>}
      <strong>{t(language,'calendarResultTitle')}</strong>
      <span className="calendar-check-status">{t(language,statuses[status])}</span>
    </div>
    {events.length>0 && <div className="calendar-events">
      {events.map((event,index)=><div key={index}>
        <span>{nameForStage(language,event.stage)}</span>
        <b>{formatDate(language,event.date)}</b>
      </div>)}
    </div>}
    {duration_days!==null && <p className="calendar-duration"><Clock3 size={15}/>
      {t(language,'calendarDuration')}: <strong>{duration_days} {t(language,'calendarDayUnit')}</strong>
    </p>}
    {note_codes.map(code=><p className="calendar-message" key={code}>
      {t(language,code as TranslationKey)}
    </p>)}
    <p className="calendar-source">{t(language,'calendarSourceLine')}</p>
  </div>
}
