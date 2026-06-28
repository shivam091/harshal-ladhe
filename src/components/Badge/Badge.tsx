import type { JSX } from "react";
import Link from "next/link";
import type { BadgeProps } from "@/components/Badge/Badge.types";
import { BadgeRoot } from "@/components/Badge/Badge.styles";

// Keeps linked and static badges visually identical so meta rows look the same either way.
export default function Badge({ children, href, ariaLabel, rel, role }: BadgeProps): JSX.Element {
  if (href) {
    return (
      <>
        <BadgeRoot as={Link} href={href} aria-label={ariaLabel} rel={rel} role={role}>
          {children}
        </BadgeRoot>
      </>
    );
  }

  return (
    <>
      <BadgeRoot as="span" aria-label={ariaLabel} rel={rel} role={role}>
        {children}
      </BadgeRoot>
    </>
  );
}

Badge.displayName = "Badge";
