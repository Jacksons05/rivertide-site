import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const requests=[];page.on('request',r=>requests.push(r.url()));
 for(const route of ['/','/how-it-works','/why']){
  assert.equal((await page.goto('http://127.0.0.1:4183'+route)).status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://rivertide.jackson-g-sheehan.chatgpt.site'+route);
  for(const property of ['og:title','og:description','og:url','og:image','og:image:alt'])assert.ok(await page.locator(`meta[property="${property}"]`).getAttribute('content'));
  assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
  assert.equal(await page.locator('a[href*=".html"]').count(),0);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);
  for(const destination of ['/','/how-it-works','/why']){
   await page.locator(`header nav a[href="${destination}"]`).click();
   assert.equal(new URL(page.url()).pathname,destination);
  }
 }
 assert.ok(requests.some(url=>url.endsWith('.woff2')));
 assert.equal(requests.some(url=>url.endsWith('.ttf')),false);
 for(const [route,end] of [['/#product','/how-it-works#product'],['/#why','/why'],['/who-its-for','/#seasons'],['/how-it-works#thinking','/how-it-works#thinking']]){
  await page.goto('http://127.0.0.1:4183'+route);await page.waitForLoadState('networkidle');
  assert.equal(page.url(),'http://127.0.0.1:4183'+end);
 }
 const image=await page.request.get('http://127.0.0.1:4183/assets/rivertide-share.png');
 assert.equal(image.status(),200);assert.match(image.headers()['content-type'],/image\/png/);
 const bytes=await image.body();assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),630);
 assert.deepEqual(errors,[]);
 console.log('PASS: metadata, 1200x630 share card, clean navigation, legacy routes, WOFF2 loading and page scripts');
}finally{await browser.close();}
