type Env = (name: string) => string | undefined;

export type PassKitAuth =
  | { mode: 'dynamic-jwt'; apiKey: string; apiSecret: string }
  | { mode: 'long-lived'; token: string }
  | { mode: 'provided-jwt'; token: string };

/** Select the credential type explicitly, never by inspecting the token prefix. */
export function readPassKitAuth(env: Env): PassKitAuth | null {
  const apiKey = env('PASSKIT_API_KEY');
  const apiSecret = env('PASSKIT_API_SECRET');

  // Prefer a fresh, short-lived JWT whenever the existing key/secret pair is set.
  if (apiKey && apiSecret) return { mode: 'dynamic-jwt', apiKey, apiSecret };

  const longLivedToken = env('PASSKIT_LONG_LIVED_TOKEN');
  if (longLivedToken) return { mode: 'long-lived', token: longLivedToken };

  // Compatibility for explicitly pre-generated JWTs. This is not an alias for
  // long-lived API tokens, which use a different Authorization scheme.
  const jwtToken = env('PASSKIT_JWT_TOKEN');
  return jwtToken ? { mode: 'provided-jwt', token: jwtToken } : null;
}

function base64UrlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePassKitJWT(apiKey: string, apiSecret: string): Promise<string> {
  const encoder = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify({
    uid: apiKey, iat: now, exp: now + 3600,
  })));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(apiSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput));
  return `${signatureInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

/**
 * PassKit JWTs are sent raw; only long-lived API tokens use Bearer.
 * https://help.passkit.com/en/articles/4138220-2-steps-to-call-passkit-api-from-google-app-script
 * https://help.passkit.com/en/articles/5743688-using-long-lived-api-tokens
 */
export async function passKitAuthorization(auth: PassKitAuth): Promise<string> {
  switch (auth.mode) {
    case 'dynamic-jwt':
      return generatePassKitJWT(auth.apiKey, auth.apiSecret);
    case 'long-lived':
      return `Bearer ${auth.token}`;
    case 'provided-jwt':
      return auth.token;
  }
}
