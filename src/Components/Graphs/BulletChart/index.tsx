import { useState, useRef, useEffect, useMemo } from 'react';
import orderBy from 'lodash.orderby';
import { parse } from 'date-fns/parse';
import { format } from 'date-fns/format';
import { SliderUI } from '@undp/design-system-react/SliderUI';

import { HorizontalGraph, VerticalGraph } from './Graph';

import {
  ReferenceDataType,
  BulletChartDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphContainer, GraphArea } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { ensureCompleteDataForBulletChart } from '@/Utils/ensureCompleteData';
import { Pause, Play } from '@/Components/Icons';

interface Props {
  // Data
  /** Array of data objects */
  data: BulletChartDataType[];

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
  /** Color for bars */
  barColor?: string;
  /** Domain of colors for the qualitative range bars */
  colorDomain?: string[];
  /** Colors for the qualitative range bars */
  qualitativeRangeColors?: string[];
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
  /** Defines the style of the target bar */
  targetStyle?: 'background' | 'line';
  /** Defines the color of the target bar */
  targetColor?: string;
  /** Defines the thickness if the target is of style line */
  targetLineThickness?: number;
  /** Defines the width of the measure bar in relation with available width */
  measureBarWidthFactor?: number;
  /** Custom order for labels */
  labelOrder?: string[];
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Defines how “NA” values should be displayed/labelled in the graph */
  naLabel?: string;
  /** Title for the bar axis */
  barAxisTitle?: string;
  /** Sorting order for data. This is overwritten by labelOrder prop. */
  sortData?: 'asc' | 'desc';
  /** Toggles if data point which are undefined or has value null are filtered out.  */
  filterNA?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Configures playback and slider controls for animating the chart over time. The data must have a key date for it to work properly. */
  timeline?: TimelineDataType;
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

export function BulletChart(props: Props) {
  const {
    data,
    graphTitle,
    barColor = Colors.primaryColors['blue-600'],
    barPadding = 0.25,
    showTicks = true,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy = 999,
    showLabels = true,
    showValues = true,
    backgroundColor = false,
    suffix = '',
    prefix = '',
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
    showColorScale = true,
    graphID,
    maxValue,
    minValue,
    highlightedDataPoints = [],
    onSeriesMouseClick,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    qualitativeRangeColors,
    targetColor = Colors.light.grays['gray-700'],
    filterNA = true,
    targetStyle = 'line',
    measureBarWidthFactor = 0.4,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    naLabel = 'NA',
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    theme = 'light',
    sortData,
    labelOrder,
    minHeight = 0,
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    targetLineThickness = 2,
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;

  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = useMemo(() => {
    const dates = [
      ...new Set(
        data
          .filter(d => d.date)
          .map(d => parse(`${d.date}`, timeline.dateFormat || 'yyyy', new Date()).getTime()),
      ),
    ];
    dates.sort((a, b) => a - b);
    return dates;
  }, [data, timeline.dateFormat]);
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth || 620);
      setSvgHeight(entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
      },
      (timeline.speed || 2) * 1000,
    );
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play, timeline.speed]);

  const markObj = getSliderMarks(
    uniqDatesSorted,
    index,
    timeline.showOnlyActiveDate,
    timeline.dateFormat || 'yyyy',
  );

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
              ? data.map(d => d.data).filter(d => d !== undefined).length > 0
                ? data.map(d => d.data).filter(d => d !== undefined)
                : data.filter(d => d !== undefined)
              : null
          }
        />
      ) : null}
      {timeline.enabled && uniqDatesSorted.length > 0 && markObj ? (
        <div className='flex gap-6 items-center' dir='ltr'>
          <button
            type='button'
            onClick={() => {
              setPlay(!play);
            }}
            className='p-0 border-0 cursor-pointer bg-transparent'
            aria-label={play ? 'Click to pause animation' : 'Click to play animation'}
          >
            {play ? <Pause /> : <Play />}
          </button>
          <SliderUI
            min={uniqDatesSorted[0]}
            max={uniqDatesSorted[uniqDatesSorted.length - 1]}
            marks={markObj}
            step={null}
            defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
            value={uniqDatesSorted[index]}
            onChangeComplete={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            onChange={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            aria-label='Time slider. Use arrow keys to adjust selected time period.'
          />
        </div>
      ) : null}
      <div className='grow flex flex-col justify-center gap-3 w-full'>
        {showColorScale &&
        data.filter(el => el.qualitativeRange).length !== 0 &&
        colorDomain &&
        data.length > 0 ? (
          <ColorLegend
            width={width}
            colorLegendTitle={colorLegendTitle}
            colors={qualitativeRangeColors || Colors[theme].sequentialColors.positiveColorsx10}
            colorDomain={colorDomain}
            showNAColor={false}
            className={classNames?.colorLegend}
          />
        ) : null}
        <GraphArea ref={graphDiv}>
          {data.length === 0 && <EmptyState />}
          {svgWidth && svgHeight && data.length > 0 ? (
            <Comp
              data={
                sortData
                  ? orderBy(
                      ensureCompleteDataForBulletChart(data, timeline.dateFormat || 'yyyy')
                        .filter(d =>
                          timeline.enabled
                            ? d.date ===
                              format(
                                new Date(uniqDatesSorted[index]),
                                timeline.dateFormat || 'yyyy',
                              )
                            : d,
                        )
                        .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d)),
                      [
                        d =>
                          d.size === undefined
                            ? sortData === 'asc'
                              ? (orientation === 'horizontal' ? 1 : -1) * Infinity
                              : (orientation === 'horizontal' ? -1 : 1) * Infinity
                            : d.size,
                      ],
                      [sortData],
                    ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                  : ensureCompleteDataForBulletChart(data, timeline.dateFormat || 'yyyy')
                      .filter(d =>
                        timeline.enabled
                          ? d.date ===
                            format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
                          : d,
                      )
                      .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d))
                      .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
              }
              barColor={barColor}
              targetColor={targetColor}
              width={svgWidth}
              refValues={refValues}
              height={svgHeight}
              suffix={suffix}
              prefix={prefix}
              barPadding={barPadding}
              showLabels={showLabels}
              showValues={showValues}
              showTicks={showTicks}
              truncateBy={truncateBy}
              leftMargin={leftMargin}
              rightMargin={rightMargin}
              qualitativeRangeColors={
                qualitativeRangeColors || Colors[theme].sequentialColors.positiveColorsx10
              }
              topMargin={topMargin}
              bottomMargin={bottomMargin}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              maxValue={maxValue}
              minValue={minValue}
              highlightedDataPoints={highlightedDataPoints}
              onSeriesMouseClick={onSeriesMouseClick}
              labelOrder={labelOrder}
              maxBarThickness={maxBarThickness}
              minBarThickness={minBarThickness}
              resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
              detailsOnClick={detailsOnClick}
              barAxisTitle={barAxisTitle}
              noOfTicks={noOfTicks}
              valueColor={valueColor}
              styles={styles}
              classNames={classNames}
              targetStyle={targetStyle}
              dimmedOpacity={dimmedOpacity}
              measureBarWidthFactor={measureBarWidthFactor}
              animate={
                animate === true
                  ? { duration: 0.5, once: true, amount: 0.5 }
                  : animate || { duration: 0, once: true, amount: 0 }
              }
              precision={precision}
              customLayers={customLayers}
              naLabel={naLabel}
              targetLineThickness={targetLineThickness}
              rtl={language === 'ar' || language === 'he'}
            />
          ) : null}
        </GraphArea>
      </div>
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
