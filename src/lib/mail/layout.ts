import { siteConfig } from "@/config/site";

/*
  Tables and inline styles, since that's all most mail clients render. Kept
  apart from the site's own styles, which no inbox would load. The admin
  app's mail (app/views/layouts/mailer.html.haml there) follows the same
  design, so every email from the blog looks like it came from one place.
*/

// The favicon, as the site serves it, because Gmail won't show SVG or inline images; 310px shown at 60px so it stays
// sharp on high-density screens.
const LOGO_URL = `${siteConfig.url}/assets/img/icons/favicon.png`;

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const COLORS = {
  accent: "#4f46e5",
  accentDeep: "#7c3aed",
  accentSoft: "#eef2ff",
  heading: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  faint: "#94a3b8",
  border: "#e2e8f0",
  panel: "#f8fafc",
  page: "#f4f5fb"
};

const GRADIENT = `linear-gradient(135deg,${COLORS.accent} 0%,${COLORS.accentDeep} 100%)`;

// So nothing a visitor typed can add markup or links to an email.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Keeps the sender's line breaks, which a message's paragraphs depend on.
export function paragraphs(value: string): string {
  return value
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 10px;">${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function heading(text: string): string {
  return `<h1 class="mail-h1" style="margin:0 0 14px;font-size:26px;line-height:1.3;font-weight:800;letter-spacing:-0.4px;color:${COLORS.heading};">${text}</h1>`;
}

export function lead(html: string): string {
  return `<p style="margin:0 0 24px;font-size:17px;line-height:1.65;color:${COLORS.body};">${html}</p>`;
}

export function sectionLabel(text: string): string {
  return `<p style="margin:32px 0 14px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.faint};">${text}</p>`;
}

// The cell carries a plain colour under the gradient, so clients that drop gradients, like Outlook, still show a
// solid button.
export function button(url: string, label: string, { secondary = false } = {}): string {
  const cell = secondary
    ? `background:#ffffff;border:1px solid ${COLORS.border};`
    : `background:${COLORS.accent};background-image:${GRADIENT};box-shadow:0 8px 20px rgba(79,70,229,0.28);`;
  const color = secondary ? COLORS.heading : "#ffffff";

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 8px;">
      <tr>
        <td style="border-radius:12px;${cell}">
          <a href="${escapeHtml(url)}" style="display:inline-block;padding:15px 32px;color:${color};font-size:16px;font-weight:700;text-decoration:none;border-radius:12px;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`;
}

// Tiles rather than bullets, so a list reads at a glance. Escaped here, as a line may hold what a visitor typed.
export function features(rows: { icon: string; title: string; text: string }[]): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${rows.map(({ icon, title, text }) => `
      <tr>
        <td width="58" style="padding:0 0 18px;vertical-align:top;">
          <div style="width:44px;height:44px;line-height:44px;border-radius:12px;background:${COLORS.accentSoft};text-align:center;font-size:20px;">${icon}</div>
        </td>
        <td style="padding:2px 0 18px;vertical-align:top;">
          <p style="margin:0;font-size:16px;font-weight:700;color:${COLORS.heading};">${escapeHtml(title)}</p>
          <p style="margin:2px 0 0;font-size:15px;line-height:1.55;color:${COLORS.muted};">${escapeHtml(text)}</p>
        </td>
      </tr>`).join("")}
    </table>`;
}

export function quote(message: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      <tr>
        <td style="padding:20px 24px;background:${COLORS.panel};border:1px solid ${COLORS.border};border-left:4px solid ${COLORS.accent};border-radius:4px 14px 14px 4px;font-size:15px;line-height:1.65;color:#475569;">
          ${paragraphs(message)}
        </td>
      </tr>
    </table>`;
}

