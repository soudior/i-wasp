import { describe, expect, it } from "vitest";
import {
  EMPTY_IDENTITY,
  identityErrors,
  normalizeIdentity,
  orderProfileFields,
  publicHttpUrl,
} from "./orderIdentity";
const profile = {
  ...EMPTY_IDENTITY,
  firstName: "  Élodie ",
  lastName: " Test ",
  profileVisibilityConfirmed: true,
};
describe("public identity contract", () => {
  it("requires real non-blank names without forcing public contacts or a photo", () => {
    expect(identityErrors(profile)).toEqual({});
    expect(identityErrors({ ...profile, firstName: "   " })).toHaveProperty(
      "firstName"
    );
  });
  it("requires explicit visibility confirmation at the persistence boundary", () => {
    expect(() =>
      orderProfileFields(
        { ...profile, profileVisibilityConfirmed: false },
        "signature"
      )
    ).toThrow();
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,hello",
    "https://user:password@example.com",
    "ftp://example.com",
  ])("rejects unsafe link %s", (url) =>
    expect(identityErrors({ ...profile, website: url })).toHaveProperty(
      "website"
    )
  );
  it("preserves path case and supports domain-only URLs", () => {
    expect(publicHttpUrl("example.com/MyPage?Token=ABC")).toBe(
      "https://example.com/MyPage?Token=ABC"
    );
  });
  it("validates supplied optional data and leaves blanks valid", () => {
    expect(
      identityErrors({
        ...profile,
        email: "bad",
        phone: "123",
        linkedin: "https://other.invalid",
        instagram: "https://instagram.com/name",
      })
    ).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        phone: expect.any(String),
        linkedin: expect.any(String),
        instagram: expect.any(String),
      })
    );
  });
  it("normalizes without inventing a country code", () => {
    expect(
      normalizeIdentity({
        ...profile,
        phone: "06 12 34 56 78",
        email: " TEST@EXAMPLE.INVALID ",
        instagram: "@test",
      })
    ).toMatchObject({
      firstName: "Élodie",
      lastName: "Test",
      phone: "0612345678",
      email: "test@example.invalid",
      instagram: "test",
    });
  });
  it("maps photo, tagline and selected template, and clears absent public contacts", () => {
    expect(
      orderProfileFields(
        {
          ...profile,
          photoUrl: "https://example.invalid/photo.jpg",
          tagline: " Phrase ",
        },
        "executive"
      )
    ).toMatchObject({
      photo_url: "https://example.invalid/photo.jpg",
      tagline: "Phrase",
      template: "executive",
      email: null,
      phone: null,
    });
  });
  it.each([undefined, false, "true"])('never treats absent or non-boolean confirmation (%s) as consent', value => {
    expect(() => orderProfileFields({ ...profile, profileVisibilityConfirmed: value as boolean }, "signature")).toThrow();
  });
  it("persists the selected template without imposing a new visual palette", () => {
    const fields = orderProfileFields(profile, "executive");
    expect(fields.template).toBe("executive");
    expect(fields).not.toHaveProperty("custom_styles");
  });
  it("does not restore a deliberately cleared tagline from legacy bio", () =>
    expect(
      orderProfileFields({ ...profile, tagline: "", bio: "Old" }, null).tagline
    ).toBeNull());
  it("rejects malformed public data again before insertion", () =>
    expect(() =>
      orderProfileFields({ ...profile, email: "bad" }, null)
    ).toThrow());
});
