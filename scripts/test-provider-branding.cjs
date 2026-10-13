// Read-only local pages; intercept all external traffic, including AI endpoints.
const {createRequire}=require('module');const req=createRequire(process.env.IWASP_BROWSER_PACKAGES);const {chromium}=req('playwright');const assert=require('assert/strict'),fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const results=[];try{
for(const width of [390,1440]){const c=await b.newContext({viewport:{width,height:1000},serviceWorkers:'block',reducedMotion:'reduce'});const blocked=[];
await c.route('**/*',r=>{if(new URL(r.request().url()).origin==='http://127.0.0.1:8080')return r.continue();blocked.push(new URL(r.request().url()).pathname);return r.fulfill({contentType:'application/json',body:'[]'});});const p=await c.newPage();
for(const route of ['/','/demo','/web-studio','/web-studio-legacy']){await p.goto('http://127.0.0.1:8080'+route);await p.locator('h1,h2').first().waitFor();const visible=await p.locator('body').innerText();const metadata=await p.locator('meta').evaluateAll(els=>els.map(e=>e.content).join('\n'));assert.ok(!/lovable/i.test(visible+'\n'+metadata));results.push({width,route,visibleProviderMentions:0});}
assert.ok(!blocked.some(path=>path.includes('/functions/v1/')),'no AI function should be invoked just by viewing these pages');await c.close();
}}finally{await b.close();}fs.writeFileSync('docs/site-wallet-draft/provider-branding-results.json',JSON.stringify(results,null,2));console.log(results);})();
