"use client";

import * as React from "react";
import { useSpring } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSound } from "@/hooks/use-sound";
import { SPRINGS } from "@/constants/springs";
import { ClipboardIcon, CheckIcon } from "@/components/Icon";
import VisuallyHidden from "@/components/VisuallyHidden";
import { CopyButtonProps } from "@/interfaces/copy-button";
import { Btn, IconOuterWrapper, IconWrapper, CheckMark } from "@/components/CopyButton/CopyButton.styles";

// Animated copy button: outer scale boop on hover, inner spring tilt on click, checkmark on success.
export default function CopyButton({ code, onCopy }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  // Ref so the cleanup effect always cancels the latest timer, not a stale closure copy
  const resetRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rotation, setRotation] = React.useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  // Camera shutter click, played once per successful copy alongside the shimmer sweep.
  const [playShutter] = useSound("/sounds/camera-shutter.wav", { volume: 0.5 });

  // Outer: subtle scale boop on hover; inner: two-phase lean+kick via a single spring
  const [isBooped, outerTrigger] = useBoop();
  const outerStyle = useTransformBoop(isBooped, { scaleX: 1.05, scaleY: 1.05 });
  const innerStyle = useSpring({
    transform: `rotate(${rotation}deg)`,
    config: SPRINGS.springy,
    immediate: prefersReducedMotion
  });

  // Cancel any in-flight "reset copied" timer if the button unmounts mid-countdown
  React.useEffect(() => {
    return () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, []);

  async function handleClick() {
    await navigator.clipboard.writeText(code);

    setRotation(-10);
    window.setTimeout(() => setRotation(0), 150);
    onCopy();
    playShutter();
    setIsCopied(true);

    if (resetRef.current) clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => {
      setIsCopied(false);
      resetRef.current = null;
    }, 2500);
  }

  return (
    <>
      <Btn
        className="copy-btn"
        onMouseDown={() => setRotation(10)}
        onMouseLeave={() => setRotation(0)}
        onPointerEnter={outerTrigger}
        onClick={handleClick}
        aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        <IconOuterWrapper style={outerStyle}>
          <IconWrapper style={{ ...innerStyle, color: isCopied ? "var(--color-fg-success)" : undefined }}>
            <ClipboardIcon strokeWidth={2} />
            <CheckMark
              style={{
                opacity: isCopied ? 1 : 0,
                transform: isCopied ? "scale(1)" : "scale(0)",
              }}
            >
              <CheckIcon size={10} strokeWidth={4} />
            </CheckMark>
          </IconWrapper>
        </IconOuterWrapper>
      </Btn>

      {/*
        aria-label changes on an already-focused button aren't reliably announced across
        screen readers, so the "Copied!" confirmation gets its own live region.
      */}
      <VisuallyHidden role="status" aria-live="polite">
        {isCopied ? "Copied to clipboard" : ""}
      </VisuallyHidden>
    </>
  );
}

CopyButton.displayName = "CopyButton";
