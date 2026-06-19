import type { Email } from "./brevo";
import { mailConfigured, sendEmail } from "./brevo";

/*
  Every email goes through here, so each one leaves a line in the logs saying
  who it went to or why it didn't. Prefixed "[mailer]" so they can be found in
  Vercel's log search. Never throws: a failed email must not fail the form
  that triggered it, since the submission is already saved.
*/
export async function deliverWithLogging(trigger: string, build: () => Email): Promise<void> {
  if (!mailConfigured()) {
    console.warn(`[mailer] [${trigger}] Skipped: BREVO_API_KEY or MAIL_FROM_EMAIL not set`);
    return;
  }

  try {
    const email = build();
    await sendEmail(email);
    console.info(`[mailer] [${trigger}] Delivered to ${email.to.map((recipient) => recipient.email).join(", ")}`);
  } catch (err) {
    console.error(`[mailer] [${trigger}] Failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
