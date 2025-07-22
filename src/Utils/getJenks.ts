import * as ss from 'simple-statistics';
import { format } from 'd3-format';
import uniq from 'lodash.uniq';
import sortBy from 'lodash.sortby';

import { padNumberArray } from './padArray';

/**
 * Returns a set of class break values based on Jenks natural breaks algorithm.
 *
 * If the dataset has fewer unique values than the number of steps,
 * it pads the array and slices out the first and last to get bins.
 *
 * @param data - Array of numeric values to classify.
 * @param noOfSteps - Number of classification steps (breaks).
 *
 * @returns An array of bin break values between min and max (excluding them).
 *
 * @example
 * getJenks([1, 2, 3, 10, 20, 30], 3); // e.g., [3, 10]
 */

export function getJenks(data: (number | null | undefined)[], noOfSteps: number) {
  const d1 = sortBy(
    data.filter(d => d !== undefined && d !== null),
    d => d,
  );
  const bins =
    uniq(d1).length < noOfSteps
      ? padNumberArray(d1, noOfSteps).slice(1, -1)
      : ss.jenks(d1, noOfSteps).slice(1, -1);
  const valueArray = bins.map(d => {
    const formattedValue = parseFloat(format('.2r')(d));
    if (isNaN(formattedValue)) {
      if (d < -1) return Math.round(d);
      return d;
    }
    if (d !== 0 && Math.abs(d) < 1) {
      return formattedValue;
    } else {
      return Math.round(formattedValue);
    }
  });
  return [...new Set(valueArray)];
}
