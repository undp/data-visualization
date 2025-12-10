import { useEffect, useRef, useState } from 'react';

import { HorizontalGraph, VerticalGraph } from './Graph';

import { uniqBy } from '@/Utils/uniqBy';
import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  BeeSwarmChartDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
} from '@/Types';
import { Colors } from '@/Components/ColorPalette';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { GraphFooter } from '@/Components/Elements/GraphFooter';

interface Props {
  // Data
  /** Array of data objects */
  data: BeeSwarmChartDataType[];

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
  /** Color or array of colors for circle */
  colors?: string | string[];
  /** Domain of colors for the graph */
  colorDomain?: string[];
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
  /** Maximum value for the radius of the circle */
  maxRadiusValue?: number;
  /** Minimum value for position of the circle */
  minValue?: number;
  /** Maximum value for position of the circle */
  maxValue?: number;
  /** Reference values for comparison */
  refValues?: ReferenceDataType[];
  /** Number of ticks on the axis */
  noOfTicks?: number;

  // Graph Parameters
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showTicks?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Maximum radius of the circles  */
  radius?: number;
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

export function BeeSwarmChart(props: Props) {
  const {
    data,
    graphTitle,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    colors,
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
    showColorScale,
    graphID,
    radius = 5,
    showLabels = true,
    showTicks = true,
    maxRadiusValue,
    maxValue,
    minValue,
    highlightedDataPoints = [],
    onSeriesMouseClick,
    ariaLabel,
    backgroundColor = false,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    theme = 'light',
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    orientation = 'vertical',
    suffix = '',
    prefix = '',
    styles,
    classNames,
    noOfTicks = 5,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

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
      {showColorScale !== false && data.filter(el => el.color).length !== 0 && data.length > 0 ? (
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
        {data.length === 0 && <EmptyState />}
        {svgWidth && svgHeight && data.length > 0 ? (
          <Comp
            data={data}
            circleColors={
              data.filter(el => el.color).length === 0
                ? colors
                  ? [colors as string]
                  : [Colors.primaryColors['blue-600']]
                : (colors as string[] | undefined) || Colors[theme].categoricalColors.colors
            }
            colorDomain={
              data.filter(el => el.color).length === 0
                ? []
                : colorDomain || (uniqBy(data, 'color', true) as string[])
            }
            width={svgWidth}
            selectedColor={selectedColor}
            height={svgHeight}
            showTicks={showTicks}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            showLabels={showLabels}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            refValues={refValues}
            startFromZero={false}
            radius={radius}
            maxRadiusValue={maxRadiusValue}
            maxValue={maxValue}
            minValue={minValue}
            highlightedDataPoints={highlightedDataPoints}
            onSeriesMouseClick={onSeriesMouseClick}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            detailsOnClick={detailsOnClick}
            styles={styles}
            classNames={classNames}
            suffix={suffix}
            prefix={prefix}
            noOfTicks={noOfTicks || 5}
            dimmedOpacity={dimmedOpacity}
            precision={precision}
            customLayers={customLayers}
          />
        ) : null}
      </GraphArea>
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
