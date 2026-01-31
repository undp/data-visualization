import { useState, useRef, useEffect, useMemo } from 'react';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';

import { Graph } from './Graph';

import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import {
  ButterflyChartDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForButterFlyChart } from '@/Utils/ensureCompleteData';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

function getMinMax(
  data: ButterflyChartDataType[],
  key: 'leftBar' | 'rightBar',
  minValue?: number | null,
  maxValue?: number | null,
) {
  const values = data.map(d => d[key]).filter(v => !checkIfNullOrUndefined(v)) as number[];

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
    suffix = '',
    prefix = '',
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
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    hideAxisLine = false,
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
            data={ensureCompleteDataForButterFlyChart(data, timeline.dateFormat || 'yyyy').filter(
              d =>
                timeline.enabled
                  ? d.date ===
                    format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
                  : d,
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
            suffix={suffix}
            prefix={prefix}
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
            precision={precision}
            customLayers={customLayers}
            naLabel={naLabel}
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
