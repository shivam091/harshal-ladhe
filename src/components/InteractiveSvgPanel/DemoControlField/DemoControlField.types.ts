import type { SvgDemoControl, SvgDemoValue, SvgDemoValues } from "@/data/svg-demos";

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
