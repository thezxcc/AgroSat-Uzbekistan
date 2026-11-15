import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Droplets, Leaf, ShieldCheck, Sprout, Info } from 'lucide-react'
import { easyText as e, type EasyLanguage } from '../i18n/farmerEasy'
import type { FarmInput, Comparison } from '../types'

type Props = {
 language: EasyLanguage; farm: FarmInput;
 onUpdate: <K extends keyof FarmInput>(key:K,value:FarmInput[K])=>void;
 onRun:()=>void; busy:boolean; ready:boolean; dirty:boolean;
 result:Comparison|null; invalid:boolean;
}

export function FarmerEasy({language,farm,onUpdate,onRun,busy,ready,dirty,result,invalid}:Props) {
 const [step,setStep]=useState(0)
 const [checked,setChecked]=useState(false)
 const [expandedChecks,setExpandedChecks]=useState(false)
 const text=(name:Parameters<typeof e>[1])=>e(language,name)
 const steps=[
  {title:text('water'),icon:Droplets,field:'water',options:[
   {value:'available',label:text('enough')},{value:'limited',label:text('limited')},
   {value:'none',label:text('none')},{value:'unknown',label:text('unknown')}]},
  {title:text('soil'),icon:Leaf,field:'salinity',options:[
   {value:'low',label:text('low')},{value:'high',label:text('high')},
   {value:'unknown',label:text('soilUnknown')}]},
  {title:text('goal'),icon:Sprout,field:'priority',options:[
   {value:'water',label:text('waterGoal')},{value:'income',label:text('incomeGoal')},
   {value:'soil',label:text('soilGoal')}]},
 ] as const
 const advice=farm.water==='none'?text('noneInsight'):
  farm.water==='limited'?text('limitedInsight'):
  farm.water==='available'?text('enoughInsight'):text('unknownInsight')
 const checks=[text('checkWater'),text('checkSoil'),text('checkDates'),text('checkEquipment')]
 const mainCheck=farm.water==='unknown'||farm.water==='limited'||farm.water==='none'?checks[0]:
   farm.salinity==='unknown'||farm.salinity==='high'?checks[1]:checks[2]
 const nextStep=()=>{
  if(step<2) setStep(step+1)
  else {setChecked(true);onRun()}
 }
 return <section id="farmer-start" className="farmer-easy" aria-labelledby="farmer-easy-title">
  <header className="farmer-easy-header">
   <span className="farmer-easy-eyebrow"><Sprout size={17}/>{text('eyebrow')}</span>
   <h2 id="farmer-easy-title">{text('title')}</h2>
   <p>{text('description')}</p>
  </header>
  <div className="easy-wizard" data-testid="easy-wizard">
   <div className="easy-progress" aria-label={text('progress')}>
    <span>{text('stepOf').replace('{step}',String(step+1))}</span>
    <div className="easy-progress-track" aria-hidden="true"><span style={{width:`${(step+1)*100/3}%`}}/></div>
   </div>
   <div className="easy-questions">
    {steps.map((item,index)=>{
      const Icon=item.icon
      const value=item.field==='water'?farm.water:item.field==='salinity'?farm.salinity:farm.priority
      return <fieldset className={'easy-question'+(index===step?' easy-current':'')} key={item.field} hidden={index!==step}>
       <legend><span className="easy-question-icon"><Icon size={23}/></span>{item.title}</legend>
       <div className="easy-choices">
        {item.options.map(opt=><label className={'easy-choice'+(value===opt.value?' selected':'')} key={opt.value}>
         <input type="radio" name={'easy-'+item.field} checked={value===opt.value}
          onChange={()=>onUpdate(item.field,opt.value as never)}/>
         <span>{opt.label}</span>{value===opt.value&&<CheckCircle2 size={22}/>}
        </label>)}
       </div>
      </fieldset>
    })}
   </div>
   <div className="easy-wizard-actions">
    {step>0?<button type="button" className="easy-back" onClick={()=>setStep(step-1)}><ArrowLeft size={18}/>{text('back')}</button>:
     <span className="easy-note"><CircleHelp size={18}/>{text('note')}</span>}
    <button className="easy-submit" type="button" disabled={busy||!ready||invalid}
      onClick={nextStep}>{busy?text('loading'):step===2?text('action'):text('continue')}<ArrowRight size={20}/></button>
   </div>
  </div>
  <section className="easy-next" data-testid="farmer-next-step" aria-label={text('resultTitle')}>
   <div className="easy-next-heading"><span className="easy-next-icon"><ShieldCheck size={25}/></span>
    <div><span className="farmer-easy-eyebrow">{text('earth')}</span><h3>{text('resultTitle')}</h3></div>
   </div>
   {!checked ? <p>{text('empty')}</p> : dirty||!result?<p role="status">{text('changed')}</p>:<>
    <p className="easy-main-advice">{advice}</p>
    <div className="easy-action-highlight"><CheckCircle2 size={24}/><span>{mainCheck}</span></div>
    <button type="button" className="easy-show-checks" aria-expanded={expandedChecks} onClick={()=>setExpandedChecks(!expandedChecks)}>
     {expandedChecks?text('hideChecks'):text('showChecks')} <ArrowRight size={16}/>
    </button>
    {expandedChecks&&<div className="easy-all-checks"><h4>{text('next')}</h4>
     <ul>{checks.map((check,i)=><li key={i}><CheckCircle2 size={18}/>{check}</li>)}</ul></div>}
    <details className="easy-disclaimer-details"><summary><Info size={15}/>{text('whyCareful')}</summary>
      <p>{text('careful')}</p></details>
   </>}
   <button className="easy-detail-link" type="button" onClick={()=>document.getElementById('full-comparison')?.scrollIntoView({behavior:'smooth',block:'start'})}>
    {text('research')} <ArrowRight size={17}/>
   </button>
  </section>
 </section>
}

