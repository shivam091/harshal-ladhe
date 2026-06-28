import { useState } from "react";
import { useBoop } from "@/hooks/use-boop";

// One shared set of states so every toggle icon reacts to pointer interaction the same way.
export type IconToggleStatus = "idle" | "hovering" | "pressed" | "booped";

/*
  "pressed" reflects the pointer actually being down, not the toggle's on/off state, which the
  icon conveys through its own props.
*/
export function useToggleIconStatus() {
  // Whether the pointer is currently over the icon.
  const [isHovering, setIsHovering] = useState(false);
  // Whether the pointer is currently held down on the icon.
  const [isPressed, setIsPressed] = useState(false);
  // One-shot "just interacted" pulse, separate from the hover/press states above.
  const [isBooped, triggerBoop] = useBoop();

  // Precedence: an active press always wins, then a boop pulse, then plain hover.
  const status: IconToggleStatus = isPressed ? "pressed" : isBooped ? "booped" : isHovering ? "hovering" : "idle";

  // Pointer enters the icon — marks it hovering and fires the boop pulse.
  function onPointerEnter() {
    setIsHovering(true);
    triggerBoop();
  }

  // Pointer leaves the icon — clears both hover and press so a stale press can't linger.
  function onPointerLeave() {
    setIsHovering(false);
    setIsPressed(false);
  }

  // Pointer is pressed down on the icon.
  function onPointerDown() {
    setIsPressed(true);
  }

  // Pointer is released — ends the press regardless of where it's released.
  function onPointerUp() {
    setIsPressed(false);
  }

  return { status, onPointerEnter, onPointerLeave, onPointerDown, onPointerUp };
}
