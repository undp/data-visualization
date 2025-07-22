import { GraphConfigurationDataType } from '@/Types';

export function getValues(
  id: string,
  graphConfig: GraphConfigurationDataType[],
  readableHeader: {
    value: string;
    label: string;
  }[],
) {
  return graphConfig.findIndex(el => el.chartConfigId === id) === -1
    ? undefined
    : typeof graphConfig[graphConfig.findIndex(el => el.chartConfigId === id)].columnId === 'object'
      ? (
          graphConfig[graphConfig.findIndex(el => el.chartConfigId === id)].columnId as string[]
        ).map(g =>
          readableHeader.findIndex(el => el.value === g) === -1
            ? g
            : readableHeader[readableHeader.findIndex(el => el.value === g)].label,
        )
      : readableHeader.findIndex(
            el =>
              el.value ===
              graphConfig[graphConfig.findIndex(gc => gc.chartConfigId === id)].columnId,
          ) === -1
        ? graphConfig[graphConfig.findIndex(gc => gc.chartConfigId === id)].columnId
        : readableHeader[
            readableHeader.findIndex(
              el =>
                el.value ===
                graphConfig[graphConfig.findIndex(gc => gc.chartConfigId === id)].columnId,
            )
          ].label;
}
