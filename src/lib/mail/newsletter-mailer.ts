import { siteConfig } from "@/config/site";
import { deliverWithLogging } from "./deliver";
import { COLORS, button, escapeHtml, features, heading, layout, lead, sectionLabel, signature, siteLink, textLayout } from "./layout";
import { unsubscribeHeaders, unsubscribeLinks } from "./unsubscribe";

const PERKS = [
  { icon: "✍️", title: "Fresh posts, first", text: "New posts, tutorials and snippets, straight to your inbox as soon as they're published." },
  { icon: "💡", title: "Practical takeaways", text: "Ideas and techniques you can use in your own work right away." },
  { icon: "🔕", title: "No spam, ever", text: "Only things worth your time, and you can unsubscribe in one click." }
];

export function sendNewsletterWelcome(email: string, subscriberId: string): Promise<void> {
  return deliverWithLogging("newsletter_welcome", () => {
    const links = unsubscribeLinks(subscriberId);
    const unsubscribe = links?.page ?? null;
    const notMe = unsubscribe
      ? `Didn't sign up? <a href="${escapeHtml(unsubscribe)}" style="color:${COLORS.accent};text-decoration:underline;">Unsubscribe in one click</a> and you won't hear from me again.`
      : "Didn't sign up? Just reply to this email and I'll take you off the list.";

    return {
      to: [{ email }],
      ...(links ? { headers: unsubscribeHeaders(links) } : {}),
      subject: `Welcome aboard! You're subscribed to ${siteConfig.name}`,
      html: layout({
        title: "Welcome aboard!",
        preheader: "Thanks for subscribing. Here's what to expect, and where to start.",
        hero: "🎉 You're on the list",
        body: `
          ${heading("Welcome aboard! 👋")}
          ${lead("Thanks for subscribing. It genuinely means a lot that you want to hear from me, and I'll make sure every email is worth opening.")}
          ${sectionLabel("What to expect")}
          ${features(PERKS)}
          ${button(siteConfig.url, "Start reading →")}
          ${signature("Happy reading,")}
          <p style="margin:32px 0 0;padding-top:20px;border-top:1px solid ${COLORS.border};font-size:13px;line-height:1.6;color:${COLORS.faint};">${notMe}</p>`,
        footerNote: `You're getting this because you subscribed on ${siteLink()}.`,
        unsubscribeUrl: unsubscribe
      }),
      text: textLayout(`
Welcome aboard!

Thanks for subscribing. It genuinely means a lot that you want to hear from me, and I'll make sure every email is worth opening.

WHAT TO EXPECT
${PERKS.map(({ title, text }) => `- ${title}: ${text}`).join("\n")}

Start reading: ${siteConfig.url}

Happy reading,
${siteConfig.author.name}

${unsubscribe ? `Didn't sign up? Unsubscribe: ${unsubscribe}` : "Didn't sign up? Just reply to this email and I'll take you off the list."}`, unsubscribe)
    };
  });
}
