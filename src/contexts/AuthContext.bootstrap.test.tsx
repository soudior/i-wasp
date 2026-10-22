/** Real AuthProvider; all Supabase methods are synthetic and network is forbidden. */
import React, { act, StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), getSession: vi.fn(), onAuthStateChange: vi.fn(), unsubscribe: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  auth: {
    onAuthStateChange: mocks.onAuthStateChange,
    getSession: mocks.getSession,
  },
  functions: { invoke: mocks.invoke },
} }));
vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

import { AuthProvider } from "./AuthContext";

let root: Root | null;
let host: HTMLDivElement;
let queryClient: QueryClient;
let authListener: (event: AuthChangeEvent, session: Session | null) => void;
let forbiddenFetch: ReturnType<typeof vi.fn>;

const sessionFor = (id: string) => ({ user: { id, email: `${id}@example.invalid` } }) as Session;
const emit = async (id: string | null, event: AuthChangeEvent = "SIGNED_IN") => {
  await act(async () => authListener(event, id ? sessionFor(id) : null));
};
async function mount() {
  root = createRoot(host);
  await act(async () => root?.render(
    <StrictMode><QueryClientProvider client={queryClient}><AuthProvider>{null}</AuthProvider></QueryClientProvider></StrictMode>,
  ));
}
async function unmount() {
  await act(async () => root?.unmount());
  root = null;
}

beforeEach(async () => {
  vi.resetAllMocks();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  forbiddenFetch = vi.fn(() => { throw new Error("Network forbidden"); });
  vi.stubGlobal("fetch", forbiddenFetch);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
  mocks.invoke.mockResolvedValue({ error: null });
  mocks.getSession.mockResolvedValue({ data: { session: null } });
  mocks.onAuthStateChange.mockImplementation((listener: typeof authListener) => {
    authListener = listener;
    return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
  });
  queryClient = new QueryClient();
  host = document.createElement("div");
  document.body.append(host);
  await mount();
});

afterEach(async () => {
  await unmount();
  queryClient.clear();
  host.remove();
  expect(forbiddenFetch).not.toHaveBeenCalled();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("AuthProvider does not call bootstrap-admin for a customer session", () => {
  it("leaves an initial session, sign-in, refresh and account switch untouched", async () => {
    await unmount();
    mocks.getSession.mockResolvedValue({ data: { session: sessionFor("user-a") } });
    await mount();
    await emit("user-a");
    await emit("user-a", "TOKEN_REFRESHED");
    await emit("user-b");
    await emit(null, "SIGNED_OUT");
    await emit("user-a");
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
});
