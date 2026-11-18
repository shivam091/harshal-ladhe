import type { RegexTesterPresetMeta } from "@/components/RegexTester/RegexTester.types";

/*
  Curated pattern/test-string pairs — the everyday validation and extraction jobs people actually
  reach for (emails, URLs, dates, IDs, versions), each with a test string that includes a near-miss
  or two so the highlighting shows what the pattern rejects as well as what it accepts. Between them
  they still span the constructs the explain panel handles (named groups, classes, backreferences,
  lookarounds, zero-length matches), so loading one doubles as a tour of the tool.
*/
export const regexTesterPresets: RegexTesterPresetMeta[] = [
  {
    slug: "email",
    name: "Email address",
    pattern: "[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)*\\.[a-zA-Z]{2,}",
    flags: "g",
    testString: "Contact hello@example.com, support@my-site.co.uk or first.last+tag@mail.example.org — not user@localhost or @missing.com."
  },
  {
    slug: "url",
    name: "URL (http/https)",
    pattern: "https?:\\/\\/[\\w-]+(?:\\.[\\w-]+)+(?::\\d+)?(?:\\/[\\w\\-.~%/]*)?(?:\\?[\\w\\-.~%=&]*)?(?:#[\\w-]*)?",
    flags: "gi",
    testString: "Docs at https://example.com/guide?page=2#intro, local http://localhost.dev:3000/api and ftp://old.example.com (not http)."
  },
  {
    slug: "iso-date",
    name: "ISO date (named groups)",
    pattern: "(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])",
    flags: "g",
    testString: "Order dates: 2024-01-15, 2024-03-02 and 2023-12-31 — but not 2024-13-01 or 2024-02-32."
  },
  {
    slug: "time-24h",
    name: "24-hour time",
    pattern: "\\b(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?\\b",
    flags: "g",
    testString: "Doors open 09:30, show at 19:45:00, last train 23:59 — not 24:00 or 7:5."
  },
  {
    slug: "ipv4",
    name: "IPv4 address",
    pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\b",
    flags: "g",
    testString: "Servers: 192.168.1.10, 10.0.0.255 and 8.8.8.8 — invalid: 256.1.1.1 and 192.168.1."
  },
  {
    slug: "uuid",
    name: "UUID",
    pattern: "\\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\b",
    flags: "gi",
    testString: "Request 3f2504e0-4f89-41d3-9a0c-0305e82c3301 and 123E4567-E89B-12D3-A456-426614174000; not 1234-5678."
  },
  {
    slug: "semver",
    name: "Semantic version",
    pattern: "\\bv?(?<major>0|[1-9]\\d*)\\.(?<minor>0|[1-9]\\d*)\\.(?<patch>0|[1-9]\\d*)(?:-(?<pre>[\\w.-]+))?(?:\\+(?<build>[\\w.-]+))?\\b",
    flags: "g",
    testString: "Upgraded from v1.4.2 to 2.0.0-rc.1+build.5; skip 01.2.3 and 1.2."
  },
  {
    slug: "hex-colour",
    name: "Hex colour",
    pattern: "#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\\b",
    flags: "gi",
    testString: "Brand colours: #6366F1, #fff, #1a2b3c80 and #abcd — not #12345 or #ggg."
  },
  {
    slug: "uk-postcode",
    name: "UK postcode",
    pattern: "\\b[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[A-Z]{2}\\b",
    flags: "gi",
    testString: "Send to SW1A 1AA, M1 1AE or EC1A1BB — not 12345 or ABC 123."
  },
  {
    slug: "phone-e164",
    name: "International phone (E.164)",
    pattern: "\\+[1-9]\\d{6,14}\\b",
    flags: "g",
    testString: "Call +442071838750 or +14155552671 — not 020 7183 8750 or +0123456."
  },
  {
    slug: "slug",
    name: "URL slug",
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    flags: "gm",
    testString: "css-keyframes-guide\nmastering-async-javascript\nNot A Slug\ntrailing-dash-\ndouble--dash"
  },
  {
    slug: "markdown-link",
    name: "Markdown link",
    pattern: "\\[(?<text>[^\\]]+)\\]\\((?<url>[^)\\s]+)(?:\\s\"(?<title>[^\"]*)\")?\\)",
    flags: "g",
    testString: "Read [the guide](https://example.com/guide \"Guide\") and [docs](/docs) — ![image](cat.png) matches too."
  },
  {
    slug: "html-tag",
    name: "HTML tag pair",
    // The named backreference \k<tag> makes the closing tag repeat whatever name the opening tag captured.
    pattern: "<(?<tag>[a-z][a-z0-9]*)\\b[^>]*>(?<content>[\\s\\S]*?)<\\/\\k<tag>>",
    flags: "gi",
    testString: "<p class=\"lead\">Hello</p> <strong>bold</strong> <em>mismatched</b>"
  },
  {
    slug: "repeated-word",
    name: "Repeated word",
    // A classic backreference example — \1 must match whatever group 1 actually captured.
    pattern: "\\b(\\w+)\\s+\\1\\b",
    flags: "gi",
    testString: "This this is is a test of repeated repeated words — but not 'the theory'."
  },
  {
    slug: "thousands",
    name: "Add thousands separators",
    // Zero-length matches: each one marks a position where a comma belongs, ready for .replace(regex, ",").
    pattern: "\\B(?=(\\d{3})+(?!\\d))",
    flags: "g",
    testString: "1234567 and 9876543210"
  },
  {
    slug: "camel-case-split",
    name: "camelCase word boundaries",
    // Lookbehind plus lookahead, consuming nothing — the markers show where a space or hyphen would go.
    pattern: "(?<=[a-z0-9])(?=[A-Z])",
    flags: "g",
    testString: "backgroundColor borderTopLeftRadius getElementById"
  },
  {
    slug: "password-strength",
    name: "Password strength",
    // Three lookaheads stacked before the length check — none of them consume characters, so all three test the SAME starting position.
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$",
    flags: "gm",
    testString: "Passw0rd!23\npassword\nSHORT1!\nNoSymbols123"
  },
  {
    slug: "trim-whitespace",
    name: "Leading/trailing whitespace",
    pattern: "^\\s+|\\s+$",
    flags: "g",
    testString: "   trim me please   "
  },
  {
    slug: "duplicate-spaces",
    name: "Runs of spaces",
    pattern: " {2,}",
    flags: "g",
    testString: "Too   many    spaces  between words."
  }
];
