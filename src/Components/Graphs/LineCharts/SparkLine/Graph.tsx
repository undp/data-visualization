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
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { format, parse } from 'date-fns';
import { bisectCenter } from 'd3-array';
import { pointer, select } from 'd3-selection';
import sortBy from 'lodash.sortby';
import { cn } from '@undp/design-system-react';

import {
  ClassNameObject,
  CurveTypes,
  CustomLayerDataType,
  LineChartDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  data: LineChartDataType[];
  lineColor: string;
  width: number;
  height: number;
  dateFormat: string;
  areaId?: string;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
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
    lineColor,
    dateFormat,
    areaId,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    minValue,
    maxValue,
    curveType,
    styles,
    classNames,
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
    left: leftMargin,
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
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const minYear = dataFormatted[0].date;
  const maxYear = dataFormatted[dataFormatted.length - 1].date;
  const minParam: number = minBy(dataFormatted, d => d.y)?.y
    ? (minBy(dataFormatted, d => d.y)?.y as number) > 0
      ? 0
      : (minBy(dataFormatted, d => d.y)?.y as number)
    : 0;
  const maxParam: number = maxBy(dataFormatted, d => d.y)?.y
    ? (maxBy(dataFormatted, d => d.y)?.y as number)
    : 0;

  const x = scaleTime().domain([minYear, maxYear]).range([0, graphWidth]);
  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? minParam : (minValue as number),
      checkIfNullOrUndefined(maxValue) ? (maxParam > 0 ? maxParam : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();

  const mainGraphArea = area<FormattedDataType>()
    .x(d => x(d.date))
    .y1(d => y(d.y))
    .y0(graphHeight)
    .curve(curve);
  const lineShape = line<FormattedDataType>()
    .x(d => x(d.date))
    .y(d => y(d.y))
    .curve(curve);
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
      onSeriesMouseOver?.(undefined);
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
        {areaId ? (
          <linearGradient id={areaId} x1='0' x2='0' y1='0' y2='1'>
            <stop style={{ stopColor: lineColor }} stopOpacity='0.1' offset='0%' />
            <stop style={{ stopColor: lineColor }} stopOpacity='0' offset='100%' />
          </linearGradient>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <g>
            <text
              className={cn(
                'xs:max-[360px]:hidden fill-primary-gray-700 dark:fill-primary-gray-300 text-[9px] md:text-[10px] lg:text-xs',
                classNames?.xAxis?.labels,
              )}
              y={graphHeight}
              x={x(dataFormatted[dataFormatted.length - 1].date)}
              style={{
                textAnchor: 'end',
                ...styles?.xAxis?.labels,
              }}
              dy='1em'
            >
              {format(dataFormatted[dataFormatted.length - 1].date, dateFormat)}
            </text>
            <text
              y={graphHeight}
              x={x(dataFormatted[0].date)}
              style={{
                textAnchor: 'start',
                ...styles?.xAxis?.labels,
              }}
              className={cn(
                'xs:max-[360px]:hidden fill-primary-gray-700 dark:fill-primary-gray-300 text-[9px] md:text-[10px] lg:text-xs',
                classNames?.xAxis?.labels,
              )}
              dy='1em'
            >
              {format(dataFormatted[0].date, dateFormat)}
            </text>
          </g>
          <g>
            <path
              d={mainGraphArea(dataFormatted) || ''}
              style={{
                fill: `url(#${areaId})`,
                clipPath: 'url(#clip)',
              }}
            />
            <path
              d={lineShape(dataFormatted) || ''}
              style={{
                stroke: lineColor,
                fill: 'none',
                strokeWidth: 2,
              }}
            />
            {mouseOverData ? (
              <circle
                y1={0}
                cy={y(mouseOverData.y)}
                cx={x(mouseOverData.date)}
                r={5}
                style={{ fill: lineColor }}
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
