import type { JSX } from "react";
import { svgPathMorphPresets } from "@/data/svg-path-morph-presets";
import { elixirTone } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { ParchmentCard, PanelTitle } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import { Shelf, Jar, JarSvg, JarName } from "@/components/SvgPathMorph/PresetGallery/PresetGallery.styles";
import type { PresetGalleryProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

/*
  The ingredient shelf: each preset as a stoppered jar with its keyframes drawn faintly over one
  another. The raw preset strings are drawn as-is (every preset lives in a 0–100 box), so the
  thumbnails cost no parsing or matching at all.
*/
export default function PresetGallery({ actions }: PresetGalleryProps): JSX.Element {
  return (
    <>
      <ParchmentCard aria-labelledby="morph-presets-title">
        <PanelTitle id="morph-presets-title">Ingredient shelf</PanelTitle>
        <Shelf>
          {svgPathMorphPresets.map((preset) => (
            <Jar key={preset.slug} type="button" onClick={() => actions.applyPreset(preset)} aria-label={`Load the ${preset.name} preset`}>
              <JarSvg viewBox="-6 -6 112 112" aria-hidden="true">
                {preset.keyframes.map((d, index) => (
                  <path
                    key={index}
                    d={d}
                    style={
                      preset.renderMode === "stroke"
                        ? { fill: "none", stroke: elixirTone(index), strokeWidth: 6, strokeLinecap: "round", opacity: 0.8 }
                        : { fill: elixirTone(index), fillOpacity: 0.35, stroke: elixirTone(index), strokeWidth: 2 }
                    }
                  />
                ))}
              </JarSvg>
              <JarName>{preset.name}</JarName>
            </Jar>
          ))}
        </Shelf>
      </ParchmentCard>
    </>
  );
}

PresetGallery.displayName = "PresetGallery";
