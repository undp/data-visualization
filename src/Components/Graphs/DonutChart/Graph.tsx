import { H2, P } from '@undp/design-system-react/Typography';
import { pie } from 'd3-shape';
import isEqual from 'fast-deep-equal';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { isValidElement, type ReactElement, useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type { AnimateDataType, ClassNameObject, DonutChartDataType, StyleObject } from '@/Types';
import { getArc } from '@/Utils/getArc';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  mainText?:
    | string
    | {
        label: string;
        suffix?: string;
        prefix?: string;
        locale?: string;
        padZeros?: boolean;
        precision?: number;
      }
    | ReactElement;
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  colorDomain: string[];
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: AnimateDataType;
  trackColor: string;
  naLabel: string;
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
    animate,
    trackColor,
    naLabel,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  const pieData = pie()
    .sort(null)
    .startAngle(0)
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    .value((d: any) => d.size);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
                  isValidElement(mainText) ? (
                    mainText
                  ) : (
                    <H2
                      marginBottom='none'
                      className='donut-main-text text-primary-gray-700 dark:text-primary-gray-100 leading-none text-center'
                    >
                      {typeof mainText === 'string'
                        ? mainText
                        : data.findIndex((d) => d.label === mainText.label) !== -1
                          ? numberFormattingFunction(
                              data[data.findIndex((d) => d.label === mainText.label)].size,
                              naLabel,
                              mainText.precision,
                              mainText.prefix,
                              mainText.suffix,
                              mainText.locale,
                              mainText.padZeros,
                            )
                          : naLabel}
                    </H2>
                  )
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
                ) : typeof mainText === 'string' || !mainText || isValidElement(mainText) ? null : (
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
            {/* biome-ignore lint/suspicious/noExplicitAny: undefined data type */}
            {pieData(data as any).map((d, i) => (
              <motion.path
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
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
                      ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        mouseOverData.label === (d.data as any).label
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
                      ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        mouseOverData.label === (d.data as any).label
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
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    colorDomain.indexOf((d.data as any).label) !== -1
                      ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        colors[colorDomain.indexOf((d.data as any).label) % colors.length]
                      : Colors.gray,
                  strokeWidth,
                  fill: 'none',
                }}
                onMouseEnter={(event) => {
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
                onMouseMove={(event) => {
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
