import type { SvgDemoControl, SvgDemoValue, SvgDemoValues } from "@/data/svg-demos";

/*
  `value` always matches `control.type` at runtime (same registry entry), but TypeScript can't link
  them through this prop split, hence the per-case casts in the component.
*/
export interface DemoControlFieldProps {
  control: SvgDemoControl;
  value: SvgDemoValue;
  // Every control's current value — only read by range controls whose `max` derives from another control.
  values: SvgDemoValues;
  onChange: (id: string, value: SvgDemoValue) => void;
}
