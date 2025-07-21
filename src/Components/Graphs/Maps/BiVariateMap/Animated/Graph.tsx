import isEqual from 'fast-deep-equal';
import { useEffect, useRef, useState } from 'react';
import {
  geoAlbersUsa,
  geoEqualEarth,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
} from 'd3-geo';
import { D3ZoomEvent, zoom, ZoomBehavior } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleThreshold } from 'd3-scale';
import sortBy from 'lodash.sortby';
import { parse } from 'date-fns';
import { group } from 'd3-array';
import { Modal, P } from '@undp/design-system-react';
import bbox from '@turf/bbox';
import { centroid } from '@turf/centroid';

import {
  BivariateMapWithDateDataType,
  ClassNameObject,
  MapProjectionTypes,
  StyleObject,
  ZoomInteractionTypes,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { X } from '@/Components/Icons';
import { string2HTML } from '@/Utils/string2HTML';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';

interface Props {
  data: BivariateMapWithDateDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapData: any;
  xDomain: number[];
  yDomain: number[];
  width: number;
  height: number;
  colors: string[][];
  xColorLegendTitle: string;
  yColorLegendTitle: string;
  mapBorderWidth: number;
  mapNoDataColor: string;
  scale: number;
  centerPoint?: [number, number];
  mapBorderColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedIds: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty: string;
  indx: number;
  dateFormat: string;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  showColorScale: boolean;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  zoomInteraction: ZoomInteractionTypes;
  mapProjection: MapProjectionTypes;
  dimmedOpacity: number;
}

export function Graph(props: Props) {
  const {
    data,
    xDomain,
    mapData,
    xColorLegendTitle,
    yDomain,
    yColorLegendTitle,
    width,
    height,
    colors,
    scale,
    centerPoint,
    mapBorderWidth,
    mapNoDataColor,
    mapBorderColor,
    tooltip,
    onSeriesMouseOver,
    zoomScaleExtend,
    zoomTranslateExtend,
    highlightedIds,
    onSeriesMouseClick,
    mapProperty,
    dateFormat,
    indx,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    showColorScale,
    styles,
    classNames,
    mapProjection,
    zoomInteraction,
    dimmedOpacity,
  } = props;
  const groupedData = Array.from(
    group(
      sortBy(data, d => parse(`${d.date}`, dateFormat || 'yyyy', new Date())),
      d => d.date,
    ),
    ([date, values]) => ({
      date,
      values,
    }),
  );
  const [showLegend, setShowLegend] = useState(!(width < 680));
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const xRange = Array.from({ length: xDomain.length }, (_, i) => i);

  const yRange = Array.from({ length: yDomain.length }, (_, i) => i);

  const xScale = scaleThreshold<number, number>().domain(xDomain).range(xRange);
  const yScale = scaleThreshold<number, number>().domain(yDomain).range(yRange);

  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomFilter = (e: D3ZoomEvent<SVGSVGElement, unknown>['sourceEvent']) => {
      if (zoomInteraction === 'noZoom') return false;
      if (zoomInteraction === 'button') return !e.type.includes('wheel');
      const isWheel = e.type === 'wheel';
      const isTouch = e.type.startsWith('touch');
      const isDrag = e.type === 'mousedown' || e.type === 'mousemove';

      if (isTouch) return true;
      if (isWheel) {
        if (zoomInteraction === 'scroll') return true;
        return e.ctrlKey;
      }
      return isDrag && !e.button && !e.ctrlKey;
    };
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent(zoomScaleExtend)
      .translateExtent(
        zoomTranslateExtend || [
          [-20, -20],
          [width + 20, height + 20],
        ],
      )
      .filter(zoomFilter)
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehavior as any);

    zoomRef.current = zoomBehavior;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, zoomInteraction]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bounds = bbox(mapData as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const center = centroid(mapData as any);
  const lonDiff = bounds[2] - bounds[0];
  const latDiff = bounds[3] - bounds[1];
  const scaleX = (((width * 190) / 960) * 360) / lonDiff;
  const scaleY = (((height * 190) / 678) * 180) / latDiff;
  const scaleVar = scale * Math.min(scaleX, scaleY);

  const projection =
    mapProjection === 'mercator'
      ? geoMercator()
          .rotate([0, 0])
          .center(centerPoint || (center.geometry.coordinates as [number, number]))
          .translate([width / 2, height / 2])
          .scale(scaleVar)
      : mapProjection === 'equalEarth'
        ? geoEqualEarth()
            .rotate([0, 0])
            .center(centerPoint || (center.geometry.coordinates as [number, number]))
            .translate([width / 2, height / 2])
            .scale(scaleVar)
        : mapProjection === 'naturalEarth'
          ? geoNaturalEarth1()
              .rotate([0, 0])
              .center(centerPoint || (center.geometry.coordinates as [number, number]))
              .translate([width / 2, height / 2])
              .scale(scaleVar)
          : mapProjection === 'orthographic'
            ? geoOrthographic()
                .rotate([0, 0])
                .center(centerPoint || (center.geometry.coordinates as [number, number]))
                .translate([width / 2, height / 2])
                .scale(scaleVar)
            : geoAlbersUsa()
                .rotate([0, 0])
                .center(centerPoint || (center.geometry.coordinates as [number, number]))
                .translate([width / 2, height / 2])
                .scale(scaleVar);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapSvg.current || !zoomRef.current) return;
    const svg = select(mapSvg.current);
    svg.call(zoomRef.current.scaleBy, direction === 'in' ? 1.2 : 1 / 1.2);
  };
  return (
    <>
      <div className='relative'>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={`${width}px`}
          height={`${height}px`}
          ref={mapSvg}
          direction='ltr'
        >
          <g ref={mapG}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              mapData.features.map((d: any, i: number) => {
                const index = groupedData[indx].values.findIndex(
                  el => el.id === d.properties[mapProperty],
                );
                if (index !== -1) return null;
                return (
                  <g
                    key={i}
                    opacity={
                      selectedColor
                        ? dimmedOpacity
                        : highlightedIds.length !== 0
                          ? highlightedIds.indexOf(d.properties[mapProperty]) !== -1
                            ? 1
                            : dimmedOpacity
                          : 1
                    }
                  >
                    {d.geometry.type === 'MultiPolygon'
                      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        d.geometry.coordinates.map((el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [number, number];
                              if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              key={j}
                              d={masterPath}
                              style={{
                                stroke: mapBorderColor,
                                strokeWidth: mapBorderWidth,
                                fill: mapNoDataColor,
                              }}
                            />
                          );
                        })
                      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        d.geometry.coordinates.map((el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [number, number];
                            if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              key={j}
                              d={path}
                              style={{
                                stroke: mapBorderColor,
                                strokeWidth: mapBorderWidth,
                                fill: mapNoDataColor,
                              }}
                            />
                          );
                        })}
                  </g>
                );
              })
            }
            {groupedData[indx].values.map((d, i) => {
              const index = mapData.features.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (el: any) => d.id === el.properties[mapProperty],
              );
              const xColorCoord = !checkIfNullOrUndefined(d.x) ? xScale(d.x as number) : undefined;
              const yColorCoord = !checkIfNullOrUndefined(d.y) ? yScale(d.y as number) : undefined;
              const color =
                xColorCoord !== undefined && yColorCoord !== undefined
                  ? colors[yColorCoord][xColorCoord]
                  : mapNoDataColor;

              return (
                <g
                  key={i}
                  opacity={
                    selectedColor
                      ? selectedColor === color
                        ? 1
                        : dimmedOpacity
                      : highlightedIds.length !== 0
                        ? highlightedIds.indexOf(d.id) !== -1
                          ? 1
                          : dimmedOpacity
                        : 1
                  }
                  onMouseEnter={event => {
                    setMouseOverData(d);
                    setEventY(event.clientY);
                    setEventX(event.clientX);
                    onSeriesMouseOver?.(d);
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
                    onSeriesMouseOver?.(undefined);
                  }}
                >
                  {index === -1
                    ? null
                    : mapData.features[index].geometry.type === 'MultiPolygon'
                      ? mapData.features[index].geometry.coordinates.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (el: any, j: any) => {
                            let masterPath = '';
                            el.forEach((geo: number[][]) => {
                              let path = ' M';
                              geo.forEach((c: number[], k: number) => {
                                const point = projection([c[0], c[1]]) as [number, number];
                                if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                                else path = `${path}${point[0]} ${point[1]}`;
                              });
                              masterPath += path;
                            });
                            return (
                              <path
                                key={j}
                                d={masterPath}
                                className={`${
                                  color === mapNoDataColor
                                    ? 'stroke-primary-gray-400 dark:stroke-primary-gray-500'
                                    : 'stroke-primary-white dark:stroke-primary-gray-650'
                                }`}
                                style={{
                                  strokeWidth: mapBorderWidth,
                                  fill: color,
                                }}
                              />
                            );
                          },
                        )
                      : mapData.features[index].geometry.coordinates.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (el: any, j: number) => {
                            let path = 'M';
                            el.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [number, number];
                              if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            return (
                              <path
                                key={j}
                                d={path}
                                className={`${
                                  color === mapNoDataColor
                                    ? 'stroke-primary-gray-400 dark:stroke-primary-gray-500'
                                    : 'stroke-primary-white dark:stroke-primary-gray-650'
                                }`}
                                style={{
                                  strokeWidth: mapBorderWidth,
                                  fill: color,
                                }}
                              />
                            );
                          },
                        )}
                </g>
              );
            })}
            {mouseOverData
              ? mapData.features
                  .filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (d: { properties: any }) => d.properties[mapProperty] === mouseOverData.id,
                  )
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((d: any, i: number) => {
                    return (
                      <g key={i}>
                        {d.geometry.type === 'MultiPolygon'
                          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            d.geometry.coordinates.map((el: any, j: any) => {
                              let masterPath = '';
                              el.forEach((geo: number[][]) => {
                                let path = ' M';
                                geo.forEach((c: number[], k: number) => {
                                  const point = projection([c[0], c[1]]) as [number, number];
                                  if (k !== geo.length - 1)
                                    path = `${path}${point[0]} ${point[1]}L`;
                                  else path = `${path}${point[0]} ${point[1]}`;
                                });
                                masterPath += path;
                              });
                              return (
                                <path
                                  key={j}
                                  d={masterPath}
                                  className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
                                  style={{
                                    fill: 'none',
                                    fillOpacity: 0,
                                    strokeWidth: '0.5',
                                  }}
                                />
                              );
                            })
                          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            d.geometry.coordinates.map((el: any, j: number) => {
                              let path = 'M';
                              el.forEach((c: number[], k: number) => {
                                const point = projection([c[0], c[1]]) as [number, number];
                                if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                                else path = `${path}${point[0]} ${point[1]}`;
                              });
                              return (
                                <path
                                  key={j}
                                  d={path}
                                  className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
                                  style={{
                                    fill: 'none',
                                    fillOpacity: 0,
                                    strokeWidth: '0.5',
                                  }}
                                />
                              );
                            })}
                      </g>
                    );
                  })
              : null}
          </g>
        </svg>
        {showColorScale === false ? null : (
          <div className='absolute left-4 bottom-4'>
            {showLegend ? (
              <>
                <div
                  style={{
                    backgroundColor: 'rgba(240,240,240, 0.7)',
                    border: '1px solid var(--gray-400)',
                    borderRadius: '999px',
                    width: '24px',
                    height: '24px',
                    padding: '3px',
                    cursor: 'pointer',
                    zIndex: 10,
                    position: 'absolute',
                    right: '-0.75rem',
                    top: '-0.75rem',
                  }}
                  onClick={() => {
                    setShowLegend(false);
                  }}
                >
                  <X />
                </div>
                <div
                  className='p-2'
                  style={{ backgroundColor: 'rgba(240,240,240, 0.7)', width: '175px' }}
                >
                  <div className='flex gap-1 items-center'>
                    <svg width='136px' viewBox='0 0 136 136' className='shrink-0'>
                      <g>
                        {colors.map((d, i) => (
                          <g key={i} transform={`translate(0,${100 - i * 25})`}>
                            {d.map((el, j) => (
                              <rect
                                key={j}
                                y={1}
                                x={j * 25 + 1}
                                fill={el}
                                width={23}
                                height={23}
                                strokeWidth={selectedColor === el ? 2 : 0.25}
                                style={{ cursor: 'pointer' }}
                                onMouseOver={() => {
                                  setSelectedColor(el);
                                }}
                                onMouseLeave={() => {
                                  setSelectedColor(undefined);
                                }}
                              />
                            ))}
                          </g>
                        ))}
                        <g transform='translate(0,125)'>
                          {xDomain.map((el, j) => (
                            <text key={j} y={10} x={(j + 1) * 25} fontSize={10} textAnchor='middle'>
                              {typeof el === 'string' ? el : numberFormattingFunction(el)}
                            </text>
                          ))}
                        </g>
                        {yDomain.map((el, j) => (
                          <g
                            key={j}
                            transform={`translate(${
                              Math.max(Math.min(xDomain.length + 1, 5), 4) * 25 + 10
                            },${100 - j * 25})`}
                          >
                            <text
                              x={0}
                              transform='rotate(-90)'
                              y={0}
                              fontSize={10}
                              textAnchor='middle'
                            >
                              {typeof el === 'string' ? el : numberFormattingFunction(el)}
                            </text>
                          </g>
                        ))}
                      </g>
                    </svg>
                    <P
                      marginBottom='none'
                      size='xs'
                      className='leading-normal text-center shrink-0'
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        writingMode: 'vertical-rl',
                        height: '8.5rem',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {yColorLegendTitle}
                    </P>
                  </div>
                  <P
                    marginBottom='none'
                    size='xs'
                    className='mt-1 leading-normal text-center'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      width: '8.5rem',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {xColorLegendTitle}
                  </P>
                </div>
              </>
            ) : (
              <button
                type='button'
                className='mb-0 border-0 bg-transparent p-0 self-start'
                onClick={() => {
                  setShowLegend(true);
                }}
              >
                <div className='items-start text-sm font-medium cursor-pointer p-2 mb-0 flex text-primary-black dark:text-primary-gray-300 bg-primary-gray-300 dark:bg-primary-gray-550 border-primary-gray-400 dark:border-primary-gray-500'>
                  Show Legend
                </div>
              </button>
            )}
          </div>
        )}
        {zoomInteraction === 'button' && (
          <div className='absolute left-4 top-4 flex flex-col'>
            <button
              onClick={() => handleZoom('in')}
              className='px-2 py-3.5 border border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-400 dark:bg-primary-gray-600 dark:text-primary-gray-100'
            >
              +
            </button>
            <button
              onClick={() => handleZoom('out')}
              className='px-2 py-3.5 border border-t-0 border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-400 dark:bg-primary-gray-600 dark:text-primary-gray-100'
            >
              –
            </button>
          </div>
        )}
      </div>
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
