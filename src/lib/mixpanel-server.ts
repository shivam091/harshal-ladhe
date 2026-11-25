import { createHmac, randomUUID } from "crypto";
import type { NextRequest } from "next/server";

// A host written as a URL ("https://api-in.mixpanel.com/") is taken as its host, since both forms get pasted in.
export function mixpanelHost(fallback: string): string {
  return (process.env.MIXPANEL_API_HOST || fallback).trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

const API_HOST = `https://${mixpanelHost("api.mixpanel.com")}`;

// Who an event belongs to, read before the response so it can be sent from after().
export type MixpanelVisitor = {
  distinctId: string;
  deviceId?: string;
  ip?: string;
};

function token(): string | undefined {
  return process.env.MIXPANEL_TOKEN || undefined;
}

function live(): boolean {
  return Boolean(token()) && process.env.VERCEL_ENV === "production";
}

/*
  The reader's own ids from the SDK's cookie, so the conversion joins their visit and funnels. Null when there's no
  cookie: that reader hasn't let Mixpanel track them (or blocked it), and a server event mustn't track them anyway.
*/
export function mixpanelVisitor(req: { cookies: Pick<NextRequest["cookies"], "get"> }, ip?: string): MixpanelVisitor | null {
  const value = token();
  if (!value) return null;

  const cookie = req.cookies.get(`mp_${value}_mixpanel`)?.value;
  if (!cookie) return null;
  try {
    const data = JSON.parse(decodeURIComponent(cookie)) as { distinct_id?: unknown; $device_id?: unknown };
    if (typeof data.distinct_id !== "string" || !data.distinct_id) return null;
    return {
      distinctId: data.distinct_id,
      deviceId: typeof data.$device_id === "string" ? data.$device_id : undefined,
      ip: ip && ip !== "unknown" ? ip : undefined
    };
  } catch {
    return null;
  }
}

/*
  A subscriber's id in Mixpanel: keyed with the visitor secret, so it can't be reversed or rebuilt from a list of
  emails, yet stays the same each time they subscribe. Null without the secret, and then nobody is identified.
*/
export function mixpanelReaderId(email: string): string | null {
  const secret = process.env.VISITOR_HASH_SECRET;
  if (!secret) return null;
  return `reader_${createHmac("sha256", secret).update(`mixpanel-reader:${email.trim().toLowerCase()}`).digest("hex").slice(0, 32)}`;
}

async function post(path: string, body: unknown, label: string): Promise<void> {
  try {
    const res = await fetch(`${API_HOST}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error(`[mixpanel] [${label}] Failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/*
  Never throws, so a failed event can't fail the form that triggered it. Only from Vercel production, as with the
  browser SDK. With a userId, the event carries both ids, which is what joins the reader's device to their profile.
*/
export async function sendMixpanelEvent(
  visitor: MixpanelVisitor | null,
  name: string,
  properties: Record<string, string | number> = {},
  userId: string | null = null
): Promise<void> {
  if (!visitor || !live()) return;

  await post("/track?ip=0&strict=1", [
    {
      event: name,
      properties: {
        ...properties,
        token: token(),
        distinct_id: userId ?? visitor.distinctId,
        ...(userId ? { $user_id: userId } : {}),
        ...(visitor.deviceId ? { $device_id: visitor.deviceId } : {}),
        time: Date.now(),
        // Lets Mixpanel drop the copy if a retry sends it twice.
        $insert_id: randomUUID(),
        // Placed by the reader's address rather than this server's.
        ...(visitor.ip ? { ip: visitor.ip } : {}),
        source: "server"
      }
    }
  ], name);
}

// Only for a reader the SDK already tracks (visitor is non-null), so no profile is made for anyone who declined.
export async function setMixpanelProfile(visitor: MixpanelVisitor | null, userId: string | null, set: Record<string, string | boolean>): Promise<void> {
  if (!visitor || !userId || !live()) return;

  await post("/engage?strict=1", [
    { $token: token(), $distinct_id: userId, ...(visitor.ip ? { $ip: visitor.ip } : { $ip: "0" }), $set: set }
  ], "profile");
}
