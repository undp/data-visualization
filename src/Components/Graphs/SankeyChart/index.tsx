import orderBy from 'lodash.orderby';
import sum from 'lodash.sum';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';
import { GraphArea, GraphContainer } from '@/Components/Elements/GraphContainer';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  Languages,
  NodesLinkDataType,
  NumberFormatOptions,
  SankeyDataType,
  SourcesDataType,
  StyleObject,
} from '@/Types';
import { uniqBy } from '@/Utils/uniqBy';
import { Graph } from './Graph';

interface Props {
  // Data
  /** Array of data objects */
  data: SankeyDataType[];

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
  /** Color or array of colors for source */
  sourceColors?: string[] | string;
  /** Color or array of colors for targets */
  targetColors?: string[] | string;
  /** Domain of colors for the source */
  sourceColorDomain?: (string | number)[];
  /** Domain of colors for the target */
  targetColorDomain?: (string | number)[];
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
  /** Padding between nodes */
  nodePadding?: number;
  /** Thickness of each node */
  nodeWidth?: number;

  // Values and Ticks
  /** Truncate labels by specified length */
  truncateBy?: number;

  // Graph Parameters
  /** Title of the source */
  sourceTitle?: string;
  /** Title of the targets */
  targetTitle?: string;
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Option to position the labels */
  labelPosition?: 'inside' | 'outside' | 'overlap';
  /** Defines the width of the labels if the `labelPosition` is set to `inside`*/
  labelWidth?: number;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Source to highlight. Use the label value from data to highlight the data point */
  highlightedSourceDataPoints?: (string | number)[];
  /** Targets to highlight. Use the label value from data to highlight the data point */
  highlightedTargetDataPoints?: (string | number)[];
  /** Links to highlight. Use the label value from data to highlight the data point */
  highlightedLinks?: { source: string | number; target: string | number }[];
  /** Opacity of the links */
  defaultLinkOpacity?: number;
  /** Opacity of the nodes when other nodes are highlighted or hovered. If no value is provided then it take the value of `defaultLinkOpacity` */
  dimmedNodeOpacity?: number;
  /** Sorting order of the nodes */
  sortNodes?: 'asc' | 'desc' | 'mostReadable' | 'none';
  /** Toggles if the graph animates in when loaded.  */
  animate?: boolean | AnimateDataType;
  /** Configuration options for controlling number formatting, localization, prefixes/suffixes, precision, and zero padding. */
  numberDisplayOptions?: NumberFormatOptions;
  /** Optional SVG <g> element or function that renders custom content behind or in front of the graph. */
  customLayers?: CustomLayerDataType[];
  /** Enable graph download option as png */
  graphDownload?: boolean;
  /** Enable data download option as a csv */
  dataDownload?: boolean;
  /** Reset selection on double-click. Only applicable when used in a dashboard context with filters. */
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  /** Tooltip content when user mouseover on the links. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  /** Details displayed on the modal when user clicks of a data point. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  /** Callback for mouse over event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  /** Callback for mouse click event */
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  /** Language setting  */
  language?: Languages;
  /** Color theme */
  theme?: 'light' | 'dark';
  /** Unique ID for the graph */
  graphID?: string;
}

