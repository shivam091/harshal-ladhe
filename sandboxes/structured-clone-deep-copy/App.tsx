import { useState } from "react";
import { cloneWithJSON, cloneWithStructuredClone, createSample } from "./compareClones";
import type { CloneReport } from "./compareClones";
import "./styles.css";

function ReportCard({ report }: { report: CloneReport }) {
  return (
    <div className="report-card">
      <p className="report-title">{report.method}</p>
      {report.error ? (
        <p className="report-error">Threw: {report.error}</p>
      ) : (
        <ul className="checklist">
          {report.checks.map((check) => (
            <li key={check.label} className={check.passed ? "pass" : "fail"}>
              {check.passed ? "✓" : "✗"} {check.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [circular, setCircular] = useState(false);
  const [reports, setReports] = useState<CloneReport[] | null>(null);

  function runComparison() {
    const sample = createSample(circular);
    setReports([cloneWithJSON(sample), cloneWithStructuredClone(sample)]);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">structuredClone() vs. JSON Round-Trip</h1>
        <p className="subtitle">Clone the same sample object both ways and compare what survives.</p>

        <label className="toggle">
          <input type="checkbox" checked={circular} onChange={(e) => setCircular(e.target.checked)} />
          Add a circular reference
        </label>

        <button className="run-btn" onClick={runComparison}>
          Run Comparison
        </button>

        {reports && (
          <div className="reports">
            {reports.map((report) => (
              <ReportCard key={report.method} report={report} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
