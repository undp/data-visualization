import { HorizontalBarGraph } from './Horizontal/BarGraph/Simple';
import { HorizontalGroupedBarGraph } from './Horizontal/GroupedBarGraph/Simple';
import { HorizontalStackedBarGraph } from './Horizontal/StackedBarGraph/Simple';
import { VerticalBarGraph } from './Vertical/BarGraph/Simple';
import { VerticalGroupedBarGraph } from './Vertical/GroupedBarGraph/Simple';
import { VerticalStackedBarGraph } from './Vertical/StackedBarGraph/Simple';

import {
  ReferenceDataType,
  BarGraphDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  GroupedBarGraphDataType,
  CustomLayerDataType,
  AnimateDataType,
} from '@/Types';

interface Props {
  // Data
  /** Array of data objects */
  data: BarGraphDataType[];

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
  /** Color or array of colors for bars */
  colors?: string | string[];
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
  /** Padding between bars */
  barPadding?: number;
  /** Maximum thickness of bars */
  maxBarThickness?: number;
  /** Minimum thickness of bars */
  minBarThickness?: number;
  /** Maximum number of bars shown in the graph */
  maxNumberOfBars?: number;

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
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Title for the bar axis */
  barAxisTitle?: string;
  /** Sorting order for data. This is overwritten by labelOrder prop. */
  sortData?: 'asc' | 'desc';
  /** Toggles if data point which are undefined or has value null are filtered out.  */
  filterNA?: boolean;
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

export function SimpleBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    showLabels,
    showValues,
    backgroundColor,
    suffix,
    prefix,
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
    maxValue,
    minValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    theme,
    sortData,
    labelOrder,
    showNAColor,
    minHeight,
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    filterNA,
    animate,
    dimmedOpacity,
    precision,
    customLayers,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalBarGraph
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        barPadding={barPadding}
        showTicks={showTicks}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        truncateBy={truncateBy}
        showLabels={showLabels}
        showValues={showValues}
        backgroundColor={backgroundColor}
        suffix={suffix}
        prefix={prefix}
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
        maxValue={maxValue}
        minValue={minValue}
        highlightedDataPoints={highlightedDataPoints}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        theme={theme}
        sortData={sortData}
        labelOrder={labelOrder}
        showNAColor={showNAColor}
        minHeight={minHeight}
        maxBarThickness={maxBarThickness}
        maxNumberOfBars={maxNumberOfBars}
        minBarThickness={minBarThickness}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        barAxisTitle={barAxisTitle}
        noOfTicks={noOfTicks}
        valueColor={valueColor}
        classNames={classNames}
        filterNA={filterNA}
        animate={animate}
        dimmedOpacity={dimmedOpacity}
        precision={precision}
        customLayers={customLayers}
      />
    );
  return (
    <HorizontalBarGraph
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      barPadding={barPadding}
      showTicks={showTicks}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      truncateBy={truncateBy}
      showLabels={showLabels}
      showValues={showValues}
      backgroundColor={backgroundColor}
      suffix={suffix}
      prefix={prefix}
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
      maxValue={maxValue}
      minValue={minValue}
      highlightedDataPoints={highlightedDataPoints}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      theme={theme}
      sortData={sortData}
      labelOrder={labelOrder}
      showNAColor={showNAColor}
      minHeight={minHeight}
      maxBarThickness={maxBarThickness}
      maxNumberOfBars={maxNumberOfBars}
      minBarThickness={minBarThickness}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      barAxisTitle={barAxisTitle}
      noOfTicks={noOfTicks}
      valueColor={valueColor}
      classNames={classNames}
      filterNA={filterNA}
      dimmedOpacity={dimmedOpacity}
      precision={precision}
      customLayers={customLayers}
    />
  );
}

