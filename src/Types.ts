/* eslint-disable @typescript-eslint/no-explicit-any */
export type Languages =
  | 'en'
  | 'ar'
  | 'az'
  | 'bn'
  | 'cy'
  | 'he'
  | 'hi'
  | 'jp'
  | 'ka'
  | 'km'
  | 'ko'
  | 'my'
  | 'ne'
  | 'zh'
  | 'custom';

export type GraphTypeForGriddedGraph =
  | 'barChart'
  | 'waterfallChart'
  | 'stackedBarChart'
  | 'groupedBarChart'
  | 'lineChart'
  | 'dualAxisLineChart'
  | 'multiLineChart'
  | 'multiLineAltChart'
  | 'differenceLineChart'
  | 'stackedAreaChart'
  | 'choroplethMap'
  | 'biVariateChoroplethMap'
  | 'hybridMap'
  | 'dotDensityMap'
  | 'donutChart'
  | 'slopeChart'
  | 'scatterPlot'
  | 'dumbbellChart'
  | 'treeMap'
  | 'circlePacking'
  | 'heatMap'
  | 'stripChart'
  | 'beeSwarmChart'
  | 'butterflyChart'
  | 'histogram'
  | 'sparkLine'
  | 'paretoChart'
  | 'dataTable'
  | 'statCard'
  | 'unitChart'
  | 'sankeyChart'
  | 'lineChartWithConfidenceInterval'
  | 'dataCards'
  | 'radarChart'
  | 'bulletChart';

export type GeoHubGraphType = 'geoHubCompareMap' | 'geoHubMap' | 'geoHubMapWithLayerSelection';

export type ThreeDGraphType = 'threeDGlobe';

export type GraphType = GraphTypeForGriddedGraph;

export type ZoomInteractionTypes = 'scroll' | 'ctrlScroll' | 'button' | 'noZoom';

export type CurveTypes = 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';

export type MapProjectionTypes =
  | 'mercator'
  | 'equalEarth'
  | 'naturalEarth'
  | 'orthographic'
  | 'albersUSA';

export interface CustomLayerDataType {
  position: 'before' | 'after';
  layer: React.ReactNode;
}

export interface SourcesDataType {
  source: string;
  link?: string;
}

export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}

export interface UnitChartDataType {
  label: number | string;
  value: number;
  data?: object;
}

export interface TreeMapDataType {
  label: string | number;
  size?: number | null;
  color?: string;
  data?: object;
}

export interface ButterflyChartDataType {
  label: string | number;
  leftBar?: number | null;
  rightBar?: number | null;
  date?: string | number;
  data?: object;
}

export interface AxesStyleObject {
  gridLines?: React.CSSProperties;
  labels?: React.CSSProperties;
  title?: React.CSSProperties;
  axis?: React.CSSProperties;
}

export interface StyleObject {
  title?: React.CSSProperties;
  footnote?: React.CSSProperties;
  source?: React.CSSProperties;
  description?: React.CSSProperties;
  graphContainer?: React.CSSProperties;
  tooltip?: React.CSSProperties;
  xAxis?: AxesStyleObject;
  yAxis?: AxesStyleObject;
  graphObjectValues?: React.CSSProperties;
  dataConnectors?: React.CSSProperties;
  mouseOverLine?: React.CSSProperties;
  regLine?: React.CSSProperties;
  dataCards?: React.CSSProperties;
  modal?: React.CSSProperties;
}

export interface AxesClassNameObject {
  gridLines?: string;
  labels?: string;
  title?: string;
  axis?: string;
}
export interface ClassNameObject {
  title?: string;
  footnote?: string;
  source?: string;
  description?: string;
  tooltip?: string;
  xAxis?: AxesClassNameObject;
  yAxis?: AxesClassNameObject;
  legend?: string;
  graphContainer?: string;
  graphObjectValues?: string;
  dataConnectors?: string;
  mouseOverLine?: string;
  regLine?: string;
  dataCards?: string;
  colorLegend?: string;
  modal?: string;
}

