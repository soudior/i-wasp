import { base64urlEncode } from './walletEncoding.ts';
import { WalletAccessError } from './walletAccess.ts';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const OBJECT_URL = 'https://walletobjects.googleapis.com/walletobjects/v1/genericObject';
const ISSUER_SCOPE = 'https://www.googleapis.com/auth/wallet_object.issuer';
const PROVIDER_TIMEOUT_MS = 10_000;

export interface GoogleWalletServiceAccount {
  issuerId: string;
  client_email: string;
  private_key: string;
  private_key_id?: string;
}

export type GoogleWalletObject = Record<string, unknown> & { id: string; classId: string };

/** Only the already-configured account is used. No default issuer or credentials. */
export function googleWalletServiceAccount(value: unknown): GoogleWalletServiceAccount {
  const account = value as Record<string, unknown> | null;
  const issuerId = account?.issuer_id ?? account?.issuerId;
  if (!account || Array.isArray(account)
    || typeof issuerId !== 'string' || !/^\d+$/.test(issuerId)
    || typeof account.client_email !== 'string' || !/^[^\s@]+@[^\s@]+$/.test(account.client_email)
    || typeof account.private_key !== 'string'
    || !/^-----BEGIN PRIVATE KEY-----\s+[A-Za-z0-9+/=\s]+\s+-----END PRIVATE KEY-----\s*$/.test(account.private_key)
    || (account.private_key_id !== undefined && (typeof account.private_key_id !== 'string' || !account.private_key_id))) {
    throw new WalletAccessError(503, 'Configuration Google Wallet requise');
  }
  return {
    issuerId,
    client_email: account.client_email,
    private_key: account.private_key,
    private_key_id: account.private_key_id as string | undefined,
  };
}

async function createSigner(account: GoogleWalletServiceAccount) {
  const pem = account.private_key.replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '').replace(/\s/g, '');
  const key = await crypto.subtle.importKey(
    'pkcs8', Uint8Array.from(atob(pem), character => character.charCodeAt(0)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'],
  );
  const header = base64urlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: account.private_key_id }));
  return async (claims: Record<string, unknown>) => {
    const input = `${header}.${base64urlEncode(JSON.stringify(claims))}`;
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(input));
    return `${input}.${base64urlEncode(new Uint8Array(signature))}`;
  };
}

async function providerJson(response: Response): Promise<Record<string, unknown>> {
  if (!response.ok) throw new Error('Google Wallet provider unavailable');
  // Never forward provider bodies, tokens, or JSON parsing details to the caller.
  try {
    const value = await response.json();
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw new Error('Invalid Google Wallet provider response');
  }
}

/**
 * Pre-create/update the complete object, then reference its identifiers in the save
 * JWT. This avoids Google's 1,800-character browser limit for real profiles.
 * https://developers.google.com/wallet/generic/resources/faq
 * https://developers.google.com/identity/protocols/oauth2/service-account
 * https://developers.google.com/wallet/generic/use-cases/save-multiple-pass-types
 */
export async function createGoogleWalletSaveUrl(
  account: GoogleWalletServiceAccount,
  object: GoogleWalletObject,
  request: typeof fetch = fetch,
): Promise<string> {
  const sign = await createSigner(account);
  const now = Math.floor(Date.now() / 1000);
  const assertion = await sign({
    iss: account.client_email,
    scope: ISSUER_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  });
  const token = await providerJson(await request(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    redirect: 'error', signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  }));
  if (typeof token.access_token !== 'string' || !token.access_token || /\s/.test(token.access_token)
    || typeof token.token_type !== 'string' || token.token_type.toLowerCase() !== 'bearer'
    || typeof token.expires_in !== 'number' || !Number.isFinite(token.expires_in) || token.expires_in <= 0) {
    throw new Error('Invalid Google Wallet authorization response');
  }

  const headers = { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' };
  const body = JSON.stringify(object);
  let response = await request(OBJECT_URL, {
    method: 'POST', headers, body, redirect: 'error', signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
  });
  if (response.status === 409) {
    // A repeated save or concurrent creation keeps the same stable object ID.
    // PUT replaces the owned object, removing stale/now-hidden optional fields.
    // PATCH would retain omitted fields and could expose formerly visible data.
    response = await request(`${OBJECT_URL}/${encodeURIComponent(object.id)}`, {
      method: 'PUT', headers, body, redirect: 'error', signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
  }
  const saved = await providerJson(response);
  if (saved.id !== object.id || saved.classId !== object.classId) {
    throw new Error('Invalid Google Wallet object response');
  }

  // Class must already exist in the configured issuer account. Never create or
  // change classes, account permissions, or persist the short-lived OAuth token.
  const jwt = await sign({
    iss: account.client_email,
    aud: 'google',
    origins: ['https://i-wasp.com', 'https://lovable.dev'],
    typ: 'savetowallet',
    iat: Math.floor(Date.now() / 1000),
    payload: { genericObjects: [{ id: object.id, classId: object.classId }] },
  });
  if (jwt.length > 1800) throw new WalletAccessError(503, 'Pass trop volumineux : configuration fournisseur à adapter');
  return `https://pay.google.com/gp/v/save/${jwt}`;
}
