import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { useState, useRef, useEffect } from 'react';
import { SliderUI } from '@undp/design-system-react/SliderUI';
import { ascending, sort } from 'd3-array';

import { Graph } from './Graph';

import {
  ReferenceDataType,
  ScatterPlotDataType,
  AnnotationSettingsDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
  CustomHighlightAreaSettingsForScatterPlotDataType,
  HighlightAreaSettingsForScatterPlotDataType,
  CustomLayerDataType,
  AnimateDataType,
  TimelineDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { getSliderMarks } from '@/Utils/getSliderMarks';
import { Pause, Play } from '@/Components/Icons';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForScatterPlot } from '@/Utils/ensureCompleteData';
import { uniqBy } from '@/Utils/uniqBy';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  // Data
  /** Array of data objects */
  data: ScatterPlotDataType[];

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
  /** Prefix for values on x-axis */
  xPrefix?: string;
  /** Suffix for values on x-axis */
  xSuffix?: string;
  /** Prefix for values on y-axis */
  yPrefix?: string;
  /** Suffix for values on y-axis */
  ySuffix?: string;
  /** Maximum value for the x-axis */
  maxXValue?: number;
  /** Minimum value for the x-axis */
  minXValue?: number;
  /** Maximum value for the y-axis */
  maxYValue?: number;
  /** Minimum value for the y-axis */
  minYValue?: number;
  /** Maximum value mapped to the radius chart */
  maxRadiusValue?: number;
  /** Reference values for comparison on x-axis */
  refXValues?: ReferenceDataType[];
  /** Reference values for comparison on y-axis */
  refYValues?: ReferenceDataType[];
  /** Number of ticks on the x-axis */
  noOfXTicks?: number;
  /** Number of ticks on the y-axis */
  noOfYTicks?: number;

  // Graph Parameters
  /** Maximum radius of the circle */
  radius?: number;
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of color scale. This is only applicable if the data props hae color parameter */
  showColorScale?: boolean;
  /** Toggle visibility of NA color in the color scale. This is only applicable if the data props hae color parameter and showColorScale prop is true */
  showNAColor?: boolean;
  /** Data points to highlight. Use the label value from data to highlight the data point */
  highlightedDataPoints?: (string | number)[];
  /** Defines the opacity of the non-highlighted data */
  dimmedOpacity?: number;
  /** Title for the x-axis */
  xAxisTitle?: string;
  /** Title for the y-axis */
  yAxisTitle?: string;
  /** Annotations on the chart */
  annotations?: AnnotationSettingsDataType[];
  /** Highlighted area(square) on the chart  */
  highlightAreaSettings?: HighlightAreaSettingsForScatterPlotDataType[];
  /** Highlighted area(custom shape) on the chart  */
  customHighlightAreaSettings?: CustomHighlightAreaSettingsForScatterPlotDataType[];
  /** Toggles the visibility of the regression line for the data. If the type is string then string is use to define the color of the line. */
  regressionLine?: boolean | string;
  /** Color of the labels */
  labelColor?: string;
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Specifies the number of decimal places to display in the value. */
  precision?: number;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Configures playback and slider controls for animating the chart over time. The data must have a key date for it to work properly. */
  timeline?: TimelineDataType;
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

