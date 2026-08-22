import { cn } from '@undp/design-system-react/cn';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'fast-deep-equal';
import orderBy from 'lodash.orderby';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  DistributionMarkerDataType,
  StripChartDataType,
  StyleObject,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getMean, getMedian, getPercentile } from '@/Utils/getSimpleStatistics';
import { getTickPositions } from '@/Utils/getTickPosition';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  data: StripChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  colors: string[];
  colorDomain: string[];
  radius: number;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showDataMinMax: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];
  maxValue?: number;
  minValue?: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  prefix: string;
  suffix: string;
  stripType: 'strip' | 'dot';
  highlightColor?: string;
  dotOpacity: number;
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  valueColor?: string;
  animate: AnimateDataType;
  noOfTicks: number;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  locale: string;
  padZeros: boolean;
  hasGroups: boolean;
  groupOrder?: (string | number)[];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  showGroups: boolean | ((_d: any) => React.ReactNode);
  truncateBy: number;
  distributionMarkers: DistributionMarkerDataType[];
  highlightSameLabelOnHover: boolean;
}

export function VerticalGraph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    colorDomain,
    radius,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 10,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
    noOfTicks,
    prefix,
    suffix,
    stripType,
    highlightColor,
    dotOpacity,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    valueColor,
    animate,
    dimmedOpacity,
    precision,
    customLayers,
    showDataMinMax,
    locale,
    padZeros,
    hasGroups,
    groupOrder,
    showGroups,
    truncateBy,
    distributionMarkers,
    highlightSameLabelOnHover,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: hasGroups && showGroups ? (bottomMargin ?? 25) : (bottomMargin ?? 10),
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataWithGroup = data.map((d) => ({
    ...d,
    group: hasGroups ? (d.group as string | number) : 'undefined',
  }));

  const sortedData = orderBy(
    dataWithGroup,
    [
      (item) => {
        const index = (highlightedDataPoints || []).indexOf(item.label);
        return index === -1 ? Infinity : index;
      },
    ],
    ['desc'],
  );
  const clusterOrder = useMemo(() => {
    return (
      groupOrder ?? [
        ...new Set(data.map((d) => (hasGroups ? (d.group as string | number) : 'undefined'))),
      ]
    );
  }, [groupOrder, data, hasGroups]);
  const x = useMemo(() => {
    return scaleBand<string | number>()
      .domain(clusterOrder)
      .range([0, graphWidth])
      .paddingInner(0.1);
  }, [clusterOrder, graphWidth]);
  const yMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position)) <
        0
      ? 0
      : Math.max(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position));
  const yMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position)) >=
        0
      ? 0
      : Math.min(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position));

  const y = useMemo(
    () => scaleLinear().domain([yMinValue, yMaxValue]).range([graphHeight, 0]).nice(),
    [yMaxValue, yMaxValue, graphHeight],
  );
  const yTicks = getTickPositions(noOfTicks, graphHeight);
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
          {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
          <AnimatePresence>
            {sortedData.map((d) => {
              return (
                <motion.g
                  key={`${d.label}-${d.group}`}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: (x(d.group) ?? 0) + x.bandwidth() / 2,
                      y: y(0),
                    },
                    whileInView: {
                      x: (x(d.group) ?? 0) + x.bandwidth() / 2,
                      y: y(d.position),
                      opacity: selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(d.color)] === selectedColor
                            ? 0.95
                            : dimmedOpacity
                          : dimmedOpacity
                        : mouseOverData
                          ? mouseOverData.label === d.label &&
                            (highlightSameLabelOnHover || mouseOverData.group === d.group)
                            ? 1
                            : dimmedOpacity
                          : highlightedDataPoints
                            ? highlightedDataPoints.indexOf(d.label) !== -1
                              ? 0.95
                              : dimmedOpacity
                            : dotOpacity,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  onMouseEnter={(event) => {
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
                  onMouseMove={(event) => {
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
                  {stripType === 'dot' ? (
                    <motion.circle
                      cy={0}
                      cx={0}
                      variants={{
                        initial: {
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      r={radius}
                    />
                  ) : (
                    <motion.rect
                      y={-1}
                      height={2}
                      variants={{
                        initial: {
                          x: 0 - radius,
                          width: radius * 2,
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          x: 0 - radius,
                          width: radius * 2,
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    />
                  )}
                  {highlightedDataPoints ? (
                    highlightedDataPoints.indexOf(d.label) !== -1 ? (
                      <motion.text
                        y={0}
                        dy='0.33em'
                        variants={{
                          initial: {
                            opacity: 0,
                            x: 0 + radius + 3,
                            fill:
                              valueColor ||
                              (highlightColor && highlightedDataPoints
                                ? highlightedDataPoints.indexOf(d.label) !== -1
                                  ? highlightColor
                                  : data.filter((el) => el.color).length === 0
                                    ? colors[0]
                                    : !d.color
                                      ? Colors.gray
                                      : colors[colorDomain.indexOf(d.color)]
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]),
                          },
                          whileInView: {
                            opacity: 1,
                            x: 0 + radius + 3,
                            fill:
                              valueColor ||
                              (highlightColor && highlightedDataPoints
                                ? highlightedDataPoints.indexOf(d.label) !== -1
                                  ? highlightColor
                                  : data.filter((el) => el.color).length === 0
                                    ? colors[0]
                                    : !d.color
                                      ? Colors.gray
                                      : colors[colorDomain.indexOf(d.color)]
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]),
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        style={{
                          textAnchor: 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm font-bold',
                          classNames?.graphObjectValues,
                        )}
                      >
                        {numberFormattingFunction(
                          d.position,
                          undefined,
                          precision,
                          prefix,
                          suffix,
                          locale,
                          padZeros,
                        )}
                      </motion.text>
                    ) : null
                  ) : null}
                </motion.g>
              );
            })}
            {clusterOrder.map((c) => (
              <g key={c}>
                {showGroups && hasGroups && clusterOrder.length > 1 && (
                  <XAxesLabels
                    key={c}
                    value={
                      typeof showGroups === 'function'
                        ? showGroups(c)
                        : `${c}`.length < truncateBy
                          ? `${c}`
                          : `${`${c}`.substring(0, truncateBy)}...`
                    }
                    y={y(0) + 5}
                    x={x(`${c}`) ?? 0}
                    width={x.bandwidth()}
                    height={margin.bottom}
                    style={styles?.xAxis?.labels}
                    className={classNames?.xAxis?.labels}
                    alignment='top'
                    animate={{ duration: 0, once: true, amount: 0 }}
                    isInView={true}
                  />
                )}
                {showDataMinMax
                  ? [
                      Math.min(
                        ...sortedData
                          .filter((d) => !checkIfNullOrUndefined(d.position) && d.group === c)
                          .map((d) => d.position),
                      ),
                      Math.max(
                        ...sortedData
                          .filter((d) => !checkIfNullOrUndefined(d.position) && d.group === c)
                          .map((d) => d.position),
                      ),
                    ].map((d, i) => (
                      <motion.g
                        key={i === 0 ? `min-value-${c}` : `max-value-${c}`}
                        variants={{
                          initial: {
                            opacity: 0,
                            x: (x(c) ?? 0) + x.bandwidth() / 2,
                            y: y(d),
                          },
                          whileInView: {
                            x: (x(c) ?? 0) + x.bandwidth() / 2,
                            y: y(d),
                            opacity: 1,
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      >
                        <motion.text
                          y={0}
                          dy='0.33em'
                          variants={{
                            initial: {
                              opacity: 0,
                              x: 0 + radius + 3,
                            },
                            whileInView: {
                              opacity: 1,
                              x: 0 + radius + 3,
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          style={{
                            textAnchor: 'start',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn(
                            'graph-min-max-value text-sm text-content-secondary',
                            classNames?.graphObjectValues,
                          )}
                        >
                          {numberFormattingFunction(
                            d,
                            undefined,
                            precision,
                            prefix,
                            suffix,
                            locale,
                            padZeros,
                          )}
                        </motion.text>
                      </motion.g>
                    ))
                  : null}
                {distributionMarkers.map((marker) => (
                  <line
                    key={`${c}-${marker.type}`}
                    y1={y(
                      marker.type === 'mean'
                        ? getMean(sortedData.filter((d) => d.group === c).map((d) => d.position))
                        : marker.type === 'median'
                          ? getMedian(
                              sortedData.filter((d) => d.group === c).map((d) => d.position),
                            )
                          : marker.type === 'q1'
                            ? getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.25,
                              )
                            : getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.75,
                              ),
                    )}
                    x1={x(c) ?? 0}
                    y2={y(
                      marker.type === 'mean'
                        ? getMean(sortedData.filter((d) => d.group === c).map((d) => d.position))
                        : marker.type === 'median'
                          ? getMedian(
                              sortedData.filter((d) => d.group === c).map((d) => d.position),
                            )
                          : marker.type === 'q1'
                            ? getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.25,
                              )
                            : getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.75,
                              ),
                    )}
                    x2={(x(c) ?? 0) + x.bandwidth()}
                    className={`${marker.type}-marker`}
                    style={marker.style}
                    stroke={marker.color || '#000000'}
                    strokeWidth={marker.strokeWidth ?? 2}
                  />
                ))}
              </g>
            ))}
            {noOfTicks &&
              yTicks.map((tick, i) => (
                <text
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                  key={`tick-${i}`}
                  y={tick}
                  x={hasGroups ? 0 : graphWidth / 2 + radius + 5}
                  style={{
                    textAnchor: 'start',
                    ...(styles?.yAxis?.labels || {}),
                  }}
                  className={cn('fill-content-secondary text-xs', classNames?.yAxis?.labels)}
                >
                  {numberFormattingFunction(
                    y.invert(tick),
                    undefined,
                    precision,
                    prefix,
                    suffix,
                    locale,
                    padZeros,
                  )}
                </text>
              ))}
          </AnimatePresence>
          {customLayers.filter((d) => d.position === 'after').map((d) => d.layer)}
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
    width,
    height,
    colors,
    colorDomain,
    radius,
    leftMargin,
    rightMargin = 5,
    topMargin = 10,
    bottomMargin = 10,
    tooltip,
    onSeriesMouseOver,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
    prefix,
    suffix,
    stripType,
    highlightColor,
    dotOpacity,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    valueColor,
    animate,
    noOfTicks,
    dimmedOpacity,
    precision,
    customLayers,
    showDataMinMax,
    locale,
    padZeros,
    hasGroups,
    groupOrder,
    showGroups,
    truncateBy,
    distributionMarkers,
    highlightSameLabelOnHover,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: hasGroups && showGroups ? (leftMargin ?? 100) : (leftMargin ?? 5),
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataWithGroup = data.map((d) => ({
    ...d,
    group: hasGroups ? (d.group as string | number) : 'undefined',
  }));

  const sortedData = orderBy(
    dataWithGroup,
    [
      (item) => {
        const index = (highlightedDataPoints || []).indexOf(item.label);
        return index === -1 ? Infinity : index;
      },
    ],
    ['desc'],
  );
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position)) <
        0
      ? 0
      : Math.max(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position));
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position)) >=
        0
      ? 0
      : Math.min(...data.filter((d) => !checkIfNullOrUndefined(d.position)).map((d) => d.position));
  const x = useMemo(
    () => scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice(),
    [xMinValue, xMaxValue, graphWidth],
  );
  const xTicks = getTickPositions(noOfTicks, graphWidth);

  const clusterOrder = useMemo(() => {
    return (
      groupOrder ?? [
        ...new Set(
          data
            .map((d) => (hasGroups ? d : { ...d, group: 'undefined' }))
            .map((d) => d.group as string | number),
        ),
      ]
    );
  }, [groupOrder, data, hasGroups]);
  const y = useMemo(() => {
    return scaleBand<string | number>()
      .domain(clusterOrder)
      .range([0, graphHeight])
      .paddingInner(0.1);
  }, [clusterOrder, graphHeight]);
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
          {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
          <AnimatePresence>
            {sortedData.map((d) => {
              return (
                <motion.g
                  key={d.label}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: x(0),
                      y: (y(d.group) ?? 0) + y.bandwidth() / 2,
                    },
                    whileInView: {
                      x: x(d.position),
                      y: (y(d.group) ?? 0) + y.bandwidth() / 2,
                      opacity: selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(d.color)] === selectedColor
                            ? 0.95
                            : dimmedOpacity
                          : dimmedOpacity
                        : mouseOverData
                          ? mouseOverData.label === d.label &&
                            (highlightSameLabelOnHover || mouseOverData.group === d.group)
                            ? 1
                            : dimmedOpacity
                          : highlightedDataPoints
                            ? highlightedDataPoints.indexOf(d.label) !== -1
                              ? 0.95
                              : dimmedOpacity
                            : dotOpacity,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  onMouseEnter={(event) => {
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
                  onMouseMove={(event) => {
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
                  {stripType === 'dot' ? (
                    <motion.circle
                      cy={0}
                      cx={0}
                      variants={{
                        initial: {
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      r={radius}
                    />
                  ) : (
                    <motion.rect
                      x={-1}
                      width={2}
                      variants={{
                        initial: {
                          y: 0 - radius,
                          height: radius * 2,
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                        },
                        whileInView: {
                          y: 0 - radius,
                          height: radius * 2,
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)],
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    />
                  )}
                  {highlightedDataPoints ? (
                    highlightedDataPoints.indexOf(d.label) !== -1 ? (
                      <motion.text
                        x={0}
                        variants={{
                          initial: {
                            opacity: 0,
                            y: 0 - radius - 5,
                            fill:
                              valueColor ||
                              (highlightColor && highlightedDataPoints
                                ? highlightedDataPoints.indexOf(d.label) !== -1
                                  ? highlightColor
                                  : data.filter((el) => el.color).length === 0
                                    ? colors[0]
                                    : !d.color
                                      ? Colors.gray
                                      : colors[colorDomain.indexOf(d.color)]
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]),
                          },
                          whileInView: {
                            opacity: 1,
                            y: 0 - radius - 5,
                            fill:
                              valueColor ||
                              (highlightColor && highlightedDataPoints
                                ? highlightedDataPoints.indexOf(d.label) !== -1
                                  ? highlightColor
                                  : data.filter((el) => el.color).length === 0
                                    ? colors[0]
                                    : !d.color
                                      ? Colors.gray
                                      : colors[colorDomain.indexOf(d.color)]
                                : data.filter((el) => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]),
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        style={{
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm font-bold',
                          classNames?.graphObjectValues,
                        )}
                      >
                        {numberFormattingFunction(
                          d.position,
                          undefined,
                          precision,
                          prefix,
                          suffix,
                          locale,
                          padZeros,
                        )}
                      </motion.text>
                    ) : null
                  ) : null}
                </motion.g>
              );
            })}
            {clusterOrder.map((c) => (
              <g key={c}>
                {showGroups && hasGroups && clusterOrder.length > 1 && (
                  <YAxesLabels
                    key={c}
                    value={
                      typeof showGroups === 'function'
                        ? showGroups(c)
                        : `${c}`.length < truncateBy
                          ? `${c}`
                          : `${`${c}`.substring(0, truncateBy)}...`
                    }
                    y={y(c) || 0}
                    x={0 - margin.left}
                    width={margin.left}
                    height={y.bandwidth()}
                    alignment='right'
                    style={styles?.yAxis?.labels}
                    className={classNames?.yAxis?.labels}
                    animate={{ duration: 0, once: true, amount: 0 }}
                    isInView={true}
                  />
                )}
                {showDataMinMax
                  ? [
                      Math.min(
                        ...sortedData
                          .filter((d) => !checkIfNullOrUndefined(d.position) && d.group === c)
                          .map((d) => d.position),
                      ),
                      Math.max(
                        ...sortedData
                          .filter((d) => !checkIfNullOrUndefined(d.position) && d.group === c)
                          .map((d) => d.position),
                      ),
                    ].map((d, i) => (
                      <motion.g
                        key={i === 0 ? `min-value-${c}` : `max-value-${c}`}
                        variants={{
                          initial: {
                            opacity: 0,
                            x: x(d),
                            y: (y(c) ?? 0) + y.bandwidth() / 2,
                          },
                          whileInView: {
                            x: x(d),
                            y: (y(c) ?? 0) + y.bandwidth() / 2,
                            opacity: 1,
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      >
                        <motion.text
                          x={0}
                          variants={{
                            initial: {
                              opacity: 0,
                              y: 0 - radius - 5,
                            },
                            whileInView: {
                              opacity: 1,
                              y: 0 - radius - 5,
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                          style={{
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn(
                            'graph-min-max-value text-sm text-content-secondary',
                            classNames?.graphObjectValues,
                          )}
                        >
                          {numberFormattingFunction(
                            d,
                            undefined,
                            precision,
                            prefix,
                            suffix,
                            locale,
                            padZeros,
                          )}
                        </motion.text>
                      </motion.g>
                    ))
                  : null}
                {distributionMarkers.map((marker) => (
                  <line
                    key={`${c}-${marker.type}`}
                    x1={x(
                      marker.type === 'mean'
                        ? getMean(sortedData.filter((d) => d.group === c).map((d) => d.position))
                        : marker.type === 'median'
                          ? getMedian(
                              sortedData.filter((d) => d.group === c).map((d) => d.position),
                            )
                          : marker.type === 'q1'
                            ? getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.25,
                              )
                            : getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.75,
                              ),
                    )}
                    y1={y(c) ?? 0}
                    x2={x(
                      marker.type === 'mean'
                        ? getMean(sortedData.filter((d) => d.group === c).map((d) => d.position))
                        : marker.type === 'median'
                          ? getMedian(
                              sortedData.filter((d) => d.group === c).map((d) => d.position),
                            )
                          : marker.type === 'q1'
                            ? getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.25,
                              )
                            : getPercentile(
                                sortedData.filter((d) => d.group === c).map((d) => d.position),
                                0.75,
                              ),
                    )}
                    y2={(y(c) ?? 0) + y.bandwidth()}
                    className={`${marker.type}-marker`}
                    style={marker.style}
                    stroke={marker.color || '#000000'}
                    strokeWidth={marker.strokeWidth ?? 2}
                  />
                ))}
              </g>
            ))}
            {noOfTicks &&
              xTicks.map((tick, i) => (
                <text
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                  key={`tick-${i}`}
                  x={tick}
                  y={hasGroups ? 0 : graphHeight / 2 + radius}
                  style={{
                    textAnchor: i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle',
                    ...(styles?.xAxis?.labels || {}),
                  }}
                  className={cn('fill-content-secondary text-xs', classNames?.xAxis?.labels)}
                  dy='1em'
                >
                  {numberFormattingFunction(
                    x.invert(tick),
                    undefined,
                    precision,
                    prefix,
                    suffix,
                    locale,
                    padZeros,
                  )}
                </text>
              ))}
          </AnimatePresence>
          {customLayers.filter((d) => d.position === 'after').map((d) => d.layer)}
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
