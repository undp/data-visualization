import orderBy from 'lodash.orderby';
import { format } from 'date-fns/format';
import { useEffect, useMemo, useRef, useState } from 'react';
import { parse } from 'date-fns/parse';
import { SliderUI } from '@undp/design-system-react/SliderUI';

import { HorizontalGraph, VerticalGraph } from './Graph';

import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
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
import { ensureCompleteDataForDumbbellChart } from '@/Utils/ensureCompleteData';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Pause, Play } from '@/Components/Icons';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { Colors } from '@/Components/ColorPalette';

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
  /** Sorting order for data. This is overwritten by labelOrder prop. */
  sortData?: 'asc' | 'desc';
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
    suffix = '',
    prefix = '',
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
    precision = 2,
    showColorScale = true,
    customLayers = [],
    highlightedDataPoints = [],
    dimmedOpacity = 0.3,
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    sortData,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
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
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);

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
            data={
              sortParameter !== undefined
                ? sortParameter === 'diff'
                  ? orderBy(
                      ensureCompleteDataForDumbbellChart(data, timeline.dateFormat || 'yyyy')
                        .filter(d =>
                          timeline.enabled
                            ? d.date ===
                              format(
                                new Date(uniqDatesSorted[index]),
                                timeline.dateFormat || 'yyyy',
                              )
                            : d,
                        )
                        .filter(d => (filterNA ? !d.x.every(item => item == null) : d)),
                      d =>
                        checkIfNullOrUndefined(d.x[d.x.length - 1]) ||
                        checkIfNullOrUndefined(d.x[0])
                          ? -Infinity
                          : (d.x[d.x.length - 1] as number) - (d.x[0] as number),
                      [sortData || 'asc'],
                    ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                  : orderBy(
                      ensureCompleteDataForDumbbellChart(data, timeline.dateFormat || 'yyyy')
                        .filter(d =>
                          timeline.enabled
                            ? d.date ===
                              format(
                                new Date(uniqDatesSorted[index]),
                                timeline.dateFormat || 'yyyy',
                              )
                            : d,
                        )
                        .filter(d => (filterNA ? !d.x.every(item => item == null) : d)),
                      d =>
                        checkIfNullOrUndefined(d.x[sortParameter]) ? -Infinity : d.x[sortParameter],
                      [sortData || 'asc'],
                    ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                : ensureCompleteDataForDumbbellChart(data, timeline.dateFormat || 'yyyy')
                    .filter(d => (filterNA ? !d.x.every(item => item == null) : d))
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
            suffix={suffix}
            prefix={prefix}
            onSeriesMouseOver={onSeriesMouseOver}
            maxValue={
              !checkIfNullOrUndefined(maxValue)
                ? (maxValue as number)
                : Math.max(...data.map(d => Math.max(...d.x.filter(el => el !== null)))) < 0
                  ? 0
                  : Math.max(...data.map(d => Math.max(...d.x.filter(el => el !== null))))
            }
            minValue={
              !checkIfNullOrUndefined(minValue)
                ? (minValue as number)
                : Math.min(...data.map(d => Math.min(...d.x.filter(el => el !== null)))) > 0
                  ? 0
                  : Math.min(...data.map(d => Math.min(...d.x.filter(el => el !== null))))
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
            precision={precision}
            customLayers={customLayers}
            highlightedDataPoints={highlightedDataPoints}
            dimmedOpacity={dimmedOpacity}
            rtl={language === 'ar' || language === 'he'}
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
