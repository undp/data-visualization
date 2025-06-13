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
import { useAnimate, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react';
import uniqBy from 'lodash.uniqby';
import { Delaunay } from 'd3-delaunay';

import {
  AnnotationSettingsDataType,
  ClassNameObject,
  CurveTypes,
  CustomHighlightAreaSettingsDataType,
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
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings: HighlightAreaSettingsDataType[];
  refValues: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  highlightedLines: (string | number)[];
  animateLine: boolean | number;
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
    animateLine,
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
  const [scope, animate] = useAnimate();
  const [annotationsScope, annotationsAnimate] = useAnimate();
  const isInView = useInView(scope);
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
    ? min(dataFormatted.map(d => d.y))
      ? (min(dataFormatted.map(d => d.y)) as number) > 0
        ? 0
        : (min(dataFormatted.map(d => d.y)) as number)
      : 0
    : (minValue as number);
  const maxParam: number = (max(dataFormatted.map(d => d.y)) as number)
    ? (max(dataFormatted.map(d => d.y)) as number)
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
      if (onSeriesMouseOver) {
        onSeriesMouseOver(selectedData || dataFormatted[dataFormatted.length - 1]);
      }
    };
    const mouseout = () => {
      setMouseOverData(undefined);
      setEventX(undefined);
      setEventY(undefined);
    };
    select(MouseoverRectRef.current).on('mousemove', mousemove).on('mouseout', mouseout);
    if (onSeriesMouseOver) {
      onSeriesMouseOver(undefined);
    }
  }, [x, dataFormatted, onSeriesMouseOver]);

  useEffect(() => {
    if (isInView && data.length > 0) {
      animate(
        'path',
        { pathLength: [0, 1] },
        { duration: animateLine === true ? 5 : animateLine || 0 },
      );
      if (showDots) {
        animate(
          'circle',
          { opacity: [0, 1] },
          {
            delay: animateLine === true ? 5 : animateLine || 0,
            duration: animateLine === true ? 0.5 : animateLine || 0,
          },
        );
      }
      annotationsAnimate(
        annotationsScope.current,
        { opacity: [0, 1] },
        {
          delay: animateLine === true ? 5 : animateLine || 0,
          duration: animateLine === true ? 0.5 : animateLine || 0,
        },
      );
    }
  }, [isInView, data, animate, animateLine, showDots, annotationsAnimate, annotationsScope]);
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
          />
          <CustomArea areaSettings={customHighlightAreaSettingsFormatted} scaleX={x} scaleY={y} />
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
            />
            <Axis
              y1={y(minParam < 0 ? 0 : minParam)}
              y2={y(minParam < 0 ? 0 : minParam)}
              x1={0 - leftMargin}
              x2={graphWidth + margin.right}
              label={numberFormattingFunction(minParam < 0 ? 0 : minParam, prefix, suffix)}
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
                  'fill-primary-gray-700 dark:fill-primary-gray-300 xs:max-[360px]:hidden text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs',
                  classNames?.xAxis?.labels,
                ),
              }}
              suffix={suffix}
              prefix={prefix}
              labelType='primary'
              showGridLines
            />
          </g>
          <g ref={scope}>
            {lineArray.map((d, i) => (
              <g
                key={i}
                opacity={
                  mouseOverData
                    ? d[0].label === mouseOverData.label
                      ? 1
                      : 0.3
                    : selectedColor
                      ? d[0].color
                        ? lineColors[colorDomain.indexOf(d[0].color)] === selectedColor
                          ? 1
                          : 0.3
                        : 0.3
                      : highlightedLines.length !== 0
                        ? highlightedLines.indexOf(d[0].label) !== -1
                          ? 1
                          : 0.3
                        : 1
                }
              >
                <path
                  key={i}
                  d={
                    lineShape(
                      d.filter((el): el is FormattedDataType => !checkIfNullOrUndefined(el.y)),
                    ) || ''
                  }
                  style={{
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? lineColors[0]
                        : !d[0].color
                          ? Colors.gray
                          : lineColors[colorDomain.indexOf(d[0].color)],
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
                />
                <g>
                  {d.map((el, j) => (
                    <g key={j}>
                      {!checkIfNullOrUndefined(el.y) ? (
                        <g>
                          {showDots ? (
                            <circle
                              cx={x(el.date)}
                              cy={y(el.y as number)}
                              r={graphWidth / d.length < 5 ? 0 : graphWidth / d.length < 20 ? 2 : 4}
                              style={{
                                fill:
                                  data.filter(el => el.color).length === 0
                                    ? lineColors[0]
                                    : !d[0].color
                                      ? Colors.gray
                                      : lineColors[colorDomain.indexOf(d[0].color)],
                              }}
                            />
                          ) : null}
                        </g>
                      ) : null}
                    </g>
                  ))}
                </g>
                {(highlightedLines.indexOf(d[0].label) !== -1 ||
                  mouseOverData?.label === d[0].label) &&
                showLabels ? (
                  <text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? lineColors[0]
                          : !d[0].color
                            ? Colors.gray
                            : lineColors[colorDomain.indexOf(d[0].color)],
                    }}
                    className='text-sm font-bold'
                    x={x(d[d.length - 1].date)}
                    y={y(d[d.length - 1].y as number)}
                    dx={5}
                    dy={4}
                  >
                    {d[0].label}
                  </text>
                ) : null}
              </g>
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
                {numberFormattingFunction(mouseOverData.y, prefix, suffix)}
              </text>
            ) : null}
          </g>
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
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver(d);
                      }
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
                      if (onSeriesMouseOver) {
                        onSeriesMouseOver(undefined);
                      }
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
                />
              ))}
            </>
          ) : null}
          <g ref={annotationsScope}>
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
                />
              );
            })}
          </g>
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