export interface BarGraphDataType {
  label: string | number;
  date?: string | number;
  size?: number | null;
  color?: string | null;
  data?: object;
}

export interface WaterfallChartDataType {
  label: string | number;
  size?: number | null;
  color?: string | null;
  data?: object;
}

export interface BulletChartDataType {
  label: string | number;
  size?: number | null;
  target?: number | null;
  qualitativeRange?: number[] | null;
  date?: string | number;
  data?: object;
}

export interface AnimateDataType {
  duration: number;
  once: boolean;
  amount: 'some' | 'all' | number;
}

export interface GroupedBarGraphDataType {
  label: string | number;
  size: (number | null)[];
  date?: string | number;
  data?: object;
}

export interface DumbbellChartDataType {
  x: (number | null)[];
  label: string;
  date?: string | number;
  data?: object;
}

export interface DonutChartDataType {
  size: number;
  label: string;
  data?: object;
}

export interface RadarChartDataType {
  values: number[];
  label?: string | number;
  color?: string;
  data?: object;
}

export interface HistogramDataType {
  value: number;
  data?: object;
}

export interface ChoroplethMapDataType {
  x?: number | string | null;
  id: string;
  date?: string | number;
  data?: object;
}

export interface BivariateMapDataType {
  x?: number | null;
  y?: number | null;
  id: string;
  date?: string | number;
  data?: object;
}

export interface LineChartDataType {
  date: number | string;
  y: number;
  data?: object;
}

export interface LineChartWithConfidenceIntervalDataType {
  date: number | string;
  y?: number | null;
  yMin?: number | null;
  yMax?: number | null;
  data?: object;
}

export interface MultiLineChartDataType {
  date: number | string;
  y: (number | null)[];
  data?: object;
}

export interface MultiLineAltChartDataType {
  label: number | string;
  y: number | null;
  color?: string | number;
  date: string | number;
  data?: object;
}

export interface AreaChartDataType {
  date: number | string;
  y: number[];
  data?: object;
}

export interface ScatterPlotDataType {
  x?: number | null;
  y?: number | null;
  date?: string | number;
  radius?: number | null;
  color?: string | null;
  label: string | number;
  data?: object;
}

export interface DualAxisLineChartDataType {
  date: number | string;
  y1?: number | null;
  y2?: number | null;
  data?: object;
}

export interface DifferenceLineChartDataType {
  date: number | string;
  y1: number;
  y2: number;
  data?: object;
}

export interface ParetoChartDataType {
  label: number | string;
  bar?: number;
  line?: number;
  data?: object;
}

export interface DotDensityMapDataType {
  lat: number;
  long: number;
  radius?: number;
  color?: string | number;
  label?: string | number;
  date?: string | number;
  data?: object;
}

export interface HybridMapDataType {
  lat?: number;
  long?: number;
  x?: number | string | null;
  id?: string;
  radius?: number;
  label?: string | number;
  date?: string | number;
  data?: object;
}

export interface SlopeChartDataType {
  y1: number;
  y2: number;
  color?: string | number;
  label: string | number;
  data?: object;
}

export interface HeatMapDataType {
  row: string;
  column: string;
  value?: string | number;
  data?: object;
}

export interface SankeyDataType {
  source: string | number;
  target: string | number;
  value: number;
  data?: object;
}

export interface BeeSwarmChartDataType {
  label: string | number;
  position: number;
  radius?: number;
  color?: string;
  data?: object;
}

export interface StripChartDataType {
  label: string | number;
  position: number;
  color?: string;
  data?: object;
}

export interface NodeDataType {
  name: string;
  color: string;
  type: 'source' | 'target';
  label: string;
}

export interface NodesLinkDataType {
  nodes: NodeDataType[];
  links: {
    source: number;
    target: number;
    value: number;
  }[];
}

export interface TableColumnSettingsDataType {
  title: string;
  size?: number;
  type: string;
}

