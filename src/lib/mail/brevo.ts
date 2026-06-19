// Brevo's transactional API over plain fetch, so sending mail needs no SDK.
// https://developers.brevo.com/reference/sendtransacemail

const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

export type Recipient = { email: string; name?: string };

export type Email = {
  to: Recipient[];
  subject: string;
  html: string;
  text: string;
  replyTo?: Recipient;
  headers?: Record<string, string>;
};

export function mailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.MAIL_FROM_EMAIL);
}

// Throws on any non-2xx, so the caller's logging records Brevo's own reason.
export async function sendEmail(email: Email): Promise<void> {
  const res = await fetch(BREVO_SEND_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      sender: { email: process.env.MAIL_FROM_EMAIL, name: process.env.MAIL_FROM_NAME || undefined },
      to: email.to,
      subject: email.subject,
      htmlContent: email.html,
      textContent: email.text,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
      ...(email.headers ? { headers: email.headers } : {})
    })
  });

  if (!res.ok) {
    throw new Error(`Brevo ${res.status}: ${await res.text()}`);
  }
}
