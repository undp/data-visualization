import isEqual from 'fast-deep-equal';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  geoAlbersUsa,
  geoEqualEarth,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
} from 'd3-geo';
import { D3ZoomEvent, zoom, ZoomBehavior } from 'd3-zoom';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import { P } from '@undp/design-system-react/Typography';
import bbox from '@turf/bbox';
import centerOfMass from '@turf/center-of-mass';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react/cn';
import rewind from '@turf/rewind';
import { FeatureCollection } from 'geojson';

import {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  DotDensityMapDataType,
  MapProjectionTypes,
  StyleObject,
  ZoomInteractionTypes,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { Colors } from '@/Components/ColorPalette';
import { X } from '@/Components/Icons';
import { DetailsModal } from '@/Components/Elements/DetailsModal';

interface Props {
  data: DotDensityMapDataType[];

  mapData: FeatureCollection;
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
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  zoomInteraction: ZoomInteractionTypes;
  mapProjection: MapProjectionTypes;
  animate: AnimateDataType;
  dimmedOpacity: number;
  customLayers: CustomLayerDataType[];
  maxRadiusValue: number;
  collapseColorScaleByDefault?: boolean;
  projectionRotate: [number, number] | [number, number, number];
  rewindCoordinatesInMapData: boolean;
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
    resetSelectionOnDoubleClick,
    detailsOnClick,
    styles,
    classNames,
    mapProjection,
    zoomInteraction,
    animate,
    dimmedOpacity,
    customLayers,
    maxRadiusValue,
    collapseColorScaleByDefault,
    projectionRotate,
    rewindCoordinatesInMapData,
  } = props;
  const formattedMapData = useMemo(() => {
    if (!rewindCoordinatesInMapData) return mapData;

    return rewind(mapData, { reverse: true }) as FeatureCollection;
  }, [mapData, rewindCoordinatesInMapData]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const [showLegend, setShowLegend] = useState(
    collapseColorScaleByDefault === undefined ? !(width < 680) : !collapseColorScaleByDefault,
  );
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const mapSvg = useRef<SVGSVGElement>(null);
  const isInView = useInView(mapSvg, {
    once: animate.once,
    amount: animate.amount,
  });
  const mapG = useRef<SVGGElement>(null);
  const radiusScale =
    data.filter(d => d.radius === undefined || d.radius === null).length !== data.length
      ? scaleSqrt().domain([0, maxRadiusValue]).range([0.25, radius]).nice()
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

  const bounds = bbox(formattedMapData);

  const center = centerOfMass(formattedMapData);
  const lonDiff = bounds[2] - bounds[0];
  const latDiff = bounds[3] - bounds[1];
  const scaleX = (((width * 190) / 960) * 360) / lonDiff;
  const scaleY = (((height * 190) / 678) * 180) / latDiff;
  const scaleVar = scale * Math.min(scaleX, scaleY);

  const projection =
    mapProjection === 'mercator'
      ? geoMercator()
          .rotate(projectionRotate)
          .center(centerPoint || (center.geometry.coordinates as [number, number]))
          .translate([width / 2, height / 2])
          .scale(scaleVar)
      : mapProjection === 'equalEarth'
        ? geoEqualEarth()
            .rotate(projectionRotate)
            .center(centerPoint || (center.geometry.coordinates as [number, number]))
            .translate([width / 2, height / 2])
            .scale(scaleVar)
        : mapProjection === 'naturalEarth'
          ? geoNaturalEarth1()
              .rotate(projectionRotate)
              .center(centerPoint || (center.geometry.coordinates as [number, number]))
              .translate([width / 2, height / 2])
              .scale(scaleVar)
          : mapProjection === 'orthographic'
            ? geoOrthographic()
                .rotate(projectionRotate)
                .center(centerPoint || (center.geometry.coordinates as [number, number]))
                .translate([width / 2, height / 2])
                .scale(scaleVar)
            : geoAlbersUsa()
                .rotate(projectionRotate)
                .center(centerPoint || (center.geometry.coordinates as [number, number]))
                .translate([width / 2, height / 2])
                .scale(scaleVar);

  const pathGenerator = geoPath().projection(projection);
  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapSvg.current || !zoomRef.current) return;
    const svg = select(mapSvg.current);
    svg.call(zoomRef.current.scaleBy, direction === 'in' ? 1.2 : 1 / 1.2);
  };

  return (
    <>
      <div className='relative'>
        <motion.svg
          width={`${width}px`}
          height={`${height}px`}
          viewBox={`0 0 ${width} ${height}`}
          ref={mapSvg}
          direction='ltr'
        >
          <g ref={mapG}>
            {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
            {formattedMapData.features.map((d, i: number) => {
              const path = pathGenerator(d);
              if (!path) return null;
              return (
                <path
                  d={path}
                  key={i}
                  style={{
                    stroke: mapBorderColor,
                    strokeWidth: mapBorderWidth,
                    fill: mapNoDataColor,
                  }}
                />
              );
            })}
            <AnimatePresence>
              {data.map(d => {
                const color =
                  data.filter(el => el.color).length === 0
                    ? colors[0]
                    : !d.color
                      ? Colors.gray
                      : colors[colorDomain.indexOf(`${d.color}`)];
                return (
                  <motion.g
                    className='undp-map-dots'
                    key={d.label || `${d.lat}-${d.long}`}
                    variants={{
                      initial: { opacity: 0 },
                      whileInView: {
                        opacity: selectedColor
                          ? selectedColor === color
                            ? 1
                            : dimmedOpacity
                          : highlightedDataPoints.length !== 0
                            ? highlightedDataPoints.indexOf(d.label || '') !== -1
                              ? 1
                              : dimmedOpacity
                            : 1,
                        transition: { duration: animate.duration },
                      },
                    }}
                    initial='initial'
                    animate={isInView ? 'whileInView' : 'initial'}
                    exit={{ opacity: 0, transition: { duration: animate.duration } }}
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
                    transform={`translate(${
                      (projection([d.long, d.lat]) as [number, number])[0]
                    },${(projection([d.long, d.lat]) as [number, number])[1]})`}
                  >
                    <motion.circle
                      cx={0}
                      cy={0}
                      variants={{
                        initial: {
                          r: 0,
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
                        },
                        whileInView: {
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
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ r: 0, transition: { duration: animate.duration } }}
                      style={{
                        fillOpacity: 0.8,
                      }}
                    />
                    {showLabels && d.label ? (
                      <motion.text
                        variants={{
                          initial: {
                            opacity: 0,
                            x: !radiusScale ? radius : radiusScale(d.radius || 0),
                            fill:
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(`${d.color}`)],
                          },
                          whileInView: {
                            opacity: 1,
                            x: !radiusScale ? radius : radiusScale(d.radius || 0),
                            transition: { duration: animate.duration },
                            fill:
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !d.color
                                  ? Colors.gray
                                  : colors[colorDomain.indexOf(`${d.color}`)],
                          },
                        }}
                        initial='initial'
                        animate={isInView ? 'whileInView' : 'initial'}
                        exit={{ opacity: 0, transition: { duration: animate.duration } }}
                        y={0}
                        className={cn('graph-value text-sm', classNames?.graphObjectValues)}
                        style={{
                          textAnchor: 'start',
                          ...(styles?.graphObjectValues || {}),
                        }}
                        dx={4}
                        dy={5}
                      >
                        {d.label}
                      </motion.text>
                    ) : null}
                  </motion.g>
                );
              })}
            </AnimatePresence>
            {customLayers.filter(d => d.position === 'after').map(d => d.layer)}
          </g>
        </motion.svg>
        {data.filter(el => el.color).length === 0 || showColorScale === false ? null : (
          <div className={cn('absolute left-4 bottom-4 map-color-legend', classNames?.colorLegend)}>
            {showLegend ? (
              <>
                <div
                  className='color-legend-close-button bg-[rgba(240,240,240,0.7)] dark:bg-[rgba(30,30,30,0.7)] border border-[var(--gray-400)] rounded-full w-6 h-6 p-[3px] cursor-pointer z-10 absolute right-[-0.75rem] top-[-0.75rem]'
                  onClick={() => {
                    setShowLegend(false);
                  }}
                >
                  <X />
                </div>
                <div className='p-2' style={{ backgroundColor: 'rgba(240,240,240, 0.7)' }}>
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
                <div className='show-color-legend-button items-start text-sm font-medium cursor-pointer p-2 mb-0 flex text-primary-black dark:text-primary-gray-300 bg-primary-gray-300 dark:bg-primary-gray-600 border-primary-gray-400 dark:border-primary-gray-500'>
                  Show Legend
                </div>
              </button>
            )}
          </div>
        )}
        {zoomInteraction === 'button' && (
          <div className='absolute left-4 top-4 flex flex-col zoom-buttons'>
            <button
              onClick={() => handleZoom('in')}
              className='leading-0 px-2 py-3.5 text-primary-gray-700 border border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-550 dark:bg-primary-gray-600 dark:text-primary-gray-100'
            >
              +
            </button>
            <button
              onClick={() => handleZoom('out')}
              className='leading-0 px-2 py-3.5 text-primary-gray-700 border border-t-0 border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-550 dark:bg-primary-gray-600 dark:text-primary-gray-100'
            >
              –
            </button>
          </div>
        )}
      </div>
      {detailsOnClick && mouseClickData !== undefined ? (
        <DetailsModal
          body={detailsOnClick}
          data={mouseClickData}
          setData={setMouseClickData}
          className={classNames?.modal}
        />
      ) : null}
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
    </>
  );
}
