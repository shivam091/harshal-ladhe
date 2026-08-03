"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import type { SubmitButtonProps } from "@/interfaces/newsletter";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  SubmitBtn,
  ProgressIndicator,
  ArrowIcon,
  SpinnerWrapper,
  BtnSpinner
} from "@/components/NewsletterForm/SubmitButton/SubmitButton.styles";

// Newsletter form submit button — animates a progress ring while submitting and swaps the arrow for a spinner.
export default function SubmitButton({ status }: SubmitButtonProps): JSX.Element {
  const [progress, setProgress] = useState(0);
  const [isBooped, triggerBoop] = useBoop();

  const boopStrength = 3;

  // Spring-animate the line and caret endpoints on hover-boop.
  const lineSpring = useSpring({
    x2: isBooped ? 18 + boopStrength : 18,
    config: { tension: 300, friction: 10 }
  });

  const caretSpring = useSpring({
    points: isBooped
      ? `${12 + boopStrength} 5 ${19 + boopStrength} 12 ${12 + boopStrength} 19`
      : "12 5 19 12 12 19",
    config: { tension: 300, friction: 10 }
  });

  // Snaps progress to its resting value outside the submitting phase; the RAF loop below fills it while submitting.
  useEffect(() => {
    if (status === "success") { setProgress(100); return; }
    if (status !== "submitting") { setProgress(0); return; }
    setProgress(0);
  }, [status]);

  // Eases progress toward 100 one frame at a time while submitting; stops itself once status changes away.
  useRequestAnimationFrameLoop(() => {
    setProgress((current) => Math.min(100, current + (100 - current) * 0.0175));
  }, status === "submitting");

  const showArrow = status !== "submitting" && status !== "success";

  return (
    <>
      <SubmitBtn
        type="submit"
        onMouseEnter={triggerBoop}
        disabled={status === "submitting" || status === "success"}
      >
        <ProgressIndicator
          style={{
            "--progress": `${progress}%`,
            opacity: status === "submitting" ? 1 : 0,
            transition: status === "submitting" ? "opacity 50ms" : "opacity 1000ms"
          } as React.CSSProperties}
        />
        <VisuallyHidden>Subscribe</VisuallyHidden>
        <ArrowIcon
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: showArrow ? "translateX(0rem)" : "translateX(1.75rem)",
            transitionTimingFunction:
              status === "submitting"
                ? "cubic-bezier(0.36, -0.01, 0.91, 0.63)"
                : "cubic-bezier(0.23, 0.62, 0.41, 1.01)"
          }}
        >
          <animated.line x1="5" y1="12" y2="12" {...lineSpring} />
          <animated.polyline {...caretSpring} />
        </ArrowIcon>
        {status === "submitting" && (
          <SpinnerWrapper>
            <BtnSpinner aria-hidden="true" />
          </SpinnerWrapper>
        )}
      </SubmitBtn>
    </>
  );
}

SubmitButton.displayName = "SubmitButton";
