import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {demoProfile,forecast,purchaseScenario} from '../dist/demo-engine.js';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const profile=demoProfile(),base=forecast(profile,profile.demoAsOf);
assert.equal(base.availableToSpend,500);
assert.deepEqual(base.projectedLow,{amount:6500,month:'2027-03'});
assert.equal(purchaseScenario(profile,profile.demoAsOf,15000,'2026-10-15').after.projectedLow.amount,-8500);
const may=purchaseScenario(profile,profile.demoAsOf,15000,'2027-05-15');
assert.equal(may.after.projectedLow.amount,6500);assert.equal(may.shortfall,0);
const out=new URL('../../outputs/home-refresh/',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try {
 for(const width of [1280,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/how-it-works','/why','/who-its-for']){
   await page.goto('http://127.0.0.1:4183'+route);await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow '+width);
   assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
   if(route==='/who-its-for')assert.match(page.url(),/\/#seasons$/);
   if(route==='/'){
    assert.equal(await page.locator('main svg').count(),1);
    const backdrop=await page.locator('.water-backdrop').evaluate(el=>getComputedStyle(el,'::before').filter);
    assert.equal(backdrop,'grayscale(1)');
    assert.equal((await page.request.get('http://127.0.0.1:4183/assets/tide-ocean.webp')).status(),200);
    assert.equal(await page.locator('#march-value').innerText(),'−$8,500');
    assert.equal(await page.locator('#buy-october').getAttribute('aria-pressed'),'true');
    if(width===1280)assert.ok((await page.locator('#buy-may').boundingBox()).y<700);
    await page.screenshot({path:out+'home-'+width+'.png',fullPage:true});
    await page.locator('#buy-may').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#march-value').innerText(),'$6,500');
    assert.equal(await page.locator('#buy-may').getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#buy-october').getAttribute('aria-pressed'),'false');
    assert.match(await page.locator('#purchase-chart').getAttribute('aria-label'),/With purchase: \$6,500 low in March/);
    await page.locator('#purchase-amount').fill('40000');
    assert.equal(await page.locator('#march-value').innerText(),'−$13,500');
    assert.equal(await page.locator('#low-month').innerText(),'May');
    await page.locator('#purchase-amount').fill('');
    assert.equal(await page.locator('#purchase-chart').isVisible(),false);
    await page.locator('#purchase-amount').fill('0');
    assert.equal(await page.locator('#march-value').innerText(),'$6,500');
    await page.locator('#purchase-amount').fill('15000');
    await page.locator('#buy-october').click();assert.equal(await page.locator('#march-value').innerText(),'−$8,500');
    await page.locator('#example summary').click();
    assert.equal(await page.locator('#spend').innerText(),'$500');
    assert.equal(await page.locator('#cash').innerText(),'$52,400');
    assert.match(await page.locator('#oct-copy').innerText(),/−\$8,500/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'expanded overflow');
    await page.locator('#example summary').click();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.screenshot({path:out+'tide-scrolled-'+width+'.png'});
   }
   if(route==='/why')assert.equal(await page.locator('#seasons img').count(),2);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 const page=await browser.newPage({javaScriptEnabled:false});
 await page.goto('http://127.0.0.1:4183/');
 assert.match(await page.locator('noscript').innerText(),/Enable JavaScript/);
 console.log('PASS: forecast regression, one chart, October/May buttons, keyboard, ARIA, 1280/390/320 widths, details, About photos, legacy link, no-JS explanation.');
} finally {await browser.close();}
