import { strict as assert } from 'node:assert'
import { farmInputIssues } from '../src/fieldValidation.ts'

const empty={
  water:'unknown',salinity:'unknown',priority:'water',
  planting_month:7,planting_day:1,equipment_available:null,
  current_rotation_is_example:true,current_rotation_description:'',
  current_rotation_stages:[],season_year:2026,
  wheat_harvest_date:null,mungbean_harvest_date:null,
  green_manure_sowing_date:null,green_manure_end_date:null,cotton_sowing_date:null,
  irrigation_m3_ha:null,irrigation_source:'unknown',irrigation_period:'unknown',
  salinity_ece_ds_m:null,soil_ph:null,soil_test_source:'unknown',
  soil_sample_date:null,soil_sample_depth_cm:null,
}
assert.deepEqual(farmInputIssues(empty),[],'Unknown values must not be rejected as invalid')
const valid={...empty,irrigation_m3_ha:1200,irrigation_source:'metered',
  irrigation_period:'summer_mungbean',salinity_ece_ds_m:4.2,
  soil_ph:7.3,soil_test_source:'laboratory',soil_sample_depth_cm:30}
assert.deepEqual(farmInputIssues(valid),[])
for(const [field,value] of [
  ['irrigation_m3_ha',Infinity],['irrigation_m3_ha',-0.1],
  ['irrigation_m3_ha',50001],['irrigation_m3_ha',NaN],
  ['salinity_ece_ds_m',101],['soil_ph',15],['soil_ph',NaN],
  ['soil_sample_depth_cm',0],['soil_sample_depth_cm',8.5],
  ['season_year',2100],['season_year',2026.5],
]){
  const issues=farmInputIssues({...valid,[field]:value})
  assert(issues.includes('extraNumberInvalid'),`Missing invalid number flag: ${field} = ${value}`)
}
const withoutSource=farmInputIssues({...empty,irrigation_m3_ha:1000})
assert(withoutSource.includes('extraSourceRequired'))
assert(withoutSource.includes('extraPeriodRequired'))
assert(!withoutSource.includes('extraNumberInvalid'))
console.log('PASS: null stays unknown; 11 invalid finite/range/integer checks; source and period checks.')
