import { parseShaderInfoLog } from "@/utils/shader-playground-info-log";
import { hexToVec3, resolveUniformValue } from "@/utils/shader-playground-uniforms";
import type { ShaderCompileResult, ShaderFrameUniforms, ShaderRenderer, ShaderUniformControl, ShaderUniformValue } from "@/components/ShaderPlayground/ShaderPlayground.types";

/*
  The Shadertoy built-ins, declared ahead of the user's code so a snippet pasted straight from
  shadertoy.com finds every name it expects. WebGL2 needs its own `out` colour variable (gl_FragColor
  is gone in GLSL ES 3.00); the name is deliberately unlikely to collide with anything a user writes.
*/
const WEBGL2_HEADER = `#version 300 es
precision highp float;
precision highp int;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
out vec4 shaderPlaygroundOutColor;
`;

// The same built-ins for the WebGL1 fallback — GLSL ES 1.00 has no #version line and writes through gl_FragColor instead.
const WEBGL1_HEADER = `precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform vec4 iMouse;
`;

// Appended after the user's code rather than prepended, so it never shifts their line numbers — only the header's length needs subtracting from the info log.
const WEBGL2_FOOTER = `
void main() {
  mainImage(shaderPlaygroundOutColor, gl_FragCoord.xy);
}
`;

// WebGL1's counterpart footer; the leading newline guards against a user's final line ending mid-comment.
const WEBGL1_FOOTER = `
void main() {
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

// One oversized triangle covers the whole viewport with three vertices and no diagonal seam, unlike a two-triangle quad.
const WEBGL2_VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// The vertex shader's GLSL ES 1.00 twin for the fallback context.
const WEBGL1_VERTEX = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Clip-space corners of the full-screen triangle — it overshoots to 3 so the visible [-1, 1] square is entirely inside it.
const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

// Union of the two context types, since every call the renderer makes exists on both.
type GLContext = WebGL2RenderingContext | WebGLRenderingContext;

// Counts lines the way the GLSL preprocessor does — a trailing newline starts a fresh (empty) line, which is exactly where the user's line 1 begins.
function countLines(text: string): number {
  return text.split("\n").length - 1;
}

// Compiles one stage and returns either the shader handle or its raw info log — the log is parsed by the caller, which alone knows how many header lines to discount.
function compileStage(gl: GLContext, type: number, source: string): { shader: WebGLShader | null; log: string } {
  const shader = gl.createShader(type);
  if (!shader) return { shader: null, log: "ERROR: could not allocate a shader object" };
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return { shader, log: "" };
  const log = gl.getShaderInfoLog(shader) ?? "ERROR: shader failed to compile";
  gl.deleteShader(shader);
  return { shader: null, log };
}

/*
  Builds a renderer for one canvas, preferring WebGL2 and falling back to WebGL1, or returns null
  when the browser offers neither (or the GPU is blocklisted) so the UI can say so plainly.
  preserveDrawingBuffer stays false for speed — a screenshot simply renders a fresh frame and reads
  it back in the same task, before the browser gets a chance to clear it.
*/
export function createShaderRenderer(canvas: HTMLCanvasElement): ShaderRenderer | null {
  const attributes: WebGLContextAttributes = { antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false };
  const gl2 = canvas.getContext("webgl2", attributes);
  const context: GLContext | null = gl2 ?? canvas.getContext("webgl", attributes);
  if (!context) return null;
  // Rebound as non-null because the hoisted helper functions below can't see the narrowing above.
  const gl: GLContext = context;

  const isWebGL2 = gl2 !== null;
  const header = isWebGL2 ? WEBGL2_HEADER : WEBGL1_HEADER;
  const footer = isWebGL2 ? WEBGL2_FOOTER : WEBGL1_FOOTER;
  const headerLineCount = countLines(header);

  const vertex = compileStage(gl, gl.VERTEX_SHADER, isWebGL2 ? WEBGL2_VERTEX : WEBGL1_VERTEX);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);

  let program: WebGLProgram | null = null;
  // Looked up once per program and cached — getUniformLocation is a string lookup the driver shouldn't be asked to repeat sixty times a second.
  let locations = new Map<string, WebGLUniformLocation | null>();

  // Cached lookup against the live program; a uniform the compiler optimised away resolves to null and its uniform*() calls quietly no-op.
  function locate(name: string): WebGLUniformLocation | null {
    if (!program) return null;
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name) ?? null;
  }

  // Swaps in the new program only once it has compiled AND linked, so a half-typed edit never blanks the canvas — the last good frame keeps rendering underneath the error markers.
  function compile(userSource: string): ShaderCompileResult {
    if (gl.isContextLost()) return { ok: false, errors: [{ line: null, message: "The WebGL context was lost — waiting for the browser to restore it." }] };
    if (!vertex.shader) return { ok: false, errors: [{ line: null, message: vertex.log }] };

    const userLineCount = countLines(`${userSource}\n`);
    const fragment = compileStage(gl, gl.FRAGMENT_SHADER, `${header}${userSource}${footer}`);
    if (!fragment.shader) {
      const errors = parseShaderInfoLog(fragment.log, headerLineCount, userLineCount);
      return { ok: false, errors: errors.length > 0 ? errors : [{ line: null, message: fragment.log.trim() || "Shader failed to compile." }] };
    }

    const next = gl.createProgram();
    if (!next) {
      gl.deleteShader(fragment.shader);
      return { ok: false, errors: [{ line: null, message: "Could not allocate a WebGL program." }] };
    }
    gl.attachShader(next, vertex.shader);
    gl.attachShader(next, fragment.shader);
    gl.bindAttribLocation(next, 0, "aPosition");
    gl.linkProgram(next);
    // Once linked, the program keeps its own copy — flagging the stage for deletion now means it's freed as soon as the program is.
    gl.detachShader(next, fragment.shader);
    gl.deleteShader(fragment.shader);

    if (!gl.getProgramParameter(next, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(next) ?? "";
      gl.deleteProgram(next);
      const errors = parseShaderInfoLog(log, headerLineCount, userLineCount);
      return { ok: false, errors: errors.length > 0 ? errors : [{ line: null, message: log.trim() || "Shader failed to link." }] };
    }

    if (program) gl.deleteProgram(program);
    program = next;
    locations = new Map();
    return { ok: true, errors: [] };
  }

  // Draws one frame with whatever program is live; sizing the drawing buffer is the caller's job, since only it knows the resolution scale.
  function render(frame: ShaderFrameUniforms, controls: ShaderUniformControl[], values: Record<string, ShaderUniformValue>): void {
    if (!program || gl.isContextLost()) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3f(locate("iResolution"), canvas.width, canvas.height, 1);
    gl.uniform1f(locate("iTime"), frame.time);
    gl.uniform1f(locate("iTimeDelta"), frame.timeDelta);
    gl.uniform1i(locate("iFrame"), frame.frame);
    gl.uniform4f(locate("iMouse"), ...frame.mouse);

    for (const control of controls) {
      const value = resolveUniformValue(control, values);
      if (typeof value === "number") gl.uniform1f(locate(control.name), value);
      else gl.uniform3f(locate(control.name), ...hexToVec3(value));
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // Releases every handle this renderer created; the context itself goes when the canvas does, so nothing explicitly loses it.
  function dispose(): void {
    if (gl.isContextLost()) return;
    if (program) gl.deleteProgram(program);
    if (vertex.shader) gl.deleteShader(vertex.shader);
    gl.deleteBuffer(buffer);
    program = null;
    locations = new Map();
  }

  return { isWebGL2, compile, render, dispose };
}
