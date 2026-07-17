"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 167ms (10 frames @ 60fps), matching the header hamburger so every close control feels the same.
const CLOSE_ANIMATION_MS = 167;

/*
  Presses like the header hamburger so every close control feels the same, and dragging off the
  button before releasing cancels without closing.
*/
export function usePressToClose(onClose: () => void) {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Flattens the ✕ instantly on press, before any click/release has happened.
  const onPointerDown = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setIsPressed(true);
  }, []);

  // Holds the flattened state for CLOSE_ANIMATION_MS after a real click, then fires onClose.
  const onClick = useCallback(() => {
    setIsPressed(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      timeoutRef.current = null;
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [onClose]);

  // Dragging off the button before releasing cancels the flatten — same as the header hamburger.
  const onPointerLeave = useCallback(() => {
    if (timeoutRef.current !== null) return;
    setIsPressed(false);
  }, []);

  return { isPressed, onPointerDown, onClick, onPointerLeave };
}
