import { useMemo, useState } from "react";
import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./styles.css";

/*
  Request Simulator — read this before trusting anything below.

  The DECISION LOGIC in this file is real, hand-written TypeScript: authGateDecision, abBucketDecision,
  and geoRedirectDecision are genuine functions that branch on real inputs and return a real decision
  object, exactly the shape a Next.js middleware.ts would return (as data — this sandbox never
  constructs an actual NextResponse). hashVisitorIdToBucket is a real, deterministic hash function
  actually executed on every render; it isn't a canned lookup table.

  What's MOCKED is the request itself. There is no Edge Runtime here, no real HTTP request, no cookie
  jar, no network — just a plain object literal you build with the form controls below, standing in
  for what request.cookies.get(...), request.nextUrl.pathname, and a geo lookup would give a real
  middleware function. A browser sandbox can't host a real Next.js request pipeline; this is as close
  as static hosting gets, and the gap is called out here rather than hidden.
*/

/* ----------------------------- Shared decision type ----------------------------- */

type DecisionType = "next" | "redirect" | "rewrite";

interface Decision {
  type: DecisionType;
  // Present for redirect/rewrite — the URL the response points at.
  target?: string;
  // Present when this decision also issues a Set-Cookie header.
  setCookie?: string;
  // Plain-English explanation of why middleware made this call.
  reason: string;
}

const DECISION_LABEL: Record<DecisionType, string> = {
  next: "NextResponse.next()",
  redirect: "NextResponse.redirect()",
  rewrite: "NextResponse.rewrite()"
};

/* ----------------------------- Scenario 1: Auth gate ----------------------------- */

const PROTECTED_PREFIXES = ["/dashboard", "/account"];

function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

// Real decision function — mirrors checking request.cookies.get("session") in a real middleware.ts.
function authGateDecision(path: string, hasSessionCookie: boolean): Decision {
  if (!isProtectedPath(path)) {
    return { type: "next", reason: `"${path}" isn't under a protected prefix — middleware has nothing to check here.` };
  }
  if (hasSessionCookie) {
    return { type: "next", reason: "Session cookie present on a protected path — request continues through as normal." };
  }
  const from = encodeURIComponent(path);
  return {
    type: "redirect",
    target: `/login?from=${from}`,
    reason: "No session cookie on a protected path — redirecting to /login, with ?from= preserving where the visitor was headed."
  };
}

const AUTH_GATE_PATHS = ["/dashboard", "/dashboard/settings", "/account/billing", "/pricing"];

