"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX, PointerEvent } from "react";
import { useIsOnscreen } from "@/hooks/use-is-onscreen";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useRequestAnimationFrameLoop } from "@/hooks/use-request-animation-frame-loop";
import { createShaderRenderer } from "@/utils/shader-playground-webgl";
import { PlayIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import Slider from "@/components/ShaderPlayground/Slider/Slider";
import { CoinButton } from "@/components/ShaderPlayground/ShaderPlayground.styles";
import {
  Bezel,
  Screen,
  Canvas,
  ScreenMessage,
  ScreenBadge,
  ControlDeck,
  DeckGroup,
  DeckSlider,
  ArcadeButton,
  PauseGlyph,
  ScaleOption,
  DeckLabel,
  FpsReadout
} from "@/components/ShaderPlayground/ShaderCanvas/ShaderCanvas.styles";
import type { ShaderCanvasProps, ShaderFrameUniforms, ShaderRenderer } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Quarter steps down to 0.25× — enough range for a heavy ray-marcher on an integrated GPU without offering settings nobody would pick.
const RESOLUTION_SCALES = [0.25, 0.5, 0.75, 1] as const;

// Retina screens past 2× quadruple the fragment count for detail nobody can see in a moving shader, so the device ratio is capped here.
const MAX_DEVICE_PIXEL_RATIO = 2;

// A tab switch or a long GC pause shouldn't make iTime leap forward by seconds — one frame never advances the clock by more than this.
const MAX_FRAME_DELTA_S = 0.1;

// How often the FPS readout refreshes — twice a second keeps it legible instead of a flickering blur of digits.
const FPS_SAMPLE_MS = 500;

// Resizes the drawing buffer to the canvas's CSS box × device ratio × resolution scale, and reports whether it changed so a paused shader knows to redraw at the new size.
function syncCanvasSize(canvas: HTMLCanvasElement, resolutionScale: number): boolean {
  const ratio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO) * resolutionScale;
  const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
  const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
  if (canvas.width === width && canvas.height === height) return false;
  canvas.width = width;
  canvas.height = height;
  return true;
}

// Pointer position in drawing-buffer pixels with a bottom-left origin — gl_FragCoord's own convention, which is what Shadertoy's iMouse is measured in.
function toFragCoord(event: PointerEvent<HTMLCanvasElement>): [number, number] {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const y = (1 - (event.clientY - rect.top) / rect.height) * canvas.height;
  return [x, y];
}

