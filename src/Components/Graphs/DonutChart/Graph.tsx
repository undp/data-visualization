/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'fast-deep-equal';
import { pie } from 'd3-shape';
import { useRef, useState } from 'react';
import { H2, P } from '@undp/design-system-react/Typography';
import { AnimatePresence, motion, useInView } from 'motion/react';

import { AnimateDataType, ClassNameObject, DonutChartDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { getArc } from '@/Utils/getArc';

interface Props {
  mainText?: string | { label: string; suffix?: string; prefix?: string };
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
  tooltip?: string | ((_d: any) => React.ReactNode);
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  colorDomain: string[];
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  precision: number;
  animate: AnimateDataType;
  trackColor: string;
}

export function Graph(props: Props) {
  const {
    mainText,
    data,
    radius,
    colors,
    subNote,
    strokeWidth,
    tooltip,
    onSeriesMouseOver,
    onSeriesMouseClick,
    colorDomain,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    precision,
    animate,
    trackColor,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const pieData = pie()
    .sort(null)
    .startAngle(0)
    .value((d: any) => d.size);

  const [mouseOverData, setMouseOverData] = useState<any>(undefined);

  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  return (
    <>
      <motion.svg
        ref={svgRef}
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        direction='ltr'
        className='mx-auto'
      >
        <motion.g transform={`translate(${radius} ${radius})`}>
          {mainText || subNote ? (
            <foreignObject
              y={0 - (radius - strokeWidth)}
              x={0 - (radius - strokeWidth)}
              width={2 * (radius - strokeWidth)}
              height={2 * (radius - strokeWidth)}
            >
              <div className='flex flex-col gap-0.5 justify-center items-center h-inherit py-0 px-4'>
                {mainText ? (
                  <H2
                    marginBottom='none'
                    className='donut-main-text text-primary-gray-700 dark:text-primary-gray-100 leading-none text-center'
                  >
                    {typeof mainText === 'string'
                      ? mainText
                      : data.findIndex(d => d.label === mainText.label) !== -1
                        ? numberFormattingFunction(
                            data[data.findIndex(d => d.label === mainText.label)].size,
                            'NA',
                            precision,
                            mainText.prefix,
                            mainText.suffix,
                          )
                        : 'NA'}
                  </H2>
                ) : null}
                {subNote ? (
                  <P
                    marginBottom='none'
                    size='base'
                    leading='none'
                    className='donut-sub-note text-primary-gray-700 dark:text-primary-gray-100 text-center font-bold'
                  >
                    {subNote}
                  </P>
                ) : typeof mainText === 'string' || !mainText ? null : (
                  <P
                    size='base'
                    marginBottom='none'
                    leading='none'
                    className='donut-label text-primary-gray-700 dark:text-primary-gray-100 text-center font-bold'
                  >
                    {mainText.label}
                  </P>
                )}
              </div>
            </foreignObject>
          ) : null}
          <circle
            cx={0}
            cy={0}
            r={radius - strokeWidth / 2}
            fill='none'
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <AnimatePresence>
            {pieData(data as any).map((d, i) => (
              <motion.path
                key={i}
                variants={{
                  initial: {
                    pathLength: 0,
                    d: getArc(
                      0,
                      0,
                      radius - strokeWidth / 2,
                      d.startAngle - Math.PI / 2,
                      d.endAngle - Math.PI / 2,
                    ),
                    opacity: mouseOverData
                      ? mouseOverData.label === (d.data as any).label
                        ? 1
                        : 0.3
                      : 1,
                  },
                  whileInView: {
                    pathLength: 1,
                    d: getArc(
                      0,
                      0,
                      radius - strokeWidth / 2,
                      d.startAngle - Math.PI / 2,
                      d.endAngle - Math.PI / 2,
                    ),
                    opacity: mouseOverData
                      ? mouseOverData.label === (d.data as any).label
                        ? 1
                        : 0.3
                      : 1,
                    transition: { duration: animate.duration },
                  },
                }}
                initial='initial'
                animate={isInView ? 'whileInView' : 'initial'}
                exit={{ opacity: 0, transition: { duration: animate.duration } }}
                style={{
                  stroke:
                    colorDomain.indexOf((d.data as any).label) !== -1
                      ? colors[colorDomain.indexOf((d.data as any).label) % colors.length]
                      : Colors.gray,
                  strokeWidth,
                  fill: 'none',
                }}
                onMouseEnter={event => {
                  setMouseOverData(d.data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  onSeriesMouseOver?.(d);
                }}
                onClick={() => {
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (isEqual(mouseClickData, d.data) && resetSelectionOnDoubleClick) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick?.(undefined);
                    } else {
                      setMouseClickData(d.data);
                      if (onSeriesMouseClick) onSeriesMouseClick(d.data);
                    }
                  }
                }}
                onMouseMove={event => {
                  setMouseOverData(d.data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onMouseLeave={() => {
                  setMouseOverData(undefined);
                  setEventX(undefined);
                  setEventY(undefined);
                  onSeriesMouseOver?.(undefined);
                }}
              />
            ))}
          </AnimatePresence>
        </motion.g>
      </motion.svg>
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
        <DetailsModal
          body={detailsOnClick}
          data={mouseClickData}
          setData={setMouseClickData}
          className={classNames?.modal}
        />
      ) : null}
    </>
  );
}
