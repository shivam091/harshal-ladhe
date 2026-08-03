"use client";

import type { JSX } from "react";
import { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
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
  const rafRef = useRef<number | null>(null);
  const [isBooped, triggerBoop] = useBoop();

  const boopStrength = 3;

  // Spring-animate the line and caret endpoints on hover-boop.
  const lineSpring = useSpring({
    x2: isBooped ? 18 + boopStrength : 18,
    config: { tension: 300, friction: 10 },
  });

  const caretSpring = useSpring({
    points: isBooped
      ? `${12 + boopStrength} 5 ${19 + boopStrength} 12 ${12 + boopStrength} 19`
      : "12 5 19 12 12 19",
    config: { tension: 300, friction: 10 },
  });

  // RAF loop that fills the progress indicator while submitting.
  useEffect(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    if (status === "success") { setProgress(100); return; }
    if (status !== "submitting") { setProgress(0); return; }

    setProgress(0);
    let local = 0;

    function tick() {
      const increment = (100 - local) * 0.0175;
      local = Math.min(100, local + increment);
      setProgress(local);
      if (local < 99.9) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [status]);

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
            transition: status === "submitting" ? "opacity 50ms" : "opacity 1000ms",
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
                : "cubic-bezier(0.23, 0.62, 0.41, 1.01)",
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
