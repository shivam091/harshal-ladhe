import { useState, useEffect } from "react";
import { getTimeGreeting } from "@/utils/greetings";

// Computed after mount because the server's clock and timezone differ from the visitor's, which would break hydration.
export function useTimeGreeting(): string {
  const [greeting, setGreeting] = useState("Hello!");

  useEffect(() => {
    setGreeting(getTimeGreeting());
  }, []);

  return greeting;
}
