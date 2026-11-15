import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for (const width of [1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:980}})
  const faults=[];page.on('pageerror',e=>faults.push(e.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByTestId('language-select').selectOption('ru')
  await page.getByTestId('rotation-A').waitFor()
  for(const theme of ['light','dark']) {
   if((await page.evaluate(()=>document.documentElement.dataset.theme))!==theme)await page.getByTestId('theme-toggle').click()
   const cards=await page.locator('.rotation-simple-points').count()
   if(cards!==3)throw Error('Expected 3 concise cards')
   const iconCount=await page.locator('.rotation-simple-points .rotation-positive svg').count()
   const riskCount=await page.locator('.rotation-simple-points .rotation-warning svg').count()
   if(iconCount!==3||riskCount!==3)throw Error('Wrong count of hearts/triangles')
   const next=page.getByTestId('farmer-next-step')
   await next.scrollIntoViewIfNeeded()
   await next.screenshot({path:`D:/AgroSat/artifacts/AgroSat_nextstep_final_${width}_${theme}.png`})
   await page.getByRole('tab',{name:'Методика и источники'}).click()
   const details=page.getByTestId('science-research-details')
   await details.locator(':scope > summary').click()
   if(await page.locator('.regional-simple-cards article').count()!==3)throw Error('Need water/soil/timing cards')
   await page.locator('.regional-context').screenshot({path:`D:/AgroSat/artifacts/AgroSat_khorezm_simple_${width}_${theme}.png`})
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
   if(overflow||faults.length)throw Error(JSON.stringify({width,theme,overflow,faults}))
   await details.locator(':scope > summary').click()
   await page.getByRole('tab',{name:'Сравнить севообороты'}).click()
   console.log('PASS',width,theme,'3 water-soil-time cards, 3 green and 3 yellow icons, screenshots, no JS/overflow')
  }
  await page.close()
 }
}finally{await browser.close()}
