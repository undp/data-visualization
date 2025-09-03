import { useEffect, useRef, useState } from 'react';
import {
  line,
  curveMonotoneX,
  area,
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
import sortBy from 'lodash.sortby';
import { linearRegression, linearRegressionLine } from 'simple-statistics';
import { cn } from '@undp/design-system-react/cn';
import { motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  AnnotationSettingsDataType,
  ClassNameObject,
  CurveTypes,
  CustomHighlightAreaSettingsDataType,
  CustomLayerDataType,
  HighlightAreaSettingsDataType,
  LineChartWithConfidenceIntervalDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '@/Utils/getLineEndPoint';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { RegressionLine } from '@/Components/Elements/RegressionLine';
import { Annotation } from '@/Components/Elements/Annotations';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';
import { HighlightArea } from '@/Components/Elements/HighlightArea';

interface Props {
  data: LineChartWithConfidenceIntervalDataType[];
  lineColor: string;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  dateFormat: string;
  showValues?: boolean;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues: ReferenceDataType[];
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  maxValue?: number;
  minValue?: number;
  animate: AnimateDataType;
  rtl: boolean;
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  regressionLine: boolean | string;
  showIntervalDots: boolean;
  showIntervalValues: boolean;
  intervalLineStrokeWidth: number;
  intervalLineColors: [string, string];
  intervalAreaColor: string;
  intervalAreaOpacity: number;
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  precision: number;
  customLayers: CustomLayerDataType[];
}
interface FormattedDataType {
  y: number;
  date: Date;
  yMin: number;
  yMax: number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColor,
    suffix,
    prefix,
    dateFormat,
    highlightAreaSettings,
    showValues,
    noOfXTicks,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    minValue,
    maxValue,
    animate,
    rtl,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    regressionLine,
    showIntervalDots,
    showIntervalValues,
    intervalLineStrokeWidth,
    intervalLineColors,
    intervalAreaColor,
    intervalAreaOpacity,
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
    curveType,
    styles,
    classNames,
    precision,
    customLayers,
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
    left: yAxisTitle ? leftMargin + 30 : leftMargin,
    right: rightMargin,
  };
  const MouseoverRectRef = useRef(null);
  const dataFormatted: FormattedDataType[] = sortBy(
    data
      .filter(d => !checkIfNullOrUndefined(d.y))
      .map(d => ({
        date: parse(`${d.date}`, dateFormat, new Date()),
        y: d.y as number,
        yMin: checkIfNullOrUndefined(d.yMin) ? (d.y as number) : (d.yMin as number),
        yMax: checkIfNullOrUndefined(d.yMax) ? (d.y as number) : (d.yMax as number),
        data: d.data,
      })),
    'date',
  );
  const highlightAreaSettingsFormatted = highlightAreaSettings.map(d => ({
    ...d,
    coordinates: [
      d.coordinates[0] === null ? null : parse(`${d.coordinates[0]}`, dateFormat, new Date()),
      d.coordinates[1] === null ? null : parse(`${d.coordinates[1]}`, dateFormat, new Date()),
    ],
  }));
  const customHighlightAreaSettingsFormatted = customHighlightAreaSettings.map(d => ({
    ...d,
    coordinates: d.coordinates.map((el, j) =>
      j % 2 === 0 ? parse(`${el}`, dateFormat, new Date()) : (el as number),
    ),
  }));
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = minDate ? parse(`${minDate}`, dateFormat, new Date()) : dataFormatted[0].date;
  const maxYear = maxDate
    ? parse(`${maxDate}`, dateFormat, new Date())
    : dataFormatted[dataFormatted.length - 1].date;
  const minParam: number = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin)))
      ? Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin))) > 0
        ? 0
        : Math.min(...dataFormatted.map(d => Math.min(d.y, d.yMax, d.yMin)))
      : 0;
  const maxParam: number = Math.max(...dataFormatted.map(d => Math.max(d.y, d.yMax, d.yMin)))
    ? Math.max(...dataFormatted.map(d => Math.max(d.y, d.yMax, d.yMin)))
    : 0;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([
      minParam,
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y))
    .curve(curve);

  const lineShapeMin = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.yMin))
    .curve(curve);

  const lineShapeMax = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.yMax))
    .curve(curve);

  const areaShape = area<FormattedDataType>()
    .x(d => x(d.date))
    .y0(d => y(d.yMin))
    .y1(d => y(d.yMax))
    .curve(curve);

  const yTicks = y.ticks(noOfYTicks);

  const xTicks = x.ticks(noOfXTicks);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mousemove = (event: any) => {
      const selectedData =
        dataFormatted[
          bisectCenter(
            dataFormatted.map(d => d.date),
            x.invert(pointer(event)[0]),
            1,
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
  const regressionLineParam = linearRegression(
    dataFormatted
      .filter(d => !checkIfNullOrUndefined(d.date) && !checkIfNullOrUndefined(d.y))
      .map(d => [x(d.date), y(d.y as number)]),
  );
  const predict = linearRegressionLine(regressionLineParam);
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
          <CustomArea
            areaSettings={customHighlightAreaSettingsFormatted}
            scaleX={x}
            scaleY={y}
            animate={animate}
            isInView={isInView}
          />
          <g>
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              styles={{
                gridLines: styles?.yAxis?.gridLines,
                labels: styles?.yAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.yAxis?.gridLines,
                labels: classNames?.yAxis?.labels,
              }}
              suffix={suffix}
              prefix={prefix}
              labelType='secondary'
              showGridLines
              labelPos='vertical'
              precision={precision}
            />
            <Axis
              y1={y(minParam < 0 ? 0 : minParam)}
              y2={y(minParam < 0 ? 0 : minParam)}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              label={numberFormattingFunction(
                minParam < 0 ? 0 : minParam,
                'NA',
                precision,
                prefix,
                suffix,
              )}
              labelPos={{
                x: 0 - leftMargin,
                y: y(minParam < 0 ? 0 : minParam),
                dx: 0,
                dy: maxParam < 0 ? '1em' : -5,
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
            <AxisTitle
              x={0 - leftMargin + 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
          </g>
          <g>
            {xTicks.map((d, i) => (
              <g key={i}>
                <text
                  y={graphHeight}
                  x={x(d)}
                  style={{ textAnchor: 'middle' }}
                  className='fill-primary-gray-700 dark:fill-primary-gray-300 xs:max-[360px]:hidden text-[9px] md:text-[10px] lg:text-xs'
                  dy={15}
                >
                  {format(d, dateFormat)}
                </text>
              </g>
            ))}
          </g>
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <motion.path
            style={{
              fill: intervalAreaColor,
            }}
            exit={{ opacity: 0, transition: { duration: animate.duration } }}
            variants={{
              initial: { opacity: 0, d: areaShape(dataFormatted) || '' },
              whileInView: {
                opacity: intervalAreaOpacity,
                d: areaShape(dataFormatted) || '',
                transition: { duration: animate.duration },
              },
            }}
            initial='initial'
            animate={isInView ? 'whileInView' : 'initial'}
          />
          {intervalLineStrokeWidth ? (
            <>
              <motion.path
                style={{
                  stroke: intervalLineColors[0],
                  fill: 'none',
                  strokeWidth: intervalLineStrokeWidth,
                }}
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
                variants={{
                  initial: {
                    pathLength: 0,
                    d: lineShapeMin(dataFormatted) || '',
                    opacity: 1,
                  },
                  whileInView: {
                    pathLength: 1,
                    d: lineShapeMin(dataFormatted) || '',
                    opacity: 1,
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
              />
              <motion.path
                style={{
                  stroke: intervalLineColors[1],
                  fill: 'none',
                  strokeWidth: intervalLineStrokeWidth,
                }}
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
                variants={{
                  initial: {
                    pathLength: 0,
                    d: lineShapeMax(dataFormatted) || '',
                    opacity: 1,
                  },
                  whileInView: {
                    pathLength: 1,
                    d: lineShapeMax(dataFormatted) || '',
                    opacity: 1,
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
              />
            </>
          ) : null}
          <motion.path
            style={{
              stroke: lineColor,
              fill: 'none',
              strokeWidth,
            }}
            exit={{ opacity: 0, transition: { duration: animate.duration } }}
            variants={{
              initial: {
                pathLength: 0,
                d: lineShape(dataFormatted) || '',
                opacity: 1,
              },
              whileInView: {
                pathLength: 1,
                d: lineShape(dataFormatted) || '',
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
          <g>
            {dataFormatted.map((d, i) => (
              <motion.g key={i}>
                {!checkIfNullOrUndefined(d.y) ? (
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
                        style={{ fill: lineColor }}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, cx: x(d.date), cy: y(d.y) },
                          whileInView: {
                            opacity: 1,
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                            cx: x(d.date),
                            cy: y(d.y),
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showIntervalDots ? (
                      <>
                        <motion.circle
                          r={
                            graphWidth / dataFormatted.length < 5
                              ? 0
                              : graphWidth / dataFormatted.length < 20
                                ? 2
                                : 4
                          }
                          style={{ fill: intervalLineColors[0] }}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { opacity: 0, cx: x(d.date), cy: y(d.yMin) },
                            whileInView: {
                              opacity: 1,
                              transition: {
                                duration: hasAnimatedOnce ? animate.duration : 0.5,
                                delay: hasAnimatedOnce ? 0 : animate.duration,
                              },
                              cx: x(d.date),
                              cy: y(d.yMin),
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        />
                        <motion.circle
                          r={
                            graphWidth / dataFormatted.length < 5
                              ? 0
                              : graphWidth / dataFormatted.length < 20
                                ? 2
                                : 4
                          }
                          style={{ fill: intervalLineColors[1] }}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { opacity: 0, cx: x(d.date), cy: y(d.yMax) },
                            whileInView: {
                              opacity: 1,
                              transition: {
                                duration: hasAnimatedOnce ? animate.duration : 0.5,
                                delay: hasAnimatedOnce ? 0 : animate.duration,
                              },
                              cx: x(d.date),
                              cy: y(d.yMax),
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        />
                      </>
                    ) : null}
                    {showValues ? (
                      <motion.text
                        dy={-8}
                        style={{
                          fill: lineColor,
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, x: x(d.date), y: y(d.y) },
                          whileInView: {
                            opacity: 1,
                            x: x(d.date),
                            y: y(d.y),
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(d.y, 'NA', precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
                    {showIntervalValues ? (
                      <>
                        <motion.text
                          dy='1em'
                          style={{
                            fill: intervalLineColors[0],
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn('text-xs font-bold', classNames?.graphObjectValues)}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { opacity: 0, x: x(d.date), y: y(d.yMin) },
                            whileInView: {
                              opacity: 1,
                              x: x(d.date),
                              y: y(d.yMin),
                              transition: {
                                duration: hasAnimatedOnce ? animate.duration : 0.5,
                                delay: hasAnimatedOnce ? 0 : animate.duration,
                              },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        >
                          {numberFormattingFunction(d.yMin, 'NA', precision, prefix, suffix)}
                        </motion.text>
                        <motion.text
                          dy={-8}
                          style={{
                            fill: intervalLineColors[1],
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn('text-xs font-bold', classNames?.graphObjectValues)}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { opacity: 0, x: x(d.date), y: y(d.yMax) },
                            whileInView: {
                              opacity: 1,
                              x: x(d.date),
                              y: y(d.yMax),
                              transition: {
                                duration: hasAnimatedOnce ? animate.duration : 0.5,
                                delay: hasAnimatedOnce ? 0 : animate.duration,
                              },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        >
                          {numberFormattingFunction(d.yMax, 'NA', precision, prefix, suffix)}
                        </motion.text>
                      </>
                    ) : null}
                  </>
                ) : null}
              </motion.g>
            ))}
          </g>
          {refValues ? (
            <>
              {refValues.map((el, i) => (
                <RefLineY
                  key={i}
                  text={el.text}
                  color={el.color}
                  y={y(el.value as number)}
                  x1={0 - leftMargin}
                  x2={graphWidth + margin.right}
                  classNames={el.classNames}
                  styles={el.styles}
                  animate={animate}
                  isInView={isInView}
                />
              ))}
            </>
          ) : null}
          <g>
            {annotations.map((d, i) => {
              const endPoints = getLineEndPoint(
                {
                  x: d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                },
                {
                  x: d.xCoordinate ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) : 0,
                  y: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                },
                checkIfNullOrUndefined(d.connectorRadius) ? 3.5 : (d.connectorRadius as number),
              );
              const connectorSettings = d.showConnector
                ? {
                    y1: endPoints.y,
                    x1: endPoints.x,
                    y2: d.yCoordinate
                      ? y(d.yCoordinate as number) + (d.yOffset || 0)
                      : 0 + (d.yOffset || 0),
                    x2: d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                    cy: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                    cx: d.xCoordinate ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) : 0,
                    circleRadius: checkIfNullOrUndefined(d.connectorRadius)
                      ? 3.5
                      : (d.connectorRadius as number),
                    strokeWidth: d.showConnector === true ? 2 : Math.min(d.showConnector || 0, 1),
                  }
                : undefined;
              const labelSettings = {
                y: d.yCoordinate
                  ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                  : 0 + (d.yOffset || 0) - 8,
                x: rtl
                  ? 0
                  : d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0),
                width: rtl
                  ? d.xCoordinate
                    ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                    : 0 + (d.xOffset || 0)
                  : graphWidth -
                    (d.xCoordinate
                      ? x(parse(`${d.xCoordinate}`, dateFormat, new Date())) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0)),
                maxWidth: d.maxWidth,
                fontWeight: d.fontWeight,
                align: d.align,
              };
              return (
                <Annotation
                  key={i}
                  color={d.color}
                  connectorsSettings={connectorSettings}
                  labelSettings={labelSettings}
                  text={d.text}
                  classNames={d.classNames}
                  styles={d.styles}
                  animate={animate}
                  isInView={isInView}
                />
              );
            })}
          </g>
          <g>
            {regressionLine ? (
              <RegressionLine
                x1={0}
                x2={graphWidth}
                y1={predict(0)}
                y2={predict(graphWidth)}
                graphHeight={graphHeight}
                graphWidth={graphWidth}
                className={classNames?.regLine}
                style={styles?.regLine}
                color={typeof regressionLine === 'string' ? regressionLine : undefined}
                animate={animate}
                isInView={isInView}
              />
            ) : null}
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
