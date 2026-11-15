import type { FarmInput } from './types'

export function farmInputIssues(farm:FarmInput): string[] {
  const issues:string[]=[]
  if(!farm.current_rotation_is_example
      && !farm.current_rotation_description.trim() && farm.current_rotation_stages.length===0)
    issues.push('currentRequired')
  if(farm.irrigation_m3_ha!==null) {
    if(farm.irrigation_source==='unknown')issues.push('extraSourceRequired')
    if(farm.irrigation_period==='unknown')issues.push('extraPeriodRequired')
  }
  if((farm.salinity_ece_ds_m!==null || farm.soil_ph!==null) && farm.soil_test_source==='unknown')
    issues.push('extraSourceRequired')
  // API rejects values outside these physical/contract ranges; fail on the
  // form too. JSON.stringify turns NaN/Infinity into null, so silent sending
  // would otherwise erase an invalid user measurement.
  const measurements = [
    {value:farm.irrigation_m3_ha,min:0,max:50000,integer:false},
    {value:farm.salinity_ece_ds_m,min:0,max:100,integer:false},
    {value:farm.soil_ph,min:0,max:14,integer:false},
    {value:farm.soil_sample_depth_cm,min:1,max:500,integer:true},
    {value:farm.season_year,min:2024,max:2099,integer:true},
  ]
  for(const {value,min,max,integer} of measurements) {
    if(value!==null && (!Number.isFinite(value) || value<min || value>max ||
       (integer && !Number.isInteger(value))))
      issues.push('extraNumberInvalid')
  }
  const years:Record<string,number>={
    wheat_harvest_date:farm.season_year,
    mungbean_harvest_date:farm.season_year,
    green_manure_sowing_date:farm.season_year,
    green_manure_end_date:farm.season_year+1,
    cotton_sowing_date:farm.season_year+1,
  }
  for(const [field,year] of Object.entries(years)) {
    const date=farm[field as keyof FarmInput]
    if(typeof date==='string' && date && !date.startsWith(String(year)+'-'))
      issues.push('calendarHint')
  }
  return [...new Set(issues)]
}
