import { checkDataConfigValidity } from '../checkDataValidity';
import { checkIfNullOrUndefined } from '../checkIfNullOrUndefined';
import { GraphList } from '../getGraphList';

import { ChartConfiguration } from './graphConfig';

import { GraphConfigurationDataType, GraphType } from '@/Types';
/**
 * Transforms the input data into a format suitable for graph visualization based on the given graph type and configuration.
 *
 * The function formats the data according to the specified graph configuration and checks the validity of the configuration.
 * It also handles cases for graphs like "dataTable" and "dataCards" without additional processing, and it processes
 * more complex graphs (e.g., charts) with a specific configuration.
 *
 * @param data - The data to be transformed, typically an array of objects representing rows of data.
 * @param graph - The type of graph to transform the data for (e.g., lineChart, barChart, etc.).
 * @param config - An optional array of configuration objects that define how the data should be mapped to the graph.
 *                 Each object in the array should define column mappings and how data should be grouped or aggregated.
 *
 * @returns The transformed data in the format required by the graph. If no valid configuration is provided, or if
 *          data is invalid, an error message is returned.
 *          - If the graph type is "dataTable" or "dataCards", the original data is returned unchanged.
 *          - If data is invalid, an error message will be returned.
 *
 * @throws {string} If the configuration is invalid or the data can't be processed, an error message is logged and
 *                  returned.
 *
 * @example
 * const graphData = [
 *   { category: 'A', value: 10 },
 *   { category: 'B', value: 15 },
 * ];
 * const graph = 'barChart';
 * const config = [
 *   { columnId: 'category', chartConfigId: 'label' },
 *   { columnId: 'value', chartConfigId: 'size' },
 * ];
 * const transformedData = transformDataForGraph(graphData, graph, config);
 * console.log(transformedData);
 */
export function transformDataForGraph(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  graph: GraphType,
  config?: GraphConfigurationDataType[],
) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return data;
  if (!data) return 'Cannot fetch data';
  if (graph === 'dataTable' || graph === 'dataCards' || data.length === 0) return data;
  if (!config) {
    console.error('Your data configuration is not accurate');
    return 'No graph configuration is provided';
  }
  const dataConfigValidity = checkDataConfigValidity(config, graph, Object.keys(data[0]));
  if (dataConfigValidity.isValid) {
    const chartConfig =
      ChartConfiguration[ChartConfiguration.findIndex(d => d.chartID === graph)].configuration;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataFormatted = data.map((d: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = {};
      config
        .filter(el => el.columnId)
        .forEach(el => {
          if (chartConfig[chartConfig.findIndex(k => k.id === el.chartConfigId)].multiple) {
            obj[chartConfig[chartConfig.findIndex(k => k.id === el.chartConfigId)].id] = [];
            (el.columnId as string[]).forEach(l => {
              obj[chartConfig[chartConfig.findIndex(k => k.id === el.chartConfigId)].id].push(
                checkIfNullOrUndefined(d[l]) ? null : d[l],
              );
            });
          } else {
            obj[chartConfig[chartConfig.findIndex(k => k.id === el.chartConfigId)].id] =
              checkIfNullOrUndefined(d[el.columnId as string]) ? null : d[el.columnId as string];
          }
          obj[`${el.chartConfigId}Columns`] = el.columnId;
        });
      obj.data = d;
      return obj;
    });
    return dataFormatted;
  }
  console.error(dataConfigValidity.err);
  return dataConfigValidity.err;
}
