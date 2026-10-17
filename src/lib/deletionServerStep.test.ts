import { describe, expect, it } from "vitest";
import { checkedDeletionStep } from "../../supabase/functions/delete-account/checkedStep";

describe("server account deletion error handling", () => {
  it("rejects a resolved Supabase error rather than reporting success", async () => {
    await expect(checkedDeletionStep("orders", () => Promise.resolve({
      data: null, error: { message: "permission denied" },
    }))).rejects.toThrow("orders: permission denied");
  });
  it("preserves query data on success", async () => {
    const response = { data: [{ id: "card" }], error: null };
    expect(await checkedDeletionStep("cards", () => Promise.resolve(response))).toBe(response);
  });
  it("stops the cleanup sequence before deleting Auth after a cleanup failure", async () => {
    const calls: string[] = [];
    const cleanup = async () => {
      await checkedDeletionStep("storage", async () => {
        calls.push("storage");
        return { error: { message: "unavailable" } };
      });
      calls.push("delete Auth");
    };
    await expect(cleanup()).rejects.toThrow("storage");
    expect(calls).toEqual(["storage"]);
  });
  it("propagates network failures", async () => {
    await expect(checkedDeletionStep("Apple", () => Promise.reject(new Error("network"))))
      .rejects.toThrow("network");
  });
});
