import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { useRef, useState } from 'react';
import uniqBy from 'lodash.uniqby';
import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
import { motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  ClassNameObject,
  HeatMapDataType,
  ScaleDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';

interface Props {
  data: HeatMapDataType[];
  colorDomain: string[] | number[];
  colors: string[];
  noDataColor: string;
  scaleType: ScaleDataType;
  showColumnLabels: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  showRowLabels: boolean;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  selectedColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: AnimateDataType;
  precision: number;
}

export function Graph(props: Props) {
  const {
    data,
    showColumnLabels,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showValues,
    colorDomain,
    colors,
    noDataColor,
    scaleType,
    showRowLabels,
    selectedColor,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    animate,
    precision,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [mouseOverData, setMouseOverData] = useState<HeatMapDataType | undefined>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const columns = uniqBy(data, d => d.column).map(d => d.column);
  const rows = uniqBy(data, d => d.row).map(d => d.row);
  const y = scaleBand().domain(rows).range([0, graphHeight]);
  const barHeight = y.bandwidth();
  const x = scaleBand().domain(columns).range([0, graphWidth]);
  const barWidth = x.bandwidth();
  const colorScale =
    scaleType === 'categorical'
      ? scaleOrdinal<number | string, string>().domain(colorDomain).range(colors)
      : scaleType === 'threshold'
        ? scaleThreshold<number, string>()
            .domain(colorDomain as number[])
            .range(colors)
        : scaleLinear<string, string>()
            .domain(colorDomain as number[])
            .range(colors);
  return (
    <>
      <motion.svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
        direction='ltr'
        ref={svgRef}
      >
        <g transform={`translate(${margin.left},${0})`}>
          {showColumnLabels
            ? columns.map((d, i) => (
                <XAxesLabels
                  key={i}
                  y={0}
                  x={x(d) as number}
                  width={barWidth}
                  height={margin.top - 5}
                  value={
                    `${d}`.length < truncateBy ? `${d}` : `${`${d}`.substring(0, truncateBy)}...`
                  }
                  style={styles?.xAxis?.labels}
                  className={classNames?.xAxis?.labels}
                  alignment='bottom'
                  animate={{ duration: 0, once: true, amount: 0 }}
                  isInView={isInView}
                />
              ))
            : null}
        </g>
        <g transform={`translate(${0},${margin.top})`}>
          {showRowLabels
            ? rows.map((d, i) => (
                <YAxesLabels
                  value={
                    `${d}`.length < truncateBy ? `${d}` : `${`${d}`.substring(0, truncateBy)}...`
                  }
                  key={i}
                  y={y(d) as number}
                  x={0}
                  width={margin.left}
                  height={barHeight}
                  alignment='right'
                  style={styles?.yAxis?.labels}
                  className={classNames?.yAxis?.labels}
                  animate={{ duration: 0, once: true, amount: 0 }}
                  isInView={isInView}
                />
              ))
            : null}
        </g>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {rows.map((d, i) => (
            <g key={i} transform={`translate(0,${y(d)})`}>
              {columns.map(el => (
                <rect
                  key={`${d}-${el}`}
                  x={x(el)}
                  y={0}
                  width={barWidth}
                  height={barHeight}
                  style={{ fill: noDataColor }}
                  className='stroke-1 stroke-primary-white dark:stroke-primary-gray-700'
                />
              ))}
            </g>
          ))}
          {data
            .filter(d => !checkIfNullOrUndefined(d.value))
            .map((d, i) => {
              const color = !checkIfNullOrUndefined(d.value)
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  colorScale(d.value as any)
                : noDataColor;
              return (
                <g
                  key={`${d.column}-${d.row}`}
                  transform={`translate(${x(d.column)},${y(d.row)})`}
                  onMouseEnter={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    onSeriesMouseOver?.(d);
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
                  opacity={selectedColor ? (selectedColor === color ? 1 : 0.3) : 1}
                >
                  <motion.rect
                    x={0}
                    y={0}
                    width={barWidth}
                    height={barHeight}
                    className='stroke-1 stroke-primary-white dark:stroke-primary-gray-700'
                    exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    variants={{
                      initial: { fill: color, opacity: 0 },
                      whileInView: {
                        fill: color,
                        opacity: 1,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  />
                  {showValues && !checkIfNullOrUndefined(d.value) ? (
                    <motion.g
                      variants={{
                        initial: { opacity: 0 },
                        whileInView: { opacity: 1, transition: { duration: animate.duration } },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    >
                      <foreignObject key={i} y={0} x={0} width={barWidth} height={barHeight}>
                        <div className='flex flex-col justify-center items-center h-inherit p-1'>
                          <p
                            className={cn(
                              'text-xs text-center m-0 leading-[1.25] graph-value',
                              classNames?.graphObjectValues,
                            )}
                            style={{
                              color: getTextColorBasedOnBgColor(color),
                              ...(styles?.graphObjectValues || {}),
                            }}
                          >
                            {numberFormattingFunction(d.value, 'NA', precision, prefix, suffix)}
                          </p>
                        </div>
                      </foreignObject>
                    </motion.g>
                  ) : null}
                </g>
              );
            })}
          {mouseOverData ? (
            <rect
              x={x(mouseOverData.column)}
              y={y(mouseOverData.row)}
              width={barWidth}
              height={barHeight}
              style={{
                fill: 'none',
                fillOpacity: 0,
                strokeWidth: 1.5,
              }}
              className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
            />
          ) : null}
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
