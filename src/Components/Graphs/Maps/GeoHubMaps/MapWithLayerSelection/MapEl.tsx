import { useRef, useEffect, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import React from 'react';

import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { filterData } from '@/Utils/transformData/filterData';
import { string2HTML } from '@/Utils/string2HTML';
import { X } from '@/Components/Icons';
import { GraphArea } from '@/Components/Elements/GraphContainer';

interface Props {
  mapStyle: string;
  center?: [number, number];
  zoomLevel?: number;
  selectedLayer: string[];
  layerIdList: string[];
  excludeLayers: string[];
  mapLegend?: string | React.ReactNode;
}

export function MapEl(props: Props) {
  const { mapStyle, center, zoomLevel, selectedLayer, layerIdList, excludeLayers, mapLegend } =
    props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapStyleData, setMapStyleData] = useState<any>(undefined);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth || 620);
      setSvgHeight(entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    if (mapContainer.current && svgWidth && !mapRef.current) {
      fetchAndParseJSON(mapStyle).then(d => {
        setMapStyleData(d);
        const mapDiv = select(mapContainer.current);
        mapDiv.selectAll('div').remove();
        const protocol = new pmtiles.Protocol();
        maplibreGl.addProtocol('pmtiles', protocol.tile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapObj: any = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          container: mapContainer.current as any,
          style: {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
                ],
              },
            ]),
          },
          attributionControl: true,
        };
        if (center) {
          mapObj.center = center;
        }
        if (zoomLevel) {
          mapObj.zoom = zoomLevel;
        }
        mapRef.current = new maplibreGl.Map(mapObj);
        mapRef.current.addControl(
          new maplibreGl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true,
          }),
          'bottom-right',
        );
        mapRef.current.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      });
    }
  }, [svgWidth, center, zoomLevel, layerIdList, mapStyle, excludeLayers, selectedLayer]);
  useEffect(() => {
    if (mapRef.current) {
      if (mapStyleData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapStyleObj: any = {
          ...mapStyleData,
          layers: filterData(mapStyleData.layers, [
            {
              column: 'id',
              excludeValues: [
                ...excludeLayers,
                ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
              ],
            },
          ]),
        };
        mapRef.current.setStyle(mapStyleObj);
      } else
        fetchAndParseJSON(mapStyle).then(d => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapStyleObj: any = {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter(el => selectedLayer.indexOf(el) === -1),
                ],
              },
            ]),
          };
          mapRef.current.setStyle(mapStyleObj);
        });
    }
  }, [excludeLayers, layerIdList, mapStyle, mapStyleData, selectedLayer]);
  return (
    <GraphArea ref={graphDiv}>
      {svgWidth && svgHeight ? (
        <div
          style={{
            width: svgWidth,
            height: svgHeight,
          }}
        >
          <div ref={mapContainer} className='map maplibre-show-control w-full h-full' />
          {mapLegend ? (
            <div className='absolute left-[22px] bottom-13'>
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
                    dangerouslySetInnerHTML={
                      typeof mapLegend === 'string' ? { __html: string2HTML(mapLegend) } : undefined
                    }
                  >
                    {React.isValidElement(mapLegend) ? mapLegend : null}
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
          ) : null}
        </div>
      ) : null}
    </GraphArea>
  );
}
