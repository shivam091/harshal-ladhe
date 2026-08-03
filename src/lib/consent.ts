import { postBeacon } from "@/lib/beacon";

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

/*
  Four answers rather than granted/denied alone, because GA treats the two unanswered cases differently: a reader
  where no banner is needed is counted, one who hasn't answered yet is not.
*/
export const CONSENT_STATUSES = ["granted", "denied", "pending", "default"] as const;

export type ConsentStatus = (typeof CONSENT_STATUSES)[number];

// "shown" sits beside the answers so impressions and answers share one daily count and compare directly.
export const CONSENT_EVENTS = ["shown", "granted", "denied"] as const;

export type ConsentEvent = (typeof CONSENT_EVENTS)[number];

// Session-scoped so the region question is asked once per visit, not once per page.
const REQUIRED_STORAGE_KEY = "analytics-consent-required";

// Long enough for a slow edge lookup, short enough that a view is never held back noticeably.
const REQUIRED_WAIT_MS = 1000;

// Storage can throw (private mode, blocked cookies), and then the answer is simply unknown.
function readStoredChoice(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

// Remembered per session so only a visit's first page pays for the lookup.
function readRequired(): boolean | null {
  try {
    const value = window.sessionStorage.getItem(REQUIRED_STORAGE_KEY);
    return value === "1" ? true : value === "0" ? false : null;
  } catch {
    return null;
  }
}

// Module-level so the banner and the view beacon share one request rather than each asking.
let requiredPromise: Promise<boolean> | undefined;

/*
  Failing safe: when the lookup fails the reader is treated as needing the banner, as the server does for an unknown
  location, so a broken lookup never silently skips consent in the EEA.
*/
export function fetchConsentRequired(): Promise<boolean> {
  const known = readRequired();
  if (known !== null) return Promise.resolve(known);

  requiredPromise ??= fetch("/api/consent-region", { cache: "no-store" })
    .then((res) => (res.ok ? (res.json() as Promise<{ required?: boolean }>) : null))
    .then((data) => {
      const required = data?.required !== false;
      try {
        window.sessionStorage.setItem(REQUIRED_STORAGE_KEY, required ? "1" : "0");
      } catch {
        // Without storage the next page simply asks again.
      }
      return required;
    })
    .catch(() => true);
  return requiredPromise;
}

// Synchronous for callers that can't wait; an unanswered region counts as pending, matching the fail-safe above.
export function readConsentStatus(): ConsentStatus {
  const choice = readStoredChoice();
  if (choice) return choice;
  return readRequired() === false ? "default" : "pending";
}

/*
  Waits for the region answer only when it is needed, and gives up after a moment so a slow lookup can't delay the
  view that asked.
*/
export function resolveConsentStatus(): Promise<ConsentStatus> {
  const choice = readStoredChoice();
  if (choice) return Promise.resolve(choice);

  const fallback = new Promise<boolean>((resolve) => setTimeout(() => resolve(true), REQUIRED_WAIT_MS));
  return Promise.race([fetchConsentRequired(), fallback]).then((required) => (required ? "pending" : "default"));
}

// Keepalive so the report survives the navigation a click on the banner's link may trigger; never throws.
export function reportConsent(event: ConsentEvent, previous: ConsentStatus = "pending"): void {
  postBeacon("/api/consent", { event, previous });
}
