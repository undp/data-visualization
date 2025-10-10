import { useEffect, useRef, useState } from 'react';
import {
  line,
  curveMonotoneX,
  curveLinear,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import { motion, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react/cn';
import orderBy from 'lodash.orderby';

import {
  AnimateDataType,
  ClassNameObject,
  CurveTypes,
  CustomLayerDataType,
  DualAxisLineChartDataType,
  HighlightAreaSettingsDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { HighlightArea } from '@/Components/Elements/HighlightArea';

interface Props {
  data: DualAxisLineChartDataType[];
  lineColors: [string, string];
  labels: [string, string];
  width: number;
  height: number;
  dateFormat: string;
  showValues: boolean;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  sameAxes: boolean;
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  animate: AnimateDataType;
  strokeWidth: number;
  showDots: boolean;
  noOfYTicks: number;
  lineSuffixes: [string, string];
  linePrefixes: [string, string];
  minDate?: string | number;
  maxDate?: string | number;
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  precision: number;
  customLayers: CustomLayerDataType[];
  showAxisLabels: boolean;
}

interface FormattedDataType {
  y1: number;
  y2: number;
  date: Date;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColors,
    labels,
    sameAxes,
    dateFormat,
    showValues,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    highlightAreaSettings,
    onSeriesMouseOver,
    animate,
    strokeWidth,
    showDots,
    noOfYTicks,
    lineSuffixes,
    linePrefixes,
    minDate,
    maxDate,
    curveType,
    styles,
    classNames,
    precision,
    customLayers,
    showAxisLabels,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimatedOnce) {
      const timeout = setTimeout(
        () => {
          setHasAnimatedOnce(true);
        },
        (animate.duration + 0.5) * 1000,
      );
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimatedOnce, animate.duration]);
  const curve =
    curveType === 'linear'
      ? curveLinear
      : curveType === 'step'
        ? curveStep
        : curveType === 'stepAfter'
          ? curveStepAfter
          : curveType === 'stepBefore'
            ? curveStepBefore
            : curveMonotoneX;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin + 50,
    right: rightMargin + 65,
  };
  const MouseoverRectRef = useRef(null);
  const dataFormatted = orderBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    ['date'],
    ['asc'],
  );
  const highlightAreaSettingsFormatted = highlightAreaSettings.map(d => ({
    ...d,
    coordinates: [
      d.coordinates[0] === null ? null : parse(`${d.coordinates[0]}`, dateFormat, new Date()),
      d.coordinates[1] === null ? null : parse(`${d.coordinates[1]}`, dateFormat, new Date()),
    ],
  }));
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = minDate ? parse(`${minDate}`, dateFormat, new Date()) : dataFormatted[0].date;
  const maxYear = maxDate
    ? parse(`${maxDate}`, dateFormat, new Date())
    : dataFormatted[dataFormatted.length - 1].date;
  const minParam1 =
    Math.min(...dataFormatted.map(d => d.y1).filter(d => d !== undefined && d !== null)) !==
    Infinity
      ? Math.min(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null)) > 0
        ? 0
        : Math.min(...dataFormatted.map(d => d.y1).filter(d => d !== undefined && d !== null))
      : 0;
  const minParam2 =
    Math.min(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null)) !==
    Infinity
      ? Math.min(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null)) > 0
        ? 0
        : Math.min(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null))
      : 0;
  const maxParam1 =
    Math.max(...dataFormatted.map(d => d.y1).filter(d => d !== undefined && d !== null)) !==
    Infinity
      ? Math.max(...dataFormatted.map(d => d.y1).filter(d => d !== undefined && d !== null))
      : 0;
  const maxParam2 =
    Math.max(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null)) !==
    Infinity
      ? Math.max(...dataFormatted.map(d => d.y2).filter(d => d !== undefined && d !== null))
      : 0;

  const minParam = minParam1 < minParam2 ? minParam1 : minParam2;
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);

  const y1 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam1,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam1 > 0 ? maxParam1 : 0,
    ])
    .range([graphHeight, 0])
    .nice();
  const y2 = scaleLinear()
    .domain([
      sameAxes ? minParam : minParam2,
      sameAxes ? (maxParam > 0 ? maxParam : 0) : maxParam2 > 0 ? maxParam2 : 0,
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape1 = line<FormattedDataType>()
    .defined(d => !checkIfNullOrUndefined(d.y1))
    .x(d => x(d.date))
    .y(d => y1(d.y1))
    .curve(curve);

  const lineShape2 = line<FormattedDataType>()
    .defined(d => !checkIfNullOrUndefined(d.y2))
    .x(d => x(d.date))
    .y(d => y2(d.y2))
    .curve(curve);
  const y1Ticks = y1.ticks(noOfYTicks);
  const y2Ticks = y2.ticks(noOfYTicks);
  const xTicks = x.ticks(noOfXTicks);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mousemove = (event: any) => {
      const selectedData =
        dataFormatted[
          bisectCenter(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            0,
          )
        ];
      setMouseOverData(selectedData || dataFormatted[dataFormatted.length - 1]);
      onSeriesMouseOver?.(selectedData || dataFormatted[dataFormatted.length - 1]);
      setEventY(event.clientY);
      setEventX(event.clientX);
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
      onSeriesMouseOver?.(undefined);
    };
    select(MouseoverRectRef.current).on('mousemove', mousemove).on('mouseout', mouseout);
  }, [x, dataFormatted, onSeriesMouseOver]);

  return (
    <>
      <motion.svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
        ref={svgRef}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <HighlightArea
            areaSettings={highlightAreaSettingsFormatted}
            width={graphWidth}
            height={graphHeight}
            scale={x}
            animate={animate}
            isInView={isInView}
          />
          <g>
            {y1Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y1(d)}
                  y2={y1(d)}
                  x1={-15}
                  x2={-20}
                  style={{
                    stroke: lineColors[0],
                    strokeWidth: 1,
                    ...(styles?.yAxis?.gridLines || {}),
                  }}
                  className={classNames?.yAxis?.gridLines}
                />
                <text
                  x={0 - 25}
                  y={y1(d)}
                  dy='0.33em'
                  className={cn('text-xs', classNames?.yAxis?.labels)}
                  style={{
                    textAnchor: 'end',
                    fill: lineColors[0],
                    ...(styles?.yAxis?.labels || {}),
                  }}
                >
                  {numberFormattingFunction(d, 'NA', precision, linePrefixes[0], lineSuffixes[0])}
                </text>
              </g>
            ))}
            <Axis
              y1={0}
              y2={graphHeight}
              x1={-15}
              x2={-15}
              classNames={{ axis: classNames?.xAxis?.axis }}
              styles={{ axis: { stroke: lineColors[0], ...(styles?.xAxis?.axis || {}) } }}
            />

            {showAxisLabels ? (
              <AxisTitle
                x={10 - margin.left}
                y={graphHeight / 2}
                style={{ fill: lineColors[0], ...(styles?.yAxis?.title || {}) }}
                className={classNames?.yAxis?.title}
                text={labels[0].length > 100 ? `${labels[0].substring(0, 100)}...` : labels[0]}
                rotate90
              />
            ) : null}
          </g>
          <g>
            {y2Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y2(d)}
                  y2={y2(d)}
                  x1={graphWidth + 15}
                  x2={graphWidth + 20}
                  style={{
                    stroke: lineColors[1],
                    strokeWidth: 1,
                    ...(styles?.yAxis?.gridLines || {}),
                  }}
                  className={classNames?.yAxis?.gridLines}
                />
                <text
                  x={graphWidth + 25}
                  y={y2(d)}
                  dy='0.33em'
                  dx={-2}
                  style={{
                    textAnchor: 'start',
                    fill: lineColors[1],
                    ...(styles?.yAxis?.labels || {}),
                  }}
                  className={cn('text-xs', classNames?.yAxis?.labels)}
                >
                  {numberFormattingFunction(d, 'NA', precision, linePrefixes[1], lineSuffixes[1])}
                </text>
              </g>
            ))}
            <Axis
              y1={0}
              y2={graphHeight}
              x1={graphWidth + 15}
              x2={graphWidth + 15}
              classNames={{ axis: classNames?.xAxis?.axis }}
              styles={{ axis: { stroke: lineColors[1], ...(styles?.xAxis?.axis || {}) } }}
            />
            {showAxisLabels ? (
              <AxisTitle
                x={graphWidth + margin.right - 15}
                y={graphHeight / 2}
                style={{ fill: lineColors[1], ...(styles?.yAxis?.title || {}) }}
                className={classNames?.yAxis?.title}
                text={labels[1].length > 100 ? `${labels[1].substring(0, 100)}...` : labels[1]}
                rotate90
              />
            ) : null}
          </g>
          <g>
            <Axis
              y1={graphHeight}
              y2={graphHeight}
              x1={-15}
              x2={graphWidth + 15}
              classNames={{ axis: classNames?.xAxis?.axis }}
              styles={{ axis: styles?.xAxis?.axis }}
            />
            <XTicksAndGridLines
              values={xTicks.map(d => format(d, dateFormat))}
              x={xTicks.map(d => x(d))}
              y1={0}
              y2={graphHeight}
              styles={{
                gridLines: styles?.xAxis?.gridLines,
                labels: styles?.xAxis?.labels,
              }}
              classNames={{
                gridLines: cn('opacity-0', classNames?.xAxis?.gridLines),
                labels: cn(
                  'fill-primary-gray-700 dark:fill-primary-gray-300 xs:max-[360px]:hidden text-[9px] md:text-[10px] lg:text-xs',
                  classNames?.xAxis?.labels,
                ),
              }}
              labelType='primary'
              showGridLines
              precision={precision}
            />
          </g>
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <g>
            <motion.path
              style={{
                stroke: lineColors[0],
                strokeWidth,
                fill: 'none',
              }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: {
                  pathLength: 0,
                  d:
                    lineShape1(
                      dataFormatted.filter(
                        (el): el is FormattedDataType => !checkIfNullOrUndefined(el.y1),
                      ),
                    ) || '',
                  opacity: 1,
                },
                whileInView: {
                  pathLength: 1,
                  d:
                    lineShape1(
                      dataFormatted.filter(
                        (el): el is FormattedDataType => !checkIfNullOrUndefined(el.y1),
                      ),
                    ) || '',
                  opacity: 1,
                  transition: { duration: animate.duration },
                },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
            <motion.path
              d={
                lineShape2(
                  dataFormatted.filter(
                    (el): el is FormattedDataType => !checkIfNullOrUndefined(el.y2),
                  ),
                ) || ''
              }
              style={{
                stroke: lineColors[1],
                strokeWidth,
                fill: 'none',
              }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: {
                  pathLength: 0,
                  d:
                    lineShape2(
                      dataFormatted.filter(
                        (el): el is FormattedDataType => !checkIfNullOrUndefined(el.y2),
                      ),
                    ) || '',
                  opacity: 1,
                },
                whileInView: {
                  pathLength: 1,
                  d:
                    lineShape2(
                      dataFormatted.filter(
                        (el): el is FormattedDataType => !checkIfNullOrUndefined(el.y2),
                      ),
                    ) || '',
                  opacity: 1,
                  transition: { duration: animate.duration },
                },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
            {mouseOverData ? (
              <line
                y1={0}
                y2={graphHeight}
                x1={x(mouseOverData.date)}
                x2={x(mouseOverData.date)}
                className={cn(
                  'undp-tick-line stroke-primary-gray-700 dark:stroke-primary-gray-100',
                  classNames?.mouseOverLine,
                )}
                style={styles?.mouseOverLine}
              />
            ) : null}
          </g>
          <g>
            {dataFormatted.map((d, i) => (
              <motion.g key={i}>
                {!checkIfNullOrUndefined(d.y1) ? (
                  <>
                    {showDots ? (
                      <motion.circle
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                              ? 2
                              : 4
                        }
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: {
                            opacity: 0,
                            cx: x(d.date),
                            cy: y1(d.y1 as number),
                            fill: lineColors[0],
                          },
                          whileInView: {
                            opacity: 1,
                            fill: lineColors[0],
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                            cx: x(d.date),
                            cy: y1(d.y1 as number),
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        dy={
                          checkIfNullOrUndefined(d.y2)
                            ? -8
                            : (d.y2 as number) < (d.y1 as number)
                              ? -8
                              : '1em'
                        }
                        style={{
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-1 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: {
                            opacity: 0,
                            x: x(d.date),
                            y: y2(d.y1 as number),
                            fill: lineColors[0],
                          },
                          whileInView: {
                            opacity: 1,
                            x: x(d.date),
                            fill: lineColors[0],
                            y: y2(d.y1 as number),
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(
                          d.y1,
                          'NA',
                          precision,
                          linePrefixes[0],
                          lineSuffixes[0],
                        )}
                      </motion.text>
                    ) : null}
                  </>
                ) : null}
                {!checkIfNullOrUndefined(d.y2) ? (
                  <>
                    {showDots ? (
                      <motion.circle
                        r={
                          graphWidth / dataFormatted.length < 5
                            ? 0
                            : graphWidth / dataFormatted.length < 20
                              ? 2
                              : 4
                        }
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: {
                            opacity: 0,
                            cx: x(d.date),
                            cy: y2(d.y2 as number),
                            fill: lineColors[1],
                          },
                          whileInView: {
                            opacity: 1,
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                            fill: lineColors[1],
                            cx: x(d.date),
                            cy: y2(d.y2 as number),
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        dy={
                          checkIfNullOrUndefined(d.y1)
                            ? -8
                            : (d.y1 as number) < (d.y2 as number)
                              ? -8
                              : '1em'
                        }
                        style={{
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-2 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: {
                            opacity: 0,
                            x: x(d.date),
                            y: y2(d.y2 as number),
                            fill: lineColors[1],
                          },
                          whileInView: {
                            opacity: 1,
                            x: x(d.date),
                            y: y2(d.y2 as number),
                            fill: lineColors[1],
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(
                          d.y2,
                          'NA',
                          precision,
                          linePrefixes[1],
                          lineSuffixes[1],
                        )}
                      </motion.text>
                    ) : null}
                  </>
                ) : null}
              </motion.g>
            ))}
          </g>
          {customLayers.filter(d => d.position === 'after').map(d => d.layer)}
          <rect
            ref={MouseoverRectRef}
            style={{
              fill: 'none',
              pointerEvents: 'all',
            }}
            width={graphWidth}
            height={graphHeight}
          />
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
    </>
  );
}
