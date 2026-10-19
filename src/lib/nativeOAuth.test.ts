import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, Capacitor, App, Browser, appEvents, browserEvents } = vi.hoisted(() => ({
  auth: {
    signInWithOAuth: vi.fn(),
    exchangeCodeForSession: vi.fn(),
  },
  Capacitor: { isNativePlatform: vi.fn() },
  App: {
    addListener: vi.fn(),
    getLaunchUrl: vi.fn(),
  },
  Browser: {
    addListener: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
  },
  appEvents: {} as Record<string, (event: { url: string }) => void>,
  browserEvents: {} as Record<string, () => void>,
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));
vi.mock("@capacitor/core", () => ({ Capacitor }));
vi.mock("@capacitor/app", () => ({ App }));
vi.mock("@capacitor/browser", () => ({ Browser }));

import {
  NATIVE_OAUTH_REDIRECT,
  extractAuthCode,
  extractAuthError,
  isNativeOAuthCallback,
  recoverNativeOAuthLaunch,
  signInWithProviderNative,
} from "./nativeOAuth";

const callback = (url: string) => appEvents.appUrlOpen({ url });
const finishBrowser = () => browserEvents.browserFinished();
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => { resolve = res; });
  return { promise, resolve };
};

beforeEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  for (const key of Object.keys(appEvents)) delete appEvents[key];
  for (const key of Object.keys(browserEvents)) delete browserEvents[key];
  Capacitor.isNativePlatform.mockReturnValue(true);
  App.addListener.mockImplementation(async (event: string, listener: (...args: never[]) => void) => {
    appEvents[event] = listener as (event: { url: string }) => void;
    return { remove: vi.fn().mockResolvedValue(undefined) };
  });
  Browser.addListener.mockImplementation(async (event: string, listener: (...args: never[]) => void) => {
    browserEvents[event] = listener as () => void;
    return { remove: vi.fn().mockResolvedValue(undefined) };
  });
  App.getLaunchUrl.mockResolvedValue(undefined);
  Browser.open.mockResolvedValue(undefined);
  Browser.close.mockResolvedValue(undefined);
  auth.signInWithOAuth.mockResolvedValue({ data: { url: "https://auth.example/authorize" }, error: null });
  auth.exchangeCodeForSession.mockResolvedValue({ error: null });
});

