import {chromium} from 'playwright-core'
const host='http://127.0.0.1:15173'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:850}})
  const jsErrors=[]
  const failures=[]
  page.on('pageerror',e=>jsErrors.push(e.message))
  page.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url())})
  await page.goto(host,{waitUntil:'networkidle'})
  await page.getByTestId('rotation-A').waitFor()
  const health=await page.evaluate(async()=> (await (await fetch('/api/health')).json()).records)
  if(health!==9497)throw Error('Vite API proxy broken')
  for(const file of ['crop-wheat.svg','rotation-a.svg','rotation-b.svg','rotation-c.svg']){
   const r=await page.request.get(host+'/illustrations/'+file)
   if(r.status()!==200)throw Error('Missing SVG '+file)
  }
  await page.getByRole('tab',{name:'Methods & Sources'}).click()
  const details=page.getByTestId('crop-reference-panel')
  await details.locator('summary').click()
  await details.locator('img').first().waitFor()
  const imgs=await details.locator('img').evaluateAll(img=>img.map(x=>x.complete&&x.naturalWidth>0))
  if(imgs.length!==4||imgs.some(x=>!x))throw Error('Crop illustrations not loaded')
  if(jsErrors.length||failures.length)throw Error(JSON.stringify({jsErrors,failures}))
  console.log('PASS fresh clone quickstart',width,'NASA API, 4 crops, SVG assets, 0 JS/HTTP errors')
  await page.close()
 }
}finally{await browser.close()}
