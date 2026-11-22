/*
  Where consent is required before analytics storage: the EEA (EU plus Iceland, Liechtenstein, Norway), the UK and
  Switzerland. Shared by gtag's regional default and the banner's region check so the two can't disagree.
*/
export const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT",
  "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH"
];

export const CONSENT_STORAGE_KEY = "analytics-consent";

export type ConsentChoice = "granted" | "denied";

// Lets a "change cookie settings" control reopen the banner without the two sharing state.
export const CONSENT_OPEN_EVENT = "consent:open";

export function isConsentRegion(country: string): boolean {
  return CONSENT_REGIONS.includes(country.toUpperCase());
}

export function consentParams(choice: ConsentChoice): Record<string, ConsentChoice> {
  return {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice
  };
}

// What the reader has answered so far; "unset" covers both never asked and not yet answered.
export const CONSENT_STATUSES = ["granted", "denied", "unset"] as const;

export type ConsentStatus = (typeof CONSENT_STATUSES)[number];

// What the banner reports about itself to /api/consent; "shown" is an impression rather than an answer.
export const CONSENT_EVENTS = ["shown", "granted", "denied"] as const;

export type ConsentEvent = (typeof CONSENT_EVENTS)[number];

// Storage can throw (private mode, blocked cookies), and then the answer is simply unknown.
export function readConsentStatus(): ConsentStatus {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

// Keepalive so the report survives the navigation a click on the banner's link may trigger; never throws.
export function reportConsent(event: ConsentEvent, previous: ConsentStatus = "unset"): void {
  const body = JSON.stringify({ event, previous });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/consent", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Counting the banner must never get in the way of answering it.
  }
}
