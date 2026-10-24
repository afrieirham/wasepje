import { describe, expect, it } from "vitest";

import { canEditLinkName, LINK_NAME_MAX_LENGTH } from "@/constants/link-name";

const name = (length: number) => "a".repeat(length);

describe("canEditLinkName", () => {
  it("allows a name up to the server limit", () => {
    expect(LINK_NAME_MAX_LENGTH).toBe(100);
    expect(canEditLinkName("", name(100))).toBe(true);
  });

  it("rejects a name one character over the server limit", () => {
    expect(canEditLinkName(name(100), name(101))).toBe(false);
  });

  it("does not count surrounding whitespace toward the limit", () => {
    const padded = `  ${name(100)}  `;

    expect(canEditLinkName(name(99), padded)).toBe(true);
  });

  it("allows deleting from a stored name that is already over the limit", () => {
    expect(canEditLinkName(name(150), name(149))).toBe(true);
  });

  it("rejects typing into a stored name that is already over the limit", () => {
    expect(canEditLinkName(name(150), `${name(150)} `)).toBe(false);
  });
});
