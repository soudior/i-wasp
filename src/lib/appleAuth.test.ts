import { describe, it, expect } from "vitest";
import {
  generateRawNonce,
  sha256Hex,
  isApplePrivateRelayEmail,
  classifyAppleError,
  appleErrorMessage,
} from "./appleAuth";

describe("appleAuth — nonce", () => {
  it("generates a hex nonce of the expected length", () => {
    const n = generateRawNonce(32);
    expect(n).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique nonces", () => {
    const a = generateRawNonce();
    const b = generateRawNonce();
    expect(a).not.toBe(b);
  });

  it("hashes deterministically with SHA-256 (known vector)", async () => {
    // SHA-256("") = e3b0c442...
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("produces a hash different from the raw nonce", async () => {
    const raw = generateRawNonce();
    const hashed = await sha256Hex(raw);
    expect(hashed).not.toBe(raw);
    expect(hashed).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("appleAuth — private relay email detection", () => {
  it("detects Apple private relay addresses", () => {
    expect(isApplePrivateRelayEmail("abc123@privaterelay.appleid.com")).toBe(true);
    expect(isApplePrivateRelayEmail("ABC@PrivateRelay.AppleID.com")).toBe(true);
  });

  it("treats real addresses as non-relay", () => {
    expect(isApplePrivateRelayEmail("user@i-wasp.com")).toBe(false);
    expect(isApplePrivateRelayEmail(null)).toBe(false);
    expect(isApplePrivateRelayEmail(undefined)).toBe(false);
    expect(isApplePrivateRelayEmail("")).toBe(false);
  });
});

describe("appleAuth — error classification", () => {
  it("classifies cancellation", () => {
    expect(classifyAppleError("The operation was canceled")).toBe("canceled");
    expect(classifyAppleError({ code: "1001" })).toBe("canceled");
    expect(classifyAppleError({ message: "popup_closed_by_user" })).toBe("canceled");
  });

  it("classifies network errors", () => {
    expect(classifyAppleError(new Error("network timeout"))).toBe("network");
  });

  it("classifies unsupported platform", () => {
    expect(classifyAppleError("Sign in with Apple not available")).toBe("not_supported");
  });

  it("classifies invalid token/nonce responses", () => {
    expect(classifyAppleError(new Error("invalid nonce"))).toBe("invalid_response");
  });

  it("falls back to unknown", () => {
    expect(classifyAppleError({})).toBe("unknown");
    expect(classifyAppleError(null)).toBe("unknown");
  });

  it("maps every kind to a non-empty French message", () => {
    for (const kind of ["canceled", "network", "not_supported", "invalid_response", "unknown"] as const) {
      expect(appleErrorMessage(kind).length).toBeGreaterThan(0);
    }
  });
});
