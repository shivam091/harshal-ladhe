import { useEffect, useRef, useState } from "react";
import "./shared/range-slider.css";
import { positionRangeBubble } from "./rangeBubble";
import { SHAPES, getEdges, rotateX, rotateY } from "./shapes";

const UNIT = 90;
const CUBE = SHAPES.cube;
const EDGES = getEdges(CUBE);
const TILT = -0.45; // fixed X-axis tilt so the cube reads as 3D even before it starts spinning

type Driver = "state" | "ref";

/*
  Drives the rotation angle with requestAnimationFrame + setState, the "Don't do this" pattern
  from this post's Animating Canvas section. Always runs (rules of hooks — a hook can't be called
  conditionally); `enabled` just gates whether its loop is doing anything. Pauses auto-rotation
  while `isDraggingRef` is true, so a drag and the auto-rotate loop don't fight over the same angle.
*/
function useStateDrivenAngle(enabled: boolean, speedRef: React.RefObject<number>, isDraggingRef: React.RefObject<boolean>) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const delta = now - lastTime;
      lastTime = now;
      if (!isDraggingRef.current) {
        setAngle((prev) => prev + (speedRef.current! * delta) / 1000);
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled, speedRef, isDraggingRef]);

  return [angle, setAngle] as const;
}

// The fixed version: same math, but the angle lives in a ref an effect mutates directly — no `setState` call, ever.
function useRefDrivenAngle(enabled: boolean, speedRef: React.RefObject<number>, isDraggingRef: React.RefObject<boolean>) {
  const angleRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const delta = now - lastTime;
      lastTime = now;
      if (!isDraggingRef.current) {
        angleRef.current += (speedRef.current! * delta) / 1000;
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [enabled, speedRef, isDraggingRef]);

  return angleRef;
}

