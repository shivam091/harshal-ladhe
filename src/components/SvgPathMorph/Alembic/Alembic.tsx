"use client";

import { useId, useMemo } from "react";
import type { JSX } from "react";
import {
  blendedElixir,
  cubicBezierEasing,
  getEasingMeta,
  pointTone,
  sampleMorph,
  shapeAnchors,
  shapeToPathData,
  strokeWidthFor,
  viewBoxToString
} from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { AlembicFrame, AlembicSvg, SpoiltNote } from "@/components/SvgPathMorph/Alembic/Alembic.styles";
import type { AlembicProps, OnionGhost } from "@/components/SvgPathMorph/SvgPathMorph.types";

// The alembic's bulb, sized so the 190-unit stage for the morph sits comfortably inside the glass.
const BULB = { cx: 160, cy: 168, r: 122 };

// Distance between onion-skin ghosts, as a fraction of the whole pass — close enough to read as motion blur, far enough apart to tell frames apart.
const GHOST_STEP = 0.06;

/*
  The central alembic where the morph actually happens: the matched cubics are sampled at the
  playhead (eased per keyframe leg, like CSS) and drawn directly — no animation library. Ghost
  frames before and after the playhead form the onion skin, and travel lines join each matched
  point's position in the current leg's two keyframes, so the path every point takes is visible.
*/
export default function Alembic({ shapes, viewBox, renderMode, progress, easing, onionSkins, showPoints, showTravel, error, isPlaying }: AlembicProps): JSX.Element {
  const clipId = `alembic-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const ease = useMemo(() => cubicBezierEasing(getEasingMeta(easing).bezier), [easing]);

  const ready = shapes && viewBox && shapes.length >= 2;
  const current = ready ? sampleMorph(shapes, progress, ease) : null;
  const tone = ready ? blendedElixir(progress, shapes.length, ease) : "var(--color-fg-muted)";
  const strokeWidth = viewBox ? strokeWidthFor(viewBox) : 1;
  const radius = viewBox ? viewBox.width * 0.018 : 1;

  const ghosts: OnionGhost[] = [];
  if (ready) {
    for (let j = onionSkins; j >= 1; j--) {
      for (const ahead of [false, true]) {
        const at = progress + (ahead ? j : -j) * GHOST_STEP;
        if (at < 0 || at > 1) continue;
        ghosts.push({ key: `${ahead ? "a" : "b"}${j}`, d: shapeToPathData(sampleMorph(shapes, at, ease)), opacity: 0.5 * (1 - (j - 1) / (onionSkins + 1)), ahead });
      }
    }
  }

  // The current leg's two keyframes, for the travel lines.
  const legs = shapes ? shapes.length - 1 : 1;
  const leg = Math.min(Math.floor(Math.min(Math.max(progress, 0), 1) * legs), legs - 1);
  const travelFrom = ready && showTravel ? shapeAnchors(shapes[leg]) : [];
  const travelTo = ready && showTravel ? shapeAnchors(shapes[leg + 1]) : [];
  const currentAnchors = current && showPoints ? shapeAnchors(current) : [];

  return (
    <>
      <AlembicFrame data-playing={isPlaying ? "true" : undefined}>
        <AlembicSvg viewBox="0 0 320 340" role="img" aria-label={ready ? "The morph in progress, inside the alembic" : "An empty alembic — one of the keyframes doesn't parse"}>
          <defs>
            <clipPath id={clipId}>
              <circle cx={BULB.cx} cy={BULB.cy} r={BULB.r} />
            </clipPath>
            <radialGradient id={`${clipId}-glass`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="white" stopOpacity="0.16" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="stand">
            <path d="M80 268 L58 326 M240 268 L262 326 M160 290 L160 326" />
            <path d="M44 326 H276" />
          </g>
          <g className="flame" aria-hidden="true">
            <path className="flame-outer" d="M160 334 C140 334 136 316 148 302 C150 312 156 312 156 304 C156 294 162 288 166 282 C166 294 182 300 178 318 C176 330 170 334 160 334 Z" />
            <path className="flame-inner" d="M160 332 C152 332 150 322 156 314 C158 320 162 320 162 314 C166 320 170 326 166 330 C164 332 162 332 160 332 Z" />
          </g>

          <path className="beak" d="M182 34 L304 86 L298 98 L180 52 Z" />
          <rect className="neck" x="140" y="18" width="44" height="34" rx="6" />
          <circle className="bulb" cx={BULB.cx} cy={BULB.cy} r={BULB.r} />
          <circle cx={BULB.cx} cy={BULB.cy} r={BULB.r} fill={`url(#${clipId}-glass)`} />

          <g clipPath={`url(#${clipId})`}>
            <path className="brew" d="M20 246 Q 80 236 160 246 T 300 246 V 300 H 20 Z" style={{ fill: tone }} />
            <circle className="bubble bubble-1" cx="120" cy="280" r="4" />
            <circle className="bubble bubble-2" cx="196" cy="284" r="3" />
            <circle className="bubble bubble-3" cx="160" cy="288" r="5" />
          </g>

          {ready && current && viewBox && (
            <svg x="65" y="73" width="190" height="190" viewBox={viewBoxToString(viewBox)} overflow="visible">
              {ghosts.map((ghost) => (
                <path
                  key={ghost.key}
                  d={ghost.d}
                  className="ghost"
                  data-ahead={ghost.ahead ? "true" : undefined}
                  style={{ strokeWidth: renderMode === "stroke" ? strokeWidth * 0.5 : strokeWidth * 0.25, opacity: ghost.opacity }}
                />
              ))}
              {travelFrom.map((from, i) => {
                const to = travelTo[i];
                if (!to) return null;
                return <line key={`t${i}`} className="travel" x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ stroke: pointTone(i, travelFrom.length), strokeWidth: strokeWidth * 0.18 }} />;
              })}
              <path
                d={shapeToPathData(current)}
                className="morph"
                style={
                  renderMode === "stroke"
                    ? { fill: "none", stroke: tone, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" }
                    : { fill: tone, stroke: "none" }
                }
              />
              {currentAnchors.map((point, i) => (
                <circle key={`p${i}`} cx={point.x} cy={point.y} r={point.first ? radius * 1.5 : radius} className="point" style={{ fill: pointTone(i, currentAnchors.length) }} />
              ))}
            </svg>
          )}
        </AlembicSvg>
        {error && (
          <SpoiltNote role="status">
            <strong>The mixture won&apos;t take.</strong> {error}
          </SpoiltNote>
        )}
      </AlembicFrame>
    </>
  );
}

Alembic.displayName = "Alembic";
