import { useState, useRef, useEffect, useMemo } from 'react';
import sum from 'lodash.sum';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import orderBy from 'lodash.orderby';

import { HorizontalGraph, VerticalGraph } from './Graph';

import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import {
  GroupedBarGraphDataType,
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
import { Pause, Play } from '@/Components/Icons';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { ensureCompleteDataForStackedBarChart } from '@/Utils/ensureCompleteData';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  labelOrder?: string[];
  graphTitle?: string | React.ReactNode;
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showLabels?: boolean;
  relativeHeight?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: Languages;
  minHeight?: number;
  theme?: 'light' | 'dark';
  maxBarThickness?: number;
  sortParameter?: number | 'total';
  sortData?: 'asc' | 'desc';
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
  showColorScale?: boolean;
  customLayers?: CustomLayerDataType[];
  timeline?: TimelineDataType;
  naLabel?: string;
  orientation?: 'horizontal' | 'vertical';
  hideAxisLine?: boolean;
}

export function StackedBarGraphEl(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    tooltip,
    onSeriesMouseOver,
    suffix = '',
    prefix = '',
    showLabels = true,
    relativeHeight,
    showValues = true,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    labelOrder,
    minHeight = 0,
    theme = 'light',
    maxBarThickness,
    sortParameter,
    maxNumberOfBars,
    minBarThickness,
    showColorScale = true,
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
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    sortData,
    orientation = 'vertical',
    hideAxisLine = false,
  } = props;

  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;
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
                  ? sortParameter === 'total'
                    ? orderBy(
                        ensureCompleteDataForStackedBarChart(data, timeline.dateFormat || 'yyyy')
                          .filter(d =>
                            timeline.enabled
                              ? d.date ===
                                format(
                                  new Date(uniqDatesSorted[index]),
                                  timeline.dateFormat || 'yyyy',
                                )
                              : d,
                          )
                          .filter(d => (filterNA ? !d.size.every(item => item == null) : d)),
                        d => sum(d.size.filter(el => !checkIfNullOrUndefined(el))),
                        [sortData || 'asc'],
                      ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                    : orderBy(
                        ensureCompleteDataForStackedBarChart(data, timeline.dateFormat || 'yyyy')
                          .filter(d =>
                            timeline.enabled
                              ? d.date ===
                                format(
                                  new Date(uniqDatesSorted[index]),
                                  timeline.dateFormat || 'yyyy',
                                )
                              : d,
                          )
                          .filter(d => (filterNA ? !d.size.every(item => item == null) : d)),
                        d =>
                          checkIfNullOrUndefined(d.size[sortParameter])
                            ? -Infinity
                            : d.size[sortParameter],
                        [sortData || 'asc'],
                      ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                  : ensureCompleteDataForStackedBarChart(data, timeline.dateFormat || 'yyyy')
                      .filter(d =>
                        timeline.enabled
                          ? d.date ===
                            format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
                          : d,
                      )
                      .filter(d => (filterNA ? !d.size.every(item => item == null) : d))
                      .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
              }
              barColors={colors}
              width={svgWidth}
              height={svgHeight}
              barPadding={barPadding}
              showTicks={showTicks}
              leftMargin={leftMargin}
              rightMargin={rightMargin}
              topMargin={topMargin}
              bottomMargin={bottomMargin}
              truncateBy={truncateBy}
              showLabels={showLabels}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              showValues={showValues}
              suffix={suffix}
              prefix={prefix}
              refValues={refValues}
              maxValue={
                !checkIfNullOrUndefined(maxValue)
                  ? (maxValue as number)
                  : Math.max(
                      ...data.map(d => sum(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0),
                    )
              }
              onSeriesMouseClick={onSeriesMouseClick}
              selectedColor={selectedColor}
              rtl={language === 'he' || language === 'ar'}
              labelOrder={labelOrder}
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
              colorDomain={colorDomain}
              precision={precision}
              customLayers={customLayers}
              naLabel={naLabel}
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
