import { useEffect, useRef, useState } from 'react';

import { HorizontalGraph, VerticalGraph } from './Graph';

import { uniqBy } from '@/Utils/uniqBy';
import { Colors } from '@/Components/ColorPalette';
import {
  SourcesDataType,
  Languages,
  StripChartDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
} from '@/Types';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';

interface Props {
  // Data
  /** Array of data objects */
  data: StripChartDataType[];

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
  /** Color or array of colors for circles */
  colors?: string | string[];
  /** Color of the highlighted data points */
  highlightColor?: string;
  /** Domain of colors for the graph */
  colorDomain?: string[];
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

  // Values and Ticks
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;

  // Graph Parameters
  /** Number of ticks on the axis */
  noOfTicks?: number;
  /** Radius of the dots or width of the strips */
  radius?: number;
  /** Opacity of each dot or strip */
  dotOpacity?: number;
  /** Type of strip */
  stripType?: 'strip' | 'dot';
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
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

export function StripChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius = 5,
    padding,
    backgroundColor = false,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorScale = true,
    highlightedDataPoints = [],
    graphID,
    minValue,
    maxValue,
    onSeriesMouseClick,
    noOfTicks = 2,
    graphDownload = false,
    dataDownload = false,
    prefix = '',
    suffix = '',
    stripType = 'dot',
    language = 'en',
    highlightColor,
    dotOpacity = 0.3,
    showNAColor = true,
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    valueColor,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    orientation = 'vertical',
    styles,
    classNames,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
  } = props;

  const Comp = orientation === 'horizontal' ? HorizontalGraph : VerticalGraph;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
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
          {showColorScale !== false && data.filter(el => el.color).length !== 0 ? (
            <ColorLegendWithMouseOver
              width={width}
              colorLegendTitle={colorLegendTitle}
              colors={(colors as string[] | undefined) || Colors[theme].categoricalColors.colors}
              colorDomain={colorDomain || (uniqBy(data, 'color', true) as string[])}
              setSelectedColor={setSelectedColor}
              showNAColor={showNAColor}
              className={classNames?.colorLegend}
            />
          ) : null}
          <GraphArea ref={graphDiv}>
            {svgWidth && svgHeight ? (
              <Comp
                data={data}
                width={svgWidth}
                height={svgHeight}
                colorDomain={
                  data.filter(el => el.color).length === 0
                    ? []
                    : colorDomain || (uniqBy(data, 'color', true) as string[])
                }
                colors={
                  data.filter(el => el.color).length === 0
                    ? colors
                      ? [colors as string]
                      : [Colors.primaryColors['blue-600']]
                    : (colors as string[] | undefined) || Colors[theme].categoricalColors.colors
                }
                selectedColor={selectedColor}
                radius={radius}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                highlightedDataPoints={highlightedDataPoints}
                minValue={minValue}
                maxValue={maxValue}
                onSeriesMouseClick={onSeriesMouseClick}
                prefix={prefix}
                suffix={suffix}
                stripType={stripType}
                highlightColor={highlightColor}
                dotOpacity={dotOpacity}
                resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                detailsOnClick={detailsOnClick}
                styles={styles}
                classNames={classNames}
                valueColor={valueColor}
                animate={
                  animate === true
                    ? { duration: 0.5, once: true, amount: 0.5 }
                    : animate || { duration: 0, once: true, amount: 0 }
                }
                noOfTicks={noOfTicks}
                dimmedOpacity={dimmedOpacity}
                precision={precision}
                customLayers={customLayers}
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
