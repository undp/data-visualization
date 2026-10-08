import orderBy from 'lodash.orderby';
import sum from 'lodash.sum';
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
  GroupedBarGraphDataType,
  Languages,
  PadZerosTypes,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  TimelineDataType,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForStackedBarChart } from '@/Utils/ensureCompleteData';
import { HorizontalGraph, VerticalGraph } from './Graph';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  labelOrder?: (string | number)[];
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  showLabels?: boolean | ((_d: any) => React.ReactNode);
  relativeHeight?: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  filterNA?: boolean;
  animate?: boolean | AnimateDataType;
  precision?: number;
  locale?: string;
  showColorScale?: boolean;
  customLayers?: CustomLayerDataType[];
  timeline?: TimelineDataType;
  naLabel?: string;
  orientation?: 'horizontal' | 'vertical';
  hideAxisLine?: boolean;
  padZeros?: PadZerosTypes;
  showTotalValue?: boolean;
  minLabelSize?: number;
  cornerRadius?: number;
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
    showTotalValue,
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
    locale = 'en',
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
    naLabel = 'NA',
    sortData,
    orientation = 'vertical',
    hideAxisLine = false,
    padZeros = 'none',
    minLabelSize,
    cornerRadius = 0,
  } = props;

  const { graphDiv, svgWidth, svgHeight } = useElementSize<HTMLDivElement>();
  const { uniqDatesSorted, index, setIndex, play, setPlay, markObj, activeDate, dateFormat } =
    useTimeline(data, timeline);
  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
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
              showTotalValue={showTotalValue ?? showValues}
              data={
                sortParameter !== undefined
                  ? sortParameter === 'total'
                    ? orderBy(
                        ensureCompleteDataForStackedBarChart(data, dateFormat)
                          .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                          .filter((d) => (filterNA ? !d.size.every((item) => item == null) : d)),
                        (d) => sum(d.size.filter((el) => !checkIfNullOrUndefined(el))),
                        [sortData || 'asc'],
                      ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                    : orderBy(
                        ensureCompleteDataForStackedBarChart(data, dateFormat)
                          .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                          .filter((d) => (filterNA ? !d.size.every((item) => item == null) : d)),
                        (d) =>
                          checkIfNullOrUndefined(d.size[sortParameter])
                            ? -Infinity
                            : d.size[sortParameter],
                        [sortData || 'asc'],
                      ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                  : ensureCompleteDataForStackedBarChart(data, dateFormat)
                      .filter((d) => (timeline.enabled ? `${d.date}` === activeDate : d))
                      .filter((d) => (filterNA ? !d.size.every((item) => item == null) : d))
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
                      ...data.map(
                        (d) => sum(d.size.filter((l) => !checkIfNullOrUndefined(l))) || 0,
                      ),
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
              locale={locale}
              padZeros={padZeros}
              minLabelSize={minLabelSize ?? (orientation === 'horizontal' ? 25 : 15)}
              cornerRadius={cornerRadius}
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