// Signed with the avatar, so the mail reads as from a person rather than a system.
export function signature(signOff: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:36px 0 0;">
      <tr>
        <td style="padding:0 14px 0 0;vertical-align:middle;">
          <img src="${LOGO_URL}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;border-radius:50%;background:${COLORS.accentSoft};">
        </td>
        <td style="vertical-align:middle;">
          <p style="margin:0;font-size:14px;color:${COLORS.muted};">${escapeHtml(signOff)}</p>
          <p style="margin:2px 0 0;font-size:16px;font-weight:700;color:${COLORS.heading};">${escapeHtml(siteConfig.author.name)}</p>
        </td>
      </tr>
    </table>`;
}

// The bare host as its text, since a full URL reads as noise in a footer note.
export function siteLink(): string {
  return `<a href="${siteConfig.url}" style="color:${COLORS.accent};text-decoration:none;white-space:nowrap;">${siteConfig.url.replace(/^https?:\/\//, "")}</a>`;
}

const ROLES = siteConfig.author.roles.map((role) => role.replace(/^\w/, (letter) => letter.toUpperCase())).join(" · ");

const SOCIAL_LINKS: [string, string][] = [
  ["GitHub", siteConfig.author.social.github],
  ["LinkedIn", siteConfig.author.social.linkedin],
  ["Instagram", siteConfig.author.social.instagram]
];

/*
  Filler follows the preheader, so the body's first words aren't pulled into the inbox's preview line too. A footer
  note is required, as inbox providers expect anything that looks like bulk mail to say why the reader got it.
*/
export function layout({ title, preheader, hero, body, footerNote, unsubscribeUrl }: {
  title: string;
  preheader: string;
  hero: string;
  body: string;
  footerNote: string;
  unsubscribeUrl?: string | null;
}): string {
  const year = new Date().getFullYear();
  const socials = SOCIAL_LINKS.map(([label, url]) =>
    `<a href="${url}" style="display:inline-block;margin:0 4px 8px;padding:6px 14px;border:1px solid ${COLORS.border};border-radius:999px;background:#ffffff;color:#475569;font-size:13px;font-weight:600;text-decoration:none;">${label}</a>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="${siteConfig.lang}">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media (max-width: 620px) {
      .mail-pad { padding-left: 24px !important; padding-right: 24px !important; }
      .mail-h1 { font-size: 23px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};font-family:${FONT};color:${COLORS.heading};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}${"&#847;&zwnj;&nbsp;".repeat(60)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};">
    <tr>
      <td align="center" style="padding:40px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td class="mail-pad" style="background:${COLORS.accent};background-image:${GRADIENT};border-radius:20px 20px 0 0;padding:40px 40px 34px;text-align:center;">
              <!-- Fixed width and height, as Outlook otherwise shows the image at its full size; the white disc keeps the
                   transparent avatar legible on the gradient. No alt text, since the name right below already says it. -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="width:76px;height:76px;padding:0;border-radius:50%;background:#ffffff;box-shadow:0 6px 18px rgba(15,23,42,0.22);text-align:center;vertical-align:middle;">
                    <a href="${siteConfig.url}" style="display:block;text-decoration:none;">
                      <img src="${LOGO_URL}" width="60" height="60" alt="" style="display:block;width:60px;height:60px;margin:8px auto;border:0;outline:none;text-decoration:none;border-radius:50%;">
                    </a>
                  </td>
                </tr>
              </table>
              <a href="${siteConfig.url}" style="color:#ffffff;text-decoration:none;font-size:22px;font-weight:800;letter-spacing:-0.3px;">${escapeHtml(siteConfig.name)}</a>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:12px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;">${escapeHtml(ROLES)}</p>
              <p style="margin:20px 0 0;">
                <span style="display:inline-block;padding:8px 16px;border:1px solid rgba(255,255,255,0.3);border-radius:999px;background:rgba(255,255,255,0.14);color:#ffffff;font-size:14px;font-weight:600;">${escapeHtml(hero)}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td class="mail-pad" style="background:#ffffff;padding:44px 44px 40px;border-radius:0 0 20px 20px;font-size:16px;line-height:1.65;color:${COLORS.body};box-shadow:0 12px 32px rgba(15,23,42,0.06);">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:32px 16px 8px;text-align:center;">
              ${socials}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0;text-align:center;font-size:13px;line-height:1.7;color:${COLORS.muted};">
              <p style="margin:0;">${footerNote}</p>
              ${unsubscribeUrl ? `<p style="margin:4px 0 0;">Don't want these any more? <a href="${escapeHtml(unsubscribeUrl)}" style="color:${COLORS.accent};text-decoration:underline;">Unsubscribe</a></p>` : ""}
              <p style="margin:12px 0 0;color:${COLORS.faint};">&copy; ${year} ${escapeHtml(siteConfig.name)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// The plain-text part, for clients that won't show HTML and for spam filters that read both.
export function textLayout(body: string, unsubscribeUrl?: string | null): string {
  const unsubscribe = unsubscribeUrl ? `Don't want these any more? Unsubscribe: ${unsubscribeUrl}\n` : "";
  return `${body.trim()}\n\n--\n${siteConfig.name}\n${siteConfig.url}\n${unsubscribe}`;
}
