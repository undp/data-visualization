import { GraphTypeForGriddedGraph } from '@/Types';

export const ChartConfiguration: {
  chartID: GraphTypeForGriddedGraph;
  configuration: { id: string; required: boolean; multiple: boolean }[];
}[] = [
  {
    chartID: 'barChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: true,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'bulletChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: true,
        multiple: false,
      },
      {
        id: 'target',
        required: false,
        multiple: false,
      },
      {
        id: 'qualitativeRange',
        required: false,
        multiple: true,
      },
    ],
  },
  {
    chartID: 'radarChart',
    configuration: [
      {
        id: 'label',
        required: false,
        multiple: false,
      },
      {
        id: 'values',
        required: true,
        multiple: true,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'stackedBarChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        multiple: true,
        required: true,
      },
    ],
  },
  {
    chartID: 'groupedBarChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        multiple: true,
        required: true,
      },
    ],
  },
  {
    chartID: 'animatedBarChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: true,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedStackedBarChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        multiple: true,
        required: true,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedGroupedBarChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        multiple: true,
        required: true,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'lineChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'dualAxisLineChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y1',
        multiple: false,
        required: true,
      },
      {
        id: 'y2',
        multiple: false,
        required: true,
      },
    ],
  },
  {
    chartID: 'differenceLineChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y1',
        multiple: false,
        required: true,
      },
      {
        id: 'y2',
        multiple: false,
        required: true,
      },
    ],
  },
  {
    chartID: 'multiLineChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        multiple: true,
        required: true,
      },
    ],
  },
  {
    chartID: 'multiLineAltChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        multiple: false,
        required: true,
      },
      {
        id: 'label',
        multiple: false,
        required: true,
      },
      {
        id: 'color',
        multiple: false,
        required: false,
      },
    ],
  },
  {
    chartID: 'stackedAreaChart',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        multiple: true,
        required: true,
      },
    ],
  },
  {
    chartID: 'choroplethMap',
    configuration: [
      {
        id: 'id',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'biVariateChoroplethMap',
    configuration: [
      {
        id: 'id',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'dotDensityMap',
    configuration: [
      {
        id: 'lat',
        required: true,
        multiple: false,
      },
      {
        id: 'long',
        required: true,
        multiple: false,
      },
      {
        id: 'label',
        multiple: false,
        required: false,
      },
      {
        id: 'color',
        multiple: false,
        required: false,
      },
      {
        id: 'radius',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedChoroplethMap',
    configuration: [
      {
        id: 'id',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        required: true,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedBiVariateChoroplethMap',
    configuration: [
      {
        id: 'id',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedDotDensityMap',
    configuration: [
      {
        id: 'lat',
        required: true,
        multiple: false,
      },
      {
        id: 'long',
        required: true,
        multiple: false,
      },
      {
        id: 'label',
        multiple: false,
        required: false,
      },
      {
        id: 'color',
        multiple: false,
        required: false,
      },
      {
        id: 'radius',
        required: false,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'donutChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'slopeChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'y1',
        required: true,
        multiple: false,
      },
      {
        id: 'y2',
        required: true,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'scatterPlot',
    configuration: [
      {
        id: 'x',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
      {
        id: 'radius',
        required: false,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
      {
        id: 'label',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedScatterPlot',
    configuration: [
      {
        id: 'x',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
      {
        id: 'radius',
        required: false,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'dumbbellChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        multiple: true,
        required: true,
      },
    ],
  },
  {
    chartID: 'animatedDumbbellChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'x',
        multiple: true,
        required: true,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'treeMap',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: true,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'circlePacking',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'size',
        required: false,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'sankeyChart',
    configuration: [
      {
        id: 'source',
        required: true,
        multiple: false,
      },
      {
        id: 'target',
        required: true,
        multiple: false,
      },
      {
        id: 'value',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'heatMap',
    configuration: [
      {
        id: 'row',
        required: true,
        multiple: false,
      },
      {
        id: 'column',
        required: true,
        multiple: false,
      },
      {
        id: 'value',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'stripChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'position',
        required: true,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'statCard',
    configuration: [
      {
        id: 'value',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'beeSwarmChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'position',
        required: true,
        multiple: false,
      },
      {
        id: 'radius',
        required: false,
        multiple: false,
      },
      {
        id: 'color',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'butterflyChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'leftBar',
        required: true,
        multiple: false,
      },
      {
        id: 'rightBar',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'animatedButterflyChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'leftBar',
        required: true,
        multiple: false,
      },
      {
        id: 'rightBar',
        required: true,
        multiple: false,
      },
      {
        id: 'date',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'lineChartWithConfidenceInterval',
    configuration: [
      {
        id: 'date',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
      {
        id: 'yMin',
        required: false,
        multiple: false,
      },
      {
        id: 'yMax',
        required: false,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'histogram',
    configuration: [
      {
        id: 'value',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'sparkLine',
    configuration: [
      {
        id: 'dale',
        required: true,
        multiple: false,
      },
      {
        id: 'y',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'paretoChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'bar',
        required: true,
        multiple: false,
      },
      {
        id: 'line',
        required: true,
        multiple: false,
      },
    ],
  },
  {
    chartID: 'unitChart',
    configuration: [
      {
        id: 'label',
        required: true,
        multiple: false,
      },
      {
        id: 'value',
        required: true,
        multiple: false,
      },
    ],
  },
];
