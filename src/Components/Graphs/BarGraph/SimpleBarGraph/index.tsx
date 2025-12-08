import { useState, useRef, useEffect, useMemo } from 'react';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import orderBy from 'lodash.orderby';

import { HorizontalGraph, VerticalGraph } from './Graph';

import {
  BarGraphDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { ensureCompleteDataForBarChart } from '@/Utils/ensureCompleteData';
import { uniqBy } from '@/Utils/uniqBy';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  data: BarGraphDataType[];
  colors?: string | string[];
  labelOrder?: string[];
  graphTitle?: string | React.ReactNode;
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  width?: number;
  height?: number;
  minHeight?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  dimmedOpacity?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortData?: 'asc' | 'desc';
  language?: Languages;
  showNAColor?: boolean;
  theme?: 'light' | 'dark';
  maxBarThickness?: number;
  maxNumberOfBars?: number;
  minBarThickness?: number;
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
  orientation?: 'horizontal' | 'vertical';
}

export function SimpleBarGraphEl(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    barPadding = 0.25,
    showValues = true,
    showTicks = true,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    highlightedDataPoints = [],
    padding,
    backgroundColor = false,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    showLabels = true,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale = true,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    sortData,
    labelOrder,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    theme = 'light',
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    valueColor,
    styles,
    classNames,
    filterNA = true,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    orientation = 'vertical',
  } = props;
  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = useMemo(() => {
    const dates = [
      ...new Set(data.map(d => parse(`${d}`, timeline.dateFormat || 'yyyy', new Date()).getTime())),
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
        <div className='flex gap-6 items-center pb-4' dir='ltr'>
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
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {showColorScale && data.filter(el => el.color).length !== 0 ? (
            <ColorLegendWithMouseOver
              width={width}
              colorLegendTitle={colorLegendTitle}
              colors={(colors as string[] | undefined) || Colors[theme].categoricalColors.colors}
              colorDomain={colorDomain || (uniqBy(data, 'color', true) as (string | number)[])}
              setSelectedColor={setSelectedColor}
              showNAColor={showNAColor}
              className={classNames?.colorLegend}
            />
          ) : null}
          <GraphArea ref={graphDiv}>
            {svgWidth && svgHeight ? (
              <Comp
                data={
                  sortData
                    ? orderBy(
                        ensureCompleteDataForBarChart(data, timeline.dateFormat || 'yyyy')
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
                    : ensureCompleteDataForBarChart(data, timeline.dateFormat || 'yyyy')
                        .filter(d =>
                          timeline.enabled
                            ? d.date ===
                              format(
                                new Date(uniqDatesSorted[index]),
                                timeline.dateFormat || 'yyyy',
                              )
                            : d,
                        )
                        .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d))
                        .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                }
                barColor={
                  data.filter(el => el.color).length === 0
                    ? colors
                      ? [colors as string]
                      : [Colors.primaryColors['blue-600']]
                    : (colors as string[] | undefined) || Colors[theme].categoricalColors.colors
                }
                colorDomain={
                  data.filter(el => el.color).length === 0
                    ? []
                    : colorDomain || (uniqBy(data, 'color', true) as string[])
                }
                selectedColor={selectedColor}
                width={svgWidth}
                height={svgHeight}
                suffix={suffix}
                prefix={prefix}
                barPadding={barPadding}
                showValues={showValues}
                showTicks={showTicks}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                truncateBy={truncateBy}
                showLabels={showLabels}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                refValues={refValues}
                maxValue={
                  !checkIfNullOrUndefined(maxValue)
                    ? (maxValue as number)
                    : Math.max(
                          ...data
                            .filter(d => !checkIfNullOrUndefined(d.size))
                            .map(d => d.size as number),
                        ) < 0
                      ? 0
                      : Math.max(
                          ...data
                            .filter(d => !checkIfNullOrUndefined(d.size))
                            .map(d => d.size as number),
                        )
                }
                minValue={
                  !checkIfNullOrUndefined(minValue)
                    ? (minValue as number)
                    : Math.min(
                          ...data
                            .filter(d => !checkIfNullOrUndefined(d.size))
                            .map(d => d.size as number),
                        ) >= 0
                      ? 0
                      : Math.min(
                          ...data
                            .filter(d => !checkIfNullOrUndefined(d.size))
                            .map(d => d.size as number),
                        )
                }
                highlightedDataPoints={highlightedDataPoints}
                onSeriesMouseClick={onSeriesMouseClick}
                labelOrder={labelOrder}
                rtl={language === 'he' || language === 'ar'}
                maxBarThickness={maxBarThickness}
                minBarThickness={minBarThickness}
                resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                detailsOnClick={detailsOnClick}
                barAxisTitle={barAxisTitle}
                noOfTicks={noOfTicks}
                valueColor={valueColor}
                classNames={classNames}
                styles={styles}
                animate={
                  animate === true
                    ? { duration: 0.5, once: true, amount: 0.5 }
                    : animate || { duration: 0, once: true, amount: 0 }
                }
                dimmedOpacity={dimmedOpacity}
                precision={precision}
                customLayers={customLayers}
                naLabel={naLabel}
              />
            ) : null}
          </GraphArea>
        </>
      )}
      {sources || footNote ? (
        <GraphFooter
          sources={sources}
          footNote={footNote}
          width={width}
          styles={{ footnote: styles?.footnote, source: styles?.source }}
          classNames={{
            footnote: classNames?.footnote,
            source: classNames?.source,
          }}
        />
      ) : null}
    </GraphContainer>
  );
}
