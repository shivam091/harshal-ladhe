import { JSX } from "react";
import {
  FirstName,
  MiddleNameInitial,
  LastName
} from "@/components/SiteHeader/SiteName/SiteName.styles";

// Renders the site wordmark as an inline SVG — first name, a hand-drawn initial separator, and last name.
export default function SiteName(): JSX.Element {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 144 28" width="144" height="28" fill="currentColor"
        overflow="visible" aria-hidden="true" focusable={false}
        style={{ transform: "translateY(-1px)" }}>
        <FirstName x="0" y="21" fontSize="1.125rem" fontWeight="500" fill="var(--color-fg-accent)">
          Harshal
        </FirstName>
        <MiddleNameInitial d="M71.00 3.00
                 C72.24 4.88 73.87 6.81 74.18 9.40
                 C74.22 9.78 74.11 11.27 74.11 10.96
                 C74.11 10.51 74.42 9.97 74.56 9.59
                 C74.99 8.44 75.31 7.31 75.93 6.30
                 C76.43 5.46 77.08 4.04 78.00 4.04"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
        />
        <LastName x="84" y="21" fontSize="1.125rem" fontWeight="500" fill="var(--color-fg-accent)">
          LADHE
        </LastName>
      </svg>
    </>
  );
}

SiteName.displayName = "SiteName";
