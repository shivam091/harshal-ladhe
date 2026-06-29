// Escapes "<" so a title containing "</script>" can't prematurely close the tag and inject markup.
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
