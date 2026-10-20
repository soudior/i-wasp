import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSupabaseBuildEnv as validate } from './validate-supabase-build-env.mjs';

const base = { VITE_SUPABASE_URL: 'https://offlineproject.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_FAKE_OFFLINE_ONLY', VITE_SUPABASE_PROJECT_ID: 'offlineproject' };
const strict = (env) => validate(env, { required: true, now: 100000 });
const jwt = (payload) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.fakeSignature`;

test('ordinary builds keep the existing absent-env fallback', () => assert.doesNotThrow(() => validate({})));
test('iOS rejects absent and empty configuration', () => {
  assert.throws(() => strict({}), /explicit URL/);
  assert.throws(() => strict({ VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' }), /explicit URL/);
});
test('independent URL/key overrides cannot mix with fallback', () => {
  assert.throws(() => strict({ VITE_SUPABASE_URL: base.VITE_SUPABASE_URL }), /together/);
  assert.throws(() => strict({ VITE_SUPABASE_PUBLISHABLE_KEY: base.VITE_SUPABASE_PUBLISHABLE_KEY }), /together/);
});
test('surrounding whitespace is rejected rather than silently changing credentials', () => {
  for (const name of Object.keys(base)) assert.throws(() => strict({ ...base, [name]: ` ${base[name]}` }), /whitespace/);
});
test('well-shaped public publishable configuration is accepted offline, not authenticated', () => assert.doesNotThrow(() => strict(base)));
test('malformed URL and non-origin URLs are rejected', () => {
  for (const url of ['not-a-url', 'http://offlineproject.supabase.co', 'https://user:pass@offlineproject.supabase.co', `${base.VITE_SUPABASE_URL}/auth/v1`, `${base.VITE_SUPABASE_URL}?x=1`, `${base.VITE_SUPABASE_URL}#x`]) {
    assert.throws(() => strict({ ...base, VITE_SUPABASE_URL: url }), /URL/);
  }
});
test('CI endpoint and dummy key cannot be mistaken for a review build', () => {
  assert.doesNotThrow(() => validate({ VITE_SUPABASE_URL: 'https://ci.invalid', VITE_SUPABASE_PUBLISHABLE_KEY: 'ci-placeholder-not-a-secret' }));
  assert.throws(() => strict({ ...base, VITE_SUPABASE_URL: 'https://ci.invalid' }), /placeholder/);
  assert.throws(() => strict({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: 'ci-placeholder-not-a-secret' }), /publishable key/);
});
test('project ID and URL mismatch is detected', () => assert.throws(() => strict({ ...base, VITE_SUPABASE_PROJECT_ID: 'anotherproject' }), /project ID/));
test('server keys and legacy service_role JWTs are rejected without exposing values', () => {
  for (const key of ['sb_secret_FAKE_NEVER_USE', jwt({ role: 'service_role' })]) {
    assert.throws(() => strict({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: key }), (error) => !error.message.includes(key) && /secret|anon role/.test(error.message));
  }
});
test('legacy anon metadata checks ref and expiry, not signature or revocation', () => {
  const env = (payload) => ({ ...base, VITE_SUPABASE_PUBLISHABLE_KEY: jwt(payload) });
  assert.doesNotThrow(() => strict(env({ role: 'anon', ref: 'offlineproject', exp: 200 })));
  assert.throws(() => strict(env({ role: 'anon', ref: 'anotherproject', exp: 200 })), /reference/);
  assert.throws(() => strict(env({ role: 'anon', ref: 'offlineproject', exp: 99 })), /expired/);
  assert.throws(() => strict(env(null)), /anon role/);
});
test('all existing native build routes use the explicit iOS build gate', () => {
  for (const file of ['.github/workflows/ios-testflight.yml', '.github/workflows/ios-build-unsigned.yml', 'codemagic.yaml']) {
    const content = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(content, /npm run build:ios/);
    assert.doesNotMatch(content, /npm run build\s*$/m);
  }
  const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(vercel.git.deploymentEnabled['fix/apple-review-readiness'], false);
});

test('native build routes use a genuine 1024px opaque PNG source', () => {
  const icon = readFileSync(new URL('../public/app-icon-ios-1024.png', import.meta.url));
  assert.equal(icon.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(icon.readUInt32BE(16), 1024);
  assert.equal(icon.readUInt32BE(20), 1024);
  assert.equal(icon[25], 2); // RGB PNG, no alpha channel.
  for (const file of ['.github/workflows/ios-testflight.yml', '.github/workflows/ios-build-unsigned.yml', 'codemagic.yaml']) {
    assert.match(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), /cp public\/app-icon-ios-1024\.png assets\/icon-only\.png/);
  }
});

test('IP addresses and local hostnames cannot pass the review build gate', () => {
  for (const url of ['https://127.0.0.1', 'https://[::1]', 'https://192.168.1.2', 'https://localhost', 'https://device.localhost', 'https://device.local']) {
    assert.throws(() => strict({ ...base, VITE_SUPABASE_URL: url }), /public hostname/);
  }
});
test('a trailing DNS dot cannot bypass project matching or placeholder checks', () => {
  assert.throws(() => strict({ ...base, VITE_SUPABASE_URL: 'https://anotherproject.supabase.co.' }), /project ID/);
  assert.throws(() => strict({ ...base, VITE_SUPABASE_URL: 'https://ci.invalid.' }), /placeholder/);
  assert.doesNotThrow(() => strict({ ...base, VITE_SUPABASE_URL: 'https://offlineproject.supabase.co.' }));
});
