import { useEffect, useRef, useState } from 'react';
import {
  line,
  curveLinear,
  curveMonotoneX,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import min from 'lodash.min';
import max from 'lodash.max';
import { cn } from '@undp/design-system-react';
import { motion } from 'motion/react';

import {
  AnimateDataType,
  AnnotationSettingsDataType,
  ClassNameObject,
  CurveTypes,
  CustomHighlightAreaSettingsDataType,
  CustomLayerDataType,
  HighlightAreaSettingsDataType,
  MultiLineChartDataType,
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
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';
import { HighlightArea } from '@/Components/Elements/HighlightArea';

interface Props {
  // Data
  /** Array of data objects */
  data: MultiLineChartDataType[];
  lineColors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  labels: (string | number)[];
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  showColorLegendAtTop: boolean;
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  highlightedLines: (string | number)[];
  animate: AnimateDataType;
  rtl: boolean;
  strokeWidth: number;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
}

interface FormattedDataType {
  y: number;
  date: Date;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColors,
    dateFormat,
    noOfXTicks,
    labels,
    rightMargin,
    topMargin,
    bottomMargin,
    suffix,
    prefix,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    showValues,
    showColorLegendAtTop,
    refValues,
    highlightAreaSettings,
    minValue,
    maxValue,
    highlightedLines,
    animate,
    rtl,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    yAxisTitle,
    noOfYTicks,
    minDate,
    maxDate,
    curveType,
    styles,
    classNames,
    dimmedOpacity,
    precision,
    customLayers,
  } = props;
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
  const dataArray = dataFormatted[0].y.map((_d, i) => {
    return dataFormatted
      .map(el => ({
        ...el,
        y: el.y[i],
      }))
      .filter(el => !checkIfNullOrUndefined(el.y));
  });
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
  const minParam: number = checkIfNullOrUndefined(minValue)
    ? min(dataFormatted.map(d => min(d.y)))
      ? (min(dataFormatted.map(d => min(d.y))) as number) > 0
        ? 0
        : (min(dataFormatted.map(d => min(d.y))) as number)
      : 0
    : (minValue as number);
  const maxParam: number = (max(dataFormatted.map(d => max(d.y))) as number)
    ? (max(dataFormatted.map(d => max(d.y))) as number)
    : 0;

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? minParam : (minValue as number),
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const lineShape = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y))
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
      setEventY(event.clientY);
      setEventX(event.clientX);
      onSeriesMouseOver?.(selectedData || dataFormatted[dataFormatted.length - 1]);
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
    };
    select(MouseoverRectRef.current).on('mousemove', mousemove).on('mouseout', mouseout);
    onSeriesMouseOver?.(undefined);
  }, [x, dataFormatted, onSeriesMouseOver]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <HighlightArea
            areaSettings={highlightAreaSettingsFormatted}
            width={graphWidth}
            height={graphHeight}
            scale={x}
            animate={animate}
          />
          <CustomArea
            areaSettings={customHighlightAreaSettingsFormatted}
            scaleX={x}
            scaleY={y}
            animate={animate}
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
              x={0 - leftMargin - 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
          </g>
          <g>
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
          </g>
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <g>
            {dataArray.map((d, i) => (
              <motion.g
                key={labels[i]}
                initial={{
                  opacity:
                    highlightedLines.length !== 0
                      ? highlightedLines.indexOf(labels[i]) !== -1
                        ? 1
                        : dimmedOpacity
                      : 1,
                }}
                whileInView={{
                  opacity:
                    highlightedLines.length !== 0
                      ? highlightedLines.indexOf(labels[i]) !== -1
                        ? 1
                        : dimmedOpacity
                      : 1,
                }}
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
                transition={{ duration: animate.duration }}
                viewport={{ once: animate.once, amount: animate.amount }}
              >
                <motion.path
                  style={{
                    fill: 'none',
                    strokeWidth,
                  }}
                  initial={{
                    pathLength: 0,
                    d:
                      lineShape(
                        d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                      ) || '',
                    opacity: 1,
                    stroke: lineColors[i],
                  }}
                  whileInView={{
                    pathLength: 1,
                    d:
                      lineShape(
                        d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                      ) || '',
                    opacity: 1,
                    stroke: lineColors[i],
                  }}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  transition={{ duration: animate.duration }}
                  viewport={{ once: animate.once, amount: animate.amount }}
                />
                {d.map((el, j) => (
                  <g key={j}>
                    {!checkIfNullOrUndefined(el.y) ? (
                      <>
                        {showDots ? (
                          <motion.circle
                            cx={x(el.date)}
                            cy={y(el.y as number)}
                            r={
                              graphWidth / dataFormatted.length < 5
                                ? 0
                                : graphWidth / dataFormatted.length < 20
                                  ? 2
                                  : 4
                            }
                            style={{ fill: lineColors[i] }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: animate.duration } }}
                            transition={{ duration: 0.5, delay: animate.duration }}
                            viewport={{ once: animate.once, amount: animate.amount }}
                          />
                        ) : null}
                        {showValues ? (
                          <motion.text
                            x={x(el.date)}
                            y={y(el.y as number)}
                            dy={-8}
                            style={{
                              fill: lineColors[i],
                              textAnchor: 'middle',
                              ...(styles?.graphObjectValues || {}),
                            }}
                            className={cn(
                              'graph-value text-xs font-bold',
                              classNames?.graphObjectValues,
                            )}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: animate.duration } }}
                            transition={{ duration: 0.5, delay: animate.duration }}
                            viewport={{ once: animate.once, amount: animate.amount }}
                          >
                            {numberFormattingFunction(el.y, precision, prefix, suffix)}
                          </motion.text>
                        ) : null}
                      </>
                    ) : null}
                  </g>
                ))}
                {showColorLegendAtTop ? null : (
                  <motion.text
                    style={{ fill: lineColors[i] }}
                    className='text-xs'
                    x={x(d[d.length - 1].date)}
                    y={y(d[d.length - 1].y as number)}
                    dx={5}
                    dy={4}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    transition={{ duration: 0.5, delay: animate.duration }}
                    viewport={{ once: animate.once, amount: animate.amount }}
                  >
                    {labels[i]}
                  </motion.text>
                )}
              </motion.g>
            ))}
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
      </svg>
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
