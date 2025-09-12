import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import { cn } from '@undp/design-system-react/cn';

import { Graph } from './Graph';

import {
  ReferenceDataType,
  BulletChartDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ColorLegend } from '@/Components/Elements/ColorLegend';

interface Props {
  data: BulletChartDataType[];
  barColor?: string;
  graphTitle?: string | React.ReactNode;
  labelOrder?: string[];
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
  colorDomain?: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  relativeHeight?: number;
  bottomMargin?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  showColorScale?: boolean;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints?: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortData?: 'asc' | 'desc';
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
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  filterNA?: boolean;
  targetColor?: string;
  targetStyle?: 'background' | 'line';
  qualitativeRangeColors?: string[];
  measureBarWidthFactor?: number;
  animate?: boolean | AnimateDataType;
  dimmedOpacity?: number;
  precision?: number;
  customLayers?: CustomLayerDataType[];
  naLabel?: string;
}

export function VerticalBulletChart(props: Props) {
  const {
    data,
    graphTitle,
    barColor = Colors.primaryColors['blue-600'],
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
    qualitativeRangeColors,
    onSeriesMouseClick,
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
    valueColor,
    styles,
    classNames,
    targetColor = Colors.light.grays['gray-700'],
    filterNA = true,
    targetStyle = 'line',
    measureBarWidthFactor = 0.4,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    naLabel = 'NA',
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
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
            <div className='grow flex flex-col justify-center gap-3 w-full'>
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale &&
                  data.filter(el => el.qualitativeRange).length !== 0 &&
                  colorDomain ? (
                    <ColorLegend
                      width={width}
                      colorLegendTitle={colorLegendTitle}
                      colors={
                        qualitativeRangeColors || Colors[theme].sequentialColors.positiveColorsx10
                      }
                      colorDomain={colorDomain}
                      showNAColor={false}
                    />
                  ) : null}
                  <div
                    className='flex grow flex-col justify-center w-full leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={
                          sortData === 'asc'
                            ? sortBy(
                                data.filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d)),
                                d => d.size,
                              ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                            : sortData === 'desc'
                              ? sortBy(
                                  data.filter(d =>
                                    filterNA ? !checkIfNullOrUndefined(d.size) : d,
                                  ),
                                  d => d.size,
                                )
                                  .reverse()
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                              : data
                                  .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d))
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                        }
                        barColor={barColor}
                        targetColor={targetColor}
                        width={width || svgWidth}
                        refValues={refValues}
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
