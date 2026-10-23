import type { IncomingMessage } from "node:http";
import { BlockList, isIP } from "node:net";

// Private network ranges. Railway's edge reaches the app over its internal
// network, so only peers in these ranges may set X-Real-IP; any other peer is
// a direct client and keyed on its own address. Loopback is deliberately not
// trusted, so local `next dev` keys on 127.0.0.1 instead of being rejected.
const trustedProxies = new BlockList();
trustedProxies.addSubnet("10.0.0.0", 8, "ipv4");
trustedProxies.addSubnet("172.16.0.0", 12, "ipv4");
trustedProxies.addSubnet("192.168.0.0", 16, "ipv4");
trustedProxies.addSubnet("100.64.0.0", 10, "ipv4");
trustedProxies.addSubnet("fc00::", 7, "ipv6");
trustedProxies.addSubnet("fe80::", 10, "ipv6");

// Sockets report IPv4 peers as IPv4-mapped IPv6 (::ffff:10.0.0.1)
const normalize = (address: string) =>
  address.startsWith("::ffff:") && isIP(address.slice(7)) === 4
    ? address.slice(7)
    : address;

const isTrustedProxy = (address: string) => {
  const version = isIP(address);
  if (version === 0) return false;
  return trustedProxies.check(address, version === 4 ? "ipv4" : "ipv6");
};

const MISSING_HEADER_LOG_INTERVAL_MS = 60_000;
let lastMissingHeaderLog = 0;

/**
 * Assumes Railway's edge always sets X-Real-IP to the connecting client's
 * address, overwriting any client value ("for identifying client's remote IP",
 * docs.railway.com/networking/public-networking/specs-and-limits). The header
 * is trusted only from a private-network peer, and only its last value is
 * used, in case a proxy appends rather than overwrites.
 *
 * Returns null when a proxy peer sends no usable header. That breaks the
 * assumption above, so callers reject the request: failing loudly instead of
 * skipping rate limits or putting every visitor in one bucket.
 */
export const getClientIp = (req: IncomingMessage) => {
  const peer = req.socket.remoteAddress
    ? normalize(req.socket.remoteAddress)
    : null;

  if (peer && isTrustedProxy(peer)) {
    const header = req.headers["x-real-ip"];
    const value = Array.isArray(header) ? header.join(",") : header;
    const candidate = value?.split(",").pop()?.trim();

    if (candidate && isIP(candidate)) return normalize(candidate);

    const now = Date.now();
    if (now - lastMissingHeaderLog >= MISSING_HEADER_LOG_INTERVAL_MS) {
      lastMissingHeaderLog = now;
      console.error(
        "client-ip: proxy sent no usable X-Real-IP; rejecting rate-limited requests",
      );
    }
    return null;
  }

  return peer;
};
