import {chromium} from 'playwright-core'
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,390,320]){
  const p=await b.newPage({viewport:{width,height:900}})
  const faults=[];p.on('pageerror',e=>faults.push(e.message))
  await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await p.getByTestId('rotation-A').waitFor()
  for(const theme of ['light','dark']){
   if((await p.evaluate(()=>document.documentElement.dataset.theme))!==theme)await p.getByTestId('theme-toggle').click()
   const cards=await p.locator('.rotation-details-section .rotation-card').evaluateAll(items=>items.map(e=>{
    const im=e.querySelector('.rotation-simple-visual img'),detail=e.querySelector('.rotation-expansion')
    const box=e.getBoundingClientRect(),ib=im.getBoundingClientRect(),heads=[...e.querySelectorAll('.rotation-simple-points > div')].map(x=>x.getBoundingClientRect())
    return {imgReady:im.complete&&im.naturalWidth>0,imgFits:ib.left>=box.left&&ib.right<=box.right,summaryCollapsed:!detail.open,
      sections:heads.length,textFits:heads.every(x=>x.width>120),height:Math.round(box.height)}
   }))
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
   if(overflow||cards.length!==3||cards.some(x=>!x.imgReady||!x.imgFits||!x.summaryCollapsed||x.sections!==2||!x.textFits)||faults.length)throw Error(JSON.stringify({width,theme,cards,overflow,faults}))
   await p.locator('.rotation-details-section').screenshot({path:`D:/AgroSat/artifacts/AgroSat_simple_rotations_${width}_${theme}.png`})
   await p.getByTestId('spotlight-B').getByRole('button').click()
   if(!(await p.getByTestId('rotation-B').locator('.rotation-expansion').evaluate(e=>e.open)))throw Error('Detailed navigation failed')
   await p.getByTestId('rotation-B').locator('.rotation-expansion > summary').click()
   console.log('PASS',width,theme,JSON.stringify(cards))
  }
  await p.close()
 }
}finally{await b.close()}
