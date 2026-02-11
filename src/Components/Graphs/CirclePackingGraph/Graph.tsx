import { useEffect, useState, useRef } from 'react';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import orderBy from 'lodash.orderby';
import { scaleSqrt } from 'd3-scale';
import { extent } from 'd3-array';
import forceBoundary from 'd3-force-boundary';
import { cn } from '@undp/design-system-react/cn';
import { Spinner } from '@undp/design-system-react/Spinner';
import { P } from '@undp/design-system-react/Typography';

import { ClassNameObject, StyleObject, TreeMapDataType } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { Colors } from '@/Components/ColorPalette';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { DetailsModal } from '@/Components/Elements/DetailsModal';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  theme: 'light' | 'dark';
  maxRadiusValue?: number;
  radius: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  dimmedOpacity: number;
  precision: number;
}

interface TreeMapDataTypeForBubbleChart extends TreeMapDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const Graph = (props: Props) => {
  const {
    data,
    colors,
    leftMargin,
    width,
    height,
    colorDomain,
    selectedColor,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    showValues,
    suffix,
    prefix,
    highlightedDataPoints,
    onSeriesMouseClick,
    maxRadiusValue,
    radius,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    dimmedOpacity,
    precision,
  } = props;
  const svgRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [viewPortDimensions, setViewPortDimensions] = useState<
    [number, number, number, number] | undefined
  >(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const [finalData, setFinalData] = useState<TreeMapDataTypeForBubbleChart[] | null>(null);

  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };

  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  // Memoize data ordering and radius scale
  const dataOrdered =
    data.filter(d => !checkIfNullOrUndefined(d.size)).length === 0
      ? data
      : orderBy(
          data.filter(d => !checkIfNullOrUndefined(d.size)),
          'radius',
          'asc',
        );

