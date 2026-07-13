"use client";

import type { MouseEvent } from "react";
import { useSound } from "@/hooks/use-sound";
import { Pill } from "@/components/TagPill/TagPill.styles";
import type { TagPillProps } from "@/components/TagPill/TagPill.types";

// A soft plunger pop on hover makes skimming a wall of tags feel tactile without needing a click.
export default function TagPill({ onMouseEnter, ...props }: TagPillProps) {
  const [playHover, , stopHover] = useSound("/sounds/plunger-immediate.mp3", { volume: 0.15 });

  // Restarting rather than overlapping keeps fast sweeps across tags from stacking into noise.
  function handleMouseEnter(event: MouseEvent<HTMLLIElement>) {
    stopHover();
    playHover();
    onMouseEnter?.(event);
  }

  return (
    <>
      <Pill {...props} onMouseEnter={handleMouseEnter} />
    </>
  );
}
