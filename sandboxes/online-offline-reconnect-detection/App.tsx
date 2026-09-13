import { useOnlineStatus } from "./useOnlineStatus";
import { useSyncQueue } from "./useSyncQueue";
import "./styles.css";

// Dispatches a synthetic connectivity event on window — a real browser dispatches these same event types when the network actually changes, so useOnlineStatus reacts identically either way.
function simulateConnectivity(kind: "online" | "offline") {
  window.dispatchEvent(new Event(kind));
}

export default function App() {
  const isOnline = useOnlineStatus();
  const { queue, enqueue } = useSyncQueue(isOnline);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Online / Offline + Reconnect</h1>

        <div className="status-row">
          <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "● Online" : "● Offline"}
          </span>
          <div className="status-actions">
            <button type="button" onClick={() => simulateConnectivity("offline")} disabled={!isOnline}>
              Go offline
            </button>
            <button type="button" onClick={() => simulateConnectivity("online")} disabled={isOnline}>
              Back online
            </button>
          </div>
        </div>

        <button type="button" className="queue-btn" onClick={() => enqueue(`Update #${queue.length + 1}`)}>
          Queue an update
        </button>

        <ul className="queue-log">
          {queue.length === 0 && <li className="empty">Nothing queued yet — try going offline first.</li>}
          {queue.map((item) => (
            <li key={item.id} className={item.status}>
              {item.label} — {item.status}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
