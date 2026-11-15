import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
const HOST='http://127.0.0.1:4175'
const BASE='/agrosat-test/'
const expected=[
 'rotation-a.svg','rotation-b.svg','rotation-c.svg','satellite.svg','rainfall.svg',
 'farmer-next-step.svg','crop-wheat.svg','crop-mungbean.svg','crop-green-manure.svg','crop-cotton.svg'
]
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1})
  const errors=[];const badResponses=[]
  page.on('pageerror',err=>errors.push(err.message))
  page.on('response',res=>{if(res.status()>=400)badResponses.push({status:res.status(),url:res.url()})})
  await page.route(HOST+'/api/**',async route=>{
   const url=route.request().url().replace(HOST,'http://127.0.0.1:8000')
   const upstream=await route.fetch({url})
   await route.fulfill({response:upstream})
  })
  await page.goto(HOST+BASE,{waitUntil:'networkidle'})
  for(const theme of ['light','dark']){
   if((await page.evaluate(()=>document.documentElement.dataset.theme))!==theme)await page.getByTestId('theme-toggle').click()
   await page.getByTestId('rotation-A').waitFor()
   const all=await page.evaluate(async ({BASE,expected})=>{
    const status=await Promise.all(expected.map(async n=>{
      const url=BASE+'illustrations/'+n
      const r=await fetch(url)
      const text=await r.text()
      return {name:n,status:r.status,xml:text.trimStart().startsWith('<svg'),url}
    }))
    const spots=[...document.querySelectorAll('.spotlight-card')].map(el=>({
      url:getComputedStyle(el,'::after').backgroundImage
    }))
    const crop=[...document.querySelectorAll('.rotation-simple-visual img')].map(el=>({
      src:el.getAttribute('src'),ready:el.complete&&el.naturalWidth>0
    }))
    return {status,spots,crop,overflow:document.documentElement.scrollWidth>innerWidth}
   },{BASE,expected})
   if(all.status.some(x=>x.status!==200||!x.xml)||all.spots.some(x=>!x.url.includes(BASE+'illustrations/'))||
     all.crop.some(x=>!x.src.startsWith(BASE)||!x.ready)||all.overflow||errors.length)throw Error(JSON.stringify({width,theme,all,errors}))
   await page.getByRole('tab',{name:'Methods & Sources'}).click()
   const panel=page.getByTestId('crop-reference-panel')
   await panel.locator('summary').click()
   const crops=await panel.locator('img.crop-reference-illustration').evaluateAll(imgs=>imgs.map(img=>({
    path:img.getAttribute('src'),ready:img.complete&&img.naturalWidth>0,
    width:img.naturalWidth
   })))
   if(crops.length!==4||crops.some(x=>!x.ready||!x.path.startsWith(BASE)))throw Error(JSON.stringify({width,theme,crops}))
   await page.getByRole('tab',{name:'Satellite Images'}).click()
   await page.locator('.image-pair img').last().scrollIntoViewIfNeeded()
   await page.waitForFunction(()=>[...document.querySelectorAll('.image-pair img')].every(img=>img.complete&&img.naturalWidth>0))
   const maps=await page.locator('.image-pair img').evaluateAll(imgs=>imgs.map(img=>({
    path:img.getAttribute('src'),ready:img.complete&&img.naturalWidth>0
   })))
   if(maps.length!==2||maps.some(x=>!x.ready||!x.path.startsWith(BASE)))throw Error(JSON.stringify({width,theme,maps}))
   if(errors.length||badResponses.length)throw Error(JSON.stringify({width,theme,errors,badResponses}))
   console.log('PASS production nested base',width,theme,'10 SVGs, 4 crop images, 2 NASA GIBS images, CSS artwork, real backend API, no JS/HTTP errors or overflow')
   await page.getByRole('tab',{name:'Compare Rotations'}).click()
   await page.getByTestId('rotation-A').waitFor()
  }
  await page.close()
 }
}finally{await browser.close()}
