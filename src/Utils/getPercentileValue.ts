/**
 * Returns the value at the given percentile from a numeric dataset.
 *
 * @param data - An array of numbers to compute the percentile from.
 * @param percentile - The desired percentile (0–100).
 * @returns The value at the specified percentile.
 *
 * @example
 * getPercentileValue([1, 3, 5, 7, 9], 50); // 5
 */
export function getPercentileValue(data: number[], percentile: number) {
  const sortedData = data.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sortedData.length) - 1;
  return sortedData[index];
}
