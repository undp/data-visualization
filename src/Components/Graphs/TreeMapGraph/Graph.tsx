import { stratify, treemap } from 'd3-hierarchy';
import { useState } from 'react';
import { P, Modal, cn } from '@undp/design-system-react';

import { ClassNameObject, Languages, StyleObject, TreeMapDataType } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  language?: Languages;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    leftMargin,
    width,
    height,
    colorDomain,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    selectedColor,
    showValues,
    suffix,
    prefix,
    highlightedDataPoints,
    onSeriesMouseClick,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    language,
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

  const treeMapData = [
    {
      id: 'root',
      parent: undefined,
      value: undefined,
      data: undefined,
    },
    ...data.map((d: TreeMapDataType) => ({
      id: d.label,
      value: d.size,
      parent: 'root',
      data: d,
    })),
  ];
  const treeData = stratify()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .id((d: any) => d.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .parentId((d: any) => d.parent)(treeMapData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  treeData.sum((d: any) => d.value);
  const treeMapVizData = treemap().size([graphWidth, graphHeight]).padding(2)(treeData);

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {treeMapVizData.children?.map((d, i) => {
            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={
                  selectedColor
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (d.data as any).data.color
                      ? colors[
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          colorDomain.indexOf((d.data as any).data.color)
                        ] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : highlightedDataPoints.length !== 0
                      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        highlightedDataPoints.indexOf((d.data as any).id) !== -1
                        ? 0.85
                        : 0.3
                      : 0.85
                }
                transform={`translate(${d.x0},${d.y0})`}
                onMouseEnter={event => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setMouseOverData((d.data as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSeriesMouseOver?.((d.data as any).data);
                }}
                onClick={() => {
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      mouseClickData === (d.data as any).id &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick?.(undefined);
                    } else {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setMouseClickData((d.data as any).id);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onSeriesMouseClick?.((d.data as any).data);
                    }
                  }
                }}
                onMouseMove={event => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setMouseOverData((d.data as any).data);
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
                <rect
                  key={i}
                  x={0}
                  y={0}
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          !(d.data as any).data.color
                          ? Colors.gray
                          : colors[
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              colorDomain.indexOf((d.data as any).data.color)
                            ],
                  }}
                />
                {d.x1 - d.x0 > 50 && d.y1 - d.y0 > 25 && (showLabels || showValues) ? (
                  <foreignObject y={0} x={0} width={d.x1 - d.x0} height={d.y1 - d.y0}>
                    <div
                      className='flex flex-col gap-0.5 p-2 w-full'
                      style={{
                        color: getTextColorBasedOnBgColor(
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              !(d.data as any).data.color
                              ? Colors.gray
                              : colors[
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  colorDomain.indexOf((d.data as any).data.color)
                                ],
                        ),
                      }}
                    >
                      {showLabels ? (
                        <P
                          marginBottom='none'
                          size='sm'
                          leading='none'
                          className={cn(
                            'w-full treemap-label',
                            language === 'ar' || language === 'he' ? 'text-right' : 'text-left',
                            classNames?.graphObjectValues,
                          )}
                          style={{
                            WebkitLineClamp:
                              d.y1 - d.y0 > 50
                                ? d.y1 - d.y0 > 100
                                  ? d.y1 - d.y0 > 150
                                    ? undefined
                                    : 3
                                  : 2
                                : 1,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  !(d.data as any).data.color
                                  ? Colors.gray
                                  : colors[
                                      colorDomain.indexOf(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (d.data as any).data.color,
                                      )
                                    ],
                            ),
                            ...(styles?.graphObjectValues || {}),
                          }}
                        >
                          {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (d.data as any).id
                          }
                        </P>
                      ) : null}
                      {showValues ? (
                        <P
                          marginBottom='none'
                          size='sm'
                          leading='none'
                          className={cn(
                            'w-full font-bold treemap-value',
                            language === 'ar' || language === 'he' ? 'text-right' : 'text-left',
                            classNames?.graphObjectValues,
                          )}
                          style={{
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                  !(d.data as any).data.color
                                  ? Colors.gray
                                  : colors[
                                      colorDomain.indexOf(
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (d.data as any).data.color,
                                      )
                                    ],
                            ),
                            ...(styles?.graphObjectValues || {}),
                          }}
                        >
                          {numberFormattingFunction(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (d.data as any).value,
                            prefix,
                            suffix,
                          )}
                        </P>
                      ) : null}
                    </div>
                  </foreignObject>
                ) : null}
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
