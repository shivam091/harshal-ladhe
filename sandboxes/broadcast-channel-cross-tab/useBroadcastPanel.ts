import { useEffect, useRef, useState } from "react";

export interface LogLine {
  id: number;
  text: string;
  fromSelf: boolean;
}

// Opens its OWN BroadcastChannel instance on `channelName` — two instances on the same channel
// name behave identically whether they're two components on one page (as here) or two separate
// browser tabs, since BroadcastChannel only ever delivers to OTHER listeners, never back to sender.
export function useBroadcastPanel(channelName: string, panelName: string) {
  const [log, setLog] = useState<LogLine[]>([]);
  const nextId = useRef(1);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<string>) => {
      setLog((prev) => [{ id: nextId.current++, text: event.data, fromSelf: false }, ...prev].slice(0, 6));
    };

    return () => channel.close();
  }, [channelName]);

  function send(message: string) {
    const text = `${panelName}: ${message}`;
    channelRef.current?.postMessage(text);
    setLog((prev) => [{ id: nextId.current++, text, fromSelf: true }, ...prev].slice(0, 6));
  }

  return { log, send };
}
