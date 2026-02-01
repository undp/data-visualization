import isEqual from 'fast-deep-equal';
import bbox from '@turf/bbox';
import centerOfMass from '@turf/center-of-mass';
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
import { scaleThreshold } from 'd3-scale';
import { P } from '@undp/design-system-react/Typography';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { cn } from '@undp/design-system-react/cn';
import { FeatureCollection } from 'geojson';
import rewind from '@turf/rewind';

import {
  AnimateDataType,
  BivariateMapDataType,
  ClassNameObject,
  CustomLayerDataType,
  MapProjectionTypes,
  StyleObject,
  ZoomInteractionTypes,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { X } from '@/Components/Icons';
import { DetailsModal } from '@/Components/Elements/DetailsModal';

interface Props {
  data: BivariateMapDataType[];
  mapData: FeatureCollection;
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
  zoomInteraction: ZoomInteractionTypes;
  mapProjection: MapProjectionTypes;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseOver?: (_d: any) => void;
  isWorldMap: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedIds: string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSeriesMouseClick?: (_d: any) => void;
  mapProperty: string;
  resetSelectionOnDoubleClick: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  showColorScale: boolean;
  collapseColorScaleByDefault?: boolean;
  styles?: StyleObject;
  classNames?: ClassNameObject;
  animate: AnimateDataType;
  dimmedOpacity: number;
  customLayers: CustomLayerDataType[];
  zoomAndCenterByHighlightedIds: boolean;
  projectionRotate: [number, number] | [number, number, number];
  rewindCoordinatesInMapData: boolean;
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
    resetSelectionOnDoubleClick,
    detailsOnClick,
    showColorScale,
    styles,
    classNames,
    mapProjection,
    zoomInteraction,
    animate,
    dimmedOpacity,
    customLayers,
    collapseColorScaleByDefault,
    zoomAndCenterByHighlightedIds,
    projectionRotate,
    rewindCoordinatesInMapData,
  } = props;
  const formattedMapData = useMemo(() => {
    if (!rewindCoordinatesInMapData) return mapData;

    return rewind(mapData, { reverse: true }) as FeatureCollection;
  }, [mapData, rewindCoordinatesInMapData]);
  const [showLegend, setShowLegend] = useState(
    collapseColorScaleByDefault === undefined ? !(width < 680) : !collapseColorScaleByDefault,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
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
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

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

  const bounds = bbox({
    ...formattedMapData,
    features: zoomAndCenterByHighlightedIds
      ? formattedMapData.features.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any) =>
            (highlightedIds || []).length === 0 ||
            highlightedIds.indexOf(d.properties[mapProperty]) !== -1,
        )
      : formattedMapData.features,
  });

  const center = centerOfMass({
    ...formattedMapData,
    features: zoomAndCenterByHighlightedIds
      ? formattedMapData.features.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any) =>
            (highlightedIds || []).length === 0 ||
            highlightedIds.indexOf(d.properties[mapProperty]) !== -1,
        )
      : formattedMapData.features,
  });
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
  const xRange = Array.from({ length: xDomain.length }, (_, i) => i);

  const yRange = Array.from({ length: yDomain.length }, (_, i) => i);
  const xScale = scaleThreshold<number, number>().domain(xDomain).range(xRange);
  const yScale = scaleThreshold<number, number>().domain(yDomain).range(yRange);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapSvg.current || !zoomRef.current) return;
    const svg = select(mapSvg.current);
    svg.call(zoomRef.current.scaleBy, direction === 'in' ? 1.2 : 1 / 1.2);
  };

  return (
    <>
      <div className='relative'>
        <motion.svg
          viewBox={`0 0 ${width} ${height}`}
          width={`${width}px`}
          height={`${height}px`}
          ref={mapSvg}
          direction='ltr'
        >
          <g ref={mapG}>
            {customLayers.filter(d => d.position === 'before').map(d => d.layer)}
            {formattedMapData.features.map((d, i: number) => {
              if (!d.properties?.[mapProperty]) return null;
              const path = pathGenerator(d);
              if (!path) return null;
              return (
                <motion.g
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
                  <path
                    d={path}
                    style={{
                      stroke: mapBorderColor,
                      strokeWidth: mapBorderWidth,
                      fill: mapNoDataColor,
                    }}
                  />
                </motion.g>
              );
            })}
            <AnimatePresence>
              {data.map(d => {
                const index = formattedMapData.features.findIndex(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (el: any) => d.id === el.properties[mapProperty],
                );
                if (index === -1) return null;
                const path = pathGenerator(formattedMapData.features[index]);
                if (!path) return null;
                const xColorCoord = !checkIfNullOrUndefined(d.x)
                  ? xScale(d.x as number)
                  : undefined;
                const yColorCoord = !checkIfNullOrUndefined(d.y)
                  ? yScale(d.y as number)
                  : undefined;
                const color =
                  xColorCoord !== undefined && yColorCoord !== undefined
                    ? colors[yColorCoord][xColorCoord]
                    : mapNoDataColor;

                return (
                  <motion.g
                    key={d.id}
                    variants={{
                      initial: { opacity: 0 },
                      whileInView: {
                        opacity: selectedColor
                          ? selectedColor === color
                            ? 1
                            : dimmedOpacity
                          : highlightedIds.length !== 0
                            ? highlightedIds.indexOf(d.id) !== -1
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
                    <motion.path
                      key={`${d.id}`}
                      d={path}
                      variants={{
                        initial: { fill: color, opacity: 0 },
                        whileInView: {
                          fill: color,
                          opacity: 1,
                          transition: { duration: animate.duration },
                        },
                      }}
                      initial='initial'
                      animate={isInView ? 'whileInView' : 'initial'}
                      exit={{ opacity: 0, transition: { duration: animate.duration } }}
                      className={`${
                        color === mapNoDataColor
                          ? 'stroke-primary-gray-400 dark:stroke-primary-gray-500'
                          : 'stroke-primary-white dark:stroke-primary-gray-650'
                      }`}
                      style={{
                        stroke: mapBorderColor,
                        strokeWidth: mapBorderWidth,
                      }}
                    />
                  </motion.g>
                );
              })}
            </AnimatePresence>
            {mouseOverData
              ? formattedMapData.features
                  .filter(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (d: { properties: any }) => d.properties[mapProperty] === mouseOverData.id,
                  )
                  .map((d, i) => (
                    <path
                      key={i}
                      d={pathGenerator(d) || ''}
                      className='stroke-primary-gray-700 dark:stroke-primary-gray-300'
                      style={{
                        fill: 'none',
                        fillOpacity: 0,
                        strokeWidth: '0.5',
                      }}
                    />
                  ))
              : null}
            {customLayers.filter(d => d.position === 'after').map(d => d.layer)}
          </g>
        </motion.svg>
        {showColorScale === false ? null : (
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
                <div
                  className='color-legend-box p-2 bg-[rgba(240,240,240,0.7)] dark:bg-[rgba(30,30,30,0.7)]'
                  style={{ width: '175px' }}
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
                              {typeof el === 'string' || el < 1
                                ? el
                                : numberFormattingFunction(el, 'NA')}
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
                              {typeof el === 'string' || el < 1
                                ? el
                                : numberFormattingFunction(el, 'NA')}
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
              className='leading-0 px-2 py-3.5 border text-primary-gray-700 border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-550 dark:bg-primary-gray-600 dark:text-primary-gray-100'
            >
              +
            </button>
            <button
              onClick={() => handleZoom('out')}
              className='leading-0 px-2 py-3.5 border text-primary-gray-700 border-t-0 border-primary-gray-400 bg-primary-gray-200 dark:border-primary-gray-550 dark:bg-primary-gray-600 dark:text-primary-gray-100'
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