describe("nativeOAuth — validation des callbacks", () => {
  it("accepte uniquement le deep link exact et extrait code/erreur", () => {
    expect(isNativeOAuthCallback(`${NATIVE_OAUTH_REDIRECT}?code=abc123`)).toBe(true);
    expect(isNativeOAuthCallback(`${NATIVE_OAUTH_REDIRECT}#code=abc`)).toBe(true);
    expect(isNativeOAuthCallback("iwasp://auth/callback-evil?code=x")).toBe(false);
    expect(isNativeOAuthCallback("https://evil.example/auth/callback?code=x")).toBe(false);
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?code=abc-123_XYZ#fragment`)).toBe("abc-123_XYZ");
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?state=only`)).toBeNull();
    expect(extractAuthError(`${NATIVE_OAUTH_REDIRECT}?error=access_denied&error_description=User+canceled`))
      .toBe("User canceled");
  });
});

describe("nativeOAuth — connexion native", () => {
  it("coalesce les demandes concurrentes, installe les listeners avant l'ouverture en popover iPad", async () => {
    const result = signInWithProviderNative("apple");
    const duplicate = signInWithProviderNative("apple");
    await expect(signInWithProviderNative("google")).resolves.toBe("error");
    expect(duplicate).toBe(result);
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    expect(App.addListener).toHaveBeenCalledBefore(Browser.open);
    expect(Browser.open).toHaveBeenCalledWith({
      url: "https://auth.example/authorize",
      presentationStyle: "popover",
    });
    callback(`${NATIVE_OAUTH_REDIRECT}?code=once`);
    await expect(result).resolves.toBe("success");
    expect(auth.signInWithOAuth).toHaveBeenCalledTimes(1);
    expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });

  it("ne lance qu'un seul échange quand Capacitor émet plusieurs callbacks concurrents", async () => {
    const exchange = deferred<{ error: null }>();
    auth.exchangeCodeForSession.mockReturnValue(exchange.promise);
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    callback(`${NATIVE_OAUTH_REDIRECT}?code=duplicate`);
    callback(`${NATIVE_OAUTH_REDIRECT}?code=duplicate`);
    await vi.waitFor(() => expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1));
    exchange.resolve({ error: null });
    await expect(result).resolves.toBe("success");
  });

  it("retourne error sans rejet si Supabase, le bridge ou le callback lève une exception", async () => {
    auth.signInWithOAuth.mockRejectedValueOnce(new Error("network"));
    await expect(signInWithProviderNative("apple")).resolves.toBe("error");

    App.addListener.mockRejectedValueOnce(new Error("bridge"));
    await expect(signInWithProviderNative("apple")).resolves.toBe("error");

    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    auth.exchangeCodeForSession.mockRejectedValueOnce(new Error("exchange"));
    callback(`${NATIVE_OAUTH_REDIRECT}?code=throws`);
    await expect(result).resolves.toBe("error");
  });

  it("ne transforme pas en annulation un retour valide dont l'échange est lent", async () => {
    vi.useFakeTimers();
    const exchange = deferred<{ error: null }>();
    auth.exchangeCodeForSession.mockReturnValue(exchange.promise);
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    callback(`${NATIVE_OAUTH_REDIRECT}?code=slow`);
    finishBrowser();
    await vi.advanceTimersByTimeAsync(2000);
    let settled = false;
    void result.then(() => { settled = true; });
    await Promise.resolve();
    expect(settled).toBe(false);
    exchange.resolve({ error: null });
    await expect(result).resolves.toBe("success");
  });

  it("accepte le callback arrivé tardivement juste après la fermeture de Safari", async () => {
    vi.useFakeTimers();
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    finishBrowser();
    await vi.advanceTimersByTimeAsync(1000);
    callback(`${NATIVE_OAUTH_REDIRECT}?code=late-event`);
    await vi.advanceTimersByTimeAsync(1000);
    await expect(result).resolves.toBe("success");
    expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
  });

  it("résout canceled après la fenêtre de grâce si Safari est fermé sans callback", async () => {
    vi.useFakeTimers();
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    finishBrowser();
    await vi.advanceTimersByTimeAsync(1500);
    await expect(result).resolves.toBe("canceled");
    expect(auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("termine en erreur un échange PKCE qui ne répond jamais", async () => {
    vi.useFakeTimers();
    auth.exchangeCodeForSession.mockReturnValueOnce(new Promise(() => {}));
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(Browser.open).toHaveBeenCalledTimes(1));
    callback(`${NATIVE_OAUTH_REDIRECT}?code=stalled`);
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    await expect(result).resolves.toBe("error");
  });

  it("borne le bridge lent et retire un listener installé après l’expiration", async () => {
    vi.useFakeTimers();
    const listener = deferred<{ remove: ReturnType<typeof vi.fn> }>();
    const remove = vi.fn().mockResolvedValue(undefined);
    App.addListener.mockReturnValueOnce(listener.promise);
    const result = signInWithProviderNative("apple");
    await vi.waitFor(() => expect(App.addListener).toHaveBeenCalledTimes(1));
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    await expect(result).resolves.toBe("canceled");
    listener.resolve({ remove });
    await vi.advanceTimersByTimeAsync(0);
    expect(remove).toHaveBeenCalledOnce();
    expect(Browser.open).not.toHaveBeenCalled();
  });

  it("retourne error (sans rejet) si la récupération cold launch échoue", async () => {
    App.getLaunchUrl.mockRejectedValueOnce(new Error("launch API"));
    await expect(recoverNativeOAuthLaunch()).resolves.toBe("error");
  });

  it("absorbe les callbacks de lancement à froid une seule fois et ignore les URL étrangères", async () => {
    App.getLaunchUrl.mockResolvedValueOnce({ url: "https://unrelated.example/" })
      .mockResolvedValue({ url: `${NATIVE_OAUTH_REDIRECT}?code=cold` });
    await expect(recoverNativeOAuthLaunch()).resolves.toBeNull();
    await expect(recoverNativeOAuthLaunch()).resolves.toBe("success");
    await expect(recoverNativeOAuthLaunch()).resolves.toBeNull();
    expect(auth.exchangeCodeForSession).toHaveBeenCalledTimes(1);
    Capacitor.isNativePlatform.mockReturnValue(false);
    await expect(recoverNativeOAuthLaunch()).resolves.toBeNull();
  });
});
