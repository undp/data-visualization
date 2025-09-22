import flattenDeep from 'lodash.flattendeep';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqValues = [...new Set(csvData.map((d: any) => d[column]))].sort((a: any, b: any) =>
      a < b ? -1 : a > b ? 1 : 0,
    );
    return uniqValues as (string | number)[];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = [...new Set(flattenDeep(csvData.map((d: any) => d[column])))].sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0),
  );
  return values as (string | number)[];
}
