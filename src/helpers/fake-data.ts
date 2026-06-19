import { CAPITAL_ALPHABETS, EMAIL_DOMAINS, FIRST_NAMES, LAST_NAMES } from "@/constants/fake-data";
import { sampleOne } from "@/utils/random";

// Generates a random full name, occasionally including a "Dr." prefix or a middle initial.
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

// Derives a placeholder email address from a full name, using a random free-mail domain.
export function generateEmailFromName(fullName: string): string {
  const isDoctor = fullName.startsWith("Dr.");
  const localPart = isDoctor
    ? "the-doctor"
    : fullName.replace(/^Dr\.\s*/, "").split(" ")[0].toLowerCase();
  return `${localPart}@${sampleOne(EMAIL_DOMAINS)}`;
}
