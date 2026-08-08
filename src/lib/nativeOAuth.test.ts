import { describe, it, expect } from "vitest";
import {
  NATIVE_OAUTH_REDIRECT,
  isNativeOAuthCallback,
  extractAuthCode,
  extractAuthError,
} from "./nativeOAuth";

describe("nativeOAuth — validation du deep link de retour", () => {
  it("accepte le callback exact avec code", () => {
    expect(isNativeOAuthCallback(`${NATIVE_OAUTH_REDIRECT}?code=abc123`)).toBe(true);
  });

  it("rejette les autres deep links de l'app", () => {
    expect(isNativeOAuthCallback("iwasp://card/mon-slug")).toBe(false);
    expect(isNativeOAuthCallback("iwasp://auth/callback-evil?code=x")).toBe(false);
  });

  it("rejette les URLs https ou étrangères", () => {
    expect(isNativeOAuthCallback("https://evil.example/auth/callback?code=x")).toBe(false);
    expect(isNativeOAuthCallback("otherapp://auth/callback?code=x")).toBe(false);
  });
});

describe("nativeOAuth — extraction du code", () => {
  it("extrait le code d'autorisation", () => {
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?code=abc-123_XYZ`)).toBe("abc-123_XYZ");
  });

  it("retourne null sans code", () => {
    expect(extractAuthCode(NATIVE_OAUTH_REDIRECT)).toBeNull();
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?state=only`)).toBeNull();
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?code=`)).toBeNull();
  });

  it("ignore un fragment après le query", () => {
    expect(extractAuthCode(`${NATIVE_OAUTH_REDIRECT}?code=ok#frag`)).toBe("ok");
  });
});

describe("nativeOAuth — extraction des erreurs provider", () => {
  it("extrait error_description en priorité", () => {
    expect(
      extractAuthError(`${NATIVE_OAUTH_REDIRECT}?error=access_denied&error_description=User+canceled`),
    ).toBe("User canceled");
  });

  it("retombe sur error", () => {
    expect(extractAuthError(`${NATIVE_OAUTH_REDIRECT}?error=access_denied`)).toBe("access_denied");
  });

  it("null quand pas d'erreur", () => {
    expect(extractAuthError(`${NATIVE_OAUTH_REDIRECT}?code=fine`)).toBeNull();
  });
});
