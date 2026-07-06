import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';
import { stratify, treemap } from 'd3-hierarchy';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Colors } from '@/Components/ColorPalette';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import { Tooltip } from '@/Components/Elements/Tooltip';
import type {
  AnimateDataType,
  ClassNameObject,
  Languages,
  StyleObject,
  TreeMapDataType,
} from '@/Types';
import { getTextColorBasedOnBgColor } from '@/Utils/getTextColorBasedOnBgColor';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  showLabels: boolean | ((_d: any) => React.ReactNode);
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  language?: Languages;
  animate: AnimateDataType;
  dimmedOpacity: number;
  precision: number;
  locale: string;
  padZeros: boolean;
  minLabelWidth: number;
  minLabelHeight: number;
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
    animate,
    dimmedOpacity,
    precision,
    locale,
    padZeros,
    minLabelWidth,
    minLabelHeight,
  } = props;
  const svgRef = useRef(null);
  const isInView = useInView(svgRef, {
    once: animate.once,
    amount: animate.amount,
  });
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    .id((d: any) => d.id)
    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
    .parentId((d: any) => d.parent)(treeMapData);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  treeData.sum((d: any) => d.value);
  const treeMapVizData = treemap().size([graphWidth, graphHeight]).padding(2)(treeData);

  return (
    <>
      <motion.svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
        ref={svgRef}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AnimatePresence>
            {treeMapVizData.children?.map((d) => {
              return (
                <motion.g
                  className='undp-viz-g-with-hover'
                  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                  key={(d.data as any).id}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: d.x0,
                      y: d.y0,
                    },
                    whileInView: {
                      opacity: selectedColor
                        ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                          (d.data as any).data.color
                          ? colors[
                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              colorDomain.indexOf((d.data as any).data.color)
                            ] === selectedColor
                            ? 1
                            : dimmedOpacity
                          : dimmedOpacity
                        : highlightedDataPoints
                          ? // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                            highlightedDataPoints.indexOf((d.data as any).id) !== -1
                            ? 0.85
                            : dimmedOpacity
                          : 0.85,
                      x: d.x0,
                      y: d.y0,
                      transition: { duration: animate.duration },
                    },
                  }}
                  initial='initial'
                  animate={isInView ? 'whileInView' : 'initial'}
                  exit={{ opacity: 0, transition: { duration: animate.duration } }}
                  onMouseEnter={(event) => {
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    setMouseOverData((d.data as any).data);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    onSeriesMouseOver?.((d.data as any).data);
                  }}
                  onClick={() => {
                    if (onSeriesMouseClick || detailsOnClick) {
                      if (
                        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        mouseClickData === (d.data as any).id &&
                        resetSelectionOnDoubleClick
                      ) {
                        setMouseClickData(undefined);
                        onSeriesMouseClick?.(undefined);
                      } else {
                        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        setMouseClickData((d.data as any).id);
                        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                        onSeriesMouseClick?.((d.data as any).data);
                      }
                    }
                  }}
                  onMouseMove={(event) => {
                    // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                    setMouseOverData((d.data as any).data);
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
                  <motion.rect
                    x={0}
                    y={0}
                    exit={{
                      width: 0,
                      height: 0,
                      opacity: 0,
                      transition: { duration: animate.duration },
                    }}
                    variants={{
                      initial: {
                        width: 0,
                        height: 0,
                        fill:
                          data.filter((el) => el.color).length === 0
                            ? colors[0]
                            : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              !(d.data as any).data.color
                              ? Colors.gray
                              : colors[
                                  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                  colorDomain.indexOf((d.data as any).data.color)
                                ],
                      },
                      whileInView: {
                        width: d.x1 - d.x0,
                        height: d.y1 - d.y0,
                        fill:
                          data.filter((el) => el.color).length === 0
                            ? colors[0]
                            : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                              !(d.data as any).data.color
                              ? Colors.gray
                              : colors[
                                  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                  colorDomain.indexOf((d.data as any).data.color)
                                ],
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                  />
                  {d.x1 - d.x0 >= minLabelWidth &&
                  d.y1 - d.y0 >= minLabelHeight &&
                  (showLabels || showValues) ? (
                    <motion.g
                      variants={{
                        initial: { opacity: 0 },
                        whileInView: {
                          opacity: 1,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                    >
                      <foreignObject y={0} x={0} width={d.x1 - d.x0} height={d.y1 - d.y0}>
                        <div
                          className='flex flex-col gap-0.5 p-2 w-full'
                          style={{
                            color: getTextColorBasedOnBgColor(
                              data.filter((el) => el.color).length === 0
                                ? colors[0]
                                : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                  !(d.data as any).data.color
                                  ? Colors.gray
                                  : colors[
                                      // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                      colorDomain.indexOf((d.data as any).data.color)
                                    ],
                            ),
                          }}
                        >
                          {showLabels &&
                            (showLabels instanceof Function ? (
                              showLabels(d)
                            ) : (
                              <P
                                marginBottom='none'
                                size='sm'
                                leading='none'
                                className={cn(
                                  'w-full treemap-label',
                                  language === 'ar' || language === 'he'
                                    ? 'text-right'
                                    : 'text-left',
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
                                    data.filter((el) => el.color).length === 0
                                      ? colors[0]
                                      : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                        !(d.data as any).data.color
                                        ? Colors.gray
                                        : colors[
                                            colorDomain.indexOf(
                                              // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                              (d.data as any).data.color,
                                            )
                                          ],
                                  ),
                                  ...(styles?.graphObjectValues || {}),
                                }}
                              >
                                {
                                  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                  (d.data as any).id
                                }
                              </P>
                            ))}
                          {showValues && (
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
                                  data.filter((el) => el.color).length === 0
                                    ? colors[0]
                                    : // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                      !(d.data as any).data.color
                                      ? Colors.gray
                                      : colors[
                                          colorDomain.indexOf(
                                            // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                            (d.data as any).data.color,
                                          )
                                        ],
                                ),
                                ...(styles?.graphObjectValues || {}),
                              }}
                            >
                              {numberFormattingFunction(
                                // biome-ignore lint/suspicious/noExplicitAny: undefined data type
                                (d.data as any).value,
                                undefined,
                                precision,
                                prefix,
                                suffix,
                                locale,
                                padZeros,
                              )}
                            </P>
                          )}
                        </div>
                      </foreignObject>
                    </motion.g>
                  ) : null}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>
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
