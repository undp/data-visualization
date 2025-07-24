import { HorizontalStripChart } from './Horizontal';
import { VerticalStripChart } from './Vertical';

import {
  SourcesDataType,
  Languages,
  StripChartDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
} from '@/Types';

interface Props {
  // Data
  /** Array of data objects */
  data: StripChartDataType[];

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
  /** Color or array of colors for circles */
  colors?: string | string[];
  /** Color of the highlighted data points */
  highlightColor?: string;
  /** Domain of colors for the graph */
  colorDomain?: string[];
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

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;

  // Graph Parameters
  /** Number of ticks on the axis */
  noOfTicks?: number;
  /** Radius of the dots or width of the strips */
  radius?: number;
  /** Opacity of each dot or strip */
  dotOpacity?: number;
  /** Type of strip */
  stripType?: 'strip' | 'dot';
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
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

export function StripChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorScale,
    highlightedDataPoints,
    graphID,
    minValue,
    maxValue,
    onSeriesMouseClick,
    noOfTicks,
    graphDownload,
    dataDownload,
    prefix,
    suffix,
    stripType,
    language,
    highlightColor,
    dotOpacity,
    showNAColor,
    minHeight,
    theme,
    ariaLabel,
    valueColor,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    orientation = 'vertical',
    styles,
    classNames,
    animate,
    dimmedOpacity = 0.3,
    precision,
    customLayers,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalStripChart
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        radius={radius}
        padding={padding}
        backgroundColor={backgroundColor}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        tooltip={tooltip}
        relativeHeight={relativeHeight}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={showColorScale}
        highlightedDataPoints={highlightedDataPoints}
        graphID={graphID}
        minValue={minValue}
        maxValue={maxValue}
        onSeriesMouseClick={onSeriesMouseClick}
        noOfTicks={noOfTicks}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        prefix={prefix}
        suffix={suffix}
        stripType={stripType}
        language={language}
        highlightColor={highlightColor}
        dotOpacity={dotOpacity}
        showNAColor={showNAColor}
        minHeight={minHeight}
        theme={theme}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        valueColor={valueColor}
        detailsOnClick={detailsOnClick}
        classNames={classNames}
        animate={animate}
        dimmedOpacity={dimmedOpacity}
        precision={precision}
        customLayers={customLayers}
      />
    );
  return (
    <HorizontalStripChart
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      radius={radius}
      padding={padding}
      backgroundColor={backgroundColor}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      tooltip={tooltip}
      relativeHeight={relativeHeight}
      onSeriesMouseOver={onSeriesMouseOver}
      showColorScale={showColorScale}
      highlightedDataPoints={highlightedDataPoints}
      graphID={graphID}
      minValue={minValue}
      maxValue={maxValue}
      onSeriesMouseClick={onSeriesMouseClick}
      noOfTicks={noOfTicks}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      prefix={prefix}
      suffix={suffix}
      stripType={stripType}
      language={language}
      highlightColor={highlightColor}
      dotOpacity={dotOpacity}
      showNAColor={showNAColor}
      minHeight={minHeight}
      theme={theme}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      valueColor={valueColor}
      detailsOnClick={detailsOnClick}
      classNames={classNames}
      animate={animate}
      dimmedOpacity={dimmedOpacity}
      precision={precision}
      customLayers={customLayers}
    />
  );
}
