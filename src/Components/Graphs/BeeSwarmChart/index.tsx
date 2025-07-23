import { HorizontalBeeSwarmChart } from './Horizontal';
import { VerticalBeeSwarmChart } from './Vertical';

import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  BeeSwarmChartDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
} from '@/Types';

interface Props {
  // Data
  /** Array of data objects */
  data: BeeSwarmChartDataType[];

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
  /** Color or array of colors for circle */
  colors?: string | string[];
  /** Domain of colors for the graph */
  colorDomain?: string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
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
  /** Maximum value for the radius of the circle */
  maxRadiusValue?: number;
  /** Minimum value for position of the circle */
  minPositionValue?: number;
  /** Maximum value for position of the circle */
  maxPositionValue?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** Number of ticks on the axis */
  noOfTicks?: number;

  // Graph Parameters
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showTicks?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Toggles if the ref lines and colors animates in when loaded.  */
  animate?: boolean | number;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Maximum radius of the circles  */
  radius?: number;
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

export function BeeSwarmChart(props: Props) {
  const {
    data,
    graphTitle,
    backgroundColor,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    showLabels,
    showTicks,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    radius,
    maxRadiusValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    showNAColor,
    minHeight,
    theme,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    noOfTicks,
    orientation = 'vertical',
    styles,
    classNames,
    animate,
    dimmedOpacity,
    precision,
    customLayers,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalBeeSwarmChart
        data={data}
        graphTitle={graphTitle}
        backgroundColor={backgroundColor}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        showLabels={showLabels}
        showTicks={showTicks}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        relativeHeight={relativeHeight}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        refValues={refValues}
        showColorScale={showColorScale}
        graphID={graphID}
        radius={radius}
        maxRadiusValue={maxRadiusValue}
        maxPositionValue={maxPositionValue}
        minPositionValue={minPositionValue}
        highlightedDataPoints={highlightedDataPoints}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        showNAColor={showNAColor}
        minHeight={minHeight}
        theme={theme}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        classNames={classNames}
        noOfTicks={noOfTicks}
        animate={animate}
        dimmedOpacity={dimmedOpacity}
        precision={precision}
        customLayers={customLayers}
      />
    );
  return (
    <HorizontalBeeSwarmChart
      data={data}
      graphTitle={graphTitle}
      backgroundColor={backgroundColor}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      showLabels={showLabels}
      showTicks={showTicks}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      relativeHeight={relativeHeight}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      refValues={refValues}
      showColorScale={showColorScale}
      graphID={graphID}
      radius={radius}
      maxRadiusValue={maxRadiusValue}
      maxPositionValue={maxPositionValue}
      minPositionValue={minPositionValue}
      highlightedDataPoints={highlightedDataPoints}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      showNAColor={showNAColor}
      minHeight={minHeight}
      theme={theme}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      classNames={classNames}
      noOfTicks={noOfTicks}
      animate={animate}
      dimmedOpacity={dimmedOpacity}
      precision={precision}
      customLayers={customLayers}
    />
  );
}
