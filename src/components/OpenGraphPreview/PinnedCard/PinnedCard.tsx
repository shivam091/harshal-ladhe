"use client";

import type { CSSProperties, JSX } from "react";
import { SunIcon, MoonIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { PinFrame, PushPin, CardHeader, ModeButton, Surface } from "@/components/OpenGraphPreview/PinnedCard/PinnedCard.styles";
import type { PinnedCardProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// The pinboard frame shared by every platform card — the tilt arrives as a prop (a CSS variable, not a class) so each card can hang at its own angle from one stylesheet.
export default function PinnedCard({ label, tilt, mode, onModeChange, children }: PinnedCardProps): JSX.Element {
  const nextMode = mode === "light" ? "dark" : "light";
  const toggleLabel = `Show ${label} preview in ${nextMode} mode`;

  return (
    <>
      <PinFrame style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
        <PushPin aria-hidden="true" />
        <CardHeader>
          <span>{label}</span>
          <Tooltip content={nextMode === "dark" ? "Dark mode" : "Light mode"}>
            <ModeButton type="button" aria-label={toggleLabel} onClick={() => onModeChange(nextMode)}>
              {mode === "light" ? <MoonIcon size={14} /> : <SunIcon size={14} />}
            </ModeButton>
          </Tooltip>
        </CardHeader>
        <Surface data-mode={mode}>{children}</Surface>
      </PinFrame>
    </>
  );
}

PinnedCard.displayName = "PinnedCard";
