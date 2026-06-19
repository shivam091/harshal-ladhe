import type { NextRequest } from "next/server";
import { createHash, createHmac } from "crypto";

// Strips IPv4-mapped IPv6 notation so one real address hashes the same whichever form the proxy presents.
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const raw = forwarded ? forwarded.split(",")[0].trim() : (req.headers.get("x-real-ip") ?? "unknown");
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

// Hashes the IP so we never persist a raw address in dedup markers.
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/*
  Keyed rather than plain, because view markers are kept indefinitely and a
  plain hash of an IPv4 address can be reversed by hashing every address. Kept
  apart from hashIp so like markers, which never expire, still match.
*/
export function hashVisitor(ip: string): string {
  const secret = process.env.VISITOR_HASH_SECRET;
  // Falls back so local dev without the secret still counts visitors.
  if (!secret) return hashIp(ip);
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}
