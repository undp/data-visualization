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
import { motion, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react/cn';

import {
  AnimateDataType,
  AnnotationSettingsDataType,
  ClassNameObject,
  CurveTypes,
  CustomHighlightAreaSettingsDataType,
  CustomLayerDataType,
  DifferenceLineChartDataType,
  HighlightAreaSettingsDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getLineEndPoint } from '@/Utils/getLineEndPoint';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { Annotation } from '@/Components/Elements/Annotations';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { HighlightArea } from '@/Components/Elements/HighlightArea';
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';

interface Props {
  data: DifferenceLineChartDataType[];
  lineColors: [string, string];
  diffAreaColors: [string, string];
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  dateFormat: string;
  showValues: boolean;
  noOfXTicks: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  animate: AnimateDataType;
  rtl: boolean;
  colorDomain: [string, string];
  showColorLegendAtTop?: boolean;
  idSuffix: string;
  strokeWidth: number;
  showDots: boolean;
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
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
    suffix,
    prefix,
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
    rtl,
    showColorLegendAtTop,
    colorDomain,
    diffAreaColors,
    idSuffix,
    strokeWidth,
    showDots,
    refValues,
    minValue,
    maxValue,
    annotations,
    customHighlightAreaSettings,
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
  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
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
  const minParam1 =
    Math.min(...dataFormatted.map(d => d.y1)) !== Infinity
      ? Math.min(...dataFormatted.map(d => d.y1)) > 0
        ? 0
        : Math.min(...dataFormatted.map(d => d.y1))
      : 0;
  const minParam2 =
    Math.min(...dataFormatted.map(d => d.y2)) !== Infinity
      ? Math.min(...dataFormatted.map(d => d.y2)) > 0
        ? 0
        : Math.min(...dataFormatted.map(d => d.y2))
      : 0;
  const maxParam1 =
    Math.max(...dataFormatted.map(d => d.y1)) !== Infinity
      ? Math.max(...dataFormatted.map(d => d.y1))
      : 0;
  const maxParam2 =
    Math.max(...dataFormatted.map(d => d.y2)) !== Infinity
      ? Math.max(...dataFormatted.map(d => d.y2))
      : 0;

  const minParam = checkIfNullOrUndefined(minValue)
    ? minParam1 < minParam2
      ? minParam1
      : minParam2
    : (minValue as number);
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;
  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);

  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? minParam : (minValue as number),
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape1 = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y1))
    .curve(curve);

  const lineShape2 = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y2))
    .curve(curve);

  const mainGraphArea = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y1))
    .y0(d => y(d.y2))
    .curve(curve);
  const mainGraphArea1 = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y1))
    .y0(0)
    .curve(curve);
  const mainGraphArea2 = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y2))
    .y0(0)
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
          <clipPath id={`above${idSuffix}`}>
            <path
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              d={mainGraphArea2(dataFormatted as any) as string}
              style={{ fill: 'none' }}
            />
          </clipPath>
          <clipPath id={`below${idSuffix}`}>
            <path
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              d={mainGraphArea1(dataFormatted as any) as string}
              style={{ fill: 'none' }}
            />
          </clipPath>
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
                  dy: maxParam < 0 ? '1rem' : -5,
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
                x={0 - leftMargin - 15}
                y={graphHeight / 2}
                style={styles?.yAxis?.title}
                className={classNames?.yAxis?.title}
                text={yAxisTitle}
                rotate90
              />
            </g>
          </g>
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
            suffix={suffix}
            prefix={prefix}
            labelType='primary'
            showGridLines
            precision={precision}
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <g>
            <motion.path
              clipPath={`url(#below${idSuffix})`}
              d={mainGraphArea(dataFormatted) || ''}
              style={{ fill: diffAreaColors[1] }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: { opacity: 1 },
                whileInView: { opacity: 1, transition: { duration: animate.duration } },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
            <motion.path
              clipPath={`url(#above${idSuffix})`}
              d={mainGraphArea(dataFormatted) || ''}
              style={{ fill: diffAreaColors[0] }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: { opacity: 0 },
                whileInView: { opacity: 1, transition: { duration: animate.duration } },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
          </g>
          <g>
            <motion.path
              d={lineShape1(dataFormatted) || ''}
              style={{
                fill: 'none',
                stroke: lineColors[0],
                strokeWidth,
              }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: { pathLength: 0, d: lineShape1(dataFormatted) || '', opacity: 1 },
                whileInView: {
                  pathLength: 1,
                  d: lineShape1(dataFormatted) || '',
                  opacity: 1,
                  transition: { duration: animate.duration },
                },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
            <motion.path
              style={{
                fill: 'none',
                stroke: lineColors[1],
                strokeWidth,
              }}
              exit={{ opacity: 0, transition: { duration: animate.duration } }}
              variants={{
                initial: { pathLength: 0, d: lineShape2(dataFormatted) || '', opacity: 1 },
                whileInView: {
                  pathLength: 1,
                  d: lineShape2(dataFormatted) || '',
                  opacity: 1,
                  transition: { duration: animate.duration },
                },
              }}
              initial='initial'
              animate={isInView ? 'whileInView' : 'initial'}
            />
            {showColorLegendAtTop ? null : (
              <g>
                <motion.text
                  key={colorDomain[0]}
                  style={{ fill: lineColors[0] }}
                  className='text-xs'
                  dx={5}
                  dy={4}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: x(dataFormatted[dataFormatted.length - 1].date),
                      y: y(dataFormatted[dataFormatted.length - 1].y1 as number),
                    },
                    whileInView: {
                      opacity: 1,
                      x: x(dataFormatted[dataFormatted.length - 1].date),
                      y: y(dataFormatted[dataFormatted.length - 1].y1 as number),
                      transition: {
                        duration: hasAnimatedOnce ? animate.duration : 0.5,
                        delay: hasAnimatedOnce ? 0 : animate.duration,
                      },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                >
                  {colorDomain[0]}
                </motion.text>
                <motion.text
                  key={colorDomain[1]}
                  style={{ fill: lineColors[1] }}
                  className='text-xs'
                  dx={5}
                  dy={4}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: x(dataFormatted[dataFormatted.length - 1].date),
                      y: y(dataFormatted[dataFormatted.length - 1].y2 as number),
                    },
                    whileInView: {
                      opacity: 1,
                      x: x(dataFormatted[dataFormatted.length - 1].date),
                      y: y(dataFormatted[dataFormatted.length - 1].y2 as number),
                      transition: {
                        duration: hasAnimatedOnce ? animate.duration : 0.5,
                        delay: hasAnimatedOnce ? 0 : animate.duration,
                      },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                >
                  {colorDomain[1]}
                </motion.text>
              </g>
            )}
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
                        style={{ fill: lineColors[0] }}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, cx: x(d.date), cy: y(d.y1) },
                          whileInView: {
                            opacity: 1,
                            transition: { duration: 0.5, delay: animate.duration },
                            cx: x(d.date),
                            cy: y(d.y1),
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        dy={d.y2 < d.y1 ? -8 : '1em'}
                        style={{
                          fill: lineColors[0],
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-1 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, x: x(d.date), y: y(d.y1) },
                          whileInView: {
                            opacity: 1,
                            x: x(d.date),
                            y: y(d.y1),
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(d.y1, 'NA', precision, prefix, suffix)}
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
                        style={{ fill: lineColors[1] }}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, cx: x(d.date), cy: y(d.y2) },
                          whileInView: {
                            opacity: 1,
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                            cx: x(d.date),
                            cy: y(d.y2),
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        dy={d.y2 > d.y1 ? -8 : '1em'}
                        style={{
                          fill: lineColors[1],
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value graph-value-line-2 text-xs font-bold',
                          classNames?.graphObjectValues,
                        )}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        variants={{
                          initial: { opacity: 0, x: x(d.date), y: y(d.y2) },
                          whileInView: {
                            opacity: 1,
                            x: x(d.date),
                            y: y(d.y2),
                            transition: {
                              duration: hasAnimatedOnce ? animate.duration : 0.5,
                              delay: hasAnimatedOnce ? 0 : animate.duration,
                            },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(d.y2, 'NA', precision, prefix, suffix)}
                      </motion.text>
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
