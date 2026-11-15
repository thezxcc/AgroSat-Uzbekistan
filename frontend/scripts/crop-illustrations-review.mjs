import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,1024,390,320]){
  const p=await browser.newPage({viewport:{width,height:920},deviceScaleFactor:1})
  const errors=[];p.on('pageerror',x=>errors.push(x.message))
  await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await p.locator('[role=tab]').nth(2).click()
  for(const theme of ['light','dark']){
   const actual=await p.evaluate(()=>document.documentElement.dataset.theme)
   if(actual!==theme)await p.getByTestId('theme-toggle').click()
   const section=p.getByTestId('crop-reference-panel')
   await section.locator('summary').click()
   await section.scrollIntoViewIfNeeded()
   await section.locator('.crop-reference-illustration').first().waitFor()
   const data=await p.evaluate(()=>{
    const cards=[...document.querySelectorAll('.crop-reference')]
    return {overflow:document.documentElement.scrollWidth>innerWidth,cards:cards.map(c=>{
      const img=c.querySelector('.crop-reference-illustration'), content=c.querySelector('.crop-reference-details')
      const im=img.getBoundingClientRect(), de=content.getBoundingClientRect(),parent=c.getBoundingClientRect()
      return {src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0,
       imageFits:im.left>=parent.left&&im.right<=parent.right&&im.top>=parent.top&&im.bottom<=parent.bottom,
       textOverlap:im.right>de.left&&im.left<de.right&&im.bottom>de.top&&im.top<de.bottom,
       links:c.querySelectorAll('a').length,
       contentWidth:de.width}
    })}
   })
   if(data.overflow||data.cards.length!==4||data.cards.some(c=>!c.loaded||!c.imageFits||c.textOverlap||c.contentWidth<100)||errors.length)throw Error(JSON.stringify({width,theme,data,errors}))
   await section.screenshot({path:`D:/AgroSat/artifacts/AgroSat_crop_science_${width}_${theme}.png`})
   console.log('PASS',width,theme,JSON.stringify(data))
  }
  await p.close()
 }
}finally{await browser.close()}