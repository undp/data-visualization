import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
import sum from 'lodash.sum';
import { AnimatePresence, motion, useInView } from 'motion/react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import {
  AnimateDataType,
  BulletChartDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { RefLineX, RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';

interface Props {
  data: BulletChartDataType[];
  width: number;
  height: number;
  barColor: string;
  suffix: string;
  prefix: string;
  barPadding: number;
  showLabels: boolean;
  showValues: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  refValues?: ReferenceDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  labelOrder?: string[];
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  targetColor: string;
  targetStyle: 'background' | 'line';
  qualitativeRangeColors: string[];
  measureBarWidthFactor: number;
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
  rtl: boolean;
  targetLineThickness: number;
}

export function VerticalGraph(props: Props) {
  const {
    data,
    width,
    height,
    barColor,
    suffix,
    prefix,
    barPadding,
    showLabels,
    showValues,
    showTicks,
    truncateBy,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    labelOrder,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    classNames,
    targetStyle,
    targetColor,
    qualitativeRangeColors,
    measureBarWidthFactor,
    animate,
    dimmedOpacity,
    precision,
    customLayers,
    naLabel,
    targetLineThickness,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: barAxisTitle ? leftMargin + 30 : leftMargin,
    right: rightMargin,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const barMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) < 0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));
  const targetMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) <
    0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.target as number));
  const qualitativeRangeMaxValue = Math.max(
    ...data.map(d => sum((d.qualitativeRange || []).filter(l => !checkIfNullOrUndefined(l))) || 0),
  );
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite)) <
        0
      ? 0
      : Math.max(
          ...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite),
        );
  const barMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) >= 0
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));

  const targetMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) >=
    0
      ? 0
      : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number),
        );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite)) >= 0
      ? 0
      : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite));

  const y = scaleLinear().domain([xMinValue, xMaxValue]).range([graphHeight, 0]).nice();

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const x = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphWidth, minBarThickness * barOrder.length)
        : maxBarThickness
          ? Math.min(graphWidth, maxBarThickness * barOrder.length)
          : graphWidth,
    ])
    .paddingInner(barPadding);
  const yTicks = y.ticks(noOfTicks);
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
          <Axis
            y1={y(xMinValue < 0 ? 0 : xMinValue)}
            y2={y(xMinValue < 0 ? 0 : xMinValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              xMinValue < 0 ? 0 : xMinValue,
              naLabel,
              precision,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              dx: 0,
              dy: xMaxValue < 0 ? '1em' : -5,
              y: y(xMinValue < 0 ? 0 : xMinValue),
            }}
            classNames={{
              axis: classNames?.xAxis?.axis,
              label: classNames?.yAxis?.labels,
            }}
            styles={{ axis: styles?.xAxis?.axis, label: styles?.yAxis?.labels }}
          />
          {showTicks ? (
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
          ) : null}
          <AxisTitle
            x={0 - leftMargin - 15}
            y={graphHeight / 2}
            style={styles?.yAxis?.title}
            className={classNames?.yAxis?.title}
            text={barAxisTitle}
            rotate90
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map(d =>
              !checkIfNullOrUndefined(x(d.id)) ? (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
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
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      x: x(`${d.id}`),
                      y: 0,
                      opacity:
                        highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                    },
                    whileInView: {
                      x: x(`${d.id}`),
                      y: 0,
                      opacity:
                        highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                >
                  {d.qualitativeRange
                    ? d.qualitativeRange.map((_el, j) => (
                        <motion.rect
                          key={j}
                          x={0}
                          exit={{
                            height: 0,
                            y: y(0),
                            transition: { duration: animate.duration },
                          }}
                          variants={{
                            initial: {
                              height: 0,
                              y: y(0),
                              fill: qualitativeRangeColors[j],
                            },
                            whileInView: {
                              height: Math.abs(
                                y(
                                  sum(
                                    (d.qualitativeRange as number[]).filter(
                                      (element, k) => k <= j && element,
                                    ),
                                  ),
                                ) -
                                  y(
                                    sum(
                                      (d.qualitativeRange as number[]).filter(
                                        (element, k) => k < j && element,
                                      ),
                                    ),
                                  ),
                              ),
                              y: y(
                                sum(
                                  (d.qualitativeRange as number[]).filter(
                                    (element, k) => k <= j && element,
                                  ),
                                ),
                              ),
                              fill: qualitativeRangeColors[j],
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                          width={x.bandwidth()}
                        />
                      ))
                    : null}
                  {d.target && targetStyle === 'background' ? (
                    <motion.rect
                      x={0}
                      width={x.bandwidth()}
                      exit={{
                        height: 0,
                        y: y(0),
                        fill: targetColor,
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          height: 0,
                          fill: targetColor,
                          y: y(0),
                        },
                        whileInView: {
                          height: Math.abs(y(d.target) - y(0)),
                          fill: targetColor,
                          y: d.target > 0 ? y(d.target) : y(0),
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  ) : null}
                  {d.size ? (
                    <motion.rect
                      x={x.bandwidth() * ((1 - measureBarWidthFactor) / 2)}
                      width={x.bandwidth() * measureBarWidthFactor}
                      style={{
                        fill: barColor,
                      }}
                      exit={{
                        height: 0,
                        y: y(0),
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          height: 0,
                          y: y(0),
                        },
                        whileInView: {
                          height: Math.abs(y(d.size) - y(0)),
                          y: d.size > 0 ? y(d.size) : y(0),
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  ) : null}
                  {d.target && targetStyle === 'line' ? (
                    <motion.rect
                      x={0}
                      width={x.bandwidth()}
                      exit={{
                        y: y(0),
                        opacity: 0,
                        fill: targetColor,
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          y: y(0),
                          opacity: 0,
                          fill: targetColor,
                        },
                        whileInView: {
                          y: y(d.target) - targetLineThickness / 2,
                          opacity: 1,
                          fill: targetColor,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      height={targetLineThickness}
                    />
                  ) : null}
                  {showLabels ? (
                    <XAxesLabels
                      value={
                        `${d.label}`.length < truncateBy
                          ? `${d.label}`
                          : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={(d.size || 0) < 0 ? 0 : y(0) + 5}
                      x={0}
                      width={x.bandwidth()}
                      height={(d.size || 0) < 0 ? y(0) - 5 : margin.bottom}
                      style={styles?.xAxis?.labels}
                      className={classNames?.xAxis?.labels}
                      alignment={(d.size || 0) < 0 ? 'bottom' : 'top'}
                      animate={animate}
                      isInView={isInView}
                    />
                  ) : null}
                  {showValues ? (
                    <motion.text
                      x={x.bandwidth() / 2}
                      style={{
                        textAnchor: 'middle',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn(
                        'graph-value text-sm',
                        !valueColor && barColor.length > 1
                          ? ' fill-primary-gray-600 dark:fill-primary-gray-300'
                          : '',
                        classNames?.graphObjectValues,
                      )}
                      dy={d.size ? (d.size >= 0 ? '-5px' : '1em') : '-5px'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      variants={{
                        initial: {
                          y: y(0),
                          opacity: 0,
                          fill: valueColor || barColor,
                        },
                        whileInView: {
                          y: y(d.size || 0),
                          opacity: 1,
                          fill: valueColor || barColor,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    >
                      {numberFormattingFunction(d.size, naLabel, precision, prefix, suffix)}
                    </motion.text>
                  ) : null}
                </motion.g>
              ) : null,
            )}
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
          </AnimatePresence>
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

export function HorizontalGraph(props: Props) {
  const {
    data,
    topMargin = 25,
    bottomMargin = 10,
    leftMargin = 100,
    rightMargin = 40,
    barColor,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    truncateBy,
    width,
    height,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    highlightedDataPoints,
    maxValue,
    minValue,
    onSeriesMouseClick,
    labelOrder,
    rtl,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    classNames,
    targetStyle,
    targetColor,
    qualitativeRangeColors,
    measureBarWidthFactor,
    animate,
    dimmedOpacity,
    precision,
    customLayers,
    naLabel,
    targetLineThickness,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const barMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) < 0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));
  const targetMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) <
    0
      ? 0
      : Math.max(
          ...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number),
        );
  const qualitativeRangeMaxValue = Math.max(
    ...data.map(d => sum((d.qualitativeRange || []).filter(l => !checkIfNullOrUndefined(l))) || 0),
  );
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite)) <
        0
      ? 0
      : Math.max(
          ...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite),
        );
  const barMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) >= 0
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));

  const targetMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) >=
    0
      ? 0
      : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number),
        );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite)) >= 0
      ? 0
      : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite));

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const y = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * barOrder.length)
        : maxBarThickness
          ? Math.min(graphHeight, maxBarThickness * barOrder.length)
          : graphHeight,
    ])
    .paddingInner(barPadding);
  const xTicks = x.ticks(noOfTicks);

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
          {showTicks ? (
            <XTicksAndGridLines
              values={xTicks.filter(d => d !== 0)}
              x={xTicks.filter(d => d !== 0).map(d => x(d))}
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
          <AxisTitle
            x={graphWidth / 2}
            y={0 - margin.top + 15}
            style={styles?.xAxis?.title}
            className={classNames?.xAxis?.title}
            text={barAxisTitle}
          />
          <Axis
            x1={x(xMinValue < 0 ? 0 : xMinValue)}
            x2={x(xMinValue < 0 ? 0 : xMinValue)}
            y1={-2.5}
            y2={graphHeight + margin.bottom}
            classNames={{ axis: classNames?.yAxis?.axis }}
            styles={{ axis: styles?.yAxis?.axis }}
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map(d =>
              !checkIfNullOrUndefined(y(d.id)) ? (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
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
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      x: 0,
                      y: y(`${d.id}`),
                      opacity:
                        highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                    },
                    whileInView: {
                      x: 0,
                      y: y(`${d.id}`),
                      opacity:
                        highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                >
                  {d.qualitativeRange
                    ? d.qualitativeRange.map((el, j) => (
                        <motion.rect
                          key={j}
                          exit={{
                            width: 0,
                            x: x(0),
                            transition: { duration: animate.duration },
                          }}
                          variants={{
                            initial: {
                              x: x(0),
                              width: 0,
                              fill: qualitativeRangeColors[j],
                            },
                            whileInView: {
                              x: x(
                                j === 0
                                  ? 0
                                  : sum(
                                      (d.qualitativeRange as number[]).filter(
                                        (element, k) => k < j && element,
                                      ),
                                    ),
                              ),
                              width: x(el),
                              fill: qualitativeRangeColors[j],
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                          y={0}
                          height={y.bandwidth()}
                        />
                      ))
                    : null}
                  {d.target && targetStyle === 'background' ? (
                    <motion.rect
                      y={0}
                      x={d.target >= 0 ? x(0) : x(d.target)}
                      height={y.bandwidth()}
                      exit={{
                        width: 0,
                        x: x(0),
                        fill: targetColor,
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          x: x(0),
                          fill: targetColor,
                          width: 0,
                        },
                        whileInView: {
                          x: d.target >= 0 ? x(0) : x(d.target),
                          fill: targetColor,
                          width: d.target >= 0 ? x(d.target) - x(0) : x(0) - x(d.target),
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  ) : null}
                  {d.size ? (
                    <motion.rect
                      y={y.bandwidth() * ((1 - measureBarWidthFactor) / 2)}
                      style={{
                        fill: barColor,
                      }}
                      height={y.bandwidth() * measureBarWidthFactor}
                      exit={{
                        width: 0,
                        x: x(0),
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          x: x(0),
                          width: 0,
                        },
                        whileInView: {
                          x: d.size >= 0 ? x(0) : x(d.size),
                          width: d.size >= 0 ? x(d.size) - x(0) : x(0) - x(d.size),
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  ) : null}
                  {d.target && targetStyle === 'line' ? (
                    <motion.rect
                      y={0}
                      height={y.bandwidth()}
                      width={targetLineThickness}
                      exit={{
                        opacity: 0,
                        x: x(0),
                        fill: targetColor,
                        transition: { duration: animate.duration },
                      }}
                      variants={{
                        initial: {
                          x: x(0),
                          opacity: 0,
                          fill: targetColor,
                        },
                        whileInView: {
                          x: x(d.target) - targetLineThickness / 2,
                          opacity: 1,
                          fill: targetColor,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    />
                  ) : null}
                  {showLabels ? (
                    <YAxesLabels
                      value={
                        `${d.label}`.length < truncateBy
                          ? `${d.label}`
                          : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={0}
                      x={(d.size || 0) < 0 ? x(0) : 0 - margin.left}
                      width={(d.size || 0) < 0 ? width - x(0) : x(0) + margin.left}
                      height={y.bandwidth()}
                      alignment={d.size ? (d.size < 0 ? 'left' : 'right') : 'right'}
                      style={styles?.yAxis?.labels}
                      className={classNames?.yAxis?.labels}
                      animate={animate}
                      isInView={isInView}
                    />
                  ) : null}
                  {showValues ? (
                    <motion.text
                      y={y.bandwidth() / 2}
                      style={{
                        textAnchor: d.size ? (d.size < 0 ? 'end' : 'start') : 'start',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn(
                        'graph-value text-sm',
                        !valueColor && barColor.length > 1
                          ? ' fill-primary-gray-600 dark:fill-primary-gray-300'
                          : '',
                        classNames?.graphObjectValues,
                      )}
                      dx={d.size ? (d.size < 0 ? -5 : 5) : 5}
                      dy='0.33em'
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      variants={{
                        initial: {
                          x: x(0),
                          opacity: 0,
                          fill: valueColor || barColor,
                        },
                        whileInView: {
                          x: d.size ? x(d.size) : x(0),
                          opacity: 1,
                          fill: valueColor || barColor,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    >
                      {numberFormattingFunction(d.size, naLabel, precision, prefix, suffix)}
                    </motion.text>
                  ) : null}
                </motion.g>
              ) : null,
            )}
            {refValues ? (
              <>
                {refValues.map((el, i) => (
                  <RefLineX
                    key={i}
                    text={el.text}
                    color={el.color}
                    x={x(el.value as number)}
                    y1={0 - margin.top}
                    y2={graphHeight + margin.bottom}
                    textSide={x(el.value as number) > graphWidth * 0.75 || rtl ? 'left' : 'right'}
                    classNames={el.classNames}
                    styles={el.styles}
                    animate={animate}
                    isInView={isInView}
                  />
                ))}
              </>
            ) : null}
          </AnimatePresence>
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
