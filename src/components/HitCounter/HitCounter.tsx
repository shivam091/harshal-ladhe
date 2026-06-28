"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import { useSound } from "@/hooks/use-sound";
import { Digit } from "@/components/HitCounter/Digit";
import { Wrapper, SegmentButton } from "@/components/HitCounter/HitCounter.styles";

/*
  Fetches the view count for the current pathname from `/api/views` and displays
  it as a six-digit retro LED counter. Clicking the counter toggles its "lit" state,
  switching between the off-state and on-state colour tokens and playing a matching
  physical switch sound.
*/
export default function HitCounter() {
  const pathname = usePathname();
  const [views, setViews] = useState<number | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [playOn] = useSound("/sounds/pop-up-on.mp3");
  const [playOff] = useSound("/sounds/pop-up-off.mp3");

  useEffect(() => {
    fetch(`/api/views?slug=${encodeURIComponent(pathname)}`)
      .then((r) => r.json())
      .then((d: { views?: number }) => setViews(d.views ?? 0))
      .catch(() => setViews(0));
  }, [pathname]);

  if (views === null) return null;

  // Zero-pad to 6 digits and cap at 6 characters so the display never overflows.
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
          onClick={() => {
            setIsOn((prev) => !prev);
            (isOn ? playOff : playOn)();
          }}
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