function AuthGatePanel() {
  const [path, setPath] = useState(AUTH_GATE_PATHS[1]);
  const [hasSessionCookie, setHasSessionCookie] = useState(false);

  const decision = useMemo(() => authGateDecision(path, hasSessionCookie), [path, hasSessionCookie]);

  return (
    <>
      <section className="demo-area" aria-label="Simulated auth-gate request">
        <p className="request-summary">
          {"{ path: "}<span className="tok-string">&quot;{path}&quot;</span>{", cookies: { session: "}
          <span className="tok-bool">{hasSessionCookie ? "\"present\"" : "undefined"}</span>{" } }"}
        </p>
        <DecisionReadout decision={decision} />
      </section>

      <fieldset className="control-group">
        <legend>Request</legend>
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="auth-path">Request path</label>
            <div className="field-input">
              <select id="auth-path" value={path} onChange={(event) => setPath(event.target.value)}>
                {AUTH_GATE_PATHS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <label className="checkbox-field" htmlFor="auth-session-cookie">
          <input
            type="checkbox"
            id="auth-session-cookie"
            checked={hasSessionCookie}
            onChange={(event) => setHasSessionCookie(event.target.checked)}
          />
          <span>Session cookie present (<code>request.cookies.get(&quot;session&quot;)</code>)</span>
        </label>

        <p className="tip">
          <code>/pricing</code> is a public path — middleware skips it entirely, cookie or not. The other
          three are under a protected prefix, so an absent session cookie always redirects.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Scenario 2: A/B bucketing ----------------------------- */

type Bucket = "a" | "b";
type BucketCookie = "none" | Bucket;

const AB_TEST_PATHS = new Set(["/", "/home"]);

// Real, deterministic hash (a small djb2-style rolling hash) — the same visitor id always hashes to
// the same bucket, which is exactly the property cookie-based bucketing depends on.
function hashVisitorIdToBucket(visitorId: string): Bucket {
  let hash = 0;
  for (let index = 0; index < visitorId.length; index += 1) {
    hash = (hash * 31 + visitorId.charCodeAt(index)) >>> 0;
  }
  return hash % 2 === 0 ? "a" : "b";
}

function generateVisitorId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// Real decision function — mirrors reading/writing an "ab-bucket" cookie in a real middleware.ts.
function abBucketDecision(path: string, bucketCookie: BucketCookie, visitorId: string): Decision {
  if (!AB_TEST_PATHS.has(path)) {
    return { type: "next", reason: `"${path}" isn't part of the A/B test — middleware leaves it alone.` };
  }

  if (bucketCookie !== "none") {
    return {
      type: "rewrite",
      target: `/home-variant-${bucketCookie}`,
      reason: `Existing ab-bucket=${bucketCookie} cookie found — rewriting to the same variant. No new assignment, no new cookie.`
    };
  }

  const bucket = hashVisitorIdToBucket(visitorId);
  return {
    type: "rewrite",
    target: `/home-variant-${bucket}`,
    setCookie: `ab-bucket=${bucket}; Path=/; Max-Age=2592000`,
    reason: `No ab-bucket cookie — hashed visitor id "${visitorId}" into bucket ${bucket.toUpperCase()} and set a cookie so this same visitor lands here again next time.`
  };
}

function AbBucketingPanel() {
  const [path, setPath] = useState("/home");
  const [bucketCookie, setBucketCookie] = useState<BucketCookie>("none");
  const [visitorId, setVisitorId] = useState(() => generateVisitorId());

  const decision = useMemo(() => abBucketDecision(path, bucketCookie, visitorId), [path, bucketCookie, visitorId]);

  return (
    <>
      <section className="demo-area" aria-label="Simulated A/B bucketing request">
        <p className="request-summary">
          {"{ path: "}<span className="tok-string">&quot;{path}&quot;</span>{", cookies: { ab-bucket: "}
          <span className="tok-bool">{bucketCookie === "none" ? "undefined" : `"${bucketCookie}"`}</span>{" } }"}
        </p>
        <DecisionReadout decision={decision} />
      </section>

      <fieldset className="control-group">
        <legend>Request</legend>
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="ab-path">Request path</label>
            <div className="field-input">
              <select id="ab-path" value={path} onChange={(event) => setPath(event.target.value)}>
                <option value="/">/</option>
                <option value="/home">/home</option>
                <option value="/pricing">/pricing (not in the test)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field field--full">
          <span className="field-label">ab-bucket cookie</span>
          <div className="segmented-control" role="group" aria-label="ab-bucket cookie state">
            {(["none", "a", "b"] as BucketCookie[]).map((option) => (
              <button
                key={option}
                type="button"
                className={`segment${bucketCookie === option ? " segment--active" : ""}`}
                onClick={() => setBucketCookie(option)}
              >
                {option === "none" ? "no cookie" : option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="toggle-btn"
          disabled={bucketCookie !== "none"}
          onClick={() => setVisitorId(generateVisitorId())}
        >
          Re-roll visitor id ({visitorId})
        </button>
        <p className="tip">
          With no cookie, the visitor id is hashed fresh on every render — re-roll it a few times and
          watch the assigned bucket change. Set a cookie above and the id stops mattering entirely: the
          existing bucket wins every time, which is the whole point of writing it down.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Scenario 3: Geo redirect + query preservation ----------------------------- */

const INTL_PREFIX_BY_COUNTRY: Record<string, string | null> = {
  US: null,
  IN: "/in",
  DE: "/de",
  JP: "/jp",
  BR: "/br"
};

const COUNTRY_LABELS: Record<string, string> = {
  US: "United States",
  IN: "India",
  DE: "Germany",
  JP: "Japan",
  BR: "Brazil"
};

// Real decision function — mirrors branching on a geolocation header and preserving the query string
// through a redirect (request.nextUrl.search survives untouched into the target URL).
function geoRedirectDecision(path: string, query: string, country: string): Decision {
  const prefix = INTL_PREFIX_BY_COUNTRY[country];

  if (!prefix) {
    return { type: "next", reason: `country=${country} — already on the right regional site, no redirect needed.` };
  }
  if (path === prefix || path.startsWith(`${prefix}/`)) {
    return { type: "next", reason: `Already under ${prefix} — middleware doesn't redirect a request that's already there.` };
  }

  const suffix = query.trim().length > 0 ? `?${query.trim()}` : "";
  return {
    type: "redirect",
    target: `${prefix}${path}${suffix}`,
    reason: `country=${country} — redirecting to the regional site, carrying the original query string (${query.trim() || "none"}) over untouched.`
  };
}

function GeoRedirectPanel() {
  const [path, setPath] = useState("/pricing");
  const [query, setQuery] = useState("ref=newsletter&utm_source=x");
  const [country, setCountry] = useState("IN");

  const decision = useMemo(() => geoRedirectDecision(path, query, country), [path, query, country]);

  return (
    <>
      <section className="demo-area" aria-label="Simulated geo-redirect request">
        <p className="request-summary">
          {"{ path: "}<span className="tok-string">&quot;{path}&quot;</span>{", search: "}
          <span className="tok-string">&quot;{query.trim()}&quot;</span>{", geo.country: "}
          <span className="tok-bool">&quot;{country}&quot;</span>{" }"}
        </p>
        <DecisionReadout decision={decision} />
      </section>

      <fieldset className="control-group">
        <legend>Request</legend>
        <div className="fields-grid">
          <div className="field">
            <label htmlFor="geo-path">Request path</label>
            <div className="field-input">
              <input id="geo-path" type="text" value={path} onChange={(event) => setPath(event.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="geo-country">Simulated country</label>
            <div className="field-input">
              <select id="geo-country" value={country} onChange={(event) => setCountry(event.target.value)}>
                {Object.keys(INTL_PREFIX_BY_COUNTRY).map((code) => (
                  <option key={code} value={code}>{code} — {COUNTRY_LABELS[code]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field field--full">
            <label htmlFor="geo-query">Query string (no leading ?)</label>
            <div className="field-input">
              <input id="geo-query" type="text" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
          </div>
        </div>
        <p className="tip">
          Change the path to <code>/in/pricing</code> while country is IN to see middleware recognize the
          request is already on the regional site and back off — real middleware has to guard against
          redirecting into a loop the same way.
        </p>
      </fieldset>
    </>
  );
}

/* ----------------------------- Shared decision readout ----------------------------- */

function DecisionReadout({ decision }: { decision: Decision }) {
  return (
    <div className="decision">
      <div className={`decision-badge decision-badge--${decision.type}`}>{DECISION_LABEL[decision.type]}</div>
      {decision.target && <p className="decision-target">→ <code>{decision.target}</code></p>}
      {decision.setCookie && <p className="decision-cookie">Set-Cookie: <code>{decision.setCookie}</code></p>}
      <output className="readout" aria-live="polite">{decision.reason}</output>
    </div>
  );
}

/* ----------------------------- App shell / tabs ----------------------------- */

type ScenarioTab = "auth" | "ab" | "geo";

const TAB_LABELS: Record<ScenarioTab, string> = {
  auth: "Auth Gate",
  ab: "A/B Bucketing",
  geo: "Geo Redirect + Query"
};

export default function App() {
  const [tab, setTab] = useState<ScenarioTab>("auth");

  return (
    <main className="playground">
      <header className="playground-header">
        <h1>Middleware Request Simulator</h1>
        <p>
          The decision functions below are real, hand-written TypeScript — real branching, a real hash
          function, real string logic — executed live on every change. The <strong>request object</strong>{" "}
          is mocked: there&apos;s no Edge Runtime, no network, and no real Next.js request pipeline in a
          browser sandbox, so the form controls stand in for what a real <code>request</code> would carry.
        </p>
      </header>

      <div className="tabs" role="tablist" aria-label="Middleware scenario">
        {(["auth", "ab", "geo"] as ScenarioTab[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`tab${tab === id ? " tab--active" : ""}`}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            {TAB_LABELS[id]}
          </button>
        ))}
      </div>

      <div className={`tab-panel${tab === "auth" ? " tab-panel--active" : ""}`}>
        {tab === "auth" && <AuthGatePanel />}
      </div>
      <div className={`tab-panel${tab === "ab" ? " tab-panel--active" : ""}`}>
        {tab === "ab" && <AbBucketingPanel />}
      </div>
      <div className={`tab-panel${tab === "geo" ? " tab-panel--active" : ""}`}>
        {tab === "geo" && <GeoRedirectPanel />}
      </div>
    </main>
  );
}
