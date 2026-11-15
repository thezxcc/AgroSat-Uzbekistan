import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--no-first-run','--disable-extensions']
})
const failures=[]
try {
  const page=await browser.newPage({viewport:{width:1380,height:900}})
  page.on('pageerror',error=>failures.push(error.message))
  const releaseInitial=[]
  const releaseAvailable=[]
  await page.route('**/api/compare',async route=>{
    const water=route.request().postDataJSON().water
    if(water==='unknown' || water==='available') {
      const original=await route.fetch()
      await new Promise(resolve=>{
        (water==='unknown'?releaseInitial:releaseAvailable).push(resolve)
      })
      await route.fulfill({response:original})
    }else await route.continue()
  })
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'})
  await page.locator('.run-btn:not([disabled])').waitFor({timeout:12000})
  await page.getByLabel('IRRIGATION WATER').selectOption('none')
  await page.locator('.run-btn').click()
  await page.getByTestId('spotlight-B').getByText('No irrigation: high risk').waitFor()
  assert(releaseInitial.length>=1,'Expected at least one delayed startup response')
  releaseInitial.forEach(release=>release())
  await page.waitForTimeout(300)
  await page.getByTestId('spotlight-B').getByText('No irrigation: high risk').waitFor()

  await page.getByLabel('IRRIGATION WATER').selectOption('available')
  await page.locator('.run-btn').click()
  await page.waitForFunction(()=>!!document.querySelector('.run-btn[disabled]'),undefined,{timeout:3000})
  await page.waitForTimeout(200)
  assert.equal(releaseAvailable.length,1,'Expected delayed farmer request')
  await page.getByLabel('IRRIGATION WATER').selectOption('limited')
  await page.getByText('Farm conditions changed. Compare again to update all three options.').waitFor()
  assert.equal(await page.getByTestId('rotation-spotlight').count(),0)
  releaseAvailable.forEach(release=>release())
  await page.locator('.run-btn:not([disabled])').waitFor({timeout:6000})
  assert.equal(await page.getByTestId('rotation-spotlight').count(),0)
  await page.locator('.run-btn').click()
  await page.getByTestId('spotlight-B').getByText('Limited water: irrigation risk').waitFor()

  await page.getByLabel('I want to enter my actual current crop rotation').check()
  await page.getByText('Enter the crops in your current rotation', {exact:false}).waitFor()
  assert.equal(await page.locator('.run-btn').isDisabled(),true)
  await page.getByPlaceholder('e.g. wheat → cotton').fill('wheat → cotton')
  assert.equal(await page.locator('.run-btn').isEnabled(),true)

  // Broken evidence registry does not suppress real NASA numbers or comparison.
  const context=await browser.newContext({viewport:{width:1280,height:800}})
  await context.route('**/api/evidence',route=>route.fulfill({
    status:503, contentType:'application/json',
    body:JSON.stringify({detail:'Source service temporarily unavailable'})
  }))
  const other=await context.newPage()
  other.on('pageerror',error=>failures.push(error.message))
  await other.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await other.getByTestId('spotlight-B').waitFor()
  await other.locator('.run-btn:not([disabled])').waitFor()
  await other.getByText('Source service temporarily unavailable',{exact:false}).waitFor()
  await context.close()
  if(failures.length)throw Error(failures.join(' | '))
  console.log(JSON.stringify({
    outOfOrderInitialResponse:'PASS', editsDuringRequest:'PASS',
    nonBlockingEvidenceFailure:'PASS', userRotationValidation:'PASS', browserErrors:0,
  },null,2))
} finally {await browser.close()}
