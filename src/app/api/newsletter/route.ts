import type { NextRequest} from "next/server";
import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCountry } from "@/lib/visit-keys";
import { sendNewsletterWelcome } from "@/lib/mail/newsletter-mailer";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";

const COLLECTION = "newsletter_subscribers";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };

    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection(COLLECTION).findOne({ email: trimmedEmail });

    if (existing) {
      return NextResponse.json({ error: "You're already subscribed!" }, { status: 409 });
    }

    const { insertedId } = await db.collection(COLLECTION).insertOne({
      email: trimmedEmail,
      country: await getCountry(req),
      subscribedAt: new Date()
    });

    // After the response, so the subscriber isn't kept waiting on Brevo.
    after(() => sendNewsletterWelcome(trimmedEmail, insertedId.toString()));
    // Sent from here, once the subscription is stored, so ad blockers can't hide it and a refused one isn't counted.
    const visitor = gaVisitor(req);
    after(() => sendGaEvent(visitor, "newsletter_subscribe"));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
