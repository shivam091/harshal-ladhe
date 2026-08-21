/*
  Value type a single control produces — kept broad since one values object holds every control's
  current value regardless of type.
*/
export type SvgDemoValue = number | string | boolean;

// Live values keyed by control id.
export type SvgDemoValues = Record<string, SvgDemoValue>;

// A numeric slider control — produces a number.
export interface SvgDemoRangeControl {
  id: string;
  label: string;
  type: "range";
  min: number;
  // A function derives the bound from the demo's live values (e.g. rx capped at width / 2) instead of a fixed number.
  max: number | ((values: SvgDemoValues) => number);
  /*
    Defaults to 1 when omitted. Use "any" when max can be fractional (e.g. derived from another value) — an integer
    step paired with a fractional max leaves the native thumb's step grid unable to land on the true value, so it
    visually snaps back to the nearest valid step instead of tracking the number the control actually holds.
  */
  step?: number | "any";
  defaultValue: number;
}

// A color-picker control — produces a hex string.
export interface SvgDemoColorControl {
  id: string;
  label: string;
  type: "color";
  defaultValue: string;
}

// A fixed-choice dropdown — produces one of `options`.
export interface SvgDemoSelectControl {
  id: string;
  label: string;
  type: "select";
  options: string[];
  defaultValue: string;
}

// An on/off toggle — produces a boolean.
export interface SvgDemoCheckboxControl {
  id: string;
  label: string;
  type: "checkbox";
  defaultValue: boolean;
}

// Discriminated union of every control an InteractiveSvgPanel demo can expose — `type` narrows to the matching shape.
export type SvgDemoControl = SvgDemoRangeControl | SvgDemoColorControl | SvgDemoSelectControl | SvgDemoCheckboxControl;

// Static metadata for one interactive SVG demo — resolved by slug, mirrors SandboxMeta's registry pattern.
export interface SvgDemoMeta {
  slug: string;
  title: string;
  controls: SvgDemoControl[];
  // Builds the SVG markup for the current control values — the same string drives the live code view and the rendered preview.
  render: (values: SvgDemoValues) => string;
}

// Props for the <InteractiveSvgPanel> MDX component.
export interface InteractiveSvgPanelProps {
  slug: string;
}

/*
  Props for DemoControlField — one form field for a single control. `value`'s runtime type always
  matches `control.type` (both come from the same registry entry), even though the type checker
  can't link them through this prop split, hence the per-case casts inside the component.
*/
export interface DemoControlFieldProps {
  control: SvgDemoControl;
  value: SvgDemoValue;
  // Every control's current value — only read by range controls whose `max` derives from another control.
  values: SvgDemoValues;
  onChange: (id: string, value: SvgDemoValue) => void;
}
