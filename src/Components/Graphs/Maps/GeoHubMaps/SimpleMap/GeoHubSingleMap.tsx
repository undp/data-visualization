import { useRef, useEffect, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import React from 'react';

import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { filterData } from '@/Utils/transformData/filterData';
import { X } from '@/Components/Icons';
import { string2HTML } from '@/Utils/string2HTML';

interface Props {
  mapStyle: string;
  center?: [number, number];
  zoomLevel?: number;
  width?: number;
  height?: number;
  relativeHeight?: number;
  minHeight: number;
  mapLegend?: string | React.ReactNode;
  includeLayers: string[];
  excludeLayers: string[];
}

export function GeoHubSingleMap(props: Props) {
  const {
    mapStyle,
    height,
    width,
    relativeHeight,
    center,
    zoomLevel,
    minHeight,
    includeLayers,
    excludeLayers,
    mapLegend,
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);
  useEffect(() => {
    if (mapContainer.current && svgWidth) {
      fetchAndParseJSON(mapStyle).then(d => {
        const mapDiv = select(mapContainer.current);
        mapDiv.selectAll('div').remove();
        const protocol = new pmtiles.Protocol();
        maplibreGl.addProtocol('pmtiles', protocol.tile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapObj: any = {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          container: mapContainer.current as any,
          style:
            includeLayers.length === 0 && excludeLayers.length === 0
              ? d
              : {
                  ...d,
                  layers: filterData(d.layers, [
                    {
                      column: 'id',
                      includeValues: includeLayers,
                      excludeValues: excludeLayers,
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
        const map = new maplibreGl.Map(mapObj);
        map.addControl(
          new maplibreGl.NavigationControl({
            visualizePitch: true,
            showZoom: true,
            showCompass: true,
          }),
          'bottom-right',
        );
        map.addControl(new maplibreGl.ScaleControl(), 'bottom-left');
      });
    }
  }, [svgWidth, mapStyle, center, zoomLevel, includeLayers, excludeLayers]);
  return (
    <div
      className='flex flex-col grow justify-center leading-0'
      ref={graphDiv}
      aria-label='Map area'
    >
      {(width || svgWidth) && (height || svgHeight) ? (
        <div
          style={{
            width: width || svgWidth,
            height: Math.max(
              minHeight,
              height ||
                (relativeHeight
                  ? minHeight
                    ? (width || svgWidth) * relativeHeight > minHeight
                      ? (width || svgWidth) * relativeHeight
                      : minHeight
                    : (width || svgWidth) * relativeHeight
                  : svgHeight),
            ),
          }}
        >
          <div
            ref={mapContainer}
            className='map maplibre-show-control'
            style={{ width: '100%', height: '100%' }}
          />
          {mapLegend ? (
            <div className='absolute left-[22px] bottom-13'>
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
                    }}
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
                  <div className='items-start text-sm font-medium cursor-pointer p-2 mb-0 flex text-primary-black dark:text-primary-gray-300 bg-primary-gray-300 dark:bg-primary-gray-550 border-primary-gray-400 dark:border-primary-gray-500'>
                    Show Legend
                  </div>
                </button>
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
