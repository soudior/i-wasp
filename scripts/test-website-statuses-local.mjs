// Isolated PostgreSQL/WASM fixture. Does not connect to Supabase or use secrets.
// Install @electric-sql/pglite separately; pass its ESM entry via PGLITE_MODULE.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const oldSql = await readFile('supabase/migrations/20260114033618_bd01b3b9-e126-4a17-bdaf-be117f3ebe9a.sql', 'utf8');
const migration = await readFile('supabase/migrations/20261014044343_website_generation_statuses.sql', 'utf8');
const oldStates = [...oldSql.matchAll(/'([^']+)'::text/g)].map(m => m[1]);
const added = ['generating', 'generation_failed', 'site_generated'];
let assertions = 0;
const check = (value, expected) => { assert.deepEqual(value, expected); assertions++; };
async function rejected(sql, params) {
  await assert.rejects(db.query(sql, params), error => error.code === '23514');
  assertions++;
}
try {
  console.log('Runtime:', (await db.query('select version()')).rows[0].version);
  await db.exec('CREATE TABLE public.website_proposals(id text PRIMARY KEY, status text NOT NULL);');
  await db.exec(oldSql);
  for (const status of oldStates) await db.query('INSERT INTO website_proposals VALUES ($1,$2)', [status, status]);
  check((await db.query('SELECT count(*)::int AS n FROM website_proposals')).rows[0].n, 9);
  for (const status of added) await rejected('INSERT INTO website_proposals VALUES ($1,$2)', [status, status]);
  console.log('Original constraint: nine existing states accepted; three generation states rejected (23514).');
  await db.exec(migration);
  for (const status of added) await db.query('INSERT INTO website_proposals VALUES ($1,$2)', [status, status]);
  check((await db.query('SELECT count(*)::int AS n FROM website_proposals')).rows[0].n, 12);
  await rejected('INSERT INTO website_proposals VALUES ($1,$2)', ['invalid', 'unknown_state']);
  await db.exec(migration);
  check((await db.query('SELECT count(*)::int AS n FROM website_proposals')).rows[0].n, 12);
  console.log('Additive migration: twelve states preserved, unknown rejected, reapplication accepted.');
  await db.query('INSERT INTO website_proposals VALUES ($1,$2)', ['claim-fixture', 'pending_payment']);
  const claim = () => db.query("UPDATE website_proposals SET status='generating' WHERE id='claim-fixture' AND status='pending_payment' RETURNING id");
  const [first, second] = await Promise.all([claim(), claim()]);
  check([first.rows.length, second.rows.length].sort(), [0, 1]);
  await db.query("UPDATE website_proposals SET status='generation_failed' WHERE id='claim-fixture'");
  const snapshot = 'generation_failed';
  await db.query("UPDATE website_proposals SET status='generating' WHERE id='claim-fixture' AND status='generation_failed'");
  const stale = await db.query("UPDATE website_proposals SET status='site_generated' WHERE id='claim-fixture' AND status=$1 RETURNING id", [snapshot]);
  check(stale.rows.length, 0);
  check((await db.query("SELECT status FROM website_proposals WHERE id='claim-fixture'")).rows[0].status, 'generating');
  console.log('CAS: one claim wins; stale completed reconciliation cannot erase a later generating claim.');
  console.log(`PASS: ${assertions} assertions. PGlite single-connection fixture, not full Supabase migration or distributed load validation.`);
} finally { await db.close(); }
