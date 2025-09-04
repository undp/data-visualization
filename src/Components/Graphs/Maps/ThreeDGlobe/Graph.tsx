/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeMethods } from 'react-globe.gl';
import isEqual from 'fast-deep-equal';
import { useEffect, useRef, useState } from 'react';
import { scaleOrdinal, scaleThreshold } from 'd3-scale';
import * as THREE from 'three';
import { Modal } from '@undp/design-system-react/Modal';
import { P } from '@undp/design-system-react/Typography';

import { ChoroplethMapDataType, ClassNameObject, StyleObject } from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { X } from '@/Components/Icons';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  width: number;
  data: ChoroplethMapDataType[];
  autoRotate: number;
  enableZoom: boolean;
  categorical: boolean;
  colorDomain: number[] | string[];
  colors: string[];
  height: number;
  globeMaterial?: THREE.Material;
  polygonData: any;
  mapProperty: string;
  mapBorderColor: string;
  atmosphereColor: string;
  tooltip?: string | ((_d: any) => React.ReactNode);
  styles?: StyleObject;
  classNames?: ClassNameObject;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  mapNoDataColor: string;
  centerPoint: [number, number];
  colorLegendTitle?: string;
  showColorScale: boolean;
  hoverStrokeColor: string;
  detailsOnClick?: string | ((_d: any) => React.ReactNode);
  resetSelectionOnDoubleClick: boolean;
  highlightedIds: string[];
  scale: number;
  globeOffset: [number, number];
  polygonAltitude: number;
  centerLng: number;
  centerLat: number;
  atmosphereAltitude: number;
  globeCurvatureResolution: number;
  lightColor: string;
}

