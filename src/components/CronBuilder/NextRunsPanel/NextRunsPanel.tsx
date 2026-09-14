import type { JSX } from "react";
import { computeNextRuns } from "@/utils/cron";
import { useIsClient } from "@/hooks/use-is-client";
import { ClockIcon } from "@/components/Icon";
import type { NextRunsPanelProps } from "@/interfaces/cron-builder";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/CronBuilder/CronBuilder.styles";
import { Timeline, Run, RunDate, RelativeLabel, EmptyState } from "@/components/CronBuilder/NextRunsPanel/NextRunsPanel.styles";

const RUN_COUNT = 5;

function formatRelative(target: Date, now: Date): string {
  const diffMinutes = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diffMinutes < 60) return `in ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"}`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `in ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 60) return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 24) return `in ${diffMonths} month${diffMonths === 1 ? "" : "s"}`;
  const diffYears = Math.round(diffMonths / 12);
  return `in ${diffYears} year${diffYears === 1 ? "" : "s"}`;
}

function formatDateTime(date: Date): string {
  return date.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/*
  "The next N runs from right now" is inherently non-deterministic between the server-rendered pass
  and the client's own hydration pass — not just a different `now` a few instants apart (which could
  already change which candidate minute is first), but `toLocaleString` can format an identical Date
  differently between Node's ICU data and the browser's (observed: a comma/AM-PM mismatch). Rather
  than risk either, this panel renders a placeholder during SSR and the initial client render (which
  therefore match), then fills in the real computation only after mount.
*/
export default function NextRunsPanel({ state }: NextRunsPanelProps): JSX.Element {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <>
        <Panel>
          <PanelHeader>
            <PanelTitle>
              <ClockIcon size={13} aria-hidden="true" />
              Next {RUN_COUNT} runs
            </PanelTitle>
          </PanelHeader>
          <PanelBody>
            <EmptyState>Calculating…</EmptyState>
          </PanelBody>
        </Panel>
      </>
    );
  }

  const now = new Date();
  const runs = computeNextRuns(state, RUN_COUNT, now);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>
            <ClockIcon size={13} aria-hidden="true" />
            Next {RUN_COUNT} runs
          </PanelTitle>
        </PanelHeader>
        <PanelBody>
          {runs.length === 0 ? (
            <EmptyState>No upcoming run found in the next 8 years — this schedule may be impossible (e.g. day 31 in a month that never has one).</EmptyState>
          ) : (
            <Timeline>
              {runs.map((run) => (
                <Run key={run.getTime()}>
                  <RunDate>{formatDateTime(run)}</RunDate>
                  <RelativeLabel>{formatRelative(run, now)}</RelativeLabel>
                </Run>
              ))}
            </Timeline>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

NextRunsPanel.displayName = "NextRunsPanel";
