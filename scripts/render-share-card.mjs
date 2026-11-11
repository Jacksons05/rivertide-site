// Render a static branded HTML card, using the existing approved wordmark and font.
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:4183/');
 await page.setContent(`<!doctype html><html><head><base href="http://127.0.0.1:4183/"><link rel="stylesheet" href="fonts.css"><style>
 *{box-sizing:border-box}body{margin:0;background:#111416;color:#e9eeec;font-family:'Public Sans',sans-serif;width:1200px;height:630px;padding:48px 72px;display:flex;flex-direction:column;justify-content:space-between}img{width:282px;height:90px}h1{font-size:60px;line-height:1.15;letter-spacing:-2px;font-weight:600;margin:0;max-width:1000px}p{font-size:26px;color:#b8c8cc;margin:0;line-height:1.45}footer{border-top:1px solid #3a4548;padding-top:24px;display:flex;justify-content:space-between;align-items:center}span{font-size:26px;color:#c9e3e8}
 </style></head><body><img src="assets/rivertide-logo-signature.svg" alt="Rivertide"><h1>See how today’s spending<br>affects your slow season.</h1><footer><p>Cash forecasting for seasonal small businesses.</p><span>Explore Rivertide →</span></footer></body></html>`);
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('img').evaluate(img=>img.decode());
 await page.screenshot({path:new URL('../dist/assets/rivertide-share.png',import.meta.url).pathname});
}finally{await browser.close();}
