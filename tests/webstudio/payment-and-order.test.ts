// @vitest-environment node
// Integration tests execute the real handlers, with strictly local provider mocks.
// All identities, addresses and secrets below are deliberately fictional.
import { webcrypto } from "node:crypto";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyWebsiteGenerationToken } from "../../supabase/functions/_shared/websiteGenerationAccess";

type Handler = (request: Request) => Promise<Response>;
type Flow = "webstudio" | "ia";
type Session = {
  status: string | null;
  payment_status: string;
  metadata: Record<string, string> | null;
};
type Query = {
  table: string;
  operation: "read" | "update" | "insert";
  filters: Array<[string, unknown]>;
  columns?: string;
};

const providers = vi.hoisted(() => ({
  handlers: [] as Handler[],
  retrieve: vi.fn(),
  stripeConstructor: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("https://deno.land/std@0.190.0/http/server.ts", () => ({
  serve: (handler: Handler) => providers.handlers.push(handler),
}));
vi.mock("https://deno.land/std@0.168.0/http/server.ts", () => ({
  serve: (handler: Handler) => providers.handlers.push(handler),
}));
vi.mock("https://esm.sh/stripe@18.5.0", () => ({
  default: function MockStripe(key: string, options: unknown) {
    providers.stripeConstructor(key, options);
    return { checkout: { sessions: { retrieve: providers.retrieve } } };
  },
}));
vi.mock("https://esm.sh/@supabase/supabase-js@2.89.0", () => ({
  createClient: providers.createClient,
}));
vi.mock("https://esm.sh/@supabase/supabase-js@2.57.2", () => ({
  createClient: providers.createClient,
}));

const PROPOSAL_ID = "11111111-1111-4111-8111-111111111111";
const OTHER_PROPOSAL_ID = "22222222-2222-4222-8222-222222222222";
const SESSION_ID = "cs_test_local_fixture_only";
const BACKEND = "https://backend.example.invalid";
const SERVICE_SECRET = "fictional-service-secret-for-local-tests-only";
const STRIPE_SECRET = "sk_test_fictional_local_fixture_only";
const NOW = Date.parse("2026-10-14T00:00:00.000Z");
const handlers = {} as Record<Flow | "order", Handler>;

let session: Session;
let proposalStatus: string;
let lookupError: { message: string } | null;
let proposalExists: boolean;
let updateError: { message: string } | null;
let updated: { id: string } | null;
let insertError: { message: string } | null;
let contactError: { message: string } | null;
let queries: Query[];
let unexpected: string[];
let writes: ReturnType<typeof vi.fn>;
let invoke: ReturnType<typeof vi.fn>;
let network: ReturnType<typeof vi.fn>;
let from: ReturnType<typeof vi.fn>;
let logs: ReturnType<typeof vi.spyOn>;
let errors: ReturnType<typeof vi.spyOn>;

function failUnexpected(message: string): never {
  unexpected.push(message);
  throw new Error(message);
}

function paidSession(flow: Flow, isInstant = "true"): Session {
  return {
    status: "complete",
    payment_status: "paid",
    metadata: flow === "webstudio"
      ? { type: "webstudio", proposal_id: PROPOSAL_ID }
      : { proposalId: PROPOSAL_ID, isInstant },
  };
}

function request(body: unknown): Request {
  return new Request("https://request.example.invalid/edge-function", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function paymentRequest(proposalId: unknown = PROPOSAL_ID): Request {
  return request({ sessionId: SESSION_ID, proposalId });
}

function orderBody(): Record<string, unknown> {
  return {
    sessionId: "public-visitor-session-fixture",
    formData: {
      businessName: "Fictional Test Studio",
      businessType: "Test fixture",
      contactEmail: "customer@example.invalid",
      products: "Fictional product",
    },
    proposal: { siteName: "Fictional Test Site", tagline: "Local fixture" },
    isExpress: true,
    priceEur: 1,
    priceMad: 10,
  };
}

function assertNoEffects(): void {
  expect(writes).not.toHaveBeenCalled();
  expect(invoke).not.toHaveBeenCalled();
  expect(network).not.toHaveBeenCalled();
}

function assertGeneration(flow: Flow): void {
  if (flow === "webstudio") {
    expect(invoke).not.toHaveBeenCalled();
    expect(network).toHaveBeenCalledTimes(1);
    expect(network).toHaveBeenCalledWith(`${BACKEND}/functions/v1/generate-website-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_SECRET}`,
      },
      body: JSON.stringify({ proposalId: PROPOSAL_ID }),
    });
  } else {
    expect(network).not.toHaveBeenCalled();
    expect(invoke).toHaveBeenCalledExactlyOnceWith("generate-website-code", {
      body: { proposalId: PROPOSAL_ID },
    });
  }
}

beforeAll(async () => {
  // Imports must never start a server, read the host's environment or use network.
  vi.stubGlobal("Deno", { env: { get: () => { throw new Error("Unexpected import-time environment read"); } } });
  vi.stubGlobal("fetch", () => { throw new Error("Network disabled during handler imports"); });
  await import("../../supabase/functions/verify-webstudio-payment/index");
  handlers.webstudio = providers.handlers[0];
  await import("../../supabase/functions/verify-webstudio-ia-payment/index");
  handlers.ia = providers.handlers[1];
  await import("../../supabase/functions/webstudio-order/index");
  handlers.order = providers.handlers[2];
  expect(providers.handlers).toHaveLength(3);
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubGlobal("crypto", webcrypto);
  session = paidSession("webstudio");
  proposalStatus = "pending_payment";
  lookupError = null;
  proposalExists = true;
  updateError = null;
  updated = { id: PROPOSAL_ID };
  insertError = null;
  contactError = null;
  queries = [];
  unexpected = [];
  writes = vi.fn();
  logs = vi.spyOn(console, "log").mockImplementation(() => undefined);
  errors = vi.spyOn(console, "error").mockImplementation(() => undefined);

  const environment: Record<string, string> = {
    STRIPE_SECRET_KEY: STRIPE_SECRET,
    SUPABASE_URL: BACKEND,
    SUPABASE_SERVICE_ROLE_KEY: SERVICE_SECRET,
  };
  vi.stubGlobal("Deno", {
    env: { get: (key: string) => environment[key] ?? failUnexpected(`Unexpected environment variable: ${key}`) },
  });

  providers.stripeConstructor.mockImplementation((key: string) => {
    if (key !== STRIPE_SECRET) failUnexpected("Unexpected Stripe credential");
  });
  providers.retrieve.mockImplementation(async (id: string) => {
    if (id !== SESSION_ID) failUnexpected(`Unexpected Stripe session: ${id}`);
    return structuredClone(session);
  });

  invoke = vi.fn(async (name: string, options: unknown) => {
    if (name !== "generate-website-code") failUnexpected(`Unexpected function invocation: ${name}`);
    if (JSON.stringify(options) !== JSON.stringify({ body: { proposalId: PROPOSAL_ID } })) {
      failUnexpected("Generation invoked for an unverified proposal");
    }
    return { data: { success: true }, error: null };
  });

  from = vi.fn((table: string) => {
    if (table === "contact_requests") {
      return {
        insert: (payload: unknown) => {
          writes("insert", table, payload);
          return Promise.resolve({ error: contactError });
        },
      };
    }
    if (table !== "website_proposals") failUnexpected(`Unexpected table: ${table}`);
    const query: Query = { table, operation: "read", filters: [] };
    queries.push(query);
    const builder = {
      select: (columns: string) => { query.columns = columns; return builder; },
      eq: (column: string, value: unknown) => { query.filters.push([column, value]); return builder; },
      update: (payload: unknown) => {
        query.operation = "update";
        writes("update", table, payload);
        return builder;
      },
      insert: (payload: unknown) => {
        query.operation = "insert";
        writes("insert", table, payload);
        return builder;
      },
      single: async () => {
        if (query.operation === "read") {
          return { data: proposalExists ? { status: proposalStatus } : null, error: lookupError };
        }
        if (query.operation === "insert") {
          return { data: insertError ? null : { id: PROPOSAL_ID }, error: insertError };
        }
        return failUnexpected("Update must use compare-and-set with maybeSingle");
      },
      maybeSingle: async () => {
        if (query.operation !== "update") failUnexpected("Unexpected maybeSingle operation");
        return { data: updated, error: updateError };
      },
    };
    return builder;
  });

  providers.createClient.mockImplementation((url: string, key: string) => {
    if (url !== BACKEND || key !== SERVICE_SECRET) failUnexpected("Unexpected Supabase configuration");
    return { from, functions: { invoke } };
  });
  network = vi.fn(async (url: string, init?: RequestInit) => {
    const allowed = ["generate-website-code", "send-webstudio-confirmation", "send-admin-alert"];
    if (!allowed.some(name => url === `${BACKEND}/functions/v1/${name}`) || init?.method !== "POST") {
      failUnexpected(`Network is disabled; no mock route for ${url}`);
    }
    return Response.json({ success: true });
  });
  vi.stubGlobal("fetch", network);
});

afterEach(() => {
  try {
    // Fail even when the production handler catches an unexpected mock call.
    expect(unexpected).toEqual([]);
  } finally {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  }
});

describe.each(["webstudio", "ia"] as const)("%s payment handler", flow => {
  beforeEach(() => { session = paidSession(flow); });

  it("handles preflight without accessing providers", async () => {
    const response = await handlers[flow](new Request("https://request.example.invalid", { method: "OPTIONS" }));
    expect(response.status).toBe(200);
    expect(providers.retrieve).not.toHaveBeenCalled();
    expect(providers.createClient).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it.each([
    ["open", "paid"],
    ["expired", "paid"],
    [null, "paid"],
    ["complete", "unpaid"],
    ["complete", "no_payment_required"],
  ])("rejects checkout status %s / payment %s without writes", async (status, paymentStatus) => {
    session.status = status;
    session.payment_status = paymentStatus!;
    const response = await handlers[flow](paymentRequest());
    expect(await response.json()).toMatchObject({ success: false });
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it.each([null, {}])("rejects absent proposal metadata: %j", async metadata => {
    session.metadata = metadata;
    const response = await handlers[flow](paymentRequest());
    expect(response.status).toBe(400);
    expect((await response.json()).success).not.toBe(true);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it.each(["not-a-uuid", "", "11111111-1111-0111-0111-111111111111"])("rejects malformed metadata proposal ID %j", async id => {
    session.metadata![flow === "webstudio" ? "proposal_id" : "proposalId"] = id;
    // Keep the IA request's required ID present when Stripe metadata is empty.
    const response = await handlers[flow](paymentRequest(id || PROPOSAL_ID));
    expect(response.status).toBe(400);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it("rejects a client proposal that differs from the retrieved Stripe metadata", async () => {
    const response = await handlers[flow](paymentRequest(OTHER_PROPOSAL_ID));
    expect(response.status).toBe(400);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it("does not accept the other checkout flow's metadata shape", async () => {
    session = paidSession(flow === "ia" ? "webstudio" : "ia");
    const response = await handlers[flow](paymentRequest());
    expect(response.status).toBe(400);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it.each(["generating", "site_generated"])("preserves %s without resetting the status or generating again", async status => {
    proposalStatus = status;
    const response = await handlers[flow](paymentRequest());
    expect(await response.json()).toMatchObject({ success: true });
    expect(queries).toEqual([{ table: "website_proposals", operation: "read", columns: "status", filters: [["id", PROPOSAL_ID]] }]);
    assertNoEffects();
  });

  it("marks only the verified proposal paid and invokes generation for that same ID", async () => {
    const response = await handlers[flow](paymentRequest());
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    if (flow === "webstudio") expect(result.proposalId).toBe(PROPOSAL_ID);
    expect(providers.retrieve).toHaveBeenCalledExactlyOnceWith(SESSION_ID);
    expect(writes).toHaveBeenCalledTimes(1);
    expect(writes).toHaveBeenCalledWith("update", "website_proposals", expect.objectContaining({ status: "paid" }));
    expect(queries).toEqual([
      { table: "website_proposals", operation: "read", columns: "status", filters: [["id", PROPOSAL_ID]] },
      { table: "website_proposals", operation: "update", columns: "id", filters: [["id", PROPOSAL_ID], ["status", "pending_payment"]] },
    ]);
    assertGeneration(flow);
  });

  it("allows a paid proposal to retry generation without another status write", async () => {
    proposalStatus = "paid";
    const response = await handlers[flow](paymentRequest());
    expect(await response.json()).toMatchObject({ success: true });
    expect(writes).not.toHaveBeenCalled();
    assertGeneration(flow);
  });

  it("stops before generation when the payment status update fails", async () => {
    updateError = { message: "Fictional database write failure" };
    updated = null;
    const response = await handlers[flow](paymentRequest());
    expect(response.status).toBe(500);
    expect((await response.json()).success).not.toBe(true);
    expect(writes).toHaveBeenCalledTimes(1);
    expect(invoke).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });

  it("does not launch generation after losing the conditional status update race", async () => {
    updated = null;
    const response = await handlers[flow](paymentRequest());
    expect(await response.json()).toMatchObject({ success: true });
    expect(queries[1].filters).toEqual([["id", PROPOSAL_ID], ["status", "pending_payment"]]);
    expect(writes).toHaveBeenCalledTimes(1);
    expect(invoke).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });

  it.each(["missing", "lookup-error"])("does not write when proposal lookup is %s", async reason => {
    proposalExists = false;
    if (reason === "lookup-error") lookupError = { message: "Fictional lookup failure" };
    const response = await handlers[flow](paymentRequest());
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect((await response.json()).success).not.toBe(true);
    assertNoEffects();
  });
});

describe("checkout metadata contracts", () => {
  it.each([undefined, "", "subscription", "webstudio_ia"])("rejects the wrong Web Studio payment type %j", async type => {
    if (type === undefined) delete session.metadata!.type;
    else session.metadata!.type = type;
    const response = await handlers.webstudio(paymentRequest());
    expect(response.status).toBe(400);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it("uses only Stripe's bound ID when no Web Studio proposal ID is supplied", async () => {
    const response = await handlers.webstudio(request({ sessionId: SESSION_ID }));
    expect(await response.json()).toMatchObject({ success: true, proposalId: PROPOSAL_ID });
    expect(queries.every(query => query.filters.some(([key, value]) => key === "id" && value === PROPOSAL_ID))).toBe(true);
    assertGeneration("webstudio");
  });

  it.each([undefined, "", "TRUE", "1", "yes"])("rejects an invalid IA isInstant flag %j", async isInstant => {
    session = paidSession("ia");
    if (isInstant === undefined) delete session.metadata!.isInstant;
    else session.metadata!.isInstant = isInstant;
    const response = await handlers.ia(paymentRequest());
    expect(response.status).toBe(400);
    expect(from).not.toHaveBeenCalled();
    assertNoEffects();
  });

  it("accepts explicit IA isInstant=false without invoking instant generation", async () => {
    session = paidSession("ia", "false");
    const response = await handlers.ia(paymentRequest());
    expect(await response.json()).toEqual({ success: true, isInstant: false });
    expect(writes).toHaveBeenCalledExactlyOnceWith("update", "website_proposals", { status: "paid" });
    expect(queries[1].filters).toEqual([["id", PROPOSAL_ID], ["status", "pending_payment"]]);
    expect(invoke).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });
});

describe("Web Studio order generation capability", () => {
  async function assertBoundCapability(result: Record<string, unknown>): Promise<void> {
    expect(result.proposalId).toBe(PROPOSAL_ID);
    expect(result.generationToken).toMatch(/^v1\.\d{10}\.[0-9a-f]{64}$/);
    const token = result.generationToken as string;
    const expires = Number(token.split(".")[1]);
    expect(expires).toBe(NOW / 1000 + 15 * 60);
    expect(await verifyWebsiteGenerationToken(token, PROPOSAL_ID, SERVICE_SECRET, NOW)).toBe(true);
    expect(await verifyWebsiteGenerationToken(token, OTHER_PROPOSAL_ID, SERVICE_SECRET, NOW)).toBe(false);
    expect(await verifyWebsiteGenerationToken(token, PROPOSAL_ID, "another-fictional-secret", NOW)).toBe(false);
    expect(await verifyWebsiteGenerationToken(token, PROPOSAL_ID, SERVICE_SECRET, expires * 1000 - 1)).toBe(true);
    expect(await verifyWebsiteGenerationToken(token, PROPOSAL_ID, SERVICE_SECRET, expires * 1000)).toBe(false);
    expect(JSON.stringify(writes.mock.calls)).not.toContain(token);
    expect(JSON.stringify(logs.mock.calls)).not.toContain(token);
    expect(JSON.stringify(errors.mock.calls)).not.toContain(token);
    expect(JSON.stringify(network.mock.calls)).not.toContain(token);
    expect(invoke).not.toHaveBeenCalled();
  }

  it("returns a verifiable, expiring capability bound to the server-created ID", async () => {
    const body = { ...orderBody(), proposalId: OTHER_PROPOSAL_ID, generationToken: "caller-supplied-fake-token" };
    const response = await handlers.order(request(body));
    expect(response.status).toBe(200);
    const result = await response.json();
    await assertBoundCapability(result);
    expect(result.warning).toBeUndefined();
    expect(writes).toHaveBeenCalledTimes(2);
    expect(writes.mock.calls[0]).toEqual(["insert", "website_proposals", [expect.objectContaining({
      session_id: "public-visitor-session-fixture",
      status: "pending_payment",
    })]]);
    expect(writes.mock.calls[0][2][0]).not.toHaveProperty("generationToken");
    expect(writes.mock.calls[0][2][0]).not.toHaveProperty("id");
    expect(network).toHaveBeenCalledTimes(2);
    expect(network.mock.calls.map(([url]) => url)).toEqual([
      `${BACKEND}/functions/v1/send-webstudio-confirmation`,
      `${BACKEND}/functions/v1/send-admin-alert`,
    ]);
  });

  it("preserves the capability in the warning response when internal notification fails", async () => {
    contactError = { message: "Fictional internal notification failure" };
    const response = await handlers.order(request(orderBody()));
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.warning).toBe("Commande créée, mais notification interne échouée.");
    await assertBoundCapability(result);
    expect(writes).toHaveBeenCalledTimes(2);
    expect(network).not.toHaveBeenCalled();
  });

  it("returns no capability and sends no notifications after a failed proposal insert", async () => {
    insertError = { message: "Fictional proposal insert failure" };
    const response = await handlers.order(request(orderBody()));
    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).not.toHaveProperty("generationToken");
    expect(result).not.toHaveProperty("proposalId");
    expect(writes).toHaveBeenCalledTimes(1);
    expect(from).not.toHaveBeenCalledWith("contact_requests");
    expect(invoke).not.toHaveBeenCalled();
    expect(network).not.toHaveBeenCalled();
  });

  it.each(["sessionId", "formData", "proposal", "priceEur", "priceMad"])("rejects missing %s without side effects", async field => {
    const body = orderBody();
    delete body[field];
    const response = await handlers.order(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).not.toHaveProperty("generationToken");
    assertNoEffects();
  });

  it("rejects a missing contact email without side effects", async () => {
    const body = orderBody();
    delete (body.formData as Record<string, unknown>).contactEmail;
    const response = await handlers.order(request(body));
    expect(response.status).toBe(400);
    expect(await response.json()).not.toHaveProperty("generationToken");
    assertNoEffects();
  });
});
