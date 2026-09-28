import { useRef } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Timeline } from '@/Components/Elements/Timeline';
import { useElementSize } from '@/hooks/useElementSize';
import { useTimeline } from '@/hooks/useTimeline';
import type {
  AnimateDataType,
  ButterflyChartDataType,
  ClassNameObject,
  CustomLayerDataType,
  Languages,
  NumberFormatOptions,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  TimelineDataType,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForButterFlyChart } from '@/Utils/ensureCompleteData';
import { Graph } from './Graph';

function getMinMax(
  data: ButterflyChartDataType[],
  key: 'leftBar' | 'rightBar',
  minValue?: number | null,
  maxValue?: number | null,
) {
  const values = data.map((d) => d[key]).filter((v) => !checkIfNullOrUndefined(v)) as number[];

  const min = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...values) >= 0
      ? 0
      : Math.min(...values);

  const max = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...values) < 0
      ? 0
      : Math.max(...values);

  return { min, max };
}

interface Props {
  // Data
  /** Array of data objects */
  data: ButterflyChartDataType[];

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
  /** Color for the left and right bars */
  barColors?: [string, string];
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
  /** Padding between bars */
  barPadding?: number;
  /** Spacing between the left and right bars */
  centerGap?: number;

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
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of axis line for the  main axis */
  hideAxisLine?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Title for the left bars */
  leftBarTitle?: string;
  /** Title for the right bars */
  rightBarTitle?: string;
  /** Defines how “NA” values should be displayed/labelled in the graph */
  naLabel?: string;
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

export function ButterflyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    padding,
    barColors = [
      Colors.light.categoricalColors.colors[0],
      Colors.light.categoricalColors.colors[1],
    ],
    backgroundColor = false,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 25,
    bottomMargin = 30,
    rightBarTitle = 'Right bar graph',
    leftBarTitle = 'Left bar graph',
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    barPadding = 0.25,
    truncateBy = 999,
    onSeriesMouseClick,
    centerGap = 100,
    showValues = true,
    maxValue,
    minValue,
    refValues = [],
    showTicks = true,
    showColorScale = false,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    colorLegendTitle,
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks = 5,
    animate = false,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    hideAxisLine = false,
    numberDisplayOptions,
  } = props;

  const { graphDiv, svgWidth, svgHeight } = useElementSize<HTMLDivElement>();
  const { uniqDatesSorted, index, setIndex, play, setPlay, markObj, activeDate, dateFormat } =
    useTimeline(data, timeline);
  const graphParentDiv = useRef<HTMLDivElement>(null);
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
        <ColorLegend
          colorLegendTitle={colorLegendTitle}
          colorDomain={[leftBarTitle, rightBarTitle]}
          colors={barColors}
          showNAColor={false}
          className={classNames?.colorLegend}
        />
      ) : null}
      <GraphArea ref={graphDiv}>
        {data.length === 0 && <EmptyState />}
        {svgWidth && svgHeight && data.length > 0 ? (
          <Graph
            hideAxisLine={hideAxisLine}
            data={ensureCompleteDataForButterFlyChart(data, dateFormat).filter((d) =>
              timeline.enabled ? `${d.date}` === activeDate : d,
            )}
            barColors={barColors}
            width={svgWidth}
            centerGap={centerGap}
            height={svgHeight}
            truncateBy={truncateBy}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            axisTitles={[leftBarTitle, rightBarTitle]}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            barPadding={barPadding}
            refValues={refValues}
            maxValue={Math.max(
              getMinMax(data, 'leftBar', minValue, maxValue).max,
              getMinMax(data, 'rightBar', minValue, maxValue).max,
            )}
            minValue={Math.min(
              getMinMax(data, 'leftBar', minValue, maxValue).min,
              getMinMax(data, 'rightBar', minValue, maxValue).min,
            )}
            minValueLeftBar={getMinMax(data, 'leftBar', minValue, maxValue).min}
            minValueRightBar={getMinMax(data, 'rightBar', minValue, maxValue).min}
            showValues={showValues}
            onSeriesMouseClick={onSeriesMouseClick}
            showTicks={showTicks}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            detailsOnClick={detailsOnClick}
            styles={styles}
            classNames={classNames}
            noOfTicks={noOfTicks}
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            customLayers={customLayers}
            naLabel={naLabel}
            locale={numberDisplayOptions?.locale || 'en'}
            padZeros={numberDisplayOptions?.padZeros || 'none'}
            suffix={numberDisplayOptions?.suffix || ''}
            prefix={numberDisplayOptions?.prefix || ''}
            precision={numberDisplayOptions?.precision ?? 2}
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
