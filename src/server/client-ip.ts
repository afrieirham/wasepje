import type { IncomingMessage } from "node:http";
import { isIP } from "node:net";

/**
 * Railway's edge proxy sets X-Real-IP to the connecting client's address
 * (docs.railway.com/networking/public-networking/specs-and-limits). Only the
 * first value is used, and only if it parses as an IP; otherwise fall back to
 * the socket address so a junk header can't become an arbitrary limiter key.
 */
export const getClientIp = (req: IncomingMessage) => {
  const header = req.headers["x-real-ip"];
  const raw = (Array.isArray(header) ? header[0] : header)?.split(",")[0];
  const candidate = raw?.trim();

  if (candidate && isIP(candidate)) return candidate;
  return req.socket.remoteAddress ?? null;
};
