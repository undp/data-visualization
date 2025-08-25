import { GraphType } from '@/Types';
import { GraphList } from '@/Utils/getGraphList';

const BASE_URL =
  'https://raw.githubusercontent.com/UNDP-Data/undp-viz-library-schemas/refs/heads/main/';

export function getDataSchemaLink(graph: GraphType) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return null;

  switch (graph) {
    case 'dataTable':
      return 'dataSchema/dataTableDataSchema.json';
    case 'dataCards':
      return 'dataSchema/dataTableDataSchema.json';
    case 'barChart':
      return 'dataSchema/barGraphDataSchema.json';
    case 'stackedBarChart':
      return 'dataSchema/stackedBarGraphDataSchema.json';
    case 'groupedBarChart':
      return 'dataSchema/groupedBarGraphDataSchema.json';
    case 'lineChart':
      return 'dataSchema/lineChartDataSchema.json';
    case 'dualAxisLineChart':
      return 'dataSchema/dualAxisLineChartDataSchema.json';
    case 'differenceLineChart':
      return 'dataSchema/differenceLineChartDataSchema.json';
    case 'multiLineChart':
      return 'dataSchema/multiLineChartDataSchema.json';
    case 'multiLineAltChart':
      return 'dataSchema/multiLineAltChartDataSchema.json';
    case 'stackedAreaChart':
      return 'dataSchema/areaChartDataSchema.json';
    case 'choroplethMap':
      return 'dataSchema/choroplethMapDataSchema.json';
    case 'threeDGlobe':
      return 'dataSchema/choroplethMapDataSchema.json';
    case 'bulletChart':
      return 'dataSchema/bulletChartDataSchema.json';
    case 'biVariateChoroplethMap':
      return 'dataSchema/biVariateChoroplethMapDataSchema.json';
    case 'dotDensityMap':
      return 'dataSchema/dotDensityMapDataSchema.json';
    case 'donutChart':
      return 'dataSchema/donutChartDataSchema.json';
    case 'slopeChart':
      return 'dataSchema/slopeChartDataSchema.json';
    case 'scatterPlot':
      return 'dataSchema/scatterPlotDataSchema.json';
    case 'dumbbellChart':
      return 'dataSchema/dumbbellChartDataSchema.json';
    case 'treeMap':
      return 'dataSchema/treeMapDataSchema.json';
    case 'circlePacking':
      return 'dataSchema/circlePackingDataSchema.json';
    case 'heatMap':
      return 'dataSchema/heatMapDataSchema.json';
    case 'stripChart':
      return 'dataSchema/stripChartDataSchema.json';
    case 'beeSwarmChart':
      return 'dataSchema/beeSwarmChartDataSchema.json';
    case 'butterflyChart':
      return 'dataSchema/butterflyChartDataSchema.json';
    case 'histogram':
      return 'dataSchema/histogramDataSchema.json';
    case 'sparkLine':
      return 'dataSchema/lineChartDataSchema.json';
    case 'paretoChart':
      return 'dataSchema/paretoChartDataSchema.json';
    case 'statCard':
      return 'dataSchema/statCardDataSchema.json';
    case 'unitChart':
      return 'dataSchema/unitChartDataSchema.json';
    case 'sankeyChart':
      return 'dataSchema/sankeyChartDataSchema.json';
    case 'lineChartWithConfidenceInterval':
      return 'dataSchema/lineChartWithConfidenceIntervalDataSchema.json';
    case 'radarChart':
      return 'dataSchema/radarChartDataSchema.json';
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getSettingsSchemaLink(graph: GraphType | 'allGraphs') {
  switch (graph) {
    case 'barChart':
      return 'settingsSchema/simpleBarChartSettingsSchema.json';
    case 'stackedBarChart':
      return 'settingsSchema/stackedBarChartSettingsSchema.json';
    case 'groupedBarChart':
      return 'settingsSchema/groupedBarChartSettingsSchema.json';
    case 'lineChart':
      return 'settingsSchema/lineChartSettingsSchema.json';
    case 'dualAxisLineChart':
      return 'settingsSchema/dualAxisLineChartSettingsSchema.json';
    case 'multiLineChart':
      return 'settingsSchema/multiLineChartSettingsSchema.json';
    case 'multiLineAltChart':
      return 'settingsSchema/multiLineAltChartSettingsSchema.json';
    case 'differenceLineChart':
      return 'settingsSchema/differenceLineChartSettingsSchema.json';
    case 'stackedAreaChart':
      return 'settingsSchema/stackedAreaChartSettingsSchema.json';
    case 'choroplethMap':
      return 'settingsSchema/choroplethMapSettingsSchema.json';
    case 'threeDGlobe':
      return 'settingsSchema/threeDGlobeSettingsSchema.json';
    case 'bulletChart':
      return 'settingsSchema/bulletChartSettingsSchema.json';
    case 'biVariateChoroplethMap':
      return 'settingsSchema/biVariateChoroplethMapSettingsSchema.json';
    case 'dotDensityMap':
      return 'settingsSchema/dotDensityMapSettingsSchema.json';
    case 'donutChart':
      return 'settingsSchema/donutChartSettingsSchema.json';
    case 'slopeChart':
      return 'settingsSchema/slopeChartSettingsSchema.json';
    case 'scatterPlot':
      return 'settingsSchema/scatterPlotSettingsSchema.json';
    case 'dumbbellChart':
      return 'settingsSchema/dumbbellChartSettingsSchema.json';
    case 'treeMap':
      return 'settingsSchema/treeMapSettingsSchema.json';
    case 'circlePacking':
      return 'settingsSchema/circlePackingSettingsSchema.json';
    case 'heatMap':
      return 'settingsSchema/heatMapSettingsSchema.json';
    case 'stripChart':
      return 'settingsSchema/stripChartSettingsSchema.json';
    case 'beeSwarmChart':
      return 'settingsSchema/beeSwarmChartSettingsSchema.json';
    case 'butterflyChart':
      return 'settingsSchema/butterflyChartSettingsSchema.json';
    case 'histogram':
      return 'settingsSchema/histogramSettingsSchema.json';
    case 'sparkLine':
      return 'settingsSchema/sparkLineSettingsSchema.json';
    case 'paretoChart':
      return 'settingsSchema/paretoChartSettingsSchema.json';
    case 'dataTable':
      return 'settingsSchema/dataTableSettingsSchema.json';
    case 'statCard':
      return 'settingsSchema/statCardSettingsSchema.json';
    case 'geoHubCompareMap':
      return 'settingsSchema/geoHubCompareMapSettingsSchema.json';
    case 'geoHubMap':
      return 'settingsSchema/geoHubMapSettingsSchema.json';
    case 'geoHubMapWithLayerSelection':
      return 'settingsSchema/geoHubMapWithLayerSelectionSettingsSchema.json';
    case 'unitChart':
      return 'settingsSchema/unitChartSettingsSchema.json';
    case 'sankeyChart':
      return 'settingsSchema/sankeyChartSettingsSchema.json';
    case 'lineChartWithConfidenceInterval':
      return 'settingsSchema/lineChartWithConfidenceIntervalSettingsSchema.json';
    case 'dataCards':
      return 'settingsSchema/dataCardListSettingsSchema.json';
    case 'allGraphs':
      return 'settingsSchema/SettingsSchema.json';
    case 'radarChart':
      return 'settingsSchema/radarChartSettingsSchema.json';
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export async function getDataSchema(graph: GraphType) {
  const response = await fetch(`${BASE_URL}${getDataSchemaLink(graph)}`);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  return json;
}

export async function getSettingsSchema(graph: GraphType | 'allGraphs') {
  const response = await fetch(`${BASE_URL}${getSettingsSchemaLink(graph)}`);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const json = await response.json();
  return json;
}

export function getGraphConfigChartConfigIdEnum(
  chartType?: GraphType | 'dashboardWideToLong' | 'dashboard',
) {
  switch (chartType) {
    case 'barChart':
      return ['label', 'size', 'color', 'date'];
    case 'bulletChart':
      return ['label', 'size', 'target', 'qualitativeRange'];
    case 'treeMap':
      return ['label', 'size', 'color'];
    case 'circlePacking':
      return ['label', 'size', 'color'];
    case 'butterflyChart':
      return ['label', 'leftBar', 'rightBar', 'date'];
    case 'groupedBarChart':
      return ['label', 'size', 'date'];
    case 'stackedBarChart':
      return ['label', 'size', 'date'];
    case 'dumbbellChart':
      return ['x', 'label', 'date'];
    case 'donutChart':
      return ['size', 'label'];
    case 'histogram':
      return ['value'];
    case 'choroplethMap':
      return ['x', 'id', 'date'];
    case 'threeDGlobe':
      return ['x', 'id'];
    case 'biVariateChoroplethMap':
      return ['x', 'y', 'id', 'date'];
    case 'lineChart':
      return ['date', 'y'];
    case 'multiLineChart':
      return ['date', 'y'];
    case 'multiLineAltChart':
      return ['date', 'y', 'label', 'color'];
    case 'radarChart':
      return ['values', 'label', 'color'];
    case 'stackedAreaChart':
      return ['date', 'y'];
    case 'scatterPlot':
      return ['x', 'y', 'radius', 'color', 'label', 'date'];
    case 'dualAxisLineChart':
      return ['date', 'y1', 'y2'];
    case 'paretoChart':
      return ['label', 'bar', 'line'];
    case 'dotDensityMap':
      return ['lat', 'long', 'radius', 'color', 'label', 'date'];
    case 'slopeChart':
      return ['y1', 'y2', 'color', 'label'];
    case 'heatMap':
      return ['row', 'column', 'value'];
    case 'beeSwarmChart':
      return ['label', 'position', 'radius', 'color'];
    case 'stripChart':
      return ['label', 'position', 'color'];
    case 'statCard':
      return ['value'];
    case 'sankeyChart':
      return ['source', 'target', 'value'];
    case 'differenceLineChart':
      return ['date', 'y1', 'y2'];
    case 'unitChart':
      return ['label', 'value'];
    case 'sparkLine':
      return ['date', 'y'];
    case 'lineChartWithConfidenceInterval':
      return ['date', 'y', 'yMin', 'yMax'];
    case 'dashboardWideToLong':
      return ['label', 'size', 'color', 'value'];
    case 'dashboard':
      return [
        'label',
        'radius',
        'size',
        'row',
        'y1',
        'y',
        'rightBar',
        'position',
        'leftBar',
        'x',
        'bar',
        'line',
        'y2',
        'column',
        'date',
        'value',
        'color',
        'long',
        'lat',
        'id',
        'source',
        'target',
        'yMin',
        'yMax',
      ];
    default:
      return [
        'label',
        'radius',
        'size',
        'row',
        'y1',
        'y',
        'rightBar',
        'position',
        'leftBar',
        'x',
        'bar',
        'line',
        'y2',
        'column',
        'date',
        'value',
        'color',
        'long',
        'lat',
        'id',
        'source',
        'target',
        'yMin',
        'yMax',
      ];
  }
}

function getColumnEnum(columns?: string[]) {
  if (!columns || columns.length === 0) return {};
  return { enum: columns };
}
export const getColumnsToArraySchema = (columnList?: string[]) => ({
  items: {
    properties: {
      column: {
        type: 'string',
        ...getColumnEnum(columnList),
      },
      delimiter: { type: 'string' },
    },
    type: 'object',
    required: ['column'],
  },
  type: 'array',
});

export const getDataSettingsSchema = (columnList?: string[]) => ({
  properties: {
    columnsToArray: getColumnsToArraySchema(columnList),
    data: {},
    dataURL: {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fileType: {
                enum: ['csv', 'json', 'api'],
                type: 'string',
              },
              apiHeaders: {},
              dataTransformation: { type: 'string' },
              idColumnName: { type: 'string' },
              dataURL: { type: 'string' },
              delimiter: { type: 'string' },
              columnsToArray: getColumnsToArraySchema(),
            },
            required: ['dataURL', 'idColumnName'],
          },
        },
      ],
    },
    delimiter: { type: 'string' },
    fileType: {
      enum: ['csv', 'json', 'api'],
      type: 'string',
    },
    apiHeaders: {},
    dataTransformation: { type: 'string' },
    idColumnTitle: { type: 'string' },
  },
  type: 'object',
});

