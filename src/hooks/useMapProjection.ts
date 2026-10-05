import centerOfMass from '@turf/center-of-mass';
import {
  type GeoProjection,
  geoBounds,
  geoEqualEarth,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
} from 'd3-geo';
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

const projections: Record<MapProjectionTypes, () => GeoProjection> = {
  mercator: geoMercator,
  naturalEarth: geoNaturalEarth1,
  orthographic: geoOrthographic,
  equalEarth: geoEqualEarth,
};

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
  const isZoomingToHighlights =
    zoomAndCenterByHighlightedIds && !!mapProperty && highlightedIds.length > 0;
  const filteredMapData = {
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
  };

  const center = centerOfMass(filteredMapData).geometry.coordinates as [number, number];
  let rotate = projectionRotate;
  if (isZoomingToHighlights) {
    const [[west, _south], [east, _north]] = geoBounds(filteredMapData);
    const midLon = center[0];
    const midLat = center[1];
    if (mapProjection === 'orthographic') {
      rotate = [-midLon, -midLat];
    } else if (west > east) {
      rotate = [-midLon, 0];
    }
  }

  const projection = (projections[mapProjection] ?? geoEqualEarth)()
    .rotate(rotate)
    .fitSize([width, height], filteredMapData);
  const cx = width / 2;
  const cy = height / 2;
  const [tx, ty] = projection.translate();
  projection
    .scale(projection.scale() * scale)
    .translate([cx + (tx - cx) * scale, cy + (ty - cy) * scale]);

  if (centerPoint) {
    const p = projection(centerPoint);
    if (p) {
      const [tx2, ty2] = projection.translate();
      projection.translate([tx2 + cx - p[0], ty2 + cy - p[1]]);
    }
  }

  return { projection };
}
