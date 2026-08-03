"use server";

import { after } from "next/server";
import { cookies } from "next/headers";
import { unsubscribe } from "@/lib/newsletter-subscribers";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";

export type UnsubscribeState =
  | { status: "unsubscribed"; email: string }
  | { status: "gone" }
  | { status: "error" }
  | null;

// Bound to the link's token, so the form posts nothing a visitor could change. The previous state useActionState
// passes along isn't needed: each attempt starts afresh.
export async function unsubscribeAction(token: string): Promise<UnsubscribeState> {
  try {
    const email = await unsubscribe(token, "link");
    if (!email) return { status: "gone" };

    // Sent only once the removal is stored, as with newsletter_subscribe, so a failed attempt isn't counted.
    const visitor = gaVisitor({ cookies: await cookies() });
    after(() => sendGaEvent(visitor, "newsletter_unsubscribe"));
    return { status: "unsubscribed", email };
  } catch (err) {
    console.error("Unsubscribe action error:", err);
    return { status: "error" };
  }
}
