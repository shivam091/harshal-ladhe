// Shared props for spring-animated icons whose only interaction is a boop.
export interface IconBoopProps {
  size?: number;
  // When provided, the parent controls the boop state; omit to let the icon boop itself on hover.
  isBooped?: boolean;
}
