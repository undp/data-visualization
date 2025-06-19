import { useState, useRef, useEffect } from 'react';
import { cn } from '@undp/design-system-react';

import { Graph } from './Graph';

import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import {
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  DifferenceLineChartDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  HighlightAreaSettingsDataType,
  CurveTypes,
} from '@/Types';
import { Colors } from '@/Components/ColorPalette';
import { generateRandomString } from '@/Utils/generateRandomString';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  /** Array of data objects */
  data: DifferenceLineChartDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string;
  /** Description of the graph */
  graphDescription?: string;
  /** Footnote for the graph */
  footNote?: string;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Array of colors for the 2 lines */
  lineColors?: [string, string];
  /** Array of colors to highlight the negative and positive difference between the lines */
  diffAreaColors?: [string, string];
  /** Toggle the visibility of color legend between the top of the graphs and next to the line */
  showColorLegendAtTop?: boolean;
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

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;
  /** Maximum value of the date for the chart */
  maxDate?: string | number;
  /** Minimum value of the date for the chart */
  minDate?: string | number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** No. of ticks on the x-axis  */
  noOfXTicks?: number;
  /** No. of ticks on the y-axis  */
  noOfYTicks?: number;

  // Graph Parameters
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Toggle visibility of dots on the line */
  showDots?: boolean;
  /** Stroke width of the line */
  strokeWidth?: number;
  /** Toggle the initial animation of the line. If the type is number then it uses the number as the time in seconds for animation. */
  animateLine?: boolean | number;
  /** Labels for the lines  */
  labels: [string, string];
  /** Format of the date in the data object  */
  dateFormat?: string;
  /** Title for the Y-axis */
  yAxisTitle?: string;
  /** Annotations on the chart */
  annotations?: AnnotationSettingsDataType[];
  /** Highlighted area(square) on the chart  */
  highlightAreaSettings?: HighlightAreaSettingsDataType[];
  /** Highlighted area(custom shape) on the chart  */
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  /** Curve type for the line */
  curveType?: CurveTypes;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function DifferenceLineChart(props: Props) {
  const {
    data,
    graphTitle,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks = 10,
    dateFormat = 'yyyy',
    showValues = false,
    padding,
    lineColors = [
      Colors.light.categoricalColors.colors[0],
      Colors.light.categoricalColors.colors[1],
    ],
    backgroundColor = false,
    leftMargin = 30,
    rightMargin = 50,
    topMargin = 20,
    bottomMargin = 25,
    tooltip,
    highlightAreaSettings = [],
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload = false,
    dataDownload = false,
    animateLine = false,
    language = 'en',
    minHeight = 0,
    labels,
    showColorLegendAtTop = false,
    colorLegendTitle,
    diffAreaColors = [Colors.alerts.red, Colors.alerts.darkGreen],
    strokeWidth = 2,
    showDots = true,
    refValues = [],
    minValue,
    maxValue,
    annotations = [],
    customHighlightAreaSettings = [],
    theme = 'light',
    ariaLabel,
    yAxisTitle,
    noOfYTicks = 5,
    minDate,
    maxDate,
    curveType = 'curve',
    styles,
    classNames,
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
          }This is a line chart that highlights the difference between two datasets over time.${
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
                  {showColorLegendAtTop ? (
                    <ColorLegend
                      colorDomain={labels}
                      colorLegendTitle={colorLegendTitle}
                      colors={lineColors}
                      showNAColor={false}
                    />
                  ) : null}
                  <div
                    className='flex flex-col grow justify-center leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={data}
                        lineColors={lineColors}
                        colorDomain={labels}
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
                        dateFormat={dateFormat}
                        showValues={showValues}
                        noOfXTicks={noOfXTicks}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        highlightAreaSettings={highlightAreaSettings}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        showColorLegendAtTop={showColorLegendAtTop}
                        animateLine={animateLine}
                        rtl={language === 'he' || language === 'ar'}
                        diffAreaColors={diffAreaColors}
                        idSuffix={generateRandomString(8)}
                        strokeWidth={strokeWidth}
                        showDots={showDots}
                        refValues={refValues}
                        minValue={minValue}
                        maxValue={maxValue}
                        annotations={annotations}
                        customHighlightAreaSettings={customHighlightAreaSettings}
                        yAxisTitle={yAxisTitle}
                        noOfYTicks={noOfYTicks}
                        minDate={minDate}
                        maxDate={maxDate}
                        curveType={curveType}
                        styles={styles}
                        classNames={classNames}
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
