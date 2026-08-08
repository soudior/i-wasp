import { describe, it, expect } from "vitest";
import { isDeleteConfirmed, DELETE_CONFIRM_WORD } from "./accountDeletion";

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
