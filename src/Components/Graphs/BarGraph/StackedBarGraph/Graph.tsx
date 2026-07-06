import { cn } from '@undp/design-system-react/cn';
import { scaleBand, scaleLinear } from 'd3-scale';
import isEqual from 'fast-deep-equal';
import sum from 'lodash.sum';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { RefLineX, RefLineY } from '@/Components/Elements/ReferenceLine';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  GroupedBarGraphDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  data: GroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin?: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin?: number;
  topMargin?: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  showLabels: boolean | ((_d: any) => React.ReactNode);
  bottomMargin?: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  showTotalValue: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  rtl: boolean;
  labelOrder?: string[];
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: AnimateDataType;
  colorDomain: string[];
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
  hideAxisLine: boolean;
  locale: string;
  padZeros: boolean;
  minLabelSize: number;
}

export function HorizontalGraph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showTicks,
    topMargin = 25,
    bottomMargin = 10,
    leftMargin = 100,
    rightMargin = 40,
    truncateBy,
    width,
    height,
    tooltip,
    onSeriesMouseOver,
    showLabels,
    suffix,
    prefix,
    showValues,
    refValues,
    maxValue,
    onSeriesMouseClick,
    selectedColor,
    rtl,
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
    animate,
    colorDomain,
    precision,
    customLayers,
    naLabel,
    hideAxisLine,
    locale,
    padZeros,
    showTotalValue,
    minLabelSize,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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

    const missingIds = labelOrder ? labelOrder.filter((id) => !idSet.has(id)) : [];

    return [
      ...dataWithIdWithoutMissingIds,
      ...missingIds.map((id) => ({
        id,
        label: id,
        size: Array(data[0].size.length).fill(null),
      })),
    ];
  }, [data, labelOrder]);

  const barOrder = useMemo(() => {
    return labelOrder ?? dataWithId.map((d) => `${d.id}`);
  }, [labelOrder, dataWithId]);

  const x = scaleLinear().domain([0, maxValue]).range([0, graphWidth]).nice();
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
              values={xTicks.filter((d) => d !== 0)}
              x={xTicks.filter((d) => d !== 0).map((d) => x(d))}
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
              locale={locale}
              padZeros={padZeros}
            />
          ) : null}
          <AxisTitle
            x={graphWidth / 2}
            y={0 - margin.top + 15}
            style={styles?.xAxis?.title}
            className={classNames?.xAxis?.title}
            text={barAxisTitle}
          />
          {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
          <AnimatePresence>
            {dataWithId.map((d) =>
              !checkIfNullOrUndefined(y(d.id)) ? (
                <motion.g
                  className='undp-viz-low-opacity undp-viz-g-with-hover'
                  key={d.label}
                  variants={{
                    initial: { x: 0, y: y(`${d.id}`) },
                    whileInView: {
                      x: 0,
                      y: y(`${d.id}`),
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                >
                  {d.size.map((el, j) => (
                    <motion.g
                      key={`${d.label}-${colorDomain[j] || j}`}
                      opacity={selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 1}
                      onMouseEnter={(event) => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        onSeriesMouseOver?.({ ...d, sizeIndex: j });
                      }}
                      onMouseMove={(event) => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                      }}
                      onMouseLeave={() => {
                        setMouseOverData(undefined);
                        setEventX(undefined);
                        setEventY(undefined);
                        onSeriesMouseOver?.(undefined);
                      }}
                      onClick={() => {
                        if (onSeriesMouseClick || detailsOnClick) {
                          if (
                            isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                            resetSelectionOnDoubleClick
                          ) {
                            setMouseClickData(undefined);
                            onSeriesMouseClick?.(undefined);
                          } else {
                            setMouseClickData({ ...d, sizeIndex: j });
                            if (onSeriesMouseClick) onSeriesMouseClick({ ...d, sizeIndex: j });
                          }
                        }
                      }}
                    >
                      {el ? (
                        <motion.rect
                          // biome-ignore lint/suspicious/noArrayIndexKey: index is the identifier here
                          key={j}
                          y={0}
                          style={{ fill: barColors[j] }}
                          height={y.bandwidth()}
                          exit={{
                            width: 0,
                            x: x(0),
                            transition: { duration: animate.duration },
                          }}
                          variants={{
                            initial: {
                              width: 0,
                              x: x(0),
                              fill: barColors[j],
                            },
                            whileInView: {
                              width: x(el || 0),
                              x: x(
                                j === 0 ? 0 : sum(d.size.filter((element, k) => k < j && element)),
                              ),
                              fill: barColors[j],
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        />
                      ) : null}
                      {showValues && minLabelSize <= x(el || 0) ? (
                        <motion.text
                          y={y.bandwidth() / 2}
                          style={{
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          dy='0.33em'
                          className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                          exit={{
                            opacity: 0,
                            transition: { duration: animate.duration },
                          }}
                          variants={{
                            initial: {
                              x: x(0),
                              opacity: 0,
                              fill: getTextColorBasedOnBgColor(barColors[j]),
                            },
                            whileInView: {
                              x:
                                x(
                                  j === 0
                                    ? 0
                                    : sum(d.size.filter((element, k) => k < j && element)),
                                ) +
                                x(el || 0) / 2,
                              opacity:
                                el &&
                                x(el) /
                                  numberFormattingFunction(
                                    el,
                                    naLabel,
                                    precision,
                                    prefix,
                                    suffix,
                                    locale,
                                    padZeros,
                                  ).length >
                                  12
                                  ? 1
                                  : 0,
                              fill: getTextColorBasedOnBgColor(barColors[j]),
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                        >
                          {numberFormattingFunction(
                            el,
                            naLabel,
                            precision,
                            prefix,
                            suffix,
                            locale,
                            padZeros,
                          )}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showLabels ? (
                    <YAxesLabels
                      value={
                        typeof showLabels === 'function'
                          ? showLabels(d)
                          : `${d.label}`.length < truncateBy
                            ? `${d.label}`
                            : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={0}
                      x={0 - margin.left}
                      width={0 + margin.left}
                      height={y.bandwidth()}
                      style={styles?.yAxis?.labels}
                      className={classNames?.yAxis?.labels}
                      animate={animate}
                      isInView={isInView}
                    />
                  ) : null}
                  {showTotalValue ? (
                    <motion.text
                      className={cn(
                        'graph-value graph-value-total text-sm',
                        !valueColor ? ' fill-primary-gray-700 dark:fill-primary-gray-300' : '',
                        classNames?.graphObjectValues,
                      )}
                      style={{
                        ...(valueColor ? { fill: valueColor } : {}),
                        textAnchor: 'start',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      y={y.bandwidth() / 2}
                      dx={5}
                      dy='0.33em'
                      variants={{
                        initial: {
                          x: x(0),
                          opacity: 0,
                          ...(valueColor ? { fill: valueColor } : {}),
                        },
                        whileInView: {
                          x: x(sum(d.size.map((el) => el || 0))),
                          opacity: 1,
                          ...(valueColor ? { fill: valueColor } : {}),
                          transition: { duration: animate.duration },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: animate.duration },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    >
                      {numberFormattingFunction(
                        sum(d.size.filter((element) => element)),
                        naLabel,
                        precision,
                        prefix,
                        suffix,
                        locale,
                        padZeros,
                      )}
                    </motion.text>
                  ) : null}
                </motion.g>
              ) : null,
            )}
            <Axis
              hideAxisLine={hideAxisLine}
              x1={x(0)}
              x2={x(0)}
              y1={-2.5}
              y2={graphHeight + margin.bottom}
              classNames={{ axis: classNames?.yAxis?.axis }}
              styles={{ axis: styles?.yAxis?.axis }}
            />
            {refValues?.map((el) => (
              <RefLineX
                key={el.text}
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

export function VerticalGraph(props: Props) {
  const {
    data,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    width,
    height,
    barColors,
    barPadding,
    showLabels,
    showTicks,
    truncateBy,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showValues,
    refValues,
    maxValue,
    onSeriesMouseClick,
    selectedColor,
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
    animate,
    colorDomain,
    precision,
    customLayers,
    naLabel,
    hideAxisLine,
    locale,
    padZeros,
    showTotalValue,
    minLabelSize,
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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

    const missingIds = labelOrder ? labelOrder.filter((id) => !idSet.has(id)) : [];

    return [
      ...dataWithIdWithoutMissingIds,
      ...missingIds.map((id) => ({
        id,
        label: id,
        size: Array(data[0].size.length).fill(null),
      })),
    ];
  }, [data, labelOrder]);

  const barOrder = useMemo(() => {
    return labelOrder ?? dataWithId.map((d) => `${d.id}`);
  }, [labelOrder, dataWithId]);

  const y = scaleLinear().domain([0, maxValue]).range([graphHeight, 0]).nice();

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
            hideAxisLine={hideAxisLine}
            y1={y(0)}
            y2={y(0)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={
              showTicks
                ? numberFormattingFunction(0, naLabel, precision, prefix, suffix, locale, padZeros)
                : undefined
            }
            labelPos={{
              x: 0 - leftMargin,
              y: y(0),
              dx: 0,
              dy: -5,
            }}
            classNames={{
              axis: classNames?.xAxis?.axis,
              label: classNames?.yAxis?.labels,
            }}
            styles={{ axis: styles?.xAxis?.axis, label: styles?.yAxis?.labels }}
          />
          {showTicks ? (
            <YTicksAndGridLines
              values={yTicks.filter((d) => d !== 0)}
              y={yTicks.filter((d) => d !== 0).map((d) => y(d))}
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
              locale={locale}
              padZeros={padZeros}
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
          {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
          <AnimatePresence>
            {dataWithId.map((d) =>
              !checkIfNullOrUndefined(x(d.id)) ? (
                <motion.g
                  className='undp-viz-low-opacity undp-viz-g-with-hover'
                  key={d.label}
                  variants={{
                    initial: { x: x(`${d.id}`), y: 0 },
                    whileInView: {
                      x: x(`${d.id}`),
                      y: 0,
                      transition: { duration: animate.duration },
                    },
                  }}
                  transition={{ duration: animate.duration }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                >
                  {d.size.map((el, j) => (
                    <motion.g
                      key={`${d.label}-${colorDomain[j] || j}`}
                      opacity={selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 1}
                      onMouseEnter={(event) => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        onSeriesMouseOver?.({ ...d, sizeIndex: j });
                      }}
                      onMouseMove={(event) => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                      }}
                      onMouseLeave={() => {
                        setMouseOverData(undefined);
                        setEventX(undefined);
                        setEventY(undefined);
                        onSeriesMouseOver?.(undefined);
                      }}
                      onClick={() => {
                        if (onSeriesMouseClick || detailsOnClick) {
                          if (
                            isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                            resetSelectionOnDoubleClick
                          ) {
                            setMouseClickData(undefined);
                            onSeriesMouseClick?.(undefined);
                          } else {
                            setMouseClickData({ ...d, sizeIndex: j });
                            if (onSeriesMouseClick) onSeriesMouseClick({ ...d, sizeIndex: j });
                          }
                        }
                      }}
                    >
                      <motion.rect
                        x={0}
                        width={x.bandwidth()}
                        variants={{
                          initial: {
                            height: 0,
                            fill: barColors[j],
                            y: y(0),
                          },
                          whileInView: {
                            height: Math.abs(
                              y(sum(d.size.filter((element, k) => k <= j && element))) -
                                y(sum(d.size.filter((element, k) => k < j && element))),
                            ),
                            y: y(sum(d.size.filter((element, k) => k <= j && element))),
                            fill: barColors[j],
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{
                          height: 0,
                          y: y(0),
                          transition: { duration: animate.duration },
                        }}
                      />
                      {showValues &&
                      minLabelSize <=
                        Math.abs(
                          y(sum(d.size.filter((element, k) => k <= j && element))) -
                            y(sum(d.size.filter((element, k) => k < j && element))),
                        ) ? (
                        <motion.text
                          x={x.bandwidth() / 2}
                          style={{
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                          dy='0.33em'
                          variants={{
                            initial: {
                              y: y(0),
                              opacity: 0,
                              fill: getTextColorBasedOnBgColor(barColors[j]),
                            },
                            whileInView: {
                              y:
                                y(sum(d.size.filter((element, k) => k <= j && element))) +
                                Math.abs(
                                  y(sum(d.size.filter((element, k) => k <= j && element))) -
                                    y(sum(d.size.filter((element, k) => k < j && element))),
                                ) /
                                  2,
                              opacity:
                                el &&
                                Math.abs(
                                  y(sum(d.size.filter((element, k) => k <= j && element))) -
                                    y(sum(d.size.filter((element, k) => k < j && element))),
                                ) > 20
                                  ? 1
                                  : 0,
                              fill: getTextColorBasedOnBgColor(barColors[j]),
                              transition: { duration: animate.duration },
                            },
                          }}
                          initial='initial'
                          animate={isInView ? 'whileInView' : 'initial'}
                          exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        >
                          {numberFormattingFunction(
                            el,
                            naLabel,
                            precision,
                            prefix,
                            suffix,
                            locale,
                            padZeros,
                          )}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showLabels ? (
                    <XAxesLabels
                      value={
                        typeof showLabels === 'function'
                          ? showLabels(d)
                          : `${d.label}`.length < truncateBy
                            ? `${d.label}`
                            : `${`${d.label}`.substring(0, truncateBy)}...`
                      }
                      y={y(0) + 5}
                      x={0}
                      width={x.bandwidth()}
                      height={margin.bottom}
                      style={styles?.xAxis?.labels}
                      className={classNames?.xAxis?.labels}
                      alignment='top'
                      animate={animate}
                      isInView={isInView}
                    />
                  ) : null}
                  {showTotalValue ? (
                    <motion.text
                      style={{
                        textAnchor: 'middle',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      x={x.bandwidth() / 2}
                      dy={-10}
                      className={cn(
                        'graph-value graph-value-total',
                        !valueColor
                          ? 'fill-primary-gray-700 dark:fill-primary-gray-300 text-sm'
                          : 'text-sm',
                        classNames?.graphObjectValues,
                      )}
                      variants={{
                        initial: {
                          y: y(0),
                          opacity: 0,
                          ...(valueColor && { fill: valueColor }),
                        },
                        whileInView: {
                          y: y(sum(d.size.map((el) => el || 0))),
                          opacity: 1,
                          ...(valueColor && { fill: valueColor }),
                          transition: { duration: animate.duration },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: animate.duration },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                    >
                      {numberFormattingFunction(
                        sum(d.size.filter((element) => element)),
                        naLabel,
                        precision,
                        prefix,
                        suffix,
                        locale,
                        padZeros,
                      )}
                    </motion.text>
                  ) : null}
                </motion.g>
              ) : null,
            )}
            {refValues?.map((el) => (
              <RefLineY
                key={el.text}
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
