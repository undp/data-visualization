import isEqual from 'fast-deep-equal';
import { scaleLinear, scaleBand } from 'd3-scale';
import max from 'lodash.max';
import min from 'lodash.min';
import { useState } from 'react';
import { cn, Modal } from '@undp/design-system-react';

import { ClassNameObject, DumbbellChartDataType, ReferenceDataType, StyleObject } from '@/Types';
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
  tooltip?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  maxPositionValue?: number;
  minPositionValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  arrowConnector: boolean;
  connectorStrokeWidth: number;
  maxBarThickness?: number;
  minBarThickness?: number;
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  axisTitle?: string;
  noOfTicks: number;
  valueColor?: string;
  labelOrder?: string[];
  styles?: StyleObject;
  classNames?: ClassNameObject;
  refValues?: ReferenceDataType[];
  rtl: boolean;
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
  } = props;
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
          />
          {dataWithId.map((d, i) => (
            <g
              className='undp-viz-low-opacity undp-viz-g-with-hover'
              key={i}
              transform={`translate(0,${(y(`${d.id}`) as number) + y.bandwidth() / 2})`}
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
                />
              ) : null}
              <line
                x1={x(min(d.x) as number) + radius}
                x2={x(max(d.x) as number) - radius}
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
                  arrowConnector && d.x.indexOf(min(d.x) as number) === 0 ? 'url(#arrow)' : ''
                }
                markerStart={
                  arrowConnector && d.x.indexOf(min(d.x) as number) === d.x.length - 1
                    ? 'url(#arrow)'
                    : ''
                }
              />
              {d.x.map((el, j) => (
                <g
                  key={j}
                  opacity={selectedColor ? (dotColors[j] === selectedColor ? 1 : 0.3) : 1}
                  onMouseEnter={event => {
                    setMouseOverData({ ...d, xIndex: j });
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver({ ...d, xIndex: j });
                    }
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
                    if (onSeriesMouseOver) {
                      onSeriesMouseOver(undefined);
                    }
                  }}
                >
                  {checkIfNullOrUndefined(el) ? null : (
                    <>
                      <circle
                        cx={x(el || 0)}
                        cy={0}
                        r={radius}
                        opacity={checkIfNullOrUndefined(el) ? 0 : 1}
                        style={{
                          fill: dotColors[j],
                          fillOpacity: 0.85,
                          stroke: dotColors[j],
                          strokeWidth: 1,
                          opacity: checkIfNullOrUndefined(el) ? 0 : 1,
                        }}
                      />
                      {showValues ? (
                        <text
                          x={x(el || 0)}
                          y={0}
                          style={{
                            fill: valueColor || dotColors[j],
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
                        >
                          {numberFormattingFunction(el, prefix, suffix)}
                        </text>
                      ) : null}
                    </>
                  )}
                </g>
              ))}
            </g>
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
