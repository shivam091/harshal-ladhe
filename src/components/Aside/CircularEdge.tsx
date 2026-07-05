import type { JSX } from "react";
import { FILL_TRANSITION } from "@/components/Aside/Aside.helpers";

/*
  Decorative SVG cap for the accent line's top edge — a curved notch that sweeps
  from the aside's top-left corner into the vertical accent line. Used by the
  info/success/quote variants. Purely presentational (aria-hidden).
*/
export function CircularEdge(): JSX.Element {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={28.5}
        height={34.5}
        fill="none"
        viewBox="0 0 57 69"
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible", marginTop: "-0.5px" }}
        aria-hidden
      >
        {/* Background fill matches page bg to cut a curved notch into the accent line */}
        <path
          d="M54 0V0.716804C54 25.9434 35.0653 47.1517 10 50L0 57V0H54Z"
          style={{ fill: "var(--color-bg-default)", transition: FILL_TRANSITION }}
        />
        <path
          d="M56.9961 4.15364C57.0809 2.49896 55.8083 1.08879 54.1536 1.00394C52.499 0.919082 51.0888 2.19168 51.0039 3.84636L56.9961 4.15364ZM9.09704 51.7557L8.49716 48.8163L9.09704 51.7557ZM6 69V59.2227H0V69H6ZM9.69692 54.6951L14.3373 53.7481L13.1375 47.8693L8.49716 48.8163L9.69692 54.6951ZM14.3373 53.7481C38.202 48.8777 55.7486 28.4783 56.9961 4.15364L51.0039 3.84636C49.8967 25.4384 34.3213 43.5461 13.1375 47.8693L14.3373 53.7481ZM6 59.2227C6 57.0268 7.54537 55.1342 9.69692 54.6951L8.49716 48.8163C3.55195 49.8255 0 54.1756 0 59.2227H6Z"
          style={{ fill: "var(--aside-accent)", transition: FILL_TRANSITION }}
        />
      </svg>
    </>
  );
}

CircularEdge.displayName = "CircularEdge";
