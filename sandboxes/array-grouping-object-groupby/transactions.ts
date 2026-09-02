// One sample transaction the live demo groups — category is a string key, amount drives the boolean "large" key.
export interface Transaction {
  id: number;
  category: string;
  amount: number;
}

// Fixed sample data so every run groups the exact same set — only the grouping key changes.
export const TRANSACTIONS: Transaction[] = [
  { id: 1, category: "groceries", amount: 42 },
  { id: 2, category: "rent", amount: 1200 },
  { id: 3, category: "groceries", amount: 18 },
  { id: 4, category: "transit", amount: 30 },
  { id: 5, category: "dining", amount: 65 },
  { id: 6, category: "rent", amount: 1200 },
  { id: 7, category: "transit", amount: 12 },
  { id: 8, category: "dining", amount: 88 }
];

// The manual pre-groupBy way to bucket an array by a derived key — what both Object.groupBy and Map.groupBy replace.
export function groupByReduce<T, K extends PropertyKey>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
}