export interface DataTableColumnDataType {
  columnTitle?: string;
  columnId: string;
  sortable?: boolean;
  filterOptions?: string[];
  chip?: boolean;
  chipColumnId?: string;
  chipColors?: {
    value: string;
    color: string;
  }[];
  separator?: string;
  align?: 'left' | 'right' | 'center';
  suffix?: string;
  prefix?: string;
  columnWidth?: number;
}

export type ScaleDataType = 'categorical' | 'linear' | 'threshold';

export interface ReferenceDataType {
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
}
export interface GraphConfigurationDataType {
  columnId: string | string[];
  chartConfigId: string;
}

export interface DataSelectionDataType {
  label?: string;
  allowedColumnIds: {
    value: string;
    label: string;
    graphSettings: GraphSettingsDataType;
  }[];
  chartConfigId: string;
  ui?: 'select' | 'radio';
  width?: string;
}

export interface AdvancedDataSelectionDataType {
  label?: string;
  options: {
    label: string;
    dataConfiguration: {
      columnId: string[] | string;
      chartConfigId: string;
    }[];
    graphSettings?: GraphSettingsDataType;
  }[];
  ui?: 'select' | 'radio';
  width?: string;
  defaultValue?: {
    label: string;
    dataConfiguration: {
      columnId: string[] | string;
      chartConfigId: string;
    }[];
    graphSettings?: GraphSettingsDataType;
  };
}

export interface DataFilterDataType {
  column: string;
  includeValues?: (string | number | boolean | null | undefined)[];
  excludeValues?: (string | number | boolean | null | undefined)[];
}

export interface DashboardColumnDataWithoutGraphType {
  attachedFilter?: string;
  columnWidth?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  settings?: GraphSettingsDataType;
}

export interface DashboardColumnDataType extends DashboardColumnDataWithoutGraphType {
  graphType: GraphType;
}

export interface PerformanceIntensiveDashboardColumnDataType extends DashboardColumnDataWithoutGraphType {
  graphType: GraphType | ThreeDGraphType | GeoHubGraphType;
}

export type StatCardsFromDataSheetDataType = {
  value: number | string;
  data?: object;
};

export type FilterUiSettingsDataType = {
  column: string;
  label?: string;
  singleSelect?: boolean;
  clearable?: boolean;
  defaultValue?: string[] | string | number | number[];
  excludeValues?: string[];
  allowSelectAll?: boolean;
  width?: string;
  ui?: 'select' | 'radio';
};

export type HighlightDataPointSettingsDataType = {
  column: string;
  label?: string;
  defaultValues?: (string | number)[];
  excludeValues?: (string | number)[];
  width?: string;
};

export interface DashboardLayoutDataWithoutRowsType {
  title?: string;
  description?: string;
  padding?: string;
  backgroundColor?: string | boolean;
  language?: Languages;
}
export interface DashboardLayoutDataType extends DashboardLayoutDataWithoutRowsType {
  rows: {
    columns: DashboardColumnDataType[];
    height?: number;
  }[];
}
export interface PerformanceIntensiveDashboardLayoutDataType extends DashboardLayoutDataWithoutRowsType {
  rows: {
    columns: PerformanceIntensiveDashboardColumnDataType[];
    height?: number;
  }[];
}

export type DashboardFromWideToLongFormatColumnDataType = {
  graphType: 'donutChart' | 'barChart' | 'unitChart' | 'treeMap' | 'circlePacking';
  columnWidth?: number;
  dataFilters?: DataFilterDataType[];
  settings?: any;
  graphDataConfiguration?: GraphConfigurationDataType[];
};

export type DashboardFromWideToLongFormatLayoutDataType = {
  title?: string;
  description?: string;
  dropdownLabel?: string;
  padding?: string;
  backgroundColor?: string | boolean;
  language?: Languages;
  rows: {
    columns: DashboardFromWideToLongFormatColumnDataType[];
    height?: number;
  }[];
};

export interface ColumnConfigurationDataType {
  column: string;
  delimiter?: string;
}

export interface FileSettingsDataType {
  dataURL: string;
  idColumnName: string;
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
  apiHeaders?: any;
  dataTransformation?: string;
}

