/** A short-lived capability for one newly created proposal, never a session ID. */
const GENERATION_TTL_SECONDS = 15 * 60;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

export function isProposalId(value: unknown): value is string {
  return typeof value === "string" && uuid.test(value);
}

export class WebsiteGenerationAccessError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function payload(proposalId: string, expires: number): Uint8Array {
  return encoder.encode(`iwasp:generate-website-code:v1:${proposalId}:${expires}`);
}

async function signingKey(secret: string, usage: "sign" | "verify") {
  if (!secret) throw new Error("Generation signing configuration unavailable");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

export async function issueWebsiteGenerationToken(proposalId: string, secret: string, now = Date.now()): Promise<string> {
  if (!isProposalId(proposalId)) throw new Error("Invalid generated proposal ID");
  const expires = Math.floor(now / 1000) + GENERATION_TTL_SECONDS;
  const signature = await crypto.subtle.sign("HMAC", await signingKey(secret, "sign"), payload(proposalId, expires));
  const hex = Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
  return `v1.${expires}.${hex}`;
}

export async function verifyWebsiteGenerationToken(token: unknown, proposalId: string, secret: string, now = Date.now()): Promise<boolean> {
  if (typeof token !== "string" || token.length > 100 || !isProposalId(proposalId)) return false;
  const match = /^v1\.(\d{10})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  const seconds = Math.floor(now / 1000);
  if (expires <= seconds || expires > seconds + GENERATION_TTL_SECONDS) return false;
  const signature = Uint8Array.from(match[2].match(/../g)!, byte => parseInt(byte, 16));
  return crypto.subtle.verify("HMAC", await signingKey(secret, "verify"), signature, payload(proposalId, expires));
}

type AccessClient = {
  auth: { getUser: (token: string) => Promise<{ data: { user: { id: string; is_anonymous?: boolean } | null }; error: unknown }> };
  rpc: (name: string, args: { _user_id: string; _role: string }) => PromiseLike<{ data: unknown; error: unknown }>;
};

export async function authorizeWebsiteGeneration(
  req: Request,
  proposalId: string,
  generationToken: unknown,
  serviceKey: string,
  client: AccessClient,
): Promise<"admin" | "service" | "capability"> {
  const bearer = /^Bearer\s+(\S+)$/i.exec(req.headers.get("authorization") || "")?.[1];
  // Preserve both payment functions' existing server-to-server contract. Never
  // trust an unverified JWT role claim or a service key supplied in the body.
  if (serviceKey && bearer === serviceKey) return "service";
  if (generationToken !== undefined) {
    if (await verifyWebsiteGenerationToken(generationToken, proposalId, serviceKey)) return "capability";
    throw new WebsiteGenerationAccessError(403, "Autorisation de génération invalide ou expirée");
  }
  if (!bearer) throw new WebsiteGenerationAccessError(401, "Connexion ou autorisation de génération requise");
  const { data, error } = await client.auth.getUser(bearer);
  if (error || !data.user || data.user.is_anonymous) throw new WebsiteGenerationAccessError(401, "Session invalide");
  const role = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  if (role.error) throw new WebsiteGenerationAccessError(503, "Vérification des droits indisponible");
  if (role.data !== true) throw new WebsiteGenerationAccessError(403, "Autorisation de génération requise");
  // user_id/session_id are mutable through legacy proposal policies. They are
  // deliberately NOT authorization evidence for privileged generation.
  return "admin";
}
