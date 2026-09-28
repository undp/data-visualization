import bbox from '@turf/bbox';
import { centerOfMass } from '@turf/center-of-mass';
import { geoEqualEarth, geoMercator, geoNaturalEarth1, geoOrthographic } from 'd3-geo';
import type { MapProjectionTypes } from '@/Types';

interface useMapProjectionOptions {
  mapData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  zoomAndCenterByHighlightedIds?: boolean;
  highlightedIds?: string[];
  mapProperty?: string;
  width: number;
  height: number;
  mapProjection: MapProjectionTypes;
  scale: number;
  centerPoint?: [number, number];
  projectionRotate: [number, number] | [number, number, number];
}

export function useMapProjection({
  mapData,
  mapProperty,
  zoomAndCenterByHighlightedIds = false,
  highlightedIds = [],
  width,
  height,
  mapProjection,
  scale,
  centerPoint,
  projectionRotate,
}: useMapProjectionOptions) {
  const bounds = bbox({
    ...mapData,
    features:
      zoomAndCenterByHighlightedIds && mapProperty
        ? mapData.features.filter(
            // biome-ignore lint/suspicious/noExplicitAny: undefined data type
            (d: any) =>
              highlightedIds.length === 0 ||
              highlightedIds?.indexOf(d.properties[mapProperty]) !== -1,
          )
        : mapData.features,
  });

  const center = centerOfMass({
    ...mapData,
    features:
      zoomAndCenterByHighlightedIds && mapProperty
        ? mapData.features.filter(
            // biome-ignore lint/suspicious/noExplicitAny: undefined data type
            (d: any) =>
              highlightedIds.length === 0 ||
              highlightedIds?.indexOf(d.properties[mapProperty]) !== -1,
          )
        : mapData.features,
  });
  const lonDiff = (bounds[2] - bounds[0]) * 1.15;
  const latDiff = (bounds[3] - bounds[1]) * 1.15;
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
          : geoEqualEarth()
              .rotate(projectionRotate)
              .center(centerPoint || (center.geometry.coordinates as [number, number]))
              .translate([width / 2, height / 2])
              .scale(scaleVar);
  return { projection };
}
