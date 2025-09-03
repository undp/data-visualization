import isEqual from 'fast-deep-equal';
import { useRef, useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { cn } from '@undp/design-system-react/cn';
import { Modal } from '@undp/design-system-react/Modal';
import { AnimatePresence, motion, useInView } from 'motion/react';

import {
  AnimateDataType,
  ButterflyChartDataType,
  ClassNameObject,
  CustomLayerDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { string2HTML } from '@/Utils/string2HTML';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: ButterflyChartDataType[];
  barColors: [string, string];
  centerGap: number;
  refValues: ReferenceDataType[];
  axisTitles: [string, string];
  width: number;
  height: number;
  rightMargin: number;
  leftMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxValue: number;
  minValue: number;
  barPadding: number;
  truncateBy: number;
  showValues: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  showTicks: boolean;
  suffix: string;
  prefix: string;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  noOfTicks: number;
  animate: AnimateDataType;
  precision: number;
  customLayers: CustomLayerDataType[];
  minValueLeftBar: number;
  minValueRightBar: number;
  naLabel: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    centerGap,
    refValues,
    maxValue,
    minValue,
    showValues,
    axisTitles,
    rightMargin,
    leftMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    barPadding,
    truncateBy,
    onSeriesMouseClick,
    showTicks,
    suffix,
    prefix,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    noOfTicks,
    animate,
    precision,
    customLayers,
    minValueLeftBar,
    minValueRightBar,
    naLabel,
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
  const y = scaleBand()
    .domain(dataWithId.map(d => `${d.id}`))
    .range([graphHeight, 0])
    .paddingInner(barPadding);
  const xRightBar = scaleLinear()
    .domain([minValue, maxValue])
    .range([0, (graphWidth - centerGap) / 2])
    .nice();
  const xRightTicks = xRightBar.ticks(noOfTicks);
  const xLeftBar = scaleLinear()
    .domain([minValue, maxValue])
    .range([(graphWidth - centerGap) / 2, 0])
    .nice();
  const xLeftTicks = xLeftBar.ticks(noOfTicks);
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
          <g transform={`translate(${0},${0})`}>
            {showTicks ? (
              <XTicksAndGridLines
                values={xLeftTicks.filter(d => d !== 0)}
                x={xLeftTicks.filter(d => d !== 0).map(d => xLeftBar(d))}
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
                leftLabel
                precision={precision}
              />
            ) : null}
            <AnimatePresence>
              {dataWithId.map((d, i) => {
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
                    key={d.label}
                    opacity={0.85}
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
                    {d.leftBar ? (
                      <motion.rect
                        y={y(`${i}`)}
                        style={{ fill: barColors[0] }}
                        height={y.bandwidth()}
                        variants={{
                          initial: {
                            x: xLeftBar(0),
                            width: 0,
                          },
                          whileInView: {
                            x: d.leftBar < 0 ? xLeftBar(0) : xLeftBar(d.leftBar),
                            width:
                              d.leftBar < 0
                                ? xLeftBar(d.leftBar) - xLeftBar(0)
                                : xLeftBar(0) - xLeftBar(d.leftBar),
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{
                          x: xLeftBar(0),
                          width: 0,
                          transition: { duration: animate.duration },
                        }}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        y={(y(`${i}`) as number) + y.bandwidth() / 2}
                        style={{
                          fill: barColors[0],
                          textAnchor: d.rightBar ? (d.rightBar > 0 ? 'end' : 'start') : 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        dx={d.rightBar ? (d.rightBar > 0 ? -5 : 5) : 5}
                        dy='0.33em'
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        exit={{
                          opacity: 0,
                          transition: { duration: animate.duration },
                        }}
                        variants={{
                          initial: {
                            x: xLeftBar(0),
                            opacity: 0,
                          },
                          whileInView: {
                            x: d.leftBar
                              ? xLeftBar(d.leftBar)
                              : xLeftBar(minValueLeftBar < 0 ? 0 : minValueLeftBar),
                            opacity: 1,
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(d.rightBar, naLabel, precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
              <Axis
                y1={-2.5}
                y2={graphHeight + margin.bottom}
                x1={xLeftBar(minValueLeftBar < 0 ? 0 : minValueLeftBar)}
                x2={xLeftBar(minValueLeftBar < 0 ? 0 : minValueLeftBar)}
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
                      x={xLeftBar(el.value as number)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom}
                      textSide='left'
                      classNames={el.classNames}
                      styles={el.styles}
                      animate={animate}
                      isInView={isInView}
                    />
                  ))}
                </>
              ) : null}
            </AnimatePresence>
          </g>
          <g transform={`translate(${(graphWidth + centerGap) / 2},${0})`}>
            {showTicks ? (
              <XTicksAndGridLines
                values={xRightTicks.filter(d => d !== 0)}
                x={xRightTicks.filter(d => d !== 0).map(d => xRightBar(d))}
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
            <AnimatePresence>
              {dataWithId.map((d, i) => {
                return (
                  <motion.g
                    className='undp-viz-g-with-hover'
                    key={i}
                    opacity={0.85}
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
                    {d.rightBar ? (
                      <motion.rect
                        y={y(`${i}`)}
                        style={{ fill: barColors[1] }}
                        height={y.bandwidth()}
                        exit={{
                          x: xRightBar(0),
                          width: 0,
                          transition: { duration: animate.duration },
                        }}
                        variants={{
                          initial: {
                            x: xRightBar(0),
                            width: 0,
                          },
                          whileInView: {
                            x: d.rightBar >= 0 ? xRightBar(0) : xRightBar(d.rightBar),
                            width:
                              d.rightBar >= 0
                                ? xRightBar(d.rightBar) - xRightBar(0)
                                : xRightBar(0) - xRightBar(d.rightBar),
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      />
                    ) : null}
                    {showValues ? (
                      <motion.text
                        y={(y(`${i}`) as number) + y.bandwidth() / 2}
                        style={{
                          fill: barColors[1],
                          textAnchor: d.rightBar ? (d.rightBar < 0 ? 'end' : 'start') : 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        dx={d.rightBar ? (d.rightBar < 0 ? -5 : 5) : 5}
                        dy='0.33em'
                        exit={{
                          opacity: 0,
                          transition: { duration: animate.duration },
                        }}
                        variants={{
                          initial: {
                            x: xRightBar(0),
                            opacity: 0,
                          },
                          whileInView: {
                            x: d.rightBar
                              ? xRightBar(d.rightBar)
                              : xRightBar(minValueRightBar < 0 ? 0 : minValueRightBar),
                            opacity: 1,
                            transition: { duration: animate.duration },
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                      >
                        {numberFormattingFunction(d.rightBar, naLabel, precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
              <Axis
                y1={-2.5}
                y2={graphHeight + margin.bottom}
                x1={xRightBar(minValueRightBar < 0 ? 0 : minValueRightBar)}
                x2={xRightBar(minValueRightBar < 0 ? 0 : minValueRightBar)}
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
                      x={xRightBar(el.value as number)}
                      y1={0 - margin.top}
                      y2={graphHeight + margin.bottom}
                      textSide='right'
                      classNames={el.classNames}
                      styles={el.styles}
                      animate={animate}
                      isInView={isInView}
                    />
                  ))}
                </>
              ) : null}
            </AnimatePresence>
          </g>
          <AnimatePresence>
            <motion.g transform={`translate(${graphWidth / 2},${0})`}>
              {dataWithId.map((d, i) => (
                <YAxesLabels
                  key={i}
                  value={
                    `${d.label}`.length < truncateBy
                      ? `${d.label}`
                      : `${`${d.label}`.substring(0, truncateBy)}...`
                  }
                  y={y(`${d.id}`) as number}
                  x={0 - centerGap / 2}
                  width={centerGap}
                  height={y.bandwidth()}
                  alignment='center'
                  style={styles?.yAxis?.labels}
                  className={classNames?.yAxis?.labels}
                  animate={animate}
                  isInView={isInView}
                />
              ))}
            </motion.g>
          </AnimatePresence>
          <g transform={`translate(${0},${graphHeight})`}>
            <text
              style={{
                fill: barColors[0],
                textAnchor: 'end',
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
              x={graphWidth / 2 - centerGap / 2}
              y={0}
              dx={-5}
              dy={20}
            >
              {axisTitles[0]}
            </text>
            <text
              style={{
                fill: barColors[1],
                textAnchor: 'start',
                ...styles?.yAxis?.title,
              }}
              className={cn('text-base', classNames?.yAxis?.title)}
              x={graphWidth / 2 + centerGap / 2}
              y={0}
              dx={5}
              dy={20}
            >
              {axisTitles[1]}
            </text>
          </g>
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
