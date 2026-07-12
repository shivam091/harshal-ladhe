import type { Side } from "@/components/DropdownMenu/DropdownMenu.types";

// Picks the roomiest side so the panel is least likely to be clipped by the viewport.
export function computeSide(rect: DOMRect): Side {
  const spaceRight = window.innerWidth  - rect.right;
  const spaceLeft  = rect.left;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const max = Math.max(spaceRight, spaceLeft, spaceBelow, spaceAbove);

  if (max === spaceBelow) return "bottom";
  if (max === spaceAbove) return "top";
  if (max === spaceLeft)  return "left";

  return "right";
}
