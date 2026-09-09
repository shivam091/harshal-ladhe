import type { Ref } from "react";

interface TextInputProps {
  label: string;
  ref?: Ref<HTMLInputElement>;
}

// React 19: `ref` just shows up in props like any other — no forwardRef() wrapper, no separate
// (props, ref) signature. TypeScript sees it because Ref<T> was added to the props type above.
export default function TextInput({ label, ref }: TextInputProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input ref={ref} className="field-input" type="text" />
    </label>
  );
}
