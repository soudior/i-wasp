import { isIP } from 'node:net';

// Offline checks only. Never log configuration values or contact a backend.
export function validateSupabaseBuildEnv(env, { required = false, now = Date.now() } = {}) {
  const fail = (message) => { throw new Error(`Supabase build configuration: ${message}`); };
  const names = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'];
  const values = names.map((name) => env[name] ?? '');
  for (let i = 0; i < values.length; i++) {
    if (values[i] !== values[i].trim()) fail(`${names[i]} contains surrounding whitespace.`);
  }
  const [url, key] = values;
  if (Boolean(url) !== Boolean(key)) fail('URL and public key must be provided together; independent fallbacks can mix projects.');
  if (!url) {
    if (required) fail('explicit URL and public key are required for iOS builds; repository fallbacks are not review evidence.');
    return;
  }
  let parsed;
  try { parsed = new URL(url); } catch { fail('URL is malformed.'); }
  if (!required) return; // Ordinary web/CI builds may use an isolated dummy endpoint.
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash || !['', '/'].includes(parsed.pathname)) {
    fail('iOS URL must be an HTTPS origin without credentials, query, fragment or path.');
  }
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
  if (isIP(hostname.replace(/^\[|\]$/g, '')) || !hostname.includes('.') || /\.(localhost|local)$/.test(hostname)) {
    fail('iOS URL must use a public hostname, not a local or IP address.');
  }
  if (/\.(invalid|example|test)$/.test(hostname)) fail('iOS URL is a placeholder.');
  const ref = hostname.match(/^([a-z0-9]+)\.supabase\.co$/i)?.[1];
  const projectId = env.VITE_SUPABASE_PROJECT_ID || '';
  if (projectId !== projectId.trim()) fail('VITE_SUPABASE_PROJECT_ID contains surrounding whitespace.');
  if (ref && projectId && ref !== projectId) fail('project ID does not match the URL.');
  if (key.startsWith('sb_publishable_') && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return;
  if (key.startsWith('sb_secret_')) fail('server secret keys must never be bundled in a frontend.');
  let payload;
  try {
    const parts = key.split('.');
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error();
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch { fail('expected a public publishable key or legacy anon JWT, not a placeholder.'); }
  if (payload?.role !== 'anon') fail('legacy frontend JWT must have the anon role, never service_role.');
  if (payload.ref && ref && payload.ref !== ref) fail('JWT project reference does not match the URL.');
  if (payload.ref && projectId && payload.ref !== projectId) fail('JWT project reference does not match the project ID.');
  if (typeof payload.exp === 'number' && payload.exp * 1000 <= now) fail('legacy anon JWT is expired.');
  // Payload decoding does NOT verify a JWT signature. Opaque publishable keys do
  // not encode their project. Actual validity/revocation requires owner testing.
}
