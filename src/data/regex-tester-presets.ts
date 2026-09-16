import type { RegexTesterPresetMeta } from "@/interfaces/regex-tester";

/*
  Curated pattern/test-string pairs — deliberately spanning the constructs the explain panel is
  built to handle (named groups, character classes, backreferences, lookaheads) so loading a preset
  doubles as a tour of the explainer's own capabilities, not just a convenience shortcut.
*/
export const regexTesterPresets: RegexTesterPresetMeta[] = [
  {
    slug: "email",
    name: "Email address",
    pattern: "[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    testString: "Contact us at hello@example.com or support@my-site.co.uk."
  },
  {
    slug: "iso-date",
    name: "ISO date",
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: "g",
    testString: "Order dates: 2024-01-15, 2024-03-02, and 2023-12-31."
  },
  {
    slug: "hex-color",
    name: "Hex color",
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    flags: "gi",
    testString: "Brand colors: #6366F1, #fff, and #1a2b3c."
  },
  {
    slug: "us-phone",
    name: "US phone number",
    pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
    flags: "g",
    testString: "Call (555) 123-4567 or 555.987.6543."
  },
  {
    slug: "repeated-word",
    name: "Repeated word",
    // A classic backreference example — \1 must match whatever group 1 actually captured.
    pattern: "\\b(\\w+)\\s+\\1\\b",
    flags: "gi",
    testString: "This this is is a test of repeated repeated words."
  },
  {
    slug: "password-strength",
    name: "Password strength",
    // Three lookaheads stacked before the length check — none of them consume characters, so all three test the SAME starting position.
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
    flags: "",
    testString: "Passw0rd123"
  },
  {
    slug: "trim-whitespace",
    name: "Leading/trailing whitespace",
    pattern: "^\\s+|\\s+$",
    flags: "g",
    testString: "   trim me please   "
  }
];
