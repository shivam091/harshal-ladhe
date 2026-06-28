"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import { Digit } from "@/components/HitCounter/Digit";
import { Wrapper, SegmentButton } from "@/components/HitCounter/HitCounter.styles";

// A retro LED view counter, in keeping with the site's playful old-web details.
export default function HitCounter() {
  const pathname = usePathname();
  const [views, setViews] = useState<number | null>(null);
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    fetch(`/api/views?slug=${encodeURIComponent(pathname)}`)
      .then((r) => r.json())
      .then((d: { views?: number }) => setViews(d.views ?? 0))
      .catch(() => setViews(0));
  }, [pathname]);

  if (views === null) return null;

  // Padded and capped at six digits so the display never overflows.
  const digits = views.toString().padStart(6, "0").slice(-6);

  return (
    <>
      <Wrapper aria-labelledby="hit-counter-heading">
        <VisuallyHidden as="h3" id="hit-counter-heading">
          Page view counter
        </VisuallyHidden>
        <strong>
          <em># of hits</em>
        </strong>
        <SegmentButton
          onClick={() => setIsOn((prev) => !prev)}
          data-is-on={String(isOn)}
          aria-label={`Retro-style hit counter, showing that ${views} ${
            views === 1 ? "person has" : "people have"
          } visited this page. Click to toggle display.`}
        >
          {digits.split("").map((d, i) => (
            <Digit key={i} digit={d} />
          ))}
        </SegmentButton>
      </Wrapper>
    </>
  );
}

HitCounter.displayName = "HitCounter";
