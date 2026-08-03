import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { GA_PROXY_ENABLED, GA_PROXY_UPSTREAMS } from "@/lib/ga-proxy";

// Passed through so the browser can tell a script from a beacon reply; everything else upstream sets is dropped.
const FORWARDED_RESPONSE_HEADERS = ["content-type"];

// Fresh enough for a changed gtag.js to arrive within the hour, while sparing Google a request per reader.
const SCRIPT_CACHE = "public, max-age=3600, stale-while-revalidate=86400";

// Nothing off the allow-list is forwarded, nor anything with the proxy off, so the route can't be an open relay.
function upstreamFor(path: string[]): string | null {
  if (!GA_PROXY_ENABLED) return null;
  return GA_PROXY_UPSTREAMS[path.join("/")] ?? null;
}

/*
  The reader's address and browser go upstream explicitly, since Google would otherwise see only this server and file
  every hit under its location. No cookies are forwarded: GA's own ones live on this origin and are carried in the
  query, and consent signals travel in the hit's parameters exactly as they would without the proxy.
*/
async function forward(req: NextRequest, path: string[]): Promise<NextResponse> {
  const upstream = upstreamFor(path);
  if (!upstream) return new NextResponse(null, { status: 404 });

  const ip = getClientIp(req);
  const url = new URL(upstream);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));
  if (path[0] === "g" && ip !== "unknown") url.searchParams.set("_uip", ip);

  try {
    const res = await fetch(url, {
      method: req.method,
      headers: {
        "user-agent": req.headers.get("user-agent") ?? "",
        "accept-language": req.headers.get("accept-language") ?? "",
        ...(ip !== "unknown" ? { "x-forwarded-for": ip } : {}),
        ...(req.headers.get("content-type") ? { "content-type": req.headers.get("content-type") as string } : {})
      },
      body: req.method === "POST" ? await req.arrayBuffer() : undefined,
      cache: "no-store"
    });

    const headers = new Headers();
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = res.headers.get(name);
      if (value) headers.set(name, value);
    }
    if (path[0] === "s.js") headers.set("cache-control", SCRIPT_CACHE);
    return new NextResponse(res.status === 204 ? null : await res.arrayBuffer(), { status: res.status, headers });
  } catch {
    // A failed hit is a lost count, never an error for the reader.
    return new NextResponse(null, { status: 204 });
  }
}

// Needed because gtag.js itself and gtag's image-style fallback hits arrive as GETs.
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}

// Needed because the usual collect hit is a POST that carries the hit in its body.
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}
