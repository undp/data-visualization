import isEqual from 'fast-deep-equal';
import { useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import sortBy from 'lodash.sortby';
import { cn, Modal } from '@undp/design-system-react';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  StripChartDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { getTickPositions } from '@/Utils/getTickPosition';

interface Props {
  data: StripChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  colors: string[];
  colorDomain: string[];
  radius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  prefix: string;
  suffix: string;
  stripType: 'strip' | 'dot';
  highlightColor?: string;
  dotOpacity: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  valueColor?: string;
  animate: AnimateDataType;
  noOfTicks: number;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    colorDomain,
    radius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
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
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));

  const sortedData = sortBy(dataWithId, item => {
    const index = (highlightedDataPoints || []).indexOf(item.label);
    return index === -1 ? Infinity : index;
  }).reverse();
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) < 0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) >= 0
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  const ticks = getTickPositions(noOfTicks, graphWidth);
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
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {sortedData.map(d => {
              return (
                <motion.g
                  className='undp-viz-g-with-hover'
                  key={d.label}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: x(0),
                      y: graphHeight / 2,
                    },
                    whileInView: {
                      x: x(d.position),
                      y: graphHeight / 2,
                      opacity: selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(d.color)] === selectedColor
                            ? 0.95
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints.length !== 0
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : dotOpacity,
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
                                : data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter(el => el.color).length === 0
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
                                : data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter(el => el.color).length === 0
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
                      y={0 - radius}
                      x={-1}
                      height={radius * 2}
                      width={2}
                      variants={{
                        initial: {
                          fill:
                            highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter(el => el.color).length === 0
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
                                : data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter(el => el.color).length === 0
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
                  {highlightedDataPoints.length !== 0 ? (
                    highlightedDataPoints.indexOf(d.label) !== -1 ? (
                      <motion.text
                        x={0}
                        y={0 - radius - 5}
                        variants={{
                          initial: { opacity: 0 },
                          whileInView: {
                            opacity: 1,
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        style={{
                          fill:
                            valueColor ||
                            (highlightColor && highlightedDataPoints
                              ? highlightedDataPoints.indexOf(d.label) !== -1
                                ? highlightColor
                                : data.filter(el => el.color).length === 0
                                  ? colors[0]
                                  : !d.color
                                    ? Colors.gray
                                    : colors[colorDomain.indexOf(d.color)]
                              : data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)]),
                          textAnchor: 'middle',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm font-bold',
                          classNames?.graphObjectValues,
                        )}
                      >
                        {numberFormattingFunction(d.position, precision, prefix, suffix)}
                      </motion.text>
                    ) : null
                  ) : null}
                </motion.g>
              );
            })}
            {ticks.map((tick, i) => (
              <text
                key={i}
                x={tick}
                y={graphHeight / 2 + radius}
                style={{
                  textAnchor: i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle',
                  ...(styles?.xAxis?.labels || {}),
                }}
                className={cn(
                  'fill-primary-gray-550 dark:fill-primary-gray-500 text-xs',
                  classNames?.xAxis?.labels,
                )}
                dy='1em'
              >
                {numberFormattingFunction(x.invert(tick), precision, prefix, suffix)}
              </text>
            ))}
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
