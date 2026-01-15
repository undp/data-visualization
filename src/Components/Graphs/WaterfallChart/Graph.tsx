import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useMemo, useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
  WaterfallChartDataType,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Colors } from '@/Components/ColorPalette';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';

interface Props {
  data: WaterfallChartDataType[];
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
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  labelOrder?: string[];
  rtl: boolean;
  maxBarThickness?: number;
  minBarThickness?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks: number;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
}
function getWaterfallExtent(values: (number | null | undefined)[]) {
  let cumulative = 0;
  let max = 0;
  let min = 0;

  for (const v of values) {
    cumulative += v || 0;
    if (cumulative > max) max = cumulative;
    if (cumulative < min) min = cumulative;
  }

  return {
    max,
    min,
  };
}

export function Graph(props: Props) {
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
    detailsOnClick,
    barAxisTitle,
    noOfTicks,
    styles,
    classNames,
    dimmedOpacity,
    animate,
    precision,
    customLayers,
    naLabel,
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

  const { max, min } = getWaterfallExtent(data.map(d => d.size));

  const maxVal = !checkIfNullOrUndefined(maxValue) ? (maxValue as number) : max;
  const minVal = !checkIfNullOrUndefined(minValue) ? (minValue as number) : min;

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

  const y = scaleLinear().domain([minVal, maxVal]).range([graphHeight, 0]).nice();

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
  let running = 0;

  const waterfallData = dataWithId.map(d => {
    const start = running;
    running += d.size || 0;
    return {
      ...d,
      start,
      end: running,
    };
  });
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
            y1={y(minVal < 0 ? 0 : minVal)}
            y2={y(minVal < 0 ? 0 : minVal)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              minVal < 0 ? 0 : minVal,
              naLabel,
              precision,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              dx: 0,
              dy: maxVal < 0 ? '1em' : -5,
              y: y(minVal < 0 ? 0 : minVal),
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
            {waterfallData.map((d, _i) =>
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
                      if (isEqual(mouseClickData, d)) {
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
                  {d.size ? (
                    <motion.rect
                      width={x.bandwidth()}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      variants={{
                        initial: {
                          height: 0,
                          x: x(`${d.id}`),
                          y: y(d.start),
                          fill:
                            data.filter(el => el.color).length === 0
                              ? barColor[0]
                              : !d.color
                                ? Colors.gray
                                : barColor[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          height: Math.abs(y(d.start) - y(d.end)),
                          y: y(Math.max(d.start, d.end)),
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
                        y: y(d.start),
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
                      y={y(0) + 5}
                      x={x(`${d.id}`) as number}
                      width={x.bandwidth()}
                      height={margin.bottom}
                      style={styles?.xAxis?.labels}
                      className={classNames?.xAxis?.labels}
                      alignment='top'
                      animate={animate}
                      isInView={isInView}
                    />
                  ) : null}
                  {showValues && Math.abs(y(d.start) - y(d.end)) > 16 ? (
                    <motion.text
                      style={{
                        textAnchor: 'middle',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                      dy='0.33em'
                      variants={{
                        initial: {
                          x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                          y: (y(d.start) + y(d.end)) / 2,
                          opacity: 0,
                          fill:
                            data.filter(el => el.color).length === 0
                              ? getTextColorBasedOnBgColor(barColor[0])
                              : !d.color
                                ? getTextColorBasedOnBgColor(Colors.gray)
                                : getTextColorBasedOnBgColor(
                                    barColor[colorDomain.indexOf(d.color)],
                                  ),
                        },
                        whileInView: {
                          x: (x(`${d.id}`) as number) + x.bandwidth() / 2,
                          y: (y(d.start) + y(d.end)) / 2,
                          fill:
                            data.filter(el => el.color).length === 0
                              ? getTextColorBasedOnBgColor(barColor[0])
                              : !d.color
                                ? getTextColorBasedOnBgColor(Colors.gray)
                                : getTextColorBasedOnBgColor(
                                    barColor[colorDomain.indexOf(d.color)],
                                  ),
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
                      {numberFormattingFunction(
                        d.size ? Math.abs(d.size) : d.size,
                        naLabel,
                        precision,
                        prefix,
                        suffix,
                      )}
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
