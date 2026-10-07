"use client";

import type { JSX } from "react";
import { FieldWrapper, FieldLabel, CheckboxRow, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { AlbumLeaf, PanelTitle, HintText, TextInput } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import type { OptionsPanelProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

/*
  Album-wide settings: the currentColor switch (one undo step per toggle) and the path the
  external-file snippets point at (typed freely, committed as one step on blur).
*/
export default function OptionsPanel({ state, actions }: OptionsPanelProps): JSX.Element {
  return (
    <>
      <AlbumLeaf>
        <PanelTitle data-plate="Pl. II">Mounting options</PanelTitle>

        <CheckboxRow>
          <CheckboxInput
            id="icon-sprite-current-color"
            type="checkbox"
            checked={state.options.currentColor}
            aria-describedby="icon-sprite-current-color-hint"
            onChange={(event) => actions.setCurrentColor(event.target.checked)}
          />
          <FieldLabel htmlFor="icon-sprite-current-color">Swap fill/stroke colours for currentColor</FieldLabel>
        </CheckboxRow>
        <HintText id="icon-sprite-current-color-hint">
          Lets each icon follow the surrounding text colour. Gradients and masks keep their own colours.
        </HintText>

        <FieldWrapper>
          <FieldLabel htmlFor="icon-sprite-path">External sprite path</FieldLabel>
          <TextInput
            id="icon-sprite-path"
            type="text"
            spellCheck={false}
            autoComplete="off"
            value={state.options.spritePath}
            onChange={(event) => actions.setSpritePath(event.target.value)}
            onBlur={actions.commitEdit}
          />
        </FieldWrapper>
      </AlbumLeaf>
    </>
  );
}

OptionsPanel.displayName = "OptionsPanel";
