import uniqBy from 'lodash.uniqby';
import sum from 'lodash.sum';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import flattenDeep from 'lodash.flattendeep';

import { AggregationSettingsDataType } from '@/Types';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  keyColumn: string,
  aggregationSettings?: AggregationSettingsDataType[],
) {
  if (data.length === 0) return [];
  if (typeof data[0][keyColumn] !== 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqValues = uniqBy(data, (d: any) => d[keyColumn]).map(d => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataObj: any = {};
      dataObj[keyColumn] = d[keyColumn];
      const filteredData = data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (j: any) => j[keyColumn] === d[keyColumn],
      );
      dataObj.count = filteredData.length;
      dataObj.rollUpData = filteredData;
      aggregationSettings?.forEach(el => {
        dataObj[el.column] =
          el.aggregationMethod === 'average'
            ? parseFloat(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (sum(filteredData.map((j: any) => j[el.column])) / filteredData.length).toFixed(2),
              )
            : el.aggregationMethod === 'max'
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                maxBy(filteredData, (j: any) => j[el.column])[el.column]
              : el.aggregationMethod === 'min'
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  minBy(filteredData, (j: any) => j[el.column])[el.column]
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  sum(filteredData.map((j: any) => j[el.column]));
      });
      return dataObj;
    });
    return uniqValues;
  }
  const values = uniqBy(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flattenDeep(data.map((d: any) => d[keyColumn])),
    el => el,
  );
  const uniqValues = values.map(d => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataObj: any = {};
    dataObj[keyColumn] = d;
    const filteredData = data.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (j: any) => j[keyColumn].indexOf(d) !== -1,
    );
    dataObj.rollUpData = filteredData;
    dataObj.count = filteredData.length;
    aggregationSettings?.forEach(el => {
      dataObj[el.column] =
        el.aggregationMethod === 'average'
          ? parseFloat(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (sum(filteredData.map((j: any) => j[el.column])) / filteredData.length).toFixed(2),
            )
          : el.aggregationMethod === 'max'
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              maxBy(filteredData, (j: any) => j[el.column])[el.column]
            : el.aggregationMethod === 'min'
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                minBy(filteredData, (j: any) => j[el.column])[el.column]
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sum(filteredData.map((j: any) => j[el.column]));
    });
    return dataObj;
  });
  return uniqValues;
}
