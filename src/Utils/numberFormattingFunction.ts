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
  padZeros?: boolean,
) {
  if (checkIfNullOrUndefined(value)) return naLabel || 'NA';
  const formatWithLocale = (num: number, precisionValue: number) => {
    return new Intl.NumberFormat(locale || 'en', {
      minimumFractionDigits: padZeros && num !== 0 ? precisionValue : 0,
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
  const resolvedPrecision = precision ?? 2;

  const formatCompact = (n: number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(n)) / 3);

    if (tier === 0) {
      return formatWithLocale(n, resolvedPrecision);
    }

    const scaled = n / Math.pow(10, tier * 3);

    const formatted = formatWithLocale(scaled, resolvedPrecision);

    return formatted + suffixes[tier];
  };
  // Small numbers (no compacting)
  if (num < 10000 && num > -10000 && Number.isInteger(num)) {
    return `${prefix || ''}${formatWithLocale(num, 0)}${suffix || ''}`;
  }

  const formattedNumber =
    Math.abs(num) < 1000 ? formatWithLocale(num, resolvedPrecision) : formatCompact(num);

  return `${prefix || ''}${formattedNumber}${suffix || ''}`;
}
