import maplibreGl from 'maplibre-gl';
import * as pmtiles from 'pmtiles';
import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { select } from 'd3-selection';
import React from 'react';
import { GraphArea } from '@/Components/Elements/GraphContainer';
import {
  LegendCollapseButton,
  LegendExpandButton,
} from '@/Components/Elements/LegendExpandControls';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';
import { string2HTML } from '@/Utils/string2HTML';
import { filterData } from '@/Utils/transformData/filterData';

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
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const [mapStyleData, setMapStyleData] = useState<any>(undefined);
  const graphDiv = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: undefined data type
  const mapRef = useRef<any>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
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
      fetchAndParseJSON(mapStyle).then((d) => {
        setMapStyleData(d);
        const mapDiv = select(mapContainer.current);
        mapDiv.selectAll('div').remove();
        const protocol = new pmtiles.Protocol();
        maplibreGl.addProtocol('pmtiles', protocol.tile);
        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
        const mapObj: any = {
          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
          container: mapContainer.current as any,
          style: {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter((el) => selectedLayer.indexOf(el) === -1),
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
        // biome-ignore lint/suspicious/noExplicitAny: undefined data type
        const mapStyleObj: any = {
          ...mapStyleData,
          layers: filterData(mapStyleData.layers, [
            {
              column: 'id',
              excludeValues: [
                ...excludeLayers,
                ...layerIdList.filter((el) => selectedLayer.indexOf(el) === -1),
              ],
            },
          ]),
        };
        mapRef.current.setStyle(mapStyleObj);
      } else
        fetchAndParseJSON(mapStyle).then((d) => {
          // biome-ignore lint/suspicious/noExplicitAny: undefined data type
          const mapStyleObj: any = {
            ...d,
            layers: filterData(d.layers, [
              {
                column: 'id',
                excludeValues: [
                  ...excludeLayers,
                  ...layerIdList.filter((el) => selectedLayer.indexOf(el) === -1),
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
                  <LegendCollapseButton setExpanded={setShowLegend} />
                  <div
                    className='color-legend-box p-2 bg-surface-sm/70'
                    // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: Allow setInnerHTML here
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Allow setInnerHTML here
                    dangerouslySetInnerHTML={
                      typeof mapLegend === 'string' ? { __html: string2HTML(mapLegend) } : undefined
                    }
                  >
                    {React.isValidElement(mapLegend) ? mapLegend : null}
                  </div>
                </>
              ) : (
                <LegendExpandButton setExpanded={setShowLegend} />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </GraphArea>
  );
}
