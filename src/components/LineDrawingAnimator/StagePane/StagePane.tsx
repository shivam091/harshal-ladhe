"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { renderSvgTree } from "@/utils/svg-to-react-render";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { PlayIcon, RefreshIcon } from "@/components/Icon";
import { createBezier, cycleTime, formatMs, getEasing, sampleEntry } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import { SectionCard, PanelTitle, PanelHint, BrassButton } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import { PaperShadow, Paper, ArtworkFrame, PaperNote, Nib, PlaybackRow, ScrubInput, TimeReadout } from "@/components/LineDrawingAnimator/StagePane/StagePane.styles";
import type { StagePaneProps, StrokeMeasurements } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Extra offset, in user units, that pushes an unstarted dash's end past the path's start so round caps don't paint a dot there.
const CAP_CLEARANCE = 0.5;

/*
  The paper, the nib and the playback fittings. Frames are applied imperatively (inline dash styles
  on the real SVG elements) from a free-running playhead, because the rendered artwork is memoised
  once per drawing — re-rendering the whole SVG through React sixty times a second would be wasted
  work. The parent re-keys this component per drawing, so a new drawing always starts fresh.
*/
export default function StagePane({ artwork, timeline, settings, measurements, onMeasure }: StagePaneProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playhead, setPlayhead] = useState(() => (prefersReducedMotion ? Number.POSITIVE_INFINITY : 0));
  const [playing, setPlaying] = useState(() => !prefersReducedMotion);
  const playheadRef = useRef(playhead);
  const frameRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const nibRef = useRef<HTMLSpanElement>(null);
  const elementsRef = useRef(new Map<number, SVGGeometryElement>());
  const prefix = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const scrubId = `${prefix}-scrub`;

  const ease = useMemo(() => createBezier(getEasing(settings.easing).bezier), [settings.easing]);
  const time = cycleTime(playhead, timeline, settings.loop);
  const hasMeasurements = Object.keys(measurements).length > 0;

  // Rendered once per drawing — every later frame only touches inline styles on these same elements.
  const artworkNode = useMemo(
    () => (artwork.root ? renderSvgTree(artwork.root, { idPrefix: prefix, rootProps: { width: "100%", height: "100%", role: "img", "aria-label": "Line drawing preview" } }) : null),
    [artwork.root, prefix]
  );

  // Measures every tagged stroke as soon as it's in the DOM: lengths for timing and dashes, positions for spatial ordering.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || !artworkNode) return;
    const svgRect = frame.querySelector("svg")?.getBoundingClientRect();
    const elements = new Map<number, SVGGeometryElement>();
    const result: StrokeMeasurements = {};
    frame.querySelectorAll<SVGGeometryElement>("[data-ld]").forEach((element) => {
      const index = Number(element.getAttribute("data-ld"));
      let length = 0;
      try {
        length = element.getTotalLength();
      } catch {
        // Some engines throw for degenerate geometry (a zero-radius circle) — treat it as length 0.
      }
      const rect = element.getBoundingClientRect();
      elements.set(index, element);
      result[index] = { length, x: rect.left - (svgRect?.left ?? 0), y: rect.top - (svgRect?.top ?? 0) };
    });
    elementsRef.current = elements;
    onMeasure(result);
  }, [artworkNode, onMeasure]);

  // Mirrors the playhead into a ref so the animation loop can resume from it without restarting on every frame.
  useEffect(() => {
    playheadRef.current = playhead;
  }, [playhead]);

  // The playback clock: a rAF loop advancing the playhead in real time, stopping itself at the end of a single play-through.
  useEffect(() => {
    if (!playing || !hasMeasurements) return;
    const from = Number.isFinite(playheadRef.current) ? playheadRef.current : 0;
    const origin = performance.now() - from;
    let frame = requestAnimationFrame(function tick(now) {
      const next = now - origin;
      if (settings.loop === "once" && next >= timeline.total) {
        setPlayhead(timeline.total);
        setPlaying(false);
        return;
      }
      setPlayhead(next);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, hasMeasurements, settings.loop, timeline.total]);

  // Paints the current moment onto the real elements, and parks the nib on the tip of the stroke being drawn.
  useLayoutEffect(() => {
    const elements = elementsRef.current;
    let tip: { element: SVGGeometryElement; at: number; start: number } | null = null;

    for (const entry of timeline.entries) {
      const element = elements.get(entry.index);
      if (!element) continue;
      const { draw, fill } = sampleEntry(entry, time, ease);
      const animates = entry.draws && entry.length > 0;
      element.style.strokeDasharray = animates ? `${entry.length} ${entry.length * 2}` : "";
      element.style.strokeDashoffset = animates ? String((entry.length + CAP_CLEARANCE) * (1 - draw)) : "";
      element.style.stroke = entry.draws && entry.colour ? entry.colour : "";
      element.style.strokeWidth = entry.draws && entry.width !== null ? String(entry.width) : "";
      element.style.fillOpacity = fill >= 0 ? String(fill) : "";
      if (animates && draw > 0 && draw < 1 && (!tip || entry.start >= tip.start)) tip = { element, at: entry.length * draw, start: entry.start };
    }

    const nib = nibRef.current;
    const paper = paperRef.current;
    if (!nib || !paper) return;
    const matrix = tip?.element.getScreenCTM();
    if (!tip || !matrix) {
      nib.style.opacity = "0";
      return;
    }
    try {
      const point = tip.element.getPointAtLength(tip.at);
      const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      const paperRect = paper.getBoundingClientRect();
      nib.style.transform = `translate(${screen.x - paperRect.left}px, ${screen.y - paperRect.top}px)`;
      nib.style.opacity = "1";
    } catch {
      nib.style.opacity = "0";
    }
  }, [time, timeline, ease, artworkNode]);

  // Play from wherever the playhead sits — or from the top again if a single play-through had already finished.
  function togglePlay() {
    if (playing) {
      setPlaying(false);
      setPlayhead(time);
      return;
    }
    if (settings.loop === "once" && time >= timeline.total) setPlayhead(0);
    else if (!Number.isFinite(playhead)) setPlayhead(time);
    setPlaying(true);
  }

  // Always starts the pen from the very first stroke.
  function replay() {
    setPlayhead(0);
    setPlaying(true);
  }

  return (
    <>
      <SectionCard aria-labelledby={`${prefix}-title`}>
        <PanelTitle id={`${prefix}-title`}>The page</PanelTitle>
        <PaperShadow>
          <Paper ref={paperRef}>
            <ArtworkFrame ref={frameRef}>{artworkNode ?? <PaperNote>{artwork.error ?? "Nothing to draw yet."}</PaperNote>}</ArtworkFrame>
            <Nib ref={nibRef} aria-hidden="true">
              <svg viewBox="0 0 28 28">
                <path d="M2 26 L8 13 L19 2 L26 9 L15 20 Z" fill="var(--ld-brass)" stroke="var(--ld-ink)" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M2 26 L13.5 14.5" stroke="var(--ld-ink)" strokeWidth="1.1" strokeLinecap="round" />
                <circle cx="14.5" cy="13.5" r="1.6" fill="var(--ld-ink)" />
              </svg>
            </Nib>
          </Paper>
        </PaperShadow>

        <PlaybackRow>
          <BrassButton type="button" onClick={togglePlay} disabled={!artworkNode} aria-label={playing ? "Pause the drawing" : "Play the drawing"}>
            {playing ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                  <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <PlayIcon size={14} />
                Play
              </>
            )}
          </BrassButton>
          <BrassButton type="button" onClick={replay} disabled={!artworkNode} aria-label="Replay from the first stroke">
            <RefreshIcon size={14} />
            Replay
          </BrassButton>
          <ScrubInput
            id={scrubId}
            aria-label="Scrub through the drawing"
            type="range"
            min={0}
            max={Math.max(1, Math.round(timeline.total))}
            step={1}
            value={Math.round(time)}
            aria-valuetext={`${formatMs(time)} of ${formatMs(timeline.total)}`}
            disabled={!artworkNode}
            onChange={(event) => {
              setPlaying(false);
              setPlayhead(event.target.valueAsNumber);
            }}
          />
          <TimeReadout htmlFor={scrubId}>
            {formatMs(time)} / {formatMs(timeline.total)}
          </TimeReadout>
        </PlaybackRow>
        {prefersReducedMotion && <PanelHint>Reduced motion is on, so the page shows the finished drawing. Press Play to watch it written out anyway.</PanelHint>}
      </SectionCard>
    </>
  );
}

StagePane.displayName = "StagePane";
