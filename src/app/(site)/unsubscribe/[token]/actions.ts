"use server";

import { after } from "next/server";
import { cookies } from "next/headers";
import { unsubscribe } from "@/lib/newsletter-subscribers";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";
import { mixpanelReaderId, mixpanelVisitor, sendMixpanelEvent, setMixpanelProfile } from "@/lib/mixpanel-server";

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
    const cookieStore = await cookies();
    const visitor = gaVisitor({ cookies: cookieStore });
    const mixpanel = mixpanelVisitor({ cookies: cookieStore });
    // Only from the reader's own browser: a mail provider's one-click request has no Mixpanel cookie, and a profile
    // mustn't be made for a reader who never let Mixpanel track them.
    const readerId = mixpanel ? mixpanelReaderId(email) : null;
    after(() => Promise.all([
      sendGaEvent(visitor, "newsletter_unsubscribe"),
      sendMixpanelEvent(mixpanel, "newsletter_unsubscribe", {}, readerId),
      setMixpanelProfile(mixpanel, readerId, { subscribed: false, unsubscribed_at: new Date().toISOString() })
    ]));
    return { status: "unsubscribed", email };
  } catch (err) {
    console.error("Unsubscribe action error:", err);
    return { status: "error" };
  }
}
