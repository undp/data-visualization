/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'fast-deep-equal';
import { pie, arc } from 'd3-shape';
import { useState } from 'react';
import { H2, Modal, P } from '@undp/design-system-react';

import { ClassNameObject, DonutChartDataType, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  mainText?: string | { label: string; suffix?: string; prefix?: string };
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
  tooltip?: string;

  onSeriesMouseOver?: (_d: any) => void;

  onSeriesMouseClick?: (_d: any) => void;
  colorDomain: string[];
  resetSelectionOnDoubleClick: boolean;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
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
  } = props;
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
      <svg
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        direction='ltr'
      >
        <g transform={`translate(${radius} ${radius})`}>
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
          {pieData(data as any).map((d, i) => (
            <path
              key={i}
              d={
                arc()({
                  innerRadius: radius - strokeWidth,
                  outerRadius: radius,
                  startAngle: d.startAngle,
                  endAngle: d.endAngle,
                }) as string
              }
              style={{
                fill:
                  colorDomain.indexOf((d.data as any).label) !== -1
                    ? colors[colorDomain.indexOf((d.data as any).label) % colors.length]
                    : Colors.gray,
                opacity: mouseOverData
                  ? mouseOverData.label === (d.data as any).label
                    ? 1
                    : 0.3
                  : 1,
              }}
              onMouseEnter={event => {
                setMouseOverData(d.data);
                setEventY(event.clientY);
                setEventX(event.clientX);
                if (onSeriesMouseOver) {
                  onSeriesMouseOver(d);
                }
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
                if (onSeriesMouseOver) {
                  onSeriesMouseOver(undefined);
                }
              }}
            />
          ))}
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
