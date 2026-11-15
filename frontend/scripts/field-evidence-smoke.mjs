import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--disable-extensions','--no-first-run']
})
const errors=[]
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  const evidence=page.getByTestId('field-evidence')
  await evidence.waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await evidence.locator('summary').click()
  await evidence.locator('[data-code="baselineResearchExample"]').waitFor()
  assert.equal(await evidence.locator('[data-source="reported_laboratory"]').count(),0)

  const advanced=page.getByTestId('advanced-field-data')
  await advanced.locator('summary').click()
  await page.getByLabel('IRRIGATION WATER').selectOption('none')
  await page.getByLabel('Irrigation volume (m³/ha)').fill('1200')
  await page.getByLabel('Source of irrigation value').selectOption('metered')
  await page.getByLabel('Period covered by volume').selectOption('summer_mungbean')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('spotlight-B').getByText('No irrigation: high risk').waitFor()
  await evidence.locator('[data-code="irrigationCategoryUnreconciled"]').waitFor()
  assert.equal(await evidence.locator('[data-code="irrigationMeasurementLimited"][data-source="reported_metered"]').count(),1)
  await page.getByTestId('rotation-B').getByText('Reported water availability',{exact:false}).waitFor()

  await page.locator('.farm-fields .form-field').nth(1).locator('select').selectOption('low')
  await page.getByLabel('Soil salinity ECe (dS/m)').fill('12')
  await page.getByLabel('Source of soil values').selectOption('laboratory')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await evidence.locator('[data-code="soilCategoryUncalibrated"]').waitFor()
  await evidence.locator('[data-code="soilLabMetadataIncomplete"]').waitFor()
  assert.equal(await evidence.locator('[data-code="soilMeasurementLimited"][data-source="reported_laboratory"]').count(),1)
  assert.equal(await page.getByTestId('rotation-B').getByText('Elevated salinity reported',{exact:false}).count(),0)

  await page.getByTestId('language-select').selectOption('ru')
  await evidence.getByText('Заявленная доступность воды',{exact:false}).waitFor()
  await evidence.getByText('Со слов пользователя: лабораторный анализ').first().waitFor()
  await page.getByTestId('language-select').selectOption('uz')
  await evidence.getByText('Kiritilgan qaydlar mustaqil tekshirilmagan',{exact:false}).waitFor()
  await evidence.getByText('Foydalanuvchi ma’lumoti: laboratoriya').first().waitFor()
  await page.getByTestId('language-select').selectOption('en')

  await page.getByLabel('Sample collection date').fill('2026-06-20')
  await page.getByLabel('Sample depth (cm)').fill('30')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await evidence.locator('[data-code="soilCategoryUncalibrated"]').waitFor()
  assert.equal(await evidence.locator('[data-code="soilLabMetadataIncomplete"]').count(),0)

  await page.getByLabel('Source of soil values').selectOption('farmer_estimate')
  await page.getByLabel('Source of irrigation value').selectOption('farmer_estimate')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await evidence.locator('[data-code="soilEstimateUnverified"]').waitFor()
  await evidence.locator('[data-code="irrigationEstimateUnverified"]').waitFor()
  assert.equal(await evidence.locator('[data-code="soilMeasurementLimited"]').count(),0)
  assert.equal(await evidence.locator('[data-code="irrigationMeasurementLimited"]').count(),0)
  await page.getByTestId('spotlight-B').getByText('No irrigation: high risk').waitFor()

  // A value outside the contract must never be silently sent as JSON null
  // or accepted as a plausible soil observation.
  await page.getByLabel('Soil pH',{exact:true}).fill('15')
  assert.equal(await page.locator('.run-btn').isDisabled(),true)
  await page.getByText('A number is outside its allowed range',{exact:false}).waitFor()
  await page.getByLabel('Soil pH',{exact:true}).fill('7.1')
  assert.equal(await page.locator('.run-btn').isEnabled(),true)
  await page.getByLabel('Irrigation volume (m³/ha)').fill('60000')
  assert.equal(await page.locator('.run-btn').isDisabled(),true)
  await page.getByLabel('Irrigation volume (m³/ha)').fill('1200')
  assert.equal(await page.locator('.run-btn').isEnabled(),true)

  await page.setViewportSize({width:320,height:800})
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),
    false,'Field provenance panel causes horizontal overflow at 320px')
  assert.deepEqual(errors,[])
  console.log(JSON.stringify({
    missingEvidence:'PASS',reportedMeteredNotVerified:'PASS',
    conflictingIrrigationWarns:'PASS',uncalibratedECeNotReclassified:'PASS',
    labMetadataMissingThenCompleted:'PASS',estimatesDistinguished:'PASS',
    enRuUz:'PASS',invalidNumbersRejected:'PASS',mobile320:'PASS',javascriptErrors:0
  },null,2))
} finally {await browser.close()}
