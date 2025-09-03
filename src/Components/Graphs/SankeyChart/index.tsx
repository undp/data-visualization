import { useState, useRef, useEffect } from 'react';
import uniqBy from 'lodash.uniqby';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { cn } from '@undp/design-system-react/cn';

import { Graph } from './Graph';

import { GraphHeader } from '@/Components/Elements/GraphHeader';
import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  Languages,
  NodesLinkDataType,
  SankeyDataType,
  SourcesDataType,
  StyleObject,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { Colors } from '@/Components/ColorPalette';
import { generateRandomString } from '@/Utils/generateRandomString';
import { EmptyState } from '@/Components/Elements/EmptyState';

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
  /** Prefix for values */
  prefix?: string;
  /** Suffix for values */
  suffix?: string;
  /** Truncate labels by specified length */
  truncateBy?: number;

  // Graph Parameters
  /** Title of the source */
  sourceTitle?: string;
  /** Title of the targets */
  targetTitle?: string;
  /** Toggle visibility of labels */
  showLabels?: boolean;
  /** Toggle visibility of values */
  showValues?: boolean;
  /** Source to highlight. Use the label value from data to highlight the data point */
  highlightedSourceDataPoints?: (string | number)[];
  /** Targets to highlight. Use the label value from data to highlight the data point */
  highlightedTargetDataPoints?: (string | number)[];
  /** Opacity of the links */
  defaultLinkOpacity?: number;
  /** Sorting order of the nodes */
  sortNodes?: 'asc' | 'desc' | 'mostReadable' | 'none';
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
  /** Tooltip content when user mouseover on the links. If the type is string then this uses the [handlebar](../?path=/docs/misc-handlebars-templates-and-custom-helpers--docs) template to display the data */
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
    backgroundColor,
    tooltip,
    onSeriesMouseOver,
    suffix = '',
    prefix = '',
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
    highlightedSourceDataPoints = [],
    highlightedTargetDataPoints = [],
    defaultLinkOpacity = 0.3,
    sourceTitle,
    targetTitle,
    sortNodes = 'mostReadable',
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
    animate = false,
    precision = 2,
    customLayers = [],
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [sankeyData, setSankeyData] = useState<NodesLinkDataType | undefined>(undefined);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sourceNodes = uniqBy(data, 'source').map(d => ({
      name: `source_${d.source}`,
      type: 'source' as const,
      label: `${d.source}`,
      color:
        typeof sourceColors === 'string' || !sourceColors
          ? sourceColors || Colors.graphMainColor
          : sourceColors[
              (sourceColorDomain || uniqBy(data, 'source').map(el => `${el.source}`)).findIndex(
                el => `${el}` === `${d.source}`,
              ) > sourceColors.length
                ? sourceColors.length - 1
                : (sourceColorDomain || uniqBy(data, 'source').map(el => `${el.source}`)).findIndex(
                    el => `${el}` === `${d.source}`,
                  )
            ],
      totalValue: sum(data.filter(el => `${el.source}` === `${d.source}`).map(el => el.value)),
    }));
    const sourceNodesSorted =
      sortNodes === 'asc'
        ? sortBy(sourceNodes, d => d.totalValue)
        : sortNodes === 'desc'
          ? sortBy(sourceNodes, d => d.totalValue).reverse()
          : sourceNodes;
    const targetNodes = uniqBy(data, 'target').map(d => ({
      name: `target_${d.target}`,
      type: 'target' as const,
      label: `${d.target}`,
      color:
        typeof targetColors === 'string' || !targetColors
          ? targetColors || Colors.graphMainColor
          : targetColors[
              (targetColorDomain || uniqBy(data, 'target').map(el => `${el.target}`)).findIndex(
                el => `${el}` === `${d.target}`,
              ) > targetColors.length
                ? targetColors.length - 1
                : (targetColorDomain || uniqBy(data, 'target').map(el => `${el.target}`)).findIndex(
                    el => `${el}` === `${d.target}`,
                  )
            ],
      totalValue: sum(data.filter(el => `${el.target}` === `${d.target}`).map(el => el.value)),
    }));
    const targetNodesSorted =
      sortNodes === 'asc'
        ? sortBy(targetNodes, d => d.totalValue)
        : sortNodes === 'desc'
          ? sortBy(targetNodes, d => d.totalValue).reverse()
          : targetNodes;

    const nodes = [...sourceNodesSorted, ...targetNodesSorted];
    setSankeyData({
      nodes,
      links: data.map(d => ({
        source: nodes.findIndex(el => el.name === `source_${d.source}`),
        target: nodes.findIndex(el => el.name === `target_${d.target}`),
        value: d.value,
        data: { ...d },
      })),
    });
  }, [data, sortNodes, sourceColorDomain, sourceColors, targetColorDomain, targetColors]);

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

  return (
    <div
      className={`${theme || 'light'} flex ${width ? 'grow-0' : 'grow'} ${
        !fillContainer ? 'w-fit' : 'w-full'
      } `}
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
          }This is a sankey chart showing flow. ${graphDescription ? ` ${graphDescription}` : ''}`
        }
      >
        <div
          className='flex grow'
          style={{ padding: backgroundColor ? padding || '1rem' : padding || 0 }}
        >
          <div className='flex flex-col gap-4 w-full grow justify-between'>
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
                <div
                  className='flex flex-col grow justify-center gap-3 w-full leading-0'
                  ref={graphDiv}
                  aria-label='Graph area'
                >
                  {(width || svgWidth) && (height || svgHeight) && sankeyData ? (
                    <Graph
                      data={sankeyData}
                      width={width || svgWidth}
                      nodePadding={nodePadding}
                      nodeWidth={nodeWidth}
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
                      showLabels={showLabels}
                      leftMargin={leftMargin}
                      rightMargin={rightMargin}
                      topMargin={topMargin}
                      bottomMargin={bottomMargin}
                      truncateBy={truncateBy}
                      tooltip={tooltip}
                      onSeriesMouseOver={onSeriesMouseOver}
                      showValues={showValues}
                      suffix={suffix}
                      prefix={prefix}
                      onSeriesMouseClick={onSeriesMouseClick}
                      id={generateRandomString(8)}
                      highlightedSourceDataPoints={highlightedSourceDataPoints.map(d => `${d}`)}
                      highlightedTargetDataPoints={highlightedTargetDataPoints.map(d => `${d}`)}
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
                      precision={precision}
                      customLayers={customLayers}
                    />
                  ) : null}
                </div>
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