  const radiusScale =
    data.filter(d => d.size === undefined || d.size === null).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? Math.max(...data.map(d => d.size).filter(d => d !== undefined && d !== null))
              : (maxRadiusValue as number),
          ])
          .range([0.25, radius])
          .nice()
      : undefined;

  // Memoize simulation setup
  useEffect(() => {
    const setupSimulation = () => {
      const dataTemp = dataOrdered.map(d => ({ ...d, ...(d.data && { data: { ...d.data } }) }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const simulation = forceSimulation(dataTemp as any)
        .force('y', forceY(_d => graphHeight / 2).strength(1))
        .force('x', forceX(_d => graphWidth / 2).strength(1))
        .force(
          'collide',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          forceCollide((d: any) => (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1)),
        )
        .force('charge', forceManyBody().strength(-15))
        .force('boundary', forceBoundary(0, 0, graphWidth, graphHeight).strength(0.2).border(50))
        .alphaDecay(0.05)
        .tick(10000);

      simulation
        .on('tick', () => {
          setFinalData(dataTemp as TreeMapDataTypeForBubbleChart[]);
        })
        .on('end', () => {
          setFinalData(dataTemp as TreeMapDataTypeForBubbleChart[]);
          const xMinExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d => d.x - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const yMinExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d => d.y - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const xMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d => d.x + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[1] || 0;
          const yMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              d => d.y + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[1] || 0;
          setViewPortDimensions([
            xMinExtent,
            yMinExtent,
            xMinExtent < 0 ? xMaxExtent - xMinExtent : xMaxExtent,
            yMinExtent < 0 ? yMaxExtent - yMinExtent : yMaxExtent,
          ]);
        });
    };

    setupSimulation();
  }, [data, radius, graphHeight, graphWidth, maxRadiusValue, dataOrdered, radiusScale]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseEnter = (event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
    onSeriesMouseOver?.(d);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseMove = (event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (d: any) => {
    if (onSeriesMouseClick || detailsOnClick) {
      if (mouseClickData === d.label && resetSelectionOnDoubleClick) {
        setMouseClickData(undefined);
        onSeriesMouseClick?.(undefined);
      } else {
        setMouseClickData(d.label);
        onSeriesMouseClick?.(d);
      }
    }
  };

  const handleMouseLeave = () => {
    setMouseOverData(undefined);
    setEventX(undefined);
    setEventY(undefined);
    onSeriesMouseOver?.(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCircleColor = (d: any) =>
    data.filter(el => el.color).length === 0
      ? colors[0]
      : !d.color
        ? Colors.gray
        : colors[colorDomain.indexOf(d.color)];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOpacity = (d: any) =>
    selectedColor
      ? d.color
        ? colors[colorDomain.indexOf(d.color)] === selectedColor
          ? 1
          : dimmedOpacity
        : dimmedOpacity
      : highlightedDataPoints.length !== 0
        ? highlightedDataPoints.indexOf(d.label) !== -1
          ? 0.85
          : dimmedOpacity
        : 0.85;

  // Render loading state
  if (!finalData) {
    return (
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
          <Spinner />
        </div>
      </div>
    );
  }
  if (viewPortDimensions) {
    return (
      <>
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`${viewPortDimensions[0] > 0 ? 0 : viewPortDimensions[0]} ${
            viewPortDimensions[1] > 0 ? 0 : viewPortDimensions[1]
          } ${width < viewPortDimensions[2] ? viewPortDimensions[2] : width} ${
            height < viewPortDimensions[3] ? viewPortDimensions[3] : height
          }`}
          direction='ltr'
          ref={svgRef}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {finalData.map(d => {
              const circleColor = getCircleColor(d);
              const opacity = getOpacity(d);
              const bubbleRadius = radiusScale ? radiusScale(d.size || 0) : radius;
              const showLabel = bubbleRadius > 20 && (showLabels || showValues);
              return (
                <g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  opacity={opacity}
                  transform={`translate(${d.x},${d.y})`}
                  onMouseEnter={event => handleMouseEnter(event, d)}
                  onMouseMove={event => handleMouseMove(event, d)}
                  onClick={() => handleClick(d)}
                  onMouseLeave={handleMouseLeave}
                >
                  <circle cx={0} cy={0} r={bubbleRadius} fill={circleColor} />
                  {(showLabel || showValues) &&
                    d.size !== undefined &&
                    d.size !== null &&
                    bubbleRadius >= 15 && (
                      <g>
                        <foreignObject
                          y={0 - bubbleRadius}
                          x={0 - bubbleRadius}
                          width={2 * bubbleRadius}
                          height={2 * bubbleRadius}
                        >
                          <div
                            className='flex flex-col justify-center items-center h-full py-0 px-3'
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                              padding: '0 0.75rem',
                            }}
                          >
                            {showLabels && (
                              <P
                                className={cn(
                                  'text-center leading-[1.25] overflow-hidden m-0 circle-packing-label',
                                  classNames?.graphObjectValues,
                                )}
                                marginBottom='none'
                                style={{
                                  fontSize: `${Math.min(
                                    Math.max(Math.round(bubbleRadius / 4), 12),
                                    Math.max(
                                      Math.round((bubbleRadius * 12) / `${d.label}`.length),
                                      12,
                                    ),
                                    14,
                                  )}px`,
                                  WebkitLineClamp:
                                    bubbleRadius * 2 < 60
                                      ? 1
                                      : bubbleRadius * 2 < 75
                                        ? 2
                                        : bubbleRadius * 2 < 100
                                          ? 3
                                          : undefined,
                                  display: '-webkit-box',
                                  WebkitBoxOrient: 'vertical',
                                  color: getTextColorBasedOnBgColor(circleColor),
                                  hyphens: 'auto',
                                  ...(styles?.graphObjectValues || {}),
                                }}
                              >
                                {d.label}
                              </P>
                            )}
                            {showValues && (
                              <P
                                className='text-center font-bold leading-[1.25] w-full m-0 circle-packing-value'
                                marginBottom='none'
                                style={{
                                  fontSize: `${Math.min(
                                    Math.max(Math.round(bubbleRadius / 4), 14),
                                    14,
                                  )}px`,
                                  color: getTextColorBasedOnBgColor(circleColor),
                                }}
                              >
                                {numberFormattingFunction(d.size, 'NA', precision, prefix, suffix)}
                              </P>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    )}
                </g>
              );
            })}
          </g>
        </svg>
        {mouseOverData && tooltip && eventX && eventY && (
          <Tooltip
            data={mouseOverData}
            body={tooltip}
            xPos={eventX}
            yPos={eventY}
            backgroundStyle={styles?.tooltip}
            className={classNames?.tooltip}
          />
        )}
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
  return null;
};
