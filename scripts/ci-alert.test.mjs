import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync(new URL('../.github/workflows/pr-validation-alert.yml', import.meta.url), 'utf8');
const script = workflow.split('          script: |\n')[1]
  .split('\n').map(line => line.replace(/^            /, '')).join('\n');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function simulate({ currentSha = 'abc', previous = false, prs = [{ number: 7 }], conclusion = 'failure' } = {}) {
  const calls = [];
  let summary = '';
  const listJobsForWorkflowRun = () => {};
  const listComments = () => {};
  const github = {
    rest: {
      actions: { listJobsForWorkflowRun },
      pulls: { get: async () => ({ data: { state: 'open', head: { sha: currentSha } } }) },
      issues: {
        listComments,
        createComment: async payload => calls.push({ kind: 'create', ...payload }),
        updateComment: async payload => calls.push({ kind: 'update', ...payload }),
      },
    },
    paginate: async endpoint => endpoint === listJobsForWorkflowRun ? [{
      name: 'typescript', conclusion, html_url: 'https://github.com/example/repo/actions/runs/1/job/2',
      steps: [{ name: 'TypeScript application and tooling', conclusion }],
    }, { name: 'auth', conclusion: 'success' }] : previous ? [{
      id: 42, user: { type: 'Bot' }, body: '<!-- iwasp-pr-validation-failure --> old',
    }] : [],
  };
  const context = {
    repo: { owner: 'example', repo: 'repo' },
    payload: { workflow_run: { id: 1, head_sha: 'abc', run_attempt: 2,
      html_url: 'https://github.com/example/repo/actions/runs/1', pull_requests: prs } },
  };
  const core = { summary: {
    addRaw(body) { summary += body; return this; }, async write() {},
  } };
  await new AsyncFunction('github', 'context', 'core', script)(github, context, core);
  return { calls, summary };
}

test('alerte : étape, lien des logs et action attendue dans le commentaire', async () => {
  const { calls, summary } = await simulate();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].kind, 'create');
  assert.match(summary, /TypeScript application and tooling/);
  assert.match(summary, /https:\/\/github.com\/example\/repo\/actions\/runs\/1\/job\/2/);
  assert.match(summary, /Action attendue/);
  assert.match(summary, /CI_VALIDATION.md/);
  assert.doesNotMatch(summary, /\*\*auth\*\*/);
});
test('alerte existante mise à jour sans doublon', async () => {
  const { calls } = await simulate({ previous: true });
  assert.equal(calls[0].kind, 'update');
  assert.equal(calls[0].comment_id, 42);
});
test('révision obsolète : pas de commentaire trompeur', async () => {
  assert.equal((await simulate({ currentSha: 'new' })).calls.length, 0);
});
test('sans PR associée : résumé disponible et aucune publication', async () => {
  const { calls, summary } = await simulate({ prs: [] });
  assert.equal(calls.length, 0);
  assert.match(summary, /CI en échec/);
});
test('expiration : étape et lien conservés', async () => {
  const { summary } = await simulate({ conclusion: 'timed_out' });
  assert.match(summary, /TypeScript application and tooling/);
});
