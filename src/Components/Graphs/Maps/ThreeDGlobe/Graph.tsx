/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeMethods } from 'react-globe.gl';
import isEqual from 'fast-deep-equal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { scaleOrdinal, scaleThreshold } from 'd3-scale';
import * as THREE from 'three';
import { Modal } from '@undp/design-system-react/Modal';
import { P } from '@undp/design-system-react/Typography';

import {
  ChoroplethMapDataType,
  ClassNameObject,
  FogDataType,
  LightConfig,
  StyleObject,
} from '@/Types';
import { Tooltip } from '@/Components/Elements/Tooltip';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { X } from '@/Components/Icons';
import { string2HTML } from '@/Utils/string2HTML';
import { getCentroidCoordinates } from '@/Utils/getCentroidCoordinates';

interface Props {
  width: number;
  data: ChoroplethMapDataType[];
  autoRotate: number;
  enableZoom: boolean;
  categorical: boolean;
  colorDomain: (number | string)[];
  colors: string[];
  height: number;
  globeMaterial?: THREE.Material;
  lights: LightConfig[];
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
  fogSettings?: FogDataType;
  highlightedAltitude: number;
  selectedId?: string;
  collapseColorScaleByDefault?: boolean;
}

function createLightFromConfig(config: LightConfig): THREE.Light {
  let light: THREE.Light;

  switch (config.type) {
    case 'ambient':
      light = new THREE.AmbientLight(config.color, config.intensity);
      break;
    case 'directional':
      light = new THREE.DirectionalLight(config.color, config.intensity);
      if (config.position) {
        if (config.position === 'camera') light.position.set(0, 0, 0);
        else light.position.set(config.position.x, config.position.y, config.position.z);
      }
      if (config.target || config.position === 'camera') {
        (light as THREE.SpotLight).target.position.set(
          config.target?.x || 0,
          config.target?.y || 0,
          config.target?.z === undefined ? -1 : config.target.z,
        );
      }
      if (config.castShadow) {
        (light as THREE.DirectionalLight).castShadow = true;
        if (config.shadow) {
          (light as THREE.DirectionalLight).shadow.mapSize.width = config.shadow.mapSize.width;
          (light as THREE.DirectionalLight).shadow.mapSize.height = config.shadow.mapSize.height;
          (light as THREE.DirectionalLight).shadow.camera.near = config.shadow.camera.near;
          (light as THREE.DirectionalLight).shadow.camera.far = config.shadow.camera.far;
        }
      }
      break;
    case 'point':
      light = new THREE.PointLight(
        config.color,
        config.intensity,
        config.distance || 0,
        config.decay || 2,
      );
      if (config.position) {
        if (config.position === 'camera') light.position.set(0, 0, 0);
        else light.position.set(config.position.x, config.position.y, config.position.z);
      }
      break;
    case 'spot':
      light = new THREE.SpotLight(
        config.color,
        config.intensity,
        config.distance || 0,
        config.angle || Math.PI / 3,
        config.penumbra || 0,
        config.decay || 2,
      );
      if (config.position) {
        if (config.position === 'camera') light.position.set(0, 0, 0);
        else light.position.set(config.position.x, config.position.y, config.position.z);
      }
      if (config.target || config.position === 'camera') {
        (light as THREE.SpotLight).target.position.set(
          config.target?.x || 0,
          config.target?.y || 0,
          config.target?.z || 0,
        );
      }
      if (config.castShadow) {
        (light as THREE.SpotLight).castShadow = true;
        if (config.shadow) {
          (light as THREE.SpotLight).shadow.mapSize.width = config.shadow.mapSize.width;
          (light as THREE.SpotLight).shadow.mapSize.height = config.shadow.mapSize.height;
          (light as THREE.SpotLight).shadow.camera.near = config.shadow.camera.near;
          (light as THREE.SpotLight).shadow.camera.far = config.shadow.camera.far;
        }
      }
      break;
    default:
      throw new Error('Unknown light type');
  }

  return light;
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
    fogSettings,
    lights,
    highlightedAltitude,
    selectedId,
    collapseColorScaleByDefault,
  } = props;
  const [globeReady, setGlobeReady] = useState(false);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);

  const [showLegend, setShowLegend] = useState(
    collapseColorScaleByDefault === undefined ? !(width < 680) : !collapseColorScaleByDefault,
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseOverData, setMouseOverData] = useState<ChoroplethMapDataType | undefined>(undefined);
  const colorScale = categorical
    ? scaleOrdinal<number | string, string>().domain(colorDomain).range(colors)
    : scaleThreshold<number, string>()
        .domain(colorDomain as number[])
        .range(colors);
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = enableZoom;
    }
  }, [enableZoom]);
  useEffect(() => {
    if (globeEl.current) {
      if (mouseOverData || selectedId) {
        globeEl.current.controls().autoRotate = false;
      } else {
        globeEl.current.controls().autoRotate = autoRotate === 0 ? false : true;
        globeEl.current.controls().autoRotateSpeed = autoRotate;
      }
    }
  }, [mouseOverData, selectedId, autoRotate]);
  useEffect(() => {
    if (globeEl.current && selectedId) {
      const selectedPolygon = polygonData.find(
        (d: any) => d.properties[mapProperty] === selectedId,
      );
      const [lng, lat] = getCentroidCoordinates(selectedPolygon);
      globeEl.current.pointOfView({ lat, lng, altitude: scale }, 1000);
    }
  }, [selectedId, scale, polygonData, mapProperty]);

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
    new THREE.MeshBasicMaterial({
      color: '#FFF',
    });
  const setupCustomLighting = useCallback(() => {
    if (!globeEl.current) return;

    const scene = globeEl.current.scene();
    const camera = globeEl.current.camera();

    let lightsAndObjToRemove: THREE.Object3D[] = [];
    scene.traverse(obj => {
      if (obj instanceof THREE.Light) {
        lightsAndObjToRemove.push(obj);
      }
    });
    lightsAndObjToRemove = [...lightsAndObjToRemove, ...camera.children];
    lightsAndObjToRemove.forEach(light => light.parent?.remove(light));

    const lightConfig = lights.map(config => createLightFromConfig(config));
    lightConfig.forEach((light, i) => {
      if (lights[i].type !== 'ambient' && lights[i].position === 'camera') {
        camera.add(light);
        if (lights[i].type !== 'point') {
          camera.add((light as THREE.DirectionalLight | THREE.SpotLight).target);
        }
      } else {
        scene.add(light);
      }
    });

    if (fogSettings) {
      scene.fog = new THREE.Fog(fogSettings.color, fogSettings.near, fogSettings.far);
    }
  }, [lights, fogSettings]);

  const handleGlobeReady = useCallback(() => {
    setGlobeReady(true);
    setupCustomLighting();
  }, [setupCustomLighting]);
  useEffect(() => {
    if (globeReady) {
      setupCustomLighting();
    }
  }, [globeReady, setupCustomLighting]);
  return (
    <div className='relative'>
      <Globe
        ref={globeEl}
        height={height}
        width={width}
        globeOffset={globeOffset}
        lineHoverPrecision={0}
        polygonsData={polygonData}
        polygonAltitude={(polygon: any) =>
          highlightedIds.includes(polygon?.properties?.[mapProperty]) ||
          polygon?.properties?.[mapProperty] === selectedId
            ? highlightedAltitude * (polygon?.properties?.[mapProperty] === selectedId ? 2 : 1)
            : polygon?.properties?.[mapProperty] === mouseOverData?.id ||
                polygon?.properties?.[mapProperty] === mouseClickData?.id
              ? highlightedAltitude
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
          return highlightedIds.includes(polygon?.properties?.[mapProperty]) ||
            polygon?.properties?.[mapProperty] === selectedId
            ? color
            : 'rgba(100,100,100,0)';
        }}
        polygonStrokeColor={(polygon: any) =>
          polygon?.properties?.[mapProperty] === mouseOverData?.id
            ? hoverStrokeColor
            : mapBorderColor
        }
        onGlobeClick={() => {
          setMouseClickData(undefined);
        }}
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
              lat: centerLat,
              lng: centerLng,
            });
            const scene = globeEl.current.scene();
            setTimeout(() => {
              const polygons = scene.children[3]?.children[0]?.children[4]?.children || [];
              polygons.forEach(d => {
                const line = d.children[1];
                line.renderOrder = 2;
              });
            }, 300);
            const camera = globeEl.current.camera();
            scene.add(camera);
            handleGlobeReady();
          }
        }}
      />
      {showColorScale === false ? null : (
        <div className='absolute left-4 bottom-4'>
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
                style={{
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
              <div className='show-color-legend-button items-start text-sm font-medium cursor-pointer p-2 mb-0 flex text-primary-black dark:text-primary-gray-300 bg-primary-gray-300 dark:bg-primary-gray-600 border-primary-gray-400 dark:border-primary-gray-500'>
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
