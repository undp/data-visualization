import { GraphConfigurationDataType } from '@/Types';

export function checkIfMultiple(id: string, graphConfig: GraphConfigurationDataType[]) {
  return graphConfig.findIndex(el => el.chartConfigId === id) === -1
    ? false
    : typeof graphConfig[graphConfig.findIndex(el => el.chartConfigId === id)].columnId !==
        'string';
}
