import { useState } from "react";
import { useBroadcastPanel } from "./useBroadcastPanel";
import "./styles.css";

const CHANNEL_NAME = "demo-channel";

// One "simulated tab" — a real, independent BroadcastChannel instance. Two of these side by side
// behave exactly like the same page open in two separate browser tabs would.
function Panel({ name }: { name: string }) {
  const { log, send } = useBroadcastPanel(CHANNEL_NAME, name);
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) return;
    send(draft.trim());
    setDraft("");
  }

  return (
    <div className="panel">
      <p className="panel-title">{name}</p>
      <div className="panel-row">
        <input
          className="panel-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button className="panel-send" type="button" onClick={handleSend}>
          Send
        </button>
      </div>
      <ul className="panel-log">
        {log.length === 0 && <li className="empty">Nothing yet.</li>}
        {log.map((line) => (
          <li key={line.id} className={line.fromSelf ? "sent" : "received"}>
            {line.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="wrapper">
        <h1 className="title">BroadcastChannel</h1>
        <p className="subtitle">Two independent tabs, same channel name — send from one, watch it land in the other.</p>
        <div className="panels">
          <Panel name="Tab A" />
          <Panel name="Tab B" />
        </div>
      </div>
    </>
  );
}
