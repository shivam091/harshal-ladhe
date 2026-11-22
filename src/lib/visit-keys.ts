import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/client-ip";

// Day buckets follow the IST calendar so stats line up with the dashboard's local days, not UTC.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Deliberately rough — enough to keep common crawlers and link previewers out of the human metrics.
export const BOT_PATTERN = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|preview|monitor|lighthouse|headless/i;

// Header-derived keys land in a Mongo dot-path, where `.` and `$` would break or hijack the update.
export function safeKey(value: string, max = 64): string {
  return value.replace(/[.$]/g, "_").slice(0, max) || "unknown";
}

// ipinfo's Lite plan is free and unmetered, and its `country_code` matches the edge headers' ISO format.
const IPINFO_URL = "https://api.ipinfo.io/lite";

// A slow lookup must never hold up a beacon or form submit; "unknown" is an acceptable answer.
const IPINFO_TIMEOUT_MS = 1500;

// Same visitors hit several routes per page load, so one lookup per IP per warm instance is enough.
const IPINFO_CACHE_LIMIT = 1000;

// What ipinfo knows about an address that the blog uses: where it is and which network it belongs to.
type IpInfo = { country?: string; asn?: string };

const ipInfoCache = new Map<string, IpInfo>();

// ipinfo knows nothing about local or private addresses, so asking would only waste a request.
const PRIVATE_IP_PATTERN = /^(unknown$|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|::1$|f[cd]|fe80:)/i;

/*
  Cloud and hosting networks that real readers almost never browse from, so a view from one is likely a script or
  scraper. Deliberately short: networks that also carry consumers (Cloudflare WARP, Apple's relay, mobile carriers)
  are left out, and a flagged view is only tallied, never dropped. Amazon (16509, 14618), Google Cloud (396982, 15169),
  Microsoft Azure (8075), DigitalOcean, OVH, Hetzner, Linode/Akamai Connected Cloud, Vultr, Oracle Cloud, Alibaba
  Cloud and Tencent Cloud.
*/
const DATACENTRE_ASNS = new Set([
  "AS16509", "AS14618", "AS396982", "AS15169", "AS8075", "AS14061", "AS16276", "AS24940", "AS63949", "AS20473",
  "AS31898", "AS45102", "AS37963", "AS132203"
]);

// A single cached lookup serves both the country fallback and the network check; undefined means ipinfo couldn't say.
async function lookupIp(ip: string): Promise<IpInfo | undefined> {
  const token = process.env.IPINFO_TOKEN;
  if (!token || PRIVATE_IP_PATTERN.test(ip)) return undefined;

  const cached = ipInfoCache.get(ip);
  if (cached) return cached;

  try {
    const res = await fetch(`${IPINFO_URL}/${encodeURIComponent(ip)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(IPINFO_TIMEOUT_MS),
      cache: "no-store"
    });
    if (!res.ok) return undefined;

    const { country_code: country, asn } = (await res.json()) as { country_code?: string; asn?: string };
    const info: IpInfo = { country, asn };

    if (ipInfoCache.size >= IPINFO_CACHE_LIMIT) ipInfoCache.clear();
    ipInfoCache.set(ip, info);
    return info;
  } catch {
    return undefined;
  }
}

// Only a hit on the short list counts; an unknown network is given the benefit of the doubt.
export async function isDatacentreIp(ip: string): Promise<boolean> {
  const info = await lookupIp(ip);
  return info?.asn !== undefined && DATACENTRE_ASNS.has(info.asn.toUpperCase());
}

// What getCountry answers when nothing could place the reader, so callers can tell "unknown" from a real country.
export const UNKNOWN_COUNTRY = "UNKNOWN";

// Edge geo headers come first because they cost nothing; ipinfo only fills the gaps.
export async function getCountry(req: NextRequest): Promise<string> {
  const country =
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("cf-ipcountry") ??
    (await lookupIp(getClientIp(req)))?.country ??
    "unknown";

  return safeKey(country.toUpperCase());
}

// Shifted to IST before slicing because toISOString() is UTC and would roll over at 05:30 IST instead of midnight.
export function getIstDay(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}
