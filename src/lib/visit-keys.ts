import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/client-ip";

// Day buckets follow the IST calendar so stats line up with the dashboard's local days, not UTC.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Header-derived keys land in a Mongo dot-path, where `.` and `$` would break or hijack the update.
export function safeKey(value: string): string {
  return value.replace(/[.$]/g, "_").slice(0, 64) || "unknown";
}

// ipinfo's Lite plan is free and unmetered, and its `country_code` matches the edge headers' ISO format.
const IPINFO_URL = "https://api.ipinfo.io/lite";

// A slow lookup must never hold up a beacon or form submit; "unknown" is an acceptable answer.
const IPINFO_TIMEOUT_MS = 1500;

// Same visitors hit several routes per page load, so one lookup per IP per warm instance is enough.
const IPINFO_CACHE_LIMIT = 1000;
const countryCache = new Map<string, string>();

// ipinfo knows nothing about local or private addresses, so asking would only waste a request.
const PRIVATE_IP_PATTERN = /^(unknown$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|f[cd]|fe80:)/i;

// Fallback for when no edge geo header is present (local dev, or a proxy that strips them).
async function lookupCountry(ip: string): Promise<string | undefined> {
  const token = process.env.IPINFO_TOKEN;
  if (!token || PRIVATE_IP_PATTERN.test(ip)) return undefined;

  const cached = countryCache.get(ip);
  if (cached) return cached;

  try {
    const res = await fetch(`${IPINFO_URL}/${encodeURIComponent(ip)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(IPINFO_TIMEOUT_MS),
      cache: "no-store"
    });
    if (!res.ok) return undefined;

    const { country_code: countryCode } = (await res.json()) as { country_code?: string };
    if (!countryCode) return undefined;

    if (countryCache.size >= IPINFO_CACHE_LIMIT) countryCache.clear();
    countryCache.set(ip, countryCode);
    return countryCode;
  } catch {
    return undefined;
  }
}

// Edge geo headers come first because they cost nothing; ipinfo only fills the gaps.
export async function getCountry(req: NextRequest): Promise<string> {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    (await lookupCountry(getClientIp(req))) ??
    "unknown";

  return safeKey(country.toUpperCase());
}

// Shifted to IST before slicing because toISOString() is UTC and would roll over at 05:30 IST instead of midnight.
export function getIstDay(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
