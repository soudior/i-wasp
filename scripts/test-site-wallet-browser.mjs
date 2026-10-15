// Local, synthetic-data-only browser checks. No external request is allowed.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(process.env.IWASP_BROWSER_PACKAGES || import.meta.url);
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const browser = await chromium.launch({ executablePath: process.env.IWASP_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const base = 'http://127.0.0.1:8080';
const output = 'docs/site-wallet-draft'; await mkdir(output,{recursive:true});
const results=[];
try {
 for(const [name,width,height] of [['mobile',390,844],['desktop',1440,1000]]) {
  const context=await browser.newContext({viewport:{width,height},locale:'fr-FR',serviceWorkers:'block'});
  const external=[];
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin===base) return route.continue();
   external.push({origin:url.origin,method:route.request().method()});
   return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  });
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base); await page.getByRole('heading',{level:1}).waitFor(); await page.evaluate(()=>document.fonts.ready);
  await page.locator('#tarifs').scrollIntoViewIfNeeded();
  await page.locator('.iw-final').scrollIntoViewIfNeeded();
  await page.locator('#hero-title').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${output}/${name}-home.png`,fullPage:true,animations:'disabled'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'no horizontal overflow');
  await page.getByRole('button',{name:'Voir le verso de la carte'}).click();
  assert.equal(await page.getByRole('button',{name:'Voir le recto de la carte'}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Voir le recto de la carte'}).focus();await page.keyboard.press('Enter');
  assert.equal(await page.getByRole('button',{name:'Voir le verso de la carte'}).getAttribute('aria-pressed'),'false');
  await page.locator('.iw-hero').screenshot({path:`${output}/${name}-hero.png`,animations:'disabled'});
  const homeAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await page.getByRole('link',{name:'Créer ma carte',exact:true}).first().click();await page.waitForURL('**/order/offre');await page.goBack();await page.getByRole('heading',{level:1}).waitFor();
  await page.getByRole('link',{name:'Demander une création accompagnée'}).click();await page.waitForURL('**/creer-ma-carte');
  await page.getByRole('button',{name:'Préparer ma demande'}).click();
  assert.equal(await page.locator('#firstName').getAttribute('aria-invalid'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'firstName');
  await page.getByLabel('Prénom *',{exact:true}).fill('Élodie');await page.getByLabel('Nom *',{exact:true}).fill('Test');await page.getByLabel('Téléphone *',{exact:true}).fill('0000000000');
  await page.getByRole('button',{name:'Préparer ma demande'}).click();
  await page.getByText('Votre demande est prête, pas encore envoyée.').waitFor();
  assert.equal(context.pages().length,1,'preparing request opens no third-party page');
  const url=await page.getByRole('link',{name:'Ouvrir WhatsApp pour envoyer'}).getAttribute('href');assert.ok(url.startsWith('https://wa.me/'));
  await page.getByLabel('Prénom *',{exact:true}).fill('Élodie modifiée');assert.equal(await page.getByRole('link',{name:'Ouvrir WhatsApp pour envoyer'}).count(),0);
  const unlabelled=await page.locator('input:not([type=hidden]),textarea').evaluateAll(nodes=>nodes.filter(n=>!n.labels?.length&&!n.getAttribute('aria-label')).map(n=>n.name));assert.deepEqual(unlabelled,[]);
  // Audit the final rendered contrast, after the entrance fade has completed.
  await page.waitForFunction(() => { const intro = document.querySelector('.text-center.mb-8'); return intro && getComputedStyle(intro).opacity === '1'; });
  const formAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await page.screenshot({path:`${output}/${name}-form.png`,fullPage:true});
  await page.getByRole('link',{name:'← Retour à l’accueil'}).click();await page.waitForURL(base+'/');
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.iw-card-plane').evaluate(n=>getComputedStyle(n).transform),'none');
  await page.getByRole('button',{name:'Voir le verso de la carte'}).click();assert.equal(await page.locator('.iw-card-plane').evaluate(n=>getComputedStyle(n).transform),'none');
  await page.goto(base);await page.getByRole('heading',{level:1}).waitFor();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Aller au contenu');
  await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement?.id),'contenu');
  await page.goto(base+'/pass/test-only-card');
  await page.getByRole('heading',{name:'Votre carte dans le Wallet'}).waitFor();
  await page.getByRole('button',{name:'Ouvrir Google Wallet'}).click();
  await page.getByRole('status').filter({hasText:'Connexion requise'}).waitFor();
  assert.ok(!external.some(r=>r.method==='POST'),'no provider issue or real account created');
  results.push({name,width,errors,homeViolations:homeAxe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),formViolations:formAxe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),externalRequestsBlocked:external});
  await context.close();
 }
} finally {await writeFile(`${output}/browser-results.json`,JSON.stringify(results,null,2));await browser.close();}
console.log(JSON.stringify(results,null,2));
assert.ok(results.length===2&&results.every(r=>!r.errors.length&&!r.homeViolations.length&&!r.formViolations.length),'browser and accessibility checks');