export const getReadableHeaderSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      value: { type: 'string', ...getColumnEnum(columnList) },
      label: { type: 'string' },
    },
    required: ['value', 'label'],
  },
});

export const getFiltersSchema = (columnList?: string[]) => ({
  items: {
    properties: {
      clearable: { type: 'boolean' },
      allowSelectAll: { type: 'boolean' },
      width: { type: 'string' },
      excludeValues: {
        items: { type: 'string' },
        type: 'array',
      },
      column: {
        type: 'string',
        ...getColumnEnum(columnList),
      },
      defaultValue: {
        anyOf: [
          {
            items: { oneOf: [{ type: 'string' }, { type: 'number' }] },
            type: 'array',
          },
          { type: 'string' },
          { type: 'number' },
        ],
      },
      label: { type: 'string' },
      ui: { type: 'string', enum: ['select', 'radio'] },
      singleSelect: { type: 'boolean' },
    },
    required: ['column'],
    type: 'object',
  },
  type: 'array',
});

export const getDataSelectionSchema = async (columnList?: string[]) => {
  const settingsSchema = await getSettingsSchema('allGraphs');
  return {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        chartConfigId: { type: 'string' },
        label: { type: 'string' },
        width: { type: 'string' },
        allowedColumnIds: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', ...getColumnEnum(columnList) },
              label: { type: 'string' },
              graphSettings: settingsSchema,
            },
            required: ['value', 'label'],
          },
          minItems: 1,
        },
        ui: { type: 'string', enum: ['select', 'radio'] },
      },
      required: ['chartConfigId', 'allowedColumnIds'],
    },
  };
};

