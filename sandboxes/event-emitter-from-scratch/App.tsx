import { useEffect, useMemo, useState } from "react";
import { EventEmitter } from "./EventEmitter";
import "./styles.css";

interface Events {
  message: [text: string];
  [event: string]: unknown[];
}

function Subscriber({
  id,
  emitter,
  subscribed,
  onToggle
}: {
  id: number;
  emitter: EventEmitter<Events>;
  subscribed: boolean;
  onToggle: () => void;
}) {
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!subscribed) return;

    const unsubscribe = emitter.on("message", (text) => {
      setLog((prev) => [text, ...prev].slice(0, 4));
    });

    return unsubscribe;
  }, [subscribed, emitter]);

  return (
    <div className={subscribed ? "subscriber active" : "subscriber"}>
      <div className="subscriber-header">
        <span>Subscriber {id}</span>
        <button className="toggle-btn" onClick={onToggle}>
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
      <ul className="subscriber-log">
        {log.length === 0 && <li className="empty">No messages yet</li>}
        {log.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const emitter = useMemo(() => new EventEmitter<Events>(), []);
  const [draft, setDraft] = useState("Hello!");
  const [subs, setSubs] = useState([true, true, false]);

  function publish() {
    emitter.emit("message", draft);
  }

  function toggle(index: number) {
    setSubs((prev) => prev.map((s, i) => (i === index ? !s : s)));
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Event Emitter: Pub/Sub</h1>
        <p className="subtitle">Publish a message — only subscribers currently listening receive it.</p>

        <div className="publisher">
          <input className="draft-input" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button className="publish-btn" onClick={publish}>
            Publish
          </button>
        </div>

        <div className="subscribers">
          {subs.map((subscribed, i) => (
            <Subscriber key={i} id={i + 1} emitter={emitter} subscribed={subscribed} onToggle={() => toggle(i)} />
          ))}
        </div>
      </div>
    </>
  );
}
