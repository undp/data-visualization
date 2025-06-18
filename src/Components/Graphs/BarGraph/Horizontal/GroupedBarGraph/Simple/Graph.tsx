import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import { useState } from 'react';
import min from 'lodash.min';
import { cn, Modal } from '@undp/design-system-react';

import { ClassNameObject, GroupedBarGraphDataType, ReferenceDataType, StyleObject } from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';
import { YAxesLabels } from '@/Components/Elements/Axes/YAxesLabels';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineX } from '@/Components/Elements/ReferenceLine';

interface Props {
  data: GroupedBarGraphDataType[];
  barColors: string[];
  barPadding: number;
  showTicks: boolean;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  truncateBy: number;
  showLabels: boolean;
  width: number;
  suffix: string;
  prefix: string;
  showValues: boolean;
  height: number;
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  selectedColor?: string;
  rtl: boolean;
  labelOrder?: string[];
  maxBarThickness?: number;
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
    truncateBy,
    width,
    height,
    suffix,
    prefix,
    showValues,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    refValues,
    maxValue,
    minValue,
    onSeriesMouseClick,
    selectedColor,
    rtl,
    labelOrder,
    maxBarThickness,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    barAxisTitle,
    valueColor,
    noOfTicks,
    styles,
    classNames,
  } = props;
  const margin = {
    top: barAxisTitle ? topMargin + 25 : topMargin,
    bottom: bottomMargin,
    left: leftMargin,
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

  const dataWithId = data.map((d, i) => ({
    ...d,
    id: labelOrder ? `${d.label}` : `${i}`,
  }));
  const barOrder = labelOrder || dataWithId.map(d => `${d.id}`);

  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  const y = scaleBand()
    .domain(barOrder)
    .range([
      0,
      maxBarThickness ? Math.min(graphHeight, maxBarThickness * barOrder.length) : graphHeight,
    ])
    .paddingInner(barPadding);
  const subBarScale = scaleBand()
    .domain(data[0].size.map((_d, i) => `${i}`))
    .range([0, y.bandwidth()])
    .paddingInner(0.1);
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
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(y(d.id)) ? (
              <g key={i} transform={`translate(${0},${y(`${d.id}`)})`}>
                {d.size.map((el, j) => (
                  <g
                    className='undp-viz-g-with-hover'
                    key={j}
                    opacity={selectedColor ? (barColors[j] === selectedColor ? 1 : 0.3) : 0.85}
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
                          onSeriesMouseClick?.(undefined);
                        } else {
                          setMouseClickData({ ...d, sizeIndex: j });
                          if (onSeriesMouseClick) onSeriesMouseClick({ ...d, sizeIndex: j });
                        }
                      }
                    }}
                  >
                    {!checkIfNullOrUndefined(el) ? (
                      <rect
                        key={j}
                        x={(el as number) >= 0 ? x(0) : x(el as number)}
                        y={subBarScale(`${j}`)}
                        width={
                          (el as number) >= 0 ? x(el as number) - x(0) : x(0) - x(el as number)
                        }
                        style={{ fill: barColors[j] }}
                        height={subBarScale.bandwidth()}
                      />
                    ) : null}
                    {showValues ? (
                      <text
                        x={x(el || 0)}
                        y={(subBarScale(`${j}`) as number) + subBarScale.bandwidth() / 2}
                        style={{
                          fill: valueColor || barColors[j],
                          textAnchor: el ? (el < 0 ? 'end' : 'start') : 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        dx={el ? (el < 0 ? -5 : 5) : 5}
                        dy='0.33em'
                      >
                        {numberFormattingFunction(el, prefix, suffix)}
                      </text>
                    ) : null}
                  </g>
                ))}
                {showLabels ? (
                  <YAxesLabels
                    value={
                      `${d.label}`.length < truncateBy
                        ? `${d.label}`
                        : `${`${d.label}`.substring(0, truncateBy)}...`
                    }
                    y={0}
                    x={0 - margin.left}
                    width={x(xMinValue < 0 ? 0 : xMinValue) + margin.left}
                    height={y.bandwidth()}
                    style={styles?.yAxis?.labels}
                    className={classNames?.yAxis?.labels}
                  />
                ) : null}
              </g>
            ) : null,
          )}
          <Axis
            x1={x(xMinValue < 0 ? 0 : xMinValue)}
            x2={x(xMinValue < 0 ? 0 : xMinValue)}
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
      {detailsOnClick && mouseClickData !== undefined ? (
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
