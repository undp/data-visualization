import orderBy from 'lodash.orderby';
import { useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Timeline } from '@/Components/Elements/Timeline';
import { useElementSize } from '@/hooks/useElementSize';
import { useTimeline } from '@/hooks/useTimeline';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  DumbbellChartDataType,
  Languages,
  NumberFormatOptions,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  TimelineDataType,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForDumbbellChart } from '@/Utils/ensureCompleteData';
import { HorizontalGraph, VerticalGraph } from './Graph';

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
  labelOrder?: (string | number)[];
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of axis line for the  main axis. Only applicable to vertical charts. */
  hideAxisLine?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle if the is a arrow head at the end of the connector */
  arrowConnector?: boolean;
  /** Toggle if the labels are repositioned to avoid overlapping. Only applicable to horizontal dumbbell charts. */
  repositionOverlappingLabels?: boolean;
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
  /** Sorting order for data. This is overwritten by labelOrder prop. */
  sortData?: 'asc' | 'desc';
  /** Toggles if data points which have all the values as undefined or null are filtered out.  */
  filterNA?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Configuration options for controlling number formatting, localization, prefixes/suffixes, precision, and zero padding. */
  numberDisplayOptions?: NumberFormatOptions;
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = true,
    radius = 3,
    tooltip,
    showLabels = true,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    showValues = true,
    sortParameter,
    arrowConnector = false,
    connectorStrokeWidth = 2,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    axisTitle,
    noOfTicks = 5,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    labelOrder,
    refValues,
    filterNA = true,
    animate = false,
    showColorScale = true,
    customLayers = [],
    highlightedDataPoints,
    dimmedOpacity = 0.3,
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    sortData,
    hideAxisLine = false,
    numberDisplayOptions,
    repositionOverlappingLabels = false,
  } = props;

  const { graphDiv, svgWidth, svgHeight } = useElementSize<HTMLDivElement>();
  const { uniqDatesSorted, index, setIndex, play, setPlay, markObj, activeDate, dateFormat } =
    useTimeline(data, timeline);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;
  return (
    <GraphContainer
      className={classNames?.graphContainer}
      style={styles?.graphContainer}
      id={graphID}
      ref={graphParentDiv}
      aria-label={ariaLabel}
      backgroundColor={backgroundColor}
      theme={theme}
      language={language}
      minHeight={minHeight}
      width={width}
      height={height}
      relativeHeight={relativeHeight}
      padding={padding}
    >
      {graphTitle || graphDescription || graphDownload || dataDownload ? (
        <GraphHeader
          styles={{
            title: styles?.title,
            description: styles?.description,
          }}
          classNames={{
            title: classNames?.title,
            description: classNames?.description,
          }}
          graphTitle={graphTitle}
          graphDescription={graphDescription}
          width={width}
          graphDownload={graphDownload ? graphParentDiv : undefined}
          dataDownload={
            dataDownload
              ? data.map((d) => d.data).filter((d) => d !== undefined).length > 0
                ? data.map((d) => d.data).filter((d) => d !== undefined)
                : data.filter((d) => d !== undefined)
              : null
          }
        />
      ) : null}
      {timeline.enabled && uniqDatesSorted.length > 0 && markObj ? (
        <Timeline
          play={play}
          setPlay={setPlay}
          uniqDatesSorted={uniqDatesSorted}
          markObj={markObj}
          index={index}
          setIndex={setIndex}
          color={timeline.color}
        />
      ) : null}
      {showColorScale && data.length > 0 ? (
        <ColorLegendWithMouseOver
          width={width}
          colorDomain={colorDomain}
          colors={colors}
          colorLegendTitle={colorLegendTitle}
          setSelectedColor={setSelectedColor}
          showNAColor={false}
          className={classNames?.colorLegend}
        />
      ) : null}
      <GraphArea ref={graphDiv}>
        {data.length === 0 && <EmptyState />}
        {svgWidth && svgHeight && data.length > 0 ? (
          <Comp
            hideAxisLine={hideAxisLine}
            data={
              sortParameter !== undefined
                ? sortParameter === 'diff'
                  ? orderBy(
                      ensureCompleteDataForDumbbellChart(data, dateFormat)
                        .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                        .filter((d) => (filterNA ? !d.x.every((item) => item == null) : d)),
                      (d) =>
                        checkIfNullOrUndefined(d.x[d.x.length - 1]) ||
                        checkIfNullOrUndefined(d.x[0])
                          ? -Infinity
                          : (d.x[d.x.length - 1] as number) - (d.x[0] as number),
                      [sortData || 'asc'],
                    ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                  : orderBy(
                      ensureCompleteDataForDumbbellChart(data, dateFormat)
                        .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                        .filter((d) => (filterNA ? !d.x.every((item) => item == null) : d)),
                      (d) =>
                        checkIfNullOrUndefined(d.x[sortParameter]) ? -Infinity : d.x[sortParameter],
                      [sortData || 'asc'],
                    ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                : ensureCompleteDataForDumbbellChart(data, dateFormat)
                    .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                    .filter((d) => (filterNA ? !d.x.every((item) => item == null) : d))
                    .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
            }
            dotColors={colors}
            width={svgWidth}
            height={svgHeight}
            radius={radius}
            barPadding={barPadding}
            showTicks={showTicks}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            truncateBy={truncateBy}
            showLabels={showLabels}
            showValues={showValues}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            maxValue={
              !checkIfNullOrUndefined(maxValue)
                ? (maxValue as number)
                : Math.max(...data.map((d) => Math.max(...d.x.filter((el) => el !== null)))) < 0
                  ? 0
                  : Math.max(...data.map((d) => Math.max(...d.x.filter((el) => el !== null))))
            }
            minValue={
              !checkIfNullOrUndefined(minValue)
                ? (minValue as number)
                : Math.min(...data.map((d) => Math.min(...d.x.filter((el) => el !== null)))) > 0
                  ? 0
                  : Math.min(...data.map((d) => Math.min(...d.x.filter((el) => el !== null))))
            }
            onSeriesMouseClick={onSeriesMouseClick}
            selectedColor={selectedColor}
            arrowConnector={arrowConnector}
            connectorStrokeWidth={connectorStrokeWidth}
            maxBarThickness={maxBarThickness}
            minBarThickness={minBarThickness}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            detailsOnClick={detailsOnClick}
            axisTitle={axisTitle}
            noOfTicks={noOfTicks}
            valueColor={valueColor}
            styles={styles}
            classNames={classNames}
            labelOrder={labelOrder}
            refValues={refValues}
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            customLayers={customLayers}
            highlightedDataPoints={highlightedDataPoints}
            dimmedOpacity={dimmedOpacity}
            rtl={language === 'ar' || language === 'he'}
            locale={numberDisplayOptions?.locale || 'en'}
            padZeros={numberDisplayOptions?.padZeros || 'none'}
            suffix={numberDisplayOptions?.suffix || ''}
            prefix={numberDisplayOptions?.prefix || ''}
            precision={numberDisplayOptions?.precision ?? 2}
            repositionOverlappingLabels={repositionOverlappingLabels}
          />
        ) : null}
      </GraphArea>
      {sources || footNote ? (
        <GraphFooter
          styles={{ footnote: styles?.footnote, source: styles?.source }}
          classNames={{
            footnote: classNames?.footnote,
            source: classNames?.source,
          }}
          sources={sources}
          footNote={footNote}
          width={width}
        />
      ) : null}
    </GraphContainer>
  );
}
