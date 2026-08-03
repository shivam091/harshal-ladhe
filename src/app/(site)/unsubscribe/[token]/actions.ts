"use server";

import { unsubscribe } from "@/lib/newsletter-subscribers";

export type UnsubscribeState =
  | { status: "unsubscribed"; email: string }
  | { status: "gone" }
  | { status: "error" }
  | null;

// Bound to the link's token, so the form posts nothing a visitor could change. The previous state useActionState
// passes along isn't needed: each attempt starts afresh.
export async function unsubscribeAction(token: string): Promise<UnsubscribeState> {
  try {
    const email = await unsubscribe(token);
    return email ? { status: "unsubscribed", email } : { status: "gone" };
  } catch (err) {
    console.error("Unsubscribe action error:", err);
    return { status: "error" };
  }
}
