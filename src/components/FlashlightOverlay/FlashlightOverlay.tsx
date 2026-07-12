"use client";

import type { JSX} from "react";
import { useState, useEffect } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useHoverDevice } from "@/hooks/use-hover-device";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import Button from "@/components/Button";
import type { FlashlightOverlayProps } from "@/interfaces/flashight-overlay";
import { ToggleContainer } from "@/components/FlashlightOverlay/FlashlightOverlay.styles";

// Cursor bitmap — 10×10 crosshair.
const CURSOR_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACQSURBVHgBhZA9CsQgEIVnxCJHSJkjpFGw8wh7xD2KtRbmCClzhAVRdx6YLsQHyoifP/MxjeSct1KKl3Jl5kXG2Vo7rLUH9hlTSgmAp+cEY0zgGOMupz/0Eq31V0l2mqTW6lXvfaN5VoC/GSXMgqevGQgDSpSEGQhNyjl3Sv0GB7jkewVNMIDmxr8v6TaMi+gPLrNAA0C8lG8AAAAASUVORK5CYII=";

/*
  Kept mounted permanently — toggling the effect flips the .flashlight-enabled class on <html>
  instead of mounting/unmounting this tag, which would force a CSSOM rebuild on every toggle.
*/
const FLASHLIGHT_CSS = `
:root {
  --cursorX: 50vw;
  --cursorY: 50vh;
}

@media (hover: hover) {
  html.flashlight-enabled body {
    cursor: url("data:image/png;base64,${CURSOR_B64}"), auto;
  }

  html.flashlight-enabled {
    cursor: none;
  }
}

html.flashlight-enabled::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  background: radial-gradient(
    circle 16vmax at var(--cursorX) var(--cursorY),
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 80%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
`;

// Injects a radial-gradient spotlight that follows the mouse/touch pointer; renders an optional toggle button.
export default function FlashlightOverlay({ showToggle = false }: FlashlightOverlayProps): JSX.Element {
  const [enabled, setEnabled] = useState(true);
  const isHoverDevice = useHoverDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { x: mouseX, y: mouseY } = useMousePosition();

  /*
    Continuous pointer-follow motion is exactly what prefers-reduced-motion asks sites to
    avoid by default — this only sets the *default*, it doesn't remove the manual toggle
    below, so a user can still explicitly opt back in.
  */
  useEffect(() => {
    if (prefersReducedMotion) setEnabled(false);
  }, [prefersReducedMotion]);

  // Mirror pointer position onto :root so the ::before gradient follows it.
  useEffect(() => {
    if (typeof mouseX !== "number" || typeof mouseY !== "number") return;

    document.documentElement.style.setProperty("--cursorX", `${mouseX}px`);
    document.documentElement.style.setProperty("--cursorY", `${mouseY}px`);
  }, [mouseX, mouseY]);

  /*
    Only mark the body on error/not-found pages (showToggle=true).
    Writing this attribute unconditionally would hide the SkipLink on any
    page that uses <FlashlightOverlay /> as a decorative effect.
  */
  useEffect(() => {
    if (!showToggle) return;

    document.body.setAttribute("data-error-page", "true");
    return () => document.body.removeAttribute("data-error-page");
  }, [showToggle]);

  /*
    Gate the overlay on both user toggle and device capability.
    null = not yet hydrated; treat as hover device so desktop sees the effect immediately.
  */
  useEffect(() => {
    document.documentElement.classList.toggle("flashlight-enabled", enabled && isHoverDevice !== false);
    return () => document.documentElement.classList.remove("flashlight-enabled");
  }, [enabled, isHoverDevice]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FLASHLIGHT_CSS }} />
      {showToggle && isHoverDevice === true && (
        <ToggleContainer>
          <Button variant="outlined" size="sm" aria-pressed={enabled} onClick={() => setEnabled(v => !v)}>
            {enabled ? "Disable" : "Enable"} Flashlight Effect
          </Button>
        </ToggleContainer>
      )}
    </>
  );
}

FlashlightOverlay.displayName = "FlashlightOverlay";
