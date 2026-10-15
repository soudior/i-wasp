/** Draft server checks: reads use the verified caller's JWT, never service role. */
export class WalletAccessError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
type Env = (name: string) => string | undefined;
export type WalletRecord = Record<string, unknown>;
export function hasWalletEntitlement(subscription: WalletRecord, now = Date.now()): boolean {
  return ['signature', 'gold', 'elite'].includes(String(subscription.plan)) && subscription.status === 'active'
    && (!subscription.expires_at || Date.parse(String(subscription.expires_at)) > now);
}
export function visibleWalletData(card: WalletRecord, styles: WalletRecord) {
  const optional = (key: string) => typeof card[key] === 'string' ? String(card[key]) : undefined;
  const shown = (key: string, flag: string) => styles[flag] === false ? undefined : optional(key);
  return {
    id: String(card.id), slug: String(card.slug), firstName: String(card.first_name), lastName: String(card.last_name),
    title: shown('title', 'showTitle'), company: shown('company', 'showCompany'),
    email: shown('email', 'showEmail'), phone: shown('phone', 'showPhone'),
    website: shown('website', 'showWebsite'), location: shown('location', 'showLocation'),
    photoUrl: optional('photo_url'), linkedin: optional('linkedin'), instagram: optional('instagram'),
    twitter: optional('twitter'), tagline: optional('tagline'),
  };
}
export async function authorizeWallet(req: Request, body: unknown, env: Env, request: typeof fetch = fetch) {
  const authorization = req.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+$/i.test(authorization)) throw new WalletAccessError(401, 'Connexion requise');
  const input = body as { cardData?: { id?: unknown; slug?: unknown } } | null;
  const id = input?.cardData?.id;
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) throw new WalletAccessError(400, 'Identifiant de carte invalide');
  const base = env('SUPABASE_URL'); const key = env('SUPABASE_ANON_KEY');
  if (!base || !key) throw new WalletAccessError(503, 'Configuration requise');
  const headers = { Authorization: authorization, apikey: key };
  const userResponse = await request(`${base}/auth/v1/user`, { headers });
  if (!userResponse.ok) throw new WalletAccessError(401, 'Session invalide');
  const user = await userResponse.json();
  if (!user?.id) throw new WalletAccessError(401, 'Session invalide');
  const cardQuery = new URLSearchParams({ id: `eq.${id}`, user_id: `eq.${user.id}`, is_active: 'eq.true',
    select: 'id,user_id,is_active,first_name,last_name,title,company,email,phone,website,location,slug,photo_url,linkedin,instagram,twitter,tagline,custom_styles' });
  const cardResponse = await request(`${base}/rest/v1/digital_cards?${cardQuery}`, { headers });
  if (!cardResponse.ok) throw new WalletAccessError(503, 'Vérification de la carte indisponible');
  const cards = await cardResponse.json(); const card = Array.isArray(cards) && cards.length === 1 ? cards[0] : null;
  if (!card || card.user_id !== user.id || card.id !== id || card.is_active !== true || !card.slug)
    throw new WalletAccessError(403, 'Carte indisponible pour ce compte');
  if (input?.cardData?.slug !== card.slug) throw new WalletAccessError(400, 'Identifiant de fiche incohérent');
  const query = new URLSearchParams({ user_id: `eq.${user.id}`, select: 'user_id,plan,status,expires_at' });
  const subResponse = await request(`${base}/rest/v1/subscriptions?${query}`, { headers });
  if (!subResponse.ok) throw new WalletAccessError(503, 'Vérification des droits indisponible');
  const subscriptions = await subResponse.json();
  if (!Array.isArray(subscriptions) || subscriptions.length !== 1 || subscriptions[0].user_id !== user.id || !hasWalletEntitlement(subscriptions[0]))
    throw new WalletAccessError(403, 'Droits Wallet requis');
  const walletStyles = card.custom_styles?.wallet && typeof card.custom_styles.wallet === 'object' ? card.custom_styles.wallet : {};
  return { cardData: visibleWalletData(card, walletStyles), walletStyles };
}
