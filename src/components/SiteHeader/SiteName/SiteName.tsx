import type { JSX } from "react";
import type { SiteNameProps } from "@/components/SiteHeader/SiteName/SiteName.types";
import {
  FirstName,
  MiddleNameInitial,
  LastName
} from "@/components/SiteHeader/SiteName/SiteName.styles";

// Hoisted so the animated and static initials can never drift apart.
const MIDDLE_INITIAL_PATH = `M71.00 3.00
                 C72.24 4.88 73.87 6.81 74.18 9.40
                 C74.22 9.78 74.11 11.27 74.11 10.96
                 C74.11 10.51 74.42 9.97 74.56 9.59
                 C74.99 8.44 75.31 7.31 75.93 6.30
                 C76.43 5.46 77.08 4.04 78.00 4.04`;

/*
  Inline SVG rather than plain text so the initial can be a hand-drawn stroke that animates in;
  the entrance can be switched off where the wordmark is secondary and motion would distract.
*/
export default function SiteName({ animated = true }: SiteNameProps): JSX.Element {
  const FirstNameText = animated ? FirstName : "text";
  const LastNameText = animated ? LastName : "text";

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 144 28" width="144" height="28" fill="currentColor"
        overflow="visible" aria-hidden="true" focusable={false}
        style={{ transform: "translateY(-1px)" }}>
        <FirstNameText x="0" y="21" fontSize="1.125rem" fontWeight="500" fill="var(--color-fg-accent)">
          Harshal
        </FirstNameText>
        {animated ? (
          <MiddleNameInitial
            d={MIDDLE_INITIAL_PATH}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <path
            d={MIDDLE_INITIAL_PATH}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
        <LastNameText x="84" y="21" fontSize="1.125rem" fontWeight="500" fill="var(--color-fg-accent)">
          LADHE
        </LastNameText>
      </svg>
    </>
  );
}

SiteName.displayName = "SiteName";
