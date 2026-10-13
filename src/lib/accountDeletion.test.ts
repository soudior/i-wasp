import { describe, it, expect } from "vitest";
import {
  isDeleteConfirmed,
  DELETE_CONFIRM_WORD,
  DELETED_USER_SENTINEL,
  DELETE_ACCOUNT_FAILURE_MESSAGE,
  anonymizedOrderPatch,
  requestAccountDeletion,
} from "./accountDeletion";

describe("account deletion confirmation gate", () => {
  it("accepts the exact confirmation word", () => {
    expect(isDeleteConfirmed("SUPPRIMER")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isDeleteConfirmed("supprimer")).toBe(true);
    expect(isDeleteConfirmed("Supprimer")).toBe(true);
  });

  it("tolerates surrounding whitespace", () => {
    expect(isDeleteConfirmed("  SUPPRIMER  ")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isDeleteConfirmed("")).toBe(false);
    expect(isDeleteConfirmed("   ")).toBe(false);
  });

  it("rejects partial or different input", () => {
    expect(isDeleteConfirmed("SUPPRIM")).toBe(false);
    expect(isDeleteConfirmed("DELETE")).toBe(false);
    expect(isDeleteConfirmed("supprimer mon compte")).toBe(false);
  });

  it("exposes the confirmation word as a constant", () => {
    expect(DELETE_CONFIRM_WORD).toBe("SUPPRIMER");
  });
});

describe("order anonymization contract", () => {
  const patch = anonymizedOrderPatch();

  it("detaches the user with a sentinel UUID (never a real id, never null)", () => {
    expect(patch.user_id).toBe(DELETED_USER_SENTINEL);
    expect(patch.user_id).toMatch(/^0{8}-0{4}-0{4}-0{4}-0{12}$/);
  });

  it("scrubs every directly-identifying field", () => {
    // e-mail remplacé par une valeur non identifiante
    expect(patch.customer_email).toBe("deleted@anonymized.local");
    expect(patch.shipping_name).toBe("Utilisateur supprimé");
    // coordonnées et personnalisation effacées
    for (const key of [
      "shipping_phone",
      "shipping_address",
      "shipping_city",
      "shipping_postal_code",
      "shipping_country",
      "tracking_number",
      "admin_notes",
      "logo_url",
      "background_image_url",
      "print_file_url",
    ]) {
      expect(patch[key], `${key} doit être null`).toBeNull();
    }
    // order_items (peut contenir un nom imprimé) vidé
    expect(patch.order_items).toEqual([]);
  });

  it("retains no value that could identify the original user", () => {
    const serialized = JSON.stringify(patch).toLowerCase();
    // aucune trace d'un e-mail réel ou d'un domaine client
    expect(serialized).not.toContain("@gmail");
    expect(serialized).not.toContain("@i-wasp.com");
  });
});

describe("account deletion request contract", () => {
  it("accepts only an explicit success response", async () => {
    await expect(requestAccountDeletion(async () => ({ data: null, error: null })))
      .rejects.toThrow(DELETE_ACCOUNT_FAILURE_MESSAGE);

    await expect(requestAccountDeletion(async () => ({ data: {}, error: null })))
      .rejects.toThrow(DELETE_ACCOUNT_FAILURE_MESSAGE);

    await expect(requestAccountDeletion(async () => ({
      data: { success: true },
      error: null,
    }))).resolves.toBeUndefined();
  });

  it("replaces SDK and server details with a stable user-facing error", async () => {
    await expect(requestAccountDeletion(async () => ({
      data: null,
      error: { message: "Edge Function returned a non-2xx status code" },
    }))).rejects.toThrow(DELETE_ACCOUNT_FAILURE_MESSAGE);
  });
});
