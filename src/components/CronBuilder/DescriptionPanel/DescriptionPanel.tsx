import type { CSSProperties, JSX } from "react";
import { toCrontabLine, describeCron, findCronError } from "@/components/CronBuilder/CronBuilder.utils";
import { useCopyLink } from "@/hooks/use-copy-link";
import { ClipboardIcon, CheckIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import VisuallyHidden from "@/components/VisuallyHidden";
import { FIELD_COLORS, FIELD_ORDER } from "@/components/CronBuilder/cron-field-colors";
import type { DescriptionPanelProps } from "@/components/CronBuilder/CronBuilder.types";
import { Hero, HeroInner, HeroTopRow, TokenRow, Token, TokenValue, TokenLabel, CopyExpressionButton, Sentence } from "@/components/CronBuilder/DescriptionPanel/DescriptionPanel.styles";

/*
  The tool's hero — the assembled 5-field cron string, built straight from state (never re-parsed)
  and rendered as one color-coded chip per field so the string reads as "5 dials," not one opaque
  blob, then its plain-English reading from describeCron underneath.
*/
export default function DescriptionPanel({ state }: DescriptionPanelProps): JSX.Element {
  const line = toCrontabLine(state);
  const tokens = line.split(" ");
  const { copied, copy } = useCopyLink(line);

  return (
    <>
      <Hero>
        <HeroInner>
          <HeroTopRow>
            <TokenRow>
              {FIELD_ORDER.map((field, index) => (
                <Token key={field.key} style={{ "--field-accent": FIELD_COLORS[field.key] } as CSSProperties}>
                  <TokenValue>{tokens[index]}</TokenValue>
                  <TokenLabel>{field.short}</TokenLabel>
                </Token>
              ))}
            </TokenRow>

            <Tooltip content={copied ? "Copied!" : "Copy expression"}>
              <CopyExpressionButton
                type="button"
                onClick={copy}
                data-copied={copied ? "true" : undefined}
                aria-label={copied ? "Expression copied!" : "Copy expression"}
              >
                {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
              </CopyExpressionButton>
            </Tooltip>
          </HeroTopRow>

          <Sentence data-invalid={findCronError(state) ? "true" : undefined}>{describeCron(state)}</Sentence>

          <VisuallyHidden role="status" aria-live="polite">
            {copied ? "Expression copied to clipboard" : ""}
          </VisuallyHidden>
        </HeroInner>
      </Hero>
    </>
  );
}

DescriptionPanel.displayName = "DescriptionPanel";