export function SankeyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    showLabels = true,
    leftMargin = 75,
    rightMargin = 75,
    topMargin = 30,
    bottomMargin = 10,
    truncateBy = 999,
    height,
    width,
    footNote,
    padding,
    backgroundColor = false,
    tooltip,
    onSeriesMouseOver,
    relativeHeight,
    showValues = true,
    graphID,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    fillContainer = true,
    language = 'en',
    minHeight = 0,
    theme = 'light',
    ariaLabel,
    sourceColors,
    targetColors,
    sourceColorDomain,
    targetColorDomain,
    nodePadding = 5,
    nodeWidth = 5,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    highlightedLinks,
    defaultLinkOpacity = 0.3,
    sourceTitle,
    targetTitle,
    sortNodes = 'mostReadable',
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    animate = false,
    customLayers = [],
    numberDisplayOptions,
    labelPosition = 'outside',
    labelWidth = 75,
    dimmedNodeOpacity,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [sankeyData, setSankeyData] = useState<NodesLinkDataType | undefined>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);

  const updateSankeyDataEvent = useEffectEvent((data: NodesLinkDataType) => {
    setSankeyData(data);
  });

  useEffect(() => {
    const sourceNodes = uniqBy(data, 'source', true).map((d) => ({
      name: `source_${d}`,
      type: 'source' as const,
      label: `${d}`,
      color:
        typeof sourceColors === 'string' || !sourceColors
          ? sourceColors || Colors.graphMainColor
          : sourceColors[
              (sourceColorDomain || uniqBy(data, 'source', true)).findIndex(
                (el) => `${el}` === `${d}`,
              ) > sourceColors.length
                ? sourceColors.length - 1
                : (sourceColorDomain || uniqBy(data, 'source', true)).findIndex(
                    (el) => `${el}` === `${d}`,
                  )
            ],
      totalValue: sum(data.filter((el) => `${el.source}` === `${d}`).map((el) => el.value)),
    }));
    const sourceNodesSorted =
      sortNodes === 'asc' || sortNodes === 'desc'
        ? orderBy(sourceNodes, ['totalValue'], [sortNodes])
        : sourceNodes;
    const targetNodes = uniqBy(data, 'target', true).map((d) => ({
      name: `target_${d}`,
      type: 'target' as const,
      label: `${d}`,
      color:
        typeof targetColors === 'string' || !targetColors
          ? targetColors || Colors.graphMainColor
          : targetColors[
              (targetColorDomain || uniqBy(data, 'target', true)).findIndex(
                (el) => `${el}` === `${d}`,
              ) > targetColors.length
                ? targetColors.length - 1
                : (targetColorDomain || uniqBy(data, 'target', true)).findIndex(
                    (el) => `${el}` === `${d}`,
                  )
            ],
      totalValue: sum(data.filter((el) => `${el.target}` === `${d}`).map((el) => el.value)),
    }));
    const targetNodesSorted =
      sortNodes === 'asc' || sortNodes === 'desc'
        ? orderBy(targetNodes, ['totalValue'], [sortNodes])
        : targetNodes;

    const nodes = [...sourceNodesSorted, ...targetNodesSorted];
    updateSankeyDataEvent({
      nodes: nodes.map((d) => ({
        ...d,
        data: { node: d.label, value: d.totalValue, type: d.type },
      })),
      links: data.map((d) => ({
        source: nodes.findIndex((el) => el.name === `source_${d.source}`),
        target: nodes.findIndex((el) => el.name === `target_${d.target}`),
        value: d.value,
        data: { ...d },
      })),
    });
  }, [data, sortNodes, sourceColorDomain, sourceColors, targetColorDomain, targetColors]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
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
      width={fillContainer ? undefined : width}
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
              ? data.map((d) => d.data).filter((d) => d !== undefined).length > 0
                ? data.map((d) => d.data).filter((d) => d !== undefined)
                : data.filter((d) => d !== undefined)
              : null
          }
        />
      ) : null}
      <GraphArea ref={graphDiv}>
        {data.length === 0 && <EmptyState />}
        {svgWidth && svgHeight && sankeyData && data.length > 0 ? (
          <Graph
            data={sankeyData}
            nodePadding={nodePadding}
            nodeWidth={nodeWidth}
            width={fillContainer || !width ? svgWidth : svgWidth < width ? svgWidth : width}
            height={svgHeight}
            showLabels={showLabels}
            leftMargin={leftMargin}
            rightMargin={rightMargin}
            topMargin={topMargin}
            bottomMargin={bottomMargin}
            truncateBy={truncateBy}
            tooltip={tooltip}
            onSeriesMouseOver={onSeriesMouseOver}
            showValues={showValues}
            onSeriesMouseClick={onSeriesMouseClick}
            highlightedSourceDataPoints={highlightedSourceDataPoints?.map((d) => `${d}`)}
            highlightedTargetDataPoints={highlightedTargetDataPoints?.map((d) => `${d}`)}
            defaultLinkOpacity={defaultLinkOpacity}
            sourceTitle={sourceTitle}
            targetTitle={targetTitle}
            sortNodes={sortNodes}
            resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
            styles={styles}
            classNames={classNames}
            detailsOnClick={detailsOnClick}
            animate={
              animate === true
                ? { duration: 0.5, once: true, amount: 0.5 }
                : animate || { duration: 0, once: true, amount: 0 }
            }
            customLayers={customLayers}
            locale={numberDisplayOptions?.locale || 'en'}
            padZeros={numberDisplayOptions?.padZeros || false}
            suffix={numberDisplayOptions?.suffix || ''}
            prefix={numberDisplayOptions?.prefix || ''}
            precision={numberDisplayOptions?.precision ?? 2}
            labelPosition={labelPosition}
            labelWidth={labelWidth}
            dimmedNodeOpacity={dimmedNodeOpacity ?? defaultLinkOpacity}
            highlightedLinks={highlightedLinks}
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
