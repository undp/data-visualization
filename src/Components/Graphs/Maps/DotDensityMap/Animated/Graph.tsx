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
import { scaleSqrt } from 'd3-scale';
import maxBy from 'lodash.maxby';
import { parse } from 'date-fns';
import sortBy from 'lodash.sortby';
import { group } from 'd3-array';
import { AnimatePresence, motion } from 'motion/react';
import { Modal, P } from '@undp/design-system-react';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';

import {
  ClassNameObject,
  DotDensityMapWithDateDataType,
  MapProjectionTypes,
  StyleObject,
  ZoomInteractionTypes,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { string2HTML } from '@/Utils/string2HTML';
import { X } from '@/Components/Icons';

interface Props {
  data: DotDensityMapWithDateDataType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapData: any;
  colorDomain: string[];
  width: number;
  height: number;
  scale: number;
  centerPoint?: [number, number];
  colors: string[];
  colorLegendTitle?: string;
  radius: number;
  mapBorderWidth: number;
  mapNoDataColor: string;
  showLabels: boolean;
  mapBorderColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip?: string | ((_d: any) => React.ReactNode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  showColorScale: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedDataPoints: (string | number)[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  indx: number;
  dateFormat: string;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  zoomInteraction: ZoomInteractionTypes;
  mapProjection: MapProjectionTypes;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    mapData,
    colorLegendTitle,
    colorDomain,
    radius,
    height,
    width,
    scale,
    centerPoint,
    tooltip,
    showLabels,
    mapBorderWidth,
    mapBorderColor,
    mapNoDataColor,
    onSeriesMouseOver,
    showColorScale,
    zoomScaleExtend,
    zoomTranslateExtend,
    highlightedDataPoints,
    onSeriesMouseClick,
    dateFormat,
    indx,
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    mapProjection,
    zoomInteraction,
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
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [showLegend, setShowLegend] = useState(!(width < 680));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const radiusScale =
    data.filter(d => d.radius === undefined).length !== data.length
      ? scaleSqrt()
          .domain([0, maxBy(data, 'radius')?.radius as number])
          .range([0.25, radius])
          .nice()
      : undefined;

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
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          ref={mapSvg}
          direction='ltr'
        >
          <g ref={mapG}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              mapData.features.map((d: any, i: number) => {
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
            <AnimatePresence>
              {groupedData[indx].values.map((d, i) => {
                const color =
                  data.filter(el => el.color).length === 0
                    ? colors[0]
                    : !d.color
                      ? Colors.gray
                      : colors[colorDomain.indexOf(`${d.color}`)];
                return (
                  <g
                    key={i}
                    opacity={
                      selectedColor
                        ? selectedColor === color
                          ? 1
                          : 0.3
                        : highlightedDataPoints.length !== 0
                          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            highlightedDataPoints.indexOf((d.data as any).id) !== -1
                            ? 1
                            : 0.3
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
                      cx={(projection([d.long, d.lat]) as [number, number])[0]}
                      cy={(projection([d.long, d.lat]) as [number, number])[1]}
                      style={{ fillOpacity: 0.8 }}
                      animate={{
                        r: !radiusScale ? radius : radiusScale(d.radius || 0),
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
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    {showLabels && d.label ? (
                      <motion.text
                        x={
                          !radiusScale
                            ? (projection([d.long, d.lat]) as [number, number])[0] + radius
                            : (projection([d.long, d.lat]) as [number, number])[0] +
                              radiusScale(d.radius || 0)
                        }
                        y={(projection([d.long, d.lat]) as [number, number])[1]}
                        className='fill-primary-gray-600 dark:fill-primary-gray-300 text-sm'
                        style={{ textAnchor: 'start' }}
                        dx={4}
                        dy={5}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {d.label}
                      </motion.text>
                    ) : null}
                  </g>
                );
              })}
            </AnimatePresence>
          </g>
        </svg>
        {data.filter(el => el.color).length === 0 || showColorScale === false ? null : (
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
                <div className='p-2' style={{ backgroundColor: 'rgba(240,240,240, 0.5' }}>
                  {colorLegendTitle && colorLegendTitle !== '' ? (
                    <p
                      className='p-0 leading-normal overflow-hidden text-primary-gray-700 dark:text-primary-gray-300'
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {colorLegendTitle}
                    </p>
                  ) : null}
                  <div className='flex flex-col gap-3'>
                    {colorDomain.map((d, i) => (
                      <div
                        key={i}
                        className='flex gap-2 items-center'
                        onMouseOver={() => {
                          setSelectedColor(colors[i % colors.length]);
                        }}
                        onMouseLeave={() => {
                          setSelectedColor(undefined);
                        }}
                      >
                        <div
                          className='w-2 h-2 rounded-full'
                          style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <P size='sm' marginBottom='none' leading='none'>
                          {d}
                        </P>
                      </div>
                    ))}
                  </div>
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
