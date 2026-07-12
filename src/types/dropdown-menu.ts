// Which edge of the trigger the panel opens from.
export type Side = "top" | "right" | "bottom" | "left";

// Shared between Root, Tip, and Content so they stay in sync without prop-drilling.
export type DropdownCtxType = { isOpen: boolean; autoSide: Side };
