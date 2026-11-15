import { CalendarDays, ClipboardList, Droplets, FlaskConical, Plus, Trash2 } from 'lucide-react'
import { t, type Language, type TranslationKey } from '../i18n'
import type { CropId, FarmerCropStage, FarmInput } from '../types'
import { farmInputIssues } from '../fieldValidation'

interface Props {
  language:Language
  farm: FarmInput
  onUpdate:<K extends keyof FarmInput>(key:K,value:FarmInput[K])=>void
}
const cropNames:Record<CropId, TranslationKey> = {
  wheat:'cropWheat',mungbean:'cropMungbean',green_manure:'cropGreenManure',
  cotton:'cropCotton',fallow:'cropFallow',other:'cropOther',
}
const calendarFields = [
  {key:'wheat_harvest_date',label:'dateWheat'},
  {key:'mungbean_harvest_date',label:'dateMung'},
  {key:'green_manure_sowing_date',label:'dateGreenSow'},
  {key:'green_manure_end_date',label:'dateGreenEnd'},
  {key:'cotton_sowing_date',label:'dateCotton'},
] as const

export function FieldDataInputs({language,farm,onUpdate}:Props) {
  const issues=farmInputIssues(farm).filter(key=>key!=='currentRequired')
  const setNumber = (key:'irrigation_m3_ha'|'salinity_ece_ds_m'|'soil_ph'|'soil_sample_depth_cm',value:string)=>
    onUpdate(key,value.trim()===''?null:Number(value))
  const setDate=(key:typeof calendarFields[number]['key']|'soil_sample_date',value:string)=>
    onUpdate(key,value||null)
  const modifyStage=(index:number,patch:Partial<FarmerCropStage>)=>
    onUpdate('current_rotation_stages',farm.current_rotation_stages.map((stage,i)=>
      i===index?{...stage,...patch}:stage))
  return <details className="field-data-panel" data-testid="advanced-field-data">
    <summary><span className="field-data-icon"><ClipboardList size={19}/></span>
      <span><strong>{t(language,'advancedTitle')}</strong><small>{t(language,'advancedIntro')}</small></span>
    </summary>
    <div className="field-data-content">
      <section className="field-data-group">
        <h3><CalendarDays size={18}/>{t(language,'calendarSection')}</h3>
        <p>{t(language,'calendarHint')}</p>
        <label className="form-field"><span>{t(language,'fieldSeasonYear')}</span>
          <input type="number" min="2024" max="2099" step="1" value={farm.season_year}
            onChange={e=>onUpdate('season_year',Number(e.target.value)||2026)}/></label>
        <div className="field-data-fields">
          {calendarFields.map(item=><label className="form-field" key={item.key}>
            <span>{t(language,item.label)}</span>
            <input type="date" value={farm[item.key]||''}
              onChange={e=>setDate(item.key,e.target.value)}/>
          </label>)}
        </div>
      </section>

      {!farm.current_rotation_is_example && <section className="field-data-group">
        <h3><ClipboardList size={18}/>{t(language,'rotationStagesTitle')}</h3>
        <p>{t(language,'rotationStagesHint')}</p>
        {farm.current_rotation_stages.map((stage,index)=><div className="farmer-stage" key={index}>
          <label className="form-field"><span>{index+1}. {t(language,'rotationStagesTitle')}</span>
            <select value={stage.crop} onChange={e=>modifyStage(index,{crop:e.target.value as CropId})}>
              {(Object.entries(cropNames) as [CropId,TranslationKey][]).map(([crop,name])=>
                <option value={crop} key={crop}>{t(language,name)}</option>)}
            </select></label>
          <label className="form-field"><span>{t(language,'stageSowing')}</span>
            <input type="date" value={stage.sowing_date||''}
              onChange={e=>modifyStage(index,{sowing_date:e.target.value||null})}/></label>
          <label className="form-field"><span>{t(language,'stageHarvest')}</span>
            <input type="date" value={stage.harvest_date||''}
              onChange={e=>modifyStage(index,{harvest_date:e.target.value||null})}/></label>
          <button type="button" className="field-minibutton" aria-label={t(language,'stageRemove')}
            onClick={()=>onUpdate('current_rotation_stages',farm.current_rotation_stages.filter((_,i)=>i!==index))}>
            <Trash2 size={16}/></button>
        </div>)}
        <button type="button" className="field-add" disabled={farm.current_rotation_stages.length>=8}
          onClick={()=>onUpdate('current_rotation_stages',[...farm.current_rotation_stages,
            {crop:'wheat',sowing_date:null,harvest_date:null}])}>
          <Plus size={16}/>{t(language,'stageAdd')}</button>
      </section>}

      <section className="field-data-group">
        <h3><Droplets size={18}/>{t(language,'irrigationSection')}</h3>
        <div className="field-data-fields">
          <label className="form-field"><span>{t(language,'irrigationVolume')}</span>
            <input type="number" min="0" max="50000" step="10"
              value={farm.irrigation_m3_ha??''} onChange={e=>setNumber('irrigation_m3_ha',e.target.value)}
              placeholder="—"/></label>
          <label className="form-field"><span>{t(language,'irrigationSource')}</span>
            <select value={farm.irrigation_source} onChange={e=>
              onUpdate('irrigation_source',e.target.value as FarmInput['irrigation_source'])}>
              <option value="unknown">{t(language,'originUnknown')}</option>
              <option value="farmer_estimate">{t(language,'originFarmer')}</option>
              <option value="metered">{t(language,'originMeter')}</option>
            </select></label>
          <label className="form-field"><span>{t(language,'irrigationPeriod')}</span>
            <select value={farm.irrigation_period} onChange={e=>
              onUpdate('irrigation_period',e.target.value as FarmInput['irrigation_period'])}>
              <option value="unknown">{t(language,'periodUnknown')}</option>
              <option value="summer_mungbean">{t(language,'periodMung')}</option>
              <option value="full_rotation">{t(language,'periodRotation')}</option>
            </select></label>
        </div>
      </section>

      <section className="field-data-group">
        <h3><FlaskConical size={18}/>{t(language,'soilSection')}</h3>
        <div className="field-data-fields">
          <label className="form-field"><span>{t(language,'soilECe')}</span>
            <input type="number" min="0" max="100" step="0.1"
              value={farm.salinity_ece_ds_m??''} onChange={e=>setNumber('salinity_ece_ds_m',e.target.value)}
              placeholder="—"/></label>
          <label className="form-field"><span>{t(language,'soilPH')}</span>
            <input type="number" min="0" max="14" step="0.1"
              value={farm.soil_ph??''} onChange={e=>setNumber('soil_ph',e.target.value)}
              placeholder="—"/></label>
          <label className="form-field"><span>{t(language,'soilSource')}</span>
            <select value={farm.soil_test_source} onChange={e=>
              onUpdate('soil_test_source',e.target.value as FarmInput['soil_test_source'])}>
              <option value="unknown">{t(language,'originUnknown')}</option>
              <option value="farmer_estimate">{t(language,'originFarmer')}</option>
              <option value="laboratory">{t(language,'originLaboratory')}</option>
            </select></label>
          <label className="form-field"><span>{t(language,'soilDate')}</span>
            <input type="date" value={farm.soil_sample_date||''} onChange={e=>
              setDate('soil_sample_date',e.target.value)}/></label>
          <label className="form-field"><span>{t(language,'soilDepth')}</span>
            <input type="number" min="1" max="500" step="1" value={farm.soil_sample_depth_cm??''}
              onChange={e=>setNumber('soil_sample_depth_cm',e.target.value)} placeholder="—"/></label>
        </div>
      </section>
      {issues.length>0 && <div className="field-errors" role="status">
        {issues.map(item=><p key={item}>{t(language,item as TranslationKey)}</p>)}
      </div>}
    </div>
  </details>
}
