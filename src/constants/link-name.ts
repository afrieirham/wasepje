export const LINK_NAME_MAX_LENGTH = 100;

// Mirrors the server rule: the trimmed name is capped, but an edit that does not
// grow the raw value is always allowed so over-limit stored names can be shortened
export const canEditLinkName = (current: string, next: string) =>
  next.trim().length <= LINK_NAME_MAX_LENGTH || next.length <= current.length;
