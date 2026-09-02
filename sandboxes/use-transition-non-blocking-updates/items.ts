const ADJECTIVES = ["quick", "lazy", "bright", "dark", "silent", "loud", "ancient", "modern", "tiny", "massive"];
const NOUNS = ["fox", "river", "engine", "signal", "forest", "circuit", "harbor", "comet", "anchor", "ember"];

// 4,000 generated labels — enough that filtering all of them synchronously is genuinely slow, not just theoretically slow.
export const ITEMS: string[] = Array.from({ length: 4000 }, (_, i) => `${ADJECTIVES[i % ADJECTIVES.length]}-${NOUNS[(i * 7) % NOUNS.length]}-${i}`);

// Deliberately wasteful per-item work standing in for "a genuinely expensive render" — without it, filtering 4,000 short strings would be fast enough that the blocking/non-blocking difference wouldn't be visible on a modern machine.
function artificialWork(): number {
  let total = 0;
  for (let i = 0; i < 4000; i++) total += i;
  return total;
}

// Filters ITEMS by a case-insensitive substring match, paying the artificial cost above per item.
export function filterItems(items: string[], query: string): string[] {
  const needle = query.toLowerCase();
  const result: string[] = [];
  for (const item of items) {
    artificialWork();
    if (item.includes(needle)) result.push(item);
  }
  return result;
}
