import { useMemo } from "react";
import type { JSX } from "react";
import { shufflePredictionPool } from "@/helpers/event-loop-editor";
import { SectionCard, PanelTitle, PanelNote } from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import {
  PredictHeader,
  ToggleLabel,
  Pool,
  PoolChip,
  GuessList,
  Actual,
  ButtonRow,
  SmallButton,
  Score
} from "@/components/EventLoopVisualiser/PredictPanel/PredictPanel.styles";
import type { PredictPanelProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

/*
  "Predict the output" mode: the console and playback stay locked until the visitor has put every
  logged line in the order they expect, so the guess is genuinely made before the diagram gives
  the answer away — then the reveal marks each position and unlocks stepping through the why.
*/
export default function PredictPanel({ answer, enabled, revealed, guess, onToggle, onPick, onUndoPick, onClear, onReveal }: PredictPanelProps): JSX.Element {
  const pool = useMemo(() => shufflePredictionPool(answer), [answer]);
  const byId = useMemo(() => new Map(answer.map((line) => [line.id, line])), [answer]);
  const remaining = pool.filter((line) => !guess.includes(line.id));
  const correct = guess.filter((id, index) => byId.get(id)?.text === answer[index]?.text).length;

  return (
    <>
      <SectionCard>
        <PredictHeader>
          <PanelTitle>Predict the output</PanelTitle>
          <ToggleLabel>
            <input type="checkbox" checked={enabled} onChange={onToggle} />
            Guess first
          </ToggleLabel>
        </PredictHeader>

        {!enabled && <PanelNote>Turn this on to hide the console and order the logged lines yourself before watching the run.</PanelNote>}

        {enabled && answer.length === 0 && <PanelNote>This program doesn&apos;t log anything yet — add a console.log block to predict.</PanelNote>}

        {enabled && answer.length > 0 && (
          <>
            {!revealed && (
              <>
                <PanelNote>Tap the lines in the order you think they&apos;ll print.</PanelNote>
                <Pool role="group" aria-label="Lines still to place">
                  {remaining.map((line) => (
                    <PoolChip key={line.id} type="button" onClick={() => onPick(line.id)}>
                      {line.text}
                    </PoolChip>
                  ))}
                </Pool>
              </>
            )}

            {guess.length > 0 && (
              <GuessList aria-label="Your predicted order">
                {guess.map((id, index) => {
                  const right = byId.get(id)?.text === answer[index]?.text;
                  return (
                    <li key={id} data-result={revealed ? (right ? "right" : "wrong") : undefined}>
                      {byId.get(id)?.text}
                      {revealed && !right && <Actual> — actually “{answer[index]?.text}”</Actual>}
                    </li>
                  );
                })}
              </GuessList>
            )}

            {revealed ? (
              <Score role="status">
                {correct} of {answer.length} in the right place{correct === answer.length ? " — spot on." : ". Step through to see why."}
              </Score>
            ) : (
              <ButtonRow>
                <SmallButton type="button" onClick={onUndoPick} disabled={guess.length === 0}>
                  Undo pick
                </SmallButton>
                <SmallButton type="button" onClick={onClear} disabled={guess.length === 0}>
                  Clear
                </SmallButton>
                <SmallButton type="button" data-primary="true" onClick={onReveal} disabled={guess.length !== answer.length}>
                  Reveal
                </SmallButton>
              </ButtonRow>
            )}
          </>
        )}
      </SectionCard>
    </>
  );
}

PredictPanel.displayName = "PredictPanel";
