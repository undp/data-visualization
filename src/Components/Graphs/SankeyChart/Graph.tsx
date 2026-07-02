import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey';
import isEqual from 'fast-deep-equal';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  NodeDataType,
  NodesLinkDataType,
  StyleObject,
} from '@/Types';
import { generateRandomString } from '@/Utils/generateRandomString';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  data: NodesLinkDataType;
  showLabels: boolean;
  leftMargin: number;
  truncateBy: number;
  defaultLinkOpacity: number;
  width: number;
  height: number;
  nodePadding: number;
  nodeWidth: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  highlightedSourceDataPoints?: string[];
  highlightedTargetDataPoints?: string[];
  sourceTitle?: string;
  targetTitle?: string;
  animate: AnimateDataType;
  sortNodes: 'asc' | 'desc' | 'mostReadable' | 'none';
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  precision: number;
  customLayers: CustomLayerDataType[];
  locale: string;
  padZeros: boolean;
  labelPosition: 'inside' | 'outside' | 'overlap';
  labelWidth: number;
  dimmedNodeOpacity: number;
}

export function Graph(props: Props) {
  const {
    data,
    showLabels,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showValues,
    onSeriesMouseClick,
    nodePadding,
    nodeWidth,
    highlightedSourceDataPoints,
    highlightedTargetDataPoints,
    defaultLinkOpacity,
    sourceTitle,
    targetTitle,
    animate,
    sortNodes,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    precision,
    customLayers,
    locale,
    padZeros,
    labelPosition,
    labelWidth,
    dimmedNodeOpacity,
  } = props;
  const svgRef = useRef(null);
  const id = useMemo(() => generateRandomString(8), []);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [selectedNode, setSelectedNode] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const sankeyGenerator =
    sortNodes === 'mostReadable'
      ? sankey()
          .nodeWidth(nodeWidth)
          .nodePadding(nodePadding)
          .size([graphWidth, graphHeight])
          .nodeAlign(sankeyCenter)
      : sortNodes === 'none'
        ? sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .size([graphWidth, graphHeight])
            .nodeAlign(sankeyCenter)
            .nodeSort(null)
            .linkSort(null)
        : sankey()
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .size([graphWidth, graphHeight])
            .nodeAlign(sankeyCenter)
            .nodeSort(
              sortNodes === 'desc'
                ? (a, b) => (b.value || 0) - (a.value || 0)
                : (a, b) => (a.value || 0) - (b.value || 0),
            );
  const sankeyData = {
    nodes: data.nodes.map((node) => ({ ...node })),
    links: data.links.map((link) => ({ ...link })),
  };

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const { nodes, links } = sankeyGenerator(sankeyData as any);
  const linkPathGenerator = sankeyLinkHorizontal();
  return (
    <>
      <motion.svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        direction='ltr'
        ref={svgRef}
      >
        {sourceTitle ? (
          <text
            x={margin.left}
            y={margin.top - 10}
            className='text-base font-bold fill-primary-gray-700 dark:fill-primary-gray-100'
            style={{ textAnchor: 'start' }}
          >
            {sourceTitle}
          </text>
        ) : null}
        {targetTitle ? (
          <text
            x={width - margin.right}
            y={margin.top - 10}
            className='text-base font-bold fill-primary-gray-700 dark:fill-primary-gray-100'
            style={{ textAnchor: 'end' }}
          >
            {targetTitle}
          </text>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
          <defs>
            {links.map((d, i) => (
              <linearGradient
                id={`${id}-gradient-${i}`}
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                key={i}
                gradientUnits='userSpaceOnUse'
              >
                <stop
                  offset='0%'
                  style={{
                    stopColor: (d.source as NodeDataType).color,
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset='100%'
                  style={{
                    stopColor: (d.target as NodeDataType).color,
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            ))}
          </defs>
          <g>
            <AnimatePresence>
              {links.map((d, i) => {
                const isLinkHighlighted =
                  highlightedSourceDataPoints?.some(
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    (el) => `source_${el}` === (d.source as any).name,
                  ) ||
                  highlightedTargetDataPoints?.some(
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    (el) => `target_${el}` === (d.target as any).name,
                  );
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    key={`${(d.source as any).name}-${(d.target as any).name}`}
                    onMouseEnter={(event) => {
                      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                      setMouseOverData((d as any).data);
                      setEventY(event.clientY);
                      setEventX(event.clientX);

                      onSeriesMouseOver?.(d);
                    }}
                    onMouseMove={(event) => {
                      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                      setMouseOverData((d as any).data);
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                    }}
                    onClick={() => {
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          isEqual(mouseClickData, (d as any).data) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          setMouseClickData((d as any).data);
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          onSeriesMouseClick?.((d as any).data);
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      setMouseOverData(undefined);
                      setEventX(undefined);
                      setEventY(undefined);
                      onSeriesMouseOver?.(undefined);
                    }}
                    opacity={
                      selectedNode
                        ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.source as any).name === selectedNode.name ||
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.target as any).name === selectedNode.name
                          ? 0.85
                          : defaultLinkOpacity
                        : highlightedSourceDataPoints || highlightedTargetDataPoints
                          ? isLinkHighlighted
                            ? 0.85
                            : defaultLinkOpacity
                          : defaultLinkOpacity
                    }
                  >
                    <motion.path
                      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                      key={`${(d.source as any).name}-${(d.target as any).name}`}
                      d={linkPathGenerator(d) || ''}
                      style={{
                        fill: 'none',
                      }}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      variants={{
                        initial: {
                          pathLength: 0,
                          opacity: 1,
                          strokeWidth: d.width,
                          stroke: `url(#${id}-gradient-${i})`,
                        },
                        whileInView: {
                          pathLength: 1,
                          opacity: 1,
                          strokeWidth: d.width,
                          stroke: `url(#${id}-gradient-${i})`,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </g>
          {nodes
            // biome-ignore lint/suspicious/noExplicitAny: undefined data type
            .filter((d: any) => d.type === 'source')
            .map((d, i) => (
              // biome-ignore lint/a11y/noStaticElementInteractions: interaction for graph
              <g
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                key={i}
                onMouseEnter={() => {
                  setSelectedNode(d);
                }}
                onFocus={() => {
                  setSelectedNode(d);
                }}
                onMouseLeave={() => {
                  setSelectedNode(undefined);
                }}
                opacity={
                  selectedNode && selectedNode.type === 'source'
                    ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                      selectedNode.name === (d as any).name
                      ? 1
                      : dimmedNodeOpacity
                    : highlightedSourceDataPoints
                      ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        highlightedSourceDataPoints.includes((d as any).label)
                        ? 1
                        : dimmedNodeOpacity
                      : 1
                }
              >
                <g transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    x={0}
                    y={0}
                    width={(d.x1 || 0) - (d.x0 || 0)}
                    height={(d.y1 || 0) - (d.y0 || 0)}
                    style={{ fill: (d as NodeDataType).color }}
                  />
                  {showLabels || showValues ? (
                    <foreignObject
                      y={0 - nodePadding / 2}
                      x={
                        labelPosition === 'outside'
                          ? 0 - leftMargin
                          : labelPosition === 'inside'
                            ? nodeWidth
                            : 0
                      }
                      width={
                        labelPosition === 'outside'
                          ? leftMargin
                          : labelPosition === 'inside'
                            ? labelWidth
                            : nodeWidth
                      }
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
                      opacity={(d.y1 || 0) - (d.y0 || 0) + nodePadding < 25 ? 0 : 1}
                    >
                      <div
                        className='flex flex-col gap-0.5 justify-center py-0 px-1.5'
                        style={{
                          height: `${(d.y1 || 0) - (d.y0 || 0) + nodePadding}px`,
                          overflow: 'visible',
                        }}
                      >
                        {showLabels ? (
                          <P
                            marginBottom={showValues ? '3xs' : 'none'}
                            size='sm'
                            leading='none'
                            className={cn(
                              'sankey-source-label',
                              labelPosition === 'outside' ? 'text-right' : 'text-left',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color:
                                labelPosition === 'outside'
                                  ? (d as NodeDataType).color
                                  : labelPosition === 'inside'
                                    ? 'var(--gray-700)'
                                    : getTextColorBasedOnBgColor((d as NodeDataType).color),
                              ...styles?.graphObjectValues,
                            }}
                          >
                            {`${(d as NodeDataType).label}`.length < truncateBy
                              ? `${(d as NodeDataType).label}`
                              : `${`${(d as NodeDataType).label}`.substring(0, truncateBy)}...`}
                          </P>
                        ) : null}
                        {showValues ? (
                          <P
                            marginBottom='none'
                            size='sm'
                            leading='none'
                            className={cn(
                              'sankey-source-value font-bold',
                              labelPosition === 'outside' ? 'text-right' : 'text-left',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color:
                                labelPosition === 'outside'
                                  ? (d as NodeDataType).color
                                  : labelPosition === 'inside'
                                    ? 'var(--gray-700)'
                                    : getTextColorBasedOnBgColor((d as NodeDataType).color),
                              ...styles?.graphObjectValues,
                            }}
                          >
                            {numberFormattingFunction(
                              d.value,
                              undefined,
                              precision,
                              prefix,
                              suffix,
                              locale,
                              padZeros,
                            )}
                          </P>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              </g>
            ))}
          {nodes
            // biome-ignore lint/suspicious/noExplicitAny: undefined data type
            .filter((d: any) => d.type === 'target')
            .map((d, i) => (
              // biome-ignore lint/a11y/noStaticElementInteractions: interaction for graph
              <g
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                key={i}
                onMouseEnter={() => {
                  setSelectedNode(d);
                }}
                onFocus={() => {
                  setSelectedNode(d);
                }}
                onMouseLeave={() => {
                  setSelectedNode(undefined);
                }}
                opacity={
                  selectedNode && selectedNode.type === 'target'
                    ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                      selectedNode.name === (d as any).name
                      ? 1
                      : dimmedNodeOpacity
                    : highlightedTargetDataPoints
                      ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        highlightedTargetDataPoints.includes((d as any).label)
                        ? 1
                        : dimmedNodeOpacity
                      : 1
                }
              >
                <g transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    x={0}
                    y={0}
                    width={(d.x1 || 0) - (d.x0 || 0)}
                    height={(d.y1 || 0) - (d.y0 || 0)}
                    style={{ fill: (d as NodeDataType).color }}
                  />
                  {showLabels || showValues ? (
                    <foreignObject
                      y={0 - nodePadding / 2}
                      x={
                        labelPosition === 'outside'
                          ? nodeWidth
                          : labelPosition === 'inside'
                            ? 0 - labelWidth
                            : 0
                      }
                      width={
                        labelPosition === 'outside'
                          ? rightMargin
                          : labelPosition === 'inside'
                            ? labelWidth
                            : nodeWidth
                      }
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
                      opacity={(d.y1 || 0) - (d.y0 || 0) + nodePadding < 25 ? 0 : 1}
                    >
                      <div
                        className='flex flex-col gap-0.5 justify-center py-0 px-1.5'
                        style={{
                          height: `${(d.y1 || 0) - (d.y0 || 0) + nodePadding}px`,
                        }}
                      >
                        {showLabels ? (
                          <P
                            marginBottom={showValues ? '3xs' : 'none'}
                            size='sm'
                            leading='none'
                            className={cn(
                              'sankey-target-label',
                              labelPosition === 'outside' ? 'text-left' : 'text-right',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color:
                                labelPosition === 'outside'
                                  ? (d as NodeDataType).color
                                  : labelPosition === 'inside'
                                    ? 'var(--gray-700)'
                                    : getTextColorBasedOnBgColor((d as NodeDataType).color),
                              ...styles?.graphObjectValues,
                            }}
                          >
                            {`${(d as NodeDataType).label}`.length < truncateBy
                              ? `${(d as NodeDataType).label}`
                              : `${`${(d as NodeDataType).label}`.substring(0, truncateBy)}...`}
                          </P>
                        ) : null}
                        {showValues ? (
                          <P
                            size='sm'
                            leading='none'
                            marginBottom='none'
                            className={cn(
                              'sankey-target-value font-bold',
                              labelPosition === 'outside' ? 'text-left' : 'text-right',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color:
                                labelPosition === 'outside'
                                  ? (d as NodeDataType).color
                                  : labelPosition === 'inside'
                                    ? 'var(--gray-700)'
                                    : getTextColorBasedOnBgColor((d as NodeDataType).color),
                              ...styles?.graphObjectValues,
                            }}
                          >
                            {numberFormattingFunction(
                              d.value,
                              undefined,
                              precision,
                              prefix,
                              suffix,
                              locale,
                              padZeros,
                            )}
                          </P>
                        ) : null}
                      </div>
                    </foreignObject>
                  ) : null}
                </g>
              </g>
            ))}
          {customLayers.filter((d) => d.position === 'after').map((d) => d.layer)}
        </g>
      </motion.svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={styles?.tooltip}
          className={classNames?.tooltip}
        />
      ) : null}
      {detailsOnClick && mouseClickData !== undefined ? (
        <DetailsModal
          body={detailsOnClick}
          data={mouseClickData}
          setData={setMouseClickData}
          className={classNames?.modal}
        />
      ) : null}
    </>
  );
}
