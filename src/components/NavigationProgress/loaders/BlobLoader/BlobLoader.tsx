import type { JSX } from "react";
import { useId } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { BLOB_KEYFRAMES } from "@/components/NavigationProgress/loaders/BlobLoader/BlobLoader.helpers";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { BlobSvg, BlobGroup, BlobPath } from "@/components/NavigationProgress/loaders/BlobLoader/BlobLoader.styles";

// Loops through all four keyframe shapes and back to the first, so the cycle has no visible seam.
const BLOB_VALUES = [...BLOB_KEYFRAMES, BLOB_KEYFRAMES[0]].join(";");

/*
 * Morphing blob — a single path cycles through four hand-generated shapes via native SMIL `d`
 * interpolation while a slow independent spin turns the whole thing. Freezes its spin and
 * pops slightly on completion.
 */
export default function BlobLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const gradientId = useId();
  const done = state === "done";

  return (
    <>
      {backdrop && <Backdrop />}
      <BlobSvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-fg-attention)" />
            <stop offset="50%" stopColor="var(--color-fg-success)" />
            <stop offset="100%" stopColor="var(--color-fg-accent)" />
          </linearGradient>
        </defs>

        <BlobGroup data-state={done ? "done" : undefined}>
          <BlobPath fill={`url(#${gradientId})`} data-state={done ? "done" : undefined}>
            <animate attributeName="d" values={BLOB_VALUES} dur="6s" repeatCount="indefinite" />
          </BlobPath>
        </BlobGroup>
      </BlobSvg>
    </>
  );
}

BlobLoader.displayName = "BlobLoader";
