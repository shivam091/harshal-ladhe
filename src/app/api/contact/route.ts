import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCountry } from "@/lib/visit-keys";

// Stores the reCAPTCHA score alongside the message so borderline submissions can be reviewed later.
type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  recaptchaScore: number;
  // Edge-reported country code, ipinfo lookup when the edge has none, or "unknown".
  country: string;
  createdAt: Date;
};

// Only the siteverify fields needed to judge whether a submission came from a human.
interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  "error-codes"?: string[];
}

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

// Submissions get their own collection so they never mix with analytics data.
const COLLECTION = "contacts";

// Minimum score (0–1) to accept — 0.5 is Google's recommended threshold.
const MIN_SCORE = 0.5;

// Gates every write behind a server-side reCAPTCHA check so bots can't fill the database.
export async function POST(req: NextRequest) {
  try {
    const { name, email, message, recaptchaToken } = await req.json() as {
      name: string;
      email: string;
      message: string;
      recaptchaToken: string;
    };

    if (!recaptchaToken) {
      return NextResponse.json({ error: "Missing reCAPTCHA token." }, { status: 400 });
    }

    // Validate before calling Google so malformed requests don't spend a verification round-trip.
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMessage = message?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    // Must run server-side — the secret key can never reach the client.
    const verifyRes = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: recaptchaToken })
    });

    const verifyData = await verifyRes.json() as RecaptchaResponse;

    if (!verifyData.success || verifyData.score < MIN_SCORE) {
      return NextResponse.json({ error: "reCAPTCHA verification failed." }, { status: 422 });
    }

    const submission: ContactSubmission = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      recaptchaScore: verifyData.score,
      country: await getCountry(req),
      createdAt: new Date()
    };

    const db = await getDb();
    await db.collection<ContactSubmission>(COLLECTION).insertOne(submission);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
