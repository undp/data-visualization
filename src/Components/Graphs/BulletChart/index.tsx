import { useState, useRef, useEffect } from 'react';
import orderBy from 'lodash.orderby';

import { HorizontalGraph, VerticalGraph } from './Graph';

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
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphContainer, GraphArea } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  // Data
  /** Array of data objects */
  data: BulletChartDataType[];

  /** Orientation of the graph */
  orientation?: 'vertical' | 'horizontal';

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
  /** Color for bars */
  barColor?: string;
  /** Domain of colors for the qualitative range bars */
  colorDomain?: string[];
  /** Colors for the qualitative range bars */
  qualitativeRangeColors?: string[];
  /** Title for the color legend */
  colorLegendTitle?: string;
  /** Color of value labels */
  valueColor?: string;
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
  /** Padding between bars */
  barPadding?: number;
  /** Maximum thickness of bars */
  maxBarThickness?: number;
  /** Minimum thickness of bars */
  minBarThickness?: number;
  /** Maximum number of bars shown in the graph */
  maxNumberOfBars?: number;

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;
  /** Truncate labels by specified length */
  truncateBy?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** Number of ticks on the axis */
  noOfTicks?: number;

  // Graph Parameters
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Defines the style of the target bar */
  targetStyle?: 'background' | 'line';
  /** Defines the color of the target bar */
  targetColor?: string;
  /** Defines the width of the measure bar in relation with available width */
  measureBarWidthFactor?: number;
  /** Custom order for labels */
  labelOrder?: string[];
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Defines how “NA” values should be displayed/labelled in the graph */
  naLabel?: string;
  /** Title for the bar axis */
  barAxisTitle?: string;
  /** Sorting order for data. This is overwritten by labelOrder prop. */
  sortData?: 'asc' | 'desc';
  /** Toggles if data point which are undefined or has value null are filtered out.  */
  filterNA?: boolean;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
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

export function BulletChart(props: Props) {
  const {
    data,
    graphTitle,
    barColor = Colors.primaryColors['blue-600'],
    barPadding = 0.25,
    showTicks = true,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
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
    onSeriesMouseClick,
    valueColor,
    orientation = 'vertical',
    styles,
    classNames,
    qualitativeRangeColors,
    targetColor = Colors.light.grays['gray-700'],
    filterNA = true,
    targetStyle = 'line',
    measureBarWidthFactor = 0.4,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    naLabel = 'NA',
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
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;

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
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {showColorScale && data.filter(el => el.qualitativeRange).length !== 0 && colorDomain ? (
            <ColorLegend
              width={width}
              colorLegendTitle={colorLegendTitle}
              colors={qualitativeRangeColors || Colors[theme].sequentialColors.positiveColorsx10}
              colorDomain={colorDomain}
              showNAColor={false}
              className={classNames?.colorLegend}
            />
          ) : null}
          <GraphArea ref={graphDiv}>
            {svgWidth && svgHeight ? (
              <Comp
                data={
                  sortData
                    ? orderBy(
                        data.filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d)),
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
                    : data
                        .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d))
                        .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))
                }
                barColor={barColor}
                targetColor={targetColor}
                width={svgWidth}
                refValues={refValues}
                height={svgHeight}
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
                rtl={language === 'ar' || language === 'he'}
              />
            ) : null}
          </GraphArea>
        </>
      )}
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