/*
  The CRT screen plus its control deck. Everything per-frame (clock, mouse, latest uniform values)
  lives in refs so the render loop never re-renders React; only the FPS readout and a handful of
  status flags are state. The loop itself only runs while the screen is on-screen, the tab is
  visible and a context exists — and when paused it idles without touching the GPU, redrawing
  only when something it depends on actually changes.
*/
export default function ShaderCanvas({ source, controls, uniformValues, onCompile }: ShaderCanvasProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const bezelRef = useRef<HTMLDivElement>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<ShaderRenderer | null>(null);

  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion);
  const [timeScale, setTimeScale] = useState(1);
  const [resolutionScale, setResolutionScale] = useState<number>(1);
  const [fps, setFps] = useState(0);
  const [contextState, setContextState] = useState<"pending" | "ready" | "lost" | "unsupported">("pending");
  const [glVersion, setGlVersion] = useState<"WebGL2" | "WebGL1" | null>(null);
  const [isTabVisible, setIsTabVisible] = useState(() => typeof document === "undefined" || document.visibilityState === "visible");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen] = useState(() => typeof document !== "undefined" && document.fullscreenEnabled);
  const isOnscreen = useIsOnscreen(bezelRef);

  // Latest props/settings mirrored into refs for the rAF tick and the context-restore handler, which must never close over a stale render.
  const sourceRef = useRef(source);
  const onCompileRef = useRef(onCompile);
  const controlsRef = useRef(controls);
  const valuesRef = useRef(uniformValues);
  const playingRef = useRef(isPlaying);
  const timeScaleRef = useRef(timeScale);
  const resolutionScaleRef = useRef(resolutionScale);
  // Set whenever a paused screen has something new to show — the tick clears it after drawing.
  const dirtyRef = useRef(true);
  const clockRef = useRef({ time: 0, frame: 0, last: null as number | null });
  const fpsRef = useRef({ frames: 0, since: 0 });
  const mouseRef = useRef<ShaderFrameUniforms["mouse"]>([0, 0, 0, 0]);
  const pointerDownRef = useRef(false);
  // The source the live renderer last compiled — lets the source effect skip the mount-time duplicate of the compile bootRenderer has just done.
  const compiledRef = useRef<string | null>(null);

  // Ref mirrors are synced after commit (never during render, per the react-hooks/refs rule); any change also flags a redraw.
  useEffect(() => {
    sourceRef.current = source;
    onCompileRef.current = onCompile;
    controlsRef.current = controls;
    valuesRef.current = uniformValues;
    playingRef.current = isPlaying;
    timeScaleRef.current = timeScale;
    resolutionScaleRef.current = resolutionScale;
    dirtyRef.current = true;
  });

  // Creates the renderer and compiles whatever source is current — shared by first mount and by a restored context, whose old GL handles are all invalid.
  const bootRenderer = useCallback((canvas: HTMLCanvasElement) => {
    const renderer = createShaderRenderer(canvas);
    rendererRef.current = renderer;
    if (!renderer) {
      setContextState("unsupported");
      return;
    }
    setGlVersion(renderer.isWebGL2 ? "WebGL2" : "WebGL1");
    setContextState("ready");
    compiledRef.current = sourceRef.current;
    onCompileRef.current(renderer.compile(sourceRef.current));
    dirtyRef.current = true;
  }, []);

  /*
    A callback ref (with React 19's cleanup return) rather than an effect, so the renderer is born
    and disposed with the canvas element itself. Context loss is handled here too: preventDefault
    on "lost" is what tells the browser we intend to restore, and "restored" rebuilds from scratch.
  */
  const canvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      canvasElementRef.current = canvas;
      if (!canvas) return;

      const handleLost = (event: Event) => {
        event.preventDefault();
        rendererRef.current = null;
        setContextState("lost");
      };
      const handleRestored = () => bootRenderer(canvas);

      canvas.addEventListener("webglcontextlost", handleLost);
      canvas.addEventListener("webglcontextrestored", handleRestored);
      bootRenderer(canvas);

      return () => {
        canvas.removeEventListener("webglcontextlost", handleLost);
        canvas.removeEventListener("webglcontextrestored", handleRestored);
        rendererRef.current?.dispose();
        rendererRef.current = null;
        canvasElementRef.current = null;
      };
    },
    [bootRenderer]
  );

  // Recompiles on every (already debounced) source change; on failure the renderer keeps its previous program, so the screen never goes blank mid-edit.
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || compiledRef.current === source) return;
    compiledRef.current = source;
    onCompileRef.current(renderer.compile(source));
    dirtyRef.current = true;
  }, [source]);

  // A hidden tab gets no rAF callbacks anyway, but tracking it explicitly also stops the clock from counting the time away.
  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Follows the real fullscreen state, since Esc or the browser's own UI can leave fullscreen without touching our button.
  useEffect(() => {
    const handleChange = () => setIsFullscreen(document.fullscreenElement === bezelRef.current);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  // Draws one frame unconditionally — the loop's body, and also what a screenshot calls so it reads back a freshly drawn buffer.
  const drawFrame = useCallback((delta: number) => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const clock = clockRef.current;
    clock.time += delta;
    renderer.render({ time: clock.time, timeDelta: delta, frame: clock.frame, mouse: mouseRef.current }, controlsRef.current, valuesRef.current);
    if (delta > 0) clock.frame += 1;
    dirtyRef.current = false;
  }, []);

  // One rAF tick: advance the clock if playing, resize if the box changed, and skip the GPU entirely when paused with nothing new to show.
  const tick = useCallback(() => {
    const canvas = canvasElementRef.current;
    if (!canvas || !rendererRef.current) return;
    const now = performance.now();
    const clock = clockRef.current;
    const realDelta = clock.last === null ? 0 : Math.min((now - clock.last) / 1000, MAX_FRAME_DELTA_S);
    clock.last = now;

    const resized = syncCanvasSize(canvas, resolutionScaleRef.current);
    if (!playingRef.current && !dirtyRef.current && !resized) return;
    drawFrame(playingRef.current ? realDelta * timeScaleRef.current : 0);

    if (!playingRef.current) return;
    const sample = fpsRef.current;
    sample.frames += 1;
    if (sample.since === 0) sample.since = now;
    if (now - sample.since >= FPS_SAMPLE_MS) {
      setFps(Math.round((sample.frames * 1000) / (now - sample.since)));
      sample.frames = 0;
      sample.since = now;
    }
  }, [drawFrame]);

  const isLoopRunning = isOnscreen && isTabVisible && contextState === "ready";
  useRequestAnimationFrameLoop(tick, isLoopRunning);

  // Whenever the loop stops, forget the last timestamp so resuming doesn't count the gap as elapsed shader time.
  useEffect(() => {
    if (isLoopRunning) return;
    clockRef.current.last = null;
    fpsRef.current = { frames: 0, since: 0 };
  }, [isLoopRunning]);

  // Shadertoy semantics: zw holds the click origin (positive while held), xy follows the pointer only while a button is down.
  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerDownRef.current = true;
    const [x, y] = toFragCoord(event);
    mouseRef.current = [x, y, x, y];
    dirtyRef.current = true;
  }

  // Drags update xy only; hovering without a button down leaves iMouse untouched, as on Shadertoy.
  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!pointerDownRef.current) return;
    const [x, y] = toFragCoord(event);
    const [, , z, w] = mouseRef.current;
    mouseRef.current = [x, y, z, w];
    dirtyRef.current = true;
  }

  // Release negates zw — the signal shaders use to tell "was clicked here" from "is being held here".
  function handlePointerUp() {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;
    const [x, y, z, w] = mouseRef.current;
    mouseRef.current = [x, y, -Math.abs(z), -Math.abs(w)];
    dirtyRef.current = true;
  }

  // Back to iTime = 0 and iFrame = 0 without recompiling — the quickest way to replay a shader's opening.
  function restart() {
    clockRef.current.time = 0;
    clockRef.current.frame = 0;
    dirtyRef.current = true;
  }

  // Renders and reads back in the same task — with preserveDrawingBuffer off, that's the only moment the buffer is guaranteed to still hold the frame.
  function screenshot() {
    const canvas = canvasElementRef.current;
    if (!canvas || !rendererRef.current) return;
    drawFrame(0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shader-playground-${Date.now()}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  // Fullscreens the bezel rather than the bare canvas, so the CRT framing and the scale of the screen message come along.
  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void bezelRef.current?.requestFullscreen();
  }

  const screenMessage =
    contextState === "unsupported"
      ? "WebGL isn't available in this browser"
      : contextState === "lost"
        ? "Signal lost — restoring the WebGL context…"
        : null;

  return (
    <>
      <Bezel ref={bezelRef}>
        <Screen>
          <Canvas
            ref={canvasRef}
            role="img"
            aria-label={`Live render of the fragment shader${isPlaying ? "" : " (paused)"}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            Your browser can&apos;t display a canvas.
          </Canvas>
          {screenMessage && <ScreenMessage role="status">{screenMessage}</ScreenMessage>}
          {!screenMessage && !isPlaying && <ScreenBadge aria-hidden="true">Paused</ScreenBadge>}
        </Screen>
      </Bezel>

      <ControlDeck>
        <DeckGroup>
          <Tooltip content={isPlaying ? "Pause" : "Play"}>
            <ArcadeButton type="button" onClick={() => setIsPlaying((prev) => !prev)} aria-label={isPlaying ? "Pause" : "Play"} aria-pressed={isPlaying}>
              {isPlaying ? <PauseGlyph aria-hidden="true" /> : <PlayIcon size={20} />}
            </ArcadeButton>
          </Tooltip>
          <CoinButton type="button" onClick={restart}>
            <RefreshIcon size={14} />
            Restart
          </CoinButton>
        </DeckGroup>

        <DeckSlider>
          <Slider label="Time scale" min={0} max={4} step={0.05} decimals={2} suffix="×" value={timeScale} onChange={setTimeScale} onCommit={() => undefined} />
        </DeckSlider>

        <DeckGroup role="group" aria-label="Resolution scale">
          <DeckLabel aria-hidden="true">Res</DeckLabel>
          {RESOLUTION_SCALES.map((scale) => (
            <ScaleOption key={scale} type="button" aria-pressed={resolutionScale === scale} onClick={() => setResolutionScale(scale)}>
              {scale}×
            </ScaleOption>
          ))}
        </DeckGroup>

        <DeckGroup>
          <FpsReadout aria-live="off" aria-label="Frames per second">
            <DeckLabel>FPS</DeckLabel>
            {isPlaying && isLoopRunning ? String(fps).padStart(3, "0") : "---"}
          </FpsReadout>
          {glVersion && <DeckLabel>{glVersion}</DeckLabel>}
        </DeckGroup>

        <DeckGroup>
          <CoinButton type="button" onClick={screenshot} disabled={contextState !== "ready"}>
            Save PNG
          </CoinButton>
          {canFullscreen && (
            <CoinButton type="button" onClick={toggleFullscreen} aria-pressed={isFullscreen}>
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </CoinButton>
          )}
        </DeckGroup>
      </ControlDeck>
    </>
  );
}

ShaderCanvas.displayName = "ShaderCanvas";