function Graph(props: Props) {
  const {
    width,
    autoRotate,
    data,
    enableZoom,
    categorical,
    colorDomain,
    colors,
    globeMaterial,
    height,
    polygonData,
    mapProperty,
    mapBorderColor,
    atmosphereColor,
    tooltip,
    styles,
    classNames,
    mapNoDataColor,
    centerPoint,
    colorLegendTitle,
    showColorScale,
    hoverStrokeColor,
    detailsOnClick,
    onSeriesMouseClick,
    onSeriesMouseOver,
    resetSelectionOnDoubleClick,
    highlightedIds,
    scale,
    globeOffset,
    polygonAltitude,
    centerLng,
    centerLat,
    atmosphereAltitude,
    globeCurvatureResolution,
    lightColor,
  } = props;
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [showLegend, setShowLegend] = useState(!(width < 680));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseOverData, setMouseOverData] = useState<ChoroplethMapDataType | undefined>(undefined);
  const colorScale = categorical
    ? scaleOrdinal<number | string, string>().domain(colorDomain).range(colors)
    : scaleThreshold<number, string>()
        .domain(colorDomain as number[])
        .range(colors);
  useEffect(() => {
    if (globeEl?.current) {
      globeEl.current.controls().autoRotate = autoRotate === 0 ? false : true;
      globeEl.current.controls().enableZoom = enableZoom;
      globeEl.current.controls().autoRotateSpeed = autoRotate;
    }
  }, [autoRotate, enableZoom]);
  useEffect(() => {
    if (globeEl.current) {
      if (mouseOverData) {
        globeEl.current.controls().autoRotate = false;
      } else {
        globeEl.current.controls().autoRotate = autoRotate === 0 ? false : true;
      }
    }
  }, [mouseOverData, autoRotate]);

  useEffect(() => {
    const canvas = globeEl.current?.renderer().domElement;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: centerLat, lng: centerLng, altitude: scale }, 1000);
    }
  }, [scale, centerLng, centerLat]);
  const materials =
    globeMaterial ||
    new THREE.MeshPhysicalMaterial({
      color: '#FFF',
      roughness: 0.5,
      reflectivity: 1.2,
    });
  return (
    <div className='relative'>
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        globeOffset={globeOffset}
        lineHoverPrecision={0}
        polygonsData={polygonData}
        polygonAltitude={(polygon: any) =>
          highlightedIds.includes(polygon?.properties?.[mapProperty])
            ? 0.1
            : polygon?.properties?.[mapProperty] === mouseOverData?.id
              ? 0.01
              : polygonAltitude
        }
        polygonCapColor={(polygon: any) => {
          const id = polygon?.properties?.[mapProperty];
          const val = data.find(el => el.id === id)?.x;
          if (val !== undefined && val !== null) {
            return colorScale(val as any);
          }
          return mapNoDataColor;
        }}
        polygonSideColor={(polygon: any) => {
          const id = polygon?.properties?.[mapProperty];
          const val = data.find(el => el.id === id)?.x;
          const color = val !== undefined && val !== null ? colorScale(val as any) : mapNoDataColor;
          return highlightedIds.includes(polygon?.properties?.[mapProperty])
            ? color
            : 'rgba(100,100,100,0)';
        }}
        polygonStrokeColor={(polygon: any) =>
          polygon?.properties?.[mapProperty] === mouseOverData?.id
            ? hoverStrokeColor
            : mapBorderColor
        }
        onPolygonClick={(polygon: any) => {
          const clickedData = polygon?.properties?.[mapProperty]
            ? data.find(el => el.id === polygon?.properties?.[mapProperty])
            : undefined;
          if (onSeriesMouseClick || detailsOnClick) {
            if (
              isEqual(mouseClickData, clickedData) &&
              resetSelectionOnDoubleClick &&
              clickedData
            ) {
              setMouseClickData(undefined);
              onSeriesMouseClick?.(undefined);
            } else {
              setMouseClickData(clickedData);
              onSeriesMouseClick?.(clickedData);
            }
          }
          setMouseClickData(clickedData);
          onSeriesMouseClick?.(clickedData);
        }}
        onPolygonHover={(polygon: any) => {
          const hoverData = polygon?.properties?.[mapProperty]
            ? data.find(el => el.id === polygon?.properties?.[mapProperty])
            : undefined;
          setMouseOverData(hoverData);
          onSeriesMouseOver?.(hoverData);
        }}
        atmosphereColor={atmosphereColor}
        atmosphereAltitude={atmosphereAltitude}
        globeCurvatureResolution={globeCurvatureResolution}
        globeMaterial={materials}
        backgroundColor='rgba(0, 0, 0, 0)'
        polygonsTransitionDuration={100}
        onGlobeReady={() => {
          if (globeEl.current) {
            globeEl.current.pointOfView({
              lat: centerPoint[0],
              lng: centerPoint[1],
            });
            const scene = globeEl.current.scene();
            setTimeout(() => {
              scene.children
                .filter(d => d.type === 'DirectionalLight')
                .map(d => {
                  scene.remove(d);
                });
              const ambientLight = new THREE.AmbientLight(lightColor, 0.2);
              scene.add(ambientLight);

              const polygons = scene.children[3]?.children[0]?.children[4]?.children || [];
              polygons.forEach(d => {
                const line = d.children[1];
                line.renderOrder = 2;
              });
            }, 300);
            const light = new THREE.DirectionalLight(0xffffff, 0.1);
            const camera = globeEl.current.camera();
            light.position.set(0, 0, 1);
            camera.add(light);
            scene.add(camera);
            scene.fog = new THREE.Fog(lightColor, 150, 300);
          }
        }}
      />
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
                style={{
                  backgroundColor: 'rgba(240,240,240, 0.7)',
                  width: categorical ? undefined : '340px',
                }}
              >
                {colorLegendTitle && colorLegendTitle !== '' ? (
                  <P
                    size='xs'
                    marginBottom='xs'
                    className='p-0 leading-normal overflow-hidden text-primary-gray-700 dark:text-primary-gray-300'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {colorLegendTitle}
                  </P>
                ) : null}
                {!categorical ? (
                  <svg width='100%' viewBox='0 0 320 30' direction='ltr'>
                    <g>
                      {colorDomain.map((d, i) => (
                        <g key={i} className='cursor-pointer'>
                          <rect
                            x={(i * 320) / colors.length + 1}
                            y={1}
                            width={320 / colors.length - 2}
                            height={8}
                            style={{
                              fill: colors[i],
                              stroke: colors[i],
                            }}
                          />
                          <text
                            x={((i + 1) * 320) / colors.length}
                            y={25}
                            className='fill-primary-gray-700 dark:fill-primary-gray-300 text-xs'
                            style={{ textAnchor: 'middle' }}
                          >
                            {numberFormattingFunction(d as number, 'NA')}
                          </text>
                        </g>
                      ))}
                      <g>
                        <rect
                          x={(colorDomain.length * 320) / colors.length + 1}
                          y={1}
                          width={320 / colors.length - 2}
                          height={8}
                          style={{
                            fill: colors[colorDomain.length],
                            stroke: colors[colorDomain.length],
                          }}
                        />
                      </g>
                    </g>
                  </svg>
                ) : (
                  <div className='flex flex-col gap-3'>
                    {colorDomain.map((d, i) => (
                      <div key={i} className='flex gap-2 items-center'>
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
                )}
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
      {mouseOverData && tooltip ? (
        <Tooltip
          data={mouseOverData}
          body={tooltip}
          xPos={mousePos.x}
          yPos={mousePos.y}
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
    </div>
  );
}

export default Graph;
