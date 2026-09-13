import { useEffect, useState } from "react";

// Tracks live connectivity via the window 'online'/'offline' events, seeded from navigator.onLine at mount. Real or synthetically dispatched events are handled identically — the listener doesn't distinguish the two.
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // Flips the tracked status to online when the browser reports connectivity restored.
    function handleOnline() {
      setIsOnline(true);
    }

    // Flips the tracked status to offline when the browser reports connectivity lost.
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
