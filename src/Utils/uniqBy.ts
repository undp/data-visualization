export function uniqBy(
  obj: Record<string, string | number | boolean | null | undefined>[],
  key: string,
  filterNully = false,
) {
  const defaultValue = obj
    .map(d => d[key])
    .filter(d => (filterNully ? d != null && d !== undefined : true));
  return [...new Set(defaultValue)];
}
