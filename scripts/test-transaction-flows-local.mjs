/**
 * Synthetic browser regression suite. Starts its own loopback Vite server.
 * Every non-loopback HTTP request is intercepted. The API uses a reserved .invalid
 * origin and Chromium DNS is disabled outside loopback as a second safety layer.
 * No real account, email, card, pass, order or payment is created.
 *
 * npm ci
 * IWASP_BROWSER_PACKAGES=/path/to/browser-tools/package.json \
 * IWASP_CHROME=/usr/bin/chromium node scripts/test-transaction-flows-local.mjs
 * Browser tools must provide playwright; axe-core is optional.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(process.env.IWASP_BROWSER_PACKAGES || import.meta.url);
const { chromium } = require('playwright');
const port = Number(process.env.IWASP_TEST_PORT || 8087);
assert.ok(Number.isInteger(port) && port > 1024 && port < 65536, 'valid local port');
const base = `http://127.0.0.1:${port}`;
const api = 'https://iwasp-synthetic.invalid';
const output = path.resolve(root, process.env.IWASP_TEST_OUTPUT || 'docs/site-wallet-draft/checks/20261014');
await mkdir(output, { recursive: true });
let axeSource;
try { axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8'); } catch { /* optional, disclosed in results */ }
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: root,
  env: { ...process.env, VITE_SUPABASE_URL: api, VITE_SUPABASE_PUBLISHABLE_KEY: 'synthetic-public-test-key' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', data => { serverLog += data; });
server.stderr.on('data', data => { serverLog += data; });
const results = [];
const captures = [];
let browser;
let executionError = null;
const fakeUser = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'qa-only@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const fakeSession = { access_token: 'synthetic-header.synthetic-payload.synthetic-signature', token_type: 'bearer', refresh_token: 'synthetic-refresh-only', expires_in: 86400, expires_at: Math.floor(Date.now() / 1000) + 86400, user: fakeUser };
const identity = { clientType: 'particulier', profileVisibilityConfirmed: true, firstName: 'Camille', lastName: 'Test fictif', email: '', phone: '', tagline: 'Profil de test uniquement' };
const fullOrder = { currentStep: 6, selectedOffer: 'essentiel', productType: 'pvc', selectedTemplate: 'signature', digitalIdentity: identity, cardPersonalization: { visualType: 'photo', imageUrl: '', fileName: 'soft-touch' }, shippingInfo: { addressType: 'domicile', address: '1 rue fictive, test uniquement', city: 'Ville test', country: 'Maroc', phone: '0000000000' }, paymentInfo: null, isComplete: false, isTransitioning: false };
const fakeCard = { id: '00000000-0000-4000-8000-000000000002', slug: 'synthetic-only', first_name: identity.firstName, last_name: identity.lastName };
const fakeOrder = { id: '00000000-0000-4000-8000-000000000003', order_number: 'TEST-ONLY-001', status: 'pending' };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scenario(name, width, options, check) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: 'fr-FR', reducedMotion: 'reduce', serviceWorkers: 'block' });
  const requests = [], errors = [], unhandled = [], audits = [];
  await context.addInitScript(({ authenticated, state, session }) => {
    if (sessionStorage.getItem('qa-seeded')) return;
    sessionStorage.setItem('qa-seeded', 'true');
    if (state) sessionStorage.setItem('orderFunnelStateV2', JSON.stringify(state));
    if (authenticated) localStorage.setItem('sb-iwasp-synthetic-auth-token', JSON.stringify(session));
  }, { authenticated: options.authenticated, state: options.state, session: fakeSession });
  // routeWebSocket blocks non-local WS too; local Vite HMR is allowed.
  await context.routeWebSocket('**/*', socket => {
    if (new URL(socket.url()).host === new URL(base).host) socket.connectToServer();
    else { unhandled.push({ method: 'WEBSOCKET', url: socket.url() }); socket.close(); }
  });
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === base) return route.continue();
    const entry = { origin: url.origin, path: url.pathname, method: request.method(), query: url.search, disposition: 'intercepted' };
    if (request.postData()) { try { entry.body = JSON.parse(request.postData()); } catch { entry.body = 'non-JSON synthetic body'; } }
    // Never retain even fictional auth credentials in test artifacts.
    if (entry.body?.password) entry.body.password = '[synthetic password omitted]';
    requests.push(entry);
    const cors = { 'access-control-allow-origin': base, 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS,PATCH,DELETE' };
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const respond = (body, status = 200) => route.fulfill({ status, headers: cors, contentType: 'application/json', body: JSON.stringify(body) });
    if (options.respond) { const response = await options.respond({ request, url, entry, requests }); if (response) return respond(response.body, response.status); }
    if (url.origin === api) {
      if (url.pathname === '/auth/v1/user') return respond(fakeUser);
      if (url.pathname === '/rest/v1/digital_cards') return respond(request.method() === 'POST' ? null : fakeCard);
      if (url.pathname === '/rest/v1/orders') return respond(request.method() === 'POST' ? fakeOrder : []);
      if (url.pathname.startsWith('/rest/v1/')) return respond([]);
      if (['/functions/v1/bootstrap-admin', '/functions/v1/send-order-email', '/functions/v1/send-welcome-email'].includes(url.pathname)) return respond({ success: true });
    }
    // The only allowed provider pages are synthetic HTML fixtures served here.
    if (options.provider && url.href === options.provider) return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html lang="fr"><title>Simulation Wallet</title><h1>Fournisseur simulé, aucun pass créé</h1><button onclick="history.back()">Annuler et revenir</button></html>' });
    unhandled.push(entry);
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', error => errors.push(error.message));
  const audit = async label => {
    if (!axeSource) { audits.push({ label, status: 'not-run', reason: 'axe-core unavailable' }); return; }
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ content: axeSource });
    const data = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
    audits.push({ label, violations: data.violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })) });
  };
  const capture = async label => { const file = `${name}-${width}-${label}.jpg`; await page.screenshot({ path: path.join(output, file), fullPage: true, type: 'jpeg', quality: 78, animations: 'disabled' }); captures.push(file); };
  const start = Date.now();
  try {
    await check({ page, context, requests, audit, capture });
    assert.deepEqual(errors, [], 'no uncaught browser exceptions');
    assert.deepEqual(unhandled, [], 'no unexpected external traffic, even though it was safely blocked');
    results.push({ name, width, status: 'passed', elapsedMs: Date.now() - start, requests, errors, unhandled, audits });
    console.log(`PASS ${name} (${width})`);
  } catch (error) {
    results.push({ name, width, status: 'failed', elapsedMs: Date.now() - start, error: error.message, requests, errors, unhandled, audits });
    await capture('failure').catch(() => {});
    console.error(`FAIL ${name} (${width}): ${error.message}`);
  } finally { await context.close(); }
}
const count = (requests, endpoint) => requests.filter(r => r.path === endpoint && r.method === 'POST').length;
const doubleClick = locator => locator.evaluate(element => { element.click(); element.click(); });
const openWallet = async page => { await page.goto(`${base}/pass/synthetic-only`); await page.getByRole('heading', { name: 'Votre carte dans le Wallet' }).waitFor(); };
const submitSignup = page => page.locator('form').evaluate(form => { form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
async function fillSignup(page) {
  await page.goto(`${base}/signup`);
  await page.getByPlaceholder('Jean', { exact: true }).fill('Camille');
  await page.getByPlaceholder('Dupont', { exact: true }).fill('Test fictif');
  await page.getByPlaceholder('vous@exemple.com').fill('qa-only@example.invalid');
  await page.locator('input[type=password]').fill('FictionalOnly-000!');
}

try {
  for (let i = 0; i < 200; i++) {
    if (server.exitCode !== null) throw new Error(`Vite exited: ${serverLog}`);
    try { const response = await fetch(base); if (response.ok) break; } catch { /* startup */ }
    if (i === 199) throw new Error(`Vite startup timed out: ${serverLog}`);
    await delay(100);
  }
  browser = await chromium.launch({ executablePath: process.env.IWASP_CHROME || '/usr/bin/chromium', headless: true, args: ['--disable-background-networking', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1, EXCLUDE localhost'] });
  for (const width of [390, 1440]) {
    await scenario('wallet-anonymous', width, {}, async ({ page, requests, audit, capture }) => {
      await openWallet(page);
      assert.equal(count(requests, '/functions/v1/apple-wallet') + count(requests, '/functions/v1/google-wallet'), 0, 'visiting issues no pass');
      await page.getByRole('button', { name: 'Ouvrir Apple Wallet' }).click();
      await page.getByRole('status').filter({ hasText: 'Connexion requise' }).waitFor();
      await page.getByRole('button', { name: 'Ouvrir Google Wallet' }).click();
      await page.getByRole('status').filter({ hasText: 'Connexion requise' }).waitFor();
      assert.equal(count(requests, '/functions/v1/apple-wallet') + count(requests, '/functions/v1/google-wallet'), 0);
      await audit('wallet'); await capture('anonymous');
    });
    await scenario('wallet-not-owner', width, { authenticated: true, respond: ({ url }) => url.pathname === '/rest/v1/digital_cards' ? { body: null } : null }, async ({ page, requests }) => {
      await openWallet(page); await page.getByRole('button', { name: 'Ouvrir Apple Wallet' }).click();
      await page.getByRole('status').filter({ hasText: 'Carte introuvable' }).waitFor();
      assert.ok(requests.find(r => r.path === '/rest/v1/digital_cards').query.includes(`user_id=eq.${fakeUser.id}`));
      assert.equal(count(requests, '/functions/v1/apple-wallet'), 0);
    });
    await scenario('wallet-invalid-provider', width, { authenticated: true, respond: async ({ url }) => {
      if (url.pathname === '/functions/v1/apple-wallet') { await delay(120); return { body: { success: true, passUrl: 'https://evil.example.invalid/not-a-pass' } }; }
      return null;
    } }, async ({ page, context, requests }) => {
      const downloads = []; page.on('download', d => downloads.push(d.suggestedFilename()));
      await openWallet(page); await doubleClick(page.getByRole('button', { name: 'Ouvrir Apple Wallet' }));
      await page.getByRole('status').filter({ hasText: 'Pass indisponible' }).waitFor();
      assert.equal(page.url(), `${base}/pass/synthetic-only`);
      assert.equal(context.pages().length, 1); assert.deepEqual(downloads, [], 'no automatic vCard fallback');
      assert.equal(count(requests, '/functions/v1/apple-wallet'), 1, 'same-tick repeated click issues a single request');
      await page.getByRole('button', { name: 'Ouvrir Apple Wallet' }).click();
      await page.getByRole('status').filter({ hasText: 'Pass indisponible' }).waitFor();
      assert.equal(count(requests, '/functions/v1/apple-wallet'), 2, 'retry available after failure');
    });
    for (const type of ['apple', 'google']) {
      const provider = type === 'apple' ? 'https://pub1.pskt.io/synthetic-only' : 'https://pay.google.com/gp/v/save/synthetic-only';
      await scenario(`wallet-${type}-cancel`, width, { authenticated: true, provider, respond: ({ url }) => url.pathname === `/functions/v1/${type}-wallet` ? { body: { success: true, [type === 'apple' ? 'passUrl' : 'saveUrl']: provider } } : null }, async ({ page, context, requests }) => {
        await openWallet(page); await page.getByRole('button', { name: `Ouvrir ${type === 'apple' ? 'Apple' : 'Google'} Wallet` }).click();
        await page.getByRole('heading', { name: 'Fournisseur simulé, aucun pass créé' }).waitFor();
        assert.equal(context.pages().length, 1, 'same-tab provider navigation');
        await page.getByRole('button', { name: 'Annuler et revenir' }).click(); await page.getByRole('heading', { name: 'Votre carte dans le Wallet' }).waitFor();
        assert.equal(count(requests, `/functions/v1/${type}-wallet`), 1, 'back does not autoissue');
        assert.equal(await page.getByRole('button', { name: 'Ouvrir Apple Wallet' }).isEnabled(), true);
      });
    }
    await scenario('signup-validation-error-retry', width, { respond: async ({ url }) => {
      if (url.pathname === '/auth/v1/signup') { await delay(120); return { status: 422, body: { code: 'user_already_exists', msg: 'User already registered' } }; }
      return null;
    } }, async ({ page, requests, audit, capture }) => {
      await fillSignup(page);
      await page.locator('input[type=password]').fill('123'); await page.getByRole('button', { name: 'Créer mon compte' }).click();
      await page.getByText('Le mot de passe doit contenir au moins 6 caractères', { exact: true }).waitFor();
      assert.equal(count(requests, '/auth/v1/signup'), 0);
      await page.locator('input[type=password]').fill('FictionalOnly-000!'); await submitSignup(page);
      await page.getByText('Cet email est déjà utilisé', { exact: true }).waitFor();
      assert.equal(count(requests, '/auth/v1/signup'), 1, 'same-tick submits produce one signup');
      assert.equal(count(requests, '/functions/v1/send-welcome-email'), 0);
      assert.equal(await page.getByRole('button', { name: 'Créer mon compte' }).isEnabled(), true);
      const unlabelled = await page.locator('input').evaluateAll(nodes => nodes.filter(n => !n.labels?.length && !n.getAttribute('aria-label')).map(n => n.type));
      assert.deepEqual(unlabelled, [], 'signup controls have associated labels');
      await audit('signup'); await capture('form');
    });
    await scenario('signup-email-confirmation', width, { respond: ({ url }) => url.pathname === '/auth/v1/signup' ? { body: { user: fakeUser, session: null } } : null }, async ({ page, requests }) => {
      await fillSignup(page); await page.getByRole('button', { name: 'Créer mon compte' }).click();
      await page.getByText(/Vérifiez votre (boîte mail|email)/i).first().waitFor();
      assert.ok(page.url().startsWith(`${base}/signup`), 'unconfirmed signup does not enter unauthenticated onboarding');
      assert.equal(count(requests, '/auth/v1/signup'), 1);
    });
    await scenario('order-anonymous-funnel', width, {}, async ({ page, requests, capture }) => {
      await page.goto(`${base}/order/recap`); await page.waitForURL('**/order/offre');
      await page.getByRole('button').filter({ hasText: 'Essentielle' }).click(); await page.getByRole('button', { name: 'Continuer', exact: true }).click(); await page.waitForURL('**/order/identite');
      await page.getByLabel('Prénom *', { exact: true }).fill(identity.firstName); await page.getByLabel('Nom *', { exact: true }).fill(identity.lastName); await page.getByLabel('Je confirme', { exact: false }).check();
      await page.getByRole('button', { name: 'Continuer vers le modèle' }).click(); await page.waitForURL('**/order/template');
      await page.getByRole('button', { name: 'Continuer', exact: true }).click(); await page.waitForURL('**/order/carte');
      await page.getByRole('button', { name: 'Continuer', exact: true }).click(); await page.waitForURL('**/order/livraison');
      await page.getByPlaceholder('123 Rue Mohammed V, Quartier Maarif').fill(fullOrder.shippingInfo.address);
      await page.getByPlaceholder('Casablanca').fill(fullOrder.shippingInfo.city);
      await page.locator('input[type=tel]').fill(fullOrder.shippingInfo.phone);
      await page.getByRole('button', { name: 'Continuer', exact: true }).click(); await page.waitForURL('**/order/recap');
      await page.getByRole('button', { name: 'Payer 199 MAD' }).waitFor(); await capture('recap');
      await page.getByRole('button', { name: 'Payer 199 MAD' }).click(); await page.waitForURL('**/login?redirect=*');
      const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('orderFunnelStateV2')));
      assert.equal(saved.digitalIdentity.firstName, identity.firstName); assert.equal(saved.shippingInfo.address, fullOrder.shippingInfo.address);
      assert.equal(count(requests, '/rest/v1/orders') + count(requests, '/rest/v1/digital_cards') + count(requests, '/auth/v1/signup'), 0, 'no anonymous writes or autosignup');
    });
    await scenario('order-cod-double-click', width, { authenticated: true, state: fullOrder, respond: async ({ url, request }) => {
      if (url.pathname === '/rest/v1/digital_cards' && request.method() === 'POST') { await delay(120); return { body: null }; }
      return null;
    } }, async ({ page, requests }) => {
      await page.goto(`${base}/order/recap`); await page.getByRole('button', { name: /Paiement à la livraison/ }).click(); await doubleClick(page.getByRole('button', { name: 'Confirmer ma commande' }));
      await page.waitForURL('**/order/confirmation');
      assert.equal(count(requests, '/rest/v1/digital_cards'), 1, 'one card after repeated click');
      assert.equal(count(requests, '/rest/v1/orders'), 1, 'one order after repeated click');
      assert.equal(count(requests, '/functions/v1/create-nfc-payment'), 0, 'COD never starts Stripe');
      const order = requests.find(r => r.path === '/rest/v1/orders' && r.method === 'POST').body;
      assert.equal(order.total_price_cents, 19900); assert.equal(order.currency, 'MAD'); assert.equal(order.payment_method, 'cod');
      const card = requests.find(r => r.path === '/rest/v1/digital_cards' && r.method === 'POST').body;
      assert.equal(card.is_pro, undefined); assert.equal(card.subscription_tier, undefined);
    });
    await scenario('order-card-failure', width, { authenticated: true, state: fullOrder, respond: ({ url, request }) => url.pathname === '/rest/v1/digital_cards' && request.method() === 'POST' ? { status: 503, body: { message: 'Synthetic card save failure' } } : null }, async ({ page, requests }) => {
      await page.goto(`${base}/order/recap`); await page.getByRole('button', { name: 'Payer 199 MAD' }).click();
      await page.getByText('Erreur lors de la commande', { exact: true }).waitFor();
      assert.equal(count(requests, '/rest/v1/orders'), 0, 'failed card must not create an order');
      assert.equal(count(requests, '/functions/v1/create-nfc-payment'), 0, 'failed card must not start payment');
      assert.equal(page.url(), `${base}/order/recap`);
    });
    await scenario('order-stripe-retry', width, { authenticated: true, state: fullOrder, respond: ({ url }) => url.pathname === '/functions/v1/create-nfc-payment' ? { status: 503, body: { error: 'Synthetic provider unavailable' } } : null }, async ({ page, requests }) => {
      await page.goto(`${base}/order/recap`); await page.getByRole('button', { name: 'Payer 199 MAD' }).click();
      await page.getByText('Erreur lors de la commande', { exact: true }).waitFor();
      await page.getByRole('button', { name: 'Payer 199 MAD' }).click();
      await page.waitForFunction(() => document.querySelector('button') && !document.body.textContent.includes('Préparation en cours...'));
      await delay(300);
      assert.equal(count(requests, '/functions/v1/create-nfc-payment'), 2, 'payment can be retried');
      assert.equal(count(requests, '/rest/v1/digital_cards'), 1, 'payment retry reuses existing card');
      assert.equal(count(requests, '/rest/v1/orders'), 1, 'payment retry reuses existing order');
      const payment = requests.find(r => r.path === '/functions/v1/create-nfc-payment').body;
      assert.deepEqual(payment, { tierId: 'essentiel', orderId: fakeOrder.id, email: fakeUser.email });
    });
  }
} catch (error) {
  executionError = error instanceof Error ? error.message : String(error);
  console.error(executionError);
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  await writeFile(path.join(output, 'transaction-flows-browser.json'), JSON.stringify({ generatedAt: new Date().toISOString(), executionError, isolation: { base, api, externalRequests: 'all intercepted or blocked', serviceWorkers: 'blocked', dns: 'non-loopback resolution disabled', realTransactions: 0 }, axeAvailable: Boolean(axeSource), results, captures }, null, 2));
  await writeFile(path.join(output, 'transaction-flows-vite.log'), serverLog);
}
assert.ok(results.length === 22 && results.every(r => r.status === 'passed'), `${results.filter(r => r.status === 'passed').length}/${results.length} simulated scenarios passed`);
