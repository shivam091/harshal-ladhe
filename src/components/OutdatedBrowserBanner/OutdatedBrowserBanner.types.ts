// The browsers the site can recognise and give update advice for.
export type BrowserName = "chrome" | "edge" | "firefox" | "safari" | "opera";

// A recognised browser and its major version.
export interface DetectedBrowser {
  name: BrowserName;
  version: number;
}
