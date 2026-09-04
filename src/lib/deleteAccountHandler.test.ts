// @vitest-environment node

import path from "node:path";

import { build } from "esbuild";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

type Handler = (request: Request) => Promise<Response>;
type HarnessGlobal = typeof globalThis & {
  Deno?: {
    env: { get(name: string): string | undefined };
    serve(handler: Handler): void;
  };
  __deleteAccountCreateClient?: (...args: unknown[]) => unknown;
};

const harnessGlobal = globalThis as HarnessGlobal;
const originalDeno = harnessGlobal.Deno;
let handler: Handler;

function createAdminClient(options?: {
  appleRefreshToken?: string;
  firstReadError?: string;
}) {
  const queryCalls: string[] = [];
  const getUser = vi.fn(async (token: string) => ({
    data: { user: { id: "caller-user", email: "caller@example.com" } },
    error: null,
  }));
  const deleteUser = vi.fn(async () => ({ error: null }));

  const query = (table: string) => ({
    select: vi.fn(() => ({
      eq: vi.fn(async (column: string, value: string) => {
        queryCalls.push(`${table}.select.eq:${column}=${value}`);
        if (table === "apple_auth_tokens" && options?.appleRefreshToken) {
          return {
            data: [{ refresh_token: options.appleRefreshToken }],
            error: null,
          };
        }
        return table === "digital_cards" && options?.firstReadError
          ? { data: null, error: { message: options.firstReadError } }
          : { data: [], error: null };
      }),
      in: vi.fn(async () => ({ data: [], error: null })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(async (column: string, value: string) => {
        queryCalls.push(`${table}.delete.eq:${column}=${value}`);
        return { data: null, error: null };
      }),
      in: vi.fn(async () => ({ data: null, error: null })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(async (column: string, value: string) => {
        queryCalls.push(`${table}.update.eq:${column}=${value}`);
        return { data: null, error: null };
      }),
      in: vi.fn(async () => ({ data: null, error: null })),
    })),
  });

  return {
    client: {
      auth: { getUser, admin: { deleteUser } },
      from: vi.fn(query),
      storage: {
        from: vi.fn(() => ({
          list: vi.fn(async () => ({ data: [], error: null })),
          remove: vi.fn(async () => ({ error: null })),
        })),
      },
    },
    deleteUser,
    getUser,
    queryCalls,
  };
}

beforeAll(async () => {
  harnessGlobal.Deno = {
    env: {
      get: (name: string) => ({
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-role",
      })[name],
    },
    serve: (registeredHandler) => {
      handler = registeredHandler;
    },
  };

  const result = await build({
    entryPoints: [path.resolve("supabase/functions/delete-account/index.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    logLevel: "silent",
    tsconfigRaw: { compilerOptions: {} },
    plugins: [{
      name: "fake-supabase-client",
      setup(buildApi) {
        buildApi.onResolve({ filter: /^https:\/\/esm\.sh\/.*supabase-js/ }, () => ({
          path: "supabase-client",
          namespace: "fake",
        }));
        buildApi.onLoad({ filter: /.*/, namespace: "fake" }, () => ({
          contents: "export const createClient = (...args) => globalThis.__deleteAccountCreateClient(...args);",
          loader: "js",
        }));
      },
    }],
  });

  const source = Buffer.from(result.outputFiles[0].contents).toString("base64");
  await import(`data:text/javascript;base64,${source}`);
});

afterAll(() => {
  harnessGlobal.Deno = originalDeno;
  delete harnessGlobal.__deleteAccountCreateClient;
});

describe("delete-account HTTP handler", () => {
  it("allows only POST and OPTIONS", async () => {
    const createClient = vi.fn();
    harnessGlobal.__deleteAccountCreateClient = createClient;

    const response = await handler(new Request("https://example.test/delete-account", { method: "GET" }));

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST, OPTIONS");
    expect(createClient).not.toHaveBeenCalled();
  });

  it("rejects any authorization scheme other than Bearer", async () => {
    const { client, getUser, deleteUser } = createAdminClient();
    harnessGlobal.__deleteAccountCreateClient = vi.fn(() => client);

    const response = await handler(new Request("https://example.test/delete-account", {
      method: "POST",
      headers: { Authorization: "Basic caller-token" },
    }));

    expect(response.status).toBe(401);
    expect(getUser).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("derives the deleted user only from the verified bearer token", async () => {
    const { client, getUser, deleteUser, queryCalls } = createAdminClient();
    const createClient = vi.fn(() => client);
    harnessGlobal.__deleteAccountCreateClient = createClient;

    const response = await handler(new Request("https://example.test/delete-account", {
      method: "POST",
      headers: {
        Authorization: "Bearer caller-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "victim-user", email: "victim@example.com" }),
    }));

    expect(response.status).toBe(200);
    expect(getUser).toHaveBeenCalledWith("caller-token");
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(deleteUser).toHaveBeenCalledWith("caller-user");
    expect(deleteUser).not.toHaveBeenCalledWith("victim-user");
    expect(queryCalls).toContain("webstudio_orders.update.eq:customer_email=caller@example.com");
    expect(queryCalls).not.toContain("webstudio_orders.update.eq:customer_email=victim@example.com");
    expect(createClient).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "test-service-role",
    );
  });

  it("does not expose internal database errors", async () => {
    const { client } = createAdminClient({ firstReadError: "permission denied: private_table" });
    harnessGlobal.__deleteAccountCreateClient = vi.fn(() => client);

    const response = await handler(new Request("https://example.test/delete-account", {
      method: "POST",
      headers: { Authorization: "Bearer caller-token" },
    }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "La suppression du compte a échoué" });
    expect(JSON.stringify(body)).not.toContain("private_table");
  });

  it("does not mutate account data when Apple revocation cannot be prepared", async () => {
    const { client, deleteUser, queryCalls } = createAdminClient({
      appleRefreshToken: "test-refresh-token",
    });
    harnessGlobal.__deleteAccountCreateClient = vi.fn(() => client);

    const response = await handler(new Request("https://example.test/delete-account", {
      method: "POST",
      headers: { Authorization: "Bearer caller-token" },
    }));

    expect(response.status).toBe(500);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(queryCalls.some((call) => call.includes(".delete."))).toBe(false);
    expect(queryCalls.some((call) => call.includes(".update."))).toBe(false);
  });

  it("answers CORS preflight without credentials", async () => {
    const response = await handler(new Request("https://example.test/delete-account", {
      method: "OPTIONS",
    }));

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("POST, OPTIONS");
    expect(response.headers.has("Access-Control-Allow-Credentials")).toBe(false);
  });
});
