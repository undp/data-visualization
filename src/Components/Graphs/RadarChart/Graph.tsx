/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'fast-deep-equal';
import { pie, arc, lineRadial, curveLinearClosed, curveCardinalClosed } from 'd3-shape';
import { useState } from 'react';
import { cn, H2, Modal, P } from '@undp/design-system-react';
import max from 'lodash.max';
import min from 'lodash.min';
import { scaleLinear } from 'd3-scale';

import { ClassNameObject, RadarChartDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { string2HTML } from '@/Utils/string2HTML';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  radius: number;
  lineColors: string[];
  axisLabels: (string | number)[];
  data: RadarChartDataType[];

  tooltip?: string | ((_d: any) => React.ReactNode);
  selectedColor?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  colorDomain: string[];

  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  strokeWidth: number;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  showValues: boolean;
  showDots: boolean;
  topMargin: number;
  bottomMargin: number;
  leftMargin: number;
  rightMargin: number;
  curveType: 'linear' | 'curve';
  noOfTicks: number;
  maxValue?: number;
  minValue?: number;
  fillShape: boolean;
  resetSelectionOnDoubleClick: boolean;
  highlightedLines: (string | number)[];
}

export function Graph(props: Props) {
  const {
    data,
    radius,
    lineColors,
    tooltip,
    onSeriesMouseOver,
    onSeriesMouseClick,
    colorDomain,
    detailsOnClick,
    styles,
    classNames,
    selectedColor,
    axisLabels,
    strokeWidth,
    showValues,
    showDots,
    rightMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    curveType,
    noOfTicks,
    minValue,
    maxValue,
    resetSelectionOnDoubleClick,
    fillShape,
    highlightedLines,
  } = props;
  const curve = curveType === 'linear' ? curveLinearClosed : curveCardinalClosed;
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const radiusWithoutMargin = Math.min(
    (2 * radius - leftMargin - rightMargin) / 2,
    (2 * radius - topMargin - bottomMargin) / 2,
  );
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);

  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const angleScale = scaleLinear()
    .domain([0, data[0].values.length])
    .range([0, 2 * Math.PI]);

  const maxVal = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.map(d => max(d.values.filter(l => !checkIfNullOrUndefined(l))) || 0)) < 0
      ? 0
      : Math.max(...data.map(d => max(d.values.filter(l => !checkIfNullOrUndefined(l))) || 0));

  const minVal = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.map(d => min(d.values.filter(l => !checkIfNullOrUndefined(l))) || 0)) >= 0
      ? 0
      : Math.min(...data.map(d => min(d.values.filter(l => !checkIfNullOrUndefined(l))) || 0));
  const scale = scaleLinear().domain([minVal, maxVal]).range([0, radiusWithoutMargin]).nice();
  const ticksArray = scale.ticks(noOfTicks);
  const lineShape = lineRadial<number>()
    .radius((d, i) => scale(d))
    .angle((_, i) => angleScale(i))
    .curve(curve);
  return (
    <>
      <svg
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g transform={`translate(${radiusWithoutMargin},${radiusWithoutMargin})`}>
            {axisLabels.map((d, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={0}
                  x2={Math.cos(angleScale(i) - Math.PI / 2) * radiusWithoutMargin}
                  y2={Math.sin(angleScale(i) - Math.PI / 2) * radiusWithoutMargin}
                  key={i}
                  className={cn(
                    'stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550',
                    classNames?.xAxis?.axis,
                  )}
                  style={styles?.xAxis?.axis}
                />
                <text
                  x={Math.cos(angleScale(i) - Math.PI / 2) * (radiusWithoutMargin + 6)}
                  y={Math.sin(angleScale(i) - Math.PI / 2) * (radiusWithoutMargin + 6)}
                  style={{
                    textAnchor:
                      Math.cos(angleScale(i) - Math.PI / 2) < 0
                        ? 'end'
                        : Math.cos(angleScale(i) - Math.PI / 2) < 0.00001
                          ? 'middle'
                          : 'start',
                    ...(styles?.xAxis?.labels || ''),
                  }}
                  dy={
                    Math.sin(angleScale(i) - Math.PI / 2) < 0
                      ? 0
                      : Math.sin(angleScale(i) - Math.PI / 2) < 0.00001
                        ? 5
                        : 10
                  }
                  className={cn(
                    'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                    classNames?.xAxis?.labels,
                  )}
                >
                  {d}
                </text>
              </g>
            ))}
            {ticksArray.map((d, i) => (
              <g key={i}>
                <path
                  d={lineShape(Array(axisLabels.length).fill(d)) || ''}
                  className={cn(
                    'stroke-primary-gray-500 dark:stroke-primary-gray-550',
                    classNames?.xAxis?.gridLines,
                  )}
                  style={{
                    ...styles?.xAxis?.gridLines,
                    fill: 'none',
                  }}
                />
                <foreignObject
                  x={-25}
                  y={
                    Math.sin(-Math.PI / 2) * scale(d) > -0.0001
                      ? Math.sin(-Math.PI / 2) * scale(d) - 7
                      : Math.sin(-Math.PI / 2) * scale(d) - 5
                  }
                  width={50}
                  height={12}
                >
                  <div className='flex justify-center'>
                    <p
                      className={cn(
                        'fill-primary-gray-500 dark:fill-primary-gray-550 text-xs m-0 py-0 px-1.5 text-center leading-none bg-primary-white dark:bg-primary-gray-700',
                        classNames?.xAxis?.labels,
                      )}
                      style={styles?.xAxis?.labels}
                    >
                      {d}
                    </p>
                  </div>
                </foreignObject>
              </g>
            ))}
            {data.map((d, i) => (
              <g
                key={i}
                opacity={
                  mouseOverData
                    ? d.label === mouseOverData.label
                      ? 1
                      : 0.3
                    : selectedColor
                      ? d.color
                        ? lineColors[colorDomain.indexOf(d.color)] === selectedColor
                          ? 1
                          : 0.3
                        : 0.3
                      : highlightedLines.length !== 0
                        ? d.label
                          ? highlightedLines.indexOf(d.label) !== -1
                            ? 1
                            : 0.3
                          : 0.3
                        : 1
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
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
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(undefined);
                  }
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
              >
                <path
                  d={lineShape(d.values) || ''}
                  style={{
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? lineColors[0]
                        : !d.color
                          ? Colors.gray
                          : lineColors[colorDomain.indexOf(d.color)],
                    fill: fillShape
                      ? data.filter(el => el.color).length === 0
                        ? lineColors[0]
                        : !d.color
                          ? Colors.gray
                          : lineColors[colorDomain.indexOf(d.color)]
                      : 'none',
                    fillOpacity: 0.1,
                    strokeWidth,
                  }}
                />
                <g>
                  {d.values.map((el, j) => (
                    <g key={j}>
                      {!checkIfNullOrUndefined(el) ? (
                        <>
                          {showDots ? (
                            <circle
                              cx={Math.cos(angleScale(j) - Math.PI / 2) * scale(el)}
                              cy={Math.sin(angleScale(j) - Math.PI / 2) * scale(el)}
                              r={4}
                              style={{
                                fill:
                                  data.filter(el => el.color).length === 0
                                    ? lineColors[0]
                                    : !d.color
                                      ? Colors.gray
                                      : lineColors[colorDomain.indexOf(d.color)],
                              }}
                            />
                          ) : null}
                          {showValues ? (
                            <text
                              cx={Math.cos(angleScale(j) - Math.PI / 2) * (scale(el) + 6)}
                              cy={Math.sin(angleScale(j) - Math.PI / 2) * (scale(el) + 6)}
                              style={{
                                fill: lineColors[i],
                                textAnchor:
                                  Math.cos(angleScale(j) - Math.PI / 2) < 0
                                    ? 'end'
                                    : Math.cos(angleScale(j) - Math.PI / 2) < 0.00001
                                      ? 'middle'
                                      : 'start',
                                ...(styles?.graphObjectValues || {}),
                              }}
                              dy={
                                Math.sin(angleScale(j) - Math.PI / 2) < 0
                                  ? 10
                                  : Math.sin(angleScale(j) - Math.PI / 2) < 0.00001
                                    ? 0
                                    : 0
                              }
                              className={cn(
                                'graph-value text-xs font-bold',
                                classNames?.graphObjectValues,
                              )}
                            >
                              {numberFormattingFunction(el)}
                            </text>
                          ) : null}
                        </>
                      ) : null}
                    </g>
                  ))}
                </g>
              </g>
            ))}
          </g>
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
