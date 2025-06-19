export const STYLE_OBJECT = `{
  title?: React.CSSProperties;
  footnote?: React.CSSProperties;
  source?: React.CSSProperties;
  description?: React.CSSProperties;
  graphContainer?: React.CSSProperties;
  tooltip?: React.CSSProperties;
  xAxis?: {
    gridLines?: React.CSSProperties;
    labels?: React.CSSProperties;
    title?: React.CSSProperties;
    axis?: React.CSSProperties;
  };
  yAxis?: {
    gridLines?: React.CSSProperties;
    labels?: React.CSSProperties;
    title?: React.CSSProperties;
    axis?: React.CSSProperties;
  };
  graphObjectValues?: React.CSSProperties;
  dataConnectors?: React.CSSProperties;
  mouseOverLine?: React.CSSProperties;
  regLine?: React.CSSProperties;
  dataCard?: React.CSSProperties;
}`;

export const CLASS_NAME_OBJECT = `{
  title?: string;
  footnote?: string;
  source?: string;
  description?: string;
  graphContainer?: string;
  detailsOnClick?: string;
  tooltip?: string;
  xAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  yAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  graphObjectValues?: string;
  dataConnectors?: string;
  mouseOverLine?: string;
  regLine?: string;
  dataCard?: string;
}`;

export const REF_VALUE_OBJECT = `{
  value: number | null;
  text: string;
  color?: string;
  styles?: {
    line?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  classNames?: {
    line?: string;
    text?: string;
  };
}`;

export const SOURCE_OBJECT = `{
  source: string; 
  link?: string; 
}`;

export const ANNOTATION_OBJECT = `{
  text: string;
  maxWidth?: number;
  xCoordinate?: number | string;
  yCoordinate?: number | string;
  xOffset?: number;
  yOffset?: number;
  align?: 'center' | 'left' | 'right';
  color?: string;
  fontWeight?: 'regular' | 'bold' | 'medium';
  showConnector?: boolean | number;
  connectorRadius?: number;
  classNames?: {
    connector?: string;
    text?: string;
  };
  styles?: {
    connector?: React.CSSProperties;
    text?: React.CSSProperties;
  };
}`;

export const CUSTOM_HIGHLIGHT_AREA_OBJECT = `{
  coordinates: (number | string)[];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}`;

export const LANGUAGE_OPTIONS = [
  'en',
  'ar',
  'az',
  'bn',
  'cy',
  'he',
  'hi',
  'jp',
  'ka',
  'km',
  'ko',
  'my',
  'ne',
  'zh',
  'custom',
];

export const GraphNames = [
  {
    name: 'Bar graph',
    id: 'barChart',
  },
  {
    name: 'Bar graph (animated)',
    id: 'animatedBarChart',
  },
  {
    name: 'Stacked bar graph',
    id: 'stackedBarChart',
  },
  {
    name: 'Stacked bar graph (animated)',
    id: 'animatedStackedBarChart',
  },
  {
    name: 'Grouped bar graph',
    id: 'groupedBarChart',
  },
  {
    name: 'Grouped bar graph (animated)',
    id: 'animatedGroupedBarChart',
  },
  {
    name: 'Donut graph',
    id: 'donutChart',
  },
  {
    name: 'Tree map',
    id: 'treeMap',
  },
  {
    name: 'Circle packing',
    id: 'circlePacking',
  },
  {
    name: 'Beeswarm chart',
    id: 'beeSwarmChart',
  },
  {
    name: 'Butterfly chart',
    id: 'butterflyChart',
  },
  {
    name: 'Butterfly chart (animated)',
    id: 'animatedButterflyChart',
  },
  {
    name: 'Data cards',
    id: 'dataCards',
  },
  {
    name: 'Data table',
    id: 'dataTable',
  },
  {
    name: 'Dumbbell graph',
    id: 'dumbbellChart',
  },
  {
    name: 'Dumbbell graph (animated)',
    id: 'animatedDumbbellChart',
  },
  {
    name: 'Difference line chart',
    id: 'differenceLineChart',
  },
  {
    name: 'Dual axis line chart',
    id: 'dualAxisLineChart',
  },
  {
    name: 'Line chart',
    id: 'lineChart',
  },
  {
    name: 'Sparkline',
    id: 'sparkLine',
  },
  {
    name: 'Line chart with interval',
    id: 'lineChartWithConfidenceInterval',
  },
  {
    name: 'Multi-line chart',
    id: 'multiLineChart',
  },
  {
    name: 'Multi-line chart Alternative',
    id: 'multiLineAltChart',
  },
  {
    name: 'Pareto chart',
    id: 'paretoChart',
  },
  {
    name: 'Sankey chart',
    id: 'sankeyChart',
  },
  {
    name: 'Scatter plot',
    id: 'scatterPlot',
  },
  {
    name: 'Scatter plot (animated)',
    id: 'animatedScatterPlot',
  },
  {
    name: 'Slope chart',
    id: 'slopeChart',
  },
  {
    name: 'Stacked area chart',
    id: 'stakedAreaChart',
  },
  {
    name: 'Stat card',
    id: 'statCard',
  },
  {
    name: 'Strip chart',
    id: 'stripChart',
  },
  {
    name: 'Unit chart',
    id: 'unitChart',
  },
  {
    name: 'Choropleth map',
    id: 'choroplethMap',
  },
  {
    name: 'Choropleth map (animated)',
    id: 'animatedChoroplethMap',
  },
  {
    name: 'Bi-variate choropleth map',
    id: 'biVariateChoroplethMap',
  },
  {
    name: 'Bi-variate choropleth map (animated)',
    id: 'animatedBiVariateChoroplethMap',
  },
  {
    name: 'Dot density map',
    id: 'dotDensityMap',
  },
  {
    name: 'Dot density map (animated)',
    id: 'animatedDotDensityMap',
  },
];
