import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { AnimatePresence, motion } from 'motion/react';
import { cn, Modal } from '@undp/design-system-react';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import {
  ReferenceDataType,
  GroupedBarGraphWithDateDataType,
  StyleObject,
  ClassNameObject,
  CustomLayerDataType,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { ensureCompleteDataForStackedBarChart } from '@/Utils/ensureCompleteData';
import { string2HTML } from '@/Utils/string2HTML';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

interface Props {
  data: GroupedBarGraphWithDateDataType[];
  width: number;
  height: number;
  barColors: string[];
  suffix: string;
  prefix: string;
  barPadding: number;
  showLabels: boolean;
  showValues: boolean;
  showTicks: boolean;
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
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  indx: number;
  dateFormat: string;
  maxBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  barAxisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  precision: number;
  customLayers: CustomLayerDataType[];
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    barColors,
    suffix,
    prefix,
    barPadding,
    showLabels,
    showValues,
    showTicks,
    truncateBy,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    dateFormat,
    indx,
    maxBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    precision,
    classNames,
    customLayers,
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
    group(ensureCompleteDataForStackedBarChart(data, dateFormat || 'yyyy'), d => d.date),
    ([date, values]) => ({
      date,
      values: (
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

  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.map(d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0)) < 0
      ? 0
      : Math.max(...data.map(d => max(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0));

  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.map(d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0)) >= 0
      ? 0
      : Math.min(...data.map(d => min(d.size.filter(l => !checkIfNullOrUndefined(l))) || 0));

  const y = scaleLinear().domain([xMinValue, xMaxValue]).range([graphHeight, 0]).nice();
  const x = scaleBand()
    .domain(uniqLabels.map((_d, i) => `${i}`))
    .range([
      0,
      maxBarThickness ? Math.min(graphWidth, maxBarThickness * uniqLabels.length) : graphWidth,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, x.bandwidth()])
    .paddingInner(0.1);
  const yTicks = y.ticks(noOfTicks);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <Axis
            y1={y(xMinValue < 0 ? 0 : xMinValue)}
            y2={y(xMinValue < 0 ? 0 : xMinValue)}
            x1={0 - leftMargin}
            x2={graphWidth + margin.right}
            label={numberFormattingFunction(
              xMinValue < 0 ? 0 : xMinValue,
              precision,
              prefix,
              suffix,
            )}
            labelPos={{
              x: 0 - leftMargin,
              dx: 0,
              dy: xMaxValue < 0 ? '1em' : -5,
              y: y(xMinValue < 0 ? 0 : xMinValue),
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
            {groupedData[indx].values.map((d, i) => {
              return (
                <motion.g key={i} transform={`translate(${x(`${d.id}`)},0)`}>
                  {d.size.map((el, j) => (
                    <motion.g
                      className='undp-viz-g-with-hover'
                      key={j}
                      opacity={selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 0.85}
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
                            if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                          } else {
                            setMouseClickData({ ...d, sizeIndex: j });
                            if (onSeriesMouseClick) onSeriesMouseClick({ ...d, sizeIndex: j });
                          }
                        }
                      }}
                    >
                      <motion.rect
                        x={subBarScale(`${j}`)}
                        width={subBarScale.bandwidth()}
                        style={{ fill: barColors[j] }}
                        animate={{
                          height: !checkIfNullOrUndefined(el)
                            ? Math.abs(y(el as number) - y(0))
                            : 0,
                          attrY: !checkIfNullOrUndefined(el)
                            ? (el as number) > 0
                              ? y(el as number)
                              : y(0)
                            : y(0),
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      {showValues ? (
                        <motion.text
                          x={(subBarScale(`${j}`) as number) + subBarScale.bandwidth() / 2}
                          style={{
                            fill: valueColor || barColors[j],
                            textAnchor: 'middle',
                            ...(styles?.graphObjectValues || {}),
                          }}
                          className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                          dy={el ? (el >= 0 ? '-5px' : '1em') : '-5px'}
                          animate={{ attrY: y(el || 0) }}
                          transition={{ duration: 0.5 }}
                        >
                          {numberFormattingFunction(el, precision, prefix, suffix)}
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
                      animate={{ duration: 0, once: true, amount: 0 }}
                      isInView
                    />
                  ) : null}
                </motion.g>
              );
            })}
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
                    animate={{ duration: 0, once: true, amount: 0 }}
                    isInView
                  />
                ))}
              </>
            ) : null}
          </AnimatePresence>
          {customLayers.filter(d => d.position === 'after').map(d => d.layer)}
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