export const getDataFiltersSchema = (columnList?: string[]) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      column: { type: 'string', ...getColumnEnum(columnList) },
      includeValues: {
        type: 'array',
        items: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'null' }],
        },
      },
      excludeValues: {
        type: 'array',
        items: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'null' }],
        },
      },
    },
    required: ['column'],
  },
});

export const getDataTransformSchema = (columnList?: string[]) => ({
  type: 'object',
  properties: {
    keyColumn: { type: 'string', ...getColumnEnum(columnList) },
    aggregationColumnsSetting: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          column: { type: 'string', ...getColumnEnum(columnList) },
          aggregationMethod: {
            type: 'string',
            enum: ['sum', 'average', 'min', 'max'],
          },
        },
        required: ['column'],
      },
    },
  },
  required: ['keyColumn'],
});

export const getGraphDataConfigurationSchema = (
  columnList?: string[],
  graphType?: GraphType | 'dashboard' | 'dashboardWideToLong',
) => ({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      columnId: {
        oneOf: [
          { type: 'string', ...getColumnEnum(columnList) },
          {
            type: 'array',
            items: { type: 'string', ...getColumnEnum(columnList) },
          },
        ],
      },
      chartConfigId: {
        type: 'string',
        ...getColumnEnum(getGraphConfigChartConfigIdEnum(graphType)),
      },
    },
    required: ['columnId', 'chartConfigId'],
  },
});