export function ScatterPlot(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    showLabels = false,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius = 5,
    xAxisTitle = 'X Axis',
    yAxisTitle = 'Y Axis',
    padding,
    backgroundColor = false,
    leftMargin = 0,
    rightMargin = 10,
    topMargin = 20,
    bottomMargin = 50,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refXValues = [],
    refYValues = [],
    highlightAreaSettings = [],
    showColorScale = true,
    highlightedDataPoints = [],
    graphID,
    maxRadiusValue,
    maxXValue,
    minXValue,
    maxYValue,
    minYValue,
    xSuffix = '',
    ySuffix = '',
    xPrefix = '',
    yPrefix = '',
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    theme = 'light',
    regressionLine = false,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    noOfXTicks = 5,
    noOfYTicks = 5,
    labelColor,
    styles,
    classNames,
    animate = false,
    dimmedOpacity = 0.3,
    precision = 2,
    customLayers = [],
    timeline = { enabled: false, autoplay: false, showOnlyActiveDate: true },
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [play, setPlay] = useState(timeline.autoplay);
  const uniqDatesSorted = sort(
    uniqBy(data, 'date', true).map(d =>
      parse(`${d}`, timeline.dateFormat || 'yyyy', new Date()).getTime(),
    ),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(timeline.autoplay ? 0 : uniqDatesSorted.length - 1);

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

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
      },
      (timeline.speed || 2) * 1000,
    );
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play, timeline.speed]);

  const markObj = getSliderMarks(
    uniqDatesSorted,
    index,
    timeline.showOnlyActiveDate,
    timeline.dateFormat || 'yyyy',
  );

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
      {timeline.enabled && uniqDatesSorted.length > 0 && markObj ? (
        <div className='flex gap-6 items-center' dir='ltr'>
          <button
            type='button'
            onClick={() => {
              setPlay(!play);
            }}
            className='p-0 border-0 cursor-pointer bg-transparent'
            aria-label={play ? 'Click to pause animation' : 'Click to play animation'}
          >
            {play ? <Pause /> : <Play />}
          </button>
          <SliderUI
            min={uniqDatesSorted[0]}
            max={uniqDatesSorted[uniqDatesSorted.length - 1]}
            marks={markObj}
            step={null}
            defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
            value={uniqDatesSorted[index]}
            onChangeComplete={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            onChange={nextValue => {
              setIndex(uniqDatesSorted.indexOf(nextValue as number));
            }}
            aria-label='Time slider. Use arrow keys to adjust selected time period.'
          />
        </div>
      ) : null}
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {showColorScale && data.filter(el => el.color).length !== 0 ? (
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
              <Graph
                data={ensureCompleteDataForScatterPlot(data, timeline.dateFormat || 'yyyy').filter(
                  d =>
                    timeline.enabled
                      ? d.date ===
                        format(new Date(uniqDatesSorted[index]), timeline.dateFormat || 'yyyy')
                      : d,
                )}
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
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
                refXValues={refXValues}
                refYValues={refYValues}
                showLabels={showLabels}
                radius={radius}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                highlightAreaSettings={highlightAreaSettings}
                highlightedDataPoints={
                  data.filter(el => el.label).length === 0 ? [] : highlightedDataPoints
                }
                selectedColor={selectedColor}
                maxRadiusValue={
                  checkIfNullOrUndefined(maxRadiusValue)
                    ? Math.max(
                        ...data.map(d => d.radius).filter(d => d !== undefined && d !== null),
                      )
                    : (maxRadiusValue as number)
                }
                maxXValue={
                  checkIfNullOrUndefined(maxXValue)
                    ? Math.max(...data.map(d => d.x).filter(d => d !== undefined && d !== null)) > 0
                      ? Math.max(...data.map(d => d.x).filter(d => d !== undefined && d !== null))
                      : 0
                    : (maxXValue as number)
                }
                minXValue={
                  checkIfNullOrUndefined(minXValue)
                    ? Math.min(...data.map(d => d.x).filter(d => d !== undefined && d !== null)) > 0
                      ? 0
                      : Math.min(...data.map(d => d.x).filter(d => d !== undefined && d !== null))
                    : (minXValue as number)
                }
                maxYValue={
                  checkIfNullOrUndefined(maxYValue)
                    ? Math.max(...data.map(d => d.y).filter(d => d !== undefined && d !== null)) > 0
                      ? Math.max(...data.map(d => d.y).filter(d => d !== undefined && d !== null))
                      : 0
                    : (maxYValue as number)
                }
                minYValue={
                  checkIfNullOrUndefined(minYValue)
                    ? Math.min(...data.map(d => d.y).filter(d => d !== undefined && d !== null)) > 0
                      ? 0
                      : Math.min(...data.map(d => d.y).filter(d => d !== undefined && d !== null))
                    : (minYValue as number)
                }
                onSeriesMouseClick={onSeriesMouseClick}
                rtl={language === 'he' || language === 'ar'}
                annotations={annotations}
                customHighlightAreaSettings={customHighlightAreaSettings}
                regressionLine={regressionLine}
                resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                detailsOnClick={detailsOnClick}
                noOfXTicks={noOfXTicks}
                noOfYTicks={noOfYTicks}
                labelColor={labelColor}
                xSuffix={xSuffix}
                ySuffix={ySuffix}
                xPrefix={xPrefix}
                yPrefix={yPrefix}
                styles={styles}
                classNames={classNames}
                animate={
                  animate === true
                    ? { duration: 0.5, once: true, amount: 0.5 }
                    : animate || { duration: 0, once: true, amount: 0 }
                }
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
