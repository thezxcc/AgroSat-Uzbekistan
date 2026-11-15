import {chromium} from 'playwright-core'
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,390]){
 const p=await b.newPage({viewport:{width,height:1000}})
 await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
 await p.getByTestId('language-select').selectOption('ru')
 await p.getByTestId('rotation-A').getByRole('heading').waitFor()
 for(const theme of ['light','dark']){
  if((await p.evaluate(()=>document.documentElement.dataset.theme))!==theme)await p.getByTestId('theme-toggle').click()
  const boxes=await p.locator('.rotation-details-section .rotation-card').evaluateAll(items=>items.map(e=>({s:e.scrollWidth,c:e.clientWidth,w:e.getBoundingClientRect().width})))
  if(boxes.some(x=>x.s>x.c+3)||await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(JSON.stringify({width,theme,boxes}))
  await p.locator('.rotation-details-section').screenshot({path:`D:/AgroSat/artifacts/AgroSat_simple_rotations_RU_${width}_${theme}.png`})
  console.log('PASS RU',width,theme,JSON.stringify(boxes))
 }
 await p.close()
 }
}finally{await b.close()}