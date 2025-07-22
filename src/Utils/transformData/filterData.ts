import flattenDeep from 'lodash.flattendeep';
import intersection from 'lodash.intersection';

import { DataFilterDataType } from '@/Types';

export function filterData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  filters: DataFilterDataType[],
) {
  if (filters.length === 0) return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredDataWithIncludeValue = data.filter((item: any) =>
    filters.every(filter => {
      return filter.includeValues
        ? filter.includeValues.length > 0
          ? intersection(flattenDeep([item[filter.column]]), filter.includeValues).length > 0
          : true
        : true;
    }),
  );
  const filteredDataWithExcludeValue = filteredDataWithIncludeValue.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) =>
      filters.every(filter => {
        return filter.excludeValues
          ? filter.excludeValues.length > 0
            ? intersection(flattenDeep([item[filter.column]]), filter.excludeValues).length === 0
            : true
          : true;
      }),
  );
  return filteredDataWithExcludeValue;
}
