import isEqual from 'fast-deep-equal';
import { useState } from 'react';
import maxBy from 'lodash.maxby';
import { Delaunay } from 'd3-delaunay';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import minBy from 'lodash.minby';
import sortBy from 'lodash.sortby';
import { parse } from 'date-fns';
import uniqBy from 'lodash.uniqby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'motion/react';
import { cn, Modal } from '@undp/design-system-react';

import {
  ScatterPlotWithDateDataType,
  ReferenceDataType,
  AnnotationSettingsDataType,
  StyleObject,
  ClassNameObject,
  HighlightAreaSettingsForScatterPlotDataType,
  CustomHighlightAreaSettingsForScatterPlotDataType,
  CustomLayerDataType,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { Colors } from '@/Components/ColorPalette';
import { ensureCompleteDataForScatterPlot } from '@/Utils/ensureCompleteData';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { getLineEndPoint } from '@/Utils/getLineEndPoint';
import { string2HTML } from '@/Utils/string2HTML';
import { Axis } from '@/Components/Elements/Axes/Axis';
import { AxisTitle } from '@/Components/Elements/Axes/AxisTitle';
import { XTicksAndGridLines } from '@/Components/Elements/Axes/XTicksAndGridLines';
import { RefLineX, RefLineY } from '@/Components/Elements/ReferenceLine';
import { Annotation } from '@/Components/Elements/Annotations';
import { YTicksAndGridLines } from '@/Components/Elements/Axes/YTicksAndGridLines';
import { HighlightAreaForScatterPlot } from '@/Components/Elements/HighlightArea';
import { CustomArea } from '@/Components/Elements/HighlightArea/customArea';

interface Props {
  data: ScatterPlotWithDateDataType[];
  width: number;
  height: number;
  showLabels: boolean;
  colors: string[];
  colorDomain: string[];
  radius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  refXValues: ReferenceDataType[];
  refYValues: ReferenceDataType[];
  selectedColor?: string;
  highlightedDataPoints: (string | number)[];
  maxRadiusValue?: number;
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  dateFormat: string;
  indx: number;
  rtl: boolean;
  annotations: AnnotationSettingsDataType[];
  highlightAreaSettings: HighlightAreaSettingsForScatterPlotDataType[];
  customHighlightAreaSettings: CustomHighlightAreaSettingsForScatterPlotDataType[];
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  noOfXTicks: number;
  noOfYTicks: number;
  labelColor?: string;
  xSuffix: string;
  ySuffix: string;
  xPrefix: string;
  yPrefix: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  dimmedOpacity: number;
  precision: number;
  customLayers: CustomLayerDataType[];
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
    xAxisTitle,
    yAxisTitle,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    refXValues,
    refYValues,
    highlightAreaSettings,
    selectedColor,
    highlightedDataPoints,
    maxRadiusValue,
    maxXValue,
    minXValue,
    maxYValue,
    minYValue,
    onSeriesMouseClick,
    dateFormat,
    indx,
    rtl,
    annotations,
    customHighlightAreaSettings,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    noOfXTicks,
    noOfYTicks,
    labelColor,
    xSuffix,
    ySuffix,
    xPrefix,
    yPrefix,
    styles,
    classNames,
    dimmedOpacity,
    precision,
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
    group(ensureCompleteDataForScatterPlot(data, dateFormat || 'yyyy'), d => d.date),
    ([date, values]) => ({
      date,
      values: (
        uniqLabels.map(label =>
          values.find(o => o.label === label),
        ) as ScatterPlotWithDateDataType[]
      ).map(el => ({
        ...el,
        id: el.label,
      })),
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: yAxisTitle ? leftMargin + 40 : leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([
            0,
            checkIfNullOrUndefined(maxRadiusValue)
              ? (maxBy(data, 'radius')?.radius as number)
              : (maxRadiusValue as number),
          ])
          .range([0.25, radius])
          .nice()
      : undefined;

  const xMinVal = checkIfNullOrUndefined(minXValue)
    ? (minBy(data, 'x')?.x as number) > 0
      ? 0
      : (minBy(data, 'x')?.x as number)
    : (minXValue as number);
  const xMaxVal = checkIfNullOrUndefined(maxXValue)
    ? (maxBy(data, 'x')?.x as number) > 0
      ? (maxBy(data, 'x')?.x as number)
      : 0
    : (maxXValue as number);
  const x = scaleLinear().domain([xMinVal, xMaxVal]).range([0, graphWidth]).nice();
  const yMinVal = checkIfNullOrUndefined(minYValue)
    ? (minBy(data, 'y')?.y as number) > 0
      ? 0
      : (minBy(data, 'y')?.y as number)
    : (minYValue as number);
  const yMaxVal = checkIfNullOrUndefined(maxYValue)
    ? (maxBy(data, 'y')?.y as number) > 0
      ? (maxBy(data, 'y')?.y as number)
      : 0
    : (maxYValue as number);
  const y = scaleLinear().domain([yMinVal, yMaxVal]).range([graphHeight, 0]).nice();
  const xTicks = x.ticks(noOfXTicks);
  const yTicks = y.ticks(noOfYTicks);
  const voronoiDiagram = Delaunay.from(
    groupedData[indx].values.filter(
      d => !checkIfNullOrUndefined(d.x) && !checkIfNullOrUndefined(d.y),
    ),
    d => x(d.x as number),
    d => y(d.y as number),
  ).voronoi([0, 0, graphWidth < 0 ? 0 : graphWidth, graphHeight < 0 ? 0 : graphHeight]);
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AnimatePresence>
            <HighlightAreaForScatterPlot
              areaSettings={highlightAreaSettings}
              width={graphWidth}
              height={graphHeight}
              scaleX={x}
              scaleY={y}
              animate={{ duration: 0, once: true, amount: 0 }}
            />
            <CustomArea
              areaSettings={customHighlightAreaSettings}
              scaleX={x}
              scaleY={y}
              animate={{ duration: 0, once: true, amount: 0 }}
            />
          </AnimatePresence>
          <g>
            <YTicksAndGridLines
              values={yTicks.filter(d => d !== 0)}
              y={yTicks.filter(d => d !== 0).map(d => y(d))}
              x1={0}
              x2={graphWidth + margin.right}
              styles={{
                gridLines: styles?.yAxis?.gridLines,
                labels: styles?.yAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.yAxis?.gridLines,
                labels: classNames?.yAxis?.labels,
              }}
              suffix={ySuffix}
              prefix={yPrefix}
              labelType='primary'
              showGridLines
              labelPos='side'
              precision={precision}
            />
            <Axis
              y1={y(yMinVal < 0 ? 0 : yMinVal)}
              y2={y(yMinVal < 0 ? 0 : yMinVal)}
              x1={0}
              x2={graphWidth}
              label={numberFormattingFunction(
                yMinVal < 0 ? 0 : yMinVal,
                precision,
                yPrefix,
                ySuffix,
              )}
              labelPos={{
                x: 0,
                y: y(yMinVal < 0 ? 0 : yMinVal),
                dy: '0.33em',
                dx: -4,
              }}
              classNames={{
                axis: classNames?.xAxis?.axis,
                label: classNames?.yAxis?.labels,
              }}
              styles={{
                axis: styles?.xAxis?.axis,
                label: { textAnchor: 'end', ...(styles?.yAxis?.labels || {}) },
              }}
            />
            <AxisTitle
              x={0 - margin.left + 15}
              y={graphHeight / 2}
              style={styles?.yAxis?.title}
              className={classNames?.yAxis?.title}
              text={yAxisTitle}
              rotate90
            />
          </g>
          <g>
            <XTicksAndGridLines
              values={xTicks.filter(d => d !== 0)}
              x={xTicks.filter(d => d !== 0).map(d => x(d))}
              y1={0}
              y2={graphHeight}
              styles={{
                gridLines: styles?.xAxis?.gridLines,
                labels: styles?.xAxis?.labels,
              }}
              classNames={{
                gridLines: classNames?.xAxis?.gridLines,
                labels: classNames?.xAxis?.labels,
              }}
              suffix={xSuffix}
              prefix={xPrefix}
              labelType='primary'
              showGridLines
              precision={precision}
            />
            <Axis
              x1={x(xMinVal < 0 ? 0 : xMinVal)}
              x2={x(xMinVal < 0 ? 0 : xMinVal)}
              y1={0}
              y2={graphHeight}
              label={numberFormattingFunction(
                xMinVal < 0 ? 0 : xMinVal,
                precision,
                xPrefix,
                xSuffix,
              )}
              labelPos={{
                x: x(xMinVal < 0 ? 0 : xMinVal),
                y: graphHeight,
                dy: '1em',
                dx: 0,
              }}
              classNames={{
                axis: classNames?.xAxis?.axis,
                label: classNames?.yAxis?.labels,
              }}
              styles={{
                axis: styles?.xAxis?.axis,
                label: {
                  textAnchor: 'middle',
                  ...(styles?.yAxis?.labels || {}),
                },
              }}
            />
            <AxisTitle
              x={graphWidth / 2}
              y={graphHeight + 30}
              style={styles?.xAxis?.title}
              className={classNames?.xAxis?.title}
              text={xAxisTitle}
            />
          </g>
          {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
          <AnimatePresence>
            {groupedData[indx].values.map((d, i) => {
              return (
                <g key={i}>
                  <path
                    d={voronoiDiagram.renderCell(
                      groupedData[indx].values.findIndex(el => el.id === d.id),
                    )}
                    className='opacity-0'
                    onMouseEnter={event => {
                      setMouseOverData(d);
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      onSeriesMouseOver?.(d);
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
                  />
                </g>
              );
            })}
            {groupedData[indx].values.map((d, i) => {
              return (
                <g key={i}>
                  <motion.g
                    opacity={
                      selectedColor
                        ? d.color
                          ? colors[colorDomain.indexOf(`${d.color}`)] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : mouseOverData
                          ? mouseOverData.label === d.label
                            ? 1
                            : dimmedOpacity
                          : highlightedDataPoints.length !== 0
                            ? highlightedDataPoints.indexOf(d.label || '') !== -1
                              ? 1
                              : 0.5
                            : 1
                    }
                    onMouseEnter={event => {
                      setMouseOverData(d);
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      onSeriesMouseOver?.(d);
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
                    <motion.circle
                      cx={0}
                      cy={0}
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
                      animate={{
                        cx: x(d.x || 0),
                        cy: y(d.y || 0),
                        r:
                          checkIfNullOrUndefined(d.x) || checkIfNullOrUndefined(d.y)
                            ? 0
                            : !radiusScale
                              ? radius
                              : radiusScale(d.radius || 0),
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showLabels && !checkIfNullOrUndefined(d.label) ? (
                      <motion.text
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        style={{
                          fill:
                            labelColor ||
                            (data.filter(el => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(`${d.color}`)]),
                          ...(styles?.graphObjectValues || {}),
                        }}
                        dy='0.33em'
                        dx={3}
                        animate={{
                          attrY: y(d.y || 0),
                          attrX: !radiusScale
                            ? x(d.x || 0) + radius
                            : x(d.x || 0) + radiusScale(d.radius || 0),
                          opacity:
                            checkIfNullOrUndefined(d.x) || checkIfNullOrUndefined(d.y) ? 0 : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {d.label}
                      </motion.text>
                    ) : highlightedDataPoints.length !== 0 && !checkIfNullOrUndefined(d.label) ? (
                      highlightedDataPoints.indexOf(d.label as string | number) !== -1 ? (
                        <motion.text
                          className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                          style={{
                            fill:
                              labelColor ||
                              (data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(`${d.color}`)]),
                            ...(styles?.graphObjectValues || {}),
                          }}
                          dy='0.33em'
                          dx={3}
                          animate={{
                            attrY: y(d.y || 0),
                            attrX: !radiusScale
                              ? x(d.x || 0) + radius
                              : x(d.x || 0) + radiusScale(d.radius || 0),
                            opacity:
                              checkIfNullOrUndefined(d.x) || checkIfNullOrUndefined(d.y) ? 0 : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {d.label}
                        </motion.text>
                      ) : null
                    ) : null}
                  </motion.g>
                </g>
              );
            })}
            {refXValues.map((el, i) => (
              <RefLineX
                key={i}
                text={el.text}
                color={el.color}
                x={x(el.value as number)}
                y1={0}
                y2={graphHeight}
                textSide={x(el.value as number) > graphWidth * 0.75 || rtl ? 'left' : 'right'}
                classNames={el.classNames}
                styles={el.styles}
                animate={{ duration: 0, once: true, amount: 0 }}
              />
            ))}
            {refYValues.map((el, i) => (
              <RefLineY
                key={i}
                text={el.text}
                color={el.color}
                y={y(el.value as number)}
                x1={0}
                x2={graphWidth}
                classNames={el.classNames}
                styles={el.styles}
                animate={{ duration: 0, once: true, amount: 0 }}
              />
            ))}
            <g>
              {annotations.map((d, i) => {
                const endPoints = getLineEndPoint(
                  {
                    x: d.xCoordinate
                      ? x(d.xCoordinate as number) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                    y: d.yCoordinate
                      ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                      : 0 + (d.yOffset || 0) - 8,
                  },
                  {
                    x: d.xCoordinate ? x(d.xCoordinate as number) : 0,
                    y: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                  },
                  checkIfNullOrUndefined(d.connectorRadius) ? 3.5 : (d.connectorRadius as number),
                );
                const connectorSettings = d.showConnector
                  ? {
                      y1: endPoints.y,
                      x1: endPoints.x,
                      y2: d.yCoordinate
                        ? y(d.yCoordinate as number) + (d.yOffset || 0)
                        : 0 + (d.yOffset || 0),
                      x2: d.xCoordinate
                        ? x(d.xCoordinate as number) + (d.xOffset || 0)
                        : 0 + (d.xOffset || 0),
                      cy: d.yCoordinate ? y(d.yCoordinate as number) : 0,
                      cx: d.xCoordinate ? x(d.xCoordinate as number) : 0,
                      circleRadius: checkIfNullOrUndefined(d.connectorRadius)
                        ? 3.5
                        : (d.connectorRadius as number),
                      strokeWidth: d.showConnector === true ? 2 : Math.min(d.showConnector || 0, 1),
                    }
                  : undefined;
                const labelSettings = {
                  y: d.yCoordinate
                    ? y(d.yCoordinate as number) + (d.yOffset || 0) - 8
                    : 0 + (d.yOffset || 0) - 8,
                  x: rtl
                    ? 0
                    : d.xCoordinate
                      ? x(d.xCoordinate as number) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0),
                  width: rtl
                    ? d.xCoordinate
                      ? x(d.xCoordinate as number) + (d.xOffset || 0)
                      : 0 + (d.xOffset || 0)
                    : graphWidth -
                      (d.xCoordinate
                        ? x(d.xCoordinate as number) + (d.xOffset || 0)
                        : 0 + (d.xOffset || 0)),
                  maxWidth: d.maxWidth,
                  fontWeight: d.fontWeight,
                  align: d.align,
                };
                return (
                  <Annotation
                    key={i}
                    color={d.color}
                    connectorsSettings={connectorSettings}
                    labelSettings={labelSettings}
                    text={d.text}
                    classNames={d.classNames}
                    styles={d.styles}
                    animate={{ duration: 0, once: true, amount: 0 }}
                  />
                );
              })}
            </g>
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
