import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';

import {
  Languages,
  LineChartDataType,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  CurveTypes,
  CustomLayerDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { Colors } from '@/Components/ColorPalette';
import { generateRandomString } from '@/Utils/generateRandomString';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';

interface Props {
  // Data
  /** Array of data objects */
  data: LineChartDataType[];

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
  /** Colors of the lines */
  lineColor?: string;
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
  /** Maximum value for the chart */
  maxValue?: number;
  /** Minimum value for the chart */
  minValue?: number;

  // Graph Parameters
  /** Format of the date in the data object. Available formats can be found [here](https://date-fns.org/docs/format)  */
  dateFormat?: string;
  /** Toggles the visibility of the area below the line */
  area?: boolean;
  /** Curve type for the line */
  curveType?: CurveTypes;
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

export function SparkLine(props: Props) {
  const {
    data,
    graphTitle,
    lineColor,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    dateFormat = 'yyyy',
    area = false,
    padding,
    backgroundColor = true,
    leftMargin = 5,
    rightMargin = 5,
    topMargin = 10,
    bottomMargin = 20,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    minValue,
    maxValue,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    curveType = 'curve',
    styles,
    classNames,
    customLayers = [],
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
      <GraphArea ref={graphDiv}>
        {svgWidth && svgHeight ? (
          <Graph
            data={data}
            lineColor={lineColor || Colors.primaryColors['blue-600']}
            width={svgWidth}
            height={svgHeight}
            dateFormat={dateFormat}
            areaId={area ? generateRandomString(8) : undefined}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            minValue={minValue}
            maxValue={maxValue}
            curveType={curveType}
            styles={styles}
            classNames={classNames}
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