export const getAdvancedDataSelectionSchema = async (
  columnList?: string[],
  graphType?: GraphType,
) => {
  const settingsSchema = await getSettingsSchema('allGraphs');
  return {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        chartConfigId: { type: 'string' },
        label: { type: 'string' },
        width: { type: 'string' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataConfiguration: getGraphDataConfigurationSchema(columnList, graphType),
              label: { type: 'string' },
              graphSettings: settingsSchema,
            },
            required: ['dataConfiguration', 'label'],
          },
          minItems: 1,
        },
        defaultValue: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataConfiguration: getGraphDataConfigurationSchema(columnList, graphType),
              label: { type: 'string' },
              graphSettings: settingsSchema,
            },
            required: ['dataConfiguration', 'label'],
          },
          minItems: 1,
        },
        ui: { type: 'string', enum: ['select', 'radio'] },
      },
      required: ['chartConfigId', 'options'],
    },
  };
};

export const getSingleGraphJSONSchema = async (columnList?: string[], graphType?: GraphType) => {
  const settingsSchema = await getSettingsSchema(graphType || 'allGraphs');
  if (
    graphType &&
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graphType) !== -1
  )
    return {
      type: 'object',
      properties: {
        graphSettings: settingsSchema,
        graphType: {
          type: 'string',
          enum: GraphList.filter(el => el.geoHubMapPresentation).map(el => el.graphID),
        },
        debugMode: { type: 'boolean' },
        theme: { type: 'string', enum: ['dark', 'light'] },
        uiMode: {
          type: 'string',
          enum: ['light', 'normal'],
        },
        classNames: { type: 'object' },
        highlightDataPointSettings: {
          type: 'object',
          properties: {
            column: { type: 'string' },
            label: { type: 'string' },
            defaultValues: {
              oneOf: [
                {
                  type: 'array',
                  items: { type: 'string' },
                },
                {
                  type: 'array',
                  items: { type: 'number' },
                },
              ],
            },
            excludeValues: {
              type: 'array',
              items: { type: 'string' },
            },
            allowSelectAll: { type: 'boolean' },
            width: { type: 'string' },
          },
          required: ['column'],
        },
        styles: { type: 'object' },
      },
      required: ['graphType'],
    };
  if (graphType === 'dataTable' || graphType === 'dataCards')
    return {
      type: 'object',
      properties: {
        graphSettings: settingsSchema,
        dataSettings: getDataSettingsSchema(columnList),
        filters: getFiltersSchema(columnList),
        noOfFiltersPerRow: { type: 'number' },
        graphType: {
          type: 'string',
          enum: ['dataTable', 'dataCards'],
        },
        dataTransform: getDataTransformSchema(columnList),
        dataFilters: getDataFiltersSchema(columnList),
        readableHeader: getReadableHeaderSchema(columnList),
        dataSelectionOptions: getDataSelectionSchema(columnList),
        advancedDataSelectionOptions: getAdvancedDataSelectionSchema(columnList, graphType),
        debugMode: { type: 'boolean' },
        theme: { type: 'string', enum: ['dark', 'light'] },
        uiMode: {
          type: 'string',
          enum: ['light', 'normal'],
        },
        classNames: { type: 'object' },
        highlightDataPointSettings: {
          type: 'object',
          properties: {
            column: { type: 'string' },
            label: { type: 'string' },
            defaultValues: {
              oneOf: [
                {
                  type: 'array',
                  items: { type: 'string' },
                },
                {
                  type: 'array',
                  items: { type: 'number' },
                },
              ],
            },
            excludeValues: {
              type: 'array',
              items: { type: 'string' },
            },
            allowSelectAll: { type: 'boolean' },
            width: { type: 'string' },
          },
          required: ['column'],
        },
        styles: { type: 'object' },
      },
      required: ['dataSettings', 'graphType'],
    };
  return {
    type: 'object',
    properties: {
      graphSettings: settingsSchema,
      dataSettings: getDataSettingsSchema(columnList),
      filters: getFiltersSchema(columnList),
      classNames: { type: 'object' },
      styles: { type: 'object' },
      graphType: {
        type: 'string',
        enum: GraphList.map(el => el.graphID),
      },
      noOfFiltersPerRow: { type: 'number' },
      dataTransform: getDataTransformSchema(columnList),
      dataFilters: getDataFiltersSchema(columnList),
      graphDataConfiguration: getGraphDataConfigurationSchema(columnList, graphType),
      readableHeader: getReadableHeaderSchema(columnList),
      dataSelectionOptions: getDataSelectionSchema(columnList),
      advancedDataSelectionOptions: getAdvancedDataSelectionSchema(columnList, graphType),
      debugMode: { type: 'boolean' },
      theme: { type: 'string', enum: ['dark', 'light'] },
      highlightDataPointSettings: {
        type: 'object',
        properties: {
          column: { type: 'string' },
          label: { type: 'string' },
          defaultValues: {
            oneOf: [
              {
                type: 'array',
                items: { type: 'string' },
              },
              {
                type: 'array',
                items: { type: 'number' },
              },
            ],
          },
          excludeValues: {
            type: 'array',
            items: { type: 'string' },
          },
          allowSelectAll: { type: 'boolean' },
          width: { type: 'string' },
        },
        required: ['column'],
      },
      uiMode: {
        type: 'string',
        enum: ['light', 'normal'],
      },
    },
    required: !graphType ? ['graphType'] : ['dataSettings', 'graphType', 'graphDataConfiguration'],
  };
};

