import {
  fetchAndParseJSON,
  fetchAndParseCSV,
  fetchAndTransformDataFromAPI,
  fetchAndParseMultipleDataSources,
} from '../fetchAndParseData';

import { transformDataForGraph } from './transformDataForGraph';

import {
  ColumnConfigurationDataType,
  FileSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
} from '@/Types';
/**
 * Fetches data from a given URL or multiple data sources, processes it according to the specified graph configuration,
 * and formats it for use in a graph.
 *
 * This function supports different file types (CSV, JSON, and API), and can handle multiple data sources. It applies
 * any necessary data transformations and column formatting, then prepares the data for visualization in the specified graph.
 *
 * @param dataURL - The URL or array of data sources to fetch data from. If it's a string, it represents the URL to fetch data from.
 *                  If it's an array, it represents multiple data sources with different types (CSV, JSON, API).
 * @param dataConfiguration - The graph configuration data used to determine how the data should be formatted for the graph.
 * @param graph - The type of graph to be used (e.g., lineChart, barChart).
 * @param fileType - The type of the file being fetched. Can be 'csv', 'json', or 'api'. This parameter is ignored if `dataURL` is an array.
 * @param delimiter - The delimiter used in CSV files (default is ',' if not provided).
 * @param columnsToArray - Configuration for columns that need to be transformed into arrays (optional).
 * @param apiHeaders - Headers for the API request (optional).
 * @param dataTransformation - A Handlebars template used for transforming the data (optional).
 * @param idColumnTitle - The title of the ID column when merging multiple data sources (optional).
 *
 * @returns A Promise that resolves to the transformed data ready for the graph, or null if an error occurs.
 *
 * @throws {Error} Throws an error if the data fetching or processing fails.
 *
 * @example
 * const dataURL = 'https://example.com/data.json';
 * const dataConfiguration = [
 *   { column: 'value', chartConfigId: 'size' },
 *   { column: 'category', chartConfigId: 'label' },
 * ];
 * const graph = 'barChart';
 * transformDataForGraphFromFile(dataURL, dataConfiguration, graph, 'json')
 *   .then(data => {
 *     console.log('Formatted Data:', data);
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 */
export async function transformDataForGraphFromFile(
  dataURL: string | FileSettingsDataType[],
  dataConfiguration: GraphConfigurationDataType[],
  graph: GraphType,
  fileType?: 'csv' | 'json' | 'api',
  delimiter?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiHeaders?: any,
  dataTransformation?: string,
  idColumnTitle?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // Ensure the function returns a Promise
  try {
    const fetchedData = await (typeof dataURL === 'string'
      ? fileType === 'json'
        ? fetchAndParseJSON(dataURL, columnsToArray, dataTransformation, false)
        : fileType === 'api'
          ? fetchAndTransformDataFromAPI(
              dataURL,
              apiHeaders,
              columnsToArray,
              dataTransformation,
              false,
            )
          : fetchAndParseCSV(dataURL, dataTransformation, columnsToArray, false, delimiter, true)
      : fetchAndParseMultipleDataSources(dataURL, idColumnTitle));

    const formattedData = transformDataForGraph(
      fetchedData,
      graph,
      dataConfiguration as GraphConfigurationDataType[],
    );
    return formattedData;
  } catch (error) {
    console.error('Error fetching or processing data', error);
    return null; // Return null in case of any errors
  }
}
