import {
  buildStripeCheckoutRequest,
  ContractError,
  parseBearerToken,
  parseCheckoutRequest,
  resolveCheckoutContract,
  resolveCheckoutOrigin,
  type NfcOrderRecord,
} from "./contract.ts";

export interface VerifiedCheckoutUser {
  id: string;
  email?: string | null;
}

export interface CreateNfcPaymentDependencies {
  verifyUser: (token: string) => Promise<VerifiedCheckoutUser | null>;
  findOrder: (orderId: string) => Promise<NfcOrderRecord | null>;
  findCustomer: (email: string) => Promise<string | undefined>;
  createCheckoutSession: (
    params: ReturnType<typeof buildStripeCheckoutRequest>["params"],
    options: ReturnType<typeof buildStripeCheckoutRequest>["options"],
  ) => Promise<{ id: string; url: string | null }>;
  recordCheckoutSession: (
    orderId: string,
    userId: string,
    sessionId: string,
    checkoutRevision: number,
  ) => Promise<void>;
  allowedOrigins?: string;
  defaultOrigin?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function createNfcPaymentHandler(dependencies: CreateNfcPaymentDependencies) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const token = parseBearerToken(request.headers.get("Authorization"));
      const user = await dependencies.verifyUser(token);
      if (!user) throw new ContractError("Authentification invalide", 401);

      const input = parseCheckoutRequest(await request.json());
      const order = await dependencies.findOrder(input.orderId);
      const checkout = resolveCheckoutContract(order, user.id);
      const customerId = user.email ? await dependencies.findCustomer(user.email) : undefined;
      const origin = resolveCheckoutOrigin(
        request.headers.get("origin"),
        dependencies.allowedOrigins,
        dependencies.defaultOrigin,
      );
      const stripeRequest = buildStripeCheckoutRequest(checkout, origin, customerId, user.email ?? undefined);
      const session = await dependencies.createCheckoutSession(stripeRequest.params, stripeRequest.options);
      if (!session.url) throw new Error("Stripe Checkout URL missing");
      await dependencies.recordCheckoutSession(
        checkout.orderId,
        user.id,
        session.id,
        order!.checkout_revision,
      );

      return jsonResponse({ url: session.url, sessionId: session.id });
    } catch (error) {
      if (error instanceof ContractError) return jsonResponse({ error: error.message }, error.status);
      console.error("[CREATE-NFC-PAYMENT] Failed", error instanceof Error ? error.message : "Unknown error");
      return jsonResponse({ error: "Impossible de créer le paiement" }, 500);
    }
  };
}
