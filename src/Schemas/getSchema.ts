import {
  barGraphDataSchema,
  stackedBarGraphDataSchema,
  groupedBarGraphDataSchema,
  animatedBarGraphDataSchema,
  animatedStackedBarGraphDataSchema,
  animatedGroupedBarGraphDataSchema,
  lineChartDataSchema,
  dualAxisLineChartDataSchema,
  differenceLineChartDataSchema,
  multiLineChartDataSchema,
  multiLineAltChartDataSchema,
  areaChartDataSchema,
  choroplethMapDataSchema,
  biVariateChoroplethMapDataSchema,
  dotDensityMapDataSchema,
  animatedChoroplethMapDataSchema,
  animatedBiVariateChoroplethMapDataSchema,
  animatedDotDensityMapDataSchema,
  donutChartDataSchema,
  slopeChartDataSchema,
  scatterPlotDataSchema,
  animatedScatterPlotDataSchema,
  dumbbellChartDataSchema,
  animatedDumbbellChartDataSchema,
  treeMapDataSchema,
  circlePackingDataSchema,
  heatMapDataSchema,
  stripChartDataSchema,
  beeSwarmChartDataSchema,
  butterflyChartDataSchema,
  animatedButterflyChartDataSchema,
  histogramDataSchema,
  paretoChartDataSchema,
  statCardDataSchema,
  unitChartDataSchema,
  sankeyChartDataSchema,
  simpleBarChartSettingsSchema,
  stackedBarChartSettingsSchema,
  groupedBarChartSettingsSchema,
  animatedSimpleBarChartSettingsSchema,
  animatedStackedBarChartSettingsSchema,
  animatedGroupedBarChartSettingsSchema,
  lineChartSettingsSchema,
  dualAxisLineChartSettingsSchema,
  multiLineChartSettingsSchema,
  multiLineAltChartSettingsSchema,
  differenceLineChartSettingsSchema,
  stackedAreaChartSettingsSchema,
  choroplethMapSettingsSchema,
  biVariateChoroplethMapSettingsSchema,
  dotDensityMapSettingsSchema,
  animatedChoroplethMapSettingsSchema,
  animatedBiVariateChoroplethMapSettingsSchema,
  animatedDotDensityMapSettingsSchema,
  donutChartSettingsSchema,
  slopeChartSettingsSchema,
  scatterPlotSettingsSchema,
  animatedScatterPlotSettingsSchema,
  dumbbellChartSettingsSchema,
  animatedDumbbellChartSettingsSchema,
  treeMapSettingsSchema,
  circlePackingSettingsSchema,
  heatMapSettingsSchema,
  stripChartSettingsSchema,
  beeSwarmChartSettingsSchema,
  butterflyChartSettingsSchema,
  animatedButterflyChartSettingsSchema,
  histogramSettingsSchema,
  sparkLineSettingsSchema,
  paretoChartSettingsSchema,
  dataTableSettingsSchema,
  statCardSettingsSchema,
  geoHubCompareMapSettingsSchema,
  geoHubMapSettingsSchema,
  geoHubMapWithLayerSelectionSettingsSchema,
  unitChartSettingsSchema,
  sankeyChartSettingsSchema,
  SettingsSchema,
  lineChartWithConfidenceIntervalDataSchema,
  lineChartWithConfidenceIntervalSettingsSchema,
  dataCardListSettingsSchema,
  radarChartSettingsSchema,
  radarChartDataSchema,
} from './schemaList';

import { GraphType } from '@/Types';
import { GraphList } from '@/Utils/getGraphList';

