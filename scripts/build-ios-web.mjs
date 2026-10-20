import { loadEnv } from 'vite';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateSupabaseBuildEnv } from './validate-supabase-build-env.mjs';

// Same mode/root/precedence as `vite build`; only public VITE_ variables are read.
try {
  validateSupabaseBuildEnv(loadEnv('production', process.cwd(), 'VITE_'), { required: true });
} catch (error) {
  console.error(error.message); // Fixed diagnostics only, never configuration values.
  process.exit(1);
}
const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const result = spawnSync(process.execPath, [vite, 'build'], { stdio: 'inherit', env: process.env });
if (result.error) console.error('Unable to start the local Vite build.');
process.exit(result.status ?? 1);
