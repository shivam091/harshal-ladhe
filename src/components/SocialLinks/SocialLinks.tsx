import { JSX } from "react";
import { socialLinks } from "@/data/navigation";
import { Icon } from "@/components/Icon";
import { List, SocialLink } from "@/components/SocialLinks/SocialLinks.styles";

// Horizontal list of social links — filters out atom feed entries and renders each as an icon + label anchor with analytics attributes.
export default function SocialLinks(): JSX.Element {
  return (
    <>
      <List>
        {socialLinks.filter(link => link.href && link.type !== "atom").map((link) => {
          const { label, href, icon, external, analytics } = link;
          return (
            <li key={href}>
              <SocialLink
                href={href}
                aria-label={external ? `${label} (opens in new tab)` : label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(analytics ? {
                  "data-analytics-event":    analytics.event,
                  "data-analytics-label":    analytics.label,
                  "data-analytics-category": analytics.category,
                } : {})}
              >
                <Icon name={icon} size={15} aria-hidden="true" focusable={false} />
                {label}
              </SocialLink>
            </li>
          );
        })}
      </List>
    </>
  );
}

SocialLinks.displayName = "SocialLinks";
