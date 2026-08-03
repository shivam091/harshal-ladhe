"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useBoop } from "@/hooks/use-boop";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import IconArrowRight from "@/icons/IconArrowRight";
import type { SubmitButtonProps } from "@/components/NewsletterForm/SubmitButton/SubmitButton.types";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  SubmitBtn,
  ProgressIndicator,
  ArrowIconWrapper,
  SpinnerWrapper,
  BtnSpinner
} from "@/components/NewsletterForm/SubmitButton/SubmitButton.styles";

// Visible progress reassures readers that a slow subscribe request is still working.
export default function SubmitButton({ status }: SubmitButtonProps): JSX.Element {
  const [progress, setProgress] = useState(0);
  const [isBooped, triggerBoop] = useBoop();

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
        <ArrowIconWrapper
          style={{
            transform: showArrow ? "translateX(0rem)" : "translateX(1.75rem)",
            transitionTimingFunction:
              status === "submitting"
                ? "cubic-bezier(0.36, -0.01, 0.91, 0.63)"
                : "cubic-bezier(0.23, 0.62, 0.41, 1.01)"
          }}
        >
          <IconArrowRight size={20} isBooped={isBooped} />
        </ArrowIconWrapper>
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
