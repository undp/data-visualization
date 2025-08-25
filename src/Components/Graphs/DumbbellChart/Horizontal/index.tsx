import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { cn, SliderUI } from '@undp/design-system-react';
import { ascending, sort } from 'd3-array';
import uniqBy from 'lodash.uniqby';

import { Graph } from './Graph';

import {
  DumbbellChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  ReferenceDataType,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { Pause, Play } from '@/Components/Icons';
import { ensureCompleteDataForDumbbellChart } from '@/Utils/ensureCompleteData';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string | React.ReactNode;
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  radius?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortParameter?: number | 'diff';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  language?: Languages;
  minHeight?: number;
  theme?: 'light' | 'dark';
  maxBarThickness?: number;
  maxNumberOfBars?: number;
  minBarThickness?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  axisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  labelOrder?: string[];
  refValues?: ReferenceDataType[];
  filterNA?: boolean;
  animate?: boolean | AnimateDataType;
  precision?: number;
  customLayers?: CustomLayerDataType[];
  highlightedDataPoints?: (string | number)[];
  dimmedOpacity?: number;
  timeline?: TimelineDataType;
}

export function HorizontalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 100,
    rightMargin = 40,
    topMargin = 20,
    bottomMargin = 10,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    radius = 3,
    showLabels = true,
    tooltip,
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
    labelOrder,
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    axisTitle,
    noOfTicks = 5,
    valueColor,
    styles,
    classNames,
    refValues,
    filterNA = true,
    animate = false,
    precision = 2,
    customLayers = [],
    showColorScale = true,
    highlightedDataPoints = [],
    dimmedOpacity = 0.3,
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = sort(
    uniqBy(
      data.filter(d => d.date !== undefined && d.date !== null),
      d => d.date,
    ).map(d => parse(`${d.date}`, timeline.dateFormat || 'yyyy', new Date()).getTime()),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);

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
    <div
      className={`${theme || 'light'} flex  ${width ? 'w-fit grow-0' : 'w-full grow'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={cn(
          `${
            !backgroundColor
              ? 'bg-transparent '
              : backgroundColor === true
                ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
                : ''
          }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`,
          classNames?.graphContainer,
        )}
        style={{
          ...(styles?.graphContainer || {}),
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a dumbbell chart that shows comparisons between two or more data points across categories. ${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col w-full gap-4 grow justify-between'>
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
                graphDownload={graphDownload ? graphParentDiv.current : undefined}
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
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale ? (
                    <ColorLegendWithMouseOver
                      width={width}
                      colorDomain={colorDomain}
                      colors={colors}
                      colorLegendTitle={colorLegendTitle}
                      setSelectedColor={setSelectedColor}
                      showNAColor={false}
                    />
                  ) : null}
                  <div
                    className='flex grow w-full justify-center leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={
                          sortParameter !== undefined
                            ? sortParameter === 'diff'
                              ? sortBy(
                                  ensureCompleteDataForDumbbellChart(
                                    data,
                                    timeline.dateFormat || 'yyyy',
                                  )
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
                                )
                                  .reverse()
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                              : sortBy(
                                  ensureCompleteDataForDumbbellChart(
                                    data,
                                    timeline.dateFormat || 'yyyy',
                                  )
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
                                    checkIfNullOrUndefined(d.x[sortParameter])
                                      ? -Infinity
                                      : d.x[sortParameter],
                                )
                                  .reverse()
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                            : ensureCompleteDataForDumbbellChart(
                                data,
                                timeline.dateFormat || 'yyyy',
                              )
                                .filter(d => (filterNA ? !d.x.every(item => item == null) : d))
                                .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                        }
                        dotColors={colors}
                        width={width || svgWidth}
                        height={Math.max(
                          minHeight,
                          height ||
                            (relativeHeight
                              ? minHeight
                                ? (width || svgWidth) * relativeHeight > minHeight
                                  ? (width || svgWidth) * relativeHeight
                                  : minHeight
                                : (width || svgWidth) * relativeHeight
                              : svgHeight),
                        )}
                        suffix={suffix}
                        prefix={prefix}
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
                            : Math.max(
                                  ...data.map(d => Math.max(...d.x.filter(el => el !== null))),
                                ) < 0
                              ? 0
                              : Math.max(
                                  ...data.map(d => Math.max(...d.x.filter(el => el !== null))),
                                )
                        }
                        minValue={
                          !checkIfNullOrUndefined(minValue)
                            ? (minValue as number)
                            : Math.min(
                                  ...data.map(d => Math.min(...d.x.filter(el => el !== null))),
                                ) > 0
                              ? 0
                              : Math.min(
                                  ...data.map(d => Math.min(...d.x.filter(el => el !== null))),
                                )
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
                        rtl={language === 'he' || language === 'ar'}
                        animate={
                          animate === true
                            ? { duration: 0.5, once: true, amount: 0.5 }
                            : animate || { duration: 0, once: true, amount: 0 }
                        }
                        precision={precision}
                        customLayers={customLayers}
                        highlightedDataPoints={highlightedDataPoints}
                        dimmedOpacity={dimmedOpacity}
                      />
                    ) : null}
                  </div>
                </>
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
