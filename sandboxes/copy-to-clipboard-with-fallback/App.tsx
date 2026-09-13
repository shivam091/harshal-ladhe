import { useRef, useState } from "react";
import { copyToClipboard } from "./copyToClipboard";
import "./styles.css";

const SNIPPET = "npm install probably-not-a-real-package";

export default function App() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Copies the snippet and shows transient feedback, resetting back to idle after a couple of seconds.
  async function handleCopy() {
    const succeeded = await copyToClipboard(SNIPPET);
    setStatus(succeeded ? "copied" : "failed");

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Copy to Clipboard</h1>
        <div className="code-row">
          <code className="code">{SNIPPET}</code>
          <button type="button" className="copy-btn" onClick={handleCopy}>
            {status === "copied" ? "Copied!" : status === "failed" ? "Failed" : "Copy"}
          </button>
        </div>
        <p className="hint">Uses navigator.clipboard.writeText() here, with a hidden-textarea + execCommand("copy") fallback for anything that can't.</p>
      </div>
    </>
  );
}
