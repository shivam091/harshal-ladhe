export interface Item {
  id: number;
  label: string;
}

const WORDS = ["alpha", "bravo", "circuit", "delta", "engine", "falcon", "gamma", "harbor", "ion", "jungle"];

// A deliberately large list — big enough that filtering it on every keystroke is expensive enough
// to visibly compete with the input's own re-render if it isn't deprioritized somehow.
export function generateItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    items.push({ id: i, label: `${WORDS[i % WORDS.length]}-${i}` });
  }
  return items;
}

// Simulates an expensive per-item computation so filtering 4000+ items is slow enough to matter —
// standing in for whatever real work (formatting, derived fields) a real list item might do.
export function isExpensiveMatch(item: Item, query: string): boolean {
  let acc = 0;
  for (let i = 0; i < 200; i++) acc += i;
  return acc >= 0 && item.label.includes(query.toLowerCase());
}
