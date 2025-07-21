import isEqual from 'fast-deep-equal';
import { useState } from 'react';
import {
  line,
  curveMonotoneX,
  curveLinear,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from 'd3-shape';
import { scaleBand, scaleLinear } from 'd3-scale';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { cn, Modal } from '@undp/design-system-react';
import { AnimatePresence, motion } from 'motion/react';

import { ClassNameObject, CurveTypes, ParetoChartDataType, StyleObject } from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { string2HTML } from '@/Utils/string2HTML';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';

interface Props {
  data: ParetoChartDataType[];
  barColor: string;
  lineColor: string;
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  sameAxes: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  barPadding: number;
  truncateBy: number;
  showLabels: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  noOfTicks: number;
  lineSuffix: string;
  barSuffix: string;
  linePrefix: string;
  showValues: boolean;
  barPrefix: string;
  curveType: CurveTypes;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: number;
  precision: number;
}
interface DataFormattedType {
  id: string;
  label: number | string;
  line?: number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColor,
    lineColor,
    axisTitles,
    sameAxes,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    showValues,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    showLabels,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    noOfTicks,
    lineSuffix,
    barSuffix,
    linePrefix,
    barPrefix,
    curveType,
    styles,
    classNames,
    animate,
    precision,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin + 50,
    right: rightMargin + 65,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));
  const x = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([0, graphWidth])
    .paddingInner(barPadding);
  const minParam1: number = minBy(dataWithId, d => d.bar)?.bar
    ? (minBy(dataWithId, d => d.bar)?.bar as number) > 0
      ? 0
      : (minBy(dataWithId, d => d.bar)?.bar as number)
    : 0;
  const minParam2: number = minBy(dataWithId, d => d.line)?.line
    ? (minBy(dataWithId, d => d.line)?.line as number) > 0
      ? 0
      : (minBy(dataWithId, d => d.line)?.line as number)
    : 0;
  const maxParam1: number = maxBy(dataWithId, d => d.bar)?.bar
    ? (maxBy(dataWithId, d => d.bar)?.bar as number)
    : 0;
  const maxParam2: number = maxBy(dataWithId, d => d.line)?.line
    ? (maxBy(dataWithId, d => d.line)?.line as number)
    : 0;

  const minParam = minParam1 < minParam2 ? minParam1 : minParam2;
  const maxParam = maxParam1 > maxParam2 ? maxParam1 : maxParam2;

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

  const lineShape = line<DataFormattedType>()
    .defined(d => !checkIfNullOrUndefined(d.line))
    .x(d => (x(`${d.id}`) as number) + x.bandwidth() / 2)
    .y(d => y2(d.line as number))
    .curve(curve);
  const y1Ticks = y1.ticks(noOfTicks);
  const y2Ticks = y2.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {y1Ticks.map((d, i) => (
              <g key={i}>
                <line
                  y1={y1(d)}
                  y2={y1(d)}
                  x1={-15}
                  x2={-20}
                  style={{
                    stroke: barColor,
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
                    fill: barColor,
                    ...(styles?.yAxis?.labels || {}),
                  }}
                >
                  {numberFormattingFunction(d, precision, barPrefix, barSuffix)}
                </text>
              </g>
            ))}
            <Axis
              y1={0}
              y2={graphHeight}
              x1={-15}
              x2={-15}
              classNames={{ axis: classNames?.xAxis?.axis }}
              styles={{ axis: { stroke: barColor, ...(styles?.xAxis?.axis || {}) } }}
            />
            <AxisTitle
              x={10 - margin.left}
              y={graphHeight / 2}
              style={{ fill: barColor, ...(styles?.yAxis?.title || {}) }}
              className={classNames?.yAxis?.title}
              text={
                axisTitles[0].length > 100 ? `${axisTitles[0].substring(0, 100)}...` : axisTitles[0]
              }
              rotate90
            />
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
                    stroke: lineColor,
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
                    fill: lineColor,
                    ...(styles?.yAxis?.labels || {}),
                  }}
                  className={cn('text-xs', classNames?.yAxis?.labels)}
                >
                  {numberFormattingFunction(d, precision, linePrefix, lineSuffix)}
                </text>
              </g>
            ))}
            <Axis
              y1={0}
              y2={graphHeight}
              x1={graphWidth + 15}
              x2={graphWidth + 15}
              classNames={{ axis: classNames?.xAxis?.axis }}
              styles={{ axis: { stroke: lineColor, ...(styles?.xAxis?.axis || {}) } }}
            />
            <AxisTitle
              x={graphWidth + margin.right - 15}
              y={graphHeight / 2}
              style={{ fill: lineColor, ...(styles?.yAxis?.title || {}) }}
              className={classNames?.yAxis?.title}
              text={
                axisTitles[1].length > 100 ? `${axisTitles[1].substring(0, 100)}...` : axisTitles[1]
              }
              rotate90
            />
          </g>
          <Axis
            y1={sameAxes ? y1(0) : graphHeight}
            y2={sameAxes ? y1(0) : graphHeight}
            x1={-15}
            x2={graphWidth + 15}
            classNames={{ axis: classNames?.xAxis?.axis }}
            styles={{ axis: styles?.xAxis?.axis }}
          />
          <AnimatePresence>
            {dataWithId.map((d, i) => {
              return (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  opacity={0.85}
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
                >
                  <motion.rect
                    initial={{
                      attrY: y1(0),
                      height: 0,
                    }}
                    animate={{
                      attrY: d.bar ? (d.bar > 0 ? y1(d.bar) : y1(0)) : 0,
                      height: d.bar ? Math.abs(y1(d.bar) - y1(0)) : 0,
                      opacity: 1,
                    }}
                    transition={{ duration: animate }}
                    exit={{
                      attrY: y1(0),
                      height: 0,
                      opacity: 0,
                      transition: { duration: animate },
                    }}
                    x={x(`${i}`)}
                    width={x.bandwidth()}
                    style={{ fill: barColor }}
                  />
                  {showValues && !checkIfNullOrUndefined(d.bar) ? (
                    <motion.text
                      x={(x(`${d.id}`) as number) + x.bandwidth() / 2}
                      initial={{
                        attrY: y1(0),
                        opacity: 0,
                      }}
                      animate={{
                        attrY: y1(d.bar || 0),
                        opacity: 1,
                      }}
                      exit={{
                        attrY: y1(0),
                        opacity: 0,
                        transition: { duration: animate },
                      }}
                      transition={{ duration: animate }}
                      style={{
                        fill: barColor,
                        textAnchor: 'middle',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                      dy={d.bar ? (d.bar >= 0 ? '-5px' : '1em') : '-5px'}
                    >
                      {numberFormattingFunction(d.bar, precision, barPrefix, barSuffix)}
                    </motion.text>
                  ) : null}
                  {showLabels ? (
                    <XAxesLabels
                      value={
                        `${d.label}`.length < truncateBy
                          ? `${d.label}`
                          : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={graphHeight + 5}
                      x={x(`${d.id}`) as number}
                      width={x.bandwidth()}
                      height={margin.bottom}
                      style={styles?.xAxis?.labels}
                      className={classNames?.xAxis?.labels}
                      alignment='top'
                      animate={animate}
                    />
                  ) : null}
                </motion.g>
              );
            })}
            <motion.path
              d={lineShape(dataWithId) as string}
              initial={{
                d: lineShape(dataWithId.map(d => ({ ...d, line: 0 }))) as string,
              }}
              animate={{
                d: lineShape(dataWithId) as string,
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: { duration: animate },
              }}
              style={{
                stroke: lineColor,
                fill: 'none',
                strokeWidth: 2,
              }}
            />
            {dataWithId.map((d, i) => (
              <g key={i}>
                {!checkIfNullOrUndefined(d.line) ? (
                  <g
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
                  >
                    <motion.circle
                      initial={{
                        cy: y2(0),
                        opacity: 0,
                      }}
                      animate={{
                        cy: y2(d.line as number),
                        opacity: 1,
                      }}
                      exit={{
                        cy: y2(0),
                        opacity: 0,
                        transition: { duration: animate },
                      }}
                      cx={(x(d.id) as number) + x.bandwidth() / 2}
                      cy={y2(d.line as number)}
                      r={
                        graphWidth / dataWithId.length < 5
                          ? 0
                          : graphWidth / dataWithId.length < 20
                            ? 2
                            : 4
                      }
                      style={{ fill: lineColor }}
                    />
                    {showValues ? (
                      <motion.text
                        x={(x(`${d.id}`) as number) + x.bandwidth() / 2}
                        initial={{
                          y: y2(0),
                          opacity: 0,
                        }}
                        animate={{
                          y: y2(d.line as number),
                          opacity: 1,
                        }}
                        exit={{
                          y: y2(0),
                          opacity: 0,
                          transition: { duration: animate },
                        }}
                        style={{
                          fill: lineColor,
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        dy='-5px'
                      >
                        {numberFormattingFunction(d.line, precision, linePrefix, lineSuffix)}
                      </motion.text>
                    ) : null}
                  </g>
                ) : null}
              </g>
            ))}
          </AnimatePresence>
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
