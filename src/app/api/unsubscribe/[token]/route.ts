import type { NextRequest } from "next/server";
import { NextResponse, after } from "next/server";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";
import { getClientIp } from "@/lib/client-ip";
import { mixpanelReaderId, mixpanelVisitor, sendMixpanelEvent, setMixpanelProfile } from "@/lib/mixpanel-server";
import { verifyUnsubscribeToken } from "@/lib/mail/unsubscribe";
import { unsubscribe } from "@/lib/newsletter-subscribers";

type Context = { params: Promise<{ token: string }> };

/*
  A bare OK, as one-click unsubscribe (RFC 8058) comes from mail providers' servers with no page to show. An
  already-removed subscriber gets OK too, since the outcome asked for holds.
*/
export async function POST(req: NextRequest, { params }: Context) {
  const { token } = await params;

  try {
    if (!verifyUnsubscribeToken(token)) {
      return NextResponse.json({ error: "Invalid unsubscribe link." }, { status: 404 });
    }

    const email = await unsubscribe(token, "one_click");
    if (email) {
      const visitor = gaVisitor(req);
      const mixpanel = mixpanelVisitor(req, getClientIp(req));
      // Only from the reader's own browser: a mail provider's one-click request has no Mixpanel cookie, and a profile
      // mustn't be made for a reader who never let Mixpanel track them.
      const readerId = mixpanel ? mixpanelReaderId(email) : null;
      after(() => Promise.all([
        sendGaEvent(visitor, "newsletter_unsubscribe"),
        sendMixpanelEvent(mixpanel, "newsletter_unsubscribe", {}, readerId),
        setMixpanelProfile(mixpanel, readerId, { subscribed: false, unsubscribed_at: new Date().toISOString() })
      ]));
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unsubscribe route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// Mail apps without one-click support open the header's address in a browser instead, so send people to the page.
export async function GET(req: NextRequest, { params }: Context) {
  const { token } = await params;
  return NextResponse.redirect(new URL(`/unsubscribe/${token}`, req.url), 303);
}
