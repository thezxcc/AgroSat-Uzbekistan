import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const theme of ['light','dark']){
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900}})
   const errors=[];page.on('pageerror',e=>errors.push(e.message))
   await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
   const dark=await page.evaluate(()=>document.documentElement.dataset.theme==='dark')
   if((theme==='dark')!==dark) await page.getByTestId('theme-toggle').click()
   const checks=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    removedAsset:![...document.styleSheets].some(s=>Array.from(s.cssRules||[]).some(r=>r.cssText.includes('botanical-corner.svg'))),
    easy:document.querySelectorAll('#farmer-start').length
   }))
   if(checks.overflow||!checks.removedAsset||!checks.easy||errors.length)throw Error(JSON.stringify({theme,width,checks,errors}))
   await page.screenshot({path:`D:/AgroSat/artifacts/AgroSat_no_leaves_${theme}_${width}.png`})
   console.log(theme,width,'PASS',JSON.stringify(checks))
   await page.close()
  }
 }
}finally{await browser.close()}
