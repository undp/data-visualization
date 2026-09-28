import { cn } from '@undp/design-system-react/cn';
import { P } from '@undp/design-system-react/Typography';
import { geoPath } from 'd3-geo';
import { scaleSqrt } from 'd3-scale';
import isEqual from 'fast-deep-equal';
import type { FeatureCollection } from 'geojson';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { type RefObject, useRef, useState } from 'react';
import { CsvDownloadButton } from '@/Components/Actions/CsvDownloadButton';
import { ImageDownloadButton } from '@/Components/Actions/ImageDownloadButton';
import { Colors } from '@/Components/ColorPalette';
import { DetailsModal } from '@/Components/Elements/DetailsModal';
import {
  LegendCollapseButton,
  LegendExpandButton,
} from '@/Components/Elements/LegendExpandControls';
import { MapZoomButton } from '@/Components/Elements/MapZoomButton';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { useMapProjection } from '@/hooks/useMapProjection';
import { useMapZoom } from '@/hooks/useMapZoom';
import type {
  AnimateDataType,
  ClassNameObject,
  CustomLayerDataType,
  DotDensityMapDataType,
  MapProjectionTypes,
  StyleObject,
  ZoomInteractionTypes,
} from '@/Types';

interface Props {
  data: DotDensityMapDataType[];

