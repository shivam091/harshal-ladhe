import { useId } from "react";

// Derives a stable anchor id from the title so asides can be deep-linked to,
// same as headings. Falls back to a React-generated id for non-string titles.
export function useTitleId(title: React.ReactNode): string | undefined {
  const uniqueId = useId();

  if (!title) {
    return undefined;
  }

  if (typeof title !== "string") {
    return `aside-${uniqueId.replace(/:/g, "")}`;
  }

  const sanitizedTitle = title
    .replace(/\s/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  return `aside-${sanitizedTitle}`;
}