export function getDataSchema(graph: GraphType) {
  if (
    GraphList.filter(el => el.geoHubMapPresentation)
      .map(el => el.graphID)
      .indexOf(graph) !== -1
  )
    return null;

  switch (graph) {
    case 'dataTable':
      return {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
        },
      };
    case 'dataCards':
      return {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
        },
      };
    case 'barChart':
      return barGraphDataSchema;
    case 'stackedBarChart':
      return stackedBarGraphDataSchema;
    case 'groupedBarChart':
      return groupedBarGraphDataSchema;
    case 'animatedBarChart':
      return animatedBarGraphDataSchema;
    case 'animatedStackedBarChart':
      return animatedStackedBarGraphDataSchema;
    case 'animatedGroupedBarChart':
      return animatedGroupedBarGraphDataSchema;
    case 'lineChart':
      return lineChartDataSchema;
    case 'dualAxisLineChart':
      return dualAxisLineChartDataSchema;
    case 'differenceLineChart':
      return differenceLineChartDataSchema;
    case 'multiLineChart':
      return multiLineChartDataSchema;
    case 'multiLineAltChart':
      return multiLineAltChartDataSchema;
    case 'stackedAreaChart':
      return areaChartDataSchema;
    case 'choroplethMap':
      return choroplethMapDataSchema;
    case 'biVariateChoroplethMap':
      return biVariateChoroplethMapDataSchema;
    case 'dotDensityMap':
      return dotDensityMapDataSchema;
    case 'animatedChoroplethMap':
      return animatedChoroplethMapDataSchema;
    case 'animatedBiVariateChoroplethMap':
      return animatedBiVariateChoroplethMapDataSchema;
    case 'animatedDotDensityMap':
      return animatedDotDensityMapDataSchema;
    case 'donutChart':
      return donutChartDataSchema;
    case 'slopeChart':
      return slopeChartDataSchema;
    case 'scatterPlot':
      return scatterPlotDataSchema;
    case 'animatedScatterPlot':
      return animatedScatterPlotDataSchema;
    case 'dumbbellChart':
      return dumbbellChartDataSchema;
    case 'animatedDumbbellChart':
      return animatedDumbbellChartDataSchema;
    case 'treeMap':
      return treeMapDataSchema;
    case 'circlePacking':
      return circlePackingDataSchema;
    case 'heatMap':
      return heatMapDataSchema;
    case 'stripChart':
      return stripChartDataSchema;
    case 'beeSwarmChart':
      return beeSwarmChartDataSchema;
    case 'butterflyChart':
      return butterflyChartDataSchema;
    case 'animatedButterflyChart':
      return animatedButterflyChartDataSchema;
    case 'histogram':
      return histogramDataSchema;
    case 'sparkLine':
      return lineChartDataSchema;
    case 'paretoChart':
      return paretoChartDataSchema;
    case 'statCard':
      return statCardDataSchema;
    case 'unitChart':
      return unitChartDataSchema;
    case 'sankeyChart':
      return sankeyChartDataSchema;
    case 'lineChartWithConfidenceInterval':
      return lineChartWithConfidenceIntervalDataSchema;
    case 'radarChart':
      return radarChartDataSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getSettingsSchema(graph: GraphType | 'allGraphs') {
  switch (graph) {
    case 'barChart':
      return simpleBarChartSettingsSchema;
    case 'stackedBarChart':
      return stackedBarChartSettingsSchema;
    case 'groupedBarChart':
      return groupedBarChartSettingsSchema;
    case 'animatedBarChart':
      return animatedSimpleBarChartSettingsSchema;
    case 'animatedStackedBarChart':
      return animatedStackedBarChartSettingsSchema;
    case 'animatedGroupedBarChart':
      return animatedGroupedBarChartSettingsSchema;
    case 'lineChart':
      return lineChartSettingsSchema;
    case 'dualAxisLineChart':
      return dualAxisLineChartSettingsSchema;
    case 'multiLineChart':
      return multiLineChartSettingsSchema;
    case 'multiLineAltChart':
      return multiLineAltChartSettingsSchema;
    case 'differenceLineChart':
      return differenceLineChartSettingsSchema;
    case 'stackedAreaChart':
      return stackedAreaChartSettingsSchema;
    case 'choroplethMap':
      return choroplethMapSettingsSchema;
    case 'biVariateChoroplethMap':
      return biVariateChoroplethMapSettingsSchema;
    case 'dotDensityMap':
      return dotDensityMapSettingsSchema;
    case 'animatedChoroplethMap':
      return animatedChoroplethMapSettingsSchema;
    case 'animatedBiVariateChoroplethMap':
      return animatedBiVariateChoroplethMapSettingsSchema;
    case 'animatedDotDensityMap':
      return animatedDotDensityMapSettingsSchema;
    case 'donutChart':
      return donutChartSettingsSchema;
    case 'slopeChart':
      return slopeChartSettingsSchema;
    case 'scatterPlot':
      return scatterPlotSettingsSchema;
    case 'animatedScatterPlot':
      return animatedScatterPlotSettingsSchema;
    case 'dumbbellChart':
      return dumbbellChartSettingsSchema;
    case 'animatedDumbbellChart':
      return animatedDumbbellChartSettingsSchema;
    case 'treeMap':
      return treeMapSettingsSchema;
    case 'circlePacking':
      return circlePackingSettingsSchema;
    case 'heatMap':
      return heatMapSettingsSchema;
    case 'stripChart':
      return stripChartSettingsSchema;
    case 'beeSwarmChart':
      return beeSwarmChartSettingsSchema;
    case 'butterflyChart':
      return butterflyChartSettingsSchema;
    case 'animatedButterflyChart':
      return animatedButterflyChartSettingsSchema;
    case 'histogram':
      return histogramSettingsSchema;
    case 'sparkLine':
      return sparkLineSettingsSchema;
    case 'paretoChart':
      return paretoChartSettingsSchema;
    case 'dataTable':
      return dataTableSettingsSchema;
    case 'statCard':
      return statCardSettingsSchema;
    case 'geoHubCompareMap':
      return geoHubCompareMapSettingsSchema;
    case 'geoHubMap':
      return geoHubMapSettingsSchema;
    case 'geoHubMapWithLayerSelection':
      return geoHubMapWithLayerSelectionSettingsSchema;
    case 'unitChart':
      return unitChartSettingsSchema;
    case 'sankeyChart':
      return sankeyChartSettingsSchema;
    case 'lineChartWithConfidenceInterval':
      return lineChartWithConfidenceIntervalSettingsSchema;
    case 'dataCards':
      return dataCardListSettingsSchema;
    case 'allGraphs':
      return SettingsSchema;
    case 'radarChart':
      return radarChartSettingsSchema;
    default:
      console.error('Unknown chart type:', graph);
      return null;
  }
}

