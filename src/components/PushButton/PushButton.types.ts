import type * as React from "react";
import type { ButtonBaseProps } from "@/components/Button/Button.types";
import type { SpriteMap } from "@/hooks/use-sound";

/*
  A press/release sound sourced from a single shared sprite sheet — `downIds`/`upIds` are sampled
  randomly on pointerdown/pointerup respectively, so repeated presses don't sound identical.
*/
export interface PushButtonSound {
  // Path to the sprite audio file (e.g. "/sounds/show-more-sprite.mp3").
  src: string;
  sprite: SpriteMap;
  downIds: readonly string[];
  upIds: readonly string[];
  volume?: number;
}

/*
  Same shape as Button's plain-<button> mode, minus onPointerDown/onPointerUp — PushButton owns
  those itself to drive the press/release sound.
*/
export type PushButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | "onPointerDown" | "onPointerUp"> & {
    sound: PushButtonSound;
  };
