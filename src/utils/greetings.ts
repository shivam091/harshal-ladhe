// Uses the visitor's local clock so the greeting matches their day, not the server's.
export const getTimeOfDay = (): string => {
  const now = new Date();
  const hourOfDay = now.getHours();

  if (hourOfDay <= 4) {
    return "night";
  } else if (hourOfDay <= 11) {
    return "morning";
  } else if (hourOfDay <= 17) {
    return "afternoon";
  } else if (hourOfDay <= 21) {
    return "evening";
  } else {
    return "night";
  }
};

// A time-aware greeting makes the page feel a little more personal.
export function getTimeGreeting(): string {
  const timeOfDay = getTimeOfDay();

  switch (timeOfDay) {
    case "morning":
      return "Good morning!";
    case "afternoon":
      return "Good afternoon!";
    case "evening":
    case "night":
      return "Good evening!";
    default:
      return "Good day!";
  }
}
