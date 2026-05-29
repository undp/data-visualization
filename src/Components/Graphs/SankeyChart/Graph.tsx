import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';
import { sankey, sankeyCenter, sankeyLinkHorizontal } from 'd3-sankey';
import isEqual from 'fast-deep-equal';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
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
  id: string;
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
    id,
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
  } = props;
  const svgRef = useRef(null);
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const { nodes, links } = sankeyGenerator(data as any);
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
                      x={0 - leftMargin}
                      width={leftMargin}
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
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
                              'sankey-right-label text-right',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color: (d as NodeDataType).color,
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
                              'sankey-right-value text-right font-bold',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color: (d as NodeDataType).color,
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
                      x={nodeWidth}
                      width={rightMargin - nodeWidth}
                      height={(d.y1 || 0) - (d.y0 || 0) + nodePadding}
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
                              'sankey-left-label text-left',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color: (d as NodeDataType).color,
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
                              'sankey-left-value text-left font-bold',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              hyphens: 'auto',
                              color: (d as NodeDataType).color,
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
              {links.map((d, i) => (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={`${d.source}-${d.target}`}
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
                  variants={{
                    initial: {
                      opacity: selectedNode
                        ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.source as any).name === selectedNode.name ||
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.target as any).name === selectedNode.name
                          ? 0.85
                          : defaultLinkOpacity
                        : highlightedSourceDataPoints || highlightedTargetDataPoints
                          ? highlightedSourceDataPoints?.indexOf(
                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              (d.source as any).label,
                            ) !== -1 ||
                            highlightedTargetDataPoints?.indexOf(
                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              (d.target as any).label,
                            ) !== -1
                            ? 0.85
                            : defaultLinkOpacity
                          : defaultLinkOpacity,
                    },
                    whileInView: {
                      opacity: selectedNode
                        ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.source as any).name === selectedNode.name ||
                          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.target as any).name === selectedNode.name
                          ? 0.85
                          : defaultLinkOpacity
                        : highlightedSourceDataPoints || highlightedTargetDataPoints
                          ? highlightedSourceDataPoints?.indexOf(
                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              (d.source as any).label,
                            ) !== -1 ||
                            highlightedTargetDataPoints?.indexOf(
                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              (d.target as any).label,
                            ) !== -1
                            ? 0.85
                            : defaultLinkOpacity
                          : defaultLinkOpacity,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                >
                  <motion.path
                    key={`${d.source}-${d.target}`}
                    d={linkPathGenerator(d) || ''}
                    style={{
                      stroke: `url(#${id}-gradient-${i})`,
                      strokeWidth: d.width,
                      fill: 'none',
                    }}
                    exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    variants={{
                      initial: {
                        pathLength: 0,
                        opacity: 1,
                      },
                      whileInView: {
                        pathLength: 1,
                        opacity: 1,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  />
                </motion.g>
              ))}
            </AnimatePresence>
          </g>
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
