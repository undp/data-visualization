import isEqual from 'fast-deep-equal';
import { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { group } from 'd3-array';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { AnimatePresence, motion } from 'motion/react';
import { cn, Modal } from '@undp/design-system-react';

import {
  ButterflyChartWithDateDataType,
  ClassNameObject,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForButterFlyChart } from '@/Utils/ensureCompleteData';
import { string2HTML } from '@/Utils/string2HTML';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: ButterflyChartWithDateDataType[];
  barColors: [string, string];
  centerGap: number;
  refValues: ReferenceDataType[];
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  barPadding: number;
  truncateBy: number;
  showValues: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  showTicks: boolean;
  suffix: string;
  prefix: string;
  indx: number;
  dateFormat: string;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks: number;
  precision: number;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    centerGap,
    refValues,
    maxValue,
    minValue,
    showValues,
    axisTitles,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    onSeriesMouseClick,
    showTicks,
    suffix,
    prefix,
    dateFormat,
    indx,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks,
    precision,
  } = props;

  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  );
  const uniqLabels = uniqBy(dataFormatted, d => d.label).map(d => d.label);
  const groupedData = Array.from(
    group(ensureCompleteDataForButterFlyChart(data, dateFormat || 'yyyy'), d => d.date),
    ([date, values]) => ({
      date,
      values: (
        uniqLabels.map(label =>
          values.find(o => o.label === label),
        ) as ButterflyChartWithDateDataType[]
      ).map(el => ({
        ...el,
        id: el.label,
      })),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
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
  const y = scaleBand()
    .domain(uniqLabels.map(d => `${d}`))
    .range([graphHeight, 0])
    .paddingInner(barPadding);

  const xMaxValueLeftBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
          ...data.filter(d => !checkIfNullOrUndefined(d.leftBar)).map(d => d.leftBar as number),
        ) < 0
      ? 0
      : Math.max(
          ...data.filter(d => !checkIfNullOrUndefined(d.leftBar)).map(d => d.leftBar as number),
        );
  const xMinValueLeftBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.leftBar)).map(d => d.leftBar as number),
        ) >= 0
      ? 0
      : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.leftBar)).map(d => d.leftBar as number),
        );

  const xMaxValueRightBar = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(
          ...data.filter(d => !checkIfNullOrUndefined(d.rightBar)).map(d => d.rightBar as number),
        ) < 0
      ? 0
      : Math.max(
          ...data.filter(d => !checkIfNullOrUndefined(d.rightBar)).map(d => d.rightBar as number),
        );
  const xMinValueRightBar = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.rightBar)).map(d => d.rightBar as number),
        ) >= 0
      ? 0
      : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.rightBar)).map(d => d.rightBar as number),
        );
  const minParam = xMinValueLeftBar < xMinValueRightBar ? xMinValueLeftBar : xMinValueRightBar;
  const maxParam = xMaxValueLeftBar > xMaxValueRightBar ? xMaxValueLeftBar : xMaxValueRightBar;
  const xRightBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([0, (graphWidth - centerGap) / 2])
    .nice();
  const xRightTicks = xRightBar.ticks(noOfTicks);
  const xLeftBar = scaleLinear()
    .domain([minParam, maxParam])
    .range([(graphWidth - centerGap) / 2, 0])
    .nice();
  const xLeftTicks = xLeftBar.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g transform={`translate(${0},${0})`}>
            {showTicks ? (
              <XTicksAndGridLines
                values={xLeftTicks.filter(d => d !== 0)}
                x={xLeftTicks.filter(d => d !== 0).map(d => xLeftBar(d))}
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
                leftLabel
                precision={precision}
              />
            ) : null}
            <AnimatePresence>
              {groupedData[indx].values.map((d, _i) => {
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
                      style={{ fill: barColors[0] }}
                      height={y.bandwidth()}
                      animate={{
                        width: d.leftBar
                          ? d.leftBar < 0
                            ? xLeftBar(d.leftBar) - xLeftBar(0)
                            : xLeftBar(0) - xLeftBar(d.leftBar)
                          : 0,
                        attrY: y(`${d.label}`),
                        attrX: d.leftBar
                          ? d.leftBar < 0
                            ? xLeftBar(0)
                            : xLeftBar(d.leftBar)
                          : xLeftBar(0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: barColors[0],
                          textAnchor: d.rightBar ? (d.rightBar > 0 ? 'end' : 'start') : 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        dx={d.leftBar ? (d.leftBar > 0 ? -5 : 5) : 5}
                        dy='0.33em'
                        animate={{
                          attrX: d.leftBar
                            ? xLeftBar(d.leftBar)
                            : xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar),
                          attrY: (y(`${d.label}`) as number) + y.bandwidth() / 2,
                        }}
                        transition={{ duration: 0.5 }}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                      >
                        {numberFormattingFunction(d.leftBar, precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
            </AnimatePresence>
            <Axis
              y1={-2.5}
              y2={graphHeight + margin.bottom}
              x1={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              x2={xLeftBar(xMinValueLeftBar < 0 ? 0 : xMinValueLeftBar)}
              classNames={{ axis: classNames?.yAxis?.axis }}
              styles={{ axis: styles?.yAxis?.axis }}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={xLeftBar(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide='left'
                    classNames={el.classNames}
                    styles={el.styles}
                    animate={0}
                  />
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${(graphWidth + centerGap) / 2},${0})`}>
            {showTicks ? (
              <XTicksAndGridLines
                values={xRightTicks.filter(d => d !== 0)}
                x={xRightTicks.filter(d => d !== 0).map(d => xRightBar(d))}
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
            ) : null}
            <AnimatePresence>
              {groupedData[indx].values.map((d, i) => {
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
                    key={i}
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
                      style={{ fill: barColors[1] }}
                      height={y.bandwidth()}
                      animate={{
                        width: d.rightBar
                          ? d.rightBar >= 0
                            ? xRightBar(d.rightBar) - xRightBar(0)
                            : xRightBar(0) - xRightBar(d.rightBar)
                          : 0,
                        attrY: y(`${d.label}`),
                        attrX: d.rightBar
                          ? d.rightBar >= 0
                            ? xRightBar(0)
                            : xRightBar(d.rightBar)
                          : xRightBar(0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: barColors[1],
                          textAnchor: d.rightBar ? (d.rightBar < 0 ? 'end' : 'start') : 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                        dy='0.33em'
                        animate={{
                          attrX: d.rightBar
                            ? xRightBar(d.rightBar)
                            : xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar),
                          attrY: (y(`${d.label}`) as number) + y.bandwidth() / 2,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {numberFormattingFunction(d.rightBar, precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
            </AnimatePresence>
            <Axis
              y1={-2.5}
              y2={graphHeight + margin.bottom}
              x1={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              x2={xRightBar(xMinValueRightBar < 0 ? 0 : xMinValueRightBar)}
              classNames={{ axis: classNames?.yAxis?.axis }}
              styles={{ axis: styles?.yAxis?.axis }}
            />
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={xRightBar(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide='right'
                    classNames={el.classNames}
                    styles={el.styles}
                    animate={0}
                  />
                ))}
              </>
            ) : null}
          </g>
          <g transform={`translate(${graphWidth / 2},${0})`}>
            {groupedData[indx].values.map((d, i) => (
              <YAxesLabels
                key={i}
                value={
                  `${d.label}`.length < truncateBy
                    ? `${d.label}`
                    : `${`${d.label}`.substring(0, truncateBy)}...`
                }
                y={y(`${d.id}`) as number}
                x={0 - centerGap / 2}
                width={centerGap}
                height={y.bandwidth()}
                alignment='center'
                style={styles?.yAxis?.labels}
                className={classNames?.yAxis?.labels}
                animate={0}
              />
            ))}
          </g>

          <g transform={`translate(${0},${graphHeight})`}>
            <text
              style={{
                fill: barColors[0],
                textAnchor: 'end',
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
              x={graphWidth / 2 - centerGap / 2}
              y={0}
              dx={-5}
              dy={20}
            >
              {axisTitles[0]}
            </text>
            <text
              style={{
                fill: barColors[1],
                textAnchor: 'start',
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
              x={graphWidth / 2 + centerGap / 2}
              y={0}
              dx={5}
              dy={20}
            >
              {axisTitles[1]}
            </text>
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
