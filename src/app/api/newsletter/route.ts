import type { NextRequest} from "next/server";
import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCountry } from "@/lib/visit-keys";
import { sendNewsletterWelcome } from "@/lib/mail/newsletter-mailer";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";
import { getClientIp } from "@/lib/client-ip";
import { mixpanelReaderId, mixpanelVisitor, sendMixpanelEvent, setMixpanelProfile } from "@/lib/mixpanel-server";

const COLLECTION = "newsletter_subscribers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors NewsletterSource; anything else is stored as null rather than trusted, since the body is client-supplied.
const SOURCES = new Set(["footer", "article_end", "article_inline"]);

// Same shape the page-view beacon accepts, so a stored sourcePage is always a plain app path.
const PAGE_PATTERN = /^\/[\w\-/]*$/;

function sanitiseSourcePage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.split(/[?#]/)[0];
  return path.length <= 256 && PAGE_PATTERN.test(path) ? path : null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, source, sourcePage } = await req.json() as { email: string; source?: unknown; sourcePage?: unknown };

    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection(COLLECTION).findOne({ email: trimmedEmail });

    if (existing) {
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 409 });
    }

    const subscriber = {
      email: trimmedEmail,
      country: await getCountry(req),
      subscribedAt: new Date(),
      source: typeof source === "string" && SOURCES.has(source) ? source : null,
      sourcePage: sanitiseSourcePage(sourcePage)
    };
    const { insertedId } = await db.collection(COLLECTION).insertOne(subscriber);

    // After the response, so the subscriber isn't kept waiting on Brevo.
    after(() => sendNewsletterWelcome(trimmedEmail, insertedId.toString()));
    // Sent from here, once the subscription is stored, so ad blockers can't hide it and a refused one isn't counted.
    const visitor = gaVisitor(req);
    const mixpanel = mixpanelVisitor(req, getClientIp(req));
    // Only for a reader Mixpanel already tracks, so the browser can carry on under the same id.
    const readerId = mixpanel ? mixpanelReaderId(trimmedEmail) : null;
    after(() => Promise.all([
      sendGaEvent(visitor, "newsletter_subscribe"),
      sendMixpanelEvent(mixpanel, "newsletter_subscribe", {}, readerId),
      setMixpanelProfile(mixpanel, readerId, {
        subscribed: true,
        subscribed_at: subscriber.subscribedAt.toISOString(),
        newsletter_source: subscriber.source ?? "(unknown)",
        source_page: subscriber.sourcePage ?? "(unknown)",
        ...(subscriber.country ? { country: subscriber.country } : {})
      })
    ]));

    return NextResponse.json(readerId ? { success: true, readerId } : { success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
