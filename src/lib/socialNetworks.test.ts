import { describe, expect, it } from "vitest";

import { getMapUrl } from "./socialNetworks";

describe("socialNetworks", () => {
  it("uses HTTPS for Apple Maps URLs", () => {
    expect(getMapUrl("10 Downing St, London", "apple")).toBe(
      "https://maps.apple.com/?q=10%20Downing%20St%2C%20London",
    );
  });
});
