import rewind from '@turf/rewind';
import type { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';
import type { Topology } from 'topojson-specification';
import { convertTopoJsonToGeoJson, convertTopoJsonUrlToGeoJson } from '@/Utils';
import { detectGeoFormat } from '@/Utils/detectGeoFormat';
import { fetchAndParseJSON } from '@/Utils/fetchAndParseData';

const BASE_URL =
  'https://raw.githubusercontent.com/UNDP-Data/dv-country-geojson/refs/heads/main/Topojson_Map_Border';

export function useMapShapeData(
  mapData?: FeatureCollection | Topology | string,
  overlayMapData?: FeatureCollection | Topology | string,
  rewindCoordinatesInMapData?: boolean,
  showCostalBorder?: boolean,
  showUNBorder?: boolean,
) {
  const [mapShape, setMapShape] = useState<FeatureCollection | undefined>(undefined);
  const [mapBorderShape, setMapBorderShape] = useState<FeatureCollection | undefined>(undefined);
  const [overlayMapShape, setOverlayMapShape] = useState<FeatureCollection | undefined>(undefined);
  const hasMapData = !!mapData;
  useEffect(() => {
    if (typeof mapData !== 'string' && mapData) {
      const geoJson =
        detectGeoFormat(mapData) === 'geojson'
          ? (mapData as FeatureCollection)
          : convertTopoJsonToGeoJson(mapData as Topology);
      setMapShape(
        rewindCoordinatesInMapData
          ? (rewind(geoJson, { reverse: true }) as FeatureCollection)
          : geoJson,
      );
      return;
    }
    let cancelled = false;
    const fetchData = mapData
      ? fetchAndParseJSON(mapData)
      : convertTopoJsonUrlToGeoJson(`${BASE_URL}/country_area.json`, 'BNDA_simplified_wgs84');
    fetchData
      .then((d) => {
        if (!cancelled) {
          const geoJson =
            detectGeoFormat(d) === 'geojson'
              ? (d as FeatureCollection)
              : convertTopoJsonToGeoJson(d as Topology);
          setMapShape(
            rewindCoordinatesInMapData
              ? (rewind(geoJson, { reverse: true }) as FeatureCollection)
              : geoJson,
          );
        }
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load map data', err);
      });
    return () => {
      cancelled = true;
    };
  }, [mapData, rewindCoordinatesInMapData]);
  useEffect(() => {
    if (hasMapData && !showUNBorder) {
      setMapBorderShape(undefined);
      return;
    }
    let cancelled = false;
    convertTopoJsonUrlToGeoJson(
      `${BASE_URL}/${showCostalBorder ? 'country_border_all' : 'country_border_inland'}.json`,
      'BNDL_simplified_wgs84',
    )
      .then((d) => {
        if (!cancelled) setMapBorderShape(d as FeatureCollection);
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load map border data', err);
      });
    return () => {
      cancelled = true;
    };
  }, [hasMapData, showCostalBorder, showUNBorder]);
  useEffect(() => {
    if (!overlayMapData) {
      setOverlayMapShape(undefined);
      return;
    }
    if (typeof overlayMapData !== 'string') {
      const geoJson =
        detectGeoFormat(overlayMapData) === 'geojson'
          ? (overlayMapData as FeatureCollection)
          : convertTopoJsonToGeoJson(overlayMapData as Topology);
      setOverlayMapShape(
        rewindCoordinatesInMapData
          ? (rewind(geoJson, { reverse: true }) as FeatureCollection)
          : geoJson,
      );
      return;
    }
    let cancelled = false;
    const fetchData = fetchAndParseJSON(overlayMapData);
    fetchData
      .then((d) => {
        if (!cancelled) {
          const geoJson =
            detectGeoFormat(d) === 'geojson'
              ? (d as FeatureCollection)
              : convertTopoJsonToGeoJson(d as Topology);
          setOverlayMapShape(
            rewindCoordinatesInMapData
              ? (rewind(geoJson, { reverse: true }) as FeatureCollection)
              : geoJson,
          );
        }
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load overlay map data', err);
      });
    return () => {
      cancelled = true;
    };
  }, [overlayMapData, rewindCoordinatesInMapData]);

  return { mapShape, mapBorderShape, overlayMapShape };
}
