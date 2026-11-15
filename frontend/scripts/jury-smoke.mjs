import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const out=path.resolve('../artifacts')
await mkdir(out,{recursive:true})
const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--no-first-run','--disable-extensions']
})
const faults=[]
const pass={}
try {
  const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1})
  page.on('pageerror',error=>faults.push(error.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle',timeout:20000})
  await page.getByTestId('rotation-spotlight').waitFor()
  const spotlight=page.getByTestId('rotation-spotlight')
  if(await spotlight.locator('.spotlight-card').count()!==3)throw Error('Expected exactly 3 A/B/C spotlight cards')
  const heading=await spotlight.getByRole('heading',{name:'Compare three crop rotations'}).boundingBox()
  if(!heading)throw Error('Comparison heading missing')
  const easy=page.locator('#farmer-start')
  const easyBox=await easy.boundingBox()
  if(!easyBox||easyBox.y>850)throw Error('Farmer-first start is not visible near the first viewport')
  if(await easy.locator('.easy-question').count()!==3)throw Error('Three easy farmer questions are required')
  if(await easy.locator('.easy-choice').count()!==10)throw Error('Expected 4 water, 3 soil and 3 goal choices')
  pass.farmerFirstScreen='PASS'
  const cards=await spotlight.locator('.spotlight-card').evaluateAll(elements=>elements.map(el=>{
    const b=el.getBoundingClientRect()
    return {left:b.left,right:b.right,top:b.top,height:b.height}
  }))
  if(cards.some(card=>card.height<180))throw Error('Comparison cards are not legible')
  if(!(cards[0].right<cards[1].left && cards[1].right<cards[2].left))
    throw Error('Desktop comparison cards overlap or do not have 3 columns')
  const fontSize=await spotlight.locator('.spotlight-card h3').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize))
  if(fontSize<15)throw Error('Scenario title is too small for jury demo')
  pass.comparisonRetained='PASS'
  await page.screenshot({path:path.join(out,'jury-light-firstscreen.png')})
  await page.getByRole('button',{name:'Start with my field'}).click()
  await page.waitForTimeout(350)
  const navTop=await easy.boundingBox()
  if(!navTop||navTop.y>300)throw Error('Hero start button does not navigate to simple farm questions')
  pass.primaryCTA='PASS'

  // Unknown inputs remain unknown. No-water scenario changes BOTH summer options.
  await page.getByLabel('IRRIGATION WATER').selectOption('none')
  await page.getByText('Farm conditions changed. Compare again to update all three options.').waitFor()
  if(await page.getByTestId('rotation-spotlight').count()!==0)throw Error('Stale scenario results remain after editing')
  await page.locator('.run-btn').click()
  await page.getByTestId('spotlight-B').getByText('No irrigation: high risk').waitFor()
  await page.getByTestId('spotlight-C').getByText('No irrigation: high risk').waitFor()
  const matrixRows=await page.getByTestId('comparison-matrix').locator('tbody tr').count()
  if(matrixRows!==6)throw Error('Six documented decision factors required')
  pass.scienceConsistency='PASS'
  await page.getByTestId('spotlight-B').getByRole('button',{name:'Read evidence and details'}).click()
  await page.waitForTimeout(260)
  const detailBox=await page.getByTestId('rotation-B').boundingBox()
  if(!detailBox||detailBox.y>900)throw Error('Details CTA did not reach source card')
  pass.evidenceNavigation='PASS'

  // Climate and NASA provenance can be accessed without searching the whole page.
  await page.getByRole('button',{name:'Climate & rainfall'}).click()
  await page.waitForFunction(()=>{
    const node=document.getElementById('climate-snapshot')
    return node && node.getBoundingClientRect().top < 250
  },undefined,{timeout:5000})
  const climate=await page.locator('#climate-snapshot').boundingBox()
  if(!climate||climate.y>250)throw Error('Climate navigation did not reach NASA overview')
  await page.locator('#year').selectOption('2021')
  await page.locator('.chart-period').getByText('2021').waitFor()
  await page.waitForFunction(()=>document.querySelectorAll('.rain-column').length===12,undefined,{timeout:6000})
  await page.locator('[data-testid="climate-trace"] summary').click()
  if(await page.locator('[data-testid="climate-trace"] a:not(.source-method)').count()!==2)
    throw Error('NASA data-source references missing')
  pass.nasaDatesUnitsAndSources='PASS'

  await page.getByTestId('theme-toggle').click()
  await page.getByTestId('language-select').selectOption('ru')
  await page.getByTestId('rotation-spotlight').getByRole('heading',{name:'Сравните три севооборота'}).waitFor()
  await page.screenshot({path:path.join(out,'jury-dark-ru-full.png'),fullPage:true})
  pass.russianDark='PASS'

  for(const size of [1024,768,390,320]){
    const mobile=await browser.newPage({viewport:{width:size,height:850},deviceScaleFactor:1})
    mobile.on('pageerror',error=>faults.push(error.message))
    await mobile.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle',timeout:20000})
    await mobile.getByTestId('rotation-spotlight').waitFor()
    const overflows=await mobile.evaluate(()=>({
      whole:document.documentElement.scrollWidth>window.innerWidth,
      body:document.body.scrollWidth>window.innerWidth
    }))
    if(overflows.whole||overflows.body)throw Error(`Horizontal overflow at ${size}px`)
    if(size===390){
      await mobile.getByTestId('language-select').selectOption('uz')
      await mobile.getByTestId('theme-toggle').click()
      await mobile.getByTestId('rotation-spotlight').getByRole('heading',{name:'Uchta ekin almashinuvini solishtiring'}).waitFor()
      await mobile.getByTestId('spotlight-B').scrollIntoViewIfNeeded()
      await mobile.screenshot({path:path.join(out,'jury-mobile-uz-spotlights.png')})
    }
    await mobile.close()
    pass[`responsive_${size}`]='PASS'
  }
  if(faults.length)throw Error('JavaScript errors: '+faults.join(' | '))
  console.log(JSON.stringify({...pass,javascriptErrors:0},null,2))
} finally {await browser.close()}
