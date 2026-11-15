import { chromium } from 'playwright-core'
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try {
 for(const width of [1440,1024,390,320]) {
  const page=await b.newPage({viewport:{width,height:920},deviceScaleFactor:1})
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByTestId('spotlight-C').waitFor()
  const result=await page.evaluate(async()=>{
   const card=[...document.querySelectorAll('.spotlight-card')].map(e=>({
    image:getComputedStyle(e,'::after').backgroundImage,
    cardWidth:Math.round(e.getBoundingClientRect().width),
    cardHeight:Math.round(e.getBoundingClientRect().height)
   }))
   const assets=await Promise.all(['rotation-a.svg','rotation-b.svg','rotation-c.svg','satellite.svg','rainfall.svg','farmer-next-step.svg'].map(async n=>({name:n,status:(await fetch('/illustrations/'+n)).status})))
   return {overflow:document.documentElement.scrollWidth>innerWidth,
   spotlight:card,assets}
  })
  if(result.overflow||result.spotlight.some(x=>x.image==='none')||result.assets.some(x=>x.status!==200)||errors.length)throw Error(JSON.stringify({width,result,errors}))
  await page.getByTestId('rotation-spotlight').scrollIntoViewIfNeeded()
  await page.screenshot({path:`D:/AgroSat/artifacts/AgroSat_illustrations_${width}.png`})
  console.log('PASS',width,JSON.stringify(result))
  await page.close()
 }
}finally{await b.close()}
