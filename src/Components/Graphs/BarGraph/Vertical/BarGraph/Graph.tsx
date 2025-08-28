import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useRef, useState } from 'react';
import { cn, Modal } from '@undp/design-system-react';
import { AnimatePresence, motion, useInView } from 'motion/react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import {
  AnimateDataType,
  BarGraphDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

interface Props {
  data: BarGraphDataType[];
  width: number;
  height: number;
  barColor: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showLabels: boolean;
  showValues: boolean;
  showTicks: boolean;
  colorDomain: string[];
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  refValues?: ReferenceDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  selectedColor?: string;
  maxValue: number;
  minValue: number;
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
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
}

export function Graph(props: Props) {
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
    colorDomain,
    truncateBy,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
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

  const y = scaleLinear().domain([minValue, maxValue]).range([graphHeight, 0]).nice();

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
