import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { useEffect, useRef, useState } from 'react';
import orderBy from 'lodash.orderby';
import { cn, Modal, Spinner } from '@undp/design-system-react';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  BeeSwarmChartDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  startFromZero: boolean;
  radius: number;
  maxRadiusValue?: number;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks: number;
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
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
    maxValue,
    minValue,
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
    animate,
    dimmedOpacity,
    precision,
    customLayers,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
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
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) < 0 &&
        !startFromZero
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) >=
          0 && !startFromZero
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));

  const radiusScale =
    data.filter(d => d.radius === undefined || d.radius === null).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? Math.max(...data.map(d => d.radius).filter(d => d !== undefined && d !== null))
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
        <motion.svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          direction='ltr'
          ref={svgRef}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {showTicks ? (
              <>
                <Axis
                  x1={x(xMinValue < 0 ? 0 : xMinValue)}
                  x2={x(xMinValue < 0 ? 0 : xMinValue)}
                  y1={0 - margin.top}
                  y2={graphHeight + margin.bottom}
                  label={numberFormattingFunction(
                    xMinValue < 0 ? 0 : xMinValue,
                    'NA',
                    precision,
                    prefix,
                    suffix,
                  )}
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
                  precision={precision}
                />
              </>
            ) : null}
            {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
            <AnimatePresence>
              {finalData.map(d => (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  transform={`translate(${d.x},${d.y})`}
                  variants={{
                    initial: { opacity: 0 },
                    whileInView: {
                      opacity: selectedColor
                        ? d.color
                          ? circleColors[colorDomain.indexOf(d.color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  onMouseEnter={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    onSeriesMouseOver?.(d);
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
                    onSeriesMouseOver?.(undefined);
                  }}
                >
                  <motion.circle
                    cx={0}
                    cy={0}
                    variants={{
                      initial: {
                        fill:
                          data.filter(el => el.color).length === 0
                            ? circleColors[0]
                            : !d.color
                              ? Colors.gray
                              : circleColors[colorDomain.indexOf(d.color)],
                        opacity: 0,
                        radius: 0,
                      },
                      whileInView: {
                        fill:
                          data.filter(el => el.color).length === 0
                            ? circleColors[0]
                            : !d.color
                              ? Colors.gray
                              : circleColors[colorDomain.indexOf(d.color)],
                        opacity: 1,
                        radius: radiusScale ? radiusScale(d.radius || 0) : radius,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                    exit={{ opacity: 0, radius: 0, transition: { duration: animate.duration } }}
                  />
                  {(radiusScale ? radiusScale(d.radius || 0) : radius) > 10 && showLabels ? (
                    <motion.g
                      variants={{
                        initial: {
                          opacity: 0,
                        },
                        whileInView: {
                          opacity: 1,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    >
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
                                    Math.round(
                                      (radiusScale ? radiusScale(d.radius || 0) : radius) / 4,
                                    ),
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
                    </motion.g>
                  ) : null}
                </motion.g>
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
                      animate={animate}
                      isInView={isInView}
                    />
                  ))}
                </>
              ) : null}
            </AnimatePresence>
            {customLayers.filter(d => d.position === 'after').map(d => d.layer)}
          </g>
        </motion.svg>
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
      {detailsOnClick && mouseClickData !== undefined ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='graph-modal-content m-0'
            dangerouslySetInnerHTML={
              typeof detailsOnClick === 'string'
                ? { __html: string2HTML(detailsOnClick, mouseClickData) }
                : undefined
            }
          >
            {typeof detailsOnClick === 'function' ? detailsOnClick(mouseClickData) : null}
          </div>
        </Modal>
      ) : null}
    </>
  );
}
