import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import { cn } from '@undp/design-system-react';

import { Graph } from './Graph';

import {
  DumbbellChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  ReferenceDataType,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
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
  showValues?: boolean;
  showLabels?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  suffix?: string;
  prefix?: string;
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
  labelOrder?: string[];
  styles?: StyleObject;
  classNames?: ClassNameObject;
  refValues?: ReferenceDataType[];
  filterNA?: boolean;
}

export function VerticalDumbbellChart(props: Props) {
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
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    radius = 3,
    tooltip,
    showLabels = true,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix = '',
    prefix = '',
    maxPositionValue,
    minPositionValue,
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
    styles,
    classNames,
    labelOrder,
    refValues,
    filterNA = true,
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
                                  data.filter(d =>
                                    filterNA ? !d.x.every(item => item == null) : d,
                                  ),
                                  d =>
                                    checkIfNullOrUndefined(d.x[d.x.length - 1]) ||
                                    checkIfNullOrUndefined(d.x[0])
                                      ? -Infinity
                                      : (d.x[d.x.length - 1] as number) - (d.x[0] as number),
                                ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                              : sortBy(
                                  data.filter(d =>
                                    filterNA ? !d.x.every(item => item == null) : d,
                                  ),
                                  d =>
                                    checkIfNullOrUndefined(d.x[sortParameter])
                                      ? -Infinity
                                      : d.x[sortParameter],
                                ).filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                            : data
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
                        maxPositionValue={maxPositionValue}
                        minPositionValue={minPositionValue}
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
