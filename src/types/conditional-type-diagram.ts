// The two ways a conditional type can be applied to a union: "distributive" spreads the check
// across each member independently (the naked-type-parameter case), "non-distributive" wraps the
// checked type so the union is evaluated as one single value instead.
export type ConditionalTypeDiagramVariant = "distributive" | "non-distributive";
