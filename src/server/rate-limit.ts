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

    // Drop expired windows so the map can't grow without bound
    if (windows.size >= MAX_KEYS) {
      for (const [k, w] of windows) {
        if (w.resetAt <= now) windows.delete(k);
      }
      if (windows.size >= MAX_KEYS) windows.clear();
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
