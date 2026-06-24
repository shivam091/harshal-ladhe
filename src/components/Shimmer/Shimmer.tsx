"use client";

import * as React from "react";
import type { ShimmerProps } from "@/components/Shimmer/Shimmer.types";
import { ShimmerWrapper, ShimmerSweep } from "@/components/Shimmer/Shimmer.styles";

// Generic trigger-driven shimmer overlay: mounts a fresh sweep animation each time `trigger` changes.
// Render as a child of any `position: relative`/`isolate` container with `overflow: clip` — the sweep
// fills that container. Multiple instances stack independently and all are removed after 5s of inactivity.
export default function Shimmer({ trigger }: ShimmerProps) {
  const [keys, setKeys] = React.useState<Array<number>>([]);
  // Tracks the last seen trigger so effect only fires on genuine changes, not re-renders with the same value.
  const lastTrigger = React.useRef(trigger);

  React.useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    setKeys((prev) => [...prev, trigger]);
  }, [trigger]);

  React.useEffect(() => {
    if (keys.length === 0) return;
    const id = setTimeout(() => setKeys([]), 5000);
    return () => clearTimeout(id);
  }, [keys]);

  return (
    <>
      {keys.map((key) => (
        <ShimmerWrapper key={key}>
          <ShimmerSweep />
        </ShimmerWrapper>
      ))}
    </>
  );
}

Shimmer.displayName = "Shimmer";
