"use client";

import type { JSX } from "react";
import type { RemoveButtonProps } from "@/components/RemoveButton/RemoveButton.types";
import RotatingCloseIcon from "@/components/RemoveButton/RotatingCloseIcon";
import { Root } from "@/components/RemoveButton/RemoveButton.styles";

// Fixes size, shape, intent and icon so every remove trigger looks the same and only interaction props vary.
export default function RemoveButton(props: RemoveButtonProps): JSX.Element {
  return (
    <>
      <Root type="button" size="sm" shape="square" variant="ghost" intent="danger" iconLeft={<RotatingCloseIcon />} {...props} />
    </>
  );
}

RemoveButton.displayName = "RemoveButton";
