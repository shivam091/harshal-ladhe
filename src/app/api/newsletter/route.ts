import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

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

    await db.collection(COLLECTION).insertOne({
      email: trimmedEmail,
      subscribedAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
