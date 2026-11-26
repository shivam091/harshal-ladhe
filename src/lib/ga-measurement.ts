import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

// GA4's Measurement Protocol, so a conversion the server confirms is counted even when the browser blocks gtag.
const COLLECT_URL = "https://www.google-analytics.com/mp/collect";

// gtag's session cookie is named after the measurement ID without its "G-".
const SESSION_COOKIE = `_ga_${siteConfig.analytics.googleMeasurementId.replace(/^G-/, "")}`;

// Who an event belongs to, read before the response so it can be sent from after().
export type GaVisitor = {
  clientId: string;
  sessionId?: string;
};

/*
  The reader's own client ID from gtag's "_ga" cookie ("GA1.1.<random>.<first visit>"), so the event joins their
  visit and funnels. Null without the cookie: the reader declined analytics or blocked gtag, and a made-up ID would
  both track someone who said no and add a user to GA who never viewed a page.
*/
export function gaVisitor(req: { cookies: Pick<NextRequest["cookies"], "get"> }): GaVisitor | null {
  const parts = (req.cookies.get("_ga")?.value ?? "").split(".");
  if (parts.length < 4) return null;

  return { clientId: parts.slice(-2).join("."), sessionId: sessionIdFrom(req.cookies.get(SESSION_COOKIE)?.value) };
}

/*
  Both cookie formats gtag has written: "GS1.1.<session>.<count>..." and "GS2.1.s<session>$o<count>...". Without it
  the event still counts, just outside the reader's session in session-scoped reports.
*/
function sessionIdFrom(cookie: string | undefined): string | undefined {
  if (!cookie) return undefined;

  if (cookie.startsWith("GS2.")) {
    const segment = cookie.split(".")[2]?.split("$").find((part) => part.startsWith("s"));
    return segment?.slice(1) || undefined;
  }
  return cookie.split(".")[2] || undefined;
}

/*
  Never throws, so a failed event can't fail the form that triggered it. Only from Vercel production, as with gtag,
  so preview and local submissions stay out of the real figures.
*/
export async function sendGaEvent(visitor: GaVisitor | null, name: string, params: Record<string, string | number> = {}): Promise<void> {
  if (!visitor) return;
  const secret = process.env.GA_API_SECRET;
  if (process.env.VERCEL_ENV !== "production" || !secret) {
    console.info(`[ga] [${name}] Skipped: ${secret ? "not production" : "GA_API_SECRET not set"}`);
    return;
  }

  const url = `${COLLECT_URL}?measurement_id=${encodeURIComponent(siteConfig.analytics.googleMeasurementId)}&api_secret=${encodeURIComponent(secret)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        client_id: visitor.clientId,
        // GA leaves an event without engagement time out of its user counts.
        events: [{ name, params: { ...params, engagement_time_msec: 1, ...(visitor.sessionId ? { session_id: visitor.sessionId } : {}) } }]
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error(`[ga] [${name}] Failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
