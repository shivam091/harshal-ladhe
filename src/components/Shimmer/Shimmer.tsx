"use client";

import * as React from "react";
import type { ShimmerProps } from "@/components/Shimmer/Shimmer.types";
import { ShimmerWrapper, ShimmerSweep } from "@/components/Shimmer/Shimmer.styles";

/*
  Mounts a fresh sweep per trigger so rapid events overlap instead of restarting one animation.
  Needs a positioned `overflow: clip` parent; sweeps clear after 5s idle so they don't pile up.
*/
export default function Shimmer({ trigger }: ShimmerProps) {
  const [keys, setKeys] = React.useState<Array<number>>([]);
  // Skips the initial mount and same-value re-renders so only a genuine trigger change plays a sweep.
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
