import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import { useState } from 'react';
import { cn, Modal } from '@undp/design-system-react';
import sum from 'lodash.sum';

import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { BulletChartDataType, ClassNameObject, ReferenceDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XAxesLabels } from '@/Components/Elements/Axes/XAxesLabels';
import { RefLineY } from '@/Components/Elements/ReferenceLine';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';

interface Props {
  data: BulletChartDataType[];
  width: number;
  height: number;
  barColor: string;
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
  targetColor: string;
  targetStyle: 'background' | 'line';
  qualitativeRangeColors: string[];
  measureBarWidthFactor: number;
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
    truncateBy,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    tooltip,
    onSeriesMouseOver,
    refValues,
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
    targetStyle,
    targetColor,
    qualitativeRangeColors,
    measureBarWidthFactor,
  } = props;
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

  const barMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) < 0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));
  const targetMaxValue =
    Math.max(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) <
    0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.target as number));
  const qualitativeRangeMaxValue = Math.max(
    ...data.map(d => sum((d.qualitativeRange || []).filter(l => !checkIfNullOrUndefined(l))) || 0),
  );
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite)) <
        0
      ? 0
      : Math.max(
          ...[barMaxValue, targetMaxValue, qualitativeRangeMaxValue].filter(Number.isFinite),
        );
  const barMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number)) >= 0
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.size)).map(d => d.size as number));

  const targetMinValue =
    Math.min(...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number)) >=
    0
      ? 0
      : Math.min(
          ...data.filter(d => !checkIfNullOrUndefined(d.target)).map(d => d.target as number),
        );
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite)) >= 0
      ? 0
      : Math.min(...[barMinValue, targetMinValue].filter(Number.isFinite));

  const y = scaleLinear().domain([xMinValue, xMaxValue]).range([graphHeight, 0]).nice();

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
            label={numberFormattingFunction(xMinValue < 0 ? 0 : xMinValue, prefix, suffix)}
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
          {dataWithId.map((d, i) =>
            !checkIfNullOrUndefined(x(d.id)) ? (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={
                  highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf(d.label) !== -1
                      ? 0.85
                      : 0.3
                    : 0.85
                }
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
                {d.target && targetStyle === 'background' ? (
                  <rect
                    x={x(`${d.id}`) || 0}
                    y={d.target > 0 ? y(d.target) : y(0)}
                    width={x.bandwidth()}
                    style={{
                      fill: targetColor,
                    }}
                    height={Math.abs(y(d.target) - y(0))}
                  />
                ) : null}
                {d.qualitativeRange
                  ? d.qualitativeRange.map((_el, j) => (
                      <rect
                        key={j}
                        x={x(`${d.id}`) || 0}
                        y={y(
                          sum(
                            (d.qualitativeRange as number[]).filter(
                              (element, k) => k <= j && element,
                            ),
                          ),
                        )}
                        width={x.bandwidth()}
                        style={{ fill: qualitativeRangeColors[j] }}
                        height={Math.abs(
                          y(
                            sum(
                              (d.qualitativeRange as number[]).filter(
                                (element, k) => k <= j && element,
                              ),
                            ),
                          ) -
                            y(
                              sum(
                                (d.qualitativeRange as number[]).filter(
                                  (element, k) => k < j && element,
                                ),
                              ),
                            ),
                        )}
                      />
                    ))
                  : null}
                {d.target && targetStyle === 'background' ? (
                  <rect
                    x={x(`${d.id}`) || 0}
                    y={d.target > 0 ? y(d.target) : y(0)}
                    width={x.bandwidth()}
                    style={{
                      fill: targetColor,
                    }}
                    height={Math.abs(y(d.target) - y(0))}
                  />
                ) : null}
                {d.size ? (
                  <rect
                    x={(x(`${d.id}`) || 0) + x.bandwidth() * ((1 - measureBarWidthFactor) / 2)}
                    y={d.size > 0 ? y(d.size) : y(0)}
                    width={x.bandwidth() * measureBarWidthFactor}
                    style={{
                      fill: barColor,
                    }}
                    height={Math.abs(y(d.size) - y(0))}
                  />
                ) : null}
                {d.target && targetStyle === 'line' ? (
                  <rect
                    x={x(`${d.id}`) || 0}
                    y={y(d.target) - 1}
                    width={x.bandwidth()}
                    style={{
                      fill: targetColor,
                    }}
                    height={2}
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
                  />
                ) : null}
                {showValues ? (
                  <text
                    x={(x(`${d.id}`) as number) + x.bandwidth() / 2}
                    y={y(d.size || 0)}
                    style={{
                      ...(valueColor
                        ? { fill: valueColor }
                        : barColor.length > 1
                          ? {}
                          : { fill: barColor[0] }),
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
                  >
                    {numberFormattingFunction(d.size, prefix, suffix)}
                  </text>
                ) : null}
              </g>
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
