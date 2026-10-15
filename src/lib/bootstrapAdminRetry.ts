import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";

// Retry only transport failures and HTTP statuses that may recover. In
// particular, authentication/authorization and other client errors are final.
const RETRYABLE_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

export function isTransientBootstrapError(error: unknown): boolean {
  if (error instanceof FunctionsFetchError) {
    // Supabase wraps fetch cancellation in FunctionsFetchError too.
    return error.context?.name !== "AbortError";
  }

  if (error instanceof FunctionsHttpError || error instanceof FunctionsRelayError) {
    const status: unknown = error.context?.status;
    if (typeof status === "number") return RETRYABLE_HTTP_STATUSES.has(status);
    return error instanceof FunctionsRelayError;
  }

  return false;
}
