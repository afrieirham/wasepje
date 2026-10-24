import { describe, expect, it } from "vitest";

import {
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

  it("rejects a name over the limit even when it shortens a stored name", () => {
    expect(isLinkNameWithinLimit(name(149))).toBe(false);
  });
});
