import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
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
import { string2HTML } from '@/Utils/string2HTML';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: DumbbellChartDataType[];
  dotColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showValues: boolean;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  radius: number;
  showLabels: boolean;
  selectedColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue: number;
  minValue: number;
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
  rtl: boolean;
  animate: AnimateDataType;
  precision: number;
  customLayers: CustomLayerDataType[];
  highlightedDataPoints: (string | number)[];
  dimmedOpacity: number;
}

export function Graph(props: Props) {
  const {
    data,
    dotColors,
    suffix,
    prefix,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    truncateBy,
    width,
    height,
    rightMargin,
    topMargin,
    bottomMargin,
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
