"use client";

import { JSX, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { staticGreetings } from "@/constants/greetings";
import { sampleOne } from "@/utils/random";
import { Wrapper } from "@/components/SiteFooter/FooterGreeting/FooterGreeting.styles";

/*
  Randomly-picked italic one-liner shown under the footer logo — re-rolled on every pathname change
  (see effect below) so it varies per page, not just on hard refresh.
*/
export default function FooterGreeting(): JSX.Element {
  const [greeting, setGreeting] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    /*
      Footer lives in the shared layout, which doesn't remount on navigation —
      re-roll the greeting on every pathname change so it varies per page, not just on hard refresh.
    */
    const isPrideMonth = new Date().getMonth() === 5;
    const chosen =
      isPrideMonth && Math.random() < 0.5
        ? "Happy Pride month! 🏳️‍🌈"
        : sampleOne(staticGreetings);
    setGreeting(chosen);
  }, [pathname]);

  return (
    <>
      <Wrapper>{greeting}</Wrapper>
    </>
  );
}

FooterGreeting.displayName = "FooterGreeting";

