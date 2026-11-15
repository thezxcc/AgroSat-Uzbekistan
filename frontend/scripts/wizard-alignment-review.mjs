import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,1024,390]){
 const page=await browser.newPage({viewport:{width,height:960}})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
 const wizard=page.getByTestId('easy-wizard')
 for(const step of [1,2,3]){
  const metrics=await page.evaluate(()=>{
   const r=x=>{const a=document.querySelector(x).getBoundingClientRect();return {l:a.left,r:a.right,t:a.top,b:a.bottom,w:a.width}}
   return {h:r('.farmer-easy-header'),w:r('.easy-wizard'),n:r('.easy-next'),overflow:document.documentElement.scrollWidth>innerWidth}
  })
  if(metrics.overflow||metrics.n.t<metrics.w.b-2||Math.abs(metrics.w.l-metrics.n.l)>2||Math.abs(metrics.w.r-metrics.n.r)>2||errors.length)throw Error(JSON.stringify({width,step,metrics,errors}))
  if(width===1440)await page.locator('#farmer-start').screenshot({path:`D:/AgroSat/artifacts/AgroSat_wizard_aligned_step${step}.png`})
  console.log('PASS alignment',width,step,JSON.stringify(metrics))
  if(step<3)await wizard.getByRole('button',{name:'Continue'}).click()
 }
 await page.close()
 }
}finally{await browser.close()}
