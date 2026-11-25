import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { mixpanelHost } from "@/lib/mixpanel-server";

/*
  Mixpanel's own hosts are on every filter list, so the SDK talks to this origin and the hits are passed on from
  here. MIXPANEL_API_HOST switches to the EU or India residency host for a project kept there.
*/
const UPSTREAM = `https://${mixpanelHost("api-js.mixpanel.com")}`;

// Only the endpoints the SDK uses, so the route can't be used as an open relay.
const ROUTES = new Set(["track", "engage", "groups", "record", "flags"]);

// The recorder compresses its batches and authenticates them with the project token, so both have to reach Mixpanel.
const FORWARDED_REQUEST_HEADERS = ["content-type", "content-encoding", "authorization"];

const FORWARDED_RESPONSE_HEADERS = ["content-type"];

/*
  The reader's address goes upstream explicitly, since Mixpanel would otherwise place every reader where this
  server runs. No cookies are forwarded: the SDK's own one lives on this origin and its id travels in the payload.
*/
async function forward(req: NextRequest, path: string[]): Promise<NextResponse> {
  if (path.length !== 1 || !ROUTES.has(path[0])) return new NextResponse(null, { status: 404 });

  const url = new URL(`${UPSTREAM}/${path[0]}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));

  const ip = getClientIp(req);
  const headers: Record<string, string> = { "user-agent": req.headers.get("user-agent") ?? "" };
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers[name] = value;
  }
  if (ip !== "unknown") headers["x-forwarded-for"] = ip;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: req.method === "POST" ? await req.arrayBuffer() : undefined,
      cache: "no-store"
    });

    const responseHeaders = new Headers();
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = res.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new NextResponse(res.status === 204 ? null : await res.arrayBuffer(), { status: res.status, headers: responseHeaders });
  } catch {
    // A failed hit is a lost count, never an error for the reader.
    return new NextResponse(null, { status: 204 });
  }
}

// Needed because the feature-flag check and the image-style fallback arrive as GETs.
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}

// Needed because batched events and replay chunks are POSTs that carry them in the body.
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await params).path);
}
