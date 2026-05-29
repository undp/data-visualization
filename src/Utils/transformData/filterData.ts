import flattenDeep from 'lodash.flattendeep';
import intersection from 'lodash.intersection';

import type { DataFilterDataType } from '@/Types';

export function filterData(
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  data: any,
  filters: DataFilterDataType[],
) {
  if (filters.length === 0) return data;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const filteredDataWithIncludeValue = data.filter((item: any) =>
    filters.every((filter) => {
      return filter.includeValues
        ? filter.includeValues.length > 0
          ? intersection(flattenDeep([item[filter.column]]), filter.includeValues).length > 0
          : true
        : true;
    }),
  );
  const filteredDataWithExcludeValue = filteredDataWithIncludeValue.filter(
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    (item: any) =>
      filters.every((filter) => {
        return filter.excludeValues
          ? filter.excludeValues.length > 0
            ? intersection(flattenDeep([item[filter.column]]), filter.excludeValues).length === 0
            : true
          : true;
      }),
  );
  return filteredDataWithExcludeValue;
}
