// Fictional local fixtures. No account, order, upload or Wallet action is executed.
const {createRequire}=require('module');const req=createRequire(process.env.IWASP_BROWSER_PACKAGES);
const {default:AxeBuilder}=req('@axe-core/playwright');const {chromium}=req('playwright'),assert=require('assert/strict'),fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const results=[];
try {for(const width of [390,1440]){
 const c=await b.newContext({viewport:{width,height:1000},reducedMotion:'reduce',serviceWorkers:'block'});let profile=null;let vcard={first_name:"Camille",last_name:"Test"};const requests=[];
 await c.route('**/*',r=>{if(new URL(r.request().url()).origin==='http://127.0.0.1:8080')return r.continue();requests.push({path:new URL(r.request().url()).pathname,method:r.request().method()});return r.fulfill({contentType:'application/json',body:r.request().url().includes('/rpc/get_public_card')?JSON.stringify(profile):r.request().url().includes('/rpc/get_vcard_data')?JSON.stringify(vcard):'[]'});});
 const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8080/contact');await p.locator('a[href="/express/offre"]').first().click();await p.waitForURL('**/express/offre');
 await p.goto('http://127.0.0.1:8080/create');await p.waitForURL('**/express/offre');
 for(const route of ['/editor','/card-studio']){await p.goto('http://127.0.0.1:8080'+route);await p.waitForURL('**/login');}
 await p.evaluate(()=>sessionStorage.setItem('expressCheckoutState',JSON.stringify({currentStep:2,selectedOffer:'essentiel',customerInfo:null,paymentMethod:'cod',isComplete:false})));
 await p.goto('http://127.0.0.1:8080/express/infos');await p.getByRole('heading',{name:'Où vous livrer ?'}).waitFor();
 await p.getByRole('button',{name:'Continuer vers le paiement'}).click();await p.waitForFunction(()=>document.activeElement.id==='express-firstName');
 for(const [id,value] of Object.entries({firstName:'Camille',lastName:'Test',email:'test@example.invalid',phone:'+44 20 1234 5678',city:'Test',address:'TEST ONLY'}))await p.locator('#express-'+id).fill(value);
 assert.equal(await p.locator('#express-phone').inputValue(),'+44 20 1234 5678');assert.equal(await p.getByRole('checkbox').isChecked(),false);
 await p.getByRole('checkbox').check();await p.reload();await p.getByRole('checkbox').waitFor();assert.equal(await p.getByRole('checkbox').isChecked(),true);assert.equal(await p.locator('#express-phone').inputValue(),'+44 20 1234 5678');
 await p.locator('#express-firstName').fill('Camille Test');assert.equal(await p.getByRole('checkbox').isChecked(),false);
 await p.waitForFunction(()=>[...document.querySelectorAll('main [style]')].every(el=>getComputedStyle(el).opacity==='1'));await p.getByRole('region',{name:'Visibilité du profil'}).evaluate(el=>el.scrollIntoView({block:'center'}));const privacyAxe=await new AxeBuilder({page:p}).include('[aria-label="Visibilité du profil"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(privacyAxe.violations,[]);await p.getByRole('region',{name:'Visibilité du profil'}).screenshot({path:`docs/site-wallet-draft/express-privacy-${width}.jpg`,type:'jpeg',quality:82});
 const paletteResults=[];
 for(const [id,label] of [['signature','Signature'],['dark-luxury','Dark Luxury'],['executive','Executive'],['boutique','Boutique']]){
 await p.evaluate(()=>sessionStorage.setItem('orderFunnelStateV2',JSON.stringify({currentStep:3,selectedOffer:'essentiel',productType:'pvc',digitalIdentity:{clientType:'particulier',firstName:'Camille',lastName:'Test',email:'',phone:'',profileVisibilityConfirmed:true},selectedTemplate:null,cardPersonalization:null,shippingInfo:null,paymentInfo:null,isComplete:false})));
 await p.goto('http://127.0.0.1:8080/order/template');const choice=p.getByRole('button',{name:new RegExp(label)});await choice.click();assert.equal(await choice.getAttribute('aria-pressed'),'true');
 if(id==='executive')await p.screenshot({path:`docs/site-wallet-draft/palette-choice-${width}.jpg`,type:'jpeg',quality:82,fullPage:true});
 await p.getByRole('button',{name:'Continuer',exact:true}).click();await p.waitForURL('**/order/carte');
 const fields=await p.evaluate(async()=>{const {orderProfileFields}=await import('/src/lib/orderIdentity.ts');const state=JSON.parse(sessionStorage.getItem('orderFunnelStateV2'));return orderProfileFields(state.digitalIdentity,state.selectedTemplate);});assert.equal(fields.template,id);
 profile={...fields,id:'00000000-0000-4000-8000-000000000001',slug:'test-only-palette',social_links:[],blocks:[],has_email:false,has_phone:false,has_linkedin:false,has_whatsapp:false,has_instagram:false,has_twitter:false};
 await p.goto('http://127.0.0.1:8080/card/test-only-palette');await p.getByRole('heading',{name:'Camille Test'}).waitFor();
 const css=await p.locator('.min-h-dvh').last().evaluate(el=>getComputedStyle(el).backgroundColor);
 const expected=await p.evaluate(hex=>{const d=document.createElement('div');d.style.color=hex;document.body.append(d);const color=getComputedStyle(d).color;d.remove();return color;},fields.custom_styles.backgroundColor);assert.equal(css,expected);
 if(id==='executive')await p.screenshot({path:`docs/site-wallet-draft/palette-recipient-${width}.jpg`,type:'jpeg',quality:82,fullPage:true});
 paletteResults.push({id,background:css});}
 for(const slug of [undefined,'test-only-palette']){vcard={first_name:'Camille',last_name:'Test',...(slug?{slug}:{})};const download=p.waitForEvent('download');await p.getByRole('button',{name:'Ajouter au contact',exact:true}).click();const file=await download;const content=fs.readFileSync(await file.path(),'utf8');assert.ok(content.includes('FN:Camille Test'));assert.equal(content.includes('URL:'),Boolean(slug));assert.ok(!content.includes('undefined'));}
 assert.ok(!requests.some(r=>/\/(orders|digital_cards|signup|subscriptions)(\/|$)/.test(r.path)&&r.method==='POST'));assert.deepEqual(errors,[]);results.push({width,paletteResults,errors,externalRequestsIntercepted:requests});await c.close();
}}finally{await b.close();fs.writeFileSync('docs/site-wallet-draft/consistency-browser-results.json',JSON.stringify(results,null,2));}assert.equal(results.length,2);console.log(JSON.stringify(results));})();
