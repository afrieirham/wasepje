// In-memory fixed-window rate limiter. Railway runs a long-lived `next start`
// process, so this holds across requests; with multiple replicas the limit is
// per replica.

type Window = { count: number; resetAt: number };

const MAX_KEYS = 10_000;

export const createRateLimiter = ({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) => {
  const windows = new Map<string, Window>();

  // Returns true when the request is allowed
  return (key: string) => {
    const now = Date.now();

    // Keep the map bounded without ever wiping live windows wholesale:
    // drop expired windows first, then the oldest (Map keeps insertion order)
    if (windows.size >= MAX_KEYS) {
      for (const [k, w] of windows) {
        if (w.resetAt <= now) windows.delete(k);
      }
      for (const k of windows.keys()) {
        if (windows.size < MAX_KEYS * 0.9) break;
        windows.delete(k);
      }
    }

    const current = windows.get(key);
    if (!current || current.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    current.count += 1;
    return current.count <= limit;
  };
};
