import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import sum from 'lodash.sum';
import { useRef, useState } from 'react';
import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
import { AnimatePresence, motion, useInView } from 'motion/react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  GroupedBarGraphDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { string2HTML } from '@/Utils/string2HTML';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

interface Props {
  data: GroupedBarGraphDataType[];
  width: number;
  height: number;
  barColors: string[];
  barPadding: number;
  showLabels: boolean;
  showTicks: boolean;
  truncateBy: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  refValues?: ReferenceDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
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
  colorDomain: string[];
  precision: number;
  customLayers: CustomLayerDataType[];
  naLabel: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    barPadding,
    showLabels,
    showTicks,
    truncateBy,
    leftMargin,
    topMargin,
    bottomMargin,
    rightMargin,
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

  const y = scaleLinear().domain([0, maxValue]).range([graphHeight, 0]).nice();
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
            y1={y(0)}
            y2={y(0)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(0, naLabel, precision, prefix, suffix)}
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
                      onMouseEnter={event => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        onSeriesMouseOver?.({ ...d, sizeIndex: j });
                      }}
                      onMouseMove={event => {
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
                      {showValues ? (
                        <motion.text
                          x={x.bandwidth() / 2}
                          style={{
                            fill: getTextColorBasedOnBgColor(barColors[j]),
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
                          {numberFormattingFunction(el, naLabel, precision, prefix, suffix)}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showLabels ? (
                    <XAxesLabels
                      value={
                        `${d.label}`.length < truncateBy
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
                  {showValues ? (
                    <motion.text
                      style={{
                        ...(valueColor && { fill: valueColor }),
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
                        },
                        whileInView: {
                          y: y(sum(d.size.map(el => el || 0))),
                          opacity: 1,
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
                        sum(d.size.filter(element => element)),
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
