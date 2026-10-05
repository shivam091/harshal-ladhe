import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import ShaderPlayground from "@/components/ShaderPlayground";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Fragment Shader Playground";
const DESCRIPTION =
  "A mini Shadertoy in raw WebGL: write a GLSL fragment shader beside a live canvas, with iTime/iResolution/iMouse uniforms, inline compile errors, auto-generated sliders for annotated uniforms, and PNG export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/shader-playground"
});

/*
  Static server component wrapper — ShaderPlayground itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ShaderPlaygroundPage(): JSX.Element {
  return (
    <>
      <p>
        A fragment shader is a tiny program the GPU runs once for every pixel, all at the same time —
        which is why a dozen lines of GLSL can paint something no amount of CSS could. This
        playground runs yours in raw WebGL beside a live canvas, with the same <code>iTime</code>,{" "}
        <code>iResolution</code> and <code>iMouse</code> uniforms Shadertoy provides, so a snippet
        written around <code>mainImage()</code> pastes straight in.
      </p>
      <p>
        Edits recompile as you pause typing. When something doesn&apos;t compile, the error lands on
        the line that caused it in the editor&apos;s gutter while the canvas keeps showing the last
        version that worked, so a typo never blanks the screen. Add a comment like{" "}
        <code>{"// @slider 0 1 0.5"}</code> after a <code>uniform float</code>, or{" "}
        <code>{"// @color #ff8800"}</code> after a <code>uniform vec3</code>, and a control for it
        appears beside the canvas.
      </p>
      <p>
        Pause, scrub the time scale, drop the resolution if your GPU is struggling, save a frame as
        a PNG, or go full screen. Start from one of the preset cartridges, copy a permalink that
        carries your source and slider values, or step back through edits with undo/redo. Your work
        also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the shader playground…</p>}>
        <ShaderPlayground />
      </Suspense>
    </>
  );
}
