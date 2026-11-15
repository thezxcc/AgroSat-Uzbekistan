import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--disable-extensions','--no-first-run']
})
try {
  const page=await browser.newPage({viewport:{width:1365,height:850}})
  const faults=[]
  page.on('pageerror',error=>faults.push(error.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByRole('tab',{name:'Methods & Sources'}).click()
  const panel=page.getByTestId('crop-reference-panel')
  await panel.waitFor({timeout:8000}).catch(async error=>{
    console.log('DIAGNOSTICS',JSON.stringify({
      selected:await page.getByRole('tab').evaluateAll(tabs=>tabs.map(tab=>({
        text:tab.textContent,selected:tab.getAttribute('aria-selected')
      }))),
      errors:await page.locator('.error').allTextContents(),
      pageErrors:faults,
      cropApi:await page.evaluate(async()=>{
        const response=await fetch('/api/crops')
        return {status:response.status,text:(await response.text()).slice(0,300)}
      })
    },null,2))
    throw error
  })
  await panel.locator('summary').click()
  const cards=panel.locator('.crop-reference')
  assert.equal(await cards.count(),4)
  for(const [index,count] of [[0,1],[1,4],[2,0],[3,2]]) {
    assert.equal(await cards.nth(index).locator('a.crop-metric-source').count(),count,
      `Crop ${index} incorrect number of value-specific citations`)
  }
  const wheat=cards.nth(0)
  const mung=cards.nth(1)
  const green=cards.nth(2)
  const cotton=cards.nth(3)
  assert.equal(await wheat.locator('dd').nth(3).locator('a[href*="fao.org"]').count(),1)
  assert.equal(await mung.locator('dd').nth(0).locator('a[href*="mel.cgiar.org"]').count(),1)
  assert.equal(await mung.locator('dd').nth(1).locator('a[href*="ecocrop.apps.fao.org"]').count(),1)
  assert.equal(await mung.locator('dd').nth(2).locator('a[href*="ecocrop.apps.fao.org"]').count(),1)
  assert.equal(await mung.locator('.crop-salt a[href*="ecocrop.apps.fao.org"]').count(),1)
  assert.equal(await green.locator('.crop-source[href*="mel.cgiar.org"]').count(),1)
  assert.equal(await cotton.locator('dd').nth(3).locator('a[href*="fao.org"]').count(),1)
  assert.equal(await cotton.locator('.crop-salt a[href*="T0667E"]').count(),1)
  await cotton.getByText('threshold of 7.7 dS/m',{exact:false}).waitFor()
  await page.getByTestId('language-select').selectOption('ru')
  await cotton.getByText('порог ECe 7,7 дСм/м',{exact:false}).waitFor()
  assert.equal(await cotton.getByRole('link',{name:/Первоисточник этого показателя/}).count(),2)
  await page.getByTestId('language-select').selectOption('uz')
  await cotton.getByText('ECe chegarasi 7,7 dS/m',{exact:false}).waitFor()
  assert.equal(await cotton.getByRole('link',{name:/Ushbu ko‘rsatkichning asl manbasi/}).count(),2)
  assert.deepEqual(faults,[])
  console.log(JSON.stringify({
    perMetricEvidence:'PASS',wheat:'PASS',durdonaAndSpeciesRanges:'PASS',
    winterPeaNoInventedNumber:'PASS',cottonThresholdScope:'PASS',
    translationsEN_RU_UZ:'PASS',javascriptErrors:0
  },null,2))
} finally {await browser.close()}
