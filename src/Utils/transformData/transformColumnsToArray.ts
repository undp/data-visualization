import { ColumnConfigurationDataType } from '@/Types';
/**
 * Transforms specified columns of the CSV data into arrays, splitting the string values based on a delimiter.
 * This function is useful for handling columns that contain multiple values separated by a delimiter,
 * and it converts them into arrays for further processing.
 *
 * @param csvData - The input CSV data, typically an array of objects where each object represents a row.
 * @param columnConfig - An optional array of column configuration objects specifying the columns to be transformed,
 *                       along with the delimiter used to split the values (defaults to ',' if not provided).
 *                       Each object should contain:
 *                       - `column`: The name of the column to transform.
 *                       - `delimiter`: The delimiter used to split the column values (optional, defaults to ',').
 *
 * @returns A new array of objects, where the specified columns are transformed into arrays of values, split by the delimiter.
 *
 * @example
 * const data = [
 *   { category: 'A', tags: 'apple, orange, banana' },
 *   { category: 'B', tags: 'grape, pear' }
 * ];
 * const columnConfig = [
 *   { column: 'tags', delimiter: ', ' }
 * ];
 * const transformedData = transformColumnsToArray(data, columnConfig);
 * console.log(transformedData);
 * // Output:
 * // [
 * //   { category: 'A', tags: ['apple', 'orange', 'banana'] },
 * //   { category: 'B', tags: ['grape', 'pear'] }
 * // ]
 */
export function transformColumnsToArray(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  columnConfig?: ColumnConfigurationDataType[],
) {
  if (!columnConfig || columnConfig.length === 0) return csvData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataFormatted = csvData.map((el: any) => {
    const temp = { ...el };
    columnConfig.forEach(d => {
      temp[d.column] = temp[d.column]
        ? temp[d.column].split(d.delimiter || ',').map((t: string) => t.trim())
        : [];
    });
    return temp;
  });
  return dataFormatted;
}
