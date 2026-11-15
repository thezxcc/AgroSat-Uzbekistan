import { chromium } from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-first-run']})
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1})
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle',timeout:20000})
 await page.getByTestId('language-select').selectOption('en')
 const matrix=page.getByTestId('comparison-matrix')
 await matrix.waitFor()
 await page.waitForTimeout(700)
 await matrix.screenshot({path:'D:/AgroSat/artifacts/AgroSat_2026_EN_real_matrix.png'})
 await page.screenshot({path:'D:/AgroSat/artifacts/AgroSat_2026_EN_fullscreen.jpg',type:'jpeg',quality:75})
 console.log('MATRIX_ROWS',await matrix.locator('tbody tr').count())
 console.log('LANG',await page.getByTestId('language-select').inputValue())
 console.log('SCREENSHOT D:/AgroSat/artifacts/AgroSat_2026_EN_real_matrix.png')
}finally{await browser.close()}
