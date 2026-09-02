import type { JSX } from "react";
import type { TextControlsProps } from "@/interfaces/text-effects";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/TextEffectsGenerator/Slider/Slider";
import { TextInput, HelperText } from "@/components/TextEffectsGenerator/TextControls/TextControls.styles";

// The subject itself — what the preview reads, how big/heavy it renders, and the page it sits on. Kept separate from the shadow/gradient layer panels since none of these fields belong to any one effect.
export default function TextControls({ state, actions }: TextControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor="text-effects-text">Text</FieldLabel>
        <TextInput id="text-effects-text" value={state.text} onChange={(event) => actions.setText(event.target.value)} onBlur={actions.commitDrag} maxLength={60} />
      </FieldWrapper>

      <Slider label="Font size" min={12} max={160} value={state.fontSize} suffix="px" onChange={(size) => actions.setFontSize(size)} onCommit={actions.commitDrag} />
      <Slider label="Font weight" min={100} max={900} value={state.fontWeight} onChange={(weight) => actions.setFontWeight(weight)} onCommit={actions.commitDrag} />

      <FieldWrapper>
        <FieldLabel htmlFor="text-effects-text-color">Text color</FieldLabel>
        <ColorInput
          id="text-effects-text-color"
          type="color"
          value={state.textColor}
          onChange={(event) => actions.setTextColor(event.target.value)}
          onBlur={actions.commitDrag}
        />
        {state.gradientFill.enabled && <HelperText>Hidden while the gradient fill is on.</HelperText>}
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="text-effects-page-color">Page color</FieldLabel>
        <ColorInput id="text-effects-page-color" type="color" value={state.pageColor} onChange={(event) => actions.setPageColor(event.target.value)} onBlur={actions.commitDrag} />
      </FieldWrapper>
    </>
  );
}

TextControls.displayName = "TextControls";
