import { describe, expect, it } from "vitest";

import {
  canEditLinkName,
  isLinkNameWithinLimit,
  LINK_NAME_MAX_LENGTH,
} from "@/constants/link-name";

const name = (length: number) => "a".repeat(length);

describe("isLinkNameWithinLimit", () => {
  it("allows a name up to the server limit", () => {
    expect(LINK_NAME_MAX_LENGTH).toBe(100);
    expect(isLinkNameWithinLimit(name(100))).toBe(true);
  });

  it("rejects a name one character over the server limit", () => {
    expect(isLinkNameWithinLimit(name(101))).toBe(false);
  });

  it("does not count surrounding whitespace toward the limit", () => {
    expect(isLinkNameWithinLimit(`  ${name(100)}  `)).toBe(true);
  });
});

describe("canEditLinkName", () => {
  it("allows typing that keeps the name within the limit", () => {
    expect(canEditLinkName(name(99), name(100))).toBe(true);
  });

  it("rejects typing that pushes the name over the limit", () => {
    expect(canEditLinkName(name(100), name(101))).toBe(false);
  });

  it("allows shortening a stored name that is already over the limit", () => {
    expect(canEditLinkName(name(150), name(149))).toBe(true);
  });

  it("rejects growing a stored name that is already over the limit", () => {
    expect(canEditLinkName(name(150), name(151))).toBe(false);
  });
});
