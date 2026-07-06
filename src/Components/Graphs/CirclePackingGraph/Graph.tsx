import { cn } from '@undp/design-system-react/cn';
import { Spinner } from '@undp/design-system-react/Spinner';
import { P } from '@undp/design-system-react/Typography';
import { extent } from 'd3-array';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import forceBoundary from 'd3-force-boundary';
import { scaleSqrt } from 'd3-scale';
import orderBy from 'lodash.orderby';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type { ClassNameObject, StyleObject, TreeMapDataType } from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  showLabels: boolean | ((_d: any) => React.ReactNode);
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  theme: 'light' | 'dark';
  maxRadiusValue?: number;
  radius: number;
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  dimmedOpacity: number;
  precision: number;
  locale: string;
  padZeros: boolean;
  minLabelRadius: number;
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
    locale,
    padZeros,
    minLabelRadius,
  } = props;
  const svgRef = useRef(null);

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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

  const dataOrdered = useMemo(
    () =>
      data.filter((d) => !checkIfNullOrUndefined(d.size)).length === 0
        ? data
        : orderBy(
            data.filter((d) => !checkIfNullOrUndefined(d.size)),
            'radius',
            'asc',
          ),
    [data],
  );

  const radiusScale = useMemo(
    () =>
      data.filter((d) => d.size === undefined || d.size === null).length !== data.length
        ? scaleSqrt()
            .domain([
              0,
              checkIfNullOrUndefined(maxRadiusValue)
                ? Math.max(...data.map((d) => d.size).filter((d) => d !== undefined && d !== null))
                : (maxRadiusValue as number),
            ])
            .range([0.25, radius])
            .nice()
        : undefined,
    [data, radius, maxRadiusValue],
  );

  // Memoize simulation setup
  useEffect(() => {
    const setupSimulation = () => {
      const dataTemp = dataOrdered.map((d) => ({ ...d, ...(d.data && { data: { ...d.data } }) }));
      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
      const simulation = forceSimulation(dataTemp as any)
        .force('y', forceY((_d) => graphHeight / 2).strength(1))
        .force('x', forceX((_d) => graphWidth / 2).strength(1))
        .force(
          'collide',
          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
              (d) => d.x - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const yMinExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              (d) => d.y - (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[0] || 0;
          const xMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              (d) => d.x + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
            )[1] || 0;
          const yMaxExtent =
            extent(
              dataTemp as TreeMapDataTypeForBubbleChart[],
              (d) => d.y + (radiusScale ? radiusScale(d.size || 0) + 1 : radius + 1),
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
  }, [radius, graphHeight, graphWidth, dataOrdered, radiusScale]);

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const handleMouseEnter = (event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
    onSeriesMouseOver?.(d);
  };

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const handleMouseMove = (event: any, d: any) => {
    setMouseOverData(d);
    setEventY(event.clientY);
    setEventX(event.clientX);
  };

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const getCircleColor = (d: any) =>
    data.filter((el) => el.color).length === 0
      ? colors[0]
      : !d.color
        ? Colors.gray
        : colors[colorDomain.indexOf(d.color)];

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const getOpacity = (d: any) =>
    selectedColor
      ? d.color
        ? colors[colorDomain.indexOf(d.color)] === selectedColor
          ? 1
          : dimmedOpacity
        : dimmedOpacity
      : highlightedDataPoints
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
            {finalData.map((d) => {
              const circleColor = getCircleColor(d);
              const opacity = getOpacity(d);
              const bubbleRadius = radiusScale ? radiusScale(d.size || 0) : radius;
              const showLabel = bubbleRadius >= 20 && (showLabels || showValues);
              return (
                // biome-ignore lint/a11y/noStaticElementInteractions: interaction for graph
                <g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  opacity={opacity}
                  transform={`translate(${d.x},${d.y})`}
                  onMouseEnter={(event) => handleMouseEnter(event, d)}
                  onMouseMove={(event) => handleMouseMove(event, d)}
                  onClick={() => handleClick(d)}
                  onMouseLeave={handleMouseLeave}
                >
                  <circle cx={0} cy={0} r={bubbleRadius} fill={circleColor} />
                  {(showLabel || showValues) &&
                    d.size !== undefined &&
                    d.size !== null &&
                    bubbleRadius >= minLabelRadius && (
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
                            {showLabels &&
                              (showLabels instanceof Function ? (
                                showLabels(d)
                              ) : (
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
                              ))}
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
                                {numberFormattingFunction(
                                  d.size,
                                  undefined,
                                  precision,
                                  prefix,
                                  suffix,
                                  locale,
                                  padZeros,
                                )}
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
