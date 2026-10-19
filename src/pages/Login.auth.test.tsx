import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { safeAuthReturnPath } from "@/lib/authRedirect";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(), signUp: vi.fn(), apple: vi.fn(), google: vi.fn(),
  appleLoading: false, user: null as null | { id: string }, success: vi.fn(),
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ signIn: mocks.signIn, signUp: mocks.signUp, user: mocks.user, loading: false }) }));
vi.mock("@/contexts/GuestCardContext", () => ({ useGuestCard: () => ({ hasGuestCard: false }) }));
vi.mock("@/hooks/useAppleAuth", () => ({ useAppleAuth: () => ({ loading: mocks.appleLoading, signInWithApple: mocks.apple }) }));
vi.mock("@/lib/nativeOAuth", () => ({ signInWithGoogleCrossPlatform: mocks.google }));
vi.mock("sonner", () => ({ toast: { success: mocks.success, error: vi.fn() } }));
import Login from "./Login";

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.clearAllMocks(); mocks.appleLoading = false; mocks.user = null;
  mocks.signIn.mockResolvedValue({ error: null });
  mocks.signUp.mockResolvedValue({ error: null, requiresEmailConfirmation: false });
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Network forbidden"); }));
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.unstubAllGlobals(); });
async function render(path = "/login") {
  await act(async () => root.render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<p>Dashboard reached</p>} /></Routes></MemoryRouter>));
}
async function clickText(text: string) {
  const button = [...host.querySelectorAll("button")].find((b) => b.textContent?.includes(text));
  if (!button) throw new Error(`Missing button: ${text}`);
  await act(async () => button.click());
}
async function fill(email = "review@example.invalid", password = "Synthetic-password") {
  await act(async () => {
    for (const [id, value] of [["email", email], ["password", password]]) {
      const input = host.querySelector<HTMLInputElement>(`#${id}`)!;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}
async function submit() {
  await act(async () => host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
}

describe("Login — parcours du réviseur", () => {
  it("envoie un email nettoyé mais conserve le mot de passe exactement", async () => {
    await render(); await fill("  review@example.invalid  ", " pass "); await submit();
    expect(mocks.signIn).toHaveBeenCalledWith("review@example.invalid", " pass ");
  });
  it("autorise la connexion avec un ancien mot de passe court", async () => {
    await render(); await fill("review@example.invalid", "short"); await submit();
    expect(mocks.signIn).toHaveBeenCalledOnce();
  });
  it("explique la confirmation email sans annoncer une session ouverte", async () => {
    mocks.signUp.mockResolvedValue({ error: null, requiresEmailConfirmation: true });
    await render(); await clickText("Pas encore de compte"); await fill(); await submit();
    expect(host.querySelector('[role="status"]')?.textContent).toContain("confirmez votre adresse");
    expect(mocks.success).not.toHaveBeenCalled();
  });
  it("conserve la règle de longueur à l’inscription", async () => {
    await render(); await clickText("Pas encore de compte"); await fill("review@example.invalid", "short"); await submit();
    expect(mocks.signUp).not.toHaveBeenCalled();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain("6 caractères");
  });
  it("affiche une erreur réseau puis permet de réessayer", async () => {
    mocks.signIn.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await render(); await fill(); await submit();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain("Internet");
    expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
    await submit(); expect(mocks.signIn).toHaveBeenCalledTimes(2);
  });
  it.each([
    ["invalid_credentials", "Email ou mot de passe incorrect"],
    ["email_not_confirmed", "Confirmez d’abord"],
    ["over_request_rate_limit", "Trop de tentatives"],
  ])("explique l’erreur %s", async (code, expected) => {
    mocks.signIn.mockResolvedValue({ error: { code } });
    await render(); await fill(); await submit();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(expected);
  });
  it("bloque le double envoi et les autres fournisseurs pendant une requête", async () => {
    let finish!: (value: { error: null }) => void;
    mocks.signIn.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    await render(); await fill();
    await act(async () => {
      const form = host.querySelector("form")!;
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(mocks.signIn).toHaveBeenCalledOnce();
    expect([...host.querySelectorAll("button")].every((b) => b.disabled)).toBe(true);
    await act(async () => finish({ error: null }));
  });
  it("bloque le formulaire et Google pendant la connexion Apple", async () => {
    mocks.appleLoading = true; await render(); await submit();
    expect(mocks.signIn).not.toHaveBeenCalled();
    expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
    expect(host.querySelector<HTMLInputElement>('#email')?.getAttribute("autocapitalize")).toBe("none");
  });
  it("utilise la navigation interne pour le mot de passe oublié", async () => {
    await render(); expect(host.querySelector('a[href="/forgot-password"]')).not.toBeNull();
  });
  it("dirige une session réelle vers le tableau de bord plutôt qu’une URL externe", async () => {
    mocks.user = { id: "reviewer" }; await render("/login?returnTo=%2F%2Fevil.example");
    expect(host.textContent).toContain("Dashboard reached");
  });
});

describe("safeAuthReturnPath", () => {
  it.each([null, "", "https://evil.example", "//evil.example", "/\\evil.example", "/%2Fevil.example", "/%5cevil.example", "/%0aevil.example", "/%ZZ"])("rejette %s", (value) => {
    expect(safeAuthReturnPath(value)).toBe("/dashboard");
  });
  it("préserve la destination interne et ses paramètres", () => {
    expect(safeAuthReturnPath("/finalize?plan=pro#details")).toBe("/finalize?plan=pro#details");
  });
});
