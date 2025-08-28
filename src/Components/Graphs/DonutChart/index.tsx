import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import { cn, P } from '@undp/design-system-react';

import { Graph } from './Graph';

import {
  DonutChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  /** Array of data objects */
  data: DonutChartDataType[];

  // Titles, Labels, and Sources
  /** Title of the graph */
  graphTitle?: string | React.ReactNode;
  /** Description of the graph */
  graphDescription?: string | React.ReactNode;
  /** Footnote for the graph */
  footNote?: string | React.ReactNode;
  /** Source data for the graph */
  sources?: SourcesDataType[];
  /** Accessibility label */
  ariaLabel?: string;

  // Colors and Styling
  /** Array of colors for each segment */
  colors?: string[];
  /** Domain of colors for the graph */
  colorDomain?: string[];
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
  /** Radius of the donut chart */
  radius?: number;
  /** Top margin of the graph */
  topMargin?: number;
  /** Bottom margin of the graph */
  bottomMargin?: number;

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;

  // Graph Parameters
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Max width of the color scale as a css property */
  colorScaleMaxWidth?: string;
  /** Stroke width of the arcs and circle of the donut  */
  strokeWidth?: number;
  /** Sorting order for data. This is overwritten by labelOrder prop */
  sortData?: 'asc' | 'desc';
  /** Large text at the center of the donut chart. If the type is an object then the text is the value in the data for the label mentioned in the object */
  mainText?: string | { label: string; suffix?: string; prefix?: string };
  /** Small text at the center of the donut chart */
  subNote?: string;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function DonutChart(props: Props) {
  const {
    mainText,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    suffix = '',
    sources,
    prefix = '',
    strokeWidth = 50,
    graphDescription,
    subNote,
    footNote,
    radius,
    data,
    showColorScale = true,
    padding,
    backgroundColor = false,
    tooltip,
    onSeriesMouseOver,
    graphID,
    onSeriesMouseClick,
    topMargin = 0,
    bottomMargin = 0,
    graphDownload = false,
    dataDownload = false,
    colorDomain,
    sortData,
    language = 'en',
    theme = 'light',
    width,
    height,
    minHeight = 0,
    relativeHeight,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    colorScaleMaxWidth,
    detailsOnClick,
    styles,
    classNames,
    precision = 2,
  } = props;

  const [donutRadius, setDonutRadius] = useState(0);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 420);
      setSvgHeight(height || entries[0].target.clientHeight || 420);
      setDonutRadius(
        (Math.min(
          ...[
            width || entries[0].target.clientWidth || 620,
            height || entries[0].target.clientHeight || 480,
          ],
        ) || 420) / 2,
      );
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 420);
      setSvgWidth(graphDiv.current.clientWidth || 420);
      setDonutRadius(
        (Math.min(...[graphDiv.current.clientWidth, graphDiv.current.clientHeight]) || 420) / 2,
      );
      if (!width || !radius) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height, radius]);

  const sortedData =
    sortData === 'asc'
      ? sortBy(data, d => d.size)
      : sortData === 'desc'
        ? sortBy(data, d => d.size).reverse()
        : data;

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
          minHeight: 'inherit',
          ...(backgroundColor && backgroundColor !== true ? { backgroundColor } : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a donut or pie chart chart. ${graphDescription ? ` ${graphDescription}` : ''}`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-2 w-full grow justify-between'>
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
            <div
              className='flex grow flex-col justify-center items-stretch gap-8 flex-wrap'
              style={{
                width: width ? `${width}px` : '100%',
                padding: `${topMargin}px 0 ${bottomMargin}px 0`,
              }}
            >
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale ? (
                    <div className='leading-0' aria-label='Color legend'>
                      <div
                        className='flex mb-0 ml-auto mr-auto justify-center gap-3.5 flex-wrap'
                        style={{ maxWidth: colorScaleMaxWidth }}
                      >
                        {sortedData.map((d, i) => (
                          <div className='flex gap-2 items-center' key={i}>
                            <div
                              className='w-3 h-3 rounded-full'
                              style={{
                                backgroundColor:
                                  (colorDomain || sortedData.map(el => el.label)).indexOf(
                                    d.label,
                                  ) !== -1
                                    ? (colors || Colors[theme].categoricalColors.colors)[
                                        (colorDomain || sortedData.map(el => el.label)).indexOf(
                                          d.label,
                                        ) %
                                          (colors || Colors[theme].categoricalColors.colors).length
                                      ]
                                    : Colors.gray,
                              }}
                            />
                            <P
                              marginBottom='none'
                              size='sm'
                              className='text-primary-gray-700 dark:text-primary-gray-100'
                            >
                              {d.label}:{' '}
                              <span className='font-bold' style={{ fontSize: 'inherit' }}>
                                {numberFormattingFunction(d.size, 'NA', precision, prefix, suffix)}
                              </span>
                            </P>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={`flex ${
                      width ? 'grow-0' : 'grow'
                    } items-center justify-center leading-0`}
                    style={{
                      width: width ? `${width}px` : '100%',
                      height: height
                        ? `${Math.max(
                            minHeight,
                            height ||
                              (relativeHeight
                                ? minHeight
                                  ? (width || svgWidth) * relativeHeight > minHeight
                                    ? (width || svgWidth) * relativeHeight
                                    : minHeight
                                  : (width || svgWidth) * relativeHeight
                                : svgHeight),
                          )}px`
                        : 'auto',
                    }}
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    <div className='w-full flex justify-center leading-0'>
                      {radius || donutRadius ? (
                        <Graph
                          mainText={mainText}
                          data={
                            sortData === 'asc'
                              ? sortBy(data, d => d.size)
                              : sortData === 'desc'
                                ? sortBy(data, d => d.size).reverse()
                                : data
                          }
                          colors={colors}
                          radius={radius || donutRadius}
                          subNote={subNote}
                          strokeWidth={strokeWidth}
                          tooltip={tooltip}
                          colorDomain={colorDomain || sortedData.map(d => d.label)}
                          onSeriesMouseOver={onSeriesMouseOver}
                          onSeriesMouseClick={onSeriesMouseClick}
                          resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                          styles={styles}
                          detailsOnClick={detailsOnClick}
                          precision={precision}
                        />
                      ) : null}
                    </div>
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
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
