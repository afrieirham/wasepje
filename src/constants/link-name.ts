export const LINK_NAME_MAX_LENGTH = 100;

// Same rule as the server's linkName schema: the trimmed name is capped
export const isLinkNameWithinLimit = (name: string) =>
  name.trim().length <= LINK_NAME_MAX_LENGTH;

// The server rejects a name that is empty once trimmed
export const isLinkNameFilled = (name: string) => name.trim().length > 0;

// Typing may not push a name over the limit, but any edit that shortens the
// raw value is allowed, so a stored over-limit name can be trimmed back down
export const canEditLinkName = (current: string, next: string) =>
  next.length <= current.length || isLinkNameWithinLimit(next);
