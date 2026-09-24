"use client";

import type { JSX } from "react";
import type { PlayButtonProps } from "@/components/PlayButton/PlayButton.types";
import RotatingPlayIcon from "@/components/PlayButton/RotatingPlayIcon";
import { Root } from "@/components/PlayButton/PlayButton.styles";

// Fixes size, shape and icon so every play trigger looks the same and only interaction props vary.
export default function PlayButton(props: PlayButtonProps): JSX.Element {
  return (
    <>
      <Root type="button" size="lg" shape="square" iconLeft={<RotatingPlayIcon />} {...props} />
    </>
  );
}

PlayButton.displayName = "PlayButton";
