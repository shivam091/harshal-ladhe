"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, JSX } from "react";
import { formatBytes, gzipSize, percentSaved } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import { SectionCard, PanelTitle } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import {
  ScaleLayout,
  ScaleBody,
  Pan,
  PanParcel,
  Stem,
  Dial,
  OriginalMark,
  Needle,
  DialUnit,
  Readouts,
  SavingStamp
} from "@/components/SvgOptimiser/WeighingScale/WeighingScale.styles";
import type { GzipWeights, WeighingScaleProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// Where the needle rests with nothing on the pan.
const EMPTY_ANGLE = -120;

// How far the needle swings for the original parcel's full weight — leaves room past the mark for files that grow.
const FULL_SWING = 200;

// Long enough to skip the half-typed states between keystrokes, since compressing twice per keystroke is wasted work.
const GZIP_DEBOUNCE_MS = 300;

/*
  The counter's scale: the needle and the parcel on the pan both follow the optimised weight as a
  share of the original, and the printed slip gives the exact figures — raw bytes, the saving, and
  a gzip estimate from the browser's own CompressionStream where it exists.
*/
export default function WeighingScale({ source, result }: WeighingScaleProps): JSX.Element {
  const [gzip, setGzip] = useState<GzipWeights>({ before: null, after: null });
  const ratio = result.bytesBefore > 0 ? result.bytesAfter / result.bytesBefore : 0;
  const needleAngle = EMPTY_ANGLE + Math.min(ratio, 1.2) * FULL_SWING;
  const parcelScale = result.error ? 0.35 : Math.max(0.35, Math.sqrt(Math.min(ratio, 1.2)));
  const saved = percentSaved(result.bytesBefore, result.bytesAfter);

  // Compressed off the render path and only once typing settles; a stale answer from an earlier edit is discarded.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void Promise.all([gzipSize(source.trim()), gzipSize(result.output)]).then(([before, after]) => {
        if (!cancelled) setGzip({ before, after });
      });
    }, GZIP_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source, result.output]);

  const dialStyle = { "--needle-angle": `${needleAngle}deg`, "--mark-angle": `${EMPTY_ANGLE + FULL_SWING}deg` } as CSSProperties;
  const showGzip = !result.error && gzip.before !== null && gzip.after !== null;

  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-1">Weighing scale</PanelTitle>
        <ScaleLayout>
          <ScaleBody aria-hidden="true">
            <Pan>
              <PanParcel style={{ scale: String(parcelScale) }} />
            </Pan>
            <Stem />
            <Dial style={dialStyle}>
              <OriginalMark />
              <Needle />
              <DialUnit>BYTES</DialUnit>
            </Dial>
          </ScaleBody>

          <Readouts aria-live="polite">
            <dt>Handed in</dt>
            <dd>{formatBytes(result.bytesBefore)}</dd>
            <dt>Weighs now</dt>
            <dd>{result.error ? "—" : formatBytes(result.bytesAfter)}</dd>
            <dt>Saved</dt>
            <SavingStamp>{result.error ? "—" : `${saved}%`}</SavingStamp>
            {showGzip && (
              <>
                <dt>gzip, before</dt>
                <dd>≈ {formatBytes(gzip.before ?? 0)}</dd>
                <dt>gzip, after</dt>
                <dd>
                  ≈ {formatBytes(gzip.after ?? 0)} ({percentSaved(gzip.before ?? 0, gzip.after ?? 0)}%)
                </dd>
              </>
            )}
          </Readouts>
        </ScaleLayout>
      </SectionCard>
    </>
  );
}

WeighingScale.displayName = "WeighingScale";
