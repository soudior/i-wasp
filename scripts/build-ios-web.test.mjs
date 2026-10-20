import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('./build-ios-web.mjs', import.meta.url));
function runInvalid(envText, overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'iwasp-build-gate-'));
  const env = { ...process.env };
  for (const name of Object.keys(env)) if (name.startsWith('VITE_')) delete env[name];
  try {
    if (envText) writeFileSync(join(dir, '.env.production'), envText);
    const result = spawnSync(process.execPath, [script], { cwd: dir, env: { ...env, ...overrides }, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.equal(existsSync(join(dir, 'dist')), false);
    assert.doesNotMatch(result.stdout + result.stderr, /building for production/);
    return result.stdout + result.stderr;
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('actual iOS entry point fails before Vite when configuration is absent', () => {
  assert.match(runInvalid(), /explicit URL and public key/);
});
test('actual entry point loads production dotenv and never prints supplied key values', () => {
  const marker = 'FAKE_PRIVATE_LOOKING_MARKER_DO_NOT_USE';
  const output = runInvalid(`VITE_SUPABASE_URL=https://offlineproject.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=${marker}\n`);
  assert.match(output, /expected a public publishable key/);
  assert.equal(output.includes(marker), false);
});
test('process environment has the same precedence over dotenv as Vite', () => {
  const output = runInvalid('VITE_SUPABASE_URL=https://offlineproject.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_FAKE_OFFLINE_ONLY\n', { VITE_SUPABASE_URL: '' });
  assert.match(output, /provided together/);
});
