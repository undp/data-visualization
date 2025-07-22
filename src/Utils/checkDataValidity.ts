import flattenDeep from 'lodash.flattendeep';

import { ChartConfiguration } from './transformData/graphConfig';

import { GraphConfigurationDataType, GraphType } from '@/Types';

function missingValuesInArray(superset: string[], subset: string[]): string[] {
  return subset.filter(value => !superset.includes(value));
}

export function checkDataConfigValidity(
  dataConfig: GraphConfigurationDataType[],
  graph: GraphType,
  dataKeys: string[],
) {
  const dataKeyFromDataConfig = flattenDeep(dataConfig.map(d => d.columnId));
  const checkDataKeys = missingValuesInArray(dataKeys, dataKeyFromDataConfig);
  if (checkDataKeys.length !== 0)
    return {
      isValid: false,
      err: `Key(s) in configuration that don't match keys in the data: ${checkDataKeys.join(
        ', ',
      )}. Possible reason: If you are using 'dataTransform' then the allowed keys (columns) are only the one present in 'aggregationColumnsSetting' array in 'dataTransform' object plus n additional key called 'count'.`,
    };
  const ids = dataConfig.map(el => el.chartConfigId);
  const requiredIds = ChartConfiguration[
    ChartConfiguration.findIndex(el => el.chartID === graph)
  ].configuration
    .filter(el => el.required)
    .map(el => el.id);
  const ifRequiredIdsPresent = missingValuesInArray(ids, requiredIds);
  return {
    isValid: ifRequiredIdsPresent.length === 0,
    err:
      ifRequiredIdsPresent.length === 0
        ? undefined
        : `Missing required ID(s) in configuration: ${ifRequiredIdsPresent.join(', ')}`,
  };
}
