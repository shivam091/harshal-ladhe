import type { JSX } from "react";
import { SectionCard, PanelTitle, HintText } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import { LogList, LogItem, StatusLed } from "@/components/SvgToReactConverter/TransformLog/TransformLog.styles";
import type { TransformLogProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Lists what the pipeline actually changed, with a status LED per line — warnings (skipped or unsafe content) light amber so they stand out from routine clean-up.
export default function TransformLog({ result }: TransformLogProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle data-designator="D1">Transforms applied</PanelTitle>
        {result.error ? (
          <HintText>No transforms ran — the SVG didn&apos;t parse.</HintText>
        ) : result.log.length === 0 ? (
          <HintText>Nothing to change — this SVG was already clean.</HintText>
        ) : (
          <LogList>
            {result.log.map((entry) => (
              <LogItem key={entry.id}>
                <StatusLed data-tone={entry.tone} aria-hidden="true" />
                <span>
                  {entry.tone === "warning" && <strong>Note: </strong>}
                  {entry.message}
                </span>
              </LogItem>
            ))}
          </LogList>
        )}
      </SectionCard>
    </>
  );
}

TransformLog.displayName = "TransformLog";
