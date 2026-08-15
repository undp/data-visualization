import * as ss from 'simple-statistics';
/**
 * Returns a mean for a set of number
 *
 * @param data - Array of numeric values
 *
 * @returns A number
 *
 * @example
 * getMean([1, 2, 3, 10, 20, 30]); // e.g., 11.166666666666666
 */

export function getMean(data: (number | null | undefined)[]) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.mean(d1);
}

/**
 * Returns a mean for a set of number
 *
 * @param data - Array of numeric values
 *
 * @returns A number
 *
 * @example
 * getMedian([1, 2, 3, 10, 20, 30]); // e.g., 6.5
 */
export function getMedian(data: (number | null | undefined)[]) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.median(d1);
}

/**
 * Returns a mode for a set of number
 *
 * @param data - Array of numeric values
 *
 * @returns A number
 *
 * @example
 * getMode([1, 2, 3, 10, 20, 30]); // e.g., 1
 */
export function getMode(data: (number | null | undefined)[]) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.mode(d1);
}

/**
 * Returns a standard deviation for a set of number
 *
 * @param data - Array of numeric values
 *
 * @returns A number
 *
 * @example
 * getStandardDeviation([1, 2, 3, 10, 20, 30]); // e.g., 11.166666666666666
 */
export function getStandardDeviation(data: (number | null | undefined)[]) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.standardDeviation(d1);
}

/**
 * Returns a variance for a set of number
 *
 * @param data - Array of numeric values
 *
 * @returns A number
 *
 * @example
 * getVariance([1, 2, 3, 10, 20, 30]); // e.g., 11.166666666666666
 */
export function getVariance(data: (number | null | undefined)[]) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.variance(d1);
}

/**
 * Returns a quantile for a set of number
 *
 * @param data - Array of numeric values
 * @param percentile - Percentile to calculate
 *
 * @returns A number
 *
 * @example
 * getPercentile([1, 2, 3, 10, 20, 30], 0.5); // e.g., 6.5
 */
export function getPercentile(data: (number | null | undefined)[], percentile: number) {
  const d1 = data.filter((d) => d != null && d !== undefined);
  return ss.quantile(d1, percentile);
}
