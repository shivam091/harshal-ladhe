"use client";

import type { PointerEvent } from "react";
import { useSound } from "@/hooks/use-sound";
import { Pill } from "@/components/TagPill/TagPill.styles";
import type { TagPillProps } from "@/components/TagPill/TagPill.types";

// A soft plunger pop on pointer entry makes skimming a wall of tags feel tactile with a mouse, pen, or touch.
export default function TagPill({ onPointerEnter, ...props }: TagPillProps) {
  const [playHover, , stopHover] = useSound("/sounds/plunger-immediate.mp3", { volume: 0.15 });

  // Restarting rather than overlapping keeps fast sweeps across tags from stacking into noise.
  function handlePointerEnter(event: PointerEvent<HTMLLIElement>) {
    stopHover();
    playHover();
    onPointerEnter?.(event);
  }

  return (
    <>
      <Pill {...props} onPointerEnter={handlePointerEnter} />
    </>
  );
}
