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
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { cn } from '@undp/design-system-react';
import uniqBy from 'lodash.uniqby';
import { Delaunay } from 'd3-delaunay';
import { motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  AnnotationSettingsDataType,
  ClassNameObject,
  CurveTypes,
  CustomHighlightAreaSettingsDataType,
  CustomLayerDataType,
  HighlightAreaSettingsDataType,
  MultiLineAltChartDataType,
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
import { Colors } from '@/Components/ColorPalette';

interface Props {
  // Data
  /** Array of data objects */
  data: MultiLineAltChartDataType[];
  lineColors: string[];
  width: number;
  height: number;
  dateFormat: string;
  noOfXTicks: number;
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  suffix: string;
  prefix: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  highlightedLines: (string | number)[];
  animate: AnimateDataType;
  rtl: boolean;
  strokeWidth: number;
  showLabels: boolean;
  showDots: boolean;
  annotations: AnnotationSettingsDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsDataType[];
  yAxisTitle?: string;
  noOfYTicks: number;
  minDate?: string | number;
  maxDate?: string | number;
  colorDomain: (string | number)[];
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  selectedColor?: string;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
}

interface FormattedDataType {
  y: number;
  date: Date;
  label: number | string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    lineColors,
    dateFormat,
    noOfXTicks,
    rightMargin,
    topMargin,
    bottomMargin,
    suffix,
    prefix,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
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
    colorDomain,
    selectedColor,
    classNames,
    showLabels,
    dimmedOpacity,
    precision,
    naLabel,
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
  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  ).filter(d => !checkIfNullOrUndefined(d.y));
  const labels = uniqBy(dataFormatted, d => d.label).map(d => d.label);
  const dates = uniqBy(
    sortBy(
      data.map(d => ({
        ...d,
        date: parse(`${d.date}`, dateFormat, new Date()),
      })),
      'date',
    ),
    d => d.date,
  ).map(d => d.date);
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
  const lineArray = labels.map(d =>
    sortBy(
      dataFormatted.filter(el => el.label == d),
      'date',
    ),
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
  const minYear = minDate ? parse(`${minDate}`, dateFormat, new Date()) : dates[0];
  const maxYear = maxDate ? parse(`${maxDate}`, dateFormat, new Date()) : dates[dates.length - 1];
  const minParam: number = checkIfNullOrUndefined(minValue)
    ? Math.min(...(dataFormatted.map(d => d.y).filter(d => !checkIfNullOrUndefined(d)) as number[]))
      ? (Math.min(
          ...(dataFormatted.map(d => d.y).filter(d => !checkIfNullOrUndefined(d)) as number[]),
        ) as number) > 0
        ? 0
        : (Math.min(
            ...(dataFormatted.map(d => d.y).filter(d => !checkIfNullOrUndefined(d)) as number[]),
          ) as number)
      : 0
    : (minValue as number);
  const maxParam: number = (Math.max(
    ...(dataFormatted.map(d => d.y).filter(d => !checkIfNullOrUndefined(d)) as number[]),
  ) as number)
    ? (Math.max(
        ...(dataFormatted.map(d => d.y).filter(d => !checkIfNullOrUndefined(d)) as number[]),
      ) as number)
    : 0;

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? minParam : (minValue as number),
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const voronoiDiagram = Delaunay.from(
    dataFormatted.filter(d => !checkIfNullOrUndefined(d.date) && !checkIfNullOrUndefined(d.y)),
    d => x(d.date),
    d => y(d.y as number),
  ).voronoi([0, 0, graphWidth < 0 ? 0 : graphWidth, graphHeight < 0 ? 0 : graphHeight]);
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
          <motion.g>
            {lineArray.map(d => (
              <motion.g
                key={d[0].label}
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
                variants={{
                  initial: {
                    opacity: mouseOverData
                      ? d[0].label === mouseOverData.label
                        ? 1
                        : dimmedOpacity
                      : selectedColor
                        ? d[0].color
                          ? lineColors[colorDomain.indexOf(d[0].color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedLines.length !== 0
                          ? highlightedLines.indexOf(d[0].label) !== -1
                            ? 1
                            : dimmedOpacity
                          : 1,
                  },
                  whileInView: {
                    opacity: mouseOverData
                      ? d[0].label === mouseOverData.label
                        ? 1
                        : dimmedOpacity
                      : selectedColor
                        ? d[0].color
                          ? lineColors[colorDomain.indexOf(d[0].color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedLines.length !== 0
                          ? highlightedLines.indexOf(d[0].label) !== -1
                            ? 1
                            : dimmedOpacity
                          : 1,
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
              >
                <motion.path
                  d={
                    lineShape(
                      d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                    ) || ''
                  }
                  style={{
                    fill: 'none',
                    strokeWidth: mouseOverData
                      ? d[0].label === mouseOverData.label
                        ? strokeWidth + Math.max(2, 0.5 * strokeWidth)
                        : strokeWidth
                      : highlightedLines.length !== 0
                        ? highlightedLines.indexOf(d[0].label) !== -1
                          ? strokeWidth + Math.max(2, 0.5 * strokeWidth)
                          : strokeWidth
                        : strokeWidth,
                  }}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      pathLength: 0,
                      d:
                        lineShape(
                          d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                        ) || '',
                      opacity: 1,
                      stroke:
                        data.filter(el => el.color).length === 0
                          ? lineColors[0]
                          : !d[0].color
                            ? Colors.gray
                            : lineColors[colorDomain.indexOf(d[0].color)],
                    },
                    whileInView: {
                      pathLength: 1,
                      d:
                        lineShape(
                          d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                        ) || '',
                      opacity: 1,
                      stroke:
                        data.filter(el => el.color).length === 0
                          ? lineColors[0]
                          : !d[0].color
                            ? Colors.gray
                            : lineColors[colorDomain.indexOf(d[0].color)],
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                />
                {d.map((el, j) => (
                  <motion.g key={j}>
                    {!checkIfNullOrUndefined(el.y) ? (
                      <>
                        {showDots ? (
                          <motion.circle
                            r={graphWidth / d.length < 5 ? 0 : graphWidth / d.length < 20 ? 2 : 4}
                            exit={{ opacity: 0, transition: { duration: animate.duration } }}
                            variants={{
                              initial: {
                                opacity: 0,
                                fill:
                                  data.filter(el => el.color).length === 0
                                    ? lineColors[0]
                                    : !d[0].color
                                      ? Colors.gray
                                      : lineColors[colorDomain.indexOf(d[0].color)],
                                cx: x(el.date),
                                cy: y(el.y as number),
                              },
                              whileInView: {
                                opacity: 1,
                                fill:
                                  data.filter(el => el.color).length === 0
                                    ? lineColors[0]
                                    : !d[0].color
                                      ? Colors.gray
                                      : lineColors[colorDomain.indexOf(d[0].color)],
                                transition: {
                                  duration: hasAnimatedOnce ? animate.duration : 0.5,
                                  delay: hasAnimatedOnce ? 0 : animate.duration,
                                },
                                cx: x(el.date),
                                cy: y(el.y as number),
                              },
                            }}
                            initial='initial'
                            animate={isInView ? 'whileInView' : 'initial'}
                          />
                        ) : null}
                      </>
                    ) : null}
                  </motion.g>
                ))}
                {(highlightedLines.indexOf(d[0].label) !== -1 ||
                  mouseOverData?.label === d[0].label) &&
                showLabels ? (
                  <motion.text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? lineColors[0]
                          : !d[0].color
                            ? Colors.gray
                            : lineColors[colorDomain.indexOf(d[0].color)],
                    }}
                    className='text-sm font-bold'
                    dx={5}
                    dy={4}
                    exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    variants={{
                      initial: {
                        opacity: 0,
                        x: x(d[d.length - 1].date),
                        y: y(d[d.length - 1].y as number),
                      },
                      whileInView: {
                        opacity: 1,
                        x: x(d[d.length - 1].date),
                        y: y(d[d.length - 1].y as number),
                        transition: {
                          duration: hasAnimatedOnce ? animate.duration : 0.5,
                          delay: hasAnimatedOnce ? 0 : animate.duration,
                        },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  >
                    {d[0].label}
                  </motion.text>
                ) : null}
              </motion.g>
            ))}
            {mouseOverData ? (
              <text
                y={y(mouseOverData.y) - 8}
                x={x(mouseOverData.date)}
                className={cn('graph-value text-sm font-bold', classNames?.graphObjectValues)}
                style={{
                  fill:
                    data.filter(el => el.color).length === 0
                      ? lineColors[0]
                      : !mouseOverData.color
                        ? Colors.gray
                        : lineColors[colorDomain.indexOf(mouseOverData.color)],
                  textAnchor: 'middle',
                  ...(styles?.graphObjectValues || {}),
                }}
              >
                {numberFormattingFunction(mouseOverData.y, naLabel, precision, prefix, suffix)}
              </text>
            ) : null}
          </motion.g>
          {dataFormatted
            .filter(d => !checkIfNullOrUndefined(d.y))
            .map((d, i) => {
              return (
                <g key={i}>
                  <path
                    d={voronoiDiagram.renderCell(
                      dataFormatted.findIndex(el => el.label === d.label && el.date === d.date),
                    )}
                    opacity={0}
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
                    onMouseLeave={() => {
                      setMouseOverData(undefined);
                      setEventX(undefined);
                      setEventY(undefined);
                      onSeriesMouseOver?.(undefined);
                    }}
                  />
                </g>
              );
            })}
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
