import type { JSX } from "react";
import { runAudit } from "@/utils/open-graph-audit";
import { SectionCard, PanelTitle } from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import { Summary, SummaryCount, CheckList, CheckItem, StatusBadge, CheckLabel, CheckMessage } from "@/components/OpenGraphPreview/AuditPanel/AuditPanel.styles";
import type { AuditPanelProps, AuditStatus } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Tally order — passes first, so the summary reads from good news to bad.
const STATUSES: ReadonlyArray<AuditStatus> = ["pass", "warn", "fail"];

// Re-runs the whole audit on every render — a dozen string checks are far cheaper than any memoisation bookkeeping would be.
export default function AuditPanel({ state, localImage, measurement }: AuditPanelProps): JSX.Element {
  const checks = runAudit(state, localImage, measurement);

  return (
    <>
      <SectionCard>
        <PanelTitle>Audit</PanelTitle>
        <Summary aria-live="polite">
          {STATUSES.map((status) => (
            <SummaryCount key={status} data-status={status}>
              {checks.filter((check) => check.status === status).length} {status === "pass" ? "passed" : status === "warn" ? "warnings" : "failed"}
            </SummaryCount>
          ))}
        </Summary>
        <CheckList>
          {checks.map((check) => (
            <CheckItem key={check.id}>
              <StatusBadge data-status={check.status}>{check.status}</StatusBadge>
              <span>
                <CheckLabel>{check.label}</CheckLabel>
                <CheckMessage>{check.message}</CheckMessage>
              </span>
            </CheckItem>
          ))}
        </CheckList>
      </SectionCard>
    </>
  );
}

AuditPanel.displayName = "AuditPanel";
