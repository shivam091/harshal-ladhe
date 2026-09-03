import { useEffect, useRef } from "react";

// One frame's draw call: the 2D context, plus the delta (ms) since the previous frame.
export type DrawFn = (ctx: CanvasRenderingContext2D, deltaMs: number) => void;

/*
  The reusable hook from this post's "A Reusable useCanvas Hook" section: sets up a canvas's 2D
  context and backing-store size, then drives a requestAnimationFrame loop that calls `draw` every
  frame — tearing the loop and the resize listener down automatically on unmount. Callers only ever
  think about drawing; the ref, the resize math, and the rAF lifecycle live here exactly once.
*/
export function useCanvas(draw: DrawFn) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let rafId = 0;
    let lastFrameTime = performance.now();

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function loop(now: number) {
      const deltaMs = now - lastFrameTime;
      lastFrameTime = now;
      draw(ctx!, deltaMs);
      rafId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [draw]);

  return canvasRef;
}