interface GroupedBarChartProps {
  // Data
  /** Array of data objects */
  data: GroupedBarGraphDataType[];

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
  /** Array of colors for different bars in the group */
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
  /** Toggles if data points which have all the values as undefined or null are filtered out.  */
  filterNA?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
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
  /** Title for the bar axis */
  barAxisTitle?: string;
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

export function GroupedBarGraph(props: GroupedBarChartProps) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    barPadding,
    showTicks,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    suffix,
    prefix,
    showValues,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    labelOrder,
    minHeight,
    theme,
    maxBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    filterNA,
    animate,
    precision,
    customLayers,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalGroupedBarGraph
        data={data}
        graphTitle={graphTitle}
        colors={colors}
        sources={sources}
        graphDescription={graphDescription}
        barPadding={barPadding}
        showTicks={showTicks}
        truncateBy={truncateBy}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        suffix={suffix}
        prefix={prefix}
        showValues={showValues}
        padding={padding}
        backgroundColor={backgroundColor}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        showLabels={showLabels}
        relativeHeight={relativeHeight}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        refValues={refValues}
        graphID={graphID}
        maxValue={maxValue}
        minValue={minValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        labelOrder={labelOrder}
        minHeight={minHeight}
        theme={theme}
        maxBarThickness={maxBarThickness}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        barAxisTitle={barAxisTitle}
        noOfTicks={noOfTicks}
        valueColor={valueColor}
        classNames={classNames}
        filterNA={filterNA}
        animate={animate}
        precision={precision}
        customLayers={customLayers}
      />
    );
  return (
    <HorizontalGroupedBarGraph
      data={data}
      graphTitle={graphTitle}
      colors={colors}
      sources={sources}
      graphDescription={graphDescription}
      barPadding={barPadding}
      showTicks={showTicks}
      truncateBy={truncateBy}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      suffix={suffix}
      prefix={prefix}
      showValues={showValues}
      padding={padding}
      backgroundColor={backgroundColor}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      showLabels={showLabels}
      relativeHeight={relativeHeight}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      refValues={refValues}
      graphID={graphID}
      maxValue={maxValue}
      minValue={minValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      labelOrder={labelOrder}
      minHeight={minHeight}
      theme={theme}
      maxBarThickness={maxBarThickness}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      barAxisTitle={barAxisTitle}
      noOfTicks={noOfTicks}
      valueColor={valueColor}
      classNames={classNames}
      filterNA={filterNA}
      animate={animate}
      precision={precision}
      customLayers={customLayers}
    />
  );
}

interface StackedBarChartProps {
  // Data
  /** Array of data objects */
  data: GroupedBarGraphDataType[];

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
  /** Array of colors for different bars in the group */
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

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
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
  /** Title for the bar axis */
  barAxisTitle?: string;
  /** Parameter to sort the data. If a number is provided, it refers to the index of the size array to determine which value to sort by. If set to total, it sorts by the sum of all the values. */
  sortParameter?: number | 'total';
  /** Toggles if data points which have all the values as undefined or null are filtered out.  */
  filterNA?: boolean;
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

export function StackedBarGraph(props: StackedBarChartProps) {
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
    showLabels,
    showValues,
    backgroundColor,
    suffix,
    prefix,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    tooltip,
    onSeriesMouseOver,
    relativeHeight,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    language,
    theme,
    labelOrder,
    minHeight,
    maxBarThickness,
    sortParameter,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    filterNA,
    animate,
    precision,
    customLayers,
  } = props;

  if (orientation === 'vertical')
    return (
      <VerticalStackedBarGraph
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
        showLabels={showLabels}
        showValues={showValues}
        backgroundColor={backgroundColor}
        suffix={suffix}
        prefix={prefix}
        height={height}
        width={width}
        footNote={footNote}
        colorDomain={colorDomain}
        colorLegendTitle={colorLegendTitle}
        padding={padding}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        relativeHeight={relativeHeight}
        refValues={refValues}
        graphID={graphID}
        maxValue={maxValue}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        language={language}
        theme={theme}
        labelOrder={labelOrder}
        minHeight={minHeight}
        maxBarThickness={maxBarThickness}
        sortParameter={sortParameter}
        maxNumberOfBars={maxNumberOfBars}
        minBarThickness={minBarThickness}
        ariaLabel={ariaLabel}
        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
        styles={styles}
        detailsOnClick={detailsOnClick}
        barAxisTitle={barAxisTitle}
        noOfTicks={noOfTicks}
        valueColor={valueColor}
        classNames={classNames}
        filterNA={filterNA}
        animate={animate}
        precision={precision}
        customLayers={customLayers}
      />
    );
  return (
    <HorizontalStackedBarGraph
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
      showLabels={showLabels}
      showValues={showValues}
      backgroundColor={backgroundColor}
      suffix={suffix}
      prefix={prefix}
      height={height}
      width={width}
      footNote={footNote}
      colorDomain={colorDomain}
      colorLegendTitle={colorLegendTitle}
      padding={padding}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      relativeHeight={relativeHeight}
      refValues={refValues}
      graphID={graphID}
      maxValue={maxValue}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      language={language}
      theme={theme}
      labelOrder={labelOrder}
      minHeight={minHeight}
      maxBarThickness={maxBarThickness}
      sortParameter={sortParameter}
      maxNumberOfBars={maxNumberOfBars}
      minBarThickness={minBarThickness}
      ariaLabel={ariaLabel}
      resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
      styles={styles}
      detailsOnClick={detailsOnClick}
      barAxisTitle={barAxisTitle}
      noOfTicks={noOfTicks}
      valueColor={valueColor}
      classNames={classNames}
      filterNA={filterNA}
      animate={animate}
      precision={precision}
      customLayers={customLayers}
    />
  );
}
