import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--disable-extensions','--no-first-run']
})
const errors=[]
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  page.on('pageerror',error=>errors.push(error.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('calendar-check').first().waitFor()
  let cases=page.getByTestId('calendar-check')
  assert.equal(await cases.count(),3)
  await page.getByTestId('rotation-B').getByText('Missing dates').waitFor()
  const panel=page.getByTestId('advanced-field-data')
  await panel.locator('summary').click()
  await page.getByLabel('Wheat harvest',{exact:true}).fill('2026-06-24')
  await page.getByLabel('Mung bean harvest',{exact:true}).fill('2026-09-13')
  await page.getByLabel('Winter pea green manure sowing').fill('2026-10-01')
  await page.getByLabel('Winter pea termination').fill('2027-03-15')
  await page.getByLabel('Next cotton sowing').fill('2027-04-15')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-C').getByText('Chronological order only').waitFor()
  await page.getByTestId('rotation-C').getByText('74 days').waitFor()
  assert.equal(await page.getByTestId('rotation-B').getByText('Chronological order only').count(),1)
  // A dated but overlapping green manure is explicitly a conflict.
  await page.getByLabel('Winter pea green manure sowing').fill('2026-08-20')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-C').getByText('Date conflict').waitFor()
  await page.getByTestId('spotlight-C').getByText('Conflicting crop dates').waitFor()
  assert.equal(await page.getByTestId('rotation-B').getByText('Chronological order only').count(),1)
  await page.getByLabel('Winter pea green manure sowing').fill('2026-10-01')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-C').getByText('Chronological order only').waitFor()

  await page.getByLabel('Irrigation volume (m³/ha)').fill('1150')
  assert.equal(await page.locator('.run-btn').isDisabled(),true,
    'Must not accept irrigation value without source and period')
  await page.getByLabel('Source of irrigation value').selectOption('metered')
  await page.getByLabel('Period covered by volume').selectOption('summer_mungbean')
  await page.getByLabel('Soil salinity ECe (dS/m)').fill('4.2')
  assert.equal(await page.locator('.run-btn').isDisabled(),true,
    'Must not accept ECe without source')
  await page.getByLabel('Source of soil values').selectOption('laboratory')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('field-evidence')
    .locator('[data-code="irrigationMeasurementLimited"][data-source="reported_metered"]').waitFor()
  await page.getByTestId('rotation-C').getByText('Chronological order only').waitFor()
  assert.equal(await page.getByTestId('rotation-B').getByText('Laboratory soil salinity (ECe) has not been supplied.').count(),0)
  await page.getByTestId('language-select').selectOption('ru')
    await page.getByTestId('rotation-B').getByText('Только порядок дат').waitFor()
  await page.getByTestId('language-select').selectOption('uz')
  await page.getByTestId('rotation-B').getByText('Faqat vaqt tartibi').waitFor()

  await page.getByRole('tab',{name:/Методика|Methods|usul|Manbalar/i}).click()
  await page.getByTestId('crop-reference-panel').waitFor()
  await page.getByTestId('crop-reference-panel').locator('summary').click()
  assert.equal(await page.getByTestId('crop-reference-panel').locator('.crop-reference').count(),4)
  assert.equal(await page.getByTestId('crop-reference-panel').locator('.crop-source').count()>=4,true)

  const out=path.resolve('../artifacts')
  await mkdir(out,{recursive:true})
  await page.getByTestId('crop-reference-panel').screenshot({path:path.join(out,'agrosat-crop-evidence.png')})
  await page.getByTestId('language-select').selectOption('en')
  await page.getByRole('tab',{name:'Compare Rotations'}).click()
  await page.getByTestId('advanced-field-data').locator('summary').click()
  await page.getByLabel('I want to enter my actual current crop rotation').check()
  await page.getByRole('button',{name:'Add crop'}).click()
  await page.locator('.farmer-stage select').first().selectOption('wheat')
  await page.getByRole('button',{name:'Add crop'}).click()
  await page.locator('.farmer-stage select').nth(1).selectOption('mungbean')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('spotlight-A').getByRole('heading',{name:'wheat → mungbean'}).waitFor()
  const item=page.getByTestId('rotation-A')
  assert.equal(await item.locator('.impact-level.unknown').count()>=1,true)
  await item.getByText('Missing dates').waitFor()

  for(const width of [390,320]){
    const m=await browser.newPage({viewport:{width,height:800}})
    m.on('pageerror',e=>errors.push(e.message))
    await m.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
    await m.getByTestId('advanced-field-data').locator('summary').click()
    assert.equal(await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,
      `Document horizontal overflow at ${width}px`)
    await m.close()
  }
  if(errors.length)throw Error(errors.join(' | '))
  console.log(JSON.stringify({calendarConsistent:'PASS',overlapConflict:'PASS',
    farmerMeasurementsProvenance:'PASS',threeLanguages:'PASS',fourCropReferences:'PASS',
    structuredBaseline:'PASS',mobile320_390:'PASS',javascriptErrors:0},null,2))
} finally {await browser.close()}
