import { describe, expect, it } from "vitest";

import { buildOwnedOrderPhotoPath } from "./orderPhotoStorage";

describe("order photo storage path", () => {
  it("always scopes the upload below the authenticated user id", () => {
    expect(buildOwnedOrderPhotoPath(
      "11111111-1111-1111-1111-111111111111",
      "Jane Doe/portrait.jpg",
      1_700_000_000_000,
    )).toBe(
      "11111111-1111-1111-1111-111111111111/order-photos/1700000000000-Jane-Doe-portrait.jpg",
    );
  });
});
