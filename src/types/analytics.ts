// Shape of the analytics data attributes read by useAnalytics from any tracked element in the DOM.
export type AnalyticsEvent = {
  // GA4 event name sent as the first argument to gtag("event", ...).
  event: string;
  // Human-readable label describing the specific element that was interacted with.
  label: string;
  // Logical grouping for the event, e.g. "social", "footer", "nav".
  category: string;
};
