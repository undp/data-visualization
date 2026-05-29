// biome-ignore lint/suspicious/noExplicitAny: undefined data type
export function uniqBy<T extends Record<string, any>>(obj: T[], key: keyof T, filterNully = false) {
  const defaultValue = obj
    .map((d) => d[key])
    .filter((d) => (filterNully ? d != null && d !== undefined : true));
  return [...new Set(defaultValue)];
}
