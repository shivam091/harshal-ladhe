import { useEffect, useMemo, useRef, useState } from "react";
import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/range-slider.css";
import "./styles.css";

/*
  This sandbox mixes two very different kinds of code, and the header below says so explicitly:

  REAL, genuinely running browser behavior:
    - The blur-up vs. no-placeholder comparison: a real CSS-blurred inline SVG preview swapped for a
      real sharp one, on a real setTimeout-driven state change.
    - The lazy-loading demo: a real IntersectionObserver watching a real element inside a real
      scrollable container — you have to actually scroll it into view to trigger anything.
    - The Generated Markup panel: a real srcset/sizes string, built live from real string-building
      logic that mirrors next/image's own deviceSizes/imageSizes breakpoint approach.

  ILLUSTRATIVE ONLY (covered instead by this post's diagrams):
    - The actual server-side resize + re-encode transform behind /_next/image.
    - Accept-header-based format negotiation (AVIF/WebP/original) — no browser sandbox has a second
      server to negotiate with, so this is a diagram, not a demo, in the post itself.
*/

type Tab = "blur-up" | "lazy-load" | "markup";

/* ----------------------------- Shared decorative art ----------------------------- */

function PhotoArt({ blurred = false }: { blurred?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 140"
      className={`photo-art${blurred ? " photo-art--blurred" : ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={200} height={140} fill="#1c2a4a" />
      <circle cx={150} cy={34} r={16} fill="#ffd166" />
      <polygon points="0,140 55,72 95,108 135,52 200,140" fill="#3a6ea5" />
      <polygon points="35,140 85,92 125,140" fill="#1c2a4a" />
    </svg>
  );
}

/* ----------------------------- Blur-Up Placeholder panel ----------------------------- */

const BLUR_UP_DELAY_MS = 1400;

type PhotoState = "idle" | "loading" | "loaded";

function BlurUpPanel() {
  const [state, setState] = useState<PhotoState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    };
  }, []);

  const simulateLoad = () => {
    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    setState("loading");
    timeoutRef.current = setTimeout(() => setState("loaded"), BLUR_UP_DELAY_MS);
  };

  const reset = () => {
    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    setState("idle");
  };

  let readout = 'Press "Simulate photo load" to begin.';
  if (state === "loading") readout = "Loading — the blur-up slot already shows a real preview; the plain slot shows nothing.";
  if (state === "loaded") readout = "Loaded — both slots now show the identical sharp photo, at the same instant.";

  return (
    <>
      <section className="demo-area blur-demo-area" aria-label="Blur-up placeholder comparison">
        <div className="blur-slot-pair">
          <div className="blur-slot">
            <span className="blur-slot-label">placeholder=&quot;blur&quot;</span>
            <div className="photo-frame">
              {state === "idle" && <div className="photo-empty" />}
              {state === "loading" && <PhotoArt blurred />}
              {state === "loaded" && <PhotoArt />}
            </div>
          </div>

          <div className="blur-slot">
            <span className="blur-slot-label">no placeholder</span>
            <div className="photo-frame">
              {state !== "loaded" && <div className="photo-empty" />}
              {state === "loaded" && <PhotoArt />}
            </div>
          </div>
        </div>
      </section>

      <output className="readout" aria-live="polite">{readout}</output>

      <fieldset className="control-group">
        <legend>Simulate</legend>
        <button type="button" className="toggle-btn" onClick={simulateLoad} disabled={state === "loading"}>
          Simulate photo load
        </button>
        <button type="button" className="toggle-btn toggle-btn--ghost" onClick={reset} disabled={state === "idle"}>
          Reset
        </button>
        <p className="tip">
          Both slots load for the exact same {BLUR_UP_DELAY_MS}ms — placeholder=&quot;blur&quot; doesn&apos;t make
          the real photo arrive any faster. The left slot gives you a real (if blurred) preview to look at in the
          meantime; the right slot gives you an empty box until the identical instant the sharp photo appears.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Lazy Loading panel ----------------------------- */

const LAZY_LOAD_DELAY_MS = 1200;

type LazyState = "unseen" | "loading" | "loaded";

function LazyLoadPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [state, setState] = useState<LazyState>("unseen");
  const [armed, setArmed] = useState(0); // bumped to re-run the observer effect after a reset

  useEffect(() => {
    const target = targetRef.current;
    const root = containerRef.current;
    if (!target || !root || state !== "unseen") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setState("loading");
          timeoutRef.current = setTimeout(() => setState("loaded"), LAZY_LOAD_DELAY_MS);
          observer.disconnect();
        }
      },
      { root, threshold: 0.3 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [armed, state]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    };
  }, []);

  const reset = () => {
    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    setState("unseen");
    setArmed((n) => n + 1);
  };

  let readout = "Scroll the box below down until the image slot actually enters view.";
  if (state === "loading") readout = "IntersectionObserver fired — the slot is now in view, and a real 1200ms \"fetch\" is in flight.";
  if (state === "loaded") readout = "Loaded — the real image only ever fetched once it was genuinely about to be visible.";

  return (
    <>
      <div className="demo-area lazy-demo-area" ref={containerRef} aria-label="Scrollable lazy-load demo">
        <p className="lazy-spacer-text">Scroll down inside this box ↓</p>
        <div className="lazy-spacer-block" />
        <div className="lazy-spacer-block" />
        <div className="lazy-spacer-block" />
        <p className="lazy-spacer-text">Almost there — keep scrolling.</p>
        <div className="lazy-spacer-block" />

        <div className="lazy-target" ref={targetRef}>
          <span className="blur-slot-label">Image slot (real IntersectionObserver target)</span>
          <div className="photo-frame">
            {state === "unseen" && <div className="photo-empty photo-empty--lazy" />}
            {state === "loading" && <div className="photo-empty photo-empty--loading" />}
            {state === "loaded" && <PhotoArt />}
          </div>
        </div>

        <div className="lazy-spacer-block" />
      </div>

      <output className="readout" aria-live="polite">{readout}</output>

      <fieldset className="control-group">
        <legend>Lazy loading</legend>
        <button type="button" className="toggle-btn toggle-btn--ghost" onClick={reset}>
          Reset and scroll to top
        </button>
        <p className="tip">
          This is a real `IntersectionObserver` watching a real element inside a real scrollable
          container — nothing here is pre-scripted. next/image sets the standard `loading=&quot;lazy&quot;`
          attribute by default and lets the browser handle proximity detection internally; this demo
          re-implements that same idea explicitly, with your own observer, so the trigger is visible.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Generated Markup panel ----------------------------- */

// next/image's default breakpoint config, as of the versions this sandbox was verified against —
// confirm the exact numbers against your installed version's next.config docs before relying on them.
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 384];
const ALL_SIZES = [...IMAGE_SIZES, ...DEVICE_SIZES].sort((a, b) => a - b);

// Simplified reproduction of next/image's real approach: a fixed-size image (no `sizes` prop) only
// needs close-enough 1x/2x variants; a responsive image (a `sizes` prop is set) gets the full
// deviceSizes breakpoint ladder, since it may render at any width up to a full viewport.
function computeWidths(renderedWidth: number, responsive: boolean): number[] {
  if (!responsive) {
    const at1x = ALL_SIZES.find((w) => w >= renderedWidth) ?? ALL_SIZES[ALL_SIZES.length - 1];
    const at2x = ALL_SIZES.find((w) => w >= renderedWidth * 2) ?? ALL_SIZES[ALL_SIZES.length - 1];
    return Array.from(new Set([at1x, at2x])).sort((a, b) => a - b);
  }
  return DEVICE_SIZES;
}

function buildSrcSet(src: string, widths: number[], quality: number): string {
  return widths
    .map((w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
    .join(",\n");
}

const THUMB_WIDTH = 16;

function bubbleOffset(value: number, min: number, max: number): string {
  const percent = ((value - min) / (max - min)) * 100;
  const offset = THUMB_WIDTH / 2 - (percent / 100) * THUMB_WIDTH;
  return `calc(${percent}% + ${offset}px)`;
}

function MarkupPanel() {
  const [renderedWidth, setRenderedWidth] = useState(400);
  const [responsive, setResponsive] = useState(true);
  const [sizes, setSizes] = useState("(max-width: 768px) 100vw, 50vw");
  const [quality, setQuality] = useState(75);

  const widths = useMemo(() => computeWidths(renderedWidth, responsive), [renderedWidth, responsive]);
  const srcSet = useMemo(() => buildSrcSet("/hero.jpg", widths, quality), [widths, quality]);

  return (
    <>
      <section className="demo-area markup-demo-area" aria-label="Generated markup preview">
        <pre className="markup-readout">
          <code>
            {"srcset=\""}
            {"\n"}
            {srcSet}
            {"\n\""}
            {responsive ? `\nsizes="${sizes}"` : "\n(no sizes attribute — fixed display size, browser picks 1x or 2x)"}
          </code>
        </pre>
      </section>

      <fieldset className="control-group">
        <legend>Inputs</legend>
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="rendered-width">Rendered width (px)</label>
            <div className="range-row">
              <span className="range-edge">100</span>
              <div className="range-track">
                <span className="range-bubble" style={{ insetInlineStart: bubbleOffset(renderedWidth, 100, 1200) }}>
                  {renderedWidth}px
                </span>
                <input
                  id="rendered-width"
                  type="range"
                  min={100}
                  max={1200}
                  step={10}
                  value={renderedWidth}
                  onChange={(event) => setRenderedWidth(Number(event.target.value))}
                />
              </div>
              <span className="range-edge">1200</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="quality">Quality</label>
            <div className="range-row">
              <span className="range-edge">1</span>
              <div className="range-track">
                <span className="range-bubble" style={{ insetInlineStart: bubbleOffset(quality, 1, 100) }}>
                  {quality}
                </span>
                <input
                  id="quality"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
              </div>
              <span className="range-edge">100</span>
            </div>
          </div>

          <label className="checkbox-field field--full" htmlFor="responsive-toggle">
            <input
              id="responsive-toggle"
              type="checkbox"
              checked={responsive}
              onChange={(event) => setResponsive(event.target.checked)}
            />
            <span>Responsive — a <code>sizes</code> attribute is set (renders at varying widths)</span>
          </label>

          {responsive && (
            <div className="field field--full">
              <label htmlFor="sizes-input">
                <code>sizes</code> value
              </label>
              <div className="field-input">
                <input
                  id="sizes-input"
                  type="text"
                  value={sizes}
                  onChange={(event) => setSizes(event.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <p className="tip">
          Unchecked, this mirrors a fixed-display-size `&lt;Image&gt;` (no `sizes` prop): only close-enough
          1x/2x variants are generated. Checked, it mirrors a responsive `&lt;Image&gt;`: the full
          `deviceSizes` breakpoint ladder is generated, since the element may render at any width up to a
          full viewport.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- App shell / tabs ----------------------------- */

export default function App() {
  const [tab, setTab] = useState<Tab>("blur-up");

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>next/image Optimization Playground</h1>
        <p>
          <strong>Real, running browser behavior:</strong> the blur-up comparison, the scroll-triggered
          lazy load, and the generated `srcset`/`sizes` string below all genuinely execute. <strong>Illustrated
          only:</strong> the actual server-side resize/reformat transform and Accept-header format
          negotiation — no server exists in this sandbox to perform those, so this post&apos;s diagrams
          cover them instead.
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Playground demo">
        <button
          type="button"
          className={`tab${tab === "blur-up" ? " tab--active" : ""}`}
          role="tab"
          aria-selected={tab === "blur-up"}
          onClick={() => setTab("blur-up")}
        >
          Blur-Up Placeholder
        </button>
        <button
          type="button"
          className={`tab${tab === "lazy-load" ? " tab--active" : ""}`}
          role="tab"
          aria-selected={tab === "lazy-load"}
          onClick={() => setTab("lazy-load")}
        >
          Lazy Loading
        </button>
        <button
          type="button"
          className={`tab${tab === "markup" ? " tab--active" : ""}`}
          role="tab"
          aria-selected={tab === "markup"}
          onClick={() => setTab("markup")}
        >
          Generated Markup
        </button>
      </div>

      <div className={`tab-panel${tab === "blur-up" ? " tab-panel--active" : ""}`}>
        {tab === "blur-up" && <BlurUpPanel />}
      </div>
      <div className={`tab-panel${tab === "lazy-load" ? " tab-panel--active" : ""}`}>
        {tab === "lazy-load" && <LazyLoadPanel />}
      </div>
      <div className={`tab-panel${tab === "markup" ? " tab-panel--active" : ""}`}>
        {tab === "markup" && <MarkupPanel />}
      </div>
    </main>
  );
}
