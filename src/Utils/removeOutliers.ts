/**
 * Removes statistical outliers from a numeric dataset based on standard deviation.
 *
 * @param data - The array of numbers to filter.
 * @param outlierThreshold - Optional multiplier for standard deviation (default: 2).
 * Values further than `threshold * stdDev` from the mean are considered outliers.
 *
 * @returns A filtered array with outliers removed.
 *
 * @example
 * removeOutliers([1, 2, 3, 100]); // [1, 2, 3]
 * removeOutliers([10, 12, 11, 13, 300], 1.5); // May remove 300
 */
export function removeOutliers(data: number[], outlierThreshold = 2) {
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const stdDev = Math.sqrt(data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length);
  const outlierThresholdWithStdDev = outlierThreshold * stdDev;
  const filteredData = data.filter(val => Math.abs(val - mean) <= outlierThresholdWithStdDev);

  return filteredData;
}
