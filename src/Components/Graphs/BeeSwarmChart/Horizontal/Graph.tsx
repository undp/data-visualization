import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { useEffect, useState } from 'react';
import maxBy from 'lodash.maxby';
import orderBy from 'lodash.orderby';
import { cn, Modal, Spinner } from '@undp/design-system-react';

import { BeeSwarmChartDataType, ClassNameObject, ReferenceDataType, StyleObject } from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface BeeSwarmChartDataTypeForBubbleChart extends BeeSwarmChartDataType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Props {
  data: BeeSwarmChartDataType[];
  circleColors: string[];
  colorDomain: string[];
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  width: number;
  suffix: string;
  prefix: string;
  height: number;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  startFromZero: boolean;
  radius: number;
  maxRadiusValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks?: number;
}

export function Graph(props: Props) {
  const {
    data,
    circleColors,
    showTicks,
    leftMargin,
    width,
    height,
    colorDomain,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
    startFromZero,
    radius,
    maxRadiusValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    rtl,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    suffix,
    prefix,
    styles,
    classNames,
    noOfTicks,
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [finalData, setFinalData] = useState<BeeSwarmChartDataTypeForBubbleChart[] | null>(null);
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

  const dataOrdered =
    data.filter(d => !checkIfNullOrUndefined(d.radius)).length === 0
      ? data
      : orderBy(
          data.filter(d => !checkIfNullOrUndefined(d.radius)),
          'radius',
          'desc',
        );
  const xMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) < 0 &&
        !startFromZero
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const xMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) >=
          0 && !startFromZero
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));

  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? (maxBy(data, 'radius')?.radius as number)
              : (maxRadiusValue as number),
          ])
          .range([0.25, radius])
          .nice()
      : undefined;
  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  const xTicks = x.ticks(noOfTicks);

  useEffect(() => {
    setFinalData(null);
    const dataTemp = (dataOrdered as BeeSwarmChartDataType[]).filter(d => d.position);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forceSimulation(dataTemp as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .force('x', forceX((d: any) => x(d.position as number)).strength(5))
      .force('y', forceY(_d => graphHeight / 2).strength(1))
      .force(
        'collide',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        forceCollide((d: any) => (radiusScale ? radiusScale(d.radius || 0) + 1 : radius + 1)),
      )
      .force('charge', forceManyBody().strength(-15))
      .alphaDecay(0.05)
      .tick(10000)
      .on('tick', () => {
        setFinalData(dataTemp as BeeSwarmChartDataTypeForBubbleChart[]);
      })
      .on('end', () => {
        setFinalData(dataTemp as BeeSwarmChartDataTypeForBubbleChart[]);
      });
  }, [data, radius, graphHeight, graphWidth, xMinValue, xMaxValue, dataOrdered, x, radiusScale]);

  return (
    <>
      {finalData ? (
        <svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          direction='ltr'
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {showTicks ? (
              <>
                <Axis
                  x1={x(xMinValue < 0 ? 0 : xMinValue)}
                  x2={x(xMinValue < 0 ? 0 : xMinValue)}
                  y1={0 - margin.top}
                  y2={graphHeight + margin.bottom}
                  label={numberFormattingFunction(xMinValue < 0 ? 0 : xMinValue, prefix, suffix)}
                  labelPos={{
                    x: x(xMinValue < 0 ? 0 : xMinValue),
                    y: 0 - topMargin,
                    dy: '0.75em',
                    dx: 3,
                  }}
                  classNames={{
                    axis: classNames?.xAxis?.axis,
                    label: classNames?.yAxis?.labels,
                  }}
                  styles={{
                    axis: styles?.xAxis?.axis,
                    label: styles?.yAxis?.labels,
                  }}
                />
                <XTicksAndGridLines
                  values={xTicks.filter(d => d !== 0)}
                  x={xTicks.filter(d => d !== 0).map(d => x(d))}
                  y1={0 - topMargin}
                  y2={graphHeight + margin.bottom}
                  styles={{
                    gridLines: styles?.xAxis?.gridLines,
                    labels: styles?.xAxis?.labels,
                  }}
                  classNames={{
                    gridLines: classNames?.xAxis?.gridLines,
                    labels: classNames?.xAxis?.labels,
                  }}
                  suffix={suffix}
                  prefix={prefix}
                  labelType='secondary'
                  showGridLines
                />
              </>
            ) : null}
            {finalData.map((d, i) => (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? circleColors[colorDomain.indexOf(d.color)] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : highlightedDataPoints.length !== 0
                      ? highlightedDataPoints.indexOf(d.label) !== -1
                        ? 0.85
                        : 0.3
                      : 0.85
                }
                transform={`translate(${d.x},${d.y})`}
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
                  }
                }}
                onMouseMove={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onClick={() => {
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (isEqual(mouseClickData, d) && resetSelectionOnDoubleClick) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick?.(undefined);
                    } else {
                      setMouseClickData(d);
                      onSeriesMouseClick?.(d);
                    }
                  }
                }}
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
                }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={radiusScale ? radiusScale(d.radius || 0) : radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? circleColors[0]
                        : !d.color
                          ? Colors.gray
                          : circleColors[colorDomain.indexOf(d.color)],
                  }}
                />
                {(radiusScale ? radiusScale(d.radius || 0) : radius) > 10 && showLabels ? (
                  <foreignObject
                    y={0 - (radiusScale ? radiusScale(d.radius || 0) : radius)}
                    x={0 - (radiusScale ? radiusScale(d.radius || 0) : radius)}
                    width={2 * (radiusScale ? radiusScale(d.radius || 0) : radius)}
                    height={2 * (radiusScale ? radiusScale(d.radius || 0) : radius)}
                  >
                    <div className='flex flex-col gap-0.5 justify-center items-center h-inherit py-0 px-1.5'>
                      {showLabels ? (
                        <p
                          className={cn(
                            'text-center leading-none m-0',
                            classNames?.graphObjectValues,
                          )}
                          style={{
                            fontSize: `${Math.min(
                              Math.max(
                                Math.round((radiusScale ? radiusScale(d.radius || 0) : radius) / 4),
                                10,
                              ),
                              Math.max(
                                Math.round(
                                  ((radiusScale ? radiusScale(d.radius || 0) : radius) * 12) /
                                    `${d.label}`.length,
                                ),
                                10,
                              ),
                              20,
                            )}px`,
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? circleColors[0]
                                : !d.color
                                  ? Colors.gray
                                  : circleColors[colorDomain.indexOf(d.color)],
                            ),
                            hyphens: 'auto',
                            ...(styles?.graphObjectValues || {}),
                          }}
                        >
                          {d.label}
                        </p>
                      ) : null}
                    </div>
                  </foreignObject>
                ) : null}
              </g>
            ))}
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={x(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide={x(el.value as number) > graphWidth * 0.75 || rtl ? 'left' : 'right'}
                    classNames={el.classNames}
                    styles={el.styles}
                  />
                ))}
              </>
            ) : null}
          </g>
        </svg>
      ) : (
        <div style={{ width: `${width}px`, height: `${height}px` }}>
          <div className='flex m-auto items-center justify-center p-0 leading-none text-base h-40'>
            <Spinner />
          </div>
        </div>
      )}
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
      {detailsOnClick ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='graph-modal-content m-0'
            dangerouslySetInnerHTML={{ __html: string2HTML(detailsOnClick, mouseClickData) }}
          />
        </Modal>
      ) : null}
    </>
  );
}
