import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  DumbbellChartDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { RefLineX, RefLineY } from '@/Components/Elements/ReferenceLine';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { DetailsModal } from '@/Components/Elements/DetailsModal';

interface Props {
  data: DumbbellChartDataType[];
  dotColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy: number;
  width: number;
  height: number;
  radius: number;
  showLabels: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue: number;
  minValue: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  selectedColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  arrowConnector: boolean;
  connectorStrokeWidth: number;
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  axisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  labelOrder?: string[];
  styles?: StyleObject;
  classNames?: ClassNameObject;
  refValues?: ReferenceDataType[];
  animate: AnimateDataType;
  precision: number;
  customLayers: CustomLayerDataType[];
  highlightedDataPoints: (string | number)[];
  dimmedOpacity: number;
  rtl: boolean;
}

export function VerticalGraph(props: Props) {
  const {
    data,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    dotColors,
    barPadding,
    showTicks,
    truncateBy,
    width,
    height,
    radius,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    maxValue,
    minValue,
    onSeriesMouseClick,
    showValues,
    suffix,
    prefix,
    selectedColor,
    arrowConnector,
    connectorStrokeWidth,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    axisTitle,
    noOfTicks,
    valueColor,
    styles,
    classNames,
    labelOrder,
    refValues,
    animate,
    precision,
    customLayers,
    highlightedDataPoints,
    dimmedOpacity,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: axisTitle ? leftMargin + 30 : leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const y = scaleLinear().domain([minValue, maxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphWidth, minBarThickness * dataWithId.length)
        : maxBarThickness
          ? Math.min(graphWidth, maxBarThickness * dataWithId.length)
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
        {arrowConnector ? (
          <defs>
            <marker
              id='arrow'
              viewBox='0 0 10 10'
              refX='10'
              refY='5'
              markerWidth='6'
              markerHeight='6'
              orient='auto-start-reverse'
            >
              <path
                d='M 0 0 L 10 5 L 0 10 z'
                className='fill-primary-gray-600 dark:fill-primary-gray-300'
              />
            </marker>
          </defs>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            y1={y(minValue < 0 ? 0 : minValue)}
            y2={y(minValue < 0 ? 0 : minValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              minValue < 0 ? 0 : minValue,
              'NA',
              precision,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              dx: 0,
              dy: maxValue < 0 ? '1em' : -5,
              y: y(minValue < 0 ? 0 : minValue),
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
            text={axisTitle}
            rotate90
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map(d => (
              <motion.g
                className='undp-viz-g-with-hover'
                key={d.label}
                variants={{
                  initial: {
                    x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                    y: 0,
                    opacity:
                      highlightedDataPoints.length !== 0
                        ? highlightedDataPoints.indexOf(d.label) !== -1
                          ? 0.85
                          : dimmedOpacity
                        : 0.85,
                  },
                  whileInView: {
                    x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
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
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
              >
                {showLabels ? (
                  <XAxesLabels
                    value={
                      `${d.label}`.length < truncateBy
                        ? `${d.label}`
                        : `${`${d.label}`.substring(0, truncateBy)}...`
                    }
                    y={graphHeight + 5}
                    x={0 - x.bandwidth() / 2}
                    width={x.bandwidth()}
                    height={margin.bottom}
                    style={styles?.xAxis?.labels}
                    className={classNames?.xAxis?.labels}
                    alignment='top'
                    animate={animate}
                    isInView={isInView}
                  />
                ) : null}
                <motion.line
                  x1={0}
                  x2={0}
                  style={{
                    strokeWidth: connectorStrokeWidth,
                    ...(styles?.dataConnectors || {}),
                    opacity: selectedColor ? 0.3 : 1,
                  }}
                  className={cn(
                    'stroke-primary-gray-600 dark:stroke-primary-gray-300',
                    classNames?.dataConnectors,
                  )}
                  markerEnd={
                    arrowConnector && d.x.indexOf(Math.min(...d.x.filter(el => el !== null))) === 0
                      ? 'url(#arrow)'
                      : ''
                  }
                  markerStart={
                    arrowConnector &&
                    d.x.indexOf(Math.min(...d.x.filter(el => el !== null))) === d.x.length - 1
                      ? 'url(#arrow)'
                      : ''
                  }
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      y1: 0,
                      y2: 0,
                    },
                    whileInView: {
                      y1: y(Math.min(...d.x.filter(el => el !== null))) + radius,
                      y2: y(Math.max(...d.x.filter(el => el !== null))) - radius,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                />
                {d.x.map((el, j) => (
                  <motion.g
                    key={j}
                    onMouseEnter={event => {
                      setMouseOverData({ ...d, xIndex: j });
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      onSeriesMouseOver?.({ ...d, xIndex: j });
                    }}
                    onClick={() => {
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          isEqual(mouseClickData, { ...d, xIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData({ ...d, xIndex: j });
                          if (onSeriesMouseClick) onSeriesMouseClick({ ...d, xIndex: j });
                        }
                      }
                    }}
                    onMouseMove={event => {
                      setMouseOverData({ ...d, xIndex: j });
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
                        opacity: selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1,
                      },
                      whileInView: {
                        opacity: selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  >
                    {checkIfNullOrUndefined(el) ? null : (
                      <>
                        <motion.circle
                          cx={0}
                          r={radius}
                          style={{
                            fill: dotColors[j],
                            fillOpacity: 0.85,
                            stroke: dotColors[j],
                            strokeWidth: 1,
                          }}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { cy: y(0), opacity: 0 },
                            whileInView: {
                              cy: y(el || 0),
                              opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        />
                        {showValues ? (
                          <motion.text
                            x={0}
                            style={{
                              textAnchor: 'start',
                              ...(styles?.graphObjectValues || {}),
                            }}
                            className={cn(
                              'graph-value text-sm font-bold',
                              checkIfNullOrUndefined(el) ? 'opacity-0' : 'opacity-100',
                              classNames?.graphObjectValues,
                            )}
                            dx={radius + 3}
                            dy='0.33em'
                            exit={{ opacity: 0, transition: { duration: animate.duration } }}
                            variants={{
                              initial: { y: y(0), opacity: 0, fill: valueColor || dotColors[j] },
                              whileInView: {
                                y: y(el || 0),
                                fill: valueColor || dotColors[j],
                                opacity: 1,
                                transition: { duration: animate.duration },
                              },
                            }}
                            initial='initial'
                            animate={isInView ? 'whileInView' : 'initial'}
                          >
                            {numberFormattingFunction(el, 'NA', precision, prefix, suffix)}
                          </motion.text>
                        ) : null}
                      </>
                    )}
                  </motion.g>
                ))}
              </motion.g>
            ))}
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
        <DetailsModal
          body={detailsOnClick}
          data={mouseClickData}
          setData={setMouseClickData}
          className={classNames?.modal}
        />
      ) : null}
    </>
  );
}

export function HorizontalGraph(props: Props) {
  const {
    data,
    leftMargin = 100,
    rightMargin = 40,
    topMargin = 20,
    bottomMargin = 10,
    dotColors,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    truncateBy,
    width,
    height,
    radius,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    arrowConnector,
    connectorStrokeWidth,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    axisTitle,
    noOfTicks,
    valueColor,
    styles,
    classNames,
    labelOrder,
    refValues,
    rtl,
    animate,
    precision,
    customLayers,
    highlightedDataPoints,
    dimmedOpacity,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const margin = {
    top: axisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);
  const x = scaleLinear().domain([minValue, maxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(barOrder)
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * dataWithId.length)
        : maxBarThickness
          ? Math.min(graphHeight, maxBarThickness * dataWithId.length)
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
        {arrowConnector ? (
          <defs>
            <marker
              id='arrow'
              viewBox='0 0 10 10'
              refX='10'
              refY='5'
              markerWidth='6'
              markerHeight='6'
              orient='auto-start-reverse'
            >
              <path
                d='M 0 0 L 10 5 L 0 10 z'
                className='fill-primary-gray-600 dark:fill-primary-gray-300'
              />
            </marker>
          </defs>
        ) : null}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {showTicks ? (
            <XTicksAndGridLines
              values={xTicks.filter((_d, i) => i !== 0)}
              x={xTicks.filter((_d, i) => i !== 0).map(d => x(d))}
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
            text={axisTitle}
          />
          <YTicksAndGridLines
            y={dataWithId.map(d => (y(`${d.id}`) as number) + y.bandwidth() / 2)}
            x1={0}
            x2={graphWidth}
            styles={{ gridLines: styles?.yAxis?.gridLines }}
            classNames={{ gridLines: classNames?.yAxis?.gridLines }}
            labelType='secondary'
            showGridLines
            labelPos='vertical'
            precision={precision}
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map(d => (
              <motion.g
                className='undp-viz-g-with-hover'
                key={d.label}
                variants={{
                  initial: {
                    x: 0,
                    y: (y(`${d.id}`) as number) + y.bandwidth() / 2,
                    opacity:
                      highlightedDataPoints.length !== 0
                        ? highlightedDataPoints.indexOf(d.label) !== -1
                          ? 0.85
                          : dimmedOpacity
                        : 0.85,
                  },
                  whileInView: {
                    x: 0,
                    y: (y(`${d.id}`) as number) + y.bandwidth() / 2,
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
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
              >
                {showLabels ? (
                  <YAxesLabels
                    value={
                      `${d.label}`.length < truncateBy
                        ? `${d.label}`
                        : `${`${d.label}`.substring(0, truncateBy)}...`
                    }
                    y={0 - y.bandwidth() / 2}
                    x={0 - margin.left}
                    width={margin.left}
                    height={y.bandwidth()}
                    alignment='right'
                    style={styles?.yAxis?.labels}
                    className={classNames?.yAxis?.labels}
                    animate={animate}
                    isInView={isInView}
                  />
                ) : null}
                <motion.line
                  y1={0}
                  y2={0}
                  style={{
                    strokeWidth: connectorStrokeWidth,
                    ...(styles?.dataConnectors || {}),
                    opacity: selectedColor ? 0.3 : 1,
                  }}
                  className={cn(
                    'stroke-primary-gray-600 dark:stroke-primary-gray-300',
                    classNames?.dataConnectors,
                  )}
                  markerEnd={
                    arrowConnector &&
                    d.x.indexOf(Math.min(...d.x.filter(el => el !== null)) as number) === 0
                      ? 'url(#arrow)'
                      : ''
                  }
                  markerStart={
                    arrowConnector &&
                    d.x.indexOf(Math.min(...d.x.filter(el => el !== null)) as number) ===
                      d.x.length - 1
                      ? 'url(#arrow)'
                      : ''
                  }
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  variants={{
                    initial: {
                      x1: 0,
                      x2: 0,
                    },
                    whileInView: {
                      x1: x(Math.min(...d.x.filter(el => el !== null))) + radius,
                      x2: x(Math.max(...d.x.filter(el => el !== null)) as number) - radius,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                />
                {d.x.map((el, j) => (
                  <motion.g
                    key={j}
                    onMouseEnter={event => {
                      setMouseOverData({ ...d, xIndex: j });
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      onSeriesMouseOver?.({ ...d, xIndex: j });
                    }}
                    onClick={() => {
                      if (onSeriesMouseClick || detailsOnClick) {
                        if (
                          isEqual(mouseClickData, { ...d, xIndex: j }) &&
                          resetSelectionOnDoubleClick
                        ) {
                          setMouseClickData(undefined);
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData({ ...d, xIndex: j });
                          if (onSeriesMouseClick) onSeriesMouseClick({ ...d, xIndex: j });
                        }
                      }
                    }}
                    onMouseMove={event => {
                      setMouseOverData({ ...d, xIndex: j });
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
                        opacity: selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1,
                      },
                      whileInView: {
                        opacity: selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  >
                    {checkIfNullOrUndefined(el) ? null : (
                      <>
                        <motion.circle
                          cy={0}
                          r={radius}
                          style={{
                            fill: dotColors[j],
                            fillOpacity: 0.85,
                            stroke: dotColors[j],
                            strokeWidth: 1,
                            opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                          }}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          variants={{
                            initial: { cx: x(0), opacity: 0 },
                            whileInView: {
                              cx: x(el || 0),
                              opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        />
                        {showValues ? (
                          <motion.text
                            y={0}
                            style={{
                              textAnchor: 'middle',
                              ...(styles?.graphObjectValues || {}),
                            }}
                            dx={0}
                            dy={0 - radius - 3}
                            className={cn(
                              'graph-value text-sm font-bold',
                              checkIfNullOrUndefined(el) ? '0opacity-0' : 'opacity-100',
                              classNames?.graphObjectValues,
                            )}
                            exit={{ opacity: 0, transition: { duration: animate.duration } }}
                            variants={{
                              initial: { x: x(0), opacity: 0, fill: valueColor || dotColors[j] },
                              whileInView: {
                                x: x(el || 0),
                                fill: valueColor || dotColors[j],
                                opacity: 1,
                                transition: { duration: animate.duration },
                              },
                            }}
                            initial='initial'
                            animate={isInView ? 'whileInView' : 'initial'}
                          >
                            {numberFormattingFunction(el, 'NA', precision, prefix, suffix)}
                          </motion.text>
                        ) : null}
                      </>
                    )}
                  </motion.g>
                ))}
              </motion.g>
            ))}
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
        <DetailsModal
          body={detailsOnClick}
          data={mouseClickData}
          setData={setMouseClickData}
          className={classNames?.modal}
        />
      ) : null}
    </>
  );
}
