import { useEffect, useState } from "react";
import type { JSX } from "react";
import { PreviewBox } from "@/components/LinearEasingPlayground/LinearEasingPlayground.styles";

// Longer than the cubic-bezier() preview, so curves with several swings have time to read.
const PREVIEW_DURATION_MS = 1400;

// Animates with the real CSS linear() value rather than a JS solver, so the preview is exactly what the browser will do.
export default function PreviewSlide({ cssValue, travelDistance, onDone }: { cssValue: string; travelDistance: number; onDone: () => void }): JSX.Element {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <PreviewBox
        onTransitionEnd={onDone}
        style={{
          transform: `translate(${hasStarted ? travelDistance : 0}px, -50%)`,
          transitionProperty: "transform",
          transitionDuration: `${PREVIEW_DURATION_MS}ms`,
          transitionTimingFunction: cssValue,
        }}
      />
    </>
  );
}

PreviewSlide.displayName = "PreviewSlide";
