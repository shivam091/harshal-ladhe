import { siteConfig } from "@/config/site";
import { deliverWithLogging } from "./deliver";
import { COLORS, button, escapeHtml, features, heading, layout, lead, quote, sectionLabel, signature, siteLink, textLayout } from "./layout";

export type ContactEmailDetails = {
  name: string;
  email: string;
  message: string;
  entry?: string;
  recaptchaScore: number;
  country: string;
  createdAt: Date;
};

// The form turns away anything under 0.5, so a stored score only tells likely-human from borderline.
const LIKELY_HUMAN_SCORE = 0.7;

function firstName(name: string): string {
  return name.split(/\s+/)[0] || "there";
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join("") || "?";
}

function quoteText(message: string): string {
  return message.split("\n").map((line) => `> ${line}`).join("\n");
}

// Flag and name rather than the bare code, so where a message came from reads at a glance.
function countryLabel(code: string): string {
  if (!/^[a-z]{2}$/i.test(code)) return "🌐 Unknown";

  const upper = code.toUpperCase();
  const flag = String.fromCodePoint(...[...upper].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));
  let name = upper;
  try {
    name = new Intl.DisplayNames(["en"], { type: "region" }).of(upper) ?? upper;
  } catch {
    // Better the bare code than no country at all.
  }
  return `${flag} ${name}`;
}

function chip(text: string, { background = COLORS.panel, color = COLORS.body, border = COLORS.border } = {}): string {
  return `<span style="display:inline-block;margin:0 6px 8px 0;padding:6px 12px;border:1px solid ${border};border-radius:999px;background:${background};color:${color};font-size:13px;font-weight:600;white-space:nowrap;">${escapeHtml(text)}</span>`;
}

// Both at once, so the slower one doesn't hold up the other.
export async function sendContactEmails(contact: ContactEmailDetails): Promise<void> {
  await Promise.all([sendContactReceived(contact), sendContactThanks(contact)]);
}

// Reply-To is the sender, so a reply from the inbox answers them directly.
function sendContactReceived(contact: ContactEmailDetails): Promise<void> {
  return deliverWithLogging("message_received", () => {
    const sent = contact.createdAt.toLocaleString("en-IN", { timeZone: siteConfig.timezone, dateStyle: "medium", timeStyle: "short" });
    const human = contact.recaptchaScore >= LIKELY_HUMAN_SCORE;
    const scoreChip = human
      ? chip(`✓ reCAPTCHA ${contact.recaptchaScore.toFixed(1)} · likely human`, { background: "#ecfdf5", color: "#047857", border: "#a7f3d0" })
      : chip(`⚠ reCAPTCHA ${contact.recaptchaScore.toFixed(1)} · borderline`, { background: "#fffbeb", color: "#b45309", border: "#fde68a" });
    const replyUrl = `mailto:${contact.email}?subject=${encodeURIComponent("Re: your message")}`;
    // Corrections get their own subject so they can be filtered and fixed ahead of general mail.
    const entryUrl = contact.entry ? `${siteConfig.url}${contact.entry}` : null;
    const subject = entryUrl ? `Correction for ${contact.entry} from ${contact.name}` : `New message from ${contact.name}`;

    return {
      to: [{ email: process.env.MAIL_ADMIN_EMAIL || siteConfig.author.email, name: siteConfig.author.name }],
      replyTo: { email: contact.email, name: contact.name },
      subject,
      html: layout({
        title: subject,
        preheader: `${contact.name} wrote: ${contact.message.slice(0, 90)}`,
        hero: entryUrl ? "🛠️ Correction suggested for an entry" : "📬 New message from the contact form",
        body: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
            <tr>
              <td width="64" style="vertical-align:middle;">
                <div style="width:52px;height:52px;line-height:52px;border-radius:50%;background:${COLORS.accent};background-image:linear-gradient(135deg,${COLORS.accent} 0%,${COLORS.accentDeep} 100%);color:#ffffff;text-align:center;font-size:18px;font-weight:800;">${escapeHtml(initials(contact.name))}</div>
              </td>
              <td style="vertical-align:middle;">
                <p class="mail-h1" style="margin:0;font-size:22px;line-height:1.3;font-weight:800;color:${COLORS.heading};">${escapeHtml(contact.name)}</p>
                <a href="mailto:${escapeHtml(contact.email)}" style="font-size:15px;color:${COLORS.accent};text-decoration:none;word-break:break-all;">${escapeHtml(contact.email)}</a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 20px;">${chip(`🕒 ${sent}`)}${chip(countryLabel(contact.country))}${scoreChip}</p>
          ${entryUrl ? `<p style="margin:0 0 20px;font-size:14px;">Reported on <a href="${escapeHtml(entryUrl)}" style="color:${COLORS.accent};word-break:break-all;">${escapeHtml(contact.entry!)}</a></p>` : ""}
          ${quote(contact.message)}
          ${button(replyUrl, `Reply to ${firstName(contact.name)} →`)}
          <p style="margin:0;font-size:13px;color:${COLORS.faint};text-align:center;">Or just hit reply: it goes straight to ${escapeHtml(firstName(contact.name))}.</p>`,
        footerNote: `Sent because someone used the contact form on ${siteLink()}.`
      }),
      text: textLayout(`
${entryUrl ? "Correction suggested for an entry" : "New message from the contact form"}

From: ${contact.name} <${contact.email}>
Sent: ${sent}
Country: ${countryLabel(contact.country)}
${entryUrl ? `Entry: ${entryUrl}\n` : ""}reCAPTCHA: ${contact.recaptchaScore.toFixed(1)} (${human ? "likely human" : "borderline"})

${quoteText(contact.message)}

Hit reply to answer ${contact.name} directly.`)
    };
  });
}

// With a copy of the message, as the form keeps none on the sender's side.
function sendContactThanks(contact: ContactEmailDetails): Promise<void> {
  return deliverWithLogging("contact_thanks", () => {
    const name = firstName(contact.name);
    const steps = [
      { icon: "📬", title: "It's in my inbox", text: "Your message arrived safely, and there's a copy above for your records." },
      { icon: "👀", title: "I read every message myself", text: "No bots or canned replies beyond this one." },
      { icon: "↩️", title: "I'll write back to you", text: `My reply will come to ${contact.email}. Want to add something first? Just reply to this email.` }
    ];

    return {
      to: [{ email: contact.email, name: contact.name }],
      subject: `Thanks for reaching out, ${name}!`,
      html: layout({
        title: "Message received",
        preheader: "Your message reached me. Here's what happens next.",
        hero: "✉️ Message received",
        body: `
          ${heading(`Thanks for reaching out, ${escapeHtml(name)}! 🙌`)}
          ${lead("Your message made it to me, and I'll get back to you personally as soon as I can.")}
          ${sectionLabel("Your message")}
          ${quote(contact.message)}
          ${sectionLabel("What happens next")}
          ${features(steps)}
          ${button(siteConfig.url, "Browse the blog while you wait →", { secondary: true })}
          ${signature("Talk soon,")}`,
        footerNote: `You're getting this because you sent a message through the contact form on ${siteLink()}.`
      }),
      text: textLayout(`
Thanks for reaching out, ${name}!

Your message made it to me, and I'll get back to you personally as soon as I can.

YOUR MESSAGE

${quoteText(contact.message)}

WHAT HAPPENS NEXT
${steps.map(({ title, text }) => `- ${title}: ${text}`).join("\n")}

Browse the blog: ${siteConfig.url}

Talk soon,
${siteConfig.author.name}`)
    };
  });
}
