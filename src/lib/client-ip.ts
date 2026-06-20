import { NextRequest } from "next/server";
import { createHash } from "crypto";

/*
  Extracts the originating client IP from the proxy headers, falling back to
  "unknown". Normalizes IPv4-mapped IPv6 notation (::ffff:1.2.3.4) down to the
  plain IPv4 form, so the same real address hashes identically regardless of
  which notation a given proxy/runtime presents it in.
*/
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const raw = forwarded ? forwarded.split(",")[0].trim() : (req.headers.get("x-real-ip") ?? "unknown");
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

// Hashes the IP so we never persist a raw address in dedup markers.
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}
