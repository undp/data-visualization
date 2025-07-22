export function transformDefaultValue(
  defaultValue?: string | string[] | number | number[],
):
  | { value: string | number; label: string | number }
  | { value: string | number; label: string | number }[]
  | undefined {
  if (defaultValue === undefined) return undefined;

  if (Array.isArray(defaultValue)) {
    return defaultValue.map(el => ({
      value: el,
      label: el,
    }));
  }

  return {
    value: defaultValue,
    label: defaultValue,
  };
}
