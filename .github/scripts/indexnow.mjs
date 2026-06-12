/*
  Submits sitemap URLs changed since SINCE to IndexNow (Bing, Yandex, Seznam, Naver, Yep share
  submissions), replacing the sitemap ping Google and Bing retired in 2023. Reading lastmod from
  the deployed sitemap, rather than diffing files, keeps the URL rules in one place: sitemap.ts.
*/
const SITE_URL = (process.env.SITE_URL || "https://harshal-ladhe.vercel.app").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY;
const SINCE = process.env.SINCE ? new Date(process.env.SINCE) : null;
// The protocol's per-request ceiling.
const BATCH_SIZE = 10000;

if (!KEY) throw new Error("INDEXNOW_KEY is not set");
if (SINCE && Number.isNaN(SINCE.getTime())) throw new Error(`SINCE is not a date: ${process.env.SINCE}`);

const keyLocation = `${SITE_URL}/${KEY}.txt`;

// IndexNow rejects the whole batch if it can't read the key back, so fail here with a clearer message.
const served = await fetch(keyLocation).then((response) => (response.ok ? response.text() : ""));
if (served.trim() !== KEY) throw new Error(`Key file at ${keyLocation} is missing or doesn't match`);

const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((response) => {
  if (!response.ok) throw new Error(`Sitemap fetch failed: HTTP ${response.status}`);
  return response.text();
});

const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  loc: block.match(/<loc>(.*?)<\/loc>/)?.[1],
  lastmod: block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]
}));

// Entries without a lastmod are kept, since there's no way to tell they didn't change.
const urls = entries
  .filter(({ loc, lastmod }) => loc && (!SINCE || !lastmod || new Date(lastmod) > SINCE))
  .map(({ loc }) => loc);

console.log(`${urls.length} of ${entries.length} sitemap URLs changed${SINCE ? ` since ${SINCE.toISOString()}` : ""}`);
if (urls.length === 0) process.exit(0);

for (let start = 0; start < urls.length; start += BATCH_SIZE) {
  const urlList = urls.slice(start, start + BATCH_SIZE);
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation, urlList })
  });

  // 200 and 202 both mean accepted; 202 is returned while the key is still being verified.
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow rejected the batch: HTTP ${response.status} ${await response.text()}`);
  }
  console.log(`Submitted ${urlList.length} URLs (HTTP ${response.status})`);
  urlList.forEach((url) => console.log(`  ${url}`));
}
