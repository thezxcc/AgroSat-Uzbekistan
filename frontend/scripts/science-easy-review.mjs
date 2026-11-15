import {chromium} from 'playwright-core'
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:920}})
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'})
  await page.getByRole('tab',{name:'Methods & Sources'}).click()
  const intro=page.locator('.science-farmer-intro')
  await intro.getByRole('heading',{name:'What should I check before choosing a crop?'}).waitFor()
  if(await intro.locator('.science-farmer-cards article').count()!==3)throw Error('Missing 3 explanations')
  if(await page.locator('[data-testid="science-research-details"][open]').count()!==0)throw Error('Research should start collapsed')
  if(await page.locator('[data-testid="crop-reference-panel"][open]').count()!==0)throw Error('Crop details should start collapsed')
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow')
  await intro.screenshot({path:`D:/AgroSat/artifacts/AgroSat_science_easy_${width}.png`,timeout:10000})
  await page.getByTestId('science-research-details').locator(':scope > summary').click()
  await page.locator('.regional-studies > summary').click()
  await page.locator('.regional-studies .region-cards a').first().waitFor()
  await page.locator('.science-subdetails').first().locator('summary').click()
  await page.getByRole('link',{name:/ICARDA/}).first().waitFor()
  await page.getByTestId('crop-reference-panel').locator('summary').click()
  if(await page.getByTestId('crop-reference-panel').locator('.crop-reference').count()!==4)throw Error('Crop evidence missing')
  console.log('PASS',width,'3 farmer checks, optional detailed research, 4 crop cards, links and no overflow')
  await page.close()
 }
}finally{await browser.close()}
