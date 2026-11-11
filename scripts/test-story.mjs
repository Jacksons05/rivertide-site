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
const out=new URL('../../outputs/story-homepage/',import.meta.url).pathname;
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const reports=[];
for(const width of [1280,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const route of ['index.html','how-it-works.html','why.html','who-its-for.html']){
  await page.goto('http://127.0.0.1:4183/'+route);await page.waitForLoadState('networkidle');
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow '+width);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
  if(route==='who-its-for.html')assert.match(page.url(),/\/#seasons$/);
  await page.screenshot({path:out+route.replace('.html','')+'-'+width+'.png',fullPage:true});
  if(route==='index.html'){
   assert.equal(await page.locator('#spend').innerText(),'$500');
   await page.locator('#try-may').focus();await page.keyboard.press('Enter');
   assert.match(await page.locator('#scenario-status').innerText(),/March: \$6,500 → \$6,500/);
   assert.equal(await page.locator('#scenario-status').getAttribute('aria-live'),'polite');
   await page.selectOption('#purchase-month','2026-10-15');
   assert.match(await page.locator('#scenario-status').innerText(),/−\$8,500/);
   await page.getByRole('button',{name:'Try May instead'}).click();
   assert.equal(await page.locator('#purchase-month').evaluate(e=>e===document.activeElement),true);
   await page.selectOption('#purchase-month','2026-10-15');
   const sections=await page.locator('main>section').evaluateAll(sections=>sections.map(s=>({id:s.id,words:s.innerText.trim().split(/\s+/).length})));
   await page.locator('#example summary').click();
   const expandedGapWords=(await page.locator('#example').innerText()).trim().split(/\s+/).length;
   reports.push({width,sections,expandedGapWords,accessibility:await page.locator('#decision').ariaSnapshot()});
  }
 }
 assert.deepEqual(errors,[]);await page.close();
}
await browser.close();
await writeFile(out+'checks.json',JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports.map(({width,sections})=>({width,sections})),null,2));
