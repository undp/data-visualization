import { useState, useRef, useEffect } from 'react';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { ascending, sort } from 'd3-array';
import orderBy from 'lodash.orderby';
import sum from 'lodash.sum';

import { HorizontalGraph, VerticalGraph } from './Graph';

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
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string | React.ReactNode;
  graphDescription?: string | React.ReactNode;
  footNote?: string | React.ReactNode;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  showLabels?: boolean;
  bottomMargin?: number;
  relativeHeight?: number;
  sortParameter?: number | 'total';
  sortData?: 'asc' | 'desc';
  showColorScale?: boolean;
  minHeight?: number;
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
  labelOrder?: string[];
  language?: Languages;
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
  orientation?: 'horizontal' | 'vertical';
}

export function GroupedBarGraphEl(props: Props) {
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
    suffix = '',
    prefix = '',
    showValues = true,
    showColorScale = true,
    padding,
    backgroundColor = false,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels = true,
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
    labelOrder,
    minHeight = 0,
    theme = 'light',
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
    animate = false,
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    sortParameter,
    sortData,
    orientation = 'vertical',
  } = props;

  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;
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
                className={classNames?.colorLegend}
              />
            ) : null}
            <GraphArea ref={graphDiv}>
              {svgWidth && svgHeight ? (
                <Comp
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
                              .filter(d => (filterNA ? !d.size.every(item => item == null) : d)),
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
                              .filter(d => (filterNA ? !d.size.every(item => item == null) : d)),
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
                  width={svgWidth}
                  height={svgHeight}
                  suffix={suffix}
                  prefix={prefix}
                  showValues={showValues}
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
                  refValues={refValues}
                  maxValue={
                    !checkIfNullOrUndefined(maxValue)
                      ? (maxValue as number)
                      : Math.max(
                            ...data.map(d =>
                              Math.max(
                                ...(d.size.filter(l => !checkIfNullOrUndefined(l)) as number[]),
                              ),
                            ),
                          ) < 0
                        ? 0
                        : Math.max(
                            ...data.map(d =>
                              Math.max(
                                ...(d.size.filter(l => !checkIfNullOrUndefined(l)) as number[]),
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
                                ...(d.size.filter(l => !checkIfNullOrUndefined(l)) as number[]),
                              ),
                            ),
                          ) >= 0
                        ? 0
                        : Math.min(
                            ...data.map(d =>
                              Math.min(
                                ...(d.size.filter(l => !checkIfNullOrUndefined(l)) as number[]),
                              ),
                            ),
                          )
                  }
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  labelOrder={labelOrder}
                  rtl={language === 'he' || language === 'ar'}
                  maxBarThickness={maxBarThickness}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  detailsOnClick={detailsOnClick}
                  barAxisTitle={barAxisTitle}
                  noOfTicks={noOfTicks}
                  valueColor={valueColor}
                  styles={styles}
                  classNames={classNames}
                  colorDomain={colorDomain}
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
    </GraphContainer>
  );
}
