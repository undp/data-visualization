import isEqual from 'fast-deep-equal';
import { useState } from 'react';
import maxBy from 'lodash.maxby';
import { scaleLinear } from 'd3-scale';
import minBy from 'lodash.minby';
import { cn, Modal } from '@undp/design-system-react';

import { ClassNameObject, SlopeChartDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';

interface Props {
  data: SlopeChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  radius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  axisTitles: [string, string];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    showLabels,
    colors,
    colorDomain,
    radius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    axisTitles,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
  } = props;
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
  const minY = Math.min(minBy(data, 'y1')?.y1 as number, minBy(data, 'y2')?.y2 as number);
  const maxY = Math.max(maxBy(data, 'y1')?.y1 as number, maxBy(data, 'y2')?.y2 as number);
  const y = scaleLinear()
    .domain([
      checkIfNullOrUndefined(minValue) ? (minY > 0 ? 0 : minY) : (minValue as number),
      checkIfNullOrUndefined(maxValue) ? (maxY > 0 ? maxY : 0) : (maxValue as number),
    ])
    .range([graphHeight, 0])
    .nice();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        className='mx-auto'
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            <Axis
              y1={0}
              y2={graphHeight}
              x1={radius}
              x2={radius}
              classNames={{
                axis: cn(
                  'stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550',
                  classNames?.yAxis?.axis,
                ),
              }}
            />
            <AxisTitle
              x={radius}
              y={graphHeight + 15}
              style={styles?.yAxis?.title}
              className={cn(
                'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                classNames?.yAxis?.title,
              )}
              text={axisTitles[0]}
            />
          </g>
          <g>
            <Axis
              y1={0}
              y2={graphHeight}
              x1={graphWidth - radius}
              x2={graphWidth - radius}
              classNames={{
                axis: cn(
                  'stroke-1 stroke-primary-gray-500 dark:stroke-primary-gray-550',
                  classNames?.yAxis?.axis,
                ),
              }}
            />
            <AxisTitle
              x={graphWidth - radius}
              y={graphHeight + 15}
              style={styles?.yAxis?.title}
              className={cn(
                'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
                classNames?.yAxis?.title,
              )}
              text={axisTitles[1]}
            />
          </g>
          {data.map((d, i) => {
            return (
              <g
                key={i}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(`${d.color}`)] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : mouseOverData
                      ? mouseOverData.label === d.label
                        ? 1
                        : 0.3
                      : highlightedDataPoints.length !== 0
                        ? highlightedDataPoints.indexOf(d.label) !== -1
                          ? 1
                          : 0.5
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
                <circle
                  cx={radius}
                  cy={y(d.y1)}
                  r={radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    fillOpacity: 0.6,
                  }}
                />
                {showLabels ? (
                  <text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                            ? Colors.gray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                      textAnchor: 'end',
                      ...(styles?.yAxis?.labels || {}),
                    }}
                    className={cn('text-xs', classNames?.yAxis?.labels)}
                    y={y(d.y1)}
                    x={5}
                    dy='0.33em'
                    dx={-3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                              ? Colors.gray
                              : colors[colorDomain.indexOf(`${d.color}`)],
                        textAnchor: 'end',
                        ...(styles?.yAxis?.labels || {}),
                      }}
                      className={cn('text-xs', classNames?.yAxis?.labels)}
                      y={y(d.y1)}
                      x={5}
                      dy='0.33em'
                      dx={-3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <circle
                  cx={graphWidth - radius}
                  cy={y(d.y2)}
                  r={radius}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    fillOpacity: 0.6,
                  }}
                />
                {showLabels ? (
                  <text
                    style={{
                      fill:
                        data.filter(el => el.color).length === 0
                          ? colors[0]
                          : !d.color
                            ? Colors.gray
                            : colors[colorDomain.indexOf(`${d.color}`)],
                      textAnchor: 'start',
                      ...(styles?.yAxis?.labels || {}),
                    }}
                    className={cn('text-xs', classNames?.yAxis?.labels)}
                    y={y(d.y2)}
                    x={graphWidth - 5}
                    dy='0.33em'
                    dx={3}
                  >
                    {d.label}
                  </text>
                ) : highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      style={{
                        fill:
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                              ? Colors.gray
                              : colors[colorDomain.indexOf(`${d.color}`)],
                        textAnchor: 'start',
                        ...(styles?.yAxis?.labels || {}),
                      }}
                      className={cn('text-xs', classNames?.yAxis?.labels)}
                      y={y(d.y2)}
                      x={graphWidth - 5}
                      dy='0.33em'
                      dx={3}
                    >
                      {d.label}
                    </text>
                  ) : null
                ) : null}
                <line
                  x1={radius}
                  x2={graphWidth - radius}
                  y1={y(d.y1)}
                  y2={y(d.y2)}
                  className={classNames?.dataConnectors}
                  style={{
                    fill: 'none',
                    stroke:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !d.color
                          ? Colors.gray
                          : colors[colorDomain.indexOf(`${d.color}`)],
                    strokeWidth: 1,
                    ...styles?.dataConnectors,
                  }}
                />
              </g>
            );
          })}
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