export default function RotationRaceDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fpsReadoutRef = useRef<HTMLOutputElement>(null);
  const renderCountRef = useRef(0);
  const renderReadoutRef = useRef<HTMLOutputElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0 });

  const [driver, setDriver] = useState<Driver>("state");
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const speedInputRef = useRef<HTMLInputElement>(null);
  const speedBubbleRef = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    if (speedInputRef.current && speedBubbleRef.current) {
      positionRangeBubble(speedInputRef.current, speedBubbleRef.current);
    }
  }, [speed]);

  const isState = driver === "state";
  const [stateAngle, setStateAngle] = useStateDrivenAngle(isState, speedRef, isDraggingRef);
  const refAngle = useRefDrivenAngle(!isState, speedRef, isDraggingRef);

  /*
    refAngle.current changes 60 times a second *without* ever causing a render, so it must be read
    directly at draw time — a value synced into another ref only during render (or only in an
    effect keyed on a state value) would freeze the instant useRef mode stopped causing renders.
    stateAngle, by contrast, only ever changes *through* a render, so mirroring it into a ref inside
    an effect keyed on it is safe: that effect fires every time useState mode's own loop updates it.
  */
  const stateAngleRef = useRef(0);
  useEffect(() => {
    stateAngleRef.current = stateAngle;
  }, [stateAngle]);

  const modeRef = useRef<Driver>(driver);
  useEffect(() => {
    modeRef.current = driver;
  }, [driver]);

  // Every render of this component counts here — in useState mode, that's ~60/sec from setAngle() alone.
  renderCountRef.current += 1;

  // A separate, low-frequency timer reports + resets the tally, so *watching* the counter doesn't add to it.
  useEffect(() => {
    const id = setInterval(() => {
      if (renderReadoutRef.current) renderReadoutRef.current.textContent = `${renderCountRef.current} renders/sec`;
      renderCountRef.current = 0;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // The one always-running paint loop, plus drag-to-rotate — set up once and never restarted, so
  // switching drivers only ever changes *how* the angle updates, never the loop or listeners around it.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastFrameTime = performance.now();
    let fpsAccumulator = 0;
    let fpsFrames = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(angle: number) {
      const rotated = CUBE.vertices.map((v) => rotateY(rotateX(v, TILT), angle));
      const projected = rotated.map((p) => {
        const scale = 280 / (280 + p.z * UNIT);
        return { x: width / 2 + p.x * UNIT * scale, y: height / 2 + p.y * UNIT * scale };
      });

      ctx!.clearRect(0, 0, width, height);
      ctx!.strokeStyle = "#818cf8";
      ctx!.lineWidth = 2;
      for (const [a, b] of EDGES) {
        ctx!.beginPath();
        ctx!.moveTo(projected[a].x, projected[a].y);
        ctx!.lineTo(projected[b].x, projected[b].y);
        ctx!.stroke();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: event.clientX };
      canvas!.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isDraggingRef.current) return;
      const deltaAngle = (event.clientX - lastPointerRef.current.x) * 0.01;
      lastPointerRef.current = { x: event.clientX };

      if (modeRef.current === "state") setStateAngle((prev) => prev + deltaAngle);
      else refAngle.current += deltaAngle;
    }

    function handlePointerUp(event: PointerEvent) {
      isDraggingRef.current = false;
      canvas!.releasePointerCapture(event.pointerId);
    }

    function handlePointerLeave() {
      isDraggingRef.current = false;
    }

    function tick(now: number) {
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      fpsAccumulator += delta;
      fpsFrames += 1;
      if (fpsAccumulator >= 500 && fpsReadoutRef.current) {
        fpsReadoutRef.current.textContent = `${Math.round((fpsFrames * 1000) / fpsAccumulator)} fps`;
        fpsAccumulator = 0;
        fpsFrames = 0;
      }

      draw(modeRef.current === "state" ? stateAngleRef.current : refAngle.current);
      rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
    // Every dependency here is a stable ref object or a guaranteed-stable setState function, so
    // this effect only ever runs once despite not having a literal `[]` — none of them ever change identity.
  }, [refAngle, stateAngleRef, modeRef, setStateAngle]);

  return (
    <>
      <section className="demo-area" aria-label="Rotating cube preview">
        <canvas
          ref={canvasRef}
          className="scene-3d"
          aria-label="A cube rotating, driven by either useState or a ref — draggable to spin it by hand"
        />
        <output ref={fpsReadoutRef} className="fps-readout" aria-live="off">
          60 fps
        </output>
      </section>

      <fieldset className="control-group">
        <legend>Drive rotation with</legend>
        <div className="segmented-control" role="tablist" aria-label="Rotation driver">
          <button
            type="button"
            role="tab"
            className={`segment${isState ? " segment--active" : ""}`}
            aria-selected={isState}
            onClick={() => setDriver("state")}
          >
            useState
          </button>
          <button
            type="button"
            role="tab"
            className={`segment${!isState ? " segment--active" : ""}`}
            aria-selected={!isState}
            onClick={() => setDriver("ref")}
          >
            useRef
          </button>
        </div>
        <p className="tip">
          Same cube, same speed, the exact same paint loop either way — <strong>renders/sec</strong> is the only
          number that should move. <code>useState</code> calls <code>setAngle()</code> on every frame (and on every
          pointermove while you drag), so this component re-renders right along with the animation.{" "}
          <code>useRef</code> mutates a ref the paint loop reads directly, so React never re-renders for it at all.
        </p>
      </fieldset>

      <fieldset className="control-group">
        <legend>Render cost</legend>
        <output ref={renderReadoutRef} className="readout" aria-live="polite">
          0 renders/sec
        </output>
      </fieldset>

      <fieldset className="control-group">
        <legend>Rotation</legend>
        <div className="field">
          <label htmlFor="race-speed-input">
            Auto-rotate speed <span>{speed.toFixed(1)}x</span>
          </label>
          <div className="range-row">
            <span className="range-edge">0</span>
            <div className="range-track">
              <input
                ref={speedInputRef}
                type="range"
                id="race-speed-input"
                min={0}
                max={3}
                step={0.1}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
              <output ref={speedBubbleRef} className="range-bubble">
                {speed.toFixed(1)}x
              </output>
            </div>
            <span className="range-edge">3</span>
          </div>
        </div>
        <p className="tip">Drag the cube to spin it by hand — auto-rotate pauses while you drag, then picks back up.</p>
      </fieldset>
    </>
  );
}
