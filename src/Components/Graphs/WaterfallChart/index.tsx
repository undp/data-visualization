import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';

import { Colors } from '@/Components/ColorPalette';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphContainer, GraphArea } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  ReferenceDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
  AnimateDataType,
  WaterfallChartDataType,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils';
import { uniqBy } from '@/Utils/uniqBy';

interface Props {
  // Data
  /** Array of data objects */
  data: WaterfallChartDataType[];

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
  /** Color or array of colors for bars */
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
  /** Custom order for labels */
  labelOrder?: string[];
  /** Defines how “NA” values should be displayed/labelled in the graph */
  naLabel?: string;
  /** Toggle visibility of axis ticks */
  showTicks?: boolean;
  /** Toggle visibility of axis line for the  main axis */
  hideAxisLine?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Title for the bar axis */
  barAxisTitle?: string;
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

export function WaterfallChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    barPadding = 0.25,
    showValues = true,
    showTicks = true,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    highlightedDataPoints = [],
    padding,
    backgroundColor = false,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin,
    showLabels = true,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale = true,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    labelOrder,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    theme = 'light',
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    styles,
    classNames,
    filterNA = true,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    naLabel = 'NA',
    hideAxisLine = false,
  } = props;
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
      {showColorScale && data.filter(el => el.color).length !== 0 && data.length > 0 ? (
        <ColorLegendWithMouseOver
          width={width}
          colorLegendTitle={colorLegendTitle}
          colors={(colors as string[] | undefined) || Colors[theme].categoricalColors.colors}
          colorDomain={colorDomain || (uniqBy(data, 'color', true) as (string | number)[])}
          setSelectedColor={setSelectedColor}
          showNAColor={showNAColor}
          className={classNames?.colorLegend}
        />
      ) : null}
      <GraphArea ref={graphDiv}>
        {data.filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d)).length === 0 && (
          <EmptyState />
        )}
        {svgWidth &&
        svgHeight &&
        data.filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d)).length > 0 ? (
          <Graph
            hideAxisLine={hideAxisLine}
            data={data
              .filter(d => (filterNA ? !checkIfNullOrUndefined(d.size) : d))
              .filter((_d, i) => (maxNumberOfBars ? i < maxNumberOfBars : true))}
            barColor={
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
            selectedColor={selectedColor}
            width={svgWidth}
            height={svgHeight}
            suffix={suffix}
            prefix={prefix}
            barPadding={barPadding}
            showValues={showValues}
            showTicks={showTicks}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            truncateBy={truncateBy}
            showLabels={showLabels}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            refValues={refValues}
            maxValue={maxValue}
            minValue={minValue}
            highlightedDataPoints={highlightedDataPoints}
            onSeriesMouseClick={onSeriesMouseClick}
            labelOrder={labelOrder}
            rtl={language === 'he' || language === 'ar'}
            maxBarThickness={maxBarThickness}
            minBarThickness={minBarThickness}
            detailsOnClick={detailsOnClick}
            barAxisTitle={barAxisTitle}
            noOfTicks={noOfTicks}
            classNames={classNames}
            styles={styles}
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            dimmedOpacity={dimmedOpacity}
            precision={precision}
            customLayers={customLayers}
            naLabel={naLabel}
          />
        ) : null}
      </GraphArea>
      {sources || footNote ? (
        <GraphFooter
          sources={sources}
          footNote={footNote}
          width={width}
          styles={{ footnote: styles?.footnote, source: styles?.source }}
          classNames={{
            footnote: classNames?.footnote,
            source: classNames?.source,
          }}
        />
      ) : null}
    </GraphContainer>
  );
}
