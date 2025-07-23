import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { cn } from '@undp/design-system-react';

import { Graph } from './Graph';

import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import {
  GroupedBarGraphDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

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
  animate?: boolean | number;
  precision?: number;
  customLayers?: CustomLayerDataType[];
}

export function HorizontalStackedBarGraph(props: Props) {
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
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin = 25,
    bottomMargin = 10,
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
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
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
          `${graphTitle ? `The graph shows ${graphTitle}. ` : ''}This is a stacked bar chart. ${
            graphDescription ? ` ${graphDescription}` : ''
          }`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-4 w-full grow justify-between'>
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
                  <ColorLegendWithMouseOver
                    width={width}
                    colorDomain={colorDomain}
                    colors={colors}
                    colorLegendTitle={colorLegendTitle}
                    setSelectedColor={setSelectedColor}
                    showNAColor={false}
                  />
                  <div className='w-full grow leading-0' ref={graphDiv} aria-label='Graph area'>
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={
                          sortParameter !== undefined
                            ? sortParameter === 'total'
                              ? sortBy(
                                  data.filter(d =>
                                    filterNA ? !d.size.every(item => item == null) : d,
                                  ),
                                  d => sum(d.size.filter(el => !checkIfNullOrUndefined(el))),
                                )
                                  .reverse()
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                              : sortBy(
                                  data.filter(d =>
                                    filterNA ? !d.size.every(item => item == null) : d,
                                  ),
                                  d =>
                                    checkIfNullOrUndefined(d.size[sortParameter])
                                      ? -Infinity
                                      : d.size[sortParameter],
                                )
                                  .reverse()
                                  .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                            : data
                                .filter(d => (filterNA ? !d.size.every(item => item == null) : d))
                                .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
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
                        maxValue={maxValue}
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
                        animate={animate === true ? 0.5 : animate || 0}
                        colorDomain={colorDomain}
                        precision={precision}
                        customLayers={customLayers}
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
