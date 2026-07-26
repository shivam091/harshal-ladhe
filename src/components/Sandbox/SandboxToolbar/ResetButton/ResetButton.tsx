"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { usePreviewClientContext } from "@/hooks/use-preview-client-context";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useBoop } from "@/hooks/use-boop";
import { useInterval } from "@/hooks/use-interval";
import { normalize } from "@/utils/number";
import { trackEvent } from "@/lib/analytics";
import Tooltip from "@/components/Tooltip";
import DotProgressBar from "@/components/DotProgressBar";
import VisuallyHidden from "@/components/VisuallyHidden";
import IconSkipBack from "@/icons/IconSkipBack";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import { Wrapper, ProgressWrapper } from "@/components/Sandbox/SandboxToolbar/ResetButton/ResetButton.styles";
import type { ResetButtonProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// How long (ms) the button must be held before the reset actually fires.
const RESET_AFTER = 1000;
// Releasing before this threshold counts as a quick click, not a hold.
const QUICK_CLICK_THRESHOLD = 400;

/*
  Resets every file to the sandbox's original contents and reruns the preview. Gated behind a
  click-and-hold since it discards every edit; a quick release shows a hint tooltip instead.
  Hidden entirely in read-only mode.
*/
export default function ResetButton({ size = 14 }: ResetButtonProps): JSX.Element | null {
  const { sandpack } = useSandpack();
  const { requestReset } = usePreviewClientContext();
  const { readOnly, slug } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const [isResetting, triggerReset] = useBoop();

  const [showTooltip, setShowTooltip] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const heldSinceRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Touch devices rarely fire pointerleave after a tap, so this dismisses the tooltip on any outside pointerdown instead, matching Tooltip's own touch dismissal behaviour.
  useEffect(() => {
    if (!showTooltip) return;

    function handleOutsidePointerDown(event: PointerEvent) {
      if (wrapperRef.current?.contains(event.target as Node)) return;
      setShowTooltip(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [showTooltip]);

  function handleReset() {
    triggerReset();
    // Order matters: requestReset() only arms the refresh flag, so it must run before resetAllFiles() actually restores the files that refresh will run against.
    requestReset();
    sandpack.resetAllFiles();
    trackEvent("sandbox_reset", { event_label: slug });
  }

  function handlePressStart() {
    heldSinceRef.current = Date.now();
    setIsHolding(true);
    setShowTooltip(false);
  }

  function handlePressEnd() {
    if (heldSinceRef.current === null) return;

    const heldFor = Date.now() - heldSinceRef.current;
    heldSinceRef.current = null;
    setIsHolding(false);
    setProgress(0);

    if (heldFor < QUICK_CLICK_THRESHOLD) {
      setShowTooltip(true);
    }
  }

  // Cancels the hold without showing the tooltip.
  function handlePressCancel() {
    heldSinceRef.current = null;
    setIsHolding(false);
    setProgress(0);
  }

  // Polls the hold duration every 20ms while isHolding, firing the reset once RESET_AFTER is reached.
  useInterval(
    () => {
      if (heldSinceRef.current === null) return;

      const heldFor = Date.now() - heldSinceRef.current;

      if (heldFor > RESET_AFTER) {
        handleReset();
        heldSinceRef.current = null;
        setIsHolding(false);
        setProgress(0);
        return;
      }

      setProgress(normalize(heldFor, 0, RESET_AFTER, 0, 100));
    },
    isHolding ? 20 : null
  );

  if (readOnly) return null;

  return (
    <>
      <Tooltip
        content={
          showTooltip
            ? "Click and hold to reset code to its initial version"
            : undefined
        }
        forceOpen={showTooltip}
      >
        <Wrapper ref={wrapperRef}>
          <ActionButton
            type="button"
            onPointerDown={() => {
              onPointerDown();
              handlePressStart();
            }}
            onPointerUp={() => {
              onPointerUp();
              handlePressEnd();
            }}
            onPointerEnter={onPointerEnter}
            onPointerLeave={() => {
              onPointerLeave();
              setShowTooltip(false);
              handlePressCancel();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleReset();
            }}
            aria-label="Reset code to its original state"
            title="Reset code to its original state (Ctrl/⌘+Alt+R)"
          >
            <IconSkipBack
              status={status}
              isHolding={isHolding}
              isResetting={isResetting}
              size={size}
            />
            <VisuallyHidden>Reset code to its original state</VisuallyHidden>
          </ActionButton>
          <ProgressWrapper>
            {/* Exaggerated by 1.2x so the last dot doesn't just vanish right as the hold completes. */}
            <DotProgressBar
              value={(progress / 100) * 1.2}
              dotSize={3}
              numOfDots={5}
              dotColor="var(--color-fg-accent)"
            />
          </ProgressWrapper>
        </Wrapper>
      </Tooltip>
    </>
  );
}

ResetButton.displayName = "ResetButton";
