import { useState, useEffect } from 'react';
import { bin } from 'd3-array';
import { Spinner } from '@undp/design-system-react';

import { CirclePackingGraph } from '../CirclePackingGraph';
import { TreeMapGraph } from '../TreeMapGraph';
import { DonutChart } from '../DonutChart';
import { SimpleBarGraph } from '../BarGraph';

import { Colors } from '@/Components/ColorPalette';
import {
  TreeMapDataType,
  ReferenceDataType,
  HistogramDataType,
  DonutChartDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
} from '@/Types';

interface Props {
  // Data
  /** Array of data objects */
  data: HistogramDataType[];

  /** Type of the graph for histogram */
  graphType?: 'circlePacking' | 'treeMap' | 'barGraph' | 'donutChart';

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
  /** Colors for visualization */
  colors?: string[] | string;
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
  /** Maximum value for the chart */
  maxValue?: number;
  /** Truncate labels by specified length */
  truncateBy?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];

  // Graph Parameters
  /** Number of bins for the histogram */
  numberOfBins?: number;
  /** Orientation of the bar graph. Only applicable if graphType is barGraph. */
  barGraphLayout?: 'vertical' | 'horizontal';
  /** Stroke width of the arcs and circle of the donut. Only applicable if graphType is donutChart.  */
  donutStrokeWidth?: number;
  /** Sorting order for data. This is overwritten by labelOrder prop */
  sortData?: 'asc' | 'desc';
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;

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

export function Histogram(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    rightMargin,
    height,
    width,
    footNote,
    colors,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    showLabels,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    numberOfBins,
    truncateBy,
    graphType,
    barGraphLayout,
    donutStrokeWidth,
    sortData,
    language,
    minHeight,
    theme = 'light',
    maxBarThickness,
    ariaLabel,
    detailsOnClick,
    styles,
    classNames,
    precision,
  } = props;

  const [dataFormatted, setDataFormatted] = useState<TreeMapDataType[]>([]);
  useEffect(() => {
    const bins = bin()
      .thresholds(numberOfBins || 10)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .value((d: any) => d.value)(data as any);
    const dataUpdates = bins.map(d => ({
      label: `${d.x0}-${d.x1}`,
      size: d.length,
      data: {
        options: `${d.x0}-${d.x1}`,
        frequency: d.length,
      },
    }));
    setDataFormatted(dataUpdates);
  }, [data, numberOfBins]);
  if (dataFormatted.length === 0)
    return (
      <div style={{ width: `${width}px`, height: `${height}px`, margin: 'auto' }}>
        <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
          <Spinner />
        </div>
      </div>
    );
  if (graphType === 'circlePacking')
    return (
      <CirclePackingGraph
        colors={colors || Colors.graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        width={width}
        height={height}
        sources={sources}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabels={showLabels}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValues={showValues}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        language={language}
        minHeight={minHeight}
        theme={theme}
        ariaLabel={ariaLabel}
        detailsOnClick={detailsOnClick}
        styles={styles}
        classNames={classNames}
        precision={precision}
      />
    );
  if (graphType === 'treeMap')
    return (
      <TreeMapGraph
        colors={colors || Colors.graphMainColor}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        width={width}
        height={height}
        sources={sources}
        leftMargin={leftMargin}
        rightMargin={rightMargin}
        backgroundColor={backgroundColor}
        padding={padding}
        topMargin={topMargin}
        bottomMargin={bottomMargin}
        relativeHeight={relativeHeight}
        showLabels={showLabels}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        showColorScale={false}
        showValues={showValues}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted}
        language={language}
        minHeight={minHeight}
        theme={theme}
        ariaLabel={ariaLabel}
        detailsOnClick={detailsOnClick}
        styles={styles}
        classNames={classNames}
        precision={precision}
      />
    );
  if (graphType === 'donutChart')
    return (
      <DonutChart
        colors={(colors as string[] | undefined) || Colors[theme].categoricalColors.colors}
        graphTitle={graphTitle}
        graphDescription={graphDescription}
        footNote={footNote}
        radius={width && height ? (width < height ? width : height) : width || height || undefined}
        sources={sources}
        backgroundColor={backgroundColor}
        padding={padding}
        tooltip={tooltip}
        onSeriesMouseOver={onSeriesMouseOver}
        graphID={graphID}
        onSeriesMouseClick={onSeriesMouseClick}
        graphDownload={graphDownload}
        dataDownload={dataDownload}
        data={dataFormatted as DonutChartDataType[]}
        strokeWidth={donutStrokeWidth}
        showColorScale
        sortData={sortData}
        language={language}
        theme={theme}
        ariaLabel={ariaLabel}
        detailsOnClick={detailsOnClick}
        styles={styles}
        classNames={classNames}
        precision={precision}
      />
    );
  return (
    <SimpleBarGraph
      colors={colors || Colors.graphMainColor}
      graphTitle={graphTitle}
      graphDescription={graphDescription}
      footNote={footNote}
      width={width}
      height={height}
      sources={sources}
      leftMargin={leftMargin}
      rightMargin={rightMargin}
      backgroundColor={backgroundColor}
      padding={padding}
      topMargin={topMargin}
      bottomMargin={bottomMargin}
      relativeHeight={relativeHeight}
      showLabels={showLabels}
      tooltip={tooltip}
      onSeriesMouseOver={onSeriesMouseOver}
      showColorScale={false}
      showValues={showValues}
      graphID={graphID}
      onSeriesMouseClick={onSeriesMouseClick}
      graphDownload={graphDownload}
      dataDownload={dataDownload}
      data={dataFormatted}
      barPadding={barPadding}
      refValues={refValues}
      truncateBy={truncateBy}
      maxValue={maxValue}
      showTicks={showTicks}
      sortData={sortData}
      language={language}
      minHeight={minHeight}
      theme={theme}
      maxBarThickness={maxBarThickness}
      ariaLabel={ariaLabel}
      orientation={barGraphLayout}
      detailsOnClick={detailsOnClick}
      styles={styles}
      classNames={classNames}
      precision={precision}
    />
  );
}
