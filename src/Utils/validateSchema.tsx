import Ajv from 'ajv';

import { GraphList } from './getGraphList';

import { GraphType } from '@/Types';
import {
  getDashboardJSONSchema,
  getDashboardWideToLongFormatJSONSchema,
  getDataSchema,
  getGriddedGraphJSONSchema,
  getSettingsSchema,
  getSingleGraphJSONSchema,
} from '@/Schemas/getSchema';

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

/**
 * Validates the data against the appropriate schema for the given graph type.
 *
 * @param data - The data to validate.
 * @param graph - The graph type for which the data validation is performed.
 *
 * @returns An object with `isValid` indicating the validation result and `err` containing any error messages if the validation fails.
 *
 * @example
 * const result = validateDataSchema(data, 'barChart');
 * if (!result.isValid) {
 *   console.error(result.err);
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateDataSchema(data: any, graph: GraphType) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return {
      isValid: true,
      err: undefined,
    };
  if (!data) {
    return {
      isValid: false,
      err: `No data provided`,
    };
  }
  if (graph === 'dataTable' || graph === 'dataCards' || data.length === 0)
    return {
      isValid: true,
      err: undefined,
    };

  const schema = getDataSchema(graph);

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };

  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}
/**
 * Validates the settings against the appropriate schema for the given graph type. This does not validate graphTitle, graphDescription, footNote, tooltip, detailsOnClick, and cardTemplate.
 *
 * @param settings - The settings to validate.
 * @param graph - The graph type for which the settings validation is performed.
 *
 * @returns An object with `isValid` indicating the validation result and `err` containing any error messages if the validation fails.
 *
 * @example
 * const result = validateSettingsSchema(settings, 'barChart');
 * if (!result.isValid) {
 *   console.error(result.err);
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateSettingsSchema(settings: any, graph: GraphType) {
  const schema = getSettingsSchema(graph);

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };

  const validate = ajv.compile(schema);
  const valid = validate(settings);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}
/**
 * Validates the configuration against the appropriate schema for the given graph type. This does not validate graphTitle, graphDescription, footNote, tooltip, detailsOnClick or cardTemplate in the graphSettings.
 *
 * @param config - The configuration to validate.
 * @param graph - The graph type for which the configuration validation is performed. Can be one of:
 *                'singleGraphDashboard', 'multiGraphDashboard', 'griddedGraph', or 'multiGraphDashboardWideToLongFormat'.
 *
 * @returns An object with `isValid` indicating the validation result and `err` containing any error messages if the validation fails.
 *
 * @example
 * const result = validateConfigSchema(config, 'griddedGraph');
 * if (!result.isValid) {
 *   console.error(result.err);
 * }
 */
export function validateConfigSchema(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any,
  graph:
    | 'singleGraphDashboard'
    | 'multiGraphDashboard'
    | 'griddedGraph'
    | 'multiGraphDashboardWideToLongFormat',
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let schema: any;
  switch (graph) {
    case 'griddedGraph':
      schema = getGriddedGraphJSONSchema(undefined, config.graphType);
      break;
    case 'multiGraphDashboard':
      schema = getDashboardJSONSchema();
      break;
    case 'singleGraphDashboard':
      schema = getSingleGraphJSONSchema(undefined, config.graphType);
      break;
    case 'multiGraphDashboardWideToLongFormat':
      schema = getDashboardWideToLongFormatJSONSchema();
      break;
    default:
      break;
  }

  if (!schema)
    return {
      isValid: false,
      err: `Invalid chart type: ${graph}`,
    };
  const validate = ajv.compile(schema);
  const valid = validate(config);
  if (!valid) {
    console.error(validate.errors);
    return {
      isValid: false,
      err: validate.errors
        ?.map(error => `Error at ${error.instancePath}: ${error.message}`)
        .join('; '),
    };
  }
  return {
    isValid: true,
    err: undefined,
  };
}
