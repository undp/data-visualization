/* eslint-disable no-console */
import Papa from 'papaparse';
import Handlebars from 'handlebars';

import { transformColumnsToArray } from './transformData/transformColumnsToArray';
import { mergeMultipleData } from './transformData/mergeMultipleData';

import { ColumnConfigurationDataType, FileSettingsDataType } from '@/Types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reFormatData(data: any, dataTransformation?: string) {
  if (!dataTransformation) return data;
  Handlebars.registerHelper(
    'json',
    context => new Handlebars.SafeString(JSON.stringify(context, null, 2)),
  );
  const template = Handlebars.compile(dataTransformation);
  return JSON.parse(template(data));
}
/**
 * Fetches a CSV file from a URL, parses it, and applies transformations based on the provided configuration.
 *
 * @param dataURL - The URL of the CSV file to fetch.
 * @param dataTransformation - Optional Handlebars template for data transformation.
 * @param columnsToArray - Optional columns configuration to transform certain columns to arrays.
 * @param debugMode - Optional flag to log data to the console for debugging.
 * @param delimiter - Optional delimiter used in the CSV file (default is comma).
 * @param header - Optional flag to specify whether the CSV file contains headers (default is true).
 *
 * @returns A promise that resolves to the parsed and transformed data.
 *
 * @example
 * fetchAndParseCSV('https://example.com/data.csv', '{{data}}', [], true)
 *   .then(parsedData => console.log(parsedData))
 *   .catch(error => console.error('Error:', error));
 */
export async function fetchAndParseCSV(
  dataURL: string,
  dataTransformation?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
  delimiter?: string,
  header?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(dataURL, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(results.data, columnsToArray);
          if (debugMode) {
            console.log('Data after transformation of column to array:', transformedData);
          }
          resolve(reFormatData(transformedData, dataTransformation));
        } else resolve(reFormatData(results.data, dataTransformation));
      },
      error(error) {
        reject(error);
      },
    });
  });
}
/**
 * Parses CSV data from a string, applying optional transformations.
 *
 * @param data - The CSV data as a string.
 * @param dataTransformation - Optional Handlebars template for data transformation.
 * @param columnsToArray - Optional columns configuration to transform certain columns to arrays.
 * @param debugMode - Optional flag to log data to the console for debugging.
 * @param delimiter - Optional delimiter used in the CSV file (default is comma).
 * @param header - Optional flag to specify whether the CSV file contains headers (default is true).
 *
 * @returns A promise that resolves to the parsed and transformed data.
 */
export async function fetchAndParseCSVFromTextBlob(
  data: string,
  dataTransformation?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
  delimiter?: string,
  header?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      skipEmptyLines: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(results.data, columnsToArray);
          if (debugMode) {
            console.log('Data after transformation of column to array:', transformedData);
          }
          resolve(reFormatData(transformedData, dataTransformation));
        } else resolve(reFormatData(results.data, dataTransformation));
      },
      error(error: Error) {
        reject(error);
      },
    });
  });
}
/**
 * Fetches and parses a JSON file from a URL, and applies optional transformations.
 *
 * @param dataURL - The URL of the JSON file to fetch.
 * @param columnsToArray - Optional columns configuration to transform certain columns to arrays.
 * @param dataTransformation - Optional Handlebars template for data transformation.
 * @param debugMode - Optional flag to log data to the console for debugging.
 *
 * @returns A promise that resolves to the parsed and transformed data.
 */
export async function fetchAndParseJSON(
  dataURL: string,
  columnsToArray?: ColumnConfigurationDataType[],
  dataTransformation?: string,
  debugMode?: boolean,
) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const reFormatedJson = reFormatData(json, dataTransformation);
    if (debugMode) {
      console.log('Data from file:', json);
    }
    if (columnsToArray) {
      const transformedData = transformColumnsToArray(reFormatedJson, columnsToArray);
      if (debugMode) {
        console.log('Data after transformation of column to array:', transformedData);
      }
      return transformedData;
    }
    return reFormatedJson;
  } catch (error) {
    return error;
  }
}
/**
 * Fetches and transforms data from an API, and applies optional transformations.
 *
 * @param requestURL - The URL of the API to fetch data from.
 * @param headers - Optional headers to include in the API request.
 * @param columnsToArray - Optional columns configuration to transform certain columns to arrays.
 * @param dataTransformation - Optional Handlebars template for data transformation.
 * @param debugMode - Optional flag to log data to the console for debugging.
 *
 * @returns A promise that resolves to the transformed data.
 */
export async function fetchAndTransformDataFromAPI(
  requestURL: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any,
  columnsToArray?: ColumnConfigurationDataType[],
  dataTransformation?: string,
  debugMode?: boolean,
) {
  const response = await fetch(requestURL, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  const reFormatedJson = reFormatData(json, dataTransformation);
  if (debugMode) {
    console.log('Data from api:', json);
    console.log('Data from api after transformation:', reFormatedJson);
  }
  if (columnsToArray) {
    const transformedData = transformColumnsToArray(reFormatedJson, columnsToArray);
    if (debugMode) {
      console.log('Data after transformation of column to array:', transformedData);
    }
    return transformedData;
  }
  return reFormatedJson;
}
/**
 * Fetches and parses data from multiple sources (CSV, JSON, API), and merges the results.
 *
 * @param dataURL - An array of file settings containing URLs, column configurations, and other settings.
 * @param idColumnTitle - Optional title of the ID column to merge data sources by.
 *
 * @returns A promise that resolves to the merged data from all sources.
 */
export async function fetchAndParseMultipleDataSources(
  dataURL: FileSettingsDataType[],
  idColumnTitle?: string,
) {
  const data = await Promise.all(
    dataURL.map(d =>
      d.fileType === 'json'
        ? fetchAndParseJSON(d.dataURL as string, d.columnsToArray, d.dataTransformation, false)
        : d.fileType === 'api'
          ? fetchAndTransformDataFromAPI(
              d.dataURL as string,
              d.apiHeaders,
              d.columnsToArray,
              d.dataTransformation,
              false,
            )
          : fetchAndParseCSV(
              d.dataURL as string,
              d.dataTransformation,
              d.columnsToArray,
              false,
              d.delimiter,
              true,
            ),
    ),
  );
  const mergedData = mergeMultipleData(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any, i: number) => ({
      data: d,
      idColumn: dataURL[i].idColumnName,
    })),
    idColumnTitle,
  );
  return mergedData;
}
