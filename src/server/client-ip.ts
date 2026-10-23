import type { IncomingMessage } from "node:http";
import { BlockList, isIP } from "node:net";

// Private and internal ranges. Railway's edge reaches the app over its
// internal network, so only peers in these ranges may set X-Real-IP; a public
// peer is a direct client and its header is ignored.
const trustedProxies = new BlockList();
trustedProxies.addSubnet("10.0.0.0", 8, "ipv4");
trustedProxies.addSubnet("172.16.0.0", 12, "ipv4");
trustedProxies.addSubnet("192.168.0.0", 16, "ipv4");
trustedProxies.addSubnet("100.64.0.0", 10, "ipv4");
trustedProxies.addSubnet("127.0.0.0", 8, "ipv4");
trustedProxies.addSubnet("fc00::", 7, "ipv6");
trustedProxies.addSubnet("fe80::", 10, "ipv6");
trustedProxies.addAddress("::1", "ipv6");

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

let warnedFallback = false;

/**
 * Railway's edge proxy sets X-Real-IP to the connecting client's address
 * (docs.railway.com/networking/public-networking/specs-and-limits). The header
 * is trusted only from a private-network peer, and only its last value is
 * used: if a proxy ever appends rather than overwrites, the last entry is the
 * one it added, not one the client sent.
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

    // Every request would share the proxy's address as one limiter bucket
    if (!warnedFallback) {
      warnedFallback = true;
      console.warn(
        "client-ip: X-Real-IP missing or invalid from proxy; rate limits are falling back to the proxy address",
      );
    }
  }

  return peer;
};
