// Loads the live site in a real browser and checks that analytics still works end to end, so a deploy that
// silently breaks the tag, the consent wiring or the view beacon is noticed within a day rather than in the data.
import { chromium } from "playwright";

const SITE_URL = (process.env.SITE_URL || "https://harshal-ladhe.vercel.app").replace(/\/$/, "");
const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || "G-R5EZ91PMYX";

// Generous because the runner is cold and GA's script is fetched live.
const WAIT_MS = 20000;

// Both Google's domains and the first-party proxy path, so the check holds whether or not the proxy is switched on.
const COLLECT_PATTERN = /(google-analytics\.com|analytics\.google\.com|\/stats)\/g\/(s\/)?collect/;

const failures = [];

function check(ok, message) {
  console.log(`${ok ? "ok  " : "FAIL"} ${message}`);
  if (!ok) failures.push(message);
}

// One page load under a given stored consent answer, returning what the page sent and received.
async function load(browser, choice) {
  const context = await browser.newContext();
  if (choice) await context.addInitScript((value) => localStorage.setItem("analytics-consent", value), choice);
  const page = await context.newPage();

  const collects = [];
  const views = [];
  page.on("request", (request) => {
    if (COLLECT_PATTERN.test(request.url())) collects.push(request.url());
  });
  page.on("response", (response) => {
    if (response.url().endsWith("/api/views") && response.request().method() === "POST") views.push(response.status());
  });

  await page.goto(SITE_URL, { waitUntil: "load" });
  await page.waitForFunction(() => document.readyState === "complete");
  await page.waitForFunction(
    (id) => Boolean(window.google_tag_manager && window.google_tag_manager[id]),
    MEASUREMENT_ID,
    { timeout: WAIT_MS }
  ).catch(() => {});

  const tagLoaded = await page.evaluate((id) => Boolean(window.google_tag_manager && window.google_tag_manager[id]), MEASUREMENT_ID);
  const region = await page.evaluate(() => fetch("/api/consent-region", { cache: "no-store" }).then((res) => res.json()));

  // Collect hits are batched shortly after the page view, so give them a moment before reading.
  await page.waitForTimeout(4000);
  await context.close();
  return { collects, views, tagLoaded, region };
}

const browser = await chromium.launch();
try {
  const open = await load(browser, null);
  check(open.tagLoaded, "gtag.js loaded and configured the measurement ID");
  check(open.collects.length > 0, "a GA collect request was sent");
  check(open.views.includes(204), "the page-view beacon /api/views answered 204");
  check(typeof open.region.required === "boolean", "/api/consent-region answers with a boolean");

  // Consent Mode must still hold back storage after a decline: hits then carry gcs=G100 and no cookies are set.
  const declined = await load(browser, "denied");
  check(declined.tagLoaded, "gtag.js still loads for a reader who declined");
  check(declined.collects.some((url) => /[?&]gcs=G100/.test(url)), "a declined reader's hits carry gcs=G100 (storage denied)");
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed against ${SITE_URL}`);
  process.exit(1);
}
console.log(`\nAll checks passed against ${SITE_URL}`);
