// Object.fromEntries loses key/value types; this keeps them typed through the transform.
export function transformObject<K extends string, V, NK extends string, NV>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => [NK, NV]
): Record<NK, NV> {
  return Object.fromEntries(
    (Object.entries(obj) as [K, V][]).map(([k, v]) => fn(k, v))
  ) as Record<NK, NV>;
}
