"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import IconWifi from "@/icons/IconWifi";
import VisuallyHidden from "@/components/VisuallyHidden";
import { Wrapper, bannerClass, Message, CloseButton } from "@/components/ConnectivityBanner/ConnectivityBanner.styles";

// Long enough to notice and read, short enough that a good-news message doesn't linger.
const RECONNECTED_VISIBLE_MS = 3000;

// Wi-Fi hand-offs and waking laptops drop out for a moment; waiting this long keeps those blips silent.
const OFFLINE_GRACE_MS = 1500;

// Copy lives in one place so the visible pill and the screen-reader announcement never drift apart.
const MESSAGES = {
  offline: "You’re offline. Some pages may not load.",
  online: "Back online."
} as const;

// Says when the connection drops and confirms when it's back, so a failed load isn't a silent mystery.
export default function ConnectivityBanner(): JSX.Element {
  const isOnline = useOnlineStatus();
  // Only true once an outage outlasts the grace period, so blips never surface.
  const [isOfflineShown, setIsOfflineShown] = useState(false);
  const [isOfflineDismissed, setIsOfflineDismissed] = useState(false);
  const [isReconnected, setIsReconnected] = useState(false);
  // Hover or focus holds "Back online" so it can't vanish mid-read.
  const [isPaused, setIsPaused] = useState(false);
  // Remembers the last status so each change is acted on exactly once, not on every re-render.
  const [prevIsOnline, setPrevIsOnline] = useState(isOnline);

  // Adjusted during render rather than in an effect, so the banner swaps in the same paint as the status change.
  if (isOnline !== prevIsOnline) {
    setPrevIsOnline(isOnline);
    // The old pill unmounts without a pointerleave, so a pause held over it must not carry into the new one.
    setIsPaused(false);
    if (isOnline) {
      // "Back online" only makes sense if the user was actually told they were offline.
      setIsReconnected(isOfflineShown);
      setIsOfflineShown(false);
    } else {
      // A fresh outage deserves a fresh warning, even if the last one was dismissed.
      setIsOfflineDismissed(false);
      setIsReconnected(false);
    }
  }

  // Cleared by the next status change, so an outage shorter than the grace period never shows.
  useEffect(() => {
    if (isOnline) return;
    const timer = window.setTimeout(() => setIsOfflineShown(true), OFFLINE_GRACE_MS);
    return () => window.clearTimeout(timer);
  }, [isOnline]);

  // "Back online" is good news, so it clears itself — restarting the full countdown after any pause.
  useEffect(() => {
    if (!isReconnected || isPaused) return;
    const timer = window.setTimeout(() => setIsReconnected(false), RECONNECTED_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [isReconnected, isPaused]);

  const status = isOfflineShown && !isOfflineDismissed ? "offline" : isReconnected ? "online" : null;

  // Dismissing "offline" hides it until the next outage; dismissing "online" just ends it early.
  function handleClose() {
    setIsPaused(false);
    if (status === "offline") setIsOfflineDismissed(true);
    else setIsReconnected(false);
  }

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <>
      {/* Separate from the pill so announcements carry only the message, not the dismiss button's label. */}
      <VisuallyHidden role="status" aria-live="polite">
        {status ? MESSAGES[status] : ""}
      </VisuallyHidden>

      <Wrapper>
        {/* Offline and online pills never share the screen, which would read as contradictory. */}
        <AnimatePresence initial={false} mode="wait">
          {status && (
            <motion.div
              key={status}
              className={bannerClass}
              data-status={status}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 170, damping: 26 }}
              onPointerEnter={pause}
              onPointerLeave={resume}
              onFocus={pause}
              onBlur={resume}
            >
              <IconWifi size={16} isOffline={status === "offline"} />
              <Message>{MESSAGES[status]}</Message>
              <CloseButton onClose={handleClose} label="Dismiss connection message" />
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

ConnectivityBanner.displayName = "ConnectivityBanner";
