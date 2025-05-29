import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import sum from 'lodash.sum';
import { AnimatePresence, motion } from 'motion/react';
import { cn, Modal } from '@undp/design-system-react';

import {
  ClassNameObject,
  GroupedBarGraphWithDateDataType,
  ReferenceDataType,
  StyleObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForStackedBarChart } from '@/Utils/ensureCompleteData';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { string2HTML } from '@/Utils/string2HTML';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  truncateBy: number;
  width: number;
  height: number;
  rightMargin: number;
  topMargin: number;
  showLabels: boolean;
  bottomMargin: number;
  suffix: string;
  prefix: string;
  showValues?: boolean;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  indx: number;
  dateFormat: string;
  autoSort: boolean;
  rtl: boolean;
  sortParameter?: number | 'total';
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function Graph(props: Props) {
  const {
    data,
    barColors,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    truncateBy,
    width,
    height,
    topMargin,
    bottomMargin,
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
    dateFormat,
    indx,
    autoSort,
    rtl,
    sortParameter,
    maxBarThickness,
    minBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    classNames,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const dataFormatted = sortBy(
    data.map(d => ({
      ...d,
      date: parse(`${d.date}`, dateFormat, new Date()),
    })),
    'date',
  );
  const uniqLabels = uniqBy(dataFormatted, d => d.label).map(d => d.label);
  const groupedData = Array.from(
    group(ensureCompleteDataForStackedBarChart(data, dateFormat || 'yyyy'), d => d.date),
    ([date, values]) => ({
      date,
      values:
        sortParameter !== undefined || autoSort
          ? sortParameter === 'total' || sortParameter === undefined
            ? sortBy(data, d => sum(d.size.filter(el => !checkIfNullOrUndefined(el))))
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
            : sortBy(data, d =>
                checkIfNullOrUndefined(d.size[sortParameter]) ? -Infinity : d.size[sortParameter],
              )
                .reverse()
                .map((el, i) => ({
                  ...el,
                  id: `${i}`,
                }))
          : (
              uniqLabels.map(label =>
                values.find(o => o.label === label),
              ) as GroupedBarGraphWithDateDataType[]
            ).map((el, i) => ({
              ...el,
              id: `${i}`,
            })),
    }),
  );

  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.map(d => sum(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0));

  const x = scaleLinear().domain([0, xMaxValue]).range([0, graphWidth]).nice();
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
            />
          ) : null}
          <AxisTitle
            x={graphWidth / 2}
            y={0 - margin.top + 15}
            style={styles?.xAxis?.title}
            className={classNames?.xAxis?.title}
            text={barAxisTitle}
          />
          <AnimatePresence>
            {groupedData[indx].values.map(d => {
              return (
                <g className='undp-viz-low-opacity undp-viz-g-with-hover' key={d.label}>
                  {d.size.map((el, j) => (
                    <motion.g
                      key={j}
                      opacity={selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 1}
                      onMouseEnter={event => {
                        setMouseOverData({ ...d, sizeIndex: j });
                        setEventY(event.clientY);
                        setEventX(event.clientX);
                        if (onSeriesMouseOver) {
                          onSeriesMouseOver({ ...d, sizeIndex: j });
                        }
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
                        if (onSeriesMouseOver) {
                          onSeriesMouseOver(undefined);
                        }
                      }}
                      onClick={() => {
                        if (onSeriesMouseClick || detailsOnClick) {
                          if (
                            isEqual(mouseClickData, { ...d, sizeIndex: j }) &&
                            resetSelectionOnDoubleClick
                          ) {
                            setMouseClickData(undefined);
                            if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                          } else {
                            setMouseClickData({ ...d, sizeIndex: j });
                            if (onSeriesMouseClick) onSeriesMouseClick({ ...d, sizeIndex: j });
                          }
                        }
                      }}
                    >
                      <motion.rect
                        key={j}
                        style={{ fill: barColors[j] }}
                        height={y.bandwidth()}
                        animate={{
                          width: x(el || 0),
                          attrX: x(
                            j === 0 ? 0 : sum(d.size.filter((element, k) => k < j && element)),
                          ),
                          attrY: y(d.id),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {showLabels ? (
                        <motion.text
                          style={{
                            textAnchor: 'end',
                            ...(styles?.yAxis?.labels || {}),
                          }}
                          className={cn(
                            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                            classNames?.yAxis?.labels,
                          )}
                          dx={-10}
                          dy='0.33em'
                          animate={{
                            attrX: x(0),
                            attrY: (y(d.id) || 0) + y.bandwidth() / 2,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {`${d.label}`.length < truncateBy
                            ? `${d.label}`
                            : `${`${d.label}`.substring(0, truncateBy)}...`}
                        </motion.text>
                      ) : null}
                      {showValues ? (
                        <motion.text
                          style={{
                            fill: getTextColorBasedOnBgColor(barColors[j]),
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                          dy='0.33em'
                          animate={{
                            attrX:
                              x(
                                j === 0 ? 0 : sum(d.size.filter((element, k) => k < j && element)),
                              ) +
                              x(el || 0) / 2,
                            attrY: (y(d.id) || 0) + y.bandwidth() / 2,
                            opacity:
                              el && x(el) / numberFormattingFunction(el, prefix, suffix).length > 12
                                ? 1
                                : 0,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {numberFormattingFunction(el, prefix, suffix)}
                        </motion.text>
                      ) : null}
                    </motion.g>
                  ))}
                  {showValues ? (
                    <motion.text
                      style={{
                        ...(valueColor && { fill: valueColor }),
                        textAnchor: 'start',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn(
                        'graph-value graph-value-total text-sm',
                        !valueColor ? ' fill-primary-gray-700 dark:fill-primary-gray-300' : '',
                        classNames?.graphObjectValues,
                      )}
                      dx={5}
                      dy='0.33em'
                      animate={{
                        attrX: x(sum(d.size.map(el => el || 0))),
                        attrY: (y(d.id) || 0) + y.bandwidth() / 2,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {numberFormattingFunction(
                        sum(d.size.filter(element => element)),
                        prefix,
                        suffix,
                      )}
                    </motion.text>
                  ) : null}
                </g>
              );
            })}
          </AnimatePresence>
          <Axis
            x1={x(0)}
            x2={x(0)}
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
                />
              ))}
            </>
          ) : null}
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
      {detailsOnClick ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='graph-modal-content m-0'
            dangerouslySetInnerHTML={{ __html: string2HTML(detailsOnClick, mouseClickData) }}
          />
        </Modal>
      ) : null}
    </>
  );
}
