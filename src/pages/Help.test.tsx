import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Help from "./Help";

describe("Help", () => {
  it("provides a usable public support destination for App Store review", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Help />
      </MemoryRouter>,
    ).toLowerCase();

    expect(html).toContain("aide &amp; faq");
    expect(html).toContain("mailto:support@i-wasp.com");
    expect(html).toContain("https://wa.me/33626424394");
    expect(html).toContain("besoin d&#x27;aide supplémentaire");
  });
});
