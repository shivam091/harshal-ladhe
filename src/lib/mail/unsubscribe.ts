import { createHmac, timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/config/site";

/*
  Unsubscribe links point at this site's /unsubscribe page, which is always up, unlike the admin app, whose emails
  link here too. Signed with a secret shared with the admin app, so either can make a link the other trusts, and so
  one subscriber's link can't be turned into another's. Must match NewsletterSubscriber.unsubscribe_signature in the
  admin app: the "unsubscribe:" prefix keeps the signature from being reused for anything else signed with the same
  secret.
*/
function unsubscribeSignature(subscriberId: string, secret: string): string {
  return createHmac("sha256", secret).update(`unsubscribe:${subscriberId}`).digest("hex");
}

export type UnsubscribeLinks = {
  // Asks before unsubscribing, so a mail scanner opening the link can't unsubscribe anyone.
  page: string;
  // Apart from the page, since one-click unsubscribe has no way to show a confirm step.
  oneClick: string;
};

// Null when the secret is missing, so the welcome still goes out, just without the link.
export function unsubscribeLinks(subscriberId: string): UnsubscribeLinks | null {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) return null;

  const token = `${subscriberId}.${unsubscribeSignature(subscriberId, secret)}`;
  return { page: `${siteConfig.url}/unsubscribe/${token}`, oneClick: `${siteConfig.url}/api/unsubscribe/${token}` };
}

// Null rather than throwing, as a bad token is a broken link to explain, not an error.
export function verifyUnsubscribeToken(token: string): string | null {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  const [subscriberId, signature] = token.split(".", 2);
  if (!secret || !subscriberId || !signature) return null;

  const expected = Buffer.from(unsubscribeSignature(subscriberId, secret));
  const given = Buffer.from(signature);
  // Constant time, so a signature can't be guessed a character at a time from how long the check takes.
  return given.length === expected.length && timingSafeEqual(given, expected) ? subscriberId : null;
}

// Gmail and Yahoo require one-click unsubscribe (RFC 8058) of bulk senders, and show their own unsubscribe button
// when it's offered.
export function unsubscribeHeaders(links: UnsubscribeLinks): Record<string, string> {
  return { "List-Unsubscribe": `<${links.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
}
