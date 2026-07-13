"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import { useSound } from "@/hooks/use-sound";
import { Digit } from "@/components/HitCounter/Digit";
import { Wrapper, SegmentButton } from "@/components/HitCounter/HitCounter.styles";

// A retro LED view counter that clicks like a real momentary switch, in keeping with the site's playful old-web details.
export default function HitCounter() {
  const pathname = usePathname();
  const [views, setViews] = useState<number | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [playPress, , stopPress] = useSound("/sounds/pop-down.mp3");
  const [playOn] = useSound("/sounds/pop-up-on.mp3");
  const [playOff] = useSound("/sounds/pop-up-off.mp3");

  useEffect(() => {
    fetch(`/api/views?slug=${encodeURIComponent(pathname)}`)
      .then((r) => r.json())
      .then((d: { views?: number }) => setViews(d.views ?? 0))
      .catch(() => setViews(0));
  }, [pathname]);

  // Cutting the press sound short on release makes it behave like a real momentary switch.
  function toggleCounter() {
    stopPress();
    (isOn ? playOff : playOn)();
    setIsOn((prev) => !prev);
  }

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
          onPointerDown={() => playPress()}
          onPointerUp={toggleCounter}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") toggleCounter();
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
