import uniqBy from 'lodash.uniqby';
import flattenDeep from 'lodash.flattendeep';
import sortBy from 'lodash.sortby';

/**
 * Extracts unique values from a specified column in a CSV dataset.
 *
 * If the column contains non-object values, it extracts the unique values from that column, sorts them, and returns them.
 * If the column contains object values (e.g., arrays), it flattens the values before extracting and returning the unique values.
 *
 * @param csvData - The CSV dataset, represented as an array of objects.
 * @param column - The column name from which to extract unique values.
 *
 * @returns An array of unique values from the specified column, sorted in ascending order.
 *
 * @example
 * const csvData = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Alice' }];
 * getUniqValue(csvData, 'name'); // Returns: ['Alice', 'Bob']
 */
export function getUniqValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  column: string,
) {
  if (csvData.length === 0) return [];
  if (typeof csvData[0][column] !== 'object') {
    const uniqValues = sortBy(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uniqBy(csvData, (d: any) => d[column]),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d: any) => d[column],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ).map((d: any) => d[column]);
    return uniqValues;
  }
  const values = sortBy(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uniqBy(flattenDeep(csvData.map((d: any) => d[column])), el => el),
    (d: string | number) => d,
  );
  return values;
}
