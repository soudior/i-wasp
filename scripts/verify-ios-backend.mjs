import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The public website is evidence of a configured target, not proof of ownership
// or backend health. Require a separately reviewed release target explicitly.

function required(env, name) {
  const value = env[name];
  if (typeof value !== "string" || !value || value !== value.trim()) {
    throw new Error(`${name} must be explicitly set without surrounding whitespace.`);
  }
  return value;
}

/** Validate the same nonempty process values Vite will embed in the iOS bundle.
 * No client fallback or .env value may silently complete a partial release config.
 * JWT claims below are consistency checks, not signature verification.
 */
export function getBackendConfiguration(env, nowSeconds = Date.now() / 1000) {
  const expectedProjectId = required(env, "IWASP_IOS_APPROVED_PROJECT_ID");
  if (!/^[a-z0-9]{20}$/.test(expectedProjectId)) {
    throw new Error("IWASP_IOS_APPROVED_PROJECT_ID must be a reviewed Supabase project reference.");
  }
  const rawUrl = required(env, "VITE_SUPABASE_URL");
  const key = required(env, "VITE_SUPABASE_PUBLISHABLE_KEY");
  const projectId = required(env, "VITE_SUPABASE_PROJECT_ID");
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("VITE_SUPABASE_URL must be a valid URL.");
  }
  if (projectId !== expectedProjectId) {
    throw new Error("VITE_SUPABASE_PROJECT_ID does not match the reviewed iOS release target.");
  }
  if (
    url.protocol !== "https:" || url.hostname !== `${projectId}.supabase.co` ||
    url.port || url.username || url.password || url.pathname !== "/" ||
    url.search || url.hash ||
    (rawUrl !== `https://${projectId}.supabase.co` && rawUrl !== `https://${projectId}.supabase.co/`)
  ) {
    throw new Error("VITE_SUPABASE_URL does not match the reviewed iOS release target.");
  }

  let keyKind;
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) {
    keyKind = "publishable";
  } else {
    if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key)) {
      throw new Error("The frontend API key must be a publishable key or legacy anon JWT.");
    }
    let payload;
    try {
      payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString("utf8"));
    } catch {
      throw new Error("The legacy anon API key has an invalid payload.");
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
        payload.iss !== "supabase" || payload.role !== "anon") {
      throw new Error("The frontend API key must have the Supabase anon role.");
    }
    if (payload.ref !== projectId) {
      throw new Error("The legacy anon API key belongs to a different Supabase project.");
    }
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp) || payload.exp <= nowSeconds) {
      throw new Error("The legacy anon API key is expired or has no valid expiry.");
    }
    keyKind = "legacy-anon";
  }
  return { url: url.origin, key, projectId, keyKind };
}

/** Read-only API gateway/Auth probe. No user login, database write or key creation.
 * Only the backend can validate an opaque key or a legacy JWT signature.
 */
export async function verifyIosBackend(env, fetchImpl = globalThis.fetch) {
  const config = getBackendConfiguration(env);
  let response;
  try {
    response = await fetchImpl(`${config.url}/auth/v1/settings`, {
      method: "GET",
      headers: { apikey: config.key, Accept: "application/json" },
      redirect: "error",
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("Supabase Auth could not be reached within the release preflight. Build stopped.");
  }
  if (!response.ok) {
    throw new Error(`Supabase Auth rejected the configured URL/key or is unavailable (HTTP ${response.status}).`);
  }
  if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") || "")) {
    throw new Error("Supabase Auth returned an unexpected content type.");
  }
  let settings;
  try {
    settings = await response.json();
  } catch {
    throw new Error("Supabase Auth returned invalid settings JSON.");
  }
  if (settings?.external?.email !== true) {
    throw new Error("Email authentication is not enabled in the configured Supabase backend.");
  }
  // Never include API keys, settings bodies or upstream errors in build output.
  return { projectId: config.projectId, keyKind: config.keyKind, emailEnabled: true };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyIosBackend(process.env).then(({ projectId, keyKind }) => {
    console.log(`[iOS backend] ${projectId}: ${keyKind} key accepted; email Auth available.`);
    console.log("[iOS backend] Demo credentials and real-device login still require separate validation.");
  }).catch((error) => {
    console.error(`[iOS backend] ${error.message}`);
    process.exitCode = 1;
  });
}
