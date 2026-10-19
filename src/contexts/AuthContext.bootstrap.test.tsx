/** Real AuthProvider; all Supabase methods are synthetic and network is forbidden. */
import React, { act, StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthChangeEvent, FunctionsFetchError, FunctionsHttpError, FunctionsRelayError, Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), getSession: vi.fn(), onAuthStateChange: vi.fn(), unsubscribe: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  auth: {
    onAuthStateChange: mocks.onAuthStateChange,
    getSession: mocks.getSession,
  },
  functions: { invoke: mocks.invoke },
} }));
vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

import { AuthProvider, useAuth } from "./AuthContext";

let root: Root | null;
let host: HTMLDivElement;
let queryClient: QueryClient;
let authState: ReturnType<typeof useAuth>;
let invalidate: MockInstance<QueryClient["invalidateQueries"]>;
let authListener: (event: AuthChangeEvent, session: Session | null) => void;
let forbiddenFetch: ReturnType<typeof vi.fn>;

const networkError = () => new FunctionsFetchError(new TypeError("Synthetic network failure"));
const sessionFor = (id: string) => ({ user: { id, email: `${id}@example.invalid` } }) as Session;
const emit = async (id: string | null, event: AuthChangeEvent = "SIGNED_IN") => {
  await act(async () => authListener(event, id ? sessionFor(id) : null));
};
const advance = async (milliseconds: number) => {
  await act(async () => vi.advanceTimersByTimeAsync(milliseconds));
};
function deferredValue<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}
const deferredResult = () => deferredValue<{ error: unknown }>();
function StateProbe() {
  authState = useAuth();
  return null;
}
async function mount() {
  root = createRoot(host);
  await act(async () => root?.render(
    <StrictMode><QueryClientProvider client={queryClient}><AuthProvider><StateProbe /></AuthProvider></QueryClientProvider></StrictMode>,
  ));
}
async function unmount() {
  await act(async () => root?.unmount());
  root = null;
}

beforeEach(async () => {
  vi.resetAllMocks();
  vi.useFakeTimers();
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
  invalidate = vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue();
  host = document.createElement("div");
  document.body.append(host);
  await mount();
});

