import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'

const browser=await chromium.launch({
  executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless:true,args:['--disable-extensions','--no-first-run']
})
const pass={}
try {
  for (const width of [1365,390,320]){
    const page=await browser.newPage({viewport:{width,height:850}})
    const faults=[]
    page.on('pageerror',error=>faults.push(error.message))
    await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle',timeout:20000})
    const matrix=page.getByTestId('comparison-matrix')
    await matrix.waitFor()
    assert.equal(await matrix.locator('tbody tr').count(),6)
    assert.equal(await matrix.locator('details.matrix-why').count(),18)
    const water=page.getByTestId('matrix-why-A-water')
    assert.equal(await water.evaluate(el=>el.open),false)
    await water.locator('summary').click()
    assert.equal(await water.evaluate(el=>el.open),true)
    await water.getByText('Rainfall alone does not show',{exact:false}).waitFor()
    await water.getByText('Check irrigation availability',{exact:false}).waitFor()
    await page.getByTestId('language-select').selectOption('ru')
    await water.getByText('По одним осадкам нельзя',{exact:false}).waitFor()
    await water.getByText('Уточните наличие полива',{exact:false}).waitFor()
    await page.getByTestId('matrix-why-B-pests').locator('summary').click()
    await page.getByTestId('matrix-why-B-pests').getByText('Запишите местные виды вредителей',{exact:false}).waitFor()
    await page.getByTestId('language-select').selectOption('uz')
    await water.getByText('Yog‘inning o‘zi',{exact:false}).waitFor()
    await water.getByText('Sug‘orish imkoniyati',{exact:false}).waitFor()
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)
    assert.equal(overflow,false,`Document-wide overflow on ${width}px`)
    assert.deepEqual(faults,[])
    pass[`matrixExplanation_${width}px`]='PASS'
    await page.close()
  }
  console.log(JSON.stringify({...pass,explanations:18,languages:3,javascriptErrors:0},null,2))
} finally {await browser.close()}
