import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { ContactSubmission, RecaptchaResponse } from "@/types/contact";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

// MongoDB collection that stores contact form submissions.
const COLLECTION = "contacts";

// Minimum score (0–1) to accept — 0.5 is Google's recommended threshold.
const MIN_SCORE = 0.5;

// POST /api/contact — verifies reCAPTCHA token then processes the contact submission.
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

    // Trim and validate the submitted fields before doing any further work.
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

    // Verify the token with Google's API using the server-side secret key.
    const verifyRes = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: recaptchaToken })
    });

    const verifyData = await verifyRes.json() as RecaptchaResponse;

    if (!verifyData.success || verifyData.score < MIN_SCORE) {
      return NextResponse.json({ error: "reCAPTCHA verification failed." }, { status: 422 });
    }

    // Persist the submission to MongoDB.
    const submission: ContactSubmission = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      recaptchaScore: verifyData.score,
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
