/**
 * Opens Stripe for an order already priced by prepare_nfc_order.
 * The body is only the order id. The signed-in session supplies the JWT.
 */
export type NfcInvoke = (
  name: string,
  options: { body: Record<string, unknown> },
) => Promise<{ data: unknown; error: { message?: string } | null }>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? value as Record<string, unknown> : null;
}

export function nfcCheckoutSessionUrl(data: unknown): string | null {
  const url = asRecord(data)?.url;
  return typeof url === "string" && url.startsWith("https://") ? url : null;
}

export async function openNfcCheckout(
  invoke: NfcInvoke,
  orderId: string,
): Promise<{ ok: true; url: string } | { ok: false }> {
  const created = await invoke("create-nfc-payment", { body: { orderId } });
  if (created.error) return { ok: false };
  const url = nfcCheckoutSessionUrl(created.data);
  if (!url) return { ok: false };
  return { ok: true, url };
}
