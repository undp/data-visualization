import { useState, useRef, useEffect } from 'react';
import { cn } from '@undp/design-system-react';

import { Graph } from './Graph';

import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  HeatMapDataType,
  Languages,
  ScaleDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { LinearColorLegend } from '@/Components/Elements/LinearColorLegend';
import { ThresholdColorLegendWithMouseOver } from '@/Components/Elements/ThresholdColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  /** Array of data objects */
  data: HeatMapDataType[];

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
  /** Array of colors for cells */
  colors?: string[];
  /** Color where data is not available */
  noDataColor?: string;
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
  /** Toggles the background to fill the container. This only works if the width of the graph is defined. */
  fillContainer?: boolean;

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  truncateBy?: number;
  /** Reference values for comparison */

  // Graph Parameters
  /** Toggle visibility of labels in the column */
  showColumnLabels?: boolean;
  /** Toggle visibility of labels in the row */
  showRowLabels?: boolean;
  /** Scale for the colors in the cell */
  scaleType?: ScaleDataType;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | number;
  /** Domain for the colors in the cell.  */
  colorDomain: number[] | string[];
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

export function HeatMap(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    showColumnLabels = true,
    leftMargin = 100,
    rightMargin = 10,
    truncateBy = 999,
    height,
    width,
    scaleType,
    colorDomain,
    footNote,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin = 30,
    bottomMargin = 10,
    tooltip,
    onSeriesMouseOver,
    suffix = '',
    prefix = '',
    showRowLabels = true,
    relativeHeight,
    showValues,
    graphID,
    noDataColor = Colors.gray,
    showColorScale = true,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    fillContainer = true,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    animate = false,
    precision = 2,
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
  const scale =
    scaleType ||
    (typeof colorDomain[0] === 'string'
      ? 'categorical'
      : colorDomain.length === 2
        ? 'linear'
        : 'threshold');

  return (
    <div
      className={`${theme || 'light'} flex ${width ? 'grow-0' : 'grow'} ${
        !fillContainer ? 'w-fit' : 'w-full'
      }`}
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
          }This is a heatmap. ${graphDescription ? ` ${graphDescription}` : ''}`
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
                  {showColorScale ? (
                    scale === 'categorical' ? (
                      <ColorLegendWithMouseOver
                        width={fillContainer ? undefined : width}
                        colorLegendTitle={colorLegendTitle}
                        colors={
                          colors ||
                          (typeof colorDomain[0] === 'string'
                            ? Colors[theme].categoricalColors.colors
                            : colorDomain.length === 2
                              ? [
                                  Colors[theme].sequentialColors.neutralColorsx09[0],
                                  Colors[theme].sequentialColors.neutralColorsx09[8],
                                ]
                              : Colors[theme].sequentialColors[
                                  `neutralColorsx0${
                                    (colorDomain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                                  }`
                                ])
                        }
                        colorDomain={colorDomain.map(d => `${d}`)}
                        setSelectedColor={setSelectedColor}
                        showNAColor={showNAColor}
                      />
                    ) : scale === 'threshold' ? (
                      <ThresholdColorLegendWithMouseOver
                        width={fillContainer ? undefined : width}
                        colorLegendTitle={colorLegendTitle}
                        colors={
                          colors ||
                          (typeof colorDomain[0] === 'string'
                            ? Colors[theme].categoricalColors.colors
                            : colorDomain.length === 2
                              ? [
                                  Colors[theme].sequentialColors.neutralColorsx09[0],
                                  Colors[theme].sequentialColors.neutralColorsx09[8],
                                ]
                              : Colors[theme].sequentialColors[
                                  `neutralColorsx0${
                                    (colorDomain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                                  }`
                                ])
                        }
                        colorDomain={colorDomain as number[]}
                        setSelectedColor={setSelectedColor}
                        naColor={noDataColor}
                        showNAColor={showNAColor}
                      />
                    ) : (
                      <LinearColorLegend
                        width={fillContainer ? undefined : width}
                        colorLegendTitle={colorLegendTitle}
                        colors={
                          colors || [
                            Colors[theme].sequentialColors.neutralColorsx09[0],
                            Colors[theme].sequentialColors.neutralColorsx09[8],
                          ]
                        }
                        colorDomain={colorDomain as number[]}
                      />
                    )
                  ) : null}
                  <div
                    className='flex grow flex-col justify-center w-full leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={data}
                        colorDomain={colorDomain}
                        width={width || svgWidth}
                        colors={
                          colors ||
                          (typeof colorDomain[0] === 'string'
                            ? Colors[theme].categoricalColors.colors
                            : colorDomain.length === 2
                              ? [
                                  Colors[theme].sequentialColors.neutralColorsx09[0],
                                  Colors[theme].sequentialColors.neutralColorsx09[8],
                                ]
                              : Colors[theme].sequentialColors[
                                  `neutralColorsx0${
                                    (colorDomain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                                  }`
                                ])
                        }
                        noDataColor={noDataColor}
                        scaleType={scale}
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
                        showColumnLabels={showColumnLabels}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        selectedColor={selectedColor}
                        truncateBy={truncateBy}
                        showRowLabels={showRowLabels}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        showValues={showValues}
                        suffix={suffix}
                        prefix={prefix}
                        onSeriesMouseClick={onSeriesMouseClick}
                        resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                        detailsOnClick={detailsOnClick}
                        styles={styles}
                        classNames={classNames}
                        animate={animate === true ? 0.5 : animate || 0}
                        precision={precision}
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
