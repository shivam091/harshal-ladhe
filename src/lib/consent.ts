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
