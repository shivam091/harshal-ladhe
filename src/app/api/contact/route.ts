import type { NextRequest} from "next/server";
import { NextResponse, after } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCountry } from "@/lib/visit-keys";
import { getClientIp } from "@/lib/client-ip";
import { sendContactEmails } from "@/lib/mail/contact-mailer";
import { gaVisitor, sendGaEvent } from "@/lib/ga-measurement";
import { mixpanelVisitor, sendMixpanelEvent } from "@/lib/mixpanel-server";
import { isEntryPath } from "@/utils/correction";

// Stores the reCAPTCHA score alongside the message so borderline submissions can be reviewed later.
type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  // Path of the entry a correction was reported from; absent for ordinary messages.
  entry?: string;
  recaptchaScore: number;
  // reCAPTCHA Enterprise's name for the check ("projects/p/assessments/a"), so the admin can later tell Google
  // whether the message was genuine or spam. Absent when checked through siteverify, which keeps none.
  recaptchaAssessment?: string;
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

// Only the assessment fields needed to judge the token and to send feedback on it later.
interface RecaptchaAssessment {
  name: string;
  riskAnalysis?: { score?: number };
  tokenProperties?: { valid?: boolean; action?: string };
}

// One shape for both ways of checking, so the rest of the route doesn't care which ran.
type RecaptchaVerdict = { passed: boolean; score: number; assessment?: string };

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_ASSESSMENTS_URL = "https://recaptchaenterprise.googleapis.com/v1/projects/%PROJECT%/assessments";

// Must match the action ContactForm passes to executeRecaptcha, so a token minted on another page is refused.
const RECAPTCHA_ACTION = "contact_form";

// Submissions get their own collection so they never mix with analytics data.
const COLLECTION = "messages";

// Minimum score (0–1) to accept — 0.5 is Google's recommended threshold.
const MIN_SCORE = 0.5;

// Gates every write behind a server-side reCAPTCHA check so bots can't fill the database.
export async function POST(req: NextRequest) {
  try {
    const { name, email, message, entry, recaptchaToken } = await req.json() as {
      name: string;
      email: string;
      message: string;
      entry?: string | null;
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

    const verdict = await verifyRecaptcha(req, recaptchaToken);
    if (!verdict) {
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    if (!verdict.passed) {
      return NextResponse.json({ error: "reCAPTCHA verification failed." }, { status: 422 });
    }

    const submission: ContactSubmission = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      // Dropped rather than refused when malformed, so a tampered link never costs the visitor their message.
      ...(isEntryPath(entry) ? { entry } : {}),
      recaptchaScore: verdict.score,
      ...(verdict.assessment ? { recaptchaAssessment: verdict.assessment } : {}),
      country: await getCountry(req),
      createdAt: new Date()
    };

    const db = await getDb();
    await db.collection<ContactSubmission>(COLLECTION).insertOne(submission);

    // After the response, so the sender isn't kept waiting on Brevo.
    after(() => sendContactEmails(submission));
    // Sent from here, once the message is stored, so ad blockers can't hide it and a refused one isn't counted.
    const visitor = gaVisitor(req);
    const mixpanel = mixpanelVisitor(req, getClientIp(req));
    after(() => Promise.all([sendGaEvent(visitor, "contact_submit"), sendMixpanelEvent(mixpanel, "contact_submit")]));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// Through reCAPTCHA Enterprise once its project and API key are set, because only an Enterprise assessment has a
// name the admin can send feedback on; through siteverify until then. Null when neither is configured.
async function verifyRecaptcha(req: NextRequest, token: string): Promise<RecaptchaVerdict | null> {
  const project = process.env.RECAPTCHA_PROJECT_ID;
  const apiKey = process.env.RECAPTCHA_API_KEY;
  const siteKey = process.env.RECAPTCHA_SITE_KEY;

  if (project && apiKey && siteKey) {
    const url = `${RECAPTCHA_ASSESSMENTS_URL.replace("%PROJECT%", encodeURIComponent(project))}?key=${encodeURIComponent(apiKey)}`;
    const ip = getClientIp(req);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: RECAPTCHA_ACTION,
          userAgent: req.headers.get("user-agent") ?? undefined,
          userIpAddress: ip === "unknown" ? undefined : ip
        }
      })
    });

    if (!res.ok) {
      throw new Error(`reCAPTCHA assessment failed: ${res.status} ${await res.text()}`);
    }

    const assessment = await res.json() as RecaptchaAssessment;
    const score = assessment.riskAnalysis?.score ?? 0;
    const valid = assessment.tokenProperties?.valid === true && assessment.tokenProperties.action === RECAPTCHA_ACTION;
    return { passed: valid && score >= MIN_SCORE, score, assessment: assessment.name };
  }

  // Must run server-side — the secret key can never reach the client.
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return null;

  const verifyRes = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: secretKey, response: token })
  });
  const verifyData = await verifyRes.json() as RecaptchaResponse;
  return { passed: verifyData.success && verifyData.score >= MIN_SCORE, score: verifyData.score };
}
