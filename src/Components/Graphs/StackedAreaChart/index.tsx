import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';

import {
  AnnotationSettingsDataType,
  AreaChartDataType,
  CustomHighlightAreaSettingsDataType,
  Languages,
  ReferenceDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  HighlightAreaSettingsDataType,
  CurveTypes,
  CustomLayerDataType,
  AnimateDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegend } from '@/Components/Elements/ColorLegend';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  // Data
  /** Array of data objects */
  data: AreaChartDataType[];

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
  /** array of colors for different lines and areas */
  colors?: string[];
  /** Domain of colors for the graph */
  colorDomain: string[];
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
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** No. of ticks on the x-axis  */
  noOfXTicks?: number;
  /** No. of ticks on the y-axis  */
  noOfYTicks?: number;

  // Graph Parameters
  /** Format of the date in the data object. Available formats can be found [here](https://date-fns.org/docs/format)  */
  dateFormat?: string;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
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
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
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

export function AreaChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = Colors.light.categoricalColors.colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks = 10,
    dateFormat = 'yyyy',
    colorDomain,
    padding,
    backgroundColor = false,
    colorLegendTitle,
    leftMargin = 50,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    highlightAreaSettings = [],
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refValues = [],
    graphID,
    minValue,
    maxValue,
    graphDownload = false,
    dataDownload = false,
    showColorScale = true,
    language = 'en',
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    theme = 'light',
    ariaLabel,
    yAxisTitle,
    noOfYTicks = 5,
    prefix = '',
    suffix = '',
    curveType = 'curve',
    styles,
    classNames,
    precision = 2,
    customLayers = [],
    animate = false,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

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
          {showColorScale !== false ? (
            <ColorLegend
              colorDomain={colorDomain}
              colors={colors}
              colorLegendTitle={colorLegendTitle}
              showNAColor={false}
              className={classNames?.colorLegend}
            />
          ) : null}
          <GraphArea ref={graphDiv}>
            {svgWidth && svgHeight ? (
              <Graph
                data={data}
                colors={colors}
                width={svgWidth}
                height={svgHeight}
                dateFormat={dateFormat}
                noOfXTicks={noOfXTicks}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                highlightAreaSettings={highlightAreaSettings}
                refValues={refValues}
                minValue={minValue}
                maxValue={maxValue}
                rtl={language === 'he' || language === 'ar'}
                annotations={annotations}
                customHighlightAreaSettings={customHighlightAreaSettings}
                yAxisTitle={yAxisTitle}
                noOfYTicks={noOfYTicks}
                prefix={prefix}
                suffix={suffix}
                curveType={curveType}
                styles={styles}
                classNames={classNames}
                precision={precision}
                customLayers={customLayers}
                animate={
                  animate === true
                    ? { duration: 0.5, once: true, amount: 0.5 }
                    : animate || { duration: 0, once: true, amount: 0 }
                }
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
