import type { JSX } from "react";
import { resolveUniformValue } from "@/utils/shader-playground-uniforms";
import Slider from "@/components/ShaderPlayground/Slider/Slider";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ShaderPlayground/ShaderPlayground.styles";
import { ControlGrid, ColorField, ColorSwatch, ColorHex, UniformName, AnnotationExample, ResetLink } from "@/components/ShaderPlayground/UniformControls/UniformControls.styles";
import type { UniformControlsProps } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Enough decimal places to show a slider's own step without trailing noise — a 0.01 step reads to two places, a whole-number step to none.
function decimalsForStep(step: number): number {
  if (step >= 1) return 0;
  return Math.min(4, Math.ceil(-Math.log10(step)));
}

/*
  The tool's distinguishing trick: a control for every `@slider`/`@color`-annotated uniform in the
  source, regenerated whenever the (debounced) source changes. Values commit to the undo stack on
  release, the same live/checkpoint split as every other goodie's sliders, so one drag is one undo.
*/
export default function UniformControls({ controls, state, actions }: UniformControlsProps): JSX.Element {
  const hasOverrides = controls.some((control) => control.name in state.uniformValues);

  return (
    <>
      <SectionCard>
        <PanelTitle>Uniforms</PanelTitle>
        {controls.length === 0 ? (
          <>
            <PanelHint>Annotate a uniform and a control appears here:</PanelHint>
            <AnnotationExample>
              {"uniform float uSpeed; // @slider 0 4 1\nuniform vec3 uTint; // @color #ff8800"}
            </AnnotationExample>
          </>
        ) : (
          <>
            <ControlGrid>
              {controls.map((control) => {
                const value = resolveUniformValue(control, state.uniformValues);
                if (control.kind === "slider") {
                  return (
                    <Slider
                      key={control.name}
                      label={control.name}
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      decimals={decimalsForStep(control.step)}
                      value={value as number}
                      onChange={(next) => actions.setUniformValue(control.name, next)}
                      onCommit={actions.commitEdit}
                    />
                  );
                }
                return (
                  <ColorField key={control.name}>
                    <ColorSwatch
                      type="color"
                      value={value as string}
                      onChange={(event) => actions.setUniformValue(control.name, event.target.value)}
                      onBlur={actions.commitEdit}
                    />
                    <UniformName>{control.name}</UniformName>
                    <ColorHex>{value as string}</ColorHex>
                  </ColorField>
                );
              })}
            </ControlGrid>
            <ResetLink type="button" onClick={actions.resetUniforms} disabled={!hasOverrides}>
              Reset to annotated defaults
            </ResetLink>
          </>
        )}
      </SectionCard>
    </>
  );
}

UniformControls.displayName = "UniformControls";
