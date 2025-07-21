import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import uniqBy from 'lodash.uniqby';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'motion/react';
import { cn, Modal } from '@undp/design-system-react';

import {
  ClassNameObject,
  DumbbellChartWithDateDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForDumbbellChart } from '@/Utils/ensureCompleteData';
import { string2HTML } from '@/Utils/string2HTML';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: DumbbellChartWithDateDataType[];
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
  maxPositionValue?: number;
  minPositionValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  dateFormat: string;
  indx: number;
  sortParameter?: number | 'diff';
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
  styles?: StyleObject;
  classNames?: ClassNameObject;
  refValues?: ReferenceDataType[];
  rtl: boolean;
  precision: number;
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
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    selectedColor,
    dateFormat,
    indx,
    sortParameter,
    connectorStrokeWidth,
    arrowConnector,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    axisTitle,
    noOfTicks,
    valueColor,
    styles,
    classNames,
    refValues,
    rtl,
    precision,
  } = props;
  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  );
  const uniqLabels = uniqBy(dataFormatted, d => d.label).map(d => d.label);
  const groupedData = Array.from(
    group(ensureCompleteDataForDumbbellChart(data, dateFormat || 'yyyy'), d => d.date),
    ([date, values]) => ({
      date,
      values:
        sortParameter !== undefined
          ? sortParameter === 'diff'
            ? sortBy(values, d =>
                checkIfNullOrUndefined(d.x[d.x.length - 1]) || checkIfNullOrUndefined(d.x[0])
                  ? -Infinity
                  : (d.x[d.x.length - 1] as number) - (d.x[0] as number),
              )
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
            : sortBy(values, d =>
                checkIfNullOrUndefined(d.x[sortParameter]) ? -Infinity : d.x[sortParameter],
              )
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
          : (
              uniqLabels.map(label =>
                values.find(o => o.label === label),
              ) as DumbbellChartWithDateDataType[]
            ).map((el, i) => ({
              ...el,
              id: `${i}`,
            })),
    }),
  );

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

  const xMaxValue = !checkIfNullOrUndefined(maxPositionValue)
    ? (maxPositionValue as number)
    : Math.max(...data.map(d => max(d.x) || 0)) < 0
      ? 0
      : Math.max(...data.map(d => max(d.x) || 0));
  const xMinValue = !checkIfNullOrUndefined(minPositionValue)
    ? (minPositionValue as number)
    : Math.min(...data.map(d => min(d.x) || 0)) > 0
      ? 0
      : Math.min(...data.map(d => min(d.x) || 0));

  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();

  const y = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([
      0,
      minBarThickness
        ? Math.max(graphHeight, minBarThickness * uniqLabels.length)
        : maxBarThickness
          ? Math.min(graphHeight, maxBarThickness * uniqLabels.length)
          : graphHeight,
    ])
    .paddingInner(barPadding);
  const xTicks = x.ticks(noOfTicks);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
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
            text={axisTitle}
          />
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => (
              <motion.g className='undp-viz-low-opacity undp-viz-g-with-hover' key={i}>
                {showLabels ? (
                  <motion.text
                    style={{
                      textAnchor: 'end',
                      ...(styles?.yAxis?.labels || {}),
                    }}
                    x={0}
                    dx={-10}
                    dy='0.33em'
                    className={cn(
                      'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                      classNames?.yAxis?.labels,
                    )}
                    animate={{ attrY: (y(`${i}`) as number) + y.bandwidth() / 2 }}
                    transition={{ duration: 0.5 }}
                  >
                    {`${d.label}`.length < truncateBy
                      ? d.label
                      : `${`${d.label}`.substring(0, truncateBy)}...`}
                  </motion.text>
                ) : null}
                <motion.line
                  x1={0}
                  x2={graphWidth}
                  className={cn(
                    'undp-tick-line stroke-primary-gray-400 dark:stroke-primary-gray-600',
                    classNames?.yAxis?.gridLines,
                  )}
                  style={styles?.yAxis?.gridLines}
                  animate={{
                    y1: (y(`${i}`) as number) + y.bandwidth() / 2,
                    y2: (y(`${i}`) as number) + y.bandwidth() / 2,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <motion.line
                  style={{
                    strokeWidth: connectorStrokeWidth,
                    ...(styles?.dataConnectors || {}),
                    opacity: selectedColor ? 0.3 : 1,
                  }}
                  className={cn(
                    'stroke-primary-gray-600 dark:stroke-primary-gray-300',
                    classNames?.dataConnectors,
                  )}
                  animate={{
                    y1: (y(`${i}`) as number) + y.bandwidth() / 2,
                    y2: (y(`${i}`) as number) + y.bandwidth() / 2,
                    x1: x(min(d.x) as number) + radius,
                    x2: x(max(d.x) as number) - radius,
                  }}
                  markerEnd={
                    arrowConnector && d.x.indexOf(min(d.x) as number) === 0 ? 'url(#arrow)' : ''
                  }
                  markerStart={
                    arrowConnector && d.x.indexOf(min(d.x) as number) === d.x.length - 1
                      ? 'url(#arrow)'
                      : ''
                  }
                />
                {d.x.map((el, j) => (
                  <motion.g
                    key={j}
                    opacity={selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1}
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
                  >
                    <motion.circle
                      r={radius}
                      style={{
                        fill: dotColors[j],
                        fillOpacity: 0.85,
                        stroke: dotColors[j],
                        strokeWidth: 1,
                      }}
                      animate={{
                        cy: (y(`${i}`) as number) + y.bandwidth() / 2,
                        cx: x(el || 0),
                        opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showValues ? (
                      <motion.text
                        style={{
                          fill: valueColor || dotColors[j],
                          textAnchor: 'middle',
                          opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn(
                          'graph-value text-sm font-bold',
                          classNames?.graphObjectValues,
                        )}
                        dx={0}
                        dy={0 - radius - 3}
                        animate={{
                          attrY: (y(`${i}`) as number) + y.bandwidth() / 2,
                          attrX: x(el || 0),
                          opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {numberFormattingFunction(el, precision, prefix, suffix)}
                      </motion.text>
                    ) : null}
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
                    animate={0}
                  />
                ))}
              </>
            ) : null}
          </AnimatePresence>
        </g>
      </svg>
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
