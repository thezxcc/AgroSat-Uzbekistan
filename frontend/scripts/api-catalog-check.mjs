import { scienceEn, scienceRu, scienceUz } from '../src/i18n/science.ts'
import { impactEn, impactRu, impactUz } from '../src/i18n/impact.ts'
import { strict as assert } from 'node:assert'

const science={en:scienceEn,ru:scienceRu,uz:scienceUz}
const impact={en:impactEn,ru:impactRu,uz:impactUz}
const scenarios=[
  {},
  {water:'none',salinity:'high',equipment_available:false,priority:'soil'},
  {water:'available',salinity:'low',equipment_available:true,priority:'income'},
  {water:'limited',salinity:'unknown',priority:'water'},
  {water:'unknown',salinity:'unknown',priority:'income'},
  {water:'available',salinity:'high',priority:'soil'},
  {water:'none',current_rotation_is_example:false,current_rotation_description:'alfalfa → wheat'},
  {water:'none',irrigation_m3_ha:1200,irrigation_source:'metered',irrigation_period:'summer_mungbean'},
  {water:'available',irrigation_m3_ha:1100,irrigation_source:'farmer_estimate',irrigation_period:'summer_mungbean'},
  {salinity:'low',salinity_ece_ds_m:12,soil_test_source:'laboratory'},
  {salinity:'high',salinity_ece_ds_m:0.4,soil_test_source:'farmer_estimate'},
  {current_rotation_is_example:false,current_rotation_stages:[{crop:'wheat'},{crop:'mungbean'}]},
]
let checked=0
const evidenceCodes=new Set()
for(const input of scenarios) {
  const response=await fetch('http://127.0.0.1:8000/api/compare',{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)
  })
  if(response.status!==200) throw Error(`API HTTP ${response.status}: ${await response.text()}`)
  const result=await response.json()
  assert.equal(result.rotations.length,3)
  assert(result.field_evidence.length>=3,'Farm provenance checks must always be present')
  for(const check of result.field_evidence) {
    evidenceCodes.add(check.note_code)
    assert(['soil','irrigation','rotation'].includes(check.dimension))
    assert(check.source!=='verified','Self-reported field data must not be labelled verified')
    for(const [locale,messages] of Object.entries(science)) {
      assert(messages[check.note_code],`Field evidence translation missing: ${locale}/${check.note_code}`)
      checked+=1
    }
  }
  for(const rotation of result.rotations) {
    for(const code of [rotation.title_key,rotation.description_key,rotation.evidence_key,
      ...rotation.warnings_codes,...rotation.evidence_points_codes,
      ...rotation.unknowns_codes,...rotation.calendar.note_codes]) {
      for(const [locale,messages] of Object.entries(science)) {
        assert(messages[code],`Scientific translation missing: ${locale}/${code}`)
        checked+=1
      }
    }
    assert.equal(rotation.impacts.length,6)
    for(const x of rotation.impacts) {
      for(const [locale,messages] of Object.entries(impact)) {
        assert(messages[x.note_code],`Impact translation missing: ${locale}/${x.note_code}`)
        checked+=1
      }
    }
  }
}
for(const code of [
  'irrigationVolumeMissing','irrigationEstimateUnverified',
  'irrigationMeasurementLimited','irrigationCategoryUnreconciled',
  'soilEceMissing','soilEstimateUnverified','soilMeasurementLimited',
  'soilLabMetadataIncomplete','soilCategoryUncalibrated',
  'baselineResearchExample','baselineFarmerUnverified',
]) assert(evidenceCodes.has(code),`Field evidence scenario missing coverage: ${code}`)
const crops=await fetch('http://127.0.0.1:8000/api/crops')
assert.equal(crops.status,200)
const catalog=await crops.json()
assert.equal(catalog.crops.length,4)
assert.equal(catalog.crops.find(x=>x.id==='mungbean').seasonal_water_need_mm,null)
console.log(`PASS: ${scenarios.length} real API scenarios, ${checked} localized scientific, calendar and field-provenance message references; 4 verified crop entries.`)
