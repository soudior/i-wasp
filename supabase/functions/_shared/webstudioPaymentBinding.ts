/** Only the retrieved Stripe session can bind a payment to its proposal. */
export function verifiedPaymentProposal(
  session: { status: string | null; payment_status: string; metadata: Record<string, string> | null },
  requestedProposal: unknown,
  flow: "webstudio" | "ia",
): string | null {
  if (session.status !== "complete" || session.payment_status !== "paid") return null;
  const metadata = session.metadata;
  if (!metadata || (flow === "webstudio" && metadata.type !== "webstudio")) return null;
  const id = flow === "webstudio" ? metadata.proposal_id : metadata.proposalId;
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
  if (requestedProposal !== undefined && requestedProposal !== id) return null;
  if (flow === "ia" && !["true", "false"].includes(metadata.isInstant)) return null;
  return id;
}