export function getGraphConfigChartConfigIdEnum(
  chartType?: GraphType | 'dashboardWideToLong' | 'dashboard',
) {
  switch (chartType) {
    case 'barChart':
      return ['label', 'size', 'color'];
    case 'bulletChart':
      return ['label', 'size', 'target', 'qualitativeRange'];
    case 'animatedBarChart':
      return ['label', 'size', 'color', 'date'];
    case 'treeMap':
      return ['label', 'size', 'color'];
    case 'circlePacking':
      return ['label', 'size', 'color'];
    case 'butterflyChart':
      return ['label', 'leftBar', 'rightBar'];
    case 'groupedBarChart':
      return ['label', 'size'];
    case 'stackedBarChart':
      return ['label', 'size'];
    case 'animatedButterflyChart':
      return ['label', 'leftBar', 'rightBar', 'date'];
    case 'animatedGroupedBarChart':
      return ['label', 'size', 'date'];
    case 'animatedStackedBarChart':
      return ['label', 'size', 'date'];
    case 'dumbbellChart':
      return ['x', 'label'];
    case 'animatedDumbbellChart':
      return ['x', 'label', 'date'];
    case 'donutChart':
      return ['size', 'label'];
    case 'histogram':
      return ['value'];
    case 'choroplethMap':
      return ['x', 'id'];
    case 'biVariateChoroplethMap':
      return ['x', 'y', 'id'];
    case 'animatedChoroplethMap':
      return ['x', 'id', 'date'];
    case 'animatedBiVariateChoroplethMap':
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
      return ['x', 'y', 'radius', 'color', 'label'];
    case 'animatedScatterPlot':
      return ['x', 'y', 'radius', 'color', 'label', 'date'];
    case 'dualAxisLineChart':
      return ['date', 'y1', 'y2'];
    case 'paretoChart':
      return ['label', 'bar', 'line'];
    case 'dotDensityMap':
      return ['lat', 'long', 'radius', 'color', 'label'];
    case 'animatedDotDensityMap':
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

export const getDataSelectionSchema = (columnList?: string[]) => ({
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
            graphSettings: SettingsSchema,
          },
          required: ['value', 'label'],
        },
        minItems: 1,
      },
      ui: { type: 'string', enum: ['select', 'radio'] },
    },
    required: ['chartConfigId', 'allowedColumnIds'],
  },
});

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

export const getAdvancedDataSelectionSchema = (columnList?: string[], graphType?: GraphType) => ({
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
            graphSettings: SettingsSchema,
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
            graphSettings: SettingsSchema,
          },
          required: ['dataConfiguration', 'label'],
        },
        minItems: 1,
      },
      ui: { type: 'string', enum: ['select', 'radio'] },
    },
    required: ['chartConfigId', 'options'],
  },
});

export const getSingleGraphJSONSchema = (columnList?: string[], graphType?: GraphType) =>
  graphType &&
  GraphList.filter(el => el.geoHubMapPresentation)
    .map(el => el.graphID)
    .indexOf(graphType) !== -1
    ? {
        type: 'object',
        properties: {
          graphSettings: getSettingsSchema(graphType),
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
      }
    : graphType === 'dataTable' || graphType === 'dataCards'
      ? {
          type: 'object',
          properties: {
            graphSettings: getSettingsSchema(graphType),
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
        }
      : {
          type: 'object',
          properties: {
            graphSettings: graphType
              ? getSettingsSchema(graphType)
              : getSettingsSchema('allGraphs'),
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
          required: !graphType
            ? ['graphType']
            : ['dataSettings', 'graphType', 'graphDataConfiguration'],
        };

export const getGriddedGraphJSONSchema = (columnList?: string[], graphType?: GraphType) =>
  graphType === 'dataTable' || graphType === 'dataCards'
    ? {
        type: 'object',
        properties: {
          graphSettings: getSettingsSchema(graphType),
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
      }
    : {
        type: 'object',
        properties: {
          graphSettings: graphType ? getSettingsSchema(graphType) : getSettingsSchema('allGraphs'),
          dataSettings: getDataSettingsSchema(columnList),
          filters: getFiltersSchema(columnList),
          classNames: { type: 'object' },
          styles: { type: 'object' },
          noOfFiltersPerRow: { type: 'number' },
          graphType: {
            type: 'string',
            enum: GraphList.filter(el => el.availableInGriddedGraph !== false).map(
              el => el.graphID,
            ),
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

export const getDashboardJSONSchema = (columnList?: string[]) => ({
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
                    graphDataConfiguration: getGraphDataConfigurationSchema(undefined, 'dashboard'),
                    graphType: {
                      enum: GraphList.map(el => el.graphID),
                      type: 'string',
                    },
                    settings: getSettingsSchema('allGraphs'),
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
});

export const getDashboardWideToLongFormatJSONSchema = () => ({
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
                    settings: getSettingsSchema('allGraphs'),
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
});
