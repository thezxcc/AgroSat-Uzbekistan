import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const out=path.resolve('../artifacts')
await mkdir(out,{recursive:true})
const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--no-first-run','--disable-extensions']
})
const issues=[]
function relativeLuminance(rgb) {
  const values=rgb.match(/[\d.]+/g)?.slice(0,3).map(Number)
  if(!values||values.length<3)throw Error('Invalid RGB: '+rgb)
  const s=values.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4})
  return s[0]*.2126+s[1]*.7152+s[2]*.0722
}
function contrast(a,b){const x=relativeLuminance(a),y=relativeLuminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
try {
  const context=await browser.newContext({viewport:{width:1440,height:900}})
  const page=await context.newPage()
  page.on('pageerror',e=>issues.push(e.message))
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.locator('.metric-value').first().filter({hasText:'94.5'}).waitFor()
  if((await page.locator('html').getAttribute('data-theme'))!=='light')throw Error('Light default missing')
  await page.screenshot({path:path.join(out,'agrosat-light-viewport.png')})
  const baseline=await page.locator('.metric-value').allTextContents()
  const darkButton=page.getByTestId('theme-toggle')
  await darkButton.click()
  if(await page.locator('html').getAttribute('data-theme')!=='dark')throw Error('Dark not enabled')
  const after=await page.locator('.metric-value').allTextContents()
  if(JSON.stringify(baseline)!==JSON.stringify(after))throw Error('Theme affected NASA metrics')
  const colorResults=await page.evaluate(()=>{
    const root=document.documentElement
    const shell=document.createElement('div')
    document.body.appendChild(shell)
    const resolved=(property,name)=>{
      shell.style[property]=`var(${name})`
      return getComputedStyle(shell)[property]
    }
    const colors={
      text:resolved('color','--text'),
      muted:resolved('color','--muted'),
      surface:resolved('backgroundColor','--surface'),
      canvas:resolved('backgroundColor','--canvas'),
      accent:resolved('backgroundColor','--accent'),
      accentOn:resolved('color','--accent-on'),
    }
    shell.remove()
    return {theme:root.dataset.theme,colors,bodyBackground:getComputedStyle(document.body).backgroundColor}
  })
  const textContrast=contrast(colorResults.colors.text,colorResults.colors.surface)
  const mutedContrast=contrast(colorResults.colors.muted,colorResults.colors.surface)
  const buttonContrast=contrast(colorResults.colors.accent,colorResults.colors.accentOn)
  if(textContrast<7||mutedContrast<4.5||buttonContrast<4.5)
    throw Error('Dark color contrast too low: '+JSON.stringify({textContrast,mutedContrast,buttonContrast}))
  await page.screenshot({path:path.join(out,'agrosat-dark-viewport.png')})
  await page.getByTestId('language-select').selectOption('ru')
  await page.getByRole('heading',{name:'Как работает AgroSat?'}).waitFor()
  if(await page.locator('html').getAttribute('data-theme')!=='dark')throw Error('Theme changed with language')
  await page.reload({waitUntil:'networkidle'})
  await page.getByRole('heading',{name:'How does AgroSat work?'}).waitFor()
  if(await page.locator('html').getAttribute('data-theme')!=='dark')throw Error('Dark preference not persisted')
  await page.getByTestId('theme-toggle').click()
  if(await page.locator('html').getAttribute('data-theme')!=='light')throw Error('Cannot return to light')
  const mobile=await browser.newContext({viewport:{width:390,height:844}})
  const m=await mobile.newPage()
  await m.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await m.getByTestId('theme-toggle').click()
  await m.getByTestId('language-select').selectOption('uz')
  await m.getByRole('heading',{name:'AgroSat qanday ishlaydi?'}).waitFor()
  await m.screenshot({path:path.join(out,'agrosat-dark-mobile.png')})
  const overflow=await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)
  if(overflow)throw Error('Horizontal mobile overflow at 390px')
  await m.setViewportSize({width:320,height:760})
  await m.waitForTimeout(180)
  const overflowSmall=await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)
  if(overflowSmall)throw Error('Horizontal mobile overflow at 320px')
  if(issues.length)throw Error('JS errors: '+issues.join('|'))
  console.log(JSON.stringify({light:'PASS',dark:'PASS',themePersistence:'PASS',
    languageIndependent:'PASS',nasaMetricsUnchanged:'PASS',mobile390:'PASS',mobile320:'PASS',
    darkContrast:{text:Number(textContrast.toFixed(2)),muted:Number(mutedContrast.toFixed(2)),
      button:Number(buttonContrast.toFixed(2))},errors:0},null,2))
}finally{await browser.close()}
