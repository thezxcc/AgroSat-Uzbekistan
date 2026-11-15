import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--no-first-run','--disable-extensions']
})
const failures=[]
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}})
  page.on('pageerror',error=>failures.push(error.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByLabel('I want to enter my actual current crop rotation').check()
  const advanced=page.getByTestId('advanced-field-data')
  await advanced.locator('summary').click()
  for (const crop of ['wheat','fallow','mungbean']) {
    await page.getByRole('button',{name:'Add crop'}).click()
    const stage=page.locator('.farmer-stage').last()
    await stage.locator('select').selectOption(crop)
  }
  const stages=page.locator('.farmer-stage')
  await stages.nth(0).locator('input[type=date]').nth(0).fill('2025-10-10')
  await stages.nth(0).locator('input[type=date]').nth(1).fill('2026-06-24')
  // Deliberately leave both dates for intermediate fallow unknown.
  await stages.nth(2).locator('input[type=date]').nth(0).fill('2026-06-10')
  await stages.nth(2).locator('input[type=date]').nth(1).fill('2026-09-01')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-A').getByText('Date conflict').waitFor()
  await page.getByTestId('spotlight-A').getByText('Conflicting crop dates').waitFor()
  assert.equal(await page.getByTestId('rotation-A').getByText('Date conflict').count(),1)

  await page.getByTestId('language-select').selectOption('ru')
  await page.getByTestId('spotlight-A').getByText('Несовместимые сроки культур').waitFor()
  await page.getByTestId('language-select').selectOption('uz')
  await page.getByTestId('rotation-A').getByText('Sanalar ziddiyati').waitFor()
  await page.getByTestId('language-select').selectOption('en')
  // The corrected dates remove the conflict but uncertainty remains.
  await stages.nth(2).locator('input[type=date]').nth(0).fill('2026-07-02')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-A').getByText('Missing dates').waitFor()
  assert.equal(await page.getByTestId('spotlight-A').getByText('Conflicting crop dates').count(),0)

  // Harvest earlier than sowing should be a date conflict, not -5 days of growth.
  await page.getByLabel('I want to enter my actual current crop rotation').uncheck()
  await page.getByLabel('Mung bean harvest',{exact:true}).fill('2026-06-26')
  await page.locator('.run-btn').click()
  await page.getByTestId('rotation-A').waitFor()
  await page.locator('.rotation-expansion').evaluateAll(items=>items.forEach(item=>item.open=true))
  await page.getByTestId('rotation-B').getByText('Date conflict').waitFor()
  assert.equal(await page.getByTestId('rotation-B').locator('.calendar-duration').count(),0)

  if(failures.length)throw Error('Browser JS errors: '+failures.join(' | '))
  console.log(JSON.stringify({
    hiddenConflictDetected:'PASS',customBaselineStatus:'PASS',twoTranslations:'PASS',
    repairedCalendarRetainsUnknowns:'PASS',negativeDurationNotDisplayed:'PASS',javascriptErrors:0
  },null,2))
}finally{await browser.close()}