export const getGriddedGraphJSONSchema = async (columnList?: string[], graphType?: GraphType) => {
  const settingsSchema = await getSettingsSchema(graphType || 'allGraphs');
  if (graphType === 'dataTable' || graphType === 'dataCards')
    return {
      type: 'object',
      properties: {
        graphSettings: settingsSchema,
        dataSettings: getDataSettingsSchema(columnList),
        filters: getFiltersSchema(columnList),
        classNames: { type: 'object' },
        styles: { type: 'object' },
        noOfFiltersPerRow: { type: 'number' },
        graphType: {
          type: 'string',
          enum: ['dataTable', 'dataCards'],
        },
        uiMode: {
          type: 'string',
          enum: ['light', 'normal'],
        },
        dataTransform: getDataTransformSchema(columnList),
        dataFilters: getDataFiltersSchema(columnList),
        noOfColumns: { type: 'number' },
        columnGridBy: { type: 'string' },
        showCommonColorScale: { type: 'boolean' },
        minGraphHeight: { type: 'number' },
        minGraphWidth: { type: 'number' },
        readableHeader: getReadableHeaderSchema(columnList),
        dataSelectionOptions: getDataSelectionSchema(columnList),
        advancedDataSelectionOptions: getAdvancedDataSelectionSchema(columnList, graphType),
        debugMode: { type: 'boolean' },
        theme: { type: 'string', enum: ['dark', 'light'] },
      },
      required: ['columnGridBy', 'dataSettings', 'graphType'],
    };
  return {
    type: 'object',
    properties: {
      graphSettings: settingsSchema,
      dataSettings: getDataSettingsSchema(columnList),
      filters: getFiltersSchema(columnList),
      classNames: { type: 'object' },
      styles: { type: 'object' },
      noOfFiltersPerRow: { type: 'number' },
      graphType: {
        type: 'string',
        enum: GraphList.filter(el => el.availableInGriddedGraph !== false).map(el => el.graphID),
      },
      uiMode: {
        type: 'string',
        enum: ['light', 'normal'],
      },
      dataTransform: getDataTransformSchema(columnList),
      dataFilters: getDataFiltersSchema(columnList),
      graphDataConfiguration: getGraphDataConfigurationSchema(columnList, graphType),
      noOfColumns: { type: 'number' },
      columnGridBy: { type: 'string' },
      showCommonColorScale: { type: 'boolean' },
      minGraphHeight: { type: 'number' },
      minGraphWidth: { type: 'number' },
      readableHeader: getReadableHeaderSchema(columnList),
      dataSelectionOptions: getDataSelectionSchema(columnList),
      advancedDataSelectionOptions: getAdvancedDataSelectionSchema(columnList, graphType),
      debugMode: { type: 'boolean' },
      theme: { type: 'string', enum: ['dark', 'light'] },
    },
    required: !graphType
      ? ['columnGridBy', 'dataSettings', 'graphType']
      : ['columnGridBy', 'dataSettings', 'graphType', 'graphDataConfiguration'],
  };
};

