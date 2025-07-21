import { checkIfNullOrUndefined } from './checkIfNullOrUndefined';

/**
 * Formats a number into a human-readable string, optionally with a prefix and/or suffix.
 *
 * - Adds suffixes like `K`, `M`, `B`, and `T` for large numbers.
 * - If the number is less than 10,000 and an integer, it is returned as-is.
 * - If `value` is `null` or `undefined`, returns `"NA"`.
 *
 * @param value - The number to format.
 * @param precision - Optional no of digits after decimal.
 * @param prefix - Optional string to prepend.
 * @param suffix - Optional string to append.
 * @returns A formatted string.
 *
 * @example
 * numberFormattingFunction(5000); // "5000"
 * numberFormattingFunction(125000); // "125K"
 * numberFormattingFunction(3.14159, '$'); // "$3.14"
 * numberFormattingFunction(null); // "NA"
 */

export function numberFormattingFunction(
  value: number | undefined | null,
  precision?: number,
  prefix?: string,
  suffix?: string,
) {
  const formatNumberToReadableString = (num: number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    if (tier === 0) return num.toString();
    const scaled = num / 10 ** (tier * 3);
    const formatted = scaled.toFixed(precision || 2).replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1'); // Remove trailing ".0"
    return formatted + suffixes[tier];
  };
  if (checkIfNullOrUndefined(value)) return 'NA';
  if (
    (value as number) < 10000 &&
    (value as number) > -10000 &&
    Math.round(value as number) === value
  )
    return `${prefix || ''}${value}${suffix || ''}`;
  return `${prefix || ''}${
    Math.abs(value as number) < 1000
      ? (value as number).toFixed(precision || 2).replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
      : formatNumberToReadableString(value as number)
  }${suffix || ''}`;
}
