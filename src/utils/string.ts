/*
  Converts a camelCase or PascalCase string to its hyphenated (kebab-case) equivalent.
*/
export const hyphenate = (value: string) =>
  value
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase();
