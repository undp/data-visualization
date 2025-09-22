import { useState, useRef, useEffect } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { ascending, sort } from 'd3-array';
import orderBy from 'lodash.orderby';
import sum from 'lodash.sum';

import { Graph } from './Graph';

import {
  ReferenceDataType,
  GroupedBarGraphDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { ensureCompleteDataForStackedBarChart } from '@/Utils/ensureCompleteData';
import { uniqBy } from '@/Utils/uniqBy';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string | React.ReactNode;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  barPadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  showColorScale?: boolean;
  labelOrder?: string[];
  truncateBy?: number;
  sortParameter?: number | 'total';
  sortData?: 'asc' | 'desc';
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: Languages;
  minHeight?: number;
  theme?: 'light' | 'dark';
  maxBarThickness?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  filterNA?: boolean;
  animate?: boolean | AnimateDataType;
  precision?: number;
  customLayers?: CustomLayerDataType[];
  timeline?: TimelineDataType;
  naLabel?: string;
}

export function VerticalGroupedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    truncateBy = 999,
    showLabels = true,
    showValues = true,
    backgroundColor = false,
    suffix = '',
    prefix = '',
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
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    theme = 'light',
    labelOrder,
    minHeight = 0,
    maxBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    valueColor,
    styles,
    classNames,
    filterNA = true,
    showColorScale = true,
    animate = false,
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    sortParameter,
    sortData,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = sort(
    uniqBy(data, 'date', true).map(d =>
      parse(`${d}`, timeline.dateFormat || 'yyyy', new Date()).getTime(),
    ),
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
          width ? 'w-fit' : 'w-full',
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
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is a grouped bar chart. ${
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
                  <div className='w-full grow leading-0' ref={graphDiv} aria-label='Graph area'>
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={
                          sortParameter !== undefined
                            ? sortParameter === 'total'
                              ? orderBy(
                                  ensureCompleteDataForStackedBarChart(
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
                                    .filter(d =>
                                      filterNA ? !d.size.every(item => item == null) : d,
                                    ),
                                  d => sum(d.size.filter(el => !checkIfNullOrUndefined(el))),
                                  [sortData || 'asc'],
                                )
                              : orderBy(
                                  ensureCompleteDataForStackedBarChart(
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
                                    .filter(d =>
                                      filterNA ? !d.size.every(item => item == null) : d,
                                    ),
                                  d =>
                                    checkIfNullOrUndefined(d.size[sortParameter])
                                      ? -Infinity
                                      : d.size[sortParameter],
                                  [sortData || 'asc'],
                                )
                            : ensureCompleteDataForStackedBarChart(
                                data,
                                timeline.dateFormat || 'yyyy',
                              ).filter(d => (filterNA ? !d.size.every(item => item == null) : d))
                        }
                        barColors={colors}
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
                        barPadding={barPadding}
                        showLabels={showLabels}
                        showValues={showValues}
                        showTicks={showTicks}
                        truncateBy={truncateBy}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        refValues={refValues}
                        maxValue={
                          !checkIfNullOrUndefined(maxValue)
                            ? (maxValue as number)
                            : Math.max(
                                  ...data.map(d =>
                                    Math.max(
                                      ...(d.size.filter(
                                        l => !checkIfNullOrUndefined(l),
                                      ) as number[]),
                                    ),
                                  ),
                                ) < 0
                              ? 0
                              : Math.max(
                                  ...data.map(d =>
                                    Math.max(
                                      ...(d.size.filter(
                                        l => !checkIfNullOrUndefined(l),
                                      ) as number[]),
                                    ),
                                  ),
                                )
                        }
                        minValue={
                          !checkIfNullOrUndefined(minValue)
                            ? (minValue as number)
                            : Math.min(
                                  ...data.map(d =>
                                    Math.min(
                                      ...(d.size.filter(
                                        l => !checkIfNullOrUndefined(l),
                                      ) as number[]),
                                    ),
                                  ),
                                ) >= 0
                              ? 0
                              : Math.min(
                                  ...data.map(d =>
                                    Math.min(
                                      ...(d.size.filter(
                                        l => !checkIfNullOrUndefined(l),
                                      ) as number[]),
                                    ),
                                  ),
                                )
                        }
                        onSeriesMouseClick={onSeriesMouseClick}
                        selectedColor={selectedColor}
                        labelOrder={labelOrder}
                        maxBarThickness={maxBarThickness}
                        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                        detailsOnClick={detailsOnClick}
                        barAxisTitle={barAxisTitle}
                        noOfTicks={noOfTicks}
                        valueColor={valueColor}
                        styles={styles}
                        classNames={classNames}
                        animate={
                          animate === true
                            ? { duration: 0.5, once: true, amount: 0.5 }
                            : animate || { duration: 0, once: true, amount: 0 }
                        }
                        colorDomain={colorDomain}
                        precision={precision}
                        customLayers={customLayers}
                        naLabel={naLabel}
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
