import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import PrivacyPolicy from "./PrivacyPolicy";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router-dom")>()),
  useNavigate: () => vi.fn(),
}));

describe("PrivacyPolicy", () => {
  it("publishes the verified providers, data uses, retention, and .com contact routes", () => {
    const html = renderToStaticMarkup(<PrivacyPolicy />);

    const normalizedHtml = html.toLowerCase();

    for (const expected of [
      "https://www.i-wasp.com",
      "https://www.i-wasp.com/contact",
      "supabase",
      "stripe",
      "ipapi",
      "nominatim",
      "openstreetmap",
      "notifications push",
      "messagerie",
      "chat",
      "profils publics",
      "statistiques",
      "conservation",
    ]) {
      expect(normalizedHtml).toContain(expected);
    }

    expect(normalizedHtml).not.toContain("i-wasp.ma");
  });
});