afterEach(async () => {
  await unmount();
  queryClient.clear();
  host.remove();
  expect(forbiddenFetch).not.toHaveBeenCalled();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("AuthProvider bootstrap-admin lifecycle", () => {
  it.each([
    ["returns an error", () => mocks.getSession.mockResolvedValueOnce({ data: { session: null }, error: new Error("Synthetic storage error") })],
    ["rejects", () => mocks.getSession.mockRejectedValueOnce(new Error("Synthetic storage rejection"))],
  ])("clears loading when the initial session read %s", async (_label, configureFailure) => {
    await unmount();
    configureFailure();
    await mount();
    expect(authState.loading).toBe(false);
    expect(authState.user).toBeNull();
    expect(authState.session).toBeNull();
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  it("bootstraps an initial session once, including under StrictMode", async () => {
    await unmount();
    const pending = deferredValue<{ data: { session: Session | null } }>();
    mocks.getSession.mockReturnValue(pending.promise);
    await mount();
    await act(async () => pending.resolve({ data: { session: sessionFor("user-a") } }));
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
  });

  it.each(["user-b", null])("ignores a stale initial session after a newer auth event (%s)", async (newUser) => {
    await unmount();
    const pending = deferredValue<{ data: { session: Session | null } }>();
    mocks.getSession.mockReturnValue(pending.promise);
    await mount();
    await emit(newUser, newUser ? "SIGNED_IN" : "SIGNED_OUT");
    await act(async () => pending.resolve({ data: { session: sessionFor("user-a") } }));
    if (newUser) {
      expect(mocks.invoke).toHaveBeenCalledTimes(1);
      expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", newUser] });
    } else {
      expect(mocks.invoke).not.toHaveBeenCalled();
      expect(invalidate).not.toHaveBeenCalled();
    }
  });

  it("ignores an initial session read that settles after unmount", async () => {
    await unmount();
    const pending = deferredValue<{ data: { session: Session | null } }>();
    mocks.getSession.mockReturnValue(pending.promise);
    await mount();
    await unmount();
    await act(async () => pending.resolve({ data: { session: sessionFor("user-a") } }));
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("waits for a user, then invokes the unchanged ensure action and invalidates only that user", async () => {
    expect(mocks.invoke).not.toHaveBeenCalled();
    await emit("user-a");
    expect(mocks.invoke).toHaveBeenCalledExactlyOnceWith("bootstrap-admin", {
      body: { action: "ensure" }, signal: expect.any(AbortSignal),
    });
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
    await emit("user-a", "TOKEN_REFRESHED");
    await advance(30_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
  });

  it("recovers after a transport failure, waiting one second before retrying", async () => {
    mocks.invoke.mockResolvedValueOnce({ error: networkError() });
    await emit("user-a");
    expect(invalidate).not.toHaveBeenCalled();
    await advance(999);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    await advance(1);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
    await advance(30_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
  });

  it("caps failures at three attempts with one- and two-second backoff, including token refreshes", async () => {
    mocks.invoke.mockResolvedValue({ error: new FunctionsRelayError({ status: 503 }) });
    await emit("user-a");
    await advance(1_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    await emit("user-a", "TOKEN_REFRESHED");
    await advance(1_999);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    await advance(1);
    expect(mocks.invoke).toHaveBeenCalledTimes(3);
    await emit("user-a", "TOKEN_REFRESHED");
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(3);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("handles a rejected transient invocation without an unhandled rejection", async () => {
    mocks.invoke.mockRejectedValueOnce(networkError());
    await emit("user-a");
    await advance(1_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it.each([408, 429, 500, 502, 503, 504])("retries transient HTTP %i", async (status) => {
    mocks.invoke.mockResolvedValueOnce({ error: new FunctionsHttpError({ status }) });
    await emit("user-a");
    await advance(1_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it.each([400, 401, 403, 404, 409, 422, 501, 505])("does not retry HTTP %i", async (status) => {
    mocks.invoke.mockResolvedValue({ error: new FunctionsHttpError({ status }) });
    await emit("user-a");
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("does not retry an unclassified thrown error", async () => {
    mocks.invoke.mockRejectedValue(new Error("Synthetic programming failure"));
    await emit("user-a");
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("cancels a scheduled retry on unmount", async () => {
    mocks.invoke.mockResolvedValue({ error: networkError() });
    await emit("user-a");
    const signal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await unmount();
    expect(signal.aborted).toBe(true);
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("aborts an in-flight request on unmount and ignores late success", async () => {
    const pending = deferredResult();
    mocks.invoke.mockReturnValueOnce(pending.promise);
    await emit("user-a");
    const signal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => pending.resolve({ error: null }));
    expect(invalidate).not.toHaveBeenCalled();
  });

  it("cancels the old account retry and gives the new account its own cycle", async () => {
    mocks.invoke.mockResolvedValueOnce({ error: networkError() });
    await emit("user-a");
    const oldSignal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await emit("user-b");
    expect(oldSignal.aborted).toBe(true);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-b"] });
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
  });

  it.each([null, networkError()])("ignores a late old-account result after switching accounts (%s)", async (error) => {
    const pending = deferredResult();
    mocks.invoke.mockReturnValueOnce(pending.promise);
    await emit("user-a");
    const oldSignal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await emit("user-b");
    expect(oldSignal.aborted).toBe(true);
    await act(async () => pending.resolve({ error }));
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-b"] });
  });

  it("ignores old-account success even before the new account's render commits", async () => {
    const pending = deferredResult();
    mocks.invoke.mockReturnValueOnce(pending.promise);
    await emit("user-a");
    await act(async () => {
      authListener("SIGNED_IN", sessionFor("user-b"));
      pending.resolve({ error: null });
      await pending.promise;
    });
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-b"] });
  });

  it("cancels on sign-out and starts a fresh cycle when the same user signs back in", async () => {
    mocks.invoke.mockResolvedValueOnce({ error: networkError() });
    await emit("user-a");
    const oldSignal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await emit(null, "SIGNED_OUT");
    expect(oldSignal.aborted).toBe(true);
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    await emit("user-a");
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
  });

  it("restarts after batched sign-out/sign-in of the same user without reviving the old retry", async () => {
    mocks.invoke.mockResolvedValueOnce({ error: networkError() });
    await emit("user-a");
    const oldSignal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await act(async () => {
      authListener("SIGNED_OUT", null);
      authListener("SIGNED_IN", sessionFor("user-a"));
    });
    expect(oldSignal.aborted).toBe(true);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
    await emit("user-a", "TOKEN_REFRESHED");
    await advance(60_000);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
  });

  it("ignores the old in-flight result after batched sign-out/sign-in of the same user", async () => {
    const pending = deferredResult();
    mocks.invoke.mockReturnValueOnce(pending.promise);
    await emit("user-a");
    const oldSignal: AbortSignal = mocks.invoke.mock.calls[0][1].signal;
    await act(async () => {
      authListener("SIGNED_OUT", null);
      authListener("SIGNED_IN", sessionFor("user-a"));
      pending.resolve({ error: null });
      await pending.promise;
    });
    expect(oldSignal.aborted).toBe(true);
    expect(mocks.invoke).toHaveBeenCalledTimes(2);
    expect(invalidate).toHaveBeenCalledExactlyOnceWith({ queryKey: ["isAdmin", "user-a"] });
  });
});