export interface DataSettingsDataType {
  dataURL?: string | FileSettingsDataType[];
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
  apiHeaders?: any;
  dataTransformation?: string;
  idColumnTitle?: string;
  data?: any;
}

export interface DataSettingsWideToLongDataType {
  dataURL?: string | FileSettingsDataType[];
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  data?: any;
  keyColumn: string;
  idColumnTitle?: string;
  dataTransformation?: string;
  apiHeaders?: any;
}

export interface AggregationSettingsDataType {
  column: string;
  aggregationMethod?: 'sum' | 'average' | 'min' | 'max';
}

export interface FilterSettingsDataType {
  filter: string;
  singleSelect?: boolean;
  label: string;
  ui?: 'select' | 'radio';
  clearable?: boolean;
  defaultValue?:
    | {
        value: string | number;
        label: string | number;
      }[]
    | {
        value: string | number;
        label: string | number;
      };
  value?:
    | {
        value: string | number;
        label: string | number;
      }[]
    | {
        value: string | number;
        label: string | number;
      };
  availableValues: {
    value: string | number;
    label: string | number;
  }[];
  allowSelectAll?: boolean;
  width?: string;
}

export interface MarginDataType {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface AnnotationSettingsDataType {
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
}

export interface HighlightAreaSettingsDataType {
  coordinates: [number | string | null, number | string | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface CustomHighlightAreaSettingsDataType {
  coordinates: (number | string)[];
  closePath?: boolean;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface HighlightAreaSettingsForScatterPlotDataType {
  coordinates: [number | null, number | null, number | null, number | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface CustomHighlightAreaSettingsForScatterPlotDataType {
  coordinates: number[];
  closePath?: boolean;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface BackgroundStyleDataType {
  borderRadius?: string;
  boxShadow?: string;
  border?: string;
}

export interface MapLegendDataType {
  mapStyleName: string;
  legend: string | React.ReactNode;
}

export interface TimelineDataType {
  autoplay: boolean;
  enabled: boolean;
  showOnlyActiveDate: boolean;
  speed?: number;
  dateFormat?: string;
}

export interface FogDataType {
  color: string;
  near: number;
  far: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface ShadowConfig {
  mapSize: {
    width: number;
    height: number;
  };
  camera: {
    near: number;
    far: number;
  };
}

interface BaseLightConfig {
  type: string;
  color: number;
  intensity: number;
}

interface AmbientLightConfig extends BaseLightConfig {
  type: 'ambient';
}

interface DirectionalLightConfig extends BaseLightConfig {
  type: 'directional';
  target?: Position;
  castShadow?: boolean;
  shadow?: ShadowConfig;
  position?: Position | 'camera';
}

interface PointLightConfig extends BaseLightConfig {
  type: 'point';
  distance?: number;
  decay?: number;
  position?: Position | 'camera';
}

interface SpotLightConfig extends BaseLightConfig {
  type: 'spot';
  target?: Position;
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  castShadow?: boolean;
  shadow?: ShadowConfig;
  position?: Position | 'camera';
}

export type LightConfig =
  | AmbientLightConfig
  | DirectionalLightConfig
  | PointLightConfig
  | SpotLightConfig;

export interface GraphSettingsDataType {
  colors?: string | string[] | string[][];
  orientation?: 'horizontal' | 'vertical';
  axisTitles?: [string, string];
  graphTitle?: string | React.ReactNode;
  labelOrder?: string[];
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  height?: number;
  width?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[] | number[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  tooltip?: string | ((_d: any) => React.ReactNode);
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  graphDownload?: boolean;
  sortData?: 'desc' | 'asc';
  dataDownload?: boolean;
  maxRadiusValue?: number;
  leftBarTitle?: string;
  rightBarTitle?: string;
  barColors?: [string, string];
  centerGap?: number;
  columnData?: DataTableColumnDataType[];
  mainText?: string;
  subNote?: string;
  radius?: number;
  strokeWidth?: number;
  showValues?: boolean;
  scaleType?: ScaleDataType;
  showColumnLabels?: boolean;
  showRowLabels?: boolean;
  noDataColor?: string;
  fillContainer?: boolean;
  numberOfBins?: number;
  donutStrokeWidth?: number;
  barGraphLayout?: 'horizontal' | 'vertical';
  graphType?: 'circlePacking' | 'treeMap' | 'barGraph' | 'donutChart';
  donutColorDomain?: string[];
  lineTitles?: [string, string];
  noOfXTicks?: number;
  dateFormat?: string;
  lineColors?: string[];
  sameAxes?: boolean;
  highlightAreaSettings?:
    | HighlightAreaSettingsDataType[]
    | HighlightAreaSettingsForScatterPlotDataType[];
  labels?: (string | number)[];
  showColorLegendAtTop?: boolean;
  highlightedLines?: (string | number)[];
  area?: boolean;
  mapData?: any;
  xColorLegendTitle?: string;
  yColorLegendTitle?: string;
  xDomain?: [number, number, number, number];
  yDomain?: [number, number, number, number];
  scale?: number;
  centerPoint?: [number, number];
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  mapBorderColor?: string;
  isWorldMap?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedIds?: string[];
  mapProperty?: string;
  showAntarctica?: boolean;
  mapStyles?: [string, string];
  center?: [number, number];
  zoomLevel?: number;
  mapStyle?: string | { style: string; name: string }[];
  barTitle?: string;
  lineTitle?: string;
  barColor?: string;
  lineColor?: string;
  showLabels?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  refXValues?: ReferenceDataType[];
  refYValues?: ReferenceDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  axisTitle?: [string, string];
  year?: number | string;
  aggregationMethod?: 'count' | 'max' | 'min' | 'average' | 'sum';
  stripType?: 'strip' | 'dot';
  language?: Languages;
  animate?: boolean | AnimateDataType;
  highlightColor?: string;
  dotOpacity?: number;
  sortParameter?: number | 'diff' | 'total';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  countOnly?: (string | number)[];
  value?: number;
  gridSize?: number;
  unitPadding?: number;
  size?: number;
  totalNoOfDots?: number;
  showStrokeForWhiteDots?: boolean;
  note?: string;
  showNAColor?: boolean;
  minHeight?: number;
  autoPlay?: boolean;
  autoSort?: boolean;
  showOnlyActiveDate?: boolean;
  showDots?: boolean;
  diffAreaColors?: [string, string];
  theme?: 'dark' | 'light';
  uiMode?: 'light' | 'normal';
  maxBarThickness?: number;
  minBarThickness?: number;
  maxNumberOfBars?: number;
  includeLayers?: string[];
  excludeLayers?: string[];
  layerSelection?: { layerID: string; name: string[] }[];
  annotations?: AnnotationSettingsDataType[];
  regressionLine?: boolean | string;
  ariaLabel?: string;
  nodePadding?: number;
  nodeWidth?: number;
  highlightedSourceDataPoints?: string[];
  highlightedTargetDataPoints?: string[];
  defaultLinkOpacity?: number;
  sourceTitle?: string;
  targetTitle?: string;
  sortNodes?: 'asc' | 'desc' | 'mostReadable' | 'none';
  sourceColors?: string[] | string;
  targetColors?: string[] | string;
  sourceColorDomain?: string[];
  targetColorDomain?: string[];
  showIntervalDots?: boolean;
  showIntervalValues?: boolean;
  intervalLineStrokeWidth?: number;
  intervalLineColors?: [string, string];
  intervalAreaColor?: string;
  cardTemplate?: string | ((_d: any) => React.ReactNode);
  cardBackgroundColor?: string;
  legendMaxWidth?: string;
  cardFilters?: {
    column: string;
    label?: string;
    defaultValue?: string | number;
    excludeValues?: (string | number)[];
    width?: string;
  }[];
  cardSortingOptions?: {
    defaultValue?: string;
    options: {
      value: string;
      label: string;
      type: 'asc' | 'desc';
    }[];
    width?: string;
  };
  cardSearchColumns?: string[];
  cardMinWidth?: number;
  textBackground?: boolean;
  headingFontSize?: string;
  centerAlign?: boolean;
  verticalAlign?: 'center' | 'top' | 'bottom';
  resetSelectionOnDoubleClick?: boolean;
  intervalAreaOpacity?: number;
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  valueColor?: string;
  labelColor?: string;
  noOfYTicks?: number;
  noOfTicks?: number;
  minDate?: string | number;
  maxDate?: string | number;
  colorLegendColors?: string[];
  colorLegendDomain?: string[];
  barAxisTitle?: string;
  barSuffix?: string;
  barPrefix?: string;
  lineSuffix?: string;
  linePrefix?: string;
  xSuffix?: string;
  xPrefix?: string;
  ySuffix?: string;
  yPrefix?: string;
  lineSuffixes?: [string, string];
  linePrefixes?: [string, string];
  allowDataDownloadOnDetail?: string | boolean;
  noOfItemsInAPage?: number;
  curveType?: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  mapProjection?: MapProjectionTypes;
  filterNA?: boolean;
  fillShape?: boolean;
  colorScaleMaxWidth?: string;
  axisLabels?: (string | number)[];
  minWidth?: string;
  zoomInteraction?: ZoomInteractionTypes;
  layout?: 'primary' | 'secondary';
  qualitativeRangeColors?: string[];
  targetStyle?: 'background' | 'line';
  targetColor?: 'string';
  measureBarWidthFactor?: number;
  mapLegend?: string | React.ReactNode | MapLegendDataType[];
  dimmedOpacity?: number;
  precision?: number;
  customLayers?: CustomLayerDataType[];
  dashedLines?: (string | number)[];
  dashSettings?: string[];
  labelsToBeHidden?: (string | number)[];
  autoRotate?: boolean;
  enableZoom?: boolean;
  globeMaterial?: any;
  atmosphereColor?: string;
  lineAxisTitle?: string;
  timeline?: TimelineDataType;
  naLabel?: string;
  globeOffset?: [number, number];
  polygonAltitude?: number;
  atmosphereAltitude?: number;
  globeCurvatureResolution?: number;
  lights?: LightConfig[];
  fogSetting?: FogDataType;
  showAxisLabels?: boolean;
  highlightedAltitude?: number;
  selectedId?: string;
  collapseColorScaleByDefault?: boolean;
  dotLegendTitle?: string;
  dotColor?: string;
  dotBorderColor?: string;
  mapColorLegendTitle?: string;
  choroplethScaleType?: Exclude<ScaleDataType, 'linear'>;
  trackColor?: string;
  zoomAndCenterByHighlightedIds?: boolean;
  hideAxisLine?: boolean;
  projectionRotate?: [number, number] | [number, number, number];
  rewindCoordinatesInMapData?: boolean;
}

export interface InfoBoxDataType {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
}

export interface SectionsDataType {
  graphSettings?: GraphSettingsDataType;
  graphDataConfiguration?: GraphConfigurationDataType[];
  infoBox: InfoBoxDataType;
}

export interface ChaptersDataType {
  dataSettings: DataSettingsDataType;
  graphSettings: GraphSettingsDataType;
  graphType: GraphType;
  graphDataConfiguration?: GraphConfigurationDataType[];
  sections: SectionsDataType[];
}

export interface PerformanceIntensiveChaptersDataType {
  dataSettings: DataSettingsDataType;
  graphSettings: GraphSettingsDataType;
  graphType: GraphType | GeoHubGraphType | ThreeDGraphType;
  graphDataConfiguration?: GraphConfigurationDataType[];
  sections: SectionsDataType[];
}

export interface SectionsArrDataType {
  chapter: number;
  section: number;
  dataSettings: DataSettingsDataType;
  graphSettings: GraphSettingsDataType;
  graphType: GraphType | GeoHubGraphType | ThreeDGraphType;
  graphDataConfiguration: GraphConfigurationDataType[];
  infoBox: InfoBoxDataType;
}
