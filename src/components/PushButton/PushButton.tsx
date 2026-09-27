"use client";

import type { JSX } from "react";
import Button from "@/components/Button";
import { useSound } from "@/hooks/use-sound";
import { sampleOne } from "@/utils/random";
import type { PushButtonProps } from "@/components/PushButton/PushButton.types";

/*
  Generic Button wrapper that adds a press/release sound sampled from a shared sprite sheet:
  pointerdown plays a random "down" region, the next pointerup a random "up" region, each cutting
  the previous one short via stop(). Lets any button feel physically "pressed" (pagination's Show
  more, etc.) without each call site re-wiring the sprite, sampling, and pointer listeners itself.
*/
export default function PushButton({ sound, ...rest }: PushButtonProps): JSX.Element {
  const { src, sprite, downIds, upIds, volume } = sound;
  const [playSprite, { stop: stopSprite }] = useSound(src, { sprite, volume });

  function handleRelease() {
    stopSprite();
    playSprite({ id: sampleOne(upIds) });
  }

  function handlePress() {
    stopSprite();
    playSprite({ id: sampleOne(downIds) });
    window.addEventListener("pointerup", handleRelease, { once: true });
  }

  return <Button {...rest} onPointerDown={handlePress} />;
}

PushButton.displayName = "PushButton";
