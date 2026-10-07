import type { CSSProperties, JSX } from "react";
import { PASS_META, formatBytes, toDataUri } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import { SectionCard, PanelTitle, HintText } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import { ParcelGrid, Parcel, Window, AddressLabel, StampRow, MiniStamp, SanitiseNote } from "@/components/SvgOptimiser/ParcelPreview/ParcelPreview.styles";
import type { ParcelPreviewProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// More stamps than this crowd the parcel, so the rest are summed into one "+n" stamp.
const MAX_MINI_STAMPS = 5;

// Alternating small tilts, so the stamps look stuck on by hand rather than printed in a row.
const STAMP_TILTS = [-4, 3, -2, 5, -3];

/*
  The two parcels side by side, both rendered as <img> from the result's sanitised markup — an
  image can't run script or reach the page, and the tree was scrubbed before it got that far. The
  optimised parcel wears a stamp for every pass that took bytes off it.
*/
export default function ParcelPreview({ result }: ParcelPreviewProps): JSX.Element {
  const stuck = result.reports.filter((report) => report.enabled && report.saved > 0).sort((a, b) => b.saved - a.saved);
  const shown = stuck.slice(0, MAX_MINI_STAMPS);
  const hidden = stuck.length - shown.length;
  const { elements, handlers, urls } = result.sanitised;
  const removed = elements + handlers + urls;

  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-7">Parcels</PanelTitle>
        {result.error ? (
          <HintText>Nothing to unwrap until the SVG parses.</HintText>
        ) : (
          <>
            <ParcelGrid>
              <Parcel>
                <Window>
                  {/* eslint-disable-next-line @next/next/no-img-element -- a data URI preview, which next/image can't optimise and doesn't need to */}
                  <img src={toDataUri(result.previewBefore)} alt="Original SVG" />
                </Window>
                <AddressLabel>As handed in · {formatBytes(result.bytesBefore)}</AddressLabel>
              </Parcel>
              <Parcel>
                <StampRow aria-hidden="true">
                  {shown.map((report, index) => (
                    <MiniStamp key={report.id} style={{ "--tilt": `${STAMP_TILTS[index % STAMP_TILTS.length]}deg` } as CSSProperties} title={PASS_META.find((meta) => meta.id === report.id)?.label}>
                      −{formatBytes(report.saved)}
                    </MiniStamp>
                  ))}
                  {hidden > 0 && <MiniStamp>+{hidden}</MiniStamp>}
                </StampRow>
                <Window>
                  {/* eslint-disable-next-line @next/next/no-img-element -- a data URI preview, which next/image can't optimise and doesn't need to */}
                  <img src={toDataUri(result.previewAfter)} alt="Optimised SVG" />
                </Window>
                <AddressLabel>Ready to post · {formatBytes(result.bytesAfter)}</AddressLabel>
              </Parcel>
            </ParcelGrid>
            {removed > 0 && (
              <SanitiseNote role="status">
                <strong>Note: </strong>
                the preview held back {elements > 0 && `${elements} unsafe element${elements === 1 ? "" : "s"}`}
                {elements > 0 && (handlers > 0 || urls > 0) && ", "}
                {handlers > 0 && `${handlers} event handler${handlers === 1 ? "" : "s"}`}
                {handlers > 0 && urls > 0 && ", "}
                {urls > 0 && `${urls} script link${urls === 1 ? "" : "s"}`}. An optimiser doesn&apos;t decide what&apos;s safe, so the
                optimised file still contains them.
              </SanitiseNote>
            )}
          </>
        )}
      </SectionCard>
    </>
  );
}

ParcelPreview.displayName = "ParcelPreview";
