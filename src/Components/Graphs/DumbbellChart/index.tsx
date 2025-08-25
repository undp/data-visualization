import { HorizontalDumbbellChart } from './Horizontal';
import { VerticalDumbbellChart } from './Vertical';

import {
  SourcesDataType,
  Languages,
  DumbbellChartDataType,
  StyleObject,
  ClassNameObject,
  ReferenceDataType,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';

interface Props {
  // Data
  /** Array of data objects */
  data: DumbbellChartDataType[];

  /** Orientation of the graph */
  orientation?: 'vertical' | 'horizontal';

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Array of colors for the circle */
  colors?: string[];
  /** Domain of colors for the graph */
  colorDomain: string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
  /** Color of value labels */
  valueColor?: string;
  /** Background color of the graph */
  backgroundColor?: string | boolean;
  /** Custom styles for the graph. Each object should be a valid React CSS style object. */
  styles?: StyleObject;
  /** Custom class names */
  classNames?: ClassNameObject;

  // Size and Spacing
  /** Width of the graph */
  width?: number;
  /** Height of the graph */
  height?: number;
  /** Minimum height of the graph */
  minHeight?: number;
  /** Relative height scaling factor. This overwrites the height props */
  relativeHeight?: number;
  /** Padding around the graph. Defaults to 0 if no backgroundColor is mentioned else defaults to 1rem */
  padding?: string;
  /** Left margin of the graph */
  leftMargin?: number;
  /** Right margin of the graph */
  rightMargin?: number;
  /** Top margin of the graph */
  topMargin?: number;
  /** Bottom margin of the graph */
  bottomMargin?: number;
  /** Padding between bars */
  barPadding?: number;
  /** Maximum thickness of bars */
  maxBarThickness?: number;
  /** Minimum thickness of bars */
  minBarThickness?: number;
  /** Maximum number of bars shown in the graph */
  maxNumberOfBars?: number;
  /** Radius of the dots */
  radius?: number;

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;
  /** Truncate labels by specified length */
  truncateBy?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** Number of ticks on the axis */
  noOfTicks?: number;

  // Graph Parameters
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Custom order for labels */
  labelOrder?: string[];
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle if the is a arrow head at the end of the connector */
  arrowConnector?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Stroke width of the connector */
  connectorStrokeWidth?: number;
  /** Title for the  axis */
  axisTitle?: string;
  /** Sorting order for data. If this is a number then data is sorted by value at that index x array in the data props. If this is diff then data is sorted by the difference of the last and first element in the x array in the data props. This is overwritten by labelOrder prop */
  sortParameter?: number | 'diff';
  /** Toggles if data points which have all the values as undefined or null are filtered out.  */
  filterNA?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Configures playback and slider controls for animating the chart over time. The data must have a key date for it to work properly. */
  timeline?: TimelineDataType;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function DumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    radius,
    tooltip,
    showLabels,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix,
    prefix,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    showValues,
    sortParameter,
    arrowConnector,
    connectorStrokeWidth,
    language,
    minHeight,
    theme,
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    axisTitle,
    noOfTicks,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    labelOrder,
    refValues,
    filterNA,
    animate,
    precision,
    showColorScale,
    customLayers,
    highlightedDataPoints,
    dimmedOpacity,
    timeline,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalDumbbellChart
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        barPadding={barPadding}
        showTicks={showTicks}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        truncateBy={truncateBy}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        backgroundColor={backgroundColor}
        radius={radius}
        tooltip={tooltip}
        showLabels={showLabels}
        relativeHeight={relativeHeight}
        onSeriesMouseOver={onSeriesMouseOver}
        graphID={graphID}
        suffix={suffix}
        prefix={prefix}
        maxValue={maxValue}
        minValue={minValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        showValues={showValues}
        sortParameter={sortParameter}
        arrowConnector={arrowConnector}
        connectorStrokeWidth={connectorStrokeWidth}
        language={language}
        minHeight={minHeight}
        theme={theme}
        maxBarThickness={maxBarThickness}
        maxNumberOfBars={maxNumberOfBars}
        minBarThickness={minBarThickness}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        axisTitle={axisTitle}
        noOfTicks={noOfTicks}
        labelOrder={labelOrder}
        valueColor={valueColor}
        classNames={classNames}
        refValues={refValues}
        filterNA={filterNA}
        animate={animate}
        precision={precision}
        showColorScale={showColorScale}
        customLayers={customLayers}
        highlightedDataPoints={highlightedDataPoints}
        dimmedOpacity={dimmedOpacity}
        timeline={timeline}
      />
    );
  return (
    <HorizontalDumbbellChart
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      barPadding={barPadding}
      showTicks={showTicks}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      truncateBy={truncateBy}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      backgroundColor={backgroundColor}
      radius={radius}
      tooltip={tooltip}
      showLabels={showLabels}
      relativeHeight={relativeHeight}
      onSeriesMouseOver={onSeriesMouseOver}
      graphID={graphID}
      suffix={suffix}
      prefix={prefix}
      maxValue={maxValue}
      minValue={minValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      showValues={showValues}
      sortParameter={sortParameter}
      arrowConnector={arrowConnector}
      connectorStrokeWidth={connectorStrokeWidth}
      language={language}
      minHeight={minHeight}
      theme={theme}
      maxBarThickness={maxBarThickness}
      maxNumberOfBars={maxNumberOfBars}
      minBarThickness={minBarThickness}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      axisTitle={axisTitle}
      noOfTicks={noOfTicks}
      valueColor={valueColor}
      classNames={classNames}
      labelOrder={labelOrder}
      refValues={refValues}
      filterNA={filterNA}
      animate={animate}
      precision={precision}
      showColorScale={showColorScale}
      customLayers={customLayers}
      highlightedDataPoints={highlightedDataPoints}
      dimmedOpacity={dimmedOpacity}
      timeline={timeline}
    />
  );
}
