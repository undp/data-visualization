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
export function numberFormattingFunction(
  value: number | string | undefined | null,
  naLabel?: string,
  precision?: number,
  prefix?: string,
  suffix?: string,
  locale?: string,
) {
  if (checkIfNullOrUndefined(value)) return naLabel || 'NA';
  const formatWithLocale = (num: number, precisionValue: number) => {
    return new Intl.NumberFormat(locale || 'en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precisionValue,
      useGrouping: false,
    }).format(num);
  };

  if (typeof value === 'string') {
    return `${prefix || ''}${value}${suffix || ''}`;
  }

  if (checkIfNullOrUndefined(value)) {
    return naLabel || 'NA';
  }

  const num = value as number;

  const formatCompact = (n: number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(n)) / 3);

    if (tier === 0) {
      return formatWithLocale(n, precision === 0 ? 0 : precision || 2);
    }

    const scaled = n / Math.pow(10, tier * 3);

    const formatted = formatWithLocale(scaled, precision === 0 ? 0 : precision || 2);

    return formatted + suffixes[tier];
  };

  // Small numbers (no compacting)
  if (num < 10000 && num > -10000 && Number.isInteger(num)) {
    return `${prefix || ''}${formatWithLocale(num, 0)}${suffix || ''}`;
  }

  const formattedNumber =
    Math.abs(num) < 1000
      ? formatWithLocale(num, precision === 0 ? 0 : precision || 2)
      : formatCompact(num);

  return `${prefix || ''}${formattedNumber}${suffix || ''}`;
}