export const getDashboardJSONSchema = async (columnList?: string[]) => {
  const settingsSchema = await getSettingsSchema('allGraphs');
  return {
    properties: {
      dashboardID: { type: 'string' },
      graphClassNames: { type: 'object' },
      graphStyles: { type: 'object' },
      dashboardLayout: {
        properties: {
          backgroundColor: { type: ['string', 'boolean'] },
          description: { type: 'string' },
          language: {
            enum: ['ar', 'en', 'he'],
            type: 'string',
          },
          padding: { type: 'string' },
          title: { type: 'string' },
          rows: {
            items: {
              properties: {
                columns: {
                  items: {
                    properties: {
                      columnWidth: { type: 'number' },
                      dataFilters: getDataFiltersSchema(),
                      dataTransform: getDataTransformSchema(),
                      graphDataConfiguration: getGraphDataConfigurationSchema(
                        undefined,
                        'dashboard',
                      ),
                      graphType: {
                        enum: GraphList.map(el => el.graphID),
                        type: 'string',
                      },
                      settings: settingsSchema,
                      dataSelectionOptions: getDataSelectionSchema(),
                      advancedDataSelectionOptions: getAdvancedDataSelectionSchema(),
                      attachedFilter: {
                        type: 'string',
                        ...getColumnEnum(columnList),
                      },
                    },
                    type: 'object',
                    required: ['graphType'],
                  },
                  type: 'array',
                },
                height: { type: 'number' },
              },
              type: 'object',
              required: ['columns'],
            },
            type: 'array',
          },
        },
        type: 'object',
        required: ['rows'],
      },
      dataSettings: getDataSettingsSchema(columnList),
      filters: getFiltersSchema(columnList),
      noOfFiltersPerRow: { type: 'number' },
      uiMode: {
        type: 'string',
        enum: ['light', 'normal'],
      },
      filterPosition: { type: 'string', enum: ['top', 'side'] },
      readableHeader: getReadableHeaderSchema(columnList),
      dataFilters: getDataFiltersSchema(columnList),
      debugMode: { type: 'boolean' },
      theme: { type: 'string', enum: ['dark', 'light'] },
      graphBackgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    },
    type: 'object',
    required: ['dashboardLayout', 'dataSettings'],
  };
};

