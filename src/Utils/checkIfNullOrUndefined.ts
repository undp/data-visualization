/**
 * Checks whether a given value is `null` or `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 *
 * @example
 * checkIfNullOrUndefined(null); // true
 * checkIfNullOrUndefined(undefined); // true
 * checkIfNullOrUndefined(0); // false
 * checkIfNullOrUndefined(''); // false
 */
// biome-ignore lint/suspicious/noExplicitAny: undefined data type
export function checkIfNullOrUndefined(value: any) {
  if (value === undefined || value === null) return true;
  return false;
}
