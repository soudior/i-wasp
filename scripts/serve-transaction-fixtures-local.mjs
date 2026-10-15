/**
 * Local-only UI fixture server for a browser without request-routing support.
 * Uses the real React app and Supabase client against an in-process fake API.
 * Strict CSP blocks external resources/connections. No remote service is called.
 * Run: node scripts/serve-transaction-fixtures-local.mjs
 * Anonymous: http://127.0.0.1:8088/signup
 * Fictional owner: http://127.0.0.1:8088/pass/synthetic-only?qa-owner=1
 * Synthetic recap: http://127.0.0.1:8088/order/recap?qa-owner=1&qa-order=1
 */
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.IWASP_FIXTURE_PORT || 8088);
if (!Number.isInteger(port) || port < 1025 || port > 65535) throw new Error('Invalid loopback port');
const base = `http://127.0.0.1:${port}`;
const output = path.join(root, 'docs/site-wallet-draft/checks/20261014');
const requests = [];
const fakeUser = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'qa-only@example.invalid', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const fakeSession = { access_token: 'synthetic-header.synthetic-payload.synthetic-signature', token_type: 'bearer', refresh_token: 'synthetic-refresh-only', expires_in: 86400, expires_at: Math.floor(Date.now() / 1000) + 86400, user: fakeUser };
const fakeOrder = { currentStep: 6, selectedOffer: 'essentiel', productType: 'pvc', selectedTemplate: 'signature', digitalIdentity: { clientType: 'particulier', profileVisibilityConfirmed: true, firstName: 'Camille', lastName: 'Test fictif', email: '', phone: '' }, cardPersonalization: { visualType: 'photo', imageUrl: '', fileName: 'soft-touch' }, shippingInfo: { addressType: 'domicile', address: '1 rue fictive, test uniquement', city: 'Ville test', country: 'Maroc', phone: '0000000000' }, paymentInfo: null, isComplete: false, isTransitioning: false };
const csp = "default-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' ws://127.0.0.1:" + port + "; media-src 'self' blob:; worker-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'";
const server = await createServer({
  root,
  server: { host: '127.0.0.1', port, strictPort: true, headers: { 'Content-Security-Policy': csp, 'X-IWASP-QA': 'synthetic-only' } },
  define: { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(`${base}/__qa-api`), 'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('synthetic-public-test-key') },
  plugins: [{
    name: 'iwasp-loopback-fixtures-only',
    enforce: 'pre',
    transformIndexHtml(html) {
      const init = `const params = new URLSearchParams(location.search); if (params.has('qa-owner')) localStorage.setItem('sb-127-auth-token', JSON.stringify(${JSON.stringify(fakeSession)})); if (params.has('qa-anonymous')) localStorage.removeItem('sb-127-auth-token'); if (params.has('qa-order')) sessionStorage.setItem('orderFunnelStateV2', JSON.stringify(${JSON.stringify(fakeOrder)}));`;
      return html.replace('<head>', `<head><script>${init}</script>`);
    },
    configureServer(vite) {
      vite.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', base);
        if (url.pathname === '/__qa-report') {
          res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ syntheticOnly: true, csp, requests }, null, 2)); return;
        }
        if (!url.pathname.startsWith('/__qa-api/')) return next();
        let raw = ''; for await (const part of req) raw += part;
        let body = null; try { body = raw ? JSON.parse(raw) : null; } catch { /* synthetic invalid input */ }
        const safeBody = body && typeof body === 'object' ? { ...body } : body;
        if (safeBody?.password) safeBody.password = '[synthetic password omitted]';
        const endpoint = url.pathname.replace('/__qa-api', '');
        requests.push({ endpoint, method: req.method, body: safeBody, at: new Date().toISOString() });
        const json = (data, status = 200) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
        if (endpoint === '/auth/v1/user') return json(fakeUser);
        if (endpoint === '/auth/v1/signup') return body?.email === 'existing@example.invalid' ? json({ code: 'user_already_exists', msg: 'User already registered' }, 422) : json({ user: fakeUser, session: null });
        if (endpoint === '/rest/v1/digital_cards') return json(req.method === 'POST' ? null : { id: '00000000-0000-4000-8000-000000000002', slug: 'synthetic-only', first_name: 'Camille', last_name: 'Test fictif' });
        if (endpoint === '/rest/v1/orders') return json(req.method === 'POST' ? { id: '00000000-0000-4000-8000-000000000003', order_number: 'TEST-ONLY-001', status: 'pending' } : []);
        if (endpoint.startsWith('/rest/v1/')) return json([]);
        if (['/functions/v1/bootstrap-admin', '/functions/v1/send-order-email', '/functions/v1/send-welcome-email'].includes(endpoint)) return json({ success: true, simulatedOnly: true });
        if (['/functions/v1/apple-wallet', '/functions/v1/google-wallet', '/functions/v1/create-nfc-payment'].includes(endpoint)) return json({ error: 'Synthetic provider unavailable; no real transaction attempted' }, 503);
        return json({ error: 'Unconfigured synthetic endpoint; no remote fallback' }, 501);
      });
    },
  }],
});
await server.listen();
console.log(`Synthetic-only QA server: ${base}\nAll API calls terminate locally. External connections/resources blocked by CSP.`);
async function close() { await mkdir(output, { recursive: true }); await writeFile(path.join(output, 'transaction-fixtures-requests.json'), JSON.stringify({ generatedAt: new Date().toISOString(), syntheticOnly: true, base, csp, requests }, null, 2)); await server.close(); process.exit(0); }
process.on('SIGTERM', close); process.on('SIGINT', close);
