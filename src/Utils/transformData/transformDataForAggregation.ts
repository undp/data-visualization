import flattenDeep from 'lodash.flattendeep';
import sum from 'lodash.sum';
import type { AggregationSettingsDataType } from '@/Types';
import { uniqBy } from '../uniqBy';
/**
 * Transforms the data for aggregation based on a key column and specified aggregation settings.
 * It groups the data by unique values in the key column and applies the aggregation methods to each group.
 *
 * @param data - The input data to be aggregated. Can be an array of objects, where each object represents a data row.
 * @param keyColumn - The name of the column to group the data by (key column).
 * @param aggregationSettings - Optional settings for the aggregation, specifying the column and aggregation method (e.g., 'average', 'max', 'min', 'sum').
 *                              Each setting can define a column and a corresponding aggregation method to apply to that column.
 *
 * @returns An array of objects where each object contains the aggregated values for each unique value in the key column.
 *          Each object includes the key column value, count of occurrences, and the aggregated values for each specified column.
 *
 * @example
 * const data = [
 *   { category: 'A', value: 10, amount: 5 },
 *   { category: 'A', value: 20, amount: 10 },
 *   { category: 'B', value: 15, amount: 7 },
 * ];
 * const aggregationSettings = [
 *   { column: 'value', aggregationMethod: 'average' },
 *   { column: 'amount', aggregationMethod: 'sum' },
 * ];
 * const transformedData = transformDataForAggregation(data, 'category', aggregationSettings);
 * console.log(transformedData);
 * // Output:
 * // [
 * //   { category: 'A', count: 2, value: 15, amount: 15 },
 * //   { category: 'B', count: 1, value: 15, amount: 7 },
 * // ]
 */
export function transformDataForAggregation(
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any,
  keyColumn: string,
  aggregationSettings?: AggregationSettingsDataType[],
) {
  if (data.length === 0) return [];
  if (typeof data[0][keyColumn] !== 'object') {
    const uniqValues = uniqBy(data, keyColumn).map((d) => {
      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
      const dataObj: any = {};
      dataObj[keyColumn] = d;
      const filteredData = data.filter(
        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
        (j: any) => j[keyColumn] === d,
      );
      dataObj.count = filteredData.length;
      dataObj.rollUpData = filteredData;
      aggregationSettings?.forEach((el) => {
        dataObj[el.column] =
          el.aggregationMethod === 'average'
            ? parseFloat(
                // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                (sum(filteredData.map((j: any) => j[el.column])) / filteredData.length).toFixed(2),
              )
            : el.aggregationMethod === 'max'
              ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                Math.max(...filteredData.map((j: any) => j[el.column]))
              : el.aggregationMethod === 'min'
                ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                  Math.min(...filteredData.map((j: any) => j[el.column]))
                : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                  sum(filteredData.map((j: any) => j[el.column]));
      });
      return dataObj;
    });
    return uniqValues;
  }
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const values = [...new Set(flattenDeep(data.map((d: any) => d[keyColumn])))];
  const uniqValues = values.map((d) => {
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    const dataObj: any = {};
    dataObj[keyColumn] = d;
    const filteredData = data.filter(
      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
      (j: any) => j[keyColumn].indexOf(d) !== -1,
    );
    dataObj.rollUpData = filteredData;
    dataObj.count = filteredData.length;
    aggregationSettings?.forEach((el) => {
      dataObj[el.column] =
        el.aggregationMethod === 'average'
          ? parseFloat(
              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
              (sum(filteredData.map((j: any) => j[el.column])) / filteredData.length).toFixed(2),
            )
          : el.aggregationMethod === 'max'
            ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
              Math.max(...filteredData.map((j: any) => j[el.column]))
            : el.aggregationMethod === 'min'
              ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                Math.min(...filteredData.map((j: any) => j[el.column]))
              : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                sum(filteredData.map((j: any) => j[el.column]));
    });
    return dataObj;
  });
  return uniqValues;
}
