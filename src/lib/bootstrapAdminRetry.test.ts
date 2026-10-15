import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { isTransientBootstrapError } from "./bootstrapAdminRetry";

describe("bootstrap-admin transient error classification", () => {
  it("retries Supabase network and relay failures", () => {
    expect(isTransientBootstrapError(new FunctionsFetchError(new TypeError("Failed to fetch")))).toBe(true);
    expect(isTransientBootstrapError(new FunctionsRelayError(undefined))).toBe(true);
    expect(isTransientBootstrapError(new FunctionsRelayError({ status: 503 }))).toBe(true);
  });

  it.each([408, 429, 500, 502, 503, 504])("retries HTTP %i", (status) => {
    expect(isTransientBootstrapError(new FunctionsHttpError({ status }))).toBe(true);
  });

  it.each([400, 401, 403, 404, 409, 422, 501, 505])("does not retry HTTP %i", (status) => {
    expect(isTransientBootstrapError(new FunctionsHttpError({ status }))).toBe(false);
    expect(isTransientBootstrapError(new FunctionsRelayError({ status }))).toBe(false);
  });

  it("does not retry cancellation or unclassified errors", () => {
    const abortError = new DOMException("Cancelled", "AbortError");
    for (const error of [abortError, new FunctionsFetchError(abortError), new Error("Unknown failure"), new TypeError("Programming error"), new FunctionsHttpError(undefined), null]) {
      expect(isTransientBootstrapError(error)).toBe(false);
    }
  });
});