  mapData: FeatureCollection;
  colorDomain: string[];
  mapBorderData?: FeatureCollection;
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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  tooltip?: string | ((_d: any) => React.ReactNode);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseOver?: (_d: any) => void;
  showColorScale: boolean;
  zoomScaleExtend: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedDataPoints?: (string | number)[];
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  onSeriesMouseClick?: (_d: any) => void;
  resetSelectionOnDoubleClick: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
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
  overlayMapData?: FeatureCollection;
  overlayMapBorderColor?: string;
  overlayMapBorderWidth?: number;
  graphDownload?: RefObject<HTMLDivElement | null>;
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  dataDownload: any;
  showUNBorder: boolean;
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
    overlayMapData,
    overlayMapBorderColor,
    overlayMapBorderWidth,
    graphDownload,
    dataDownload,
    mapBorderData,
    showUNBorder,
  } = props;
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const [showLegend, setShowLegend] = useState(
    collapseColorScaleByDefault === undefined ? !(width < 680) : !collapseColorScaleByDefault,
  );

  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);

  const { handleZoom } = useMapZoom({
    mapSvg,
    mapG,
    width,
    height,
    zoomInteraction,
    zoomScaleExtend,
    zoomTranslateExtend,
  });

  const { projection } = useMapProjection({
    mapData,
    width,
    height,
    mapProjection,
    scale,
    centerPoint,
    projectionRotate,
  });
  const isInView = useInView(mapSvg, {
    once: animate.once,
    amount: animate.amount,
  });
  const radiusScale =
    data.filter((d) => d.radius === undefined || d.radius === null).length !== data.length
      ? scaleSqrt().domain([0, maxRadiusValue]).range([0.25, radius]).nice()
      : undefined;

  const pathGenerator = geoPath().projection(projection);

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
            {customLayers.filter((d) => d.position === 'before').map((d) => d.layer)}
            {mapData.features.map((d, i: number) => {
              const path = pathGenerator(d);
              if (!path) return null;
              return (
                <path
                  d={path}
                  // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                  key={i}
                  style={{
                    fill: mapNoDataColor,
                    vectorEffect: 'non-scaling-stroke',
                  }}
                />
              );
            })}
            {showUNBorder &&
              (mapBorderData || mapData)?.features.map((d, i: number) => {
                const path = pathGenerator(d);
                if (!path) return null;
                return (
                  <motion.g
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                    key={i}
                  >
                    <path
                      d={path}
                      style={{
                        stroke: mapBorderColor,
                        strokeWidth:
                          d.properties?.bdytyp === 3 || d.properties?.bdytyp === 4
                            ? Math.max(1, mapBorderWidth)
                            : mapBorderWidth,
                        fill: 'none',
                        vectorEffect: 'non-scaling-stroke',
                        strokeDasharray:
                          d.properties?.bdytyp === 3
                            ? '3 3'
                            : d.properties?.bdytyp === 4
                              ? '2 2'
                              : undefined,
                      }}
                    />
                  </motion.g>
                );
              })}
            {overlayMapData?.features.map((d, i: number) => {
              const path = pathGenerator(d);
              if (!path) return null;
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                <g key={i}>
                  <path
                    d={path}
                    style={{
                      stroke: overlayMapBorderColor || mapBorderColor,
                      strokeWidth: overlayMapBorderWidth || mapBorderWidth + 1,
                      fill: 'none',
                      pointerEvents: 'none',
                      vectorEffect: 'non-scaling-stroke',
                    }}
                  />
                </g>
              );
            })}
            <AnimatePresence>
              {data.map((d) => {
                const color =
                  data.filter((el) => el.color).length === 0
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
                          : highlightedDataPoints
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
                    onMouseEnter={(event) => {
                      setMouseOverData(d);
                      setEventY(event.clientY);
                      setEventX(event.clientX);
                      onSeriesMouseOver?.(d);
                    }}
                    onMouseMove={(event) => {
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
                            data.filter((el) => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(`${d.color}`)],
                          stroke:
                            data.filter((el) => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(`${d.color}`)],
                        },
                        whileInView: {
                          r: !radiusScale ? radius : radiusScale(d.radius || 0),
                          fill:
                            data.filter((el) => el.color).length === 0
                              ? colors[0]
                              : !d.color
                                ? Colors.gray
                                : colors[colorDomain.indexOf(`${d.color}`)],
                          stroke:
                            data.filter((el) => el.color).length === 0
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
                        vectorEffect: 'non-scaling-stroke',
                      }}
                    />
                    {showLabels && d.label ? (
                      <motion.text
                        variants={{
                          initial: {
                            opacity: 0,
                            x: !radiusScale ? radius : radiusScale(d.radius || 0),
                            fill:
                              data.filter((el) => el.color).length === 0
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
                              data.filter((el) => el.color).length === 0
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
                          vectorEffect: 'non-scaling-stroke',
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
            {customLayers.filter((d) => d.position === 'after').map((d) => d.layer)}
          </g>
        </motion.svg>
        {data.filter((el) => el.color).length === 0 || showColorScale === false ? null : (
          <div className={cn('absolute left-4 bottom-4 map-color-legend', classNames?.colorLegend)}>
            {showLegend ? (
              <>
                <LegendCollapseButton setExpanded={setShowLegend} />
                <div className='p-2' style={{ backgroundColor: 'rgba(240,240,240, 0.7)' }}>
                  {colorLegendTitle && colorLegendTitle !== '' ? (
                    <p
                      className='p-0 leading-normal overflow-hidden text-content-primary'
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
                      // biome-ignore lint/a11y/noStaticElementInteractions: interaction for color legend
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                        key={i}
                        className='flex gap-2 items-center'
                        onMouseOver={() => {
                          setSelectedColor(colors[i % colors.length]);
                        }}
                        onFocus={() => {
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
              <LegendExpandButton setExpanded={setShowLegend} />
            )}
          </div>
        )}
        {zoomInteraction === 'button' && <MapZoomButton handleZoom={handleZoom} />}
        {(graphDownload || dataDownload) && (
          <div className='absolute right-4 top-4 flex flex-col image-download-button gap-2'>
            {graphDownload && (
              <ImageDownloadButton nodeID={graphDownload} buttonSmall className='p-1' />
            )}
            {dataDownload && dataDownload.length > 0 && (
              <CsvDownloadButton
                csvData={dataDownload}
                buttonSmall
                headers={Object.keys(dataDownload[0]).map((d) => ({
                  label: d,
                  key: d,
                }))}
                className='p-1'
              />
            )}
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
