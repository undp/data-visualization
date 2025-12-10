import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useMemo, useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  BarGraphDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Colors } from '@/Components/ColorPalette';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineX, RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { DetailsModal } from '@/Components/Elements/DetailsModal';

interface Props {
  data: BarGraphDataType[];
  barColor: string[];
  colorDomain: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showValues: boolean;
  showTicks: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showLabels: boolean;
  truncateBy: number;
  width: number;
  height: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  selectedColor?: string;
  maxValue: number;
  minValue: number;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  labelOrder?: string[];
  rtl: boolean;
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
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
  trackColor?: string;
}

export function HorizontalGraph(props: Props) {
  const {
    data,
    barColor,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    truncateBy,
    width,
    height,
    colorDomain,
    topMargin = 25,
    bottomMargin = 10,
    leftMargin = 100,
    rightMargin = 40,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
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
    animate,
    dimmedOpacity,
    precision,
    customLayers,
    naLabel,
    trackColor,
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

  const dataWithId = useMemo(() => {
    const idSet = new Set<string>();

    const dataWithIdWithoutMissingIds = data.map((d, i) => {
      const id = labelOrder ? `${d.label}` : `${i}`;
      idSet.add(id);
      return { ...d, id };
    });

    const missingIds = labelOrder ? labelOrder.filter(id => !idSet.has(id)) : [];

    return [
      ...dataWithIdWithoutMissingIds,
      ...missingIds.map(id => ({
        id,
        label: id,
        color: null,
        size: null,
      })),
    ];
  }, [data, labelOrder]);

  const barOrder = useMemo(() => {
    return labelOrder ?? dataWithId.map(d => `${d.id}`);
  }, [labelOrder, dataWithId]);

  const x = scaleLinear().domain([minValue, maxValue]).range([0, graphWidth]).nice();
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
        ref={svgRef}
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
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
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map(d =>
              !checkIfNullOrUndefined(y(d.id)) ? (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  variants={{
                    initial: {
                      opacity: selectedColor
                        ? d.color
                          ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                    },
                    whileInView: {
                      opacity: selectedColor
                        ? d.color
                          ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
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
                  {trackColor && (
                    <motion.rect
                      height={y.bandwidth()}
                      variants={{
                        initial: {
                          width: graphWidth,
                          x: 0,
                          y: y(`${d.id}`),
                          fill: trackColor,
                        },
                        whileInView: {
                          width: graphWidth,
                          x: 0,
                          y: y(`${d.id}`),
                          fill: trackColor,
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    />
                  )}
                  {d.size ? (
                    <motion.rect
                      variants={{
                        initial: {
                          width: 0,
                          x: x(0),
                          y: y(`${d.id}`),
                          fill:
                            data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          width: d.size >= 0 ? x(d.size) - x(0) : x(0) - x(d.size),
                          x: d.size >= 0 ? x(0) : x(d.size),
                          y: y(`${d.id}`),
                          fill:
                            data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{
                        width: 0,
                        x: x(0),
                        transition: { duration: animate.duration },
                      }}
                      height={y.bandwidth()}
                    />
                  ) : null}
                  {showLabels ? (
                    <YAxesLabels
                      value={
                        `${d.label}`.length < truncateBy
                          ? `${d.label}`
                          : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={y(d.id) || 0}
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
                      variants={{
                        initial: {
                          x: x(0),
                          y: (y(`${d.id}`) as number) + y.bandwidth() / 2,
                          opacity: 0,
                          fill: valueColor
                            ? valueColor
                            : data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          x: d.size ? x(d.size) : x(0),
                          opacity: 1,
                          y: (y(`${d.id}`) as number) + y.bandwidth() / 2,
                          fill: valueColor
                            ? valueColor
                            : data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{
                        opacity: 0,
                        transition: { duration: animate.duration },
                      }}
                    >
                      {numberFormattingFunction(d.size, naLabel, precision, prefix, suffix)}
                    </motion.text>
                  ) : null}
                </motion.g>
              ) : null,
            )}
            <Axis
              x1={x(minValue < 0 ? 0 : minValue)}
              x2={x(minValue < 0 ? 0 : minValue)}
              y1={-2.5}
              y2={graphHeight + margin.bottom}
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

export function VerticalGraph(props: Props) {
  const {
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
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
    colorDomain,
    truncateBy,
    tooltip,
    onSeriesMouseOver,
    refValues,
    selectedColor,
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
    dimmedOpacity,
    animate,
    precision,
    customLayers,
    naLabel,
    trackColor,
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

  const dataWithId = useMemo(() => {
    const idSet = new Set<string>();

    const dataWithIdWithoutMissingIds = data.map((d, i) => {
      const id = labelOrder ? `${d.label}` : `${i}`;
      idSet.add(id);
      return { ...d, id };
    });

    const missingIds = labelOrder ? labelOrder.filter(id => !idSet.has(id)) : [];

    return [
      ...dataWithIdWithoutMissingIds,
      ...missingIds.map(id => ({
        id,
        label: id,
        color: null,
        size: null,
      })),
    ];
  }, [data, labelOrder]);

  const barOrder = useMemo(() => {
    return labelOrder ?? dataWithId.map(d => `${d.id}`);
  }, [labelOrder, dataWithId]);

  const y = scaleLinear().domain([minValue, maxValue]).range([graphHeight, 0]).nice();

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
        ref={svgRef}
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            y1={y(minValue < 0 ? 0 : minValue)}
            y2={y(minValue < 0 ? 0 : minValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              minValue < 0 ? 0 : minValue,
              naLabel,
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
            text={barAxisTitle}
            rotate90
          />
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {dataWithId.map((d, _i) =>
              !checkIfNullOrUndefined(x(d.id)) ? (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  variants={{
                    initial: {
                      opacity: selectedColor
                        ? d.color
                          ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                    },
                    whileInView: {
                      opacity: selectedColor
                        ? d.color
                          ? barColor[colorDomain.indexOf(d.color)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                      transition: { duration: animate.duration },
                    },
                  }}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
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
                  {trackColor && (
                    <motion.rect
                      width={x.bandwidth()}
                      variants={{
                        initial: {
                          height: graphHeight,
                          y: 0,
                          x: x(`${d.id}`),
                          fill: trackColor,
                        },
                        whileInView: {
                          height: graphHeight,
                          y: 0,
                          x: x(`${d.id}`),
                          fill: trackColor,
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    />
                  )}
                  {d.size ? (
                    <motion.rect
                      width={x.bandwidth()}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      variants={{
                        initial: {
                          height: 0,
                          x: x(`${d.id}`),
                          y: y(0),
                          fill:
                            data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          height: d.size ? Math.abs(y(d.size) - y(0)) : 0,
                          y: d.size ? (d.size > 0 ? y(d.size) : y(0)) : y(0),
                          x: x(`${d.id}`),
                          fill:
                            data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      exit={{
                        height: 0,
                        y: y(0),
                        transition: { duration: animate.duration },
                      }}
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
                      x={x(`${d.id}`) as number}
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
                      variants={{
                        initial: {
                          x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                          y: y(0),
                          opacity: 0,
                          fill: valueColor
                            ? valueColor
                            : data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                          y: y(d.size || 0),
                          fill: valueColor
                            ? valueColor
                            : data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                          opacity: 1,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{
                        opacity: 0,
                        transition: { duration: animate.duration },
                      }}
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
