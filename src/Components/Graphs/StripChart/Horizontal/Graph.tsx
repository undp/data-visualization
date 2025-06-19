import isEqual from 'fast-deep-equal';
import { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import sortBy from 'lodash.sortby';
import { cn, Modal } from '@undp/design-system-react';

import { ClassNameObject, StripChartDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  data: StripChartDataType[];
  width: number;
  height: number;
  selectedColor?: string;
  colors: string[];
  colorDomain: string[];
  radius: number;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  maxValue?: number;
  minValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  showAxis: boolean;
  prefix: string;
  suffix: string;
  stripType: 'strip' | 'dot';
  highlightColor?: string;
  dotOpacity: number;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  valueColor?: string;
}

export function Graph(props: Props) {
  const {
    data,
    width,
    height,
    colors,
    colorDomain,
    radius,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    highlightedDataPoints,
    selectedColor,
    minValue,
    maxValue,
    onSeriesMouseClick,
    showAxis,
    prefix,
    suffix,
    stripType,
    highlightColor,
    dotOpacity,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    valueColor,
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

  const dataWithId = data.map((d, i) => ({ ...d, id: `${i}` }));

  const sortedData = sortBy(dataWithId, item => {
    const index = (highlightedDataPoints || []).indexOf(item.label);
    return index === -1 ? Infinity : index;
  }).reverse();
  const xMaxValue = !checkIfNullOrUndefined(maxValue)
    ? (maxValue as number)
    : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) < 0
      ? 0
      : Math.max(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const xMinValue = !checkIfNullOrUndefined(minValue)
    ? (minValue as number)
    : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position)) >= 0
      ? 0
      : Math.min(...data.filter(d => !checkIfNullOrUndefined(d.position)).map(d => d.position));
  const x = scaleLinear().domain([xMinValue, xMaxValue]).range([0, graphWidth]).nice();
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {sortedData.map((d, i) => {
            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                transform={`translate(${x(d.position)},${graphHeight / 2})`}
                opacity={
                  selectedColor
                    ? d.color
                      ? colors[colorDomain.indexOf(d.color)] === selectedColor
                        ? 1
                        : dotOpacity
                      : dotOpacity
                    : highlightedDataPoints.length !== 0
                      ? highlightedDataPoints.indexOf(d.label) !== -1
                        ? 0.85
                        : dotOpacity
                      : dotOpacity
                }
                onMouseEnter={event => {
                  setMouseOverData(d);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver(d);
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
              >
                {stripType === 'dot' ? (
                  <circle
                    cy={0}
                    cx={0}
                    style={{
                      fill:
                        highlightColor && highlightedDataPoints
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? highlightColor
                            : data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(d.color)]
                          : data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                              ? Colors.gray
                              : colors[colorDomain.indexOf(d.color)],
                    }}
                    r={radius}
                  />
                ) : (
                  <rect
                    y={0 - radius}
                    x={-1}
                    height={radius * 2}
                    width={2}
                    style={{
                      fill:
                        highlightColor && highlightedDataPoints
                          ? highlightedDataPoints.indexOf(d.label) !== -1
                            ? highlightColor
                            : data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(d.color)]
                          : data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !d.color
                              ? Colors.gray
                              : colors[colorDomain.indexOf(d.color)],
                    }}
                  />
                )}
                {highlightedDataPoints.length !== 0 ? (
                  highlightedDataPoints.indexOf(d.label) !== -1 ? (
                    <text
                      x={0}
                      y={0 - radius - 5}
                      style={{
                        fill:
                          valueColor ||
                          (highlightColor && highlightedDataPoints
                            ? highlightedDataPoints.indexOf(d.label) !== -1
                              ? highlightColor
                              : data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(d.color)]
                            : data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(d.color)]),
                        textAnchor: 'middle',
                        ...(styles?.graphObjectValues || {}),
                      }}
                      className={cn('graph-value text-sm font-bold', classNames?.graphObjectValues)}
                    >
                      {numberFormattingFunction(d.position, prefix, suffix)}
                    </text>
                  ) : null
                ) : null}
              </g>
            );
          })}
          {showAxis ? (
            <>
              <text
                x={0}
                y={graphHeight / 2 + radius}
                style={{
                  textAnchor: 'start',
                  ...(styles?.yAxis?.labels || {}),
                }}
                className={cn(
                  'fill-primary-gray-550 dark:fill-primary-gray-500 text-xs',
                  classNames?.yAxis?.labels,
                )}
                dy='1em'
              >
                {numberFormattingFunction(x.invert(0), prefix, suffix)}
              </text>
              <text
                x={graphWidth}
                y={graphHeight / 2 + radius}
                style={{
                  textAnchor: 'end',
                  ...(styles?.yAxis?.labels || {}),
                }}
                className={cn(
                  'fill-primary-gray-550 dark:fill-primary-gray-500 text-xs',
                  classNames?.yAxis?.labels,
                )}
                dy='1em'
              >
                {numberFormattingFunction(x.invert(graphWidth), prefix, suffix)}
              </text>
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
