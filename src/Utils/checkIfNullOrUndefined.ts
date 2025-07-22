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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkIfNullOrUndefined(value: any) {
  if (value === undefined || value === null) return true;
  return false;
}
