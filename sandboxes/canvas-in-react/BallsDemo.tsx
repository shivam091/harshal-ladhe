import { useCallback, useRef, useState } from "react";
import { useCanvas } from "./useCanvas";

const COLORS = ["#818cf8", "#22d3ee", "#f472b6", "#facc15", "#4ade80"];
const GRAVITY = 0.0018; // px/ms^2

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

// Drops one ball at (x, y) with a random size/color and a small random horizontal kick.
function createBall(x: number, y: number): Ball {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 0.4,
    vy: 0,
    radius: 10 + Math.random() * 14,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

/*
  Built entirely on the useCanvas hook from this post — this component only ever thinks about
  drawing (and, on click, adding a ball). Setup, teardown, and the render loop live in the hook,
  exactly as described in "A Reusable useCanvas Hook" above. The ball array itself lives in a ref:
  it changes every frame as balls fall and bounce, so — same reasoning as the rotation angle in the
  render-cost demo below — it never needs to be React state.
*/
export default function BallsDemo() {
  const ballsRef = useRef<Ball[]>([]);
  const countOutputRef = useRef<HTMLOutputElement>(null);
  const [bounce, setBounce] = useState(true);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, deltaMs: number) => {
      const width = ctx.canvas.width / (window.devicePixelRatio || 1);
      const height = ctx.canvas.height / (window.devicePixelRatio || 1);
      const balls = ballsRef.current;

      ctx.clearRect(0, 0, width, height);

      for (const ball of balls) {
        ball.vy += GRAVITY * deltaMs;
        ball.x += ball.vx * deltaMs;
        ball.y += ball.vy * deltaMs;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
          ball.vx *= -1;
          ball.x = Math.max(ball.radius, Math.min(width - ball.radius, ball.x));
        }
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy *= bounce ? -0.72 : 0;
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
      }

      if (countOutputRef.current) countOutputRef.current.textContent = `${balls.length} balls`;
    },
    [bounce]
  );

  const canvasRef = useCanvas(draw);

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    ballsRef.current = [...ballsRef.current, createBall(event.clientX - rect.left, event.clientY - rect.top)];
  }

  return (
    <>
      <section className="demo-area" aria-label="Bouncing balls preview">
        <canvas
          ref={canvasRef}
          className="scene"
          onClick={handleClick}
          aria-label="Click to drop a ball; it falls and bounces under simple gravity"
        />
        <output ref={countOutputRef} className="fps-readout" aria-live="off">
          0 balls
        </output>
      </section>

      <fieldset className="control-group">
        <legend>Balls</legend>
        <div className="fields-grid">
          <label className="checkbox-field" htmlFor="bounce-toggle">
            <input type="checkbox" id="bounce-toggle" checked={bounce} onChange={(event) => setBounce(event.target.checked)} />
            <span>Bounce off the floor</span>
          </label>
        </div>
        <p className="tip">
          Click anywhere on the canvas to drop a ball. Every ball's position lives in a plain ref, mutated in place
          inside <code>draw</code> — adding a hundred of them never triggers a single React re-render.
        </p>
      </fieldset>

      <fieldset className="control-group">
        <legend>Scene</legend>
        <button type="button" className="toggle-btn" onClick={() => (ballsRef.current = [])}>
          Clear balls
        </button>
      </fieldset>
    </>
  );
}
