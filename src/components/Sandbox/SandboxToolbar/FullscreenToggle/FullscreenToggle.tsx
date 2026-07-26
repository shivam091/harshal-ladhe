"use client";

import type { JSX} from "react";
import { useSyncExternalStore } from "react";
import IconMaximize from "@/icons/IconMaximize";
import IconMinimize from "@/icons/IconMinimize";
import { useToggleIconStatus } from "@/hooks/use-toggle-icon-status";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import VisuallyHidden from "@/components/VisuallyHidden";
import ActionButton from "@/components/Sandbox/SandboxToolbar/ActionButton";
import type { FullscreenToggleProps } from "@/components/Sandbox/SandboxToolbar/SandboxToolbar.types";

// Fullscreen support never changes over a page's lifetime, so there's nothing to actually subscribe to — just an unsubscribe no-op.
function subscribeToNothing() {
  return () => {};
}

// The real client-side check — read directly, no state, since fullscreen support won't change mid-session.
function getFullscreenSupported() {
  return document.fullscreenEnabled;
}

// Not knowable at SSR time — matches the server's assumed-unsupported snapshot until the client can check for real.
function getServerFullscreenSupported() {
  return false;
}

// Toolbar toggle that fills the viewport via the browser Fullscreen API (see SandboxUIContext's toggleFullscreen).
export default function FullscreenToggle({ size = 14 }: FullscreenToggleProps): JSX.Element | null {
  const { showFullscreen, toggleFullscreen } = useSandboxUIContext();
  const { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp } = useToggleIconStatus();
  const isBooped = status === "booped";
  /*
    Hides the button entirely where the Fullscreen API is unavailable or disallowed, rather than offering a
    control that would just fail.
  */
  const supported = useSyncExternalStore(subscribeToNothing, getFullscreenSupported, getServerFullscreenSupported);

  if (!supported) return null;

  return (
    <>
      <ActionButton
        type="button"
        data-active={showFullscreen}
        aria-pressed={showFullscreen}
        aria-label={showFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={showFullscreen ? "Exit fullscreen (Ctrl/⌘+Alt+M)" : "Enter fullscreen (Ctrl/⌘+Alt+M)"}
        onClick={toggleFullscreen}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <span style={{ display: "flex", opacity: status !== "idle" ? 1 : 0.7 }}>
          {showFullscreen
            ? <IconMinimize size={size} isBooped={isBooped} />
            : <IconMaximize size={size} isBooped={isBooped} />}
        </span>
        <VisuallyHidden>
          {showFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        </VisuallyHidden>
      </ActionButton>
    </>
  );
}

FullscreenToggle.displayName = "FullscreenToggle";
