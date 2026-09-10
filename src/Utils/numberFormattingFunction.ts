import type { PadZerosTypes } from '@/Types';
import { checkIfNullOrUndefined } from './checkIfNullOrUndefined';

/**
 * Formats a number into a human-readable string, optionally with prefix/suffix
 * and locale-aware formatting.
 *
 * Supports:
 * - Compact notation (K, M, B, T)
 * - Locale formatting via Intl.NumberFormat
 * - Prefix and suffix
 * - NA fallback
 */

const formatWithLocale = (
  num: number,
  precisionValue: number,
  locale?: string,
  padZeros?: boolean,
) => {
  return new Intl.NumberFormat(locale || 'en', {
    minimumFractionDigits: padZeros && num !== 0 ? precisionValue : 0,
    maximumFractionDigits: precisionValue,
    useGrouping: false,
  }).format(num);
};
const formatCompact = (n: number, precisionValue: number, locale?: string, padZeros?: boolean) => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(n)) / 3);

  if (tier === 0) {
    return formatWithLocale(n, precisionValue, locale, padZeros);
  }

  const scaled = n / 10 ** (tier * 3);
  const formatted = formatWithLocale(scaled, precisionValue, locale, padZeros);

  return formatted + suffixes[tier];
};
export function numberFormattingFunction(
  value: number | string | undefined | null,
  naLabel?: string,
  precision?: number,
  prefix?: string,
  suffix?: string,
  locale?: string,
  padZeros?: PadZerosTypes,
) {
  if (checkIfNullOrUndefined(value)) return naLabel || 'NA';

  if (typeof value === 'string') {
    return `${prefix || ''}${value}${suffix || ''}`;
  }

  if (checkIfNullOrUndefined(value)) {
    return naLabel || 'NA';
  }
  const num = value as number;
  // Small numbers (no compacting)
  if (Math.abs(num) < 1000 && Number.isInteger(num)) {
    return `${prefix || ''}${formatWithLocale(num, precision ?? 0, locale, padZeros === 'all')}${suffix || ''}`;
  }
  const formattedNumber =
    Math.abs(num) < 1000
      ? formatWithLocale(num, precision ?? 2, locale, padZeros === 'all' || padZeros === 'decimal')
      : formatCompact(num, precision ?? 2, locale, padZeros === 'all' || padZeros === 'decimal');

  return `${prefix || ''}${formattedNumber}${suffix || ''}`;
}
