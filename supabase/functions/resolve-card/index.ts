/**
 * Edge Function: resolve-card
 *
 * The canonical URL https://i-wasp.com/card/[id] is backed by two stores:
 * native i-Wasp cards first, then cards created by iwallet-card. This endpoint
 * is the only existence check used before signing a Wallet pass.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';
import { isValidCardId, normalizeCardId, recordMatchesCardId, resolveCard, type LookupResult } from './core.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const UPSTREAM_TIMEOUT_MS = 6000;
const IWALLET_CARD_BASE_URL = (Deno.env.get('IWALLET_CARD_BASE_URL') ?? '').replace(/\/$/, '');

function json(body: unknown, status: number, cacheSeconds = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': cacheSeconds > 0 ? `public, max-age=${cacheSeconds}, stale-while-revalidate=60` : 'no-store',
    },
  });
}

function timeoutError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError';
}

async function withTimeout<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new DOMException('Upstream timeout', 'AbortError')), milliseconds);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function lookupIwasp(id: string): Promise<LookupResult> {
  const url = Deno.env.get('SUPABASE_URL')?.trim();
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  if (!url || !key) return { kind: 'failure', status: 502, reason: 'i-wasp resolver credentials are not configured' };

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const result = await withTimeout(supabase.rpc('get_public_card', { p_slug: id }), UPSTREAM_TIMEOUT_MS);
    if (result.error) return { kind: 'failure', status: 502, reason: 'i-wasp lookup failed' };
    const record = Array.isArray(result.data) ? result.data[0] : result.data;
    if (!record) return { kind: 'not_found' };
    if (typeof record !== 'object' || !recordMatchesCardId(id, record as Record<string, unknown>)) {
      return { kind: 'failure', status: 502, reason: 'i-wasp returned a mismatched card id' };
    }
    return { kind: 'found', record: record as Record<string, unknown> };
  } catch (error) {
    return { kind: 'failure', status: timeoutError(error) ? 504 : 502, reason: timeoutError(error) ? 'i-wasp lookup timed out' : 'i-wasp lookup failed' };
  }
}

async function lookupIwallet(id: string): Promise<LookupResult> {
  if (!IWALLET_CARD_BASE_URL) return { kind: 'failure', status: 502, reason: 'iwallet-card resolver is not configured' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const response = await fetch(`${IWALLET_CARD_BASE_URL}/api/card-requests/${encodeURIComponent(id)}`, {
      method: 'GET',
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (response.status === 404) return { kind: 'not_found' };
    if (!response.ok) return { kind: 'failure', status: 502, reason: `iwallet-card returned HTTP ${response.status}` };
    const payload = await response.json().catch(() => null) as { card?: unknown } | null;
    if (!payload?.card || typeof payload.card !== 'object') return { kind: 'failure', status: 502, reason: 'iwallet-card returned an invalid card' };
    const record = payload.card as Record<string, unknown>;
    if (!recordMatchesCardId(id, record)) return { kind: 'failure', status: 502, reason: 'iwallet-card returned a mismatched card id' };
    return { kind: 'found', record };
  } catch (error) {
    const timedOut = timeoutError(error);
    return { kind: 'failure', status: timedOut ? 504 : 502, reason: timedOut ? 'iwallet-card lookup timed out' : 'iwallet-card lookup failed' };
  } finally {
    clearTimeout(timer);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);

  const id = normalizeCardId(new URL(req.url).searchParams.get('id'));
  if (!isValidCardId(id)) return json({ error: 'invalid_id', message: 'Identifiant de carte invalide.' }, 400);

  const result = await resolveCard(id, {
    iwasp: () => lookupIwasp(id),
    iwallet: () => lookupIwallet(id),
  });
  if (result.kind === 'found') return json({ source: result.source, card: result.card }, 200, 60);
  if (result.kind === 'not_found') return json({ error: 'not_found', message: 'Carte introuvable.' }, 404);
  return json({ error: result.status === 504 ? 'upstream_timeout' : 'upstream_error', message: 'Service de cartes temporairement indisponible.' }, result.status);
});
