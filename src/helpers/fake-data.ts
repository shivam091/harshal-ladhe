import { CAPITAL_ALPHABETS, EMAIL_DOMAINS, FIRST_NAMES, LAST_NAMES } from "@/constants/fake-data";
import { sampleOne } from "@/utils/random";

// An occasional title or middle initial keeps placeholder names from feeling templated.
export function generateFullName(): string {
  const first  = sampleOne(FIRST_NAMES);
  const last   = sampleOne(LAST_NAMES);
  const parts: string[] = [];

  if (Math.random() <= 0.05) parts.push("Dr.");
  parts.push(first);
  if (Math.random() <= 0.25) parts.push(sampleOne(CAPITAL_ALPHABETS) + ".");
  parts.push(last);

  return parts.join(" ");
}

// Built from the name placeholder so the two example fields read as one believable person.
export function generateEmailFromName(fullName: string): string {
  const isDoctor = fullName.startsWith("Dr.");
  const localPart = isDoctor
    ? "the-doctor"
    : fullName.replace(/^Dr\.\s*/, "").split(" ")[0].toLowerCase();
  return `${localPart}@${sampleOne(EMAIL_DOMAINS)}`;
}
