import { useState } from "react";
import { PlainDateLite, addMonthsWithLegacyDate } from "./temporalLite";
import type { OverflowMode } from "./temporalLite";
import "./styles.css";

// Real Temporal.PlainDate where the browser already has it, otherwise the sandbox's own drop-in — same from()/add()/toString() shape either way.
const PlainDate: typeof PlainDateLite =
  (globalThis as unknown as { Temporal?: { PlainDate: typeof PlainDateLite } }).Temporal?.PlainDate ?? PlainDateLite;

const usingNativeTemporal = Boolean((globalThis as unknown as { Temporal?: unknown }).Temporal);

export default function App() {
  const [isoDate, setIsoDate] = useState("2026-01-31");
  const [months, setMonths] = useState(1);
  const [overflow, setOverflow] = useState<OverflowMode>("constrain");

  const legacyResult = addMonthsWithLegacyDate(isoDate, months);

  let temporalResult: string;
  let temporalError: string | null = null;
  try {
    temporalResult = PlainDate.from(isoDate).add({ months }, { overflow }).toString();
  } catch (err) {
    temporalResult = "";
    temporalError = err instanceof Error ? err.message : String(err);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Date Arithmetic: Date vs. Temporal.PlainDate</h1>
        <p className="subtitle">
          {usingNativeTemporal
            ? "Running on this browser's native Temporal."
            : "Native Temporal isn't available here — running a small drop-in with the identical from()/add() API."}
        </p>

        <div className="controls">
          <label className="field">
            Start date
            <input type="date" value={isoDate} onChange={(e) => setIsoDate(e.target.value)} />
          </label>

          <label className="field">
            Add months
            <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
          </label>

          <label className="field">
            Temporal overflow
            <select value={overflow} onChange={(e) => setOverflow(e.target.value as OverflowMode)}>
              <option value="constrain">constrain (clamp to month end)</option>
              <option value="reject">reject (throw)</option>
            </select>
          </label>
        </div>

        <div className="result-row">
          <p className="result-label">legacy Date — setMonth()</p>
          <p className="result-value legacy">{legacyResult}</p>
        </div>

        <div className="result-row">
          <p className="result-label">Temporal.PlainDate — add({"{"}months{"}"}, {"{"}overflow: &quot;{overflow}&quot;{"}"})</p>
          {temporalError ? (
            <p className="result-value error">Threw: {temporalError}</p>
          ) : (
            <p className="result-value temporal">{temporalResult}</p>
          )}
        </div>

        <p className="hint">Try Jan 31 + 1 month — Date silently rolls into March, PlainDate clamps to Feb 28/29 (or throws with &quot;reject&quot;).</p>
      </div>
    </>
  );
}
