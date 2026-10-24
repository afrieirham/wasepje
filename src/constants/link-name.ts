export const LINK_NAME_MAX_LENGTH = 100;

// Same rule as the server's linkName schema: the trimmed name is capped
export const isLinkNameWithinLimit = (name: string) =>
  name.trim().length <= LINK_NAME_MAX_LENGTH;