export const getDashboardWideToLongFormatJSONSchema = async () => {
  const settingsSchema = await getSettingsSchema('allGraphs');
  return {
    properties: {
      dashboardID: { type: 'string' },
      graphClassNames: { type: 'object' },
      graphStyles: { type: 'object' },
      dashboardLayout: {
        properties: {
          backgroundColor: { type: ['string', 'boolean'] },
          description: { type: 'string' },
          language: {
            enum: ['ar', 'en', 'he'],
            type: 'string',
          },
          padding: { type: 'string' },
          dropdownLabel: { type: 'string' },
          title: { type: 'string' },
          rows: {
            items: {
              properties: {
                columns: {
                  items: {
                    properties: {
                      columnWidth: { type: 'number' },
                      dataFilters: getDataFiltersSchema(),
                      graphDataConfiguration: getGraphDataConfigurationSchema(
                        undefined,
                        'dashboardWideToLong',
                      ),
                      graphType: {
                        enum: GraphList.filter(el => el.availableInWideToLongFormat).map(
                          el => el.graphID,
                        ),
                        type: 'string',
                      },
                      settings: settingsSchema,
                    },
                    type: 'object',
                    required: ['graphType'],
                  },
                  type: 'array',
                },
                height: { type: 'number' },
              },
              type: 'object',
              required: ['columns'],
            },
            type: 'array',
          },
        },
        type: 'object',
        required: ['rows'],
      },
      dataSettings: {
        properties: {
          ...getDataSettingsSchema().properties,
          keyColumn: { type: 'string' },
        },
        required: ['keyColumn'],
        type: 'object',
      },
      uiMode: {
        type: 'string',
        enum: ['light', 'normal'],
      },
      dataFilters: getDataFiltersSchema(),
      readableHeader: getReadableHeaderSchema(),
      debugMode: { type: 'boolean' },
      theme: { type: 'string', enum: ['dark', 'light'] },
      graphBackgroundColor: { oneOf: [{ type: 'string' }, { type: 'boolean' }] },
    },
    type: 'object',
    required: ['dashboardLayout', 'dataSettings'],
  };
};
